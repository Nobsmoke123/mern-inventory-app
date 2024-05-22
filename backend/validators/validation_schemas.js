const joi = require('joi');

const signupSchema = joi.object({
  name: joi.string().min(6).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .alphanum()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().alphanum().required(),
});

module.exports = {
  signupSchema,
  loginSchema,
};
