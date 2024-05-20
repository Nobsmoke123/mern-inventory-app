const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : err.status || 500;

  res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
  next();
};

module.exports = errorHandler;
