# Expanders360 Task - NestJS Application

A comprehensive enterprise-grade NestJS application with JWT authentication, intelligent project-vendor matching, cross-database analytics, and automated scheduling. Built with TypeScript, PostgreSQL, MongoDB, Redis, and MinIO.

## 🚀 Features

### ✅ **Authentication & Authorization**

- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Client)
- Secure password hashing with bcrypt
- Protected routes with guards and decorators

### ✅ **Intelligent Project-Vendor Matching**

- **Smart Algorithm**: Country + Service overlap + SLA scoring
- **Scoring Formula**: `(services_overlap × 2) + rating + SLA_weight`
- **Idempotent Operations**: Upsert logic for match rebuilding
- **Real-time Notifications**: Email alerts for new matches

### ✅ **Cross-Database Analytics**

- **MySQL Analytics**: Top vendors per country (30-day avg scores)
- **MongoDB Integration**: Research document counts by region
- **Service Layer Joins**: Cross-database query optimization
- **Performance Metrics**: Vendor SLA tracking and reporting

### ✅ **Automated Operations**

- **Scheduled Jobs**: Daily match refresh, SLA monitoring
- **Email Notifications**: SMTP/Mock service with HTML templates
- **Background Processing**: Bull queues with Redis
- **Health Monitoring**: Automated system checks

### ✅ **Database Architecture**

- **PostgreSQL**: Relational data (Users, Projects, Vendors, Matches)
- **MongoDB**: Document storage (Research Documents with full-text search)
- **Redis**: Caching and queue management
- **MinIO**: S3-compatible file storage

### ✅ **Enterprise Features**

- **Multi-tenant ready**: Client isolation and data security
- **API Documentation**: OpenAPI/Swagger with authentication
- **Production deployment**: Docker, Kubernetes, Nginx configs
- **Monitoring**: Health checks, logging, error handling

## 🛠️ Quick Start

### **Option 1: Automated Deployment (Recommended)**

```bash
git clone <repository>
cd expanders360-task
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# Deploy with automated script
./scripts/deploy.sh development
```

### **Option 2: Manual Setup**

```bash
# 1. Install dependencies
npm install

# 2. Environment configuration
cp .env.example .env
# Edit .env file with your configuration

# 3. Start services
docker compose up -d

# 4. Run migrations and seed data
npm run migration:run
npm run seed:data

# 5. Start development server
npm run start:dev
```

### **✅ Verify Installation**

- **Application**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health
- **Database Admin**: http://localhost:8080 (adminer)
- **MongoDB Admin**: http://localhost:8081 (admin/admin)

### **🔐 Test Credentials**

- **Admin**: `admin@expanders360.com` / `password123`
- **Client**: `john.smith@techcorp.com` / `password123`

## 🏗️ Architecture

### **Database Schema (PostgreSQL/MySQL)**

```sql
-- Core Entities
users (id, name, email, password, role, status, created_at, updated_at)
countries (id, name, code, iso_code, longitude, latitude, created_at)
projects (id, client_id, country_id, needed_services[], budget, status, created_at)
vendors (id, name, offered_services[], rating, response_sla_hours)
matches (id, project_id, vendor_id, score, created_at)

-- Junction Tables
vendor_supported_countries (vendor_id, country_id)
```

### **Document Schema (MongoDB)**

```javascript
ResearchDocument {
  title: String,
  description: String,
  content: String,
  tags: [String],
  projectId: Number,
  fileUrl: String,
  metadata: {
    fileSize: Number,
    mimeType: String,
    originalName: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **🧠 Intelligent Matching Algorithm**

```typescript
// Sophisticated multi-factor scoring
Score = (ServiceOverlap × 2) + VendorRating + SLAWeight + CountryMatch

// Where:
ServiceOverlap = count(project.services ∩ vendor.services)
VendorRating = vendor.rating (0-5)
SLAWeight = max(0, 3 - (vendor.slaHours / 24))
CountryMatch = project.country ∈ vendor.supportedCountries ? 1 : 0
```

### **🔄 Background Processing**

```typescript
// Scheduled Jobs (CRON)
@Cron('0 2 * * *') // Daily at 2 AM
async refreshActiveProjectMatches()

@Cron('0 3 * * *') // Daily at 3 AM
async checkVendorSLAViolations()

@Cron('0 * * * *') // Every hour
async performHealthChecks()
```

## 📚 API Documentation

### **🔑 Authentication**

All endpoints require JWT token (except auth endpoints):

```bash
Authorization: Bearer <jwt_token>
```

### **🎯 Core Endpoints**

#### **Authentication**

```bash
# Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "admin@expanders360.com",
  "password": "password123"
}

# Register (Admin only)
POST /api/auth/register
Authorization: Bearer <admin_token>
{
  "name": "New User",
  "email": "user@company.com",
  "password": "password123",
  "role": "client"
}
```

#### **Project Management**

```bash
# List projects (filtered by client)
GET /api/projects?page=1&limit=10

# Create project
POST /api/projects
{
  "countryId": 1,
  "neededServices": ["market_research", "legal_services"],
  "budget": 50000
}

