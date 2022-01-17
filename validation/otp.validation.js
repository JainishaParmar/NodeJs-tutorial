const joi = require("joi");

const postOtpSchema = joi.object({
  email: joi.string().email().required(),
});

const patchOtpSchema = joi.object({
  token: joi.string().required(),
  newPassword: joi.string().min(8).max(20).required(),
});

module.exports = { postOtpSchema, patchOtpSchema };
