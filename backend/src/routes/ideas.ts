import { Router } from 'express';
import { authenticateToken, optionalAuth } from '@/middleware/auth';
import { validateRequest, validateParams, validateQuery } from '@/middleware/validation';
import { schemas } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import * as ideaController from '@/controllers/ideaController';

const router = Router();

/**
 * @swagger
 * /api/ideas:
 *   get:
 *     summary: Get project ideas
 *     tags: [Ideas]
 *     parameters:
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
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of project ideas
 */
router.get('/',
  optionalAuth,
  validateQuery(schemas.pagination.keys({
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
    category: Joi.string().optional(),
    search: Joi.string().optional()
  })),
  asyncHandler(ideaController.getIdeas)
);

/**
 * @swagger
 * /api/ideas:
 *   post:
 *     summary: Create a new project idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIdeaRequest'
 *     responses:
 *       201:
 *         description: Idea created successfully
 */
router.post('/',
  authenticateToken,
  validateRequest(schemas.createIdea),
  asyncHandler(ideaController.createIdea)
);

/**
 * @swagger
 * /api/ideas/{id}:
 *   get:
 *     summary: Get idea by ID
 *     tags: [Ideas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Idea details
 *       404:
 *         description: Idea not found
 */
router.get('/:id',
  optionalAuth,
  validateParams(schemas.idParam),
  asyncHandler(ideaController.getIdeaById)
);

/**
 * @swagger
 * /api/ideas/{id}:
 *   put:
 *     summary: Update idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIdeaRequest'
 *     responses:
 *       200:
 *         description: Idea updated successfully
 */
router.put('/:id',
  authenticateToken,
  validateParams(schemas.idParam),
  validateRequest(schemas.updateIdea),
  asyncHandler(ideaController.updateIdea)
);

/**
 * @swagger
 * /api/ideas/{id}:
 *   delete:
 *     summary: Delete idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Idea deleted successfully
 */
router.delete('/:id',
  authenticateToken,
  validateParams(schemas.idParam),
  asyncHandler(ideaController.deleteIdea)
);

/**
 * @swagger
 * /api/ideas/{id}/like:
 *   post:
 *     summary: Like an idea
 *     tags: [Ideas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Idea ID
 *     responses:
 *       200:
 *         description: Idea liked successfully
 */
router.post('/:id/like',
  authenticateToken,
  validateParams(schemas.idParam),
  asyncHandler(ideaController.likeIdea)
);

export default router;
