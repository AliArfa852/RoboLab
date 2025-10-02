import { Router } from 'express';
import { authenticateToken, rateLimitByUser } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { schemas } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import * as aiController from '@/controllers/aiController';

const router = Router();

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send message to AI assistant
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIChatRequest'
 *     responses:
 *       200:
 *         description: AI response
 *       429:
 *         description: Rate limit exceeded
 */
router.post('/chat',
  authenticateToken,
  rateLimitByUser(10, 60000), // 10 requests per minute
  validateRequest(schemas.aiChat),
  asyncHandler(aiController.chatWithAI)
);

/**
 * @swagger
 * /api/ai/usage:
 *   get:
 *     summary: Get AI usage statistics
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage statistics
 */
router.get('/usage',
  authenticateToken,
  asyncHandler(aiController.getAIUsage)
);

/**
 * @swagger
 * /api/ai/reset-usage:
 *   post:
 *     summary: Reset daily AI usage (admin only)
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage reset successfully
 */
router.post('/reset-usage',
  authenticateToken,
  asyncHandler(aiController.resetAIUsage)
);

export default router;
