const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error for backend debugging
  console.error(`[Error] ${req.method} ${req.url}:`, err.stack || err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error occurred',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
