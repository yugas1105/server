const Expense = require("../models/ExpenseItemSchema");
const Farmer = require("../models/FarmerSchema");
const Field = require("../models/FieldSchema");

// CREATE EXPENSE
const createExpense = async (req, res, next) => {
  try {
    const {
      date,
      farmer,
      field,
      workType,
      items,
      labourCost,
      otherCost,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Expense date is required",
      });
    }

    if (!farmer) {
      return res.status(400).json({
        success: false,
        message: "Farmer is required",
      });
    }

    if (!field) {
      return res.status(400).json({
        success: false,
        message: "Field is required",
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

    // Check field
    const fieldExists = await Field.findById(field);

    if (!fieldExists) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    // Make sure field belongs to selected farmer
    if (fieldExists.farmer.toString() !== farmer.toString()) {
      return res.status(400).json({
        success: false,
        message: "Selected field does not belong to selected farmer",
      });
    }

    const expense = await Expense.create({
      date,
      farmer,
      field,
      workType,
      items,
      labourCost,
      otherCost,
      notes,
      createdBy: req.user?._id,
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role");

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      expense: populatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EXPENSES
const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find()
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// GET EXPENSE BY ID
const getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id)
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE EXPENSE
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      date,
      farmer,
      field,
      workType,
      items,
      labourCost,
      otherCost,
      notes,
    } = req.body;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const updatedFarmer = farmer !== undefined ? farmer : expense.farmer;
    const updatedField = field !== undefined ? field : expense.field;

    // Check farmer
    if (farmer !== undefined) {
      const farmerExists = await Farmer.findById(farmer);

      if (!farmerExists) {
        return res.status(404).json({
          success: false,
          message: "Farmer not found",
        });
      }
    }

    // Check field
    if (field !== undefined) {
      const fieldExists = await Field.findById(field);

      if (!fieldExists) {
        return res.status(404).json({
          success: false,
          message: "Field not found",
        });
      }
    }

    // Make sure field belongs to farmer
    const fieldExists = await Field.findById(updatedField);

    if (!fieldExists) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    if (
      fieldExists.farmer.toString() !==
      updatedFarmer.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected field does not belong to selected farmer",
      });
    }

    if (date !== undefined) {
      expense.date = date;
    }

    if (farmer !== undefined) {
      expense.farmer = farmer;
    }

    if (field !== undefined) {
      expense.field = field;
    }

    if (workType !== undefined) {
      expense.workType = workType;
    }

    if (items !== undefined) {
      expense.items = items;
    }

    if (labourCost !== undefined) {
      expense.labourCost = labourCost;
    }

    if (otherCost !== undefined) {
      expense.otherCost = otherCost;
    }

    if (notes !== undefined) {
      expense.notes = notes;
    }

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id)
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role");

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE EXPENSE
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await Expense.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET EXPENSES BY FARMER
const getExpensesByFarmer = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const expenses = await Expense.find({
      farmer: farmerId,
    })
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// GET EXPENSES BY FIELD
const getExpensesByField = async (req, res, next) => {
  try {
    const { fieldId } = req.params;

    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    const expenses = await Expense.find({
      field: fieldId,
    })
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role")
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// GET EXPENSES BY DATE
const getExpensesByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);

    endDate.setDate(endDate.getDate() + 1);

    const expenses = await Expense.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      date,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// GET EXPENSES BY DATE RANGE
const getExpensesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Include the complete end date
    end.setDate(end.getDate() + 1);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be greater than end date",
      });
    }

    const expenses = await Expense.find({
      date: {
        $gte: start,
        $lt: end,
      },
    })
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop season")
      .populate("items.material", "name unit rate")
      .populate("createdBy", "name role")
      .sort({ date: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      startDate,
      endDate,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByFarmer,
  getExpensesByField,
  getExpensesByDate,
  getExpensesByDateRange,
};