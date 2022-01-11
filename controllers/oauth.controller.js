const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const Oauth = require("../models/oauth.schema");
const User = require("../models/user.schema");
const Otp = require("../models/otp.schema");
const { postOauthSchema, patchUserPasswordSchema } = require("../validation/oauth.validation");
const { postOtpSchema, patchOtpSchema } = require('../validation/otp.validation');
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
    value.password = await bcrypt.compare(value.password, user.password);

    if (value.password === true) {
      const userToken = await jwt.sign({ _id: user.id.toString() }, process.env.TOKEN_KEY, { expiresIn: "1h" });
      const oauth = new Oauth({ token: userToken });
      await oauth.save();
      res.status(200).send({ message: userToken });
    } else {
      res.status(401).send("User unauthorized!!!");
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
    const authHeader = req.headers.authorization;
    const verifyToken = jwt.verify(authHeader, process.env.TOKEN_KEY);
    // eslint-disable-next-line no-underscore-dangle
    const userPassword = await User.findOne({ _id: verifyToken._id });
    value.newPassword = await bcrypt.hash(value.newPassword, 10);
    value.currentPassword = await bcrypt.compare(
      value.currentPassword,
      userPassword.password,
    );
    if (value.currentPassword === true) {
      userPassword.password = value.newPassword;
      await userPassword.save();
      res.status(200).send();
    } else {
      res.status(400).send({ message: "Invalid Password details" });
    }
  } catch (error) {
    if (error) {
      res.status(400).send({ message: "Invalid token" });
    } else {
      logger.error("Could not update password: ", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

const sendEmail = async (req, res) => {
  try {
    const { error, value } = postOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const userOtp = parseInt(Math.random() * 1000000, 10);
    const expireOtp = new Date().getTime() + 600 * 1000;
    const user = await User.findOne(req.body);

    if (user.email === value.email) {
      const otp = new Otp({
        email: value.email,
        otp: userOtp,
        expiresIn: expireOtp,
      });

      const transporter = nodemailer.createTransport(
        {
          host: process.env.HOST,
          service: process.env.SERVICE,
          secure: true,

          auth: {
            user: process.env.USERMAIL,
            pass: process.env.PASSWORD,
          },
        },
      );
      const mailOptions = {
        from: process.env.USERMAIL,
        to: value.email,
        subject: "forget password",
        text: `Dear user your one time security code is:${userOtp}`,
      };
      await transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.status(400).send({ message: "Otp coulden't send" });
        } else {
          res.status(201).send({ message: "Otp send successfully" });
        }
      });
      await otp.save();
      res.status(201).send();
    } else {
      res.status(400).send({ message: "Invalid email" });
    }
  } catch (error) {
    if (error) {
      res.status(400).send({ message: "Invalid email" });
    } else {
      logger.error("Could not send otp: ", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

const forgetPassword = async (req, res) => {
  try {
    const { error, value } = patchOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const userOtp = await Otp.findOne({ otp: req.body.token });
    const user = await User.findOne({ email: userOtp.email });
    value.newPassword = await bcrypt.hash(value.newPassword, 10);
    if (userOtp) {
      const currentTime = new Date().getTime();
      const timeDifference = userOtp.expiresIn - currentTime;
      if (timeDifference < 0) {
        res.status(404).send({ message: "Otp expired" });
      } else {
        user.password = value.newPassword;
        await user.save();
        res.status(204).send({ message: "User password updated" });
      }
    } else {
      res.status(404).send({ message: "Otp not found" });
    }
  } catch (error) {
    if (error) {
      res.status(400).send({ message: "Invalid details" });
    } else {
      logger.error("Could not send otp: ", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
  return null;
};

module.exports = {
  userLogin,
  restPassword,
  sendEmail,
  forgetPassword,
};
