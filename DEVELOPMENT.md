# 🛠️ Developer Guide - Expanders360 Task

This guide provides detailed instructions for developers working on the Expanders360 Task application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Code Structure](#code-structure)
4. [Database Management](#database-management)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Workflows](#deployment-workflows)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)

## 🎯 Prerequisites

### Required Software

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **Docker**: Latest stable version
- **Docker Compose**: v2.x or higher
- **Git**: Latest stable version

### Optional Tools

- **PostgreSQL Client**: For direct database access
- **MongoDB Compass**: For MongoDB administration
- **Postman**: For API testing
- **VS Code**: Recommended IDE with extensions

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.docker",
    "humao.rest-client"
  ]
}
```

## 🚀 Development Setup

### 1. Quick Start

```bash
# Clone and setup
git clone <repository>
cd expanders360-task
npm install

# Environment setup
cp .env.example .env
# Edit .env with your local configuration

# Automated deployment (recommended)
./scripts/deploy.sh development

# Verify setup
npm run health:check
```

### 2. Manual Setup (Alternative)

```bash
# Start infrastructure services
npm run docker:up

# Wait for services to be ready (30-60 seconds)
npm run health:check

# Run database migrations
npm run migration:run

# Seed development data
npm run seed:data

# Start application in development mode
npm run start:dev
```

### 3. Environment Configuration

#### Development (.env)

```bash
NODE_ENV=development
APP_PORT=3000
APP_HOST=localhost

# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=expanders360
DB_SSL=false

# Local MongoDB
MONGO_URI=mongodb://admin:admin_password@localhost:27017/expanders360?authSource=admin

# Development JWT secret
JWT_SECRET=dev-jwt-secret-key

# Optional email (uses mock service if not configured)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Local MinIO
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET_NAME=research-documents
```

## 🏗️ Code Structure

### Module Architecture

```
src/
├── modules/
│   ├── auth/              # Authentication & authorization
│   ├── user/              # User management
│   ├── country/           # Country data
│   ├── project/           # Project management
│   ├── vendor/            # Vendor management
│   ├── match/             # Project-vendor matching
│   ├── analytics/         # Cross-database analytics
│   ├── research-document/ # Document management (MongoDB)
│   ├── notification/      # Email notifications
│   └── scheduler/         # Background jobs
├── common/
│   ├── config/           # Environment configuration
│   ├── decorators/       # Custom decorators
│   ├── dtos/            # Shared DTOs
│   ├── guards/          # Authentication guards
│   ├── interceptors/    # Response interceptors
│   └── services/        # Shared services
└── main.ts              # Application entry point
```

### Key Conventions

- **Modules**: Feature-based organization
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic implementation
- **Repositories**: Database access layer
- **DTOs**: Data transfer objects for validation
- **Entities**: Database models (TypeORM)
- **Schemas**: MongoDB models (Mongoose)

### Naming Conventions

```typescript
// Files
user.controller.ts;
user.service.ts;
user.entity.ts;
create - user.dto.ts;

// Classes
UserController;
UserService;
User;
CreateUserDto;

// Methods
getUserById();
createUser();
updateUserProfile();

// Constants
USER_ROLE;
SERVICE_TYPE;
PROJECT_STATUS;
```

## 🗄️ Database Management

### PostgreSQL (Primary Database)

```bash
# Run migrations
npm run migration:run

# Create new migration
npm run migration:generate src/modules/user/migrations AddUserPreferences

# Revert last migration
npm run migration:revert

# Check migration status
npm run typeorm migration:show
```

### MongoDB (Document Storage)

```bash
# Connect to MongoDB
docker compose exec mongodb mongosh -u admin -p admin_password

# Query research documents
db.researchdocuments.find().pretty()

# Create index
db.researchdocuments.createIndex({ "title": "text", "content": "text" })
```

### Development Data

```bash
# Reset and reseed database
npm run migration:revert
npm run migration:run
npm run seed:data

# Or use deployment script
./scripts/deploy.sh development
```

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Individual functions/methods
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Complete user workflows

### Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e

# API integration tests
npm run test:api
```

### Test Structure

```typescript
// Example unit test
describe("UserService", () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: mockRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      // Test implementation
    });
  });
});
```

### Test Data

```bash
# Use seeded data for testing
npm run seed:data

# Test credentials
Admin: admin@expanders360.com / password123
Client: john.smith@techcorp.com / password123
```

## 🚀 Deployment Workflows

### Development Deployment

```bash
# Full development deployment
./scripts/deploy.sh development

# Manual steps
npm run docker:up
npm run migration:run
npm run seed:data
npm run start:dev
```

### Production Deployment

