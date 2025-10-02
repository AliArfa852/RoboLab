import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { getSupabaseClient } from '@/config/database';
import { JWTPayload, ApiResponse } from '@/types';
import { logger } from '@/utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        fullName?: string;
        avatarUrl?: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    
    // Get user from Supabase
    const supabase = getSupabaseClient();
    const { data: user, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Add user to request
    req.user = {
      id: user.user.id,
      email: user.user.email || '',
      fullName: user.user.user_metadata?.full_name,
      avatarUrl: user.user.user_metadata?.avatar_url
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      const supabase = getSupabaseClient();
      const { data: user } = await supabase.auth.getUser(token);

      if (user) {
        req.user = {
          id: user.user.id,
          email: user.user.email || '',
          fullName: user.user.user_metadata?.full_name,
          avatarUrl: user.user.user_metadata?.avatar_url
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // For now, we'll implement basic role checking
    // In a full implementation, you'd check user roles from the database
    const userRole = req.user.role || 'user';
    
    if (!roles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const validateProjectAccess = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!projectId) {
      res.status(400).json({
        success: false,
        error: 'Project ID required'
      });
      return;
    }

    // Check if user has access to the project
    const supabase = getSupabaseClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('user_id, is_public')
      .eq('id', projectId)
      .single();

    if (error || !project) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      });
      return;
    }

    // Check if user owns the project or if it's public
    if (project.user_id !== userId && !project.is_public) {
      res.status(403).json({
        success: false,
        error: 'Access denied to this project'
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Project access validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const rateLimitByUser = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const userId = req.user?.id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key);
      }
    }

    const userRequests = requests.get(userId);
    
    if (!userRequests) {
      requests.set(userId, { count: 1, resetTime: now });
      next();
      return;
    }

    if (userRequests.resetTime < windowStart) {
      userRequests.count = 1;
      userRequests.resetTime = now;
      next();
      return;
    }

    if (userRequests.count >= maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil((userRequests.resetTime + windowMs - now) / 1000)
      });
      return;
    }

    userRequests.count++;
    next();
  };
};
