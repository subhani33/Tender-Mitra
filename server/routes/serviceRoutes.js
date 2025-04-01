/**
 * Service Routes - Endpoints for service monitoring and management
 */

const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    getHealthStatus,
    testDatabaseConnection,
    switchToMockData
} = require('../controllers/serviceController');

// Public routes
router.get('/health', getHealthStatus);

// Protected routes (admin only in production)
router.get('/test-db', testDatabaseConnection);
router.post('/use-mock-data', protect, restrictTo('admin'), switchToMockData);

module.exports = router;