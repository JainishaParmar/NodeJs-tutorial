const { CastError } = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.schema");
const { postUserSchema, patchUserSchema } = require("../validation/user.validation");
const logger = require("../config/logger");

// user create
const createUser = async (req, res) => {
  try {
    const { error, value } = postUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    value.password = await bcrypt.hash(value.password, 10);
    const user = new User(value);
    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      res.status(409).send({ message: "Email already registered" });
    } else {
      await user.save();
      res.status(201).send(user);
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(400).send({ message: "Invalid User Details" });
    } else {
      logger.error("Could not create user: ", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

const updateUser = async (req, res) => {
  try {
    const { error, value } = patchUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const userEmail = await User.findOne({ email: req.body.email });
    if (userEmail) {
      res.status(409).send({ message: "Email already exist" });
    } else {
      await User.findByIdAndUpdate({ _id: req.params.id }, value);
      res.status(204).send({ message: "User updated" });
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "User not found" });
    } else {
      logger.error("Couldn't update a user", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

module.exports = {
  createUser,
  updateUser,
};
