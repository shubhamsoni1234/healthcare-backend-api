/**
 * Centralized application error handling middleware
 */
function errorHandler(err, req, res, next) {
  // Unique constraint error (e.g. duplicate email or mapping)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'Record';
    const message = field === 'email'
      ? 'Email is already registered'
      : (err.errors && err.errors[0] && err.errors[0].message) || 'Duplicate entry already exists';

    return res.status(409).json({
      success: false,
      message,
    });
  }

  // Model validation errors
  if (err.name === 'SequelizeValidationError') {
    const errorDetails = err.errors ? err.errors.map(e => e.message) : [err.message];
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails,
    });
  }

  // JWT authentication errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    });
  }

  // Known application errors with custom status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Fallback 500 error
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled Server Error:', err);
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

module.exports = errorHandler;
