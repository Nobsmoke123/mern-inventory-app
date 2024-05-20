const joi = require('joi');

const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log(err);
    if (err instanceof joi.ValidationError) {
      res.status(400);
    } else {
      res.status(500);
    }

    next(err);
  });
};

module.exports = asyncWrapper;
