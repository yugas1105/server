const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

const registerUser = async (req, res, next) => {
  try {
    const { name, passcode, role } = req.body;

    if (!name || !passcode) {
      return res.status(400).json({
        success: false,
        message: "Name and passcode are required",
      });
    }

    // Validate 4-digit passcode
    if (!/^\d{4}$/.test(passcode)) {
      return res.status(400).json({
        success: false,
        message: "Passcode must be exactly 4 digits",
      });
    }

    // Check whether user already exists
    const existingUser = await User.findOne({
      name: name.trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash passcode
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    const user = await User.create({
      name: name.trim(),
      passcode: hashedPasscode,
      role: role || "admin",
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { name, passcode } = req.body;

    // Validate input
    if (!name || !passcode) {
      return res.status(400).json({
        success: false,
        message: "Name and passcode are required",
      });
    }

    const user = await User.findOne({
      name: name.trim(),
    }).select("+passcode");

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid name or passcode",
      });
    }

    // Check account status
    if (user.isActive !== true) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Compare entered passcode with hashed passcode
    const isMatch = await bcrypt.compare(
      passcode,
      user.passcode
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid name or passcode",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-passcode")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
const changePasscode = async (req, res, next) => {
  try {
    const {
      userId,
      currentPasscode,
      newPasscode,
    } = req.body;

    if (!userId || !currentPasscode || !newPasscode) {
      return res.status(400).json({
        success: false,
        message: "User ID, current passcode and new passcode are required",
      });
    }

    if (!/^\d{4}$/.test(newPasscode)) {
      return res.status(400).json({
        success: false,
        message: "New passcode must be exactly 4 digits",
      });
    }

    const user = await User.findById(userId).select("+passcode");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPasscode,
      user.passcode
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current passcode is incorrect",
      });
    }

    user.passcode = await bcrypt.hash(newPasscode, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Passcode changed successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUser,
  changePasscode,
};