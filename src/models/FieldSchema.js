const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
      index: true,
    },

    gatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    areaUnit: {
      type: String,
      enum: ["Acre", "Hectare", "Guntha"],
      default: "Acre",
    },

    crop: {
      type: String,
      trim: true,
    },

    season: {
      type: String,
      trim: true,
    },

    village: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same farmer cannot have duplicate Gat Number
FieldSchema.index(
  {
    farmer: 1,
    gatNumber: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Field", FieldSchema);