# Rebuild vendor matches (CORE FEATURE)
POST /api/projects/:id/matches/rebuild
# Returns: { matches: [...], totalMatches: 5, message: "..." }
```

#### **Analytics (Admin Only)**

```bash
# Cross-database analytics (CORE FEATURE)
GET /api/analytics/top-vendors
# Returns top 3 vendors per country + research doc counts

# Vendor performance metrics
GET /api/analytics/vendor-performance/:vendorId?days=30
```

#### **Vendors**

```bash
# List vendors with filtering
GET /api/vendors?filters[supportedCountryId]=1&filters[offeredServices]=legal_services

# Vendor details
GET /api/vendors/:id
```

#### **Research Documents**

```bash
# Upload document (with file)
POST /api/research-documents
Content-Type: multipart/form-data

# Search documents
GET /api/research-documents/search?q=market&tags=analysis&projectId=1
```

## 🌐 Development Environment

### **Local Services (Docker)**

| Service            | URL                            | Credentials              |
| ------------------ | ------------------------------ | ------------------------ |
| **Application**    | http://localhost:3000          | -                        |
| **API Docs**       | http://localhost:3000/api/docs | -                        |
| **Database Admin** | http://localhost:8080          | postgres/postgres        |
| **MongoDB Admin**  | http://localhost:8081          | admin/admin              |
| **MinIO Console**  | http://localhost:9001          | minioadmin/minioadmin123 |
| **PostgreSQL**     | localhost:5432                 | postgres/postgres        |
| **MongoDB**        | localhost:27017                | admin/admin_password     |
| **Redis**          | localhost:6379                 | -                        |

### **🔧 Available Scripts**

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger
npm run build             # Build for production

# Database
npm run migration:run     # Run migrations
npm run migration:revert  # Revert last migration
npm run seed:data         # Seed test data

# Testing
npm run test             # Unit tests
npm run test:e2e         # End-to-end tests
npm run test:cov         # Coverage report
node test-endpoints.js   # API integration tests

# Production
./scripts/deploy.sh production  # Production deployment
```

## ⚙️ Environment Configuration

### **Required Environment Variables**

```bash
# Application
NODE_ENV=development|production
APP_PORT=3000
APP_HOST=localhost

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=expanders360
DB_SSL=false

# MongoDB
MONGO_URI=mongodb://admin:admin_password@localhost:27017/expanders360?authSource=admin

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Email (Optional - Mock service if not provided)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@expanders360.com

# Storage (MinIO/S3)
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET_NAME=research-documents
```

## 🚀 Production Deployment

### **Option 1: Docker Compose (Recommended)**

```bash
# Production deployment
./scripts/deploy.sh production

# Or manually
docker compose -f docker-compose.prod.yml up -d
```

### **Option 2: Kubernetes**

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/deployment.yml

# Scale application
kubectl scale deployment expanders360-app --replicas=5 -n expanders360
```

### **Option 3: Manual Build**

```bash
# Build application
npm run build

# Start production server
NODE_ENV=production npm run start:prod
```

## 🧪 Testing

### **Automated Testing**

```bash
# Run all tests
npm run test

# API Integration Tests
node test-endpoints.js

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

### **Manual Testing**

- **Swagger UI**: http://localhost:3000/api/docs
- **Test credentials** provided in Quick Start section
- **Postman Collection**: Available in `/docs` folder

## 📊 Monitoring & Logging

### **Health Checks**

- **Application**: `/api/health`
- **Database**: Automatic health checks in Docker
- **Scheduled Jobs**: Automatic SLA and system monitoring

### **Logging**

- **Development**: Console with colors
- **Production**: File-based logging in `/app/logs`
- **Error Tracking**: Structured error logging with stack traces

## 🔒 Security Features

- **JWT Authentication** with secure secret rotation
- **Password Hashing** with bcrypt (10 rounds)
- **Role-based Access Control** (Admin/Client)
- **Input Validation** with class-validator
- **Rate Limiting** via Nginx (production)
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers

## 📈 Performance Optimizations

- **Database Indexing** on frequently queried fields
- **Redis Caching** for session and query caching
- **Background Jobs** for heavy operations
- **Pagination** for large data sets
- **Compression** (gzip) for API responses
- **Connection Pooling** for database connections

## 🆘 Troubleshooting

### **Common Issues**

```bash
# Database connection issues
docker compose logs postgres
docker compose restart postgres

# Application startup issues
docker compose logs app
npm run start:dev  # Check local logs

# Migration failures
npm run migration:revert
npm run migration:run

# Clear all data and restart
docker compose down -v
./scripts/deploy.sh development
```

### **Debug Mode**

```bash
# Start with debugger
npm run start:debug

# View all logs
docker compose logs -f

# Check specific service
docker compose exec app sh
```

## 📄 License

**Private** - Expanders360 Task Implementation

---

## 🏆 Implementation Summary

✅ **Project-Vendor Matching** with intelligent scoring algorithm  
✅ **Cross-Database Analytics** joining MySQL + MongoDB  
✅ **Email Notifications** with SMTP/Mock service  
✅ **Scheduled Jobs** for automation and monitoring  
✅ **Production-Ready** with Docker, Kubernetes, Nginx  
✅ **Comprehensive Testing** with automated test suites

**Ready for production deployment!** 🚀
