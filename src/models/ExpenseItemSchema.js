const mongoose = require("mongoose");

const ExpenseItemSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },

    materialName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const ExpenseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
      index: true,
    },

    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
      index: true,
    },

    workType: {
      type: String,
      enum: [
        "Material",
        "Spray",
        "Labour",
        "Other",
        "Mixed",
      ],
      default: "Material",
    },

    items: [ExpenseItemSchema],

    labourCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMaterialCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalExpense: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


// Automatically calculate totals
ExpenseSchema.pre("validate", function (next) {
  this.items = this.items || [];

  this.items.forEach((item) => {
    item.total =
      Number(item.quantity || 0) *
      Number(item.rate || 0);
  });

  this.totalMaterialCost = this.items.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  this.totalExpense =
    this.totalMaterialCost +
    Number(this.labourCost || 0) +
    Number(this.otherCost || 0);

  next();
});

ExpenseSchema.index({
  farmer: 1,
  field: 1,
  date: 1,
});

module.exports = mongoose.model(
  "Expense",
  ExpenseSchema
);