import cluster from 'cluster';
import os from 'os';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';

const numCPUs = os.cpus().length;
const workers: any[] = [];

// Master process
if (cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`);

  // Fork workers
  const numWorkers = config.nodeEnv === 'production' ? numCPUs : 1;
  logger.info(`Starting ${numWorkers} workers`);

  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    workers.push(worker);
  }

  // Handle worker events
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    
    // Restart worker if it died unexpectedly
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      logger.info('Starting a new worker');
      const newWorker = cluster.fork();
      workers.push(newWorker);
    }
  });

  cluster.on('disconnect', (worker) => {
    logger.info(`Worker ${worker.process.pid} disconnected`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('Master received SIGTERM, shutting down workers');
    workers.forEach(worker => {
      worker.kill('SIGTERM');
    });
  });

  process.on('SIGINT', () => {
    logger.info('Master received SIGINT, shutting down workers');
    workers.forEach(worker => {
      worker.kill('SIGINT');
    });
  });

  // Health check endpoint for load balancer
  process.on('message', (msg) => {
    if (msg.type === 'health-check') {
      process.send!({ type: 'health-check', status: 'healthy', pid: process.pid });
    }
  });

} else {
  // Worker process
  logger.info(`Worker ${process.pid} started`);

  // Import and start the server
  import('./index');

  // Handle worker shutdown
  process.on('SIGTERM', () => {
    logger.info(`Worker ${process.pid} received SIGTERM, shutting down gracefully`);
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info(`Worker ${process.pid} received SIGINT, shutting down gracefully`);
    process.exit(0);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error(`Worker ${process.pid} uncaught exception:`, error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Worker ${process.pid} unhandled rejection at:`, promise, 'reason:', reason);
    process.exit(1);
  });
}

export { workers };
