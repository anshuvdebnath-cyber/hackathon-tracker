/**
 * ============================================================================
 * SECTION 34 – Global Error Handling Middleware
 * ============================================================================
 * In Express, error handling middleware is defined with 4 arguments:
 * (err, req, res, next)
 *
 * As taught in Section 34:
 * 1. Express recognizes this 4-argument signature as the catch-all error handler.
 * 2. It ensures the server does not crash unexpectedly when unhandled exceptions
 *    or async rejections occur.
 * 3. It standardizes JSON error responses across the entire REST API.
 * ============================================================================
 */

export function errorHandler(err, req, res, next) {
  // Section 34 – Log the error for developer debugging
  console.error('[Global Error Handler]:', err.stack || err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Provide stack trace in development only (security best practice)
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Cannot ${req.method} ${req.originalUrl} - Route Not Found`
  });
}

export default { errorHandler, notFoundHandler };
