import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';
import Redis from 'redis';
import { config } from './config';
import { logger } from '@/utils/logger';

// MongoDB connection
let mongoConnection: typeof mongoose | null = null;

// Supabase client
let supabaseClient: any = null;

// Redis client
let redisClient: Redis.RedisClientType | null = null;

export const connectMongoDB = async (): Promise<typeof mongoose> => {
  try {
    if (mongoConnection) {
      return mongoConnection;
    }

    mongoConnection = await mongoose.connect(config.mongodbUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ Connected to MongoDB');
    return mongoConnection;
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const connectSupabase = () => {
  try {
    if (supabaseClient) {
      return supabaseClient;
    }

    supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    logger.info('✅ Connected to Supabase');
    return supabaseClient;
  } catch (error) {
    logger.error('❌ Supabase connection error:', error);
    throw error;
  }
};

export const connectRedis = async (): Promise<Redis.RedisClientType> => {
  try {
    if (redisClient) {
      return redisClient;
    }

    redisClient = Redis.createClient({
      url: config.redisUrl,
      password: config.redisPassword,
      socket: {
        connectTimeout: 10000,
        lazyConnect: true
      }
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('ready', () => {
      logger.info('✅ Redis ready for operations');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('❌ Redis connection error:', error);
    throw error;
  }
};

export const connectDatabases = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Connect to Supabase
    connectSupabase();
    
    // Connect to Redis (optional)
    try {
      await connectRedis();
    } catch (error) {
      logger.warn('⚠️ Redis connection failed, continuing without caching');
    }
    
    logger.info('✅ All databases connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabases = async (): Promise<void> => {
  try {
    // Disconnect MongoDB
    if (mongoConnection) {
      await mongoose.disconnect();
      mongoConnection = null;
      logger.info('✅ Disconnected from MongoDB');
    }
    
    // Disconnect Redis
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      logger.info('✅ Disconnected from Redis');
    }
    
    logger.info('✅ All databases disconnected');
  } catch (error) {
    logger.error('❌ Error disconnecting databases:', error);
    throw error;
  }
};

// Get database instances
export const getMongoConnection = () => mongoConnection;
export const getSupabaseClient = () => supabaseClient;
export const getRedisClient = () => redisClient;

// Health check for databases
export const checkDatabaseHealth = async (): Promise<{
  mongodb: boolean;
  supabase: boolean;
  redis: boolean;
}> => {
  const health = {
    mongodb: false,
    supabase: false,
    redis: false
  };

  try {
    // Check MongoDB
    if (mongoConnection) {
      await mongoConnection.connection.db.admin().ping();
      health.mongodb = true;
    }
  } catch (error) {
    logger.error('MongoDB health check failed:', error);
  }

  try {
    // Check Supabase
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('profiles').select('count').limit(1);
      if (!error) {
        health.supabase = true;
      }
    }
  } catch (error) {
    logger.error('Supabase health check failed:', error);
  }

  try {
    // Check Redis
    if (redisClient) {
      await redisClient.ping();
      health.redis = true;
    }
  } catch (error) {
    logger.error('Redis health check failed:', error);
  }

  return health;
};
