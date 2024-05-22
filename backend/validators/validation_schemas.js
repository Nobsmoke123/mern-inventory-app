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

const updatePasswordSchema = joi.object({
  old_password: joi.string().required(),
  new_password: joi.string().required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
};
