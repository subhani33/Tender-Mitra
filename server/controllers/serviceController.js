/**
 * Service Controller - Provides endpoints for service-related operations
 * like health checks, status monitoring, and diagnostics
 */

const connectDB = require('../db');
const logger = require('../utils/logger');

/**
 * @desc    Get service health status
 * @route   GET /api/service/health
 * @access  Public
 */
const getHealthStatus = async(req, res) => {
    try {
        const dbStatus = connectDB.isConnected() ?
            'connected' :
            (connectDB.isUsingMockData() ? 'mock' : 'disconnected');

        // Get system information
        const systemInfo = {
            nodeVersion: process.version,
            platform: process.platform,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime()
        };

        res.status(200).json({
            status: 'success',
            message: 'Service health status',
            data: {
                service: 'EdTodo API',
                status: 'UP',
                timestamp: new Date().toISOString(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                database: {
                    status: dbStatus,
                    usingMockData: connectDB.isUsingMockData() || false
                },
                system: process.env.NODE_ENV === 'development' ? systemInfo : undefined
            }
        });
    } catch (error) {
        logger.error(`Health check failed: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get service health status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Test database connection
 * @route   GET /api/service/test-db
 * @access  Public (but should be restricted in production)
 */
const testDatabaseConnection = async(req, res) => {
    // Only allow in development or with admin permission
    if (process.env.NODE_ENV === 'production') {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'This endpoint is restricted in production'
            });
        }
    }

    try {
        // Attempt to connect to database
        const isConnected = await connectDB();

        if (isConnected) {
            logger.info('Database connection test successful');
            return res.status(200).json({
                status: 'success',
                message: 'Database connection successful',
                data: {
                    connected: true,
                    usingMockData: connectDB.isUsingMockData() || false
                }
            });
        } else {
            logger.warn('Database connection test failed but using mock data');
            return res.status(200).json({
                status: 'warning',
                message: 'Database connection failed, using mock data',
                data: {
                    connected: false,
                    usingMockData: true
                }
            });
        }
    } catch (error) {
        logger.error(`Database connection test error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Database connection test failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * @desc    Force switch to mock data mode (for testing)
 * @route   POST /api/service/use-mock-data
 * @access  Private/Admin
 */
const switchToMockData = async(req, res) => {
    // Only allow in development or with admin permission
    if (process.env.NODE_ENV === 'production') {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'This endpoint is restricted in production'
            });
        }
    }

    try {
        // Set global flag to use mock data
        global.USING_MOCK_DATA = true;

        logger.info('Switched to mock data mode (manual override)');

        res.status(200).json({
            status: 'success',
            message: 'Switched to mock data mode',
            data: {
                usingMockData: true
            }
        });
    } catch (error) {
        logger.error(`Error switching to mock data: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'Failed to switch to mock data mode',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    getHealthStatus,
    testDatabaseConnection,
    switchToMockData
};