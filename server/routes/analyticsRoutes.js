const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Simplified mock implementation of analytics routes for development
 */

// User analytics routes
router.get('/user/dashboard', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tenders: {
                saved: 15,
                viewed: 45,
                applied: 8
            },
            bids: {
                total: 8,
                draft: 2,
                submitted: 4,
                awarded: 1,
                rejected: 1
            },
            activities: [
                { action: 'Viewed tender', target: 'TENDER-1234', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
                { action: 'Saved tender', target: 'TENDER-1234', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() },
                { action: 'Created bid', target: 'BID-5678', timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString() },
                { action: 'Uploaded document', target: 'BID-5678', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
                { action: 'Submitted bid', target: 'BID-5678', timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() }
            ]
        }
    });
});

router.get('/user/tender-activity', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            activities: [
                { date: '2025-03-01', viewed: 5, saved: 2, applied: 1 },
                { date: '2025-03-02', viewed: 7, saved: 3, applied: 0 },
                { date: '2025-03-03', viewed: 4, saved: 1, applied: 1 },
                { date: '2025-03-04', viewed: 8, saved: 4, applied: 2 },
                { date: '2025-03-05', viewed: 6, saved: 2, applied: 1 }
            ]
        }
    });
});

router.get('/user/bid-performance', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            performance: {
                submitted: 12,
                won: 3,
                lost: 7,
                pending: 2,
                successRate: '25%'
            },
            timeline: [
                { month: 'Jan', submitted: 2, won: 0, lost: 1, pending: 1 },
                { month: 'Feb', submitted: 3, won: 1, lost: 2, pending: 0 },
                { month: 'Mar', submitted: 4, won: 1, lost: 2, pending: 1 },
                { month: 'Apr', submitted: 3, won: 1, lost: 2, pending: 0 }
            ]
        }
    });
});

router.get('/user/learning-progress', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            progress: {
                coursesCompleted: 3,
                certificatesEarned: 1,
                hoursSpent: 12,
                lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            courses: [
                { name: 'Bid Writing Fundamentals', progress: 100, completed: true },
                { name: 'Government Procurement Processes', progress: 100, completed: true },
                { name: 'Financial Proposal Preparation', progress: 75, completed: false },
                { name: 'Technical Documentation', progress: 50, completed: false }
            ]
        }
    });
});

// Admin analytics routes
router.get('/tenders/overview', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            total: 120,
            open: 45,
            closing: 15,
            closed: 60,
            byValue: [
                { range: '0-50K', count: 25 },
                { range: '50K-100K', count: 40 },
                { range: '100K-500K', count: 35 },
                { range: '500K+', count: 20 }
            ],
            byDepartment: [
                { department: 'Ministry of Defense', count: 30 },
                { department: 'Ministry of Education', count: 25 },
                { department: 'Ministry of Health', count: 20 },
                { department: 'Ministry of Transportation', count: 15 },
                { department: 'Others', count: 30 }
            ]
        }
    });
});

// Admin bid analytics routes
router.get('/bids/overview', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            total: 85,
            draft: 20,
            submitted: 65,
            awarded: 25,
            rejected: 30,
            pending: 10,
            successRate: '38%',
            byMonth: [
                { month: 'Jan', count: 15 },
                { month: 'Feb', count: 18 },
                { month: 'Mar', count: 22 },
                { month: 'Apr', count: 30 }
            ]
        }
    });
});

// Export reports
router.get('/export/:type', (req, res) => {
    const { type } = req.params;

    res.status(200).json({
        status: 'success',
        data: {
            fileUrl: `https://example.com/reports/${type}-report-${Date.now()}.xlsx`,
            generatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    });
});

// Dashboard with overview data
router.get('/dashboard', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tenders: {
                total: 120,
                open: 45,
                closed: 75
            },
            bids: {
                total: 68,
                submitted: 52,
                draft: 16,
                won: 12,
                lost: 30
            },
            revenue: {
                total: 12500000,
                awarded: 3700000,
                pipeline: 8800000
            }
        }
    });
});

// Catch-all route for any other analytics endpoints
router.all('/*', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            message: 'Mock analytics data',
            timestamp: new Date().toISOString()
        }
    });
});

module.exports = router;