const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const UserSchema = mongoose.Schema;
// Schema
const userSchema = new UserSchema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.userEmailValidation = async function userEmailValidation(userMail) {
  const userEmail = await this.constructor.findOne({ email: userMail });
  return userEmail;
};

userSchema.methods.generateAuthToken = function generateAuthToken() {
  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign({ _id: this._id.toString() }, process.env.TOKEN_KEY);
  return token;
};

userSchema.methods.verifyUserToken = async function verifyUserToken(req) {
  const authHeader = req.headers.authorization;
  const verifyToken = jwt.verify(authHeader, process.env.TOKEN_KEY);
  // eslint-disable-next-line no-underscore-dangle
  const user = await this.constructor.findOne({ _id: verifyToken._id });
  return user;
};

userSchema.methods.userPassword = async (userPass) => {
  const pasd = bcrypt.hash(userPass, 10);
  return pasd;
};

userSchema.methods.userPasswordCompare = function userPasswordCompare(PasswordCompare) {
  const password = bcrypt.compare(PasswordCompare, this.password);
  return password;
};

module.exports = mongoose.model("User", userSchema);
