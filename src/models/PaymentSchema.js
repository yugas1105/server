const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
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
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    paymentType: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Bank",
        "Cheque",
        "Other",
      ],
      default: "Cash",
    },

    remark: {
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

PaymentSchema.index({
  farmer: 1,
  field: 1,
  date: 1,
});

module.exports = mongoose.model(
  "Payment",
  PaymentSchema
);