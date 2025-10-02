# RoboLab Backend API

## Overview
This is the backend API for RoboLabPK, a comprehensive hardware innovation platform. The backend provides RESTful APIs, real-time WebSocket connections, and database management for the frontend application.

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (for products) + PostgreSQL (for user data)
- **Authentication**: JWT + Supabase Auth
- **Real-time**: Socket.io
- **File Storage**: Supabase Storage
- **AI Integration**: OpenAI API
- **Validation**: Joi/Zod
- **Documentation**: Swagger/OpenAPI

## Project Structure
```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── types/          # TypeScript types
├── tests/              # Test files
├── docs/               # API documentation
├── scripts/            # Database scripts
├── .env.example        # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables
Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database URLs
MONGODB_URI=mongodb://localhost:27017/robo_lab
POSTGRES_URL=postgresql://username:password@localhost:5432/robolab

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4

# File Storage
UPLOAD_MAX_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (for products)
- PostgreSQL (for user data)
- Redis (for caching and sessions)

### Installation Steps

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Set up Environment Variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. **Set up Databases**
```bash
# MongoDB (for products)
mongod

# PostgreSQL (for user data)
# Use Supabase or local PostgreSQL instance
```

4. **Run Database Migrations**
```bash
npm run migrate
```

5. **Seed Database (Optional)**
```bash
npm run seed
```

6. **Start Development Server**
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `GET /api/users/projects` - Get user projects

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/share` - Share project
- `GET /api/projects/:id/collaborators` - Get project collaborators

### Circuit Designer
- `POST /api/circuits` - Save circuit design
- `GET /api/circuits/:id` - Get circuit design
- `PUT /api/circuits/:id` - Update circuit design
- `DELETE /api/circuits/:id` - Delete circuit design
- `POST /api/circuits/:id/simulate` - Simulate circuit
- `POST /api/circuits/:id/export` - Export circuit

### AI Assistant
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/usage` - Get AI usage stats
- `POST /api/ai/reset-usage` - Reset daily usage (admin)

### Components (MongoDB Integration)
- `GET /api/components` - Get all components
- `GET /api/components/:id` - Get component by ID
- `GET /api/components/search` - Search components
- `GET /api/components/categories` - Get component categories

### Ideas & Tutorials
- `GET /api/ideas` - Get project ideas
- `GET /api/ideas/:id` - Get idea details
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea

### Real-time Features (WebSocket)
- `/socket.io/` - WebSocket connection
- `join-project` - Join project collaboration
- `leave-project` - Leave project collaboration
- `circuit-update` - Real-time circuit updates
- `chat-message` - Real-time chat messages

## Database Schema

### PostgreSQL (User Data)
```sql
-- Users table (extends Supabase auth.users)
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
  role TEXT DEFAULT 'viewer', -- viewer, editor, admin
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, file
  created_at TIMESTAMP DEFAULT NOW()
);
```

### MongoDB (Products Data)
```javascript
// Product schema
{
  _id: ObjectId,
  name: String,
  category: String,
  subcategory: String,
  price: Number,
  currency: String,
  description: String,
  specifications: Object,
  images: [String],
  inStock: Boolean,
  stockQuantity: Number,
  supplier: String,
  tags: [String],
  rating: Number,
  reviews: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run migrate         # Run database migrations
npm run seed            # Seed database with sample data
npm run db:reset        # Reset database

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Linting & Formatting
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier

# Documentation
npm run docs:generate   # Generate API documentation
npm run docs:serve      # Serve documentation locally
```

## API Documentation
Once the server is running, visit:
- Swagger UI: `http://localhost:3001/api-docs`
- API Spec: `http://localhost:3001/api-spec.json`

## Security Features
- JWT authentication
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration
- File upload validation
- API key management

## Performance Optimizations
- Database indexing
- Query optimization
- Caching with Redis
- Connection pooling
- Compression middleware
- CDN integration

## Monitoring & Logging
- Error tracking with Sentry
- Request logging
- Performance monitoring
- Health check endpoints
- Database query logging

## Deployment
See `DEPLOYMENT.md` for detailed deployment instructions.

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License
MIT License - see LICENSE file for details
