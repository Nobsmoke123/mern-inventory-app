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

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

const resetPasswordSchema = joi.object({
  password: joi.string().required(),
});

const createProductValidationSchema = joi.object({
  name: joi.string().required(),
  sku: joi.string().required(),
  category: joi.string().required(),
  quantity: joi.number().required(),
  price: joi.number().required(),
  description: joi.string().required(),
  image: joi.allow(),
});

const updateProductValidationSchema = joi.object({
  name: joi.string(),
  sku: joi.string(),
  category: joi.string(),
  quantity: joi.number(),
  price: joi.number(),
  description: joi.string(),
  image: joi.allow(),
});

module.exports = {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createProductValidationSchema,
  updateProductValidationSchema,
};
