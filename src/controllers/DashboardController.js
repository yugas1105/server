const Farmer = require("../models/FarmerSchema");
const Field = require("../models/FieldSchema");
const Expense = require("../models/ExpenseItemSchema");
const Payment = require("../models/PaymentSchema");

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalFarmers,
      totalFields,
      totalGats,
      expenseSummary,
      paymentSummary,
      extraPaymentSummary,
      todayExpenseSummary,
      todayFarmerSummary,
      todayMaterialSummary,
    ] = await Promise.all([
      // Total Farmers
      Farmer.countDocuments(),

      // Total Fields
      Field.countDocuments(),

      // Total Gats
      // Each Field record represents one Gat
      Field.countDocuments(),

      // Total Expense
      Expense.aggregate([
        {
          $group: {
            _id: null,
            totalExpense: {
              $sum: "$totalExpense",
            },
          },
        },
      ]),

      // Total Payment
      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalPayment: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Extra Payment
      // Calculate farmer-wise:
      // payment - expense
      // Only positive balances are counted as Extra
      getExtraPayment(),

      // Today's Expense
      getTodayExpense(),

      // Today's unique farmers
      getTodayFarmers(),

      // Today's material quantity
      getTodayMaterial(),
    ]);

    const totalExpense =
      expenseSummary[0]?.totalExpense || 0;

    const totalPayment =
      paymentSummary[0]?.totalPayment || 0;

    const balance = totalExpense - totalPayment;

    return res.status(200).json({
      success: true,

      stats: {
        totalFarmers,

        totalFields,

        totalGats,

        totalExpense,

        totalPayment,

        balance,

        extraPayment: extraPaymentSummary,

        todayExpense: todayExpenseSummary,

        todayFarmers: todayFarmerSummary,

        todayMaterial: todayMaterialSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTodayStats = async (req, res, next) => {
  try {
    const {
      startOfToday,
      endOfToday,
    } = getTodayDateRange();

    const [
      expenseSummary,
      farmerSummary,
      materialSummary,
      paymentSummary,
    ] = await Promise.all([
      // Today's Expense
      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalExpense: {
              $sum: "$totalExpense",
            },
          },
        },
      ]),

      // Unique farmers who have expense entries today
      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $group: {
            _id: "$farmer",
          },
        },
        {
          $count: "totalFarmers",
        },
      ]),

      // Total material quantity used today
      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            totalQuantity: {
              $sum: "$items.quantity",
            },
            totalItems: {
              $sum: 1,
            },
          },
        },
      ]),

      // Today's payment
      Payment.aggregate([
        {
          $match: {
            date: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalPayment: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,

      date: startOfToday.toISOString().split("T")[0],

      stats: {
        todayExpense:
          expenseSummary[0]?.totalExpense || 0,

        todayFarmers:
          farmerSummary[0]?.totalFarmers || 0,

        todayMaterial:
          materialSummary[0]?.totalQuantity || 0,

        todayMaterialItems:
          materialSummary[0]?.totalItems || 0,

        todayPayment:
          paymentSummary[0]?.totalPayment || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyStats = async (req, res, next) => {
  try {
    const currentDate = new Date();

    const year = Number(
      req.query.year || currentDate.getFullYear()
    );

    const month = Number(
      req.query.month || currentDate.getMonth() + 1
    );

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12",
      });
    }

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 1);

    const [
      expenseSummary,
      paymentSummary,
    ] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
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
          },
        },
      ]),

      Payment.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,

            totalPayment: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const totalExpense =
      expenseSummary[0]?.totalExpense || 0;

    const totalPayment =
      paymentSummary[0]?.totalPayment || 0;

    return res.status(200).json({
      success: true,

      period: {
        year,
        month,
      },

      stats: {
        totalExpense,

        totalMaterialCost:
          expenseSummary[0]?.totalMaterialCost || 0,

        totalLabourCost:
          expenseSummary[0]?.totalLabourCost || 0,

        totalOtherCost:
          expenseSummary[0]?.totalOtherCost || 0,

        totalPayment,

        balance: totalExpense - totalPayment,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getExpenseSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};

    if (startDate || endDate) {
      match.date = {};

      if (startDate) {
        match.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setDate(end.getDate() + 1);

        match.date.$lt = end;
      }
    }

    const summary = await Expense.aggregate([
      {
        $match: match,
      },

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

          totalEntries: {
            $sum: 1,
          },
        },
      },
    ]);

    const data = summary[0] || {
      totalExpense: 0,
      totalMaterialCost: 0,
      totalLabourCost: 0,
      totalOtherCost: 0,
      totalEntries: 0,
    };

    return res.status(200).json({
      success: true,

      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },

      summary: data,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};

    if (startDate || endDate) {
      match.date = {};

      if (startDate) {
        match.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setDate(end.getDate() + 1);

        match.date.$lt = end;
      }
    }

    const summary = await Payment.aggregate([
      {
        $match: match,
      },

      {
        $group: {
          _id: "$paymentType",

          totalAmount: {
            $sum: "$amount",
          },

          totalEntries: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    const totalPayment = summary.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    const totalEntries = summary.reduce(
      (sum, item) => sum + item.totalEntries,
      0
    );

    return res.status(200).json({
      success: true,

      period: {
        startDate: startDate || null,
        endDate: endDate || null,
      },

      totalPayment,

      totalEntries,

      byPaymentType: summary,
    });
  } catch (error) {
    next(error);
  }
};

const getTodayDateRange = () => {
  const startOfToday = new Date();

  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();

  endOfToday.setHours(23, 59, 59, 999);

  return {
    startOfToday,
    endOfToday,
  };
};

const getTodayExpense = async () => {
  const {
    startOfToday,
    endOfToday,
  } = getTodayDateRange();

  const result = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
    },

    {
      $group: {
        _id: null,

        totalExpense: {
          $sum: "$totalExpense",
        },
      },
    },
  ]);

  return result[0]?.totalExpense || 0;
};

