const logger = require('../utils/logger');
const connectDB = require('../db');

/**
 * Global error handler middleware for Express
 * Handles different types of errors with appropriate status codes and messages
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Log error
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // Prepare error response object
    const errorResponse = {
        status: 'error',
        message: err.message || 'An unexpected error occurred'
    };

    // Development error response with stack trace and detailed information
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = err;
        errorResponse.stack = err.stack;
        errorResponse.system = {
            mongoDBConnected: connectDB.isConnected(),
            usingMockData: connectDB.isUsingMockData(),
            nodeEnv: process.env.NODE_ENV,
            nodeVersion: process.version
        };
    }

    // Add minimal system info even in production for critical errors
    if (statusCode >= 500) {
        errorResponse.dbStatus = connectDB.isConnected() ? 'connected' : 'disconnected';
    }

    return res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;