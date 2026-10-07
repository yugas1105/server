const express = require("express");

const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/PaymentController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Farmer payment management APIs
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - farmer
 *               - amount
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-01T10:30:00.000Z
 *               farmer:
 *                 type: string
 *                 example: 68c123456789abcdef123456
 *               field:
 *                 type: string
 *                 example: 68c987654321abcdef654321
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 5000
 *               paymentType:
 *                 type: string
 *                 enum:
 *                   - Cash
 *                   - UPI
 *                   - Bank
 *                   - Cheque
 *                   - Other
 *                 example: UPI
 *               remark:
 *                 type: string
 *                 example: Advance payment
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid payment data
 *       404:
 *         description: Farmer or field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", // authMiddleware,
  createPayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 20
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", // authMiddleware,
  getAllPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c999999999abcdef999999
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", // authMiddleware,
  getPaymentById);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c999999999abcdef999999
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-01T10:30:00.000Z
 *               farmer:
 *                 type: string
 *                 example: 68c123456789abcdef123456
 *               field:
 *                 type: string
 *                 example: 68c987654321abcdef654321
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 7500
 *               paymentType:
 *                 type: string
 *                 enum:
 *                   - Cash
 *                   - UPI
 *                   - Bank
 *                   - Cheque
 *                   - Other
 *                 example: Bank
 *               remark:
 *                 type: string
 *                 example: Updated payment
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Invalid payment data
 *       404:
 *         description: Payment, farmer or field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id",// authMiddleware, 
  updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c999999999abcdef999999
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", // authMiddleware,
  deletePayment);

module.exports = router;