const getTodayFarmers = async () => {
  const {
    startOfToday,
    endOfToday,
  } = getTodayDateRange();

  const result = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
    },

    {
      $group: {
        _id: "$farmer",
      },
    },

    {
      $count: "totalFarmers",
    },
  ]);

  return result[0]?.totalFarmers || 0;
};

const getTodayMaterial = async () => {
  const {
    startOfToday,
    endOfToday,
  } = getTodayDateRange();

  const result = await Expense.aggregate([
    {
      $match: {
        date: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
    },

    {
      $unwind: "$items",
    },

    {
      $group: {
        _id: null,

        totalQuantity: {
          $sum: "$items.quantity",
        },

        totalItems: {
          $sum: 1,
        },
      },
    },
  ]);

  return result[0]?.totalQuantity || 0;
};
const getExtraPayment = async () => {
  const [expenseByFarmer, paymentByFarmer] =
    await Promise.all([
      Expense.aggregate([
        {
          $group: {
            _id: "$farmer",

            totalExpense: {
              $sum: "$totalExpense",
            },
          },
        },
      ]),

      Payment.aggregate([
        {
          $group: {
            _id: "$farmer",

            totalPayment: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

  const expenseMap = new Map();

  expenseByFarmer.forEach((item) => {
    expenseMap.set(
      item._id.toString(),
      item.totalExpense || 0
    );
  });

  let extraPayment = 0;

  paymentByFarmer.forEach((item) => {
    const farmerId = item._id.toString();

    const expense =
      expenseMap.get(farmerId) || 0;

    const payment =
      item.totalPayment || 0;

    const extra = payment - expense;

    if (extra > 0) {
      extraPayment += extra;
    }
  });

  return extraPayment;
};

module.exports = {
  getDashboardStats,
  getTodayStats,
  getMonthlyStats,
  getExpenseSummary,
  getPaymentSummary,
};