const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUser,
  changePasscode,
} = require("../controllers/AuthController");

const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - passcode
 *             properties:
 *               name:
 *                 type: string
 *                 example: Admin
 *               passcode:
 *                 type: string
 *                 pattern: '^[0-9]{4}$'
 *                 example: "1234"
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - staff
 *                 example: staff
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request data
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerUser);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login using passcode
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passcode
 *             properties:
 *               passcode:
 *                 type: string
 *                 pattern: '^[0-9]{4}$'
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Passcode is required
 *       401:
 *         description: Invalid passcode
 *       403:
 *         description: User account is inactive
 *       500:
 *         description: Internal server error
 */
router.post("/login", loginUser);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/logout",
  // authMiddleware,
  logoutUser
);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all registered users without their passcodes.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68c123456789abcdef123456
 *                       name:
 *                         type: string
 *                         example: John
 *                       role:
 *                         type: string
 *                         example: user
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/get-all-users", getAllUsers);


/**
 * @swagger
 * /api/auth/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user using the provided user ID.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 6abf50b5abb15c79264a4e42
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/users/:userId",
  // authMiddleware,
  getCurrentUser
);

/**
 * @swagger
 * /api/auth/change-passcode:
 *   put:
 *     summary: Change current user's passcode
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPasscode
 *               - newPasscode
 *             properties:
 *               currentPasscode:
 *                 type: string
 *                 pattern: '^[0-9]{4}$'
 *                 example: "1234"
 *               newPasscode:
 *                 type: string
 *                 pattern: '^[0-9]{4}$'
 *                 example: "5678"
 *     responses:
 *       200:
 *         description: Passcode changed successfully
 *       400:
 *         description: Invalid passcode
 *       401:
 *         description: Current passcode is incorrect
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/change-passcode",
  // authMiddleware,
  changePasscode
);


module.exports = router;