# RoboLab Backend Setup Guide

## Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 5.0+ ([Download](https://www.mongodb.com/try/download/community))
- **PostgreSQL** 13+ or **Supabase** account ([Supabase](https://supabase.com/))
- **Redis** 6.0+ (Optional, for caching) ([Download](https://redis.io/download))

## Quick Start

### 1. Clone and Install

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

### 3. Database Setup

#### MongoDB Setup (for Products)
```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

#### Supabase Setup (for User Data)
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Get your project URL and API keys
4. Update the `.env` file with your Supabase credentials

#### PostgreSQL Setup (Alternative to Supabase)
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb robolab

# Create user
sudo -u postgres psql
CREATE USER robolab_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE robolab TO robolab_user;
\q
```

### 4. Run Database Migrations

```bash
# Run migrations to set up database tables
npm run migrate
```

### 5. Seed Database (Optional)

```bash
# Add sample data to the database
npm run seed
```

### 6. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

## Environment Variables Explained

### Required Variables

```env
# Server Configuration
PORT=3001                          # Port for the API server
NODE_ENV=development               # Environment (development/production)
CORS_ORIGIN=http://localhost:5173  # Frontend URL for CORS

# Database URLs
MONGODB_URI=mongodb://localhost:27017/robo_lab  # MongoDB connection string
POSTGRES_URL=postgresql://user:pass@localhost:5432/robolab  # PostgreSQL URL

# Supabase Configuration (if using Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
AI_DAILY_LIMIT=10
```

### Optional Variables

```env
# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@robolab.pk

# File Upload
UPLOAD_MAX_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf,application/json

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_key

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key
WEATHER_API_KEY=your_weather_api_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
HEALTH_CHECK_INTERVAL=30000

# Development
DEBUG_MODE=true
ENABLE_SWAGGER=true
ENABLE_CORS=true
```

## Database Schema Setup

### MongoDB Collections (Products)

The MongoDB database will contain the following collections:

- **products** - Component catalog with specifications, pricing, and reviews

### PostgreSQL/Supabase Tables (User Data)

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  circuit_data JSONB,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Circuit designs table
CREATE TABLE circuits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  name TEXT NOT NULL,
  circuit_json JSONB NOT NULL,
  simulation_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI usage tracking
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  usage_date DATE DEFAULT CURRENT_DATE,
  prompts_used INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project collaborations
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Components (MongoDB)
- `GET /api/components` - Get all components with filtering
- `GET /api/components/:id` - Get component by ID
- `GET /api/components/categories` - Get component categories
- `GET /api/components/search` - Search components
- `GET /api/components/:id/reviews` - Get component reviews

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/share` - Share project

### Circuits
- `POST /api/circuits` - Create circuit
- `GET /api/circuits/:id` - Get circuit
- `PUT /api/circuits/:id` - Update circuit
- `DELETE /api/circuits/:id` - Delete circuit
- `POST /api/circuits/:id/simulate` - Simulate circuit
- `POST /api/circuits/:id/export` - Export circuit

### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `GET /api/ai/usage` - Get AI usage stats
- `POST /api/ai/reset-usage` - Reset usage (admin)

### Ideas
- `GET /api/ideas` - Get project ideas
- `POST /api/ideas` - Create idea
- `GET /api/ideas/:id` - Get idea by ID
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/like` - Like idea

### Health
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

## Frontend Integration

### Update Frontend API Calls

Update your frontend to use the new backend API:

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:3001/api';

export const api = {
  // Components
  getComponents: (params?: any) => 
    fetch(`${API_BASE_URL}/components?${new URLSearchParams(params)}`),
  
  getComponentById: (id: string) => 
    fetch(`${API_BASE_URL}/components/${id}`),
  
  // Projects
  getProjects: (params?: any) => 
    fetch(`${API_BASE_URL}/projects?${new URLSearchParams(params)}`),
  
  createProject: (data: any) => 
    fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  // AI Assistant
  chatWithAI: (message: string, projectId?: string) => 
    fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, projectId })
    }),
  
  // Ideas
  getIdeas: (params?: any) => 
    fetch(`${API_BASE_URL}/ideas?${new URLSearchParams(params)}`),
};
```

### Update Environment Variables

Add to your frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Production Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start dist/index.js --name "robolab-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### Environment Variables for Production

Make sure to set these in your production environment:

```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
MONGODB_URI=mongodb://your-mongodb-connection-string
SUPABASE_URL=your-production-supabase-url
SUPABASE_ANON_KEY=your-production-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-supabase-service-role-key
JWT_SECRET=your-very-secure-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network connectivity

2. **Supabase Connection Error**
   - Verify your Supabase URL and keys
   - Check if your Supabase project is active
   - Ensure RLS policies are properly configured

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set and secure
   - Check token expiration settings
   - Verify token format in requests

4. **CORS Issues**
   - Update CORS_ORIGIN in `.env`
   - Check if frontend URL matches exactly
   - Verify CORS middleware configuration

### Logs

Check the logs directory for detailed error information:

```bash
# View error logs
tail -f logs/error.log

# View all logs
tail -f logs/combined.log

# View application logs
tail -f logs/app.log
```

## Support

For issues and questions:

1. Check the logs for error details
2. Verify all environment variables are set correctly
3. Ensure all required services are running
4. Check the API documentation at `/api-docs` when the server is running

## Next Steps

1. **Set up monitoring** - Add Sentry for error tracking
2. **Configure backups** - Set up automated database backups
3. **Add caching** - Implement Redis for better performance
4. **Set up CI/CD** - Automate deployment pipeline
5. **Add tests** - Write comprehensive test suite
6. **Security audit** - Review and harden security settings
