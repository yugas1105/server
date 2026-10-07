const express = require("express");

const {
  getDateWiseReport,
  getFarmerWiseReport,
  getFieldWiseReport,
  getMaterialWiseReport,
  getMonthlyReport,
  getGrandTotal,
  getFarmerLedger,
  getFarmerMonthlyStatement,
} = require("../controllers/ReportController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Expense, payment and farmer reports
 */

/**
 * @swagger
 * /api/reports/date-wise:
 *   get:
 *     summary: Get date-wise report
 *     tags: [Reports]
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
 *         description: Date-wise report retrieved successfully
 *       400:
 *         description: Date is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/date-wise",
  // authMiddleware,
  getDateWiseReport
);

/**
 * @swagger
 * /api/reports/farmer-wise:
 *   get:
 *     summary: Get farmer-wise report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: farmerId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
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
 *         description: Farmer-wise report retrieved successfully
 *       400:
 *         description: Farmer ID is required
 *       404:
 *         description: Farmer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/farmer-wise",
  // authMiddleware,
  getFarmerWiseReport
);

/**
 * @swagger
 * /api/reports/field-wise:
 *   get:
 *     summary: Get field-wise report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fieldId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c987654321abcdef654321
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
 *         description: Field-wise report retrieved successfully
 *       400:
 *         description: Field ID is required
 *       404:
 *         description: Field not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/field-wise",
  // authMiddleware,
  getFieldWiseReport
);

/**
 * @swagger
 * /api/reports/material-wise:
 *   get:
 *     summary: Get material-wise report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: materialId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c555555555abcdef555555
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
 *         description: Material-wise report retrieved successfully
 *       400:
 *         description: Material ID is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/material-wise",
  // authMiddleware,
  getMaterialWiseReport
);

/**
 * @swagger
 * /api/reports/monthly:
 *   get:
 *     summary: Get monthly report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 10
 *     responses:
 *       200:
 *         description: Monthly report retrieved successfully
 *       400:
 *         description: Year and month are required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/monthly",
  // authMiddleware,
  getMonthlyReport
);

/**
 * @swagger
 * /api/reports/grand-total:
 *   get:
 *     summary: Get grand total report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Grand totals retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/grand-total",
  // authMiddleware,
  getGrandTotal
);

/**
 * @swagger
 * /api/reports/farmer-ledger:
 *   get:
 *     summary: Get farmer ledger
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: farmerId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
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
 *         description: Farmer ledger retrieved successfully
 *       400:
 *         description: Farmer ID is required
 *       404:
 *         description: Farmer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/farmer-ledger",
  // authMiddleware,
  getFarmerLedger
);

/**
 * @swagger
 * /api/reports/farmer-monthly-statement:
 *   get:
 *     summary: Get farmer monthly statement
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: farmerId
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2026
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         example: 10
 *     responses:
 *       200:
 *         description: Farmer monthly statement retrieved successfully
 *       400:
 *         description: Farmer ID, year and month are required
 *       404:
 *         description: Farmer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/farmer-monthly-statement",
  // authMiddleware,
  getFarmerMonthlyStatement
);

module.exports = router;