# RoboLab Backend Deployment Guide

## Overview

This guide covers deploying the RoboLab backend API to production environments. The backend is designed to work with your existing MongoDB database for products and Supabase for user data.

## Prerequisites

- Node.js 18+ installed
- MongoDB database with product data
- Supabase project for user authentication
- Domain name and SSL certificate
- Server or cloud platform account

## Quick Deployment Options

### Option 1: Railway (Recommended)

Railway provides easy deployment with automatic SSL and database connections.

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
cd backend
railway init
```

4. **Set Environment Variables**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set CORS_ORIGIN=https://your-frontend-domain.com
railway variables set MONGODB_URI=your_mongodb_connection_string
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_ANON_KEY=your_supabase_anon_key
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
railway variables set JWT_SECRET=your_very_secure_jwt_secret
railway variables set OPENAI_API_KEY=your_openai_api_key
```

5. **Deploy**
```bash
railway up
```

### Option 2: Render

1. **Connect GitHub Repository**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Select the backend folder

2. **Configure Build Settings**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Node Version: 18

3. **Set Environment Variables**
   - Add all required environment variables in the Render dashboard

### Option 3: DigitalOcean App Platform

1. **Create New App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub

2. **Configure App**
   - Source: GitHub repository
   - Branch: main
   - Build Command: `cd backend && npm install && npm run build`
   - Run Command: `cd backend && npm start`

3. **Set Environment Variables**
   - Add all required variables in the app settings

### Option 4: AWS EC2 (Manual Setup)

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - t3.medium or larger
   - Configure security groups for ports 22, 80, 443, 3001

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

3. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-username/robolab.git
cd robolab/backend

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start dist/index.js --name "robolab-backend"
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
# /etc/nginx/sites-available/robolab
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable SSL**
```bash
sudo ln -s /etc/nginx/sites-available/robolab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables for Production

Create a `.env.production` file with these variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com

# Database URLs
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/robo_lab?retryWrites=true&w=majority
POSTGRES_URL=postgresql://username:password@host:5432/robolab

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here_make_it_at_least_32_characters
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key
OPENAI_MODEL=gpt-4
AI_DAILY_LIMIT=10

# File Upload
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf,application/json

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Redis Configuration (Optional)
REDIS_URL=redis://your-redis-host:6379
REDIS_PASSWORD=your_redis_password

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@robolab.pk

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
HEALTH_CHECK_INTERVAL=30000

# Development
DEBUG_MODE=false
ENABLE_SWAGGER=true
ENABLE_CORS=true
```

## Database Setup

### MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string

2. **Import Product Data**
```bash
# If you have existing data in JSON format
mongoimport --uri="your_mongodb_connection_string" --collection=products --file=products.json --jsonArray

# Or use MongoDB Compass to import your existing data
```

3. **Create Indexes**
```javascript
// Connect to MongoDB and run these commands
db.products.createIndex({ name: "text", description: "text", tags: "text" })
db.products.createIndex({ category: 1, subcategory: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ rating: -1 })
db.products.createIndex({ inStock: 1 })
db.products.createIndex({ createdAt: -1 })
```

### Supabase Setup

