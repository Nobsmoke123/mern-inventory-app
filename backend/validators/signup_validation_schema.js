const joi = require('joi');

const schema = joi.object({
  name: joi.string().min(6).required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

module.exports = schema;
