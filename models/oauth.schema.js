const mongoose = require("mongoose");

// Schema
const postOauthSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Oauth", postOauthSchema);
