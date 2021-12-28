const joi = require("joi");

const postTutorialSchema = joi.object({
  title: joi.string().min(3).max(100).required()
    .messages({
      'string.base': `should be a type of 'text'`,
      'string.min': `should have a minimum length of 3`,
      'any.required': `is a required field`,
      'string.max': `should have a minimum length of 3`,
    }),
  description: joi.string().min(1).max(5000).required(),
  published: joi.boolean().required(),
});

module.exports = { postTutorialSchema };
