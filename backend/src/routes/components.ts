import { Router } from 'express';
import { optionalAuth } from '@/middleware/auth';
import { validateQuery, validateParams } from '@/middleware/validation';
import { schemas } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import * as componentController from '@/controllers/componentController';

const router = Router();

/**
 * @swagger
 * /api/components:
 *   get:
 *     summary: Get all components with optional filtering
 *     tags: [Components]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: subcategory
 *         schema:
 *           type: string
 *         description: Filter by subcategory
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter by stock availability
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, rating, createdAt]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of components
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Component'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 */
router.get('/',
  optionalAuth,
  validateQuery(schemas.searchComponents),
  asyncHandler(componentController.getComponents)
);

/**
 * @swagger
 * /api/components/categories:
 *   get:
 *     summary: Get all component categories
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/categories',
  asyncHandler(componentController.getCategories)
);

/**
 * @swagger
 * /api/components/categories/{category}/subcategories:
 *   get:
 *     summary: Get subcategories for a category
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/categories/:category/subcategories',
  validateParams(schemas.idParam.keys({ category: Joi.string().required() })),
  asyncHandler(componentController.getSubcategories)
);

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     summary: Get component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *     responses:
 *       200:
 *         description: Component details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Component'
 *       404:
 *         description: Component not found
 */
router.get('/:id',
  optionalAuth,
  validateParams(schemas.idParam),
  asyncHandler(componentController.getComponentById)
);

/**
 * @swagger
 * /api/components/{id}/reviews:
 *   get:
 *     summary: Get component reviews
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Reviews per page
 *     responses:
 *       200:
 *         description: Component reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ComponentReview'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 */
router.get('/:id/reviews',
  validateParams(schemas.idParam),
  validateQuery(schemas.pagination),
  asyncHandler(componentController.getComponentReviews)
);

/**
 * @swagger
 * /api/components/search:
 *   get:
 *     summary: Search components with advanced filters
 *     tags: [Components]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: In stock only
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Component'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 */
router.get('/search',
  optionalAuth,
  validateQuery(schemas.searchComponents.keys({ q: Joi.string().required() })),
  asyncHandler(componentController.searchComponents)
);

export default router;
