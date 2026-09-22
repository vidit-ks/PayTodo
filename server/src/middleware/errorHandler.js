function errorHandler(err, req, res, next) {
  console.error('API Error:', err);

  const status = err.status || 500;
  const message = err.message || 'An unexpected internal error occurred.';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    success: false,
    code,
    message
  });
}

module.exports = errorHandler;
