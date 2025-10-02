import { Router } from 'express';
import { authenticateToken, validateProjectAccess } from '@/middleware/auth';
import { validateRequest, validateParams, validateQuery } from '@/middleware/validation';
import { schemas } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import * as projectController from '@/controllers/projectController';

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/',
  authenticateToken,
  validateQuery(schemas.pagination.keys({
    search: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  })),
  asyncHandler(projectController.getProjects)
);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post('/',
  authenticateToken,
  validateRequest(schemas.createProject),
  asyncHandler(projectController.createProject)
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get('/:id',
  authenticateToken,
  validateParams(schemas.idParam),
  validateProjectAccess,
  asyncHandler(projectController.getProjectById)
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectRequest'
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put('/:id',
  authenticateToken,
  validateParams(schemas.idParam),
  validateProjectAccess,
  validateRequest(schemas.updateProject),
  asyncHandler(projectController.updateProject)
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete('/:id',
  authenticateToken,
  validateParams(schemas.idParam),
  validateProjectAccess,
  asyncHandler(projectController.deleteProject)
);

/**
 * @swagger
 * /api/projects/{id}/share:
 *   post:
 *     summary: Share project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPublic:
 *                 type: boolean
 *               collaborators:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [viewer, editor, admin]
 *     responses:
 *       200:
 *         description: Project shared successfully
 */
router.post('/:id/share',
  authenticateToken,
  validateParams(schemas.idParam),
  validateProjectAccess,
  asyncHandler(projectController.shareProject)
);

/**
 * @swagger
 * /api/projects/{id}/collaborators:
 *   get:
 *     summary: Get project collaborators
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of collaborators
 */
router.get('/:id/collaborators',
  authenticateToken,
  validateParams(schemas.idParam),
  validateProjectAccess,
  asyncHandler(projectController.getProjectCollaborators)
);

export default router;
