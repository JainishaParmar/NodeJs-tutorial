const mangoose = require('mongoose');

const tutorialSchema = new mangoose.Schema({
  id: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
const Tutorial = new mangoose.model("Tutorial", tutorialSchema);
module.exports = Tutorial;
