#!/bin/bash

# ==============================================
# EXPANDERS360 TASK - DEPLOYMENT SCRIPT
# ==============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Configuration
ENVIRONMENT=${1:-development}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

log "🚀 Starting deployment for environment: $ENVIRONMENT"

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check environment file
    if [ ! -f ".env" ]; then
        warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            warning "Please update .env with your configuration before proceeding"
            exit 1
        else
            error ".env.example file not found"
            exit 1
        fi
    fi
    
    success "Prerequisites check passed"
}

# Build and start services
deploy_services() {
    log "🐳 Building and starting services..."
    
    # Stop existing services
    docker compose -f $COMPOSE_FILE down || true
    
    # Build and start services
    docker compose -f $COMPOSE_FILE up -d --build
    
    success "Services started"
}

# Wait for services to be healthy
wait_for_services() {
    log "⏳ Waiting for services to be healthy..."
    
    local max_attempts=60
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose -f $COMPOSE_FILE ps | grep -q "unhealthy"; then
            log "Attempt $attempt/$max_attempts - Some services are still starting..."
            sleep 5
            ((attempt++))
        else
            success "All services are healthy"
            return 0
        fi
    done
    
    error "Services failed to become healthy within timeout"
    docker compose -f $COMPOSE_FILE logs
    exit 1
}

# Run database migrations
run_migrations() {
    log "🗄️  Running database migrations..."
    
    # Wait for app container to be ready
    sleep 10
    
    if [ "$ENVIRONMENT" = "development" ]; then
        npm run migration:run
    else
        docker compose -f $COMPOSE_FILE exec app npm run migration:run
    fi
    
    success "Database migrations completed"
}

# Seed database (development only)
seed_database() {
    if [ "$ENVIRONMENT" = "development" ]; then
        log "🌱 Seeding database with test data..."
        
        if [ "$ENVIRONMENT" = "development" ]; then
            npm run seed:data
        else
            docker compose -f $COMPOSE_FILE exec app npm run seed:data
        fi
        
        success "Database seeded"
    fi
}

# Health check
health_check() {
    log "🩺 Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000/api/health &>/dev/null; then
            success "Application is healthy and responding"
            return 0
        fi
        
        log "Attempt $attempt/$max_attempts - Waiting for application..."
        sleep 2
        ((attempt++))
    done
    
    error "Application health check failed"
    exit 1
}

# Display deployment information
show_deployment_info() {
    log "📋 Deployment Information"
    echo ""
    echo "Environment: $ENVIRONMENT"
    echo "Compose File: $COMPOSE_FILE"
    echo ""
    echo "🌐 Service URLs:"
    echo "  • Application: http://localhost:3000"
    echo "  • API Documentation: http://localhost:3000/api/docs"
    
    if [ "$ENVIRONMENT" = "development" ]; then
        echo "  • Database Admin (PostgreSQL): http://localhost:8080"
        echo "  • MongoDB Admin: http://localhost:8081 (admin/admin)"
        echo "  • MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)"
    fi
    
    echo ""
    echo "🔐 Test Credentials (development):"
    echo "  • Admin: admin@expanders360.com / password123"
    echo "  • Client: john.smith@techcorp.com / password123"
    echo ""
    echo "📊 Useful Commands:"
    echo "  • View logs: docker compose -f $COMPOSE_FILE logs -f"
    echo "  • Stop services: docker compose -f $COMPOSE_FILE down"
    echo "  • Restart app: docker compose -f $COMPOSE_FILE restart app"
    echo ""
}

# Main deployment flow
main() {
    check_prerequisites
    deploy_services
    wait_for_services
    run_migrations
    
    if [ "$ENVIRONMENT" = "development" ]; then
        seed_database
    fi
    
    health_check
    show_deployment_info
    
    success "🎉 Deployment completed successfully!"
}

# Handle script interruption
trap 'error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main
