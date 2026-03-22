'use strict';

/**
 * Centralized error-handling middleware.
 * Always returns a JSON response so clients never receive an HTML error page.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // Log full stack in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  } else {
    console.error(`[${new Date().toISOString()}] ${status} ${message}`);
  }

  res.status(status).json({ error: message });
}

module.exports = errorMiddleware;
