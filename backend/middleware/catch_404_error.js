const catch404Error = (req, res, next) => {
  const error = new Error('Not Found.');
  res.status(404);
  error.status = 404;
  next(error);
};

module.exports = catch404Error;
