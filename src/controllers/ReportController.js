const mongoose = require("mongoose");

const Expense = require("../models/ExpenseItemSchema");
const Payment = require("../models/PaymentSchema");
const Farmer = require("../models/FarmerSchema");
const Field = require("../models/FieldSchema");

const getDateWiseReport = async (req, res, next) => {
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
      .populate("field", "gatNumber area areaUnit crop")
      .populate("items.material", "name unit rate")
      .sort({ date: 1 });

    const payments = await Payment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("farmer", "name mobile village")
      .populate("field", "gatNumber area areaUnit crop")
      .sort({ date: 1 });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.totalExpense || 0),
      0
    );

    const totalPayment = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      date,
      summary: {
        totalExpenses: expenses.length,
        totalPayments: payments.length,
        totalExpense,
        totalPayment,
      },
      expenses,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

const getFarmerWiseReport = async (req, res, next) => {
  try {
    const { farmerId, startDate, endDate } = req.query;

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "Farmer ID is required",
      });
    }

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const expenseFilter = {
      farmer: farmerId,
    };

    const paymentFilter = {
      farmer: farmerId,
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      end.setDate(end.getDate() + 1);

      expenseFilter.date = {
        $gte: start,
        $lt: end,
      };

      paymentFilter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const expenses = await Expense.find(expenseFilter)
      .populate("field", "gatNumber area areaUnit crop")
      .populate("items.material", "name unit rate")
      .sort({ date: 1 });

    const payments = await Payment.find(paymentFilter)
      .populate("field", "gatNumber area areaUnit crop")
      .sort({ date: 1 });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.totalExpense || 0),
      0
    );

    const totalPayment = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      farmer,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      summary: {
        totalExpenses: expenses.length,
        totalPayments: payments.length,
        totalExpense,
        totalPayment,
        balance: totalExpense - totalPayment,
      },
      expenses,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

const getFieldWiseReport = async (req, res, next) => {
  try {
    const { fieldId, startDate, endDate } = req.query;

    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: "Field ID is required",
      });
    }

    const field = await Field.findById(fieldId).populate(
      "farmer",
      "name mobile village"
    );

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    const expenseFilter = {
      field: fieldId,
    };

    const paymentFilter = {
      field: fieldId,
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      end.setDate(end.getDate() + 1);

      expenseFilter.date = {
        $gte: start,
        $lt: end,
      };

      paymentFilter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const expenses = await Expense.find(expenseFilter)
      .populate("farmer", "name mobile village")
      .populate("items.material", "name unit rate")
      .sort({ date: 1 });

    const payments = await Payment.find(paymentFilter)
      .populate("farmer", "name mobile village")
      .sort({ date: 1 });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.totalExpense || 0),
      0
    );

    const totalPayment = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      field,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      summary: {
        totalExpenses: expenses.length,
        totalPayments: payments.length,
        totalExpense,
        totalPayment,
        balance: totalExpense - totalPayment,
      },
      expenses,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

