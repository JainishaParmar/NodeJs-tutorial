const mongoose = require("mongoose");

// Schema
const postOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      references: {
        model: 'User',
        key: 'email',
      },
    },
    otp: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Otp", postOtpSchema);
