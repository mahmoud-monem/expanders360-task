# Expanders360 Task - NestJS Application

A comprehensive NestJS application with JWT authentication, project-vendor matching, analytics, and cross-database operations using MySQL and MongoDB.

## Features

### ✅ Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Client)
- Secure password hashing with bcrypt
- Protected routes with guards

### ✅ Database Architecture

- **MySQL**: Relational data (Users, Clients, Projects, Vendors, Matches)
- **MongoDB**: Document storage (Research Documents)
- TypeORM for MySQL with snake_case naming strategy
- Mongoose for MongoDB with schema validation

### ✅ Core Entities

- **Users**: Authentication with roles (admin/client)
- **Clients**: Companies with contact information
- **Projects**: Client projects with services needed and budget
- **Vendors**: Service providers with ratings and SLA
- **Matches**: Algorithmic project-vendor matching with scores
- **Research Documents**: MongoDB documents linked to projects

### ✅ Business Logic

- **Intelligent Matching Algorithm**:
  - Country coverage validation
  - Service overlap calculation
  - SLA-weighted scoring formula
  - Idempotent upsert operations
- **Cross-Database Analytics**: Top vendors per country with document counts
- **Email Notifications**: Automated match notifications
- **Scheduled Jobs**: Daily match refresh and SLA monitoring

### ✅ API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /clients` - List clients (Admin only)
- `GET /projects` - List projects
- `GET /vendors` - List vendors (Admin only)
- `POST /projects/:id/matches/rebuild` - Rebuild vendor matches
- `GET /analytics/top-vendors` - Cross-DB analytics
- `POST /research-documents` - Upload documents
- `POST /research-documents/search` - Search documents

### ✅ DevOps & Deployment

- Dockerized with MySQL, MongoDB, and Redis
- Database management UIs (PHPMyAdmin, Mongo Express)
- Health check endpoints
- Production-ready configuration
- Environment-based configuration

## Quick Start

### 1. Clone and Install

```bash
git clone <repository>
cd expanders360-task
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Docker Deployment

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs app
```

### 4. Database Setup

```bash
# Run migrations
npm run migration:run

# (Optional) Seed data
npm run seed
```

### 5. Development Mode

```bash
# Start in development
npm run start:dev

# Run tests
npm run test
```

## Architecture

### Database Schema (MySQL)

```sql
users (id, name, email, password, role)
clients (id, company_name, contact_email)
projects (id, client_id, country, services_needed[], budget, status)
vendors (id, name, countries_supported[], services_offered[], rating, response_sla_hours)
matches (id, project_id, vendor_id, score, created_at)
```

### Document Schema (MongoDB)

```javascript
ResearchDocument {
  title: String,
  content: String,
  tags: [String],
  projectId: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Matching Algorithm

The vendor matching system uses a sophisticated scoring algorithm:

```
Score = (Services Overlap × 2) + Vendor Rating + SLA Weight

Where:
- Services Overlap: Number of matching services
- Vendor Rating: 0-5 rating
- SLA Weight: Based on response time (≤24h=5, ≤48h=3, ≤72h=1, >72h=0)
```

## API Documentation

### Authentication

All endpoints (except auth) require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Example Requests

#### Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "password": "password123",
    "role": "client"
  }'
```

#### Create Project

```bash
curl -X POST http://localhost:3000/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "country": "Germany",
    "servicesNeeded": ["market_research", "legal_services"],
    "budget": 50000,
    "status": "active"
  }'
```

#### Rebuild Matches

```bash
curl -X POST http://localhost:3000/projects/1/matches/rebuild \
  -H "Authorization: Bearer <token>"
```

#### Get Analytics

```bash
curl -X GET http://localhost:3000/analytics/top-vendors \
  -H "Authorization: Bearer <token>"
```

## Services & URLs

When running with Docker:

- **Application**: http://localhost:3000
- **PHPMyAdmin**: http://localhost:8080
- **Mongo Express**: http://localhost:8081 (admin/admin)
- **MySQL**: localhost:3306
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## Scheduled Jobs

- **Daily Match Refresh**: 2:00 AM - Updates matches for active projects
- **SLA Monitoring**: 3:00 AM - Checks vendor response times
- **Health Check**: Every hour - System monitoring

## Configuration

Key environment variables:

```env
# Database
DB_HOST=mysql
DB_USERNAME=expanders_user
DB_PASSWORD=expanders_password
DB_NAME=expanders360

# MongoDB
MONGO_URI=mongodb://admin:admin_password@mongodb:27017/expanders360

# JWT
JWT_SECRET=your-secret-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Production Deployment

1. **Environment**: Set NODE_ENV=production
2. **Secrets**: Use secure JWT_SECRET and database passwords
3. **SSL**: Enable DB_SSL=true for production databases
4. **Monitoring**: Set up logging and monitoring services
5. **Scaling**: Use container orchestration (Kubernetes, Docker Swarm)

## License

Private - Expanders360 Task Implementation
