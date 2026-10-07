const express = require("express");

const {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  toggleMaterialStatus,
  updateMaterialRate,
  searchMaterials,
} = require("../controllers/MaterialController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Material management APIs
 */

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Create a new material
 *     tags: [Materials]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - rate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Urea
 *               unit:
 *                 type: string
 *                 example: Kg
 *               rate:
 *                 type: number
 *                 minimum: 0
 *                 example: 25
 *               description:
 *                 type: string
 *                 example: Nitrogen fertilizer
 *     responses:
 *       201:
 *         description: Material created successfully
 *       400:
 *         description: Material name or rate is required
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Material already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", // authMiddleware,
  createMaterial);

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Get all materials
 *     tags: [Materials]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Materials retrieved successfully
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
 *                 materials:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Material'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", // authMiddleware,
  getAllMaterials);

/**
 * @swagger
 * /api/materials/search:
 *   get:
 *     summary: Search materials
 *     tags: [Materials]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         example: Urea
 *     responses:
 *       200:
 *         description: Materials searched successfully
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
 *                   example: 2
 *                 materials:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Material'
 *       400:
 *         description: Search term is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/search", // authMiddleware,
  searchMaterials);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Get material by ID
 *     tags: [Materials]
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
 *         description: Material retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 material:
 *                   $ref: '#/components/schemas/Material'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", // authMiddleware,
  getMaterialById);

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Update material
 *     tags: [Materials]
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
 *               name:
 *                 type: string
 *                 example: Urea
 *               unit:
 *                 type: string
 *                 example: Kg
 *               rate:
 *                 type: number
 *                 minimum: 0
 *                 example: 28
 *               description:
 *                 type: string
 *                 example: Nitrogen fertilizer
 *     responses:
 *       200:
 *         description: Material updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 *       409:
 *         description: Material name already exists
 *       500:
 *         description: Internal server error
 */
router.put("/:id", // authMiddleware,
  updateMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Delete material
 *     tags: [Materials]
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
 *         description: Material deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", // authMiddleware,
  deleteMaterial);

/**
 * @swagger
 * /api/materials/{id}/toggle-status:
 *   patch:
 *     summary: Toggle material active status
 *     tags: [Materials]
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
 *         description: Material status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/toggle-status",
//authMiddleware,
  toggleMaterialStatus
);

/**
 * @swagger
 * /api/materials/{id}/rate:
 *   patch:
 *     summary: Update material rate
 *     tags: [Materials]
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
 *             required:
 *               - rate
 *             properties:
 *               rate:
 *                 type: number
 *                 minimum: 0
 *                 example: 30
 *     responses:
 *       200:
 *         description: Material rate updated successfully
 *       400:
 *         description: Material rate is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Material not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/rate", // authMiddleware,
  updateMaterialRate);

module.exports = router;