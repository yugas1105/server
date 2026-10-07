const Payment = require("../models/PaymentSchema");
const Farmer = require("../models/FarmerSchema");
const Field = require("../models/FieldSchema");

// CREATE PAYMENT
const createPayment = async (req, res, next) => {
  try {
    const {
      date,
      farmer,
      field,
      amount,
      paymentType,
      remark,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Payment date is required",
      });
    }

    if (!farmer) {
      return res.status(400).json({
        success: false,
        message: "Farmer is required",
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Payment amount is required",
      });
    }

    // Check farmer
    const farmerExists = await Farmer.findById(farmer);

    if (!farmerExists) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // Check field if provided
    if (field) {
      const fieldExists = await Field.findById(field);

      if (!fieldExists) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      // Make sure field belongs to farmer
      if (fieldExists.farmer.toString() !== farmer.toString()) {
        return res.status(400).json({
          success: false,
          message: "Selected field does not belong to selected farmer",
        });
      }
    }

    const payment = await Payment.create({
      date,
      farmer,
      field,
      amount,
      paymentType,
      remark,
      createdBy: req.user?._id,
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("createdBy", "name role");

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PAYMENTS
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("createdBy", "name role")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// GET PAYMENT BY ID
const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("createdBy", "name role");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PAYMENT
const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      date,
      farmer,
      field,
      amount,
      paymentType,
      remark,
    } = req.body;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const updatedFarmer =
      farmer !== undefined ? farmer : payment.farmer;

    const updatedField =
      field !== undefined ? field : payment.field;

    // Check farmer if changed
    if (farmer !== undefined) {
      const farmerExists = await Farmer.findById(farmer);

      if (!farmerExists) {
        return res.status(404).json({
          success: false,
          message: "Farmer not found",
        });
      }
    }

    // Check field if provided
    if (updatedField) {
      const fieldExists = await Field.findById(updatedField);

      if (!fieldExists) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }

      // Make sure field belongs to farmer
      if (
        fieldExists.farmer.toString() !==
        updatedFarmer.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Selected field does not belong to selected farmer",
        });
      }
    }

    if (date !== undefined) {
      payment.date = date;
    }

    if (farmer !== undefined) {
      payment.farmer = farmer;
    }

    if (field !== undefined) {
      payment.field = field;
    }

    if (amount !== undefined) {
      payment.amount = amount;
    }

    if (paymentType !== undefined) {
      payment.paymentType = paymentType;
    }

    if (remark !== undefined) {
      payment.remark = remark;
    }

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("createdBy", "name role");

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PAYMENT
const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await Payment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};