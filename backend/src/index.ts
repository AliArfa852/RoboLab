import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { connectDatabases } from '@/config/database';
import { initializeFirebase } from '@/config/firebase';
import { initializeRedisSession, createSessionMiddleware, sessionValidationMiddleware } from '@/services/sessionService';
import { errorHandler } from '@/middleware/errorHandler';
import { notFound } from '@/middleware/notFound';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import projectRoutes from '@/routes/projects';
import circuitRoutes from '@/routes/circuits';
import aiRoutes from '@/routes/ai';
import componentRoutes from '@/routes/components';
import ideaRoutes from '@/routes/ideas';
import healthRoutes from '@/routes/health';

// Import socket handlers
import { setupSocketHandlers } from '@/services/socketService';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST']
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimitWindowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(createSessionMiddleware());

// Session validation middleware
app.use(sessionValidationMiddleware);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  }));
}

// Health check route (before other routes)
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/circuits', circuitRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/ideas', ideaRoutes);

// Swagger documentation
if (config.enableSwagger) {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../../docs/swagger.json');
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api-spec.json', (req, res) => {
    res.json(swaggerDocument);
  });
}

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize Redis session store
    await initializeRedisSession();
    
    // Connect to databases
    await connectDatabases();
    
    // Start HTTP server
    server.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 CORS Origin: ${config.corsOrigin}`);
      logger.info(`👤 Process ID: ${process.pid}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

export { app, server, io };
