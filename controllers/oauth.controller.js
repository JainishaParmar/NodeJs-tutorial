const jwt = require("jsonwebtoken");
const Oauth = require("../models/oauth.schema");
const User = require("../models/user.schema");
const { postOauthSchema, patchUserPasswordSchema } = require("../validation/oauth.validation");
const logger = require("../config/logger");
require('dotenv').config();

const userLogin = async (req, res) => {
  try {
    const { error, value } = postOauthSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const user = await User.findOne(
      { email: req.body.email },
    );
    if (value.password === user.password) {
      const token = await jwt.sign({ _id: req.params.id }, process.env.TOKEN_KEY, { expiresIn: "1h" });
      const oauth = new Oauth({ token });
      await oauth.save();
      res.status(201).send({ message: token });
    } else {
      res.status(401).send("User unauthorized");
    }
  } catch (error) {
    if (error) {
      res.status(401).send({ message: "User unauthorized" });
    } else {
      logger.error("Could not login: ", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

const restPassword = async (req, res) => {
  try {
    const { error, value } = patchUserPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const userPassword = await User.findOne(req.body);
    const authHeader = req.headers.authorization;
    jwt.verify(authHeader, process.env.TOKEN_KEY);
    if (userPassword.password !== value.currentPassword) {
      res.status(400).send({ message: "Invalid Password details" });
    } else {
      userPassword.password = value.newPassword;
      await userPassword.save();
      res.status(200).send();
    }
  } catch (error) {
    if (error) {
      res.status(400).send({ message: "Invalid token" });
    } else {
      logger.error("Could not update tutorial: ", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

module.exports = { userLogin, restPassword };
