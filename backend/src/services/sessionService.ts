import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';

// Redis client for session storage
let redisClient: any = null;

export const initializeRedisSession = async () => {
  try {
    // Create Redis client
    redisClient = createClient({
      url: config.redisUrl,
      password: config.redisPassword,
      socket: {
        connectTimeout: 10000,
        lazyConnect: true
      }
    });

    redisClient.on('error', (err: any) => {
      logger.error('Redis Session Store Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis Session Store connected');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error('❌ Redis Session Store connection error:', error);
    throw error;
  }
};

// Create session middleware
export const createSessionMiddleware = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initializeRedisSession() first.');
  }

  return session({
    store: new RedisStore({ client: redisClient }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
    name: 'robolab.sid'
  });
};

// Session management utilities
export class SessionManager {
  // Create user session
  static createUserSession(req: any, user: any): void {
    req.session.userId = user.uid;
    req.session.userEmail = user.email;
    req.session.userName = user.displayName || user.email;
    req.session.userAvatar = user.photoURL;
    req.session.isAuthenticated = true;
    req.session.loginTime = new Date().toISOString();
    
    logger.info(`User session created for: ${user.email}`);
  }

  // Get user from session
  static getUserFromSession(req: any): any {
    if (!req.session || !req.session.isAuthenticated) {
      return null;
    }

    return {
      uid: req.session.userId,
      email: req.session.userEmail,
      displayName: req.session.userName,
      photoURL: req.session.userAvatar,
      loginTime: req.session.loginTime
    };
  }

  // Update user session
  static updateUserSession(req: any, updates: any): void {
    if (req.session && req.session.isAuthenticated) {
      Object.assign(req.session, updates);
      logger.info(`User session updated for: ${req.session.userEmail}`);
    }
  }

  // Destroy user session
  static destroyUserSession(req: any): void {
    if (req.session) {
      const userEmail = req.session.userEmail;
      req.session.destroy((err: any) => {
        if (err) {
          logger.error('Error destroying session:', err);
        } else {
          logger.info(`User session destroyed for: ${userEmail}`);
        }
      });
    }
  }

  // Check if user is authenticated
  static isAuthenticated(req: any): boolean {
    return !!(req.session && req.session.isAuthenticated);
  }

  // Get session info
  static getSessionInfo(req: any): any {
    if (!req.session) {
      return null;
    }

    return {
      isAuthenticated: req.session.isAuthenticated || false,
      userId: req.session.userId,
      userEmail: req.session.userEmail,
      loginTime: req.session.loginTime,
      sessionId: req.sessionID,
      lastActivity: new Date().toISOString()
    };
  }

  // Extend session
  static extendSession(req: any): void {
    if (req.session) {
      req.session.lastActivity = new Date().toISOString();
    }
  }

  // Check session validity
  static isSessionValid(req: any): boolean {
    if (!req.session || !req.session.isAuthenticated) {
      return false;
    }

    const lastActivity = req.session.lastActivity;
    if (!lastActivity) {
      return true; // No last activity set, assume valid
    }

    const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    const timeSinceLastActivity = Date.now() - new Date(lastActivity).getTime();
    
    return timeSinceLastActivity < sessionTimeout;
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      // This would typically be handled by Redis TTL
      // But we can add custom cleanup logic here if needed
      logger.info('Session cleanup completed');
    } catch (error) {
      logger.error('Error during session cleanup:', error);
    }
  }

  // Get active sessions count
  static async getActiveSessionsCount(): Promise<number> {
    try {
      if (!redisClient) {
        return 0;
      }

      const keys = await redisClient.keys('sess:*');
      return keys.length;
    } catch (error) {
      logger.error('Error getting active sessions count:', error);
      return 0;
    }
  }

  // Get session by ID
  static async getSessionById(sessionId: string): Promise<any> {
    try {
      if (!redisClient) {
        return null;
      }

      const sessionData = await redisClient.get(`sess:${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      logger.error('Error getting session by ID:', error);
      return null;
    }
  }

  // Invalidate session by ID
  static async invalidateSessionById(sessionId: string): Promise<boolean> {
    try {
      if (!redisClient) {
        return false;
      }

      await redisClient.del(`sess:${sessionId}`);
      logger.info(`Session invalidated: ${sessionId}`);
      return true;
    } catch (error) {
      logger.error('Error invalidating session:', error);
      return false;
    }
  }
}

// Middleware to check session validity
export const sessionValidationMiddleware = (req: any, res: any, next: any) => {
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/health')) {
    return next();
  }

  if (!SessionManager.isSessionValid(req)) {
    SessionManager.destroyUserSession(req);
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid'
    });
  }

  SessionManager.extendSession(req);
  next();
};

// Middleware to require authentication
export const requireAuth = (req: any, res: any, next: any) => {
  if (!SessionManager.isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  next();
};

export default SessionManager;
