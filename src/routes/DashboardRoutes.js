const express = require("express");

const {
  getDashboardStats,
  getTodayStats,
  getMonthlyStats,
  getExpenseSummary,
  getPaymentSummary,
} = require("../controllers/DashboardController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard statistics and summary APIs
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get overall dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalFarmers:
 *                       type: integer
 *                       example: 22
 *                     totalFields:
 *                       type: integer
 *                       example: 28
 *                     totalGats:
 *                       type: integer
 *                       example: 28
 *                     totalExpense:
 *                       type: number
 *                       example: 125500
 *                     totalPayment:
 *                       type: number
 *                       example: 98000
 *                     balance:
 *                       type: number
 *                       example: 27500
 *                     extraPayment:
 *                       type: number
 *                       example: 8500
 *                     todayExpense:
 *                       type: number
 *                       example: 4250
 *                     todayFarmers:
 *                       type: integer
 *                       example: 5
 *                     todayMaterial:
 *                       type: number
 *                       example: 18
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/stats",
  // authMiddleware,
  getDashboardStats
);

/**
 * @swagger
 * /api/dashboard/today:
 *   get:
 *     summary: Get today's dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Today's statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: 2026-10-01
 *                 stats:
 *                   type: object
 *                   properties:
 *                     todayExpense:
 *                       type: number
 *                       example: 4250
 *                     todayFarmers:
 *                       type: integer
 *                       example: 5
 *                     todayMaterial:
 *                       type: number
 *                       example: 18
 *                     todayMaterialItems:
 *                       type: integer
 *                       example: 6
 *                     todayPayment:
 *                       type: number
 *                       example: 5000
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/today",
  // authMiddleware,
  getTodayStats
);

/**
 * @swagger
 * /api/dashboard/monthly:
 *   get:
 *     summary: Get monthly dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 10
 *     responses:
 *       200:
 *         description: Monthly statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 period:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                       example: 2026
 *                     month:
 *                       type: integer
 *                       example: 10
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalExpense:
 *                       type: number
 *                       example: 125500
 *                     totalMaterialCost:
 *                       type: number
 *                       example: 85500
 *                     totalLabourCost:
 *                       type: number
 *                       example: 25000
 *                     totalOtherCost:
 *                       type: number
 *                       example: 15000
 *                     totalPayment:
 *                       type: number
 *                       example: 98000
 *                     balance:
 *                       type: number
 *                       example: 27500
 *       400:
 *         description: Month must be between 1 and 12
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/monthly",
  // authMiddleware,
  getMonthlyStats
);

/**
 * @swagger
 * /api/dashboard/expense-summary:
 *   get:
 *     summary: Get expense summary
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-01
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-31
 *     responses:
 *       200:
 *         description: Expense summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 period:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       nullable: true
 *                       example: 2026-10-01
 *                     endDate:
 *                       type: string
 *                       nullable: true
 *                       example: 2026-10-31
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalExpense:
 *                       type: number
 *                       example: 125500
 *                     totalMaterialCost:
 *                       type: number
 *                       example: 85500
 *                     totalLabourCost:
 *                       type: number
 *                       example: 25000
 *                     totalOtherCost:
 *                       type: number
 *                       example: 15000
 *                     totalEntries:
 *                       type: integer
 *                       example: 120
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/expense-summary",
  // authMiddleware,
  getExpenseSummary
);

/**
 * @swagger
 * /api/dashboard/payment-summary:
 *   get:
 *     summary: Get payment summary
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-01
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-10-31
 *     responses:
 *       200:
 *         description: Payment summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 period:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                       nullable: true
 *                       example: 2026-10-01
 *                     endDate:
 *                       type: string
 *                       nullable: true
 *                       example: 2026-10-31
 *                 totalPayment:
 *                   type: number
 *                   example: 98000
 *                 totalEntries:
 *                   type: integer
 *                   example: 32
 *                 byPaymentType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: UPI
 *                       totalAmount:
 *                         type: number
 *                         example: 60000
 *                       totalEntries:
 *                         type: integer
 *                         example: 15
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/payment-summary",
  // authMiddleware,
  getPaymentSummary
);

module.exports = router;