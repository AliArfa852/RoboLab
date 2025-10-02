import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest, validateParams } from '@/middleware/validation';
import { schemas } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import * as userController from '@/controllers/userController';

const router = Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile',
  authenticateToken,
  asyncHandler(userController.getUserProfile)
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile',
  authenticateToken,
  validateRequest(schemas.updateUser),
  asyncHandler(userController.updateUserProfile)
);

/**
 * @swagger
 * /api/users/projects:
 *   get:
 *     summary: Get user's projects
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: User's projects
 */
router.get('/projects',
  authenticateToken,
  validateRequest(schemas.pagination),
  asyncHandler(userController.getUserProjects)
);

/**
 * @swagger
 * /api/users/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 */
router.delete('/delete-account',
  authenticateToken,
  asyncHandler(userController.deleteUserAccount)
);

export default router;