1. **Create Supabase Project**
   - Go to [Supabase](https://supabase.com)
   - Create new project
   - Get project URL and API keys

2. **Run Database Migrations**
```sql
-- Run these SQL commands in Supabase SQL editor

-- User profiles table
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

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_is_public ON projects(is_public);
CREATE INDEX idx_circuits_project_id ON circuits(project_id);
CREATE INDEX idx_ai_usage_user_date ON ai_usage(user_id, usage_date);
CREATE INDEX idx_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (is_public = true);
```

## Frontend Integration

### Update Frontend Environment Variables

Add these to your frontend `.env`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_WS_URL=wss://your-backend-domain.com
```

### Update API Service

The frontend is already configured to use the new API service. Make sure to:

1. Update the `API_BASE_URL` in `src/lib/api.ts` if needed
2. Test all API endpoints
3. Handle authentication properly

## Monitoring and Logging

### Health Checks

The API includes health check endpoints:

- `GET /api/health` - Full health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

### Logging

Logs are written to:
- Console (in development)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)
- `logs/exceptions.log` (uncaught exceptions)

### Monitoring Setup

1. **Uptime Monitoring**
   - Use services like UptimeRobot or Pingdom
   - Monitor the health check endpoint
   - Set up alerts for downtime

2. **Error Tracking**
   - Set up Sentry for error tracking
   - Add Sentry DSN to environment variables

3. **Performance Monitoring**
   - Use APM tools like New Relic or DataDog
   - Monitor database performance
   - Track API response times

## Security Checklist

- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] HTTPS is enabled
- [ ] Database connections are secure
- [ ] API keys are not exposed
- [ ] Logs don't contain sensitive data

## Performance Optimization

1. **Database Optimization**
   - Create proper indexes
   - Use connection pooling
   - Monitor query performance

2. **Caching**
   - Implement Redis caching
   - Cache frequently accessed data
   - Use CDN for static assets

3. **Load Balancing**
   - Use multiple server instances
   - Implement health checks
   - Configure load balancer

## Backup Strategy

1. **Database Backups**
   - MongoDB: Use Atlas automated backups
   - PostgreSQL: Set up automated backups

2. **Application Backups**
   - Backup source code
   - Backup environment variables
   - Backup configuration files

3. **Disaster Recovery**
   - Document recovery procedures
   - Test backup restoration
   - Have rollback plans ready

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check connection strings
   - Verify network access
   - Check firewall settings

2. **CORS Issues**
   - Verify CORS_ORIGIN setting
   - Check frontend URL matches exactly
   - Test with different browsers

3. **Authentication Issues**
   - Verify JWT secret
   - Check token expiration
   - Validate Supabase configuration

4. **Performance Issues**
   - Monitor database queries
   - Check server resources
   - Review error logs

### Debug Mode

Enable debug mode for troubleshooting:

```env
DEBUG_MODE=true
LOG_LEVEL=debug
```

## Scaling

### Horizontal Scaling

1. **Load Balancer**
   - Use AWS ALB, Cloudflare, or similar
   - Configure health checks
   - Set up multiple instances

2. **Database Scaling**
   - Use read replicas for MongoDB
   - Implement connection pooling
   - Consider database sharding

3. **Caching Layer**
   - Implement Redis cluster
   - Cache API responses
   - Use CDN for static content

### Vertical Scaling

1. **Server Resources**
   - Increase CPU and memory
   - Use faster storage (SSD)
   - Optimize application code

2. **Database Resources**
   - Upgrade database tier
   - Increase storage capacity
   - Optimize queries

## Maintenance

### Regular Tasks

1. **Security Updates**
   - Update dependencies regularly
   - Monitor security advisories
   - Apply patches promptly

2. **Performance Monitoring**
   - Review logs weekly
   - Monitor resource usage
   - Optimize slow queries

3. **Backup Verification**
   - Test backups monthly
   - Verify data integrity
   - Update backup procedures

### Updates

1. **Application Updates**
   - Test in staging environment
   - Use blue-green deployment
   - Have rollback plan ready

2. **Database Updates**
   - Test migrations first
   - Backup before changes
   - Monitor during updates

## Support

For deployment issues:

1. Check the logs for error details
2. Verify all environment variables
3. Test database connections
4. Review the troubleshooting section
5. Check the API documentation at `/api-docs`

## Cost Optimization

### Cloud Costs

1. **Right-size Resources**
   - Monitor actual usage
   - Scale down when possible
   - Use reserved instances

2. **Database Costs**
   - Optimize queries
   - Use appropriate storage
   - Consider serverless options

3. **CDN and Storage**
   - Use efficient caching
   - Compress assets
   - Optimize images

This deployment guide should help you get your RoboLab backend running in production. Choose the deployment option that best fits your needs and budget.