```bash
# Production deployment
./scripts/deploy.sh production

# Or with Docker Compose
docker compose -f docker-compose.prod.yml up -d

# Kubernetes deployment
kubectl apply -f k8s/
```

### Environment-Specific Configs

- **Development**: `docker-compose.yml`
- **Production**: `docker-compose.prod.yml`
- **Kubernetes**: `k8s/` directory

## 🔧 Common Tasks

### Adding New Features

#### 1. Create New Module

```bash
# Generate module scaffold
nest g module feature-name
nest g controller feature-name
nest g service feature-name

# Add to app.module.ts
imports: [
  // ... existing modules
  FeatureNameModule,
]
```

#### 2. Add Database Entity

```typescript
// Create entity
@Entity()
export class FeatureName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}

// Generate migration
npm run migration:generate src/modules/feature-name/migrations CreateFeatureNameTable

// Run migration
npm run migration:run
```

#### 3. Add API Endpoints

```typescript
@Controller("feature-name")
@ApiTags("Feature Name")
export class FeatureNameController {
  @Get()
  @ApiOperation({ summary: "List features" })
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Create feature" })
  async create(@Body() dto: CreateFeatureDto) {
    return this.service.create(dto);
  }
}
```

### Database Schema Changes

```bash
# 1. Modify entity
# 2. Generate migration
npm run migration:generate src/modules/user/migrations UpdateUserTable

# 3. Review generated migration
# 4. Run migration
npm run migration:run

# 5. Update seed data if needed
npm run seed:data
```

### Adding Scheduled Jobs

```typescript
@Injectable()
export class SchedulerService {
  @Cron("0 0 * * *") // Daily at midnight
  async dailyTask() {
    this.logger.log("Running daily task...");
    // Implementation
  }

  @Interval(60000) // Every minute
  async minutelyTask() {
    // Implementation
  }
}
```

### Email Notifications

```typescript
// In service
constructor(
  private readonly notificationService: NotificationService,
) {}

async createUser(userData: CreateUserDto) {
  const user = await this.userRepository.save(userData);

  // Send welcome email
  await this.notificationService.sendWelcomeEmail(user);

  return user;
}
```

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check if containers are running
docker compose ps

# Restart database
docker compose restart postgres mongodb

# Check logs
docker compose logs postgres
docker compose logs mongodb
```

#### Migration Errors

```bash
# Check migration status
npm run typeorm migration:show

# Revert problematic migration
npm run migration:revert

# Fix migration file and run again
npm run migration:run
```

#### Application Won't Start

```bash
# Check for port conflicts
lsof -i :3000

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat .env

# Start with verbose logging
npm run start:debug
```

#### Test Failures

```bash
# Clear test cache
npm run test -- --clearCache

# Run specific test file
npm run test -- user.service.spec.ts

# Debug test
npm run test:debug
```

### Debug Mode

#### Application Debugging

```bash
# Start with debugger
npm run start:debug

# Attach debugger in VS Code
# Use launch.json configuration
```

#### Database Debugging

```bash
# PostgreSQL
docker compose exec postgres psql -U postgres -d expanders360

# MongoDB
docker compose exec mongodb mongosh -u admin -p admin_password

# Check query logs
docker compose logs postgres | grep QUERY
```

### Performance Monitoring

```bash
# Check application metrics
curl http://localhost:3000/api/health

# Monitor containers
docker stats

# Check logs
npm run docker:logs
```

### Development Tools

#### Database Administration

- **pgAdmin**: http://localhost:8080
- **MongoDB Express**: http://localhost:8081
- **MinIO Console**: http://localhost:9001

#### API Testing

- **Swagger UI**: http://localhost:3000/api/docs
- **Test Script**: `npm run test:api`

#### Useful Commands

```bash
# Quick reset and restart
docker compose down -v && ./scripts/deploy.sh development

# View all logs
npm run docker:logs

# Restart just the app
npm run docker:restart

# Health check
npm run health:check

# Run specific migration
npx typeorm migration:run -d orm/orm-migration.config.ts

# Generate entity from database
npx typeorm-model-generator -d orm/orm.config.ts
```

## 📚 Additional Resources

- **NestJS Documentation**: https://docs.nestjs.com/
- **TypeORM Documentation**: https://typeorm.io/
- **Mongoose Documentation**: https://mongoosejs.com/
- **Docker Documentation**: https://docs.docker.com/

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following conventions
4. Add tests for new functionality
5. Ensure all tests pass: `npm run test`
6. Commit changes: `git commit -m "Add amazing feature"`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open Pull Request

---

**Happy coding!** 🚀 For questions or issues, please check the troubleshooting section or create an issue in the repository.
