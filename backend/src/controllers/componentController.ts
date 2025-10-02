import { Request, Response } from 'express';
import { Product } from '@/models/Product';
import { ApiResponse, Component, SearchComponentsRequest, PaginationInfo } from '@/types';
import { logger } from '@/utils/logger';

export const getComponents = async (req: Request, res: Response<ApiResponse<Component[]>>): Promise<void> => {
  try {
    const {
      query,
      category,
      subcategory,
      minPrice,
      maxPrice,
      inStock,
      minRating,
      tags,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as SearchComponentsRequest;

    // Build search query
    const searchQuery: any = {};

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (category) {
      searchQuery.category = category;
    }

    if (subcategory) {
      searchQuery.subcategory = subcategory;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      searchQuery.price = {};
      if (minPrice !== undefined) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) searchQuery.price.$lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      searchQuery.inStock = inStock === 'true';
    }

    if (minRating !== undefined) {
      searchQuery.rating = { $gte: Number(minRating) };
    }

    if (tags && Array.isArray(tags)) {
      searchQuery.tags = { $in: tags };
    }

    // Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [components, total] = await Promise.all([
      Product.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(searchQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const pagination: PaginationInfo = {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1
    };

    const response: ApiResponse<Component[]> = {
      success: true,
      data: components as Component[],
      pagination
    };

    res.json(response);
  } catch (error) {
    logger.error('Error getting components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components'
    });
  }
};

export const getComponentById = async (req: Request, res: Response<ApiResponse<Component>>): Promise<void> => {
  try {
    const { id } = req.params;

    const component = await Product.findById(id).lean();

    if (!component) {
      res.status(404).json({
        success: false,
        error: 'Component not found'
      });
      return;
    }

    const response: ApiResponse<Component> = {
      success: true,
      data: component as Component
    };

    res.json(response);
  } catch (error) {
    logger.error('Error getting component by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch component'
    });
  }
};

export const getCategories = async (req: Request, res: Response<ApiResponse<string[]>>): Promise<void> => {
  try {
    const categories = await Product.distinct('category');

    const response: ApiResponse<string[]> = {
      success: true,
      data: categories
    };

    res.json(response);
  } catch (error) {
    logger.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
};

export const getSubcategories = async (req: Request, res: Response<ApiResponse<string[]>>): Promise<void> => {
  try {
    const { category } = req.params;

    const subcategories = await Product.distinct('subcategory', { category });

    const response: ApiResponse<string[]> = {
      success: true,
      data: subcategories.filter(sub => sub) // Remove null/undefined values
    };

    res.json(response);
  } catch (error) {
    logger.error('Error getting subcategories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subcategories'
    });
  }
};

export const searchComponents = async (req: Request, res: Response<ApiResponse<Component[]>>): Promise<void> => {
  try {
    const { q, ...filters } = req.query as SearchComponentsRequest;

    if (!q) {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
      return;
    }

    // Use the static search method
    const components = await Product.searchProducts(q, filters);

    const response: ApiResponse<Component[]> = {
      success: true,
      data: components as Component[]
    };

    res.json(response);
  } catch (error) {
    logger.error('Error searching components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search components'
    });
  }
};

export const getComponentReviews = async (req: Request, res: Response<ApiResponse<any[]>>): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const component = await Product.findById(id).select('reviews').lean();

    if (!component) {
      res.status(404).json({
        success: false,
        error: 'Component not found'
      });
      return;
    }

    const reviews = component.reviews || [];
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedReviews = reviews.slice(skip, skip + Number(limit));

    const total = reviews.length;
    const totalPages = Math.ceil(total / Number(limit));
    const pagination: PaginationInfo = {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1
    };

    const response: ApiResponse<any[]> = {
      success: true,
      data: paginatedReviews,
      pagination
    };

    res.json(response);
  } catch (error) {
    logger.error('Error getting component reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch component reviews'
    });
  }
};

export const addComponentReview = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const component = await Product.findById(id);

    if (!component) {
      res.status(404).json({
        success: false,
        error: 'Component not found'
      });
      return;
    }

    // Check if user already reviewed this component
    const existingReview = component.reviews.find(review => review.userId === userId);
    if (existingReview) {
      res.status(400).json({
        success: false,
        error: 'You have already reviewed this component'
      });
      return;
    }

    // Add review
    await component.addReview(userId, req.user.fullName || 'Anonymous', rating, comment);

    const response: ApiResponse<any> = {
      success: true,
      message: 'Review added successfully'
    };

    res.json(response);
  } catch (error) {
    logger.error('Error adding component review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    });
  }
};
