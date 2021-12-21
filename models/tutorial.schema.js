const mongoose = require("mongoose");

// Schema
const tutorialSchema = new mongoose.Schema(
  {
    published: {
      type: Boolean,
      required: true,
    },
  },
  // eslint-disable-next-line spellcheck/spell-checker
  { timestamps: true },
);

module.exports = mongoose.model("Tutorial", tutorialSchema);
