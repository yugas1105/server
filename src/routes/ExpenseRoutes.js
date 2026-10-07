const express = require("express");

const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByFarmer,
  getExpensesByField,
  getExpensesByDate,
  getExpensesByDateRange,
} = require("../controllers/ExpenseController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management APIs
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
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
 *               - field
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
 *               workType:
 *                 type: string
 *                 enum:
 *                   - Material
 *                   - Spray
 *                   - Labour
 *                   - Other
 *                   - Mixed
 *                 example: Material
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     material:
 *                       type: string
 *                       example: 68c555555555abcdef555555
 *                     materialName:
 *                       type: string
 *                       example: Urea
 *                     quantity:
 *                       type: number
 *                       example: 10
 *                     unit:
 *                       type: string
 *                       example: Kg
 *                     rate:
 *                       type: number
 *                       example: 25
 *                     total:
 *                       type: number
 *                       example: 250
 *               labourCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 500
 *               otherCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 100
 *               notes:
 *                 type: string
 *                 example: Fertilizer application
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Invalid expense data
 *       404:
 *         description: Farmer or field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", // authMiddleware,
  createExpense);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
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
 *                   example: 25
 *                 expenses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", // authMiddleware,
  getAllExpenses);

/**
 * @swagger
 * /api/expenses/farmer/{farmerId}:
 *   get:
 *     summary: Get expenses by farmer
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: farmerId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Farmer expenses retrieved successfully
 *       404:
 *         description: Farmer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/farmer/:farmerId",
  // authMiddleware,
  getExpensesByFarmer
);

/**
 * @swagger
 * /api/expenses/field/{fieldId}:
 *   get:
 *     summary: Get expenses by field
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fieldId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c987654321abcdef654321
 *     responses:
 *       200:
 *         description: Field expenses retrieved successfully
 *       404:
 *         description: Field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/field/:fieldId",
  // authMiddleware,
  getExpensesByField
);

/**
 * @swagger
 * /api/expenses/date:
 *   get:
 *     summary: Get expenses by date
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-01
 *     responses:
 *       200:
 *         description: Expenses for the specified date retrieved successfully
 *       400:
 *         description: Date is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/date",
  // authMiddleware,
  getExpensesByDate
);

/**
 * @swagger
 * /api/expenses/date-range:
 *   get:
 *     summary: Get expenses by date range
 *     tags: [Expenses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-01
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-31
 *     responses:
 *       200:
 *         description: Expenses within the specified date range retrieved successfully
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/date-range",
  // authMiddleware,
  getExpensesByDateRange
);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get expense by ID
 *     tags: [Expenses]
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
 *         description: Expense retrieved successfully
 *       404:
 *         description: Expense not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/:id", // authMiddleware,
  getExpenseById);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update expense
 *     tags: [Expenses]
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
 *               workType:
 *                 type: string
 *                 enum:
 *                   - Material
 *                   - Spray
 *                   - Labour
 *                   - Other
 *                   - Mixed
 *                 example: Material
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     material:
 *                       type: string
 *                       example: 68c555555555abcdef555555
 *                     materialName:
 *                       type: string
 *                       example: Urea
 *                     quantity:
 *                       type: number
 *                       example: 15
 *                     unit:
 *                       type: string
 *                       example: Kg
 *                     rate:
 *                       type: number
 *                       example: 25
 *                     total:
 *                       type: number
 *                       example: 375
 *               labourCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 600
 *               otherCost:
 *                 type: number
 *                 minimum: 0
 *                 example: 150
 *               notes:
 *                 type: string
 *                 example: Updated expense details
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       400:
 *         description: Invalid expense data
 *       404:
 *         description: Expense, farmer or field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", // authMiddleware,
  updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete expense
 *     tags: [Expenses]
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
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", // authMiddleware,
  deleteExpense);

module.exports = router;