const getMaterialWiseReport = async (req, res, next) => {
  try {
    const { materialId, startDate, endDate } = req.query;

    if (!materialId) {
      return res.status(400).json({
        success: false,
        message: "Material ID is required",
      });
    }

    const match = {
      "items.material": new mongoose.Types.ObjectId(materialId),
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      end.setDate(end.getDate() + 1);

      match.date = {
        $gte: start,
        $lt: end,
      };
    }

    const report = await Expense.aggregate([
      {
        $match: match,
      },

      {
        $unwind: "$items",
      },

      {
        $match: {
          "items.material": new mongoose.Types.ObjectId(materialId),
        },
      },

      {
        $group: {
          _id: "$items.material",
          materialName: {
            $first: "$items.materialName",
          },
          unit: {
            $first: "$items.unit",
          },
          totalQuantity: {
            $sum: "$items.quantity",
          },
          totalAmount: {
            $sum: "$items.total",
          },
          usageCount: {
            $sum: 1,
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      materialId,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      report: report[0] || {
        materialName: null,
        unit: null,
        totalQuantity: 0,
        totalAmount: 0,
        usageCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyReport = async (req, res, next) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    const startDate = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    const endDate = new Date(
      Number(year),
      Number(month),
      1
    );

    const expenses = await Expense.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("farmer", "name")
      .populate("field", "gatNumber")
      .sort({ date: 1 });

    const payments = await Payment.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("farmer", "name")
      .populate("field", "gatNumber")
      .sort({ date: 1 });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.totalExpense || 0),
      0
    );

    const totalPayment = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    // Daily breakdown
    const dailyReport = {};

    expenses.forEach((expense) => {
      const day = new Date(expense.date)
        .toISOString()
        .split("T")[0];

      if (!dailyReport[day]) {
        dailyReport[day] = {
          date: day,
          expense: 0,
          payment: 0,
        };
      }

      dailyReport[day].expense += expense.totalExpense || 0;
    });

    payments.forEach((payment) => {
      const day = new Date(payment.date)
        .toISOString()
        .split("T")[0];

      if (!dailyReport[day]) {
        dailyReport[day] = {
          date: day,
          expense: 0,
          payment: 0,
        };
      }

      dailyReport[day].payment += payment.amount || 0;
    });

    return res.status(200).json({
      success: true,
      year: Number(year),
      month: Number(month),
      summary: {
        totalExpenses: expenses.length,
        totalPayments: payments.length,
        totalExpense,
        totalPayment,
        balance: totalExpense - totalPayment,
      },
      dailyReport: Object.values(dailyReport),
      expenses,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

const getGrandTotal = async (req, res, next) => {
  try {
    const expenseResult = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: "$totalExpense",
          },
          totalMaterialCost: {
            $sum: "$totalMaterialCost",
          },
          totalLabourCost: {
            $sum: "$labourCost",
          },
          totalOtherCost: {
            $sum: "$otherCost",
          },
          expenseCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const paymentResult = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPayment: {
            $sum: "$amount",
          },
          paymentCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const expenseData = expenseResult[0] || {
      totalExpense: 0,
      totalMaterialCost: 0,
      totalLabourCost: 0,
      totalOtherCost: 0,
      expenseCount: 0,
    };

    const paymentData = paymentResult[0] || {
      totalPayment: 0,
      paymentCount: 0,
    };

    return res.status(200).json({
      success: true,
      summary: {
        totalExpense: expenseData.totalExpense,
        totalMaterialCost: expenseData.totalMaterialCost,
        totalLabourCost: expenseData.totalLabourCost,
        totalOtherCost: expenseData.totalOtherCost,
        totalPayment: paymentData.totalPayment,
        balance:
          expenseData.totalExpense - paymentData.totalPayment,
        expenseCount: expenseData.expenseCount,
        paymentCount: paymentData.paymentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// FARMER LEDGER
// =====================================================
const getFarmerLedger = async (req, res, next) => {
  try {
    const { farmerId, startDate, endDate } = req.query;

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "Farmer ID is required",
      });
    }

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const expenseFilter = {
      farmer: farmerId,
    };

    const paymentFilter = {
      farmer: farmerId,
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      end.setDate(end.getDate() + 1);

      expenseFilter.date = {
        $gte: start,
        $lt: end,
      };

      paymentFilter.date = {
        $gte: start,
        $lt: end,
      };
    }

    const expenses = await Expense.find(expenseFilter)
      .populate("field", "gatNumber")
      .sort({ date: 1 });

    const payments = await Payment.find(paymentFilter)
      .populate("field", "gatNumber")
      .sort({ date: 1 });

    const transactions = [];

    expenses.forEach((expense) => {
      transactions.push({
        date: expense.date,
        type: "Expense",
        field: expense.field,
        description: expense.workType,
        debit: expense.totalExpense || 0,
        credit: 0,
      });
    });

    payments.forEach((payment) => {
      transactions.push({
        date: payment.date,
        type: "Payment",
        field: payment.field,
        description: payment.paymentType,
        debit: 0,
        credit: payment.amount || 0,
      });
    });

    transactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let balance = 0;

    transactions.forEach((transaction) => {
      balance += transaction.debit - transaction.credit;
      transaction.balance = balance;
    });

    const totalDebit = transactions.reduce(
      (sum, transaction) => sum + transaction.debit,
      0
    );

    const totalCredit = transactions.reduce(
      (sum, transaction) => sum + transaction.credit,
      0
    );

    return res.status(200).json({
      success: true,
      farmer,
      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },
      summary: {
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit,
      },
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

const getFarmerMonthlyStatement = async (req, res, next) => {
  try {
    const { farmerId, year, month } = req.query;

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "Farmer ID is required",
      });
    }

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Year and month are required",
      });
    }

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const startDate = new Date(
      Number(year),
      Number(month) - 1,
      1
    );

    const endDate = new Date(
      Number(year),
      Number(month),
      1
    );

    const expenses = await Expense.find({
      farmer: farmerId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("field", "gatNumber")
      .sort({ date: 1 });

    const payments = await Payment.find({
      farmer: farmerId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("field", "gatNumber")
      .sort({ date: 1 });

    const transactions = [];

    expenses.forEach((expense) => {
      transactions.push({
        date: expense.date,
        type: "Expense",
        field: expense.field,
        description: expense.workType,
        debit: expense.totalExpense || 0,
        credit: 0,
      });
    });

    payments.forEach((payment) => {
      transactions.push({
        date: payment.date,
        type: "Payment",
        field: payment.field,
        description: payment.paymentType,
        debit: 0,
        credit: payment.amount || 0,
      });
    });

    transactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let balance = 0;

    transactions.forEach((transaction) => {
      balance += transaction.debit - transaction.credit;
      transaction.balance = balance;
    });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.totalExpense || 0),
      0
    );

    const totalPayment = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );

    return res.status(200).json({
      success: true,
      farmer,
      year: Number(year),
      month: Number(month),
      summary: {
        totalExpense,
        totalPayment,
        balance: totalExpense - totalPayment,
      },
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDateWiseReport,
  getFarmerWiseReport,
  getFieldWiseReport,
  getMaterialWiseReport,
  getMonthlyReport,
  getGrandTotal,
  getFarmerLedger,
  getFarmerMonthlyStatement,
};