// Fixed server.js file - see UI components for website fixes

const { server } = require('./app');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const connectDB = require('./db');
const express = require('express');

// Load environment variables
dotenv.config();

// Express app for health check if app.js doesn't provide it
const app = express();

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Service is healthy',
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async() => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);

    // Connect to database
    await connectDB();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.name}: ${err.message}`, { stack: err.stack });
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.name}: ${err.message}`, { stack: err.stack });
    process.exit(1);
});