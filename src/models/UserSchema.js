const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // फक्त 4 digit passcode
    passcode: {
      type: String,
      required: true,
      minlength: 4,
      // maxlength: 4,
      // match: /^[0-9]{4}$/,
      // select: false,
    },

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
