import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '@/types';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation error',
        data: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      };
      
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Query validation error',
        data: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      };
      
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Parameter validation error',
        data: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      };
      
      res.status(400).json(response);
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User schemas
  createUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    fullName: Joi.string().min(2).max(100).optional()
  }),

  updateUser: Joi.object({
    fullName: Joi.string().min(2).max(100).optional(),
    bio: Joi.string().max(500).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    preferences: Joi.object().optional()
  }),

  // Project schemas
  createProject: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000).optional(),
    isPublic: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  updateProject: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    isPublic: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    circuitData: Joi.object().optional()
  }),

  // Circuit schemas
  createCircuit: Joi.object({
    projectId: Joi.string().uuid().required(),
    name: Joi.string().min(1).max(100).required(),
    circuitJson: Joi.object().required()
  }),

  updateCircuit: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    circuitJson: Joi.object().optional()
  }),

  // AI Chat schemas
  aiChat: Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    projectId: Joi.string().uuid().optional(),
    context: Joi.string().max(1000).optional()
  }),

  // Component search schemas
  searchComponents: Joi.object({
    query: Joi.string().max(100).optional(),
    category: Joi.string().max(50).optional(),
    subcategory: Joi.string().max(50).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    inStock: Joi.boolean().optional(),
    minRating: Joi.number().min(0).max(5).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    sortBy: Joi.string().valid('name', 'price', 'rating', 'createdAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional()
  }),

  // Idea schemas
  createIdea: Joi.object({
    title: Joi.string().min(1).max(200).required(),
    description: Joi.string().min(1).max(2000).required(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    category: Joi.string().min(1).max(50).required(),
    tags: Joi.array().items(Joi.string()).optional(),
    estimatedTime: Joi.string().max(50).optional(),
    requiredComponents: Joi.array().items(Joi.string()).optional(),
    instructions: Joi.array().items(Joi.object({
      stepNumber: Joi.number().min(1).required(),
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().min(1).max(1000).required(),
      image: Joi.string().optional(),
      code: Joi.string().optional(),
      tips: Joi.array().items(Joi.string()).optional()
    })).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    isPublic: Joi.boolean().optional()
  }),

  updateIdea: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().min(1).max(2000).optional(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
    category: Joi.string().min(1).max(50).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    estimatedTime: Joi.string().max(50).optional(),
    requiredComponents: Joi.array().items(Joi.string()).optional(),
    instructions: Joi.array().items(Joi.object({
      stepNumber: Joi.number().min(1).required(),
      title: Joi.string().min(1).max(200).required(),
      description: Joi.string().min(1).max(1000).required(),
      image: Joi.string().optional(),
      code: Joi.string().optional(),
      tips: Joi.array().items(Joi.string()).optional()
    })).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    isPublic: Joi.boolean().optional()
  }),

  // Common parameter schemas
  idParam: Joi.object({
    id: Joi.string().uuid().required()
  }),

  projectIdParam: Joi.object({
    projectId: Joi.string().uuid().required()
  }),

  circuitIdParam: Joi.object({
    circuitId: Joi.string().uuid().required()
  }),

  // Pagination schemas
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};
