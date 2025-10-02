import { Router } from 'express';
import { authenticateToken, validateProjectAccess } from '@/middleware/auth';
import { validateRequest, validateParams } from '@/middleware/validation';
import { schemas } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import * as circuitController from '@/controllers/circuitController';

const router = Router();

/**
 * @swagger
 * /api/circuits:
 *   post:
 *     summary: Create a new circuit
 *     tags: [Circuits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCircuitRequest'
 *     responses:
 *       201:
 *         description: Circuit created successfully
 */
router.post('/',
  authenticateToken,
  validateRequest(schemas.createCircuit),
  asyncHandler(circuitController.createCircuit)
);

/**
 * @swagger
 * /api/circuits/{id}:
 *   get:
 *     summary: Get circuit by ID
 *     tags: [Circuits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     responses:
 *       200:
 *         description: Circuit details
 *       404:
 *         description: Circuit not found
 */
router.get('/:id',
  authenticateToken,
  validateParams(schemas.circuitIdParam),
  asyncHandler(circuitController.getCircuitById)
);

/**
 * @swagger
 * /api/circuits/{id}:
 *   put:
 *     summary: Update circuit
 *     tags: [Circuits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCircuitRequest'
 *     responses:
 *       200:
 *         description: Circuit updated successfully
 */
router.put('/:id',
  authenticateToken,
  validateParams(schemas.circuitIdParam),
  validateRequest(schemas.updateCircuit),
  asyncHandler(circuitController.updateCircuit)
);

/**
 * @swagger
 * /api/circuits/{id}:
 *   delete:
 *     summary: Delete circuit
 *     tags: [Circuits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     responses:
 *       200:
 *         description: Circuit deleted successfully
 */
router.delete('/:id',
  authenticateToken,
  validateParams(schemas.circuitIdParam),
  asyncHandler(circuitController.deleteCircuit)
);

/**
 * @swagger
 * /api/circuits/{id}/simulate:
 *   post:
 *     summary: Simulate circuit
 *     tags: [Circuits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     responses:
 *       200:
 *         description: Simulation results
 */
router.post('/:id/simulate',
  authenticateToken,
  validateParams(schemas.circuitIdParam),
  asyncHandler(circuitController.simulateCircuit)
);

/**
 * @swagger
 * /api/circuits/{id}/export:
 *   post:
 *     summary: Export circuit
 *     tags: [Circuits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Circuit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               format:
 *                 type: string
 *                 enum: [pdf, png, svg, json]
 *     responses:
 *       200:
 *         description: Circuit exported successfully
 */
router.post('/:id/export',
  authenticateToken,
  validateParams(schemas.circuitIdParam),
  validateRequest(Joi.object({
    format: Joi.string().valid('pdf', 'png', 'svg', 'json').required()
  })),
  asyncHandler(circuitController.exportCircuit)
);

export default router;
