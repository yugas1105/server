const express = require("express");

const {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
  toggleFieldStatus,
  getFieldsByFarmer,
  checkGatNumberAvailability,
} = require("../controllers/FieldController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Fields
 *   description: Field / Gat management APIs
 */

/**
 * @swagger
 * /api/fields:
 *   post:
 *     summary: Create a new field
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - farmer
 *               - gatNumber
 *               - area
 *             properties:
 *               farmer:
 *                 type: string
 *                 example: 68c123456789abcdef123456
 *               gatNumber:
 *                 type: string
 *                 example: GAT-101
 *               area:
 *                 type: number
 *                 example: 2.5
 *               areaUnit:
 *                 type: string
 *                 enum:
 *                   - Acre
 *                   - Hectare
 *                   - Guntha
 *                 example: Acre
 *               crop:
 *                 type: string
 *                 example: Soybean
 *               season:
 *                 type: string
 *                 example: Kharif
 *               village:
 *                 type: string
 *                 example: Nagpur
 *               notes:
 *                 type: string
 *                 example: Irrigated field
 *     responses:
 *       201:
 *         description: Field created successfully
 *       400:
 *         description: Required field is missing
 *       404:
 *         description: Farmer not found
 *       409:
 *         description: Gat number already exists for this farmer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", // authMiddleware,
  createField);

/**
 * @swagger
 * /api/fields:
 *   get:
 *     summary: Get all fields
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fields retrieved successfully
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
 *                   example: 10
 *                 fields:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Field'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", // authMiddleware,
  getAllFields);

/**
 * @swagger
 * /api/fields/check-gat-number:
 *   get:
 *     summary: Check Gat number availability
 *     tags: [Fields]
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
 *         name: gatNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: GAT-101
 *     responses:
 *       200:
 *         description: Gat number availability checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 available:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Gat number is available
 *       400:
 *         description: Farmer ID or Gat number is missing
 *       404:
 *         description: Farmer not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/check-gat-number",
  // authMiddleware,
  checkGatNumberAvailability
);

/**
 * @swagger
 * /api/fields/farmer/{farmerId}:
 *   get:
 *     summary: Get all fields of a farmer
 *     tags: [Fields]
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
 *         description: Farmer fields retrieved successfully
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
 *                   example: 3
 *                 fields:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Field'
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
  getFieldsByFarmer
);

/**
 * @swagger
 * /api/fields/{id}:
 *   get:
 *     summary: Get field by ID
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c987654321abcdef654321
 *     responses:
 *       200:
 *         description: Field retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 field:
 *                   $ref: '#/components/schemas/Field'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Field not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", // authMiddleware,
  getFieldById);

/**
 * @swagger
 * /api/fields/{id}:
 *   put:
 *     summary: Update field
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c987654321abcdef654321
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farmer:
 *                 type: string
 *                 example: 68c123456789abcdef123456
 *               gatNumber:
 *                 type: string
 *                 example: GAT-101
 *               area:
 *                 type: number
 *                 example: 3
 *               areaUnit:
 *                 type: string
 *                 enum:
 *                   - Acre
 *                   - Hectare
 *                   - Guntha
 *                 example: Acre
 *               crop:
 *                 type: string
 *                 example: Wheat
 *               season:
 *                 type: string
 *                 example: Rabi
 *               village:
 *                 type: string
 *                 example: Nagpur
 *               notes:
 *                 type: string
 *                 example: Updated field details
 *     responses:
 *       200:
 *         description: Field updated successfully
 *       404:
 *         description: Field or farmer not found
 *       409:
 *         description: Gat number already exists for this farmer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:id", // authMiddleware,
  updateField);

/**
 * @swagger
 * /api/fields/{id}:
 *   delete:
 *     summary: Delete field
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c987654321abcdef654321
 *     responses:
 *       200:
 *         description: Field deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Field not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", // authMiddleware,
  deleteField);

/**
 * @swagger
 * /api/fields/{id}/toggle-status:
 *   patch:
 *     summary: Toggle field active status
 *     tags: [Fields]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c987654321abcdef654321
 *     responses:
 *       200:
 *         description: Field status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Field not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/toggle-status",
  // authMiddleware,
  toggleFieldStatus
);

module.exports = router;