const express = require("express");

const {
  createFarmer,
  getAllFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  toggleFarmerStatus,
} = require("../controllers/FarmerController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Farmers
 *   description: Farmer management APIs
 */

/**
 * @swagger
 * /api/farmers:
 *   post:
 *     summary: Create a new farmer
 *     tags: [Farmers]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh Patil
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               village:
 *                 type: string
 *                 example: Kolhapur
 *               taluka:
 *                 type: string
 *                 example: Karveer
 *               address:
 *                 type: string
 *                 example: Main Road, Kolhapur
 *               notes:
 *                 type: string
 *                 example: Regular farmer
 *     responses:
 *       201:
 *         description: Farmer created successfully
 *       400:
 *         description: Farmer name is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", // authMiddleware,
   createFarmer);


/**
 * @swagger
 * /api/farmers:
 *   get:
 *     summary: Get all farmers
 *     tags: [Farmers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Farmers retrieved successfully
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
 *                 farmers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Farmer'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", // authMiddleware,
  getAllFarmers);


/**
 * @swagger
 * /api/farmers/{id}:
 *   get:
 *     summary: Get farmer by ID
 *     tags: [Farmers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Farmer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 farmer:
 *                   $ref: '#/components/schemas/Farmer'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Farmer not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", // authMiddleware,
  getFarmerById);


/**
 * @swagger
 * /api/farmers/{id}:
 *   put:
 *     summary: Update farmer
 *     tags: [Farmers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh Patil
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               village:
 *                 type: string
 *                 example: Kolhapur
 *               taluka:
 *                 type: string
 *                 example: Karveer
 *               address:
 *                 type: string
 *                 example: Main Road, Kolhapur
 *               notes:
 *                 type: string
 *                 example: Updated farmer details
 *     responses:
 *       200:
 *         description: Farmer updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Farmer not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id",// authMiddleware,
   updateFarmer);


/**
 * @swagger
 * /api/farmers/{id}:
 *   delete:
 *     summary: Delete farmer
 *     tags: [Farmers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Farmer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Farmer not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", // authMiddleware,
  deleteFarmer);


/**
 * @swagger
 * /api/farmers/{id}/toggle-status:
 *   patch:
 *     summary: Toggle farmer active status
 *     tags: [Farmers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 68c123456789abcdef123456
 *     responses:
 *       200:
 *         description: Farmer status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Farmer not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/toggle-status",
  // authMiddleware,
  toggleFarmerStatus
);

module.exports = router;