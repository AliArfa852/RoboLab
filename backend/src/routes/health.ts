import { Router } from 'express';
import { Request, Response } from 'express';
import { checkDatabaseHealth } from '@/config/database';
import { ApiResponse, HealthCheck } from '@/types';
import { logger } from '@/utils/logger';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (req: Request, res: Response<ApiResponse<HealthCheck>>) => {
  try {
    const startTime = Date.now();
    
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    // Check AI service health (basic check)
    const aiHealth = process.env.OPENAI_API_KEY ? true : false;
    
    // Check storage health (basic check)
    const storageHealth = process.env.SUPABASE_URL ? true : false;
    
    const isHealthy = dbHealth.mongodb && dbHealth.supabase && aiHealth && storageHealth;
    
    const healthCheck: HealthCheck = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      databases: dbHealth,
      services: {
        ai: aiHealth,
        storage: storageHealth
      },
      version: process.env.npm_package_version || '1.0.0'
    };
    
    const response: ApiResponse<HealthCheck> = {
      success: true,
      data: healthCheck
    };
    
    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json(response);
    
    // Log health check
    logger.info('Health check completed', {
      status: healthCheck.status,
      duration: Date.now() - startTime,
      databases: dbHealth
    });
    
  } catch (error) {
    logger.error('Health check failed:', error);
    
    const response: ApiResponse<HealthCheck> = {
      success: false,
      error: 'Health check failed',
      data: {
        status: 'unhealthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        databases: {
          mongodb: false,
          supabase: false,
          redis: false
        },
        services: {
          ai: false,
          storage: false
        },
        version: process.env.npm_package_version || '1.0.0'
      }
    };
    
    res.status(503).json(response);
  }
});

/**
 * @swagger
 * /api/health/ready:
 *   get:
 *     summary: Readiness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const isReady = dbHealth.mongodb && dbHealth.supabase;
    
    if (isReady) {
      res.status(200).json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready' });
    }
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({ status: 'not ready' });
  }
});

/**
 * @swagger
 * /api/health/live:
 *   get:
 *     summary: Liveness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'alive',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

export default router;
