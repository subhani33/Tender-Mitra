const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const mockTenderService = require('../services/mockTenderService');
const logger = require('../utils/logger');

/**
 * Tender Routes
 * API endpoints for tender management
 */

// Helper function to safely get controller methods
const safeController = (controllerMethod) => {
    return typeof controllerMethod === 'function' ?
        controllerMethod :
        (req, res) => {
            logger.warn(`Using mock implementation for missing controller method`);
            res.status(200).json(mockTenderService.getTenders(req.query));
        };
};

// Public routes
router.get('/', safeController(tenderController.getAllTenders));
router.get('/search', safeController(tenderController.searchTenders));
router.get('/categories', safeController(tenderController.getTenderCategories));
router.get('/departments', safeController(tenderController.getTenderDepartments));
router.get('/stats', safeController(tenderController.getTenderStats));
router.get('/closing-soon', safeController(tenderController.getTendersClosingSoon));
router.get('/:id', safeController(tenderController.getTenderById || tenderController.getTender));

// Mock endpoints for frontend development
router.get('/mock', async(req, res, next) => {
    try {
        const result = await mockTenderService.getTenders(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Protected routes require authentication
router.use((req, res, next) => {
    // For development, bypass authentication
    next();
});

// Save/unsave tenders simplified for development
router.patch('/:id/save', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { isSaved: true }
    });
});

router.post('/:id/save', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { isSaved: true }
    });
});

router.delete('/:id/save', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { isSaved: false }
    });
});

router.get('/user/saved', async(req, res) => {
    try {
        const result = await mockTenderService.getTenders({ limit: 5 });
        res.status(200).json({
            status: 'success',
            data: { tenders: result.data.tenders }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch saved tenders'
        });
    }
});

module.exports = router;