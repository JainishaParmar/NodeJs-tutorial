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
    const user = new User(value);
    const userEmailVerify = await user.userEmailValidation(value.email);
    if (userEmailVerify) {
      res.status(409).send({ message: "Email already registered" });
    } else {
      user.password = await user.userPassword(value.password);
      await user.save();
      res.status(201).send(user);
    }
  } catch (error) {
    logger.error("Could not create user: ", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
  return null;
};

const updateUser = async (req, res) => {
  try {
    const { error, value } = patchUserSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const user = await User.findOne({ id: req.params.id });
    const verifyUser = await user.verifyUserToken(req);
    const userEmailVerify = await verifyUser.userEmailValidation(value.email);
    if (verifyUser.id !== req.params.id) {
      res.status(400).send({ message: "Invalid id" });
    } else if (userEmailVerify) {
      res.status(409).send({ message: "Email already registered" });
      return userEmailVerify;
    } else {
      await User.findByIdAndUpdate({ _id: req.params.id }, value);
      res.status(204).send({ message: "User updated" });
    }
  } catch (error) {
    if (error) {
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
