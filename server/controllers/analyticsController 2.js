const mongoose = require('mongoose');
const Tender = require('../models/Tender');
const Bid = require('../models/Bid');
const User = require('../models/User');
const Article = require('../models/Article');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * User analytics controllers
 */
exports.getUserAnalytics = catchAsync(async(req, res, next) => {
    // Mock data for user dashboard analytics
    const data = {
        bidsOverview: {
            total: 32,
            draft: 3,
            submitted: 18,
            awarded: 7,
            rejected: 4
        },
        tenderActivity: {
            saved: 24,
            viewed: 112,
            applied: 32
        },
        recentActivity: [
            { type: 'bid_submitted', tenderId: '12345', tenderTitle: 'Railway Infrastructure Development', date: new Date(Date.now() - 86400000) },
            { type: 'tender_saved', tenderId: '12346', tenderTitle: 'Hospital Equipment Supply', date: new Date(Date.now() - 172800000) },
            { type: 'bid_awarded', tenderId: '12340', tenderTitle: 'Municipal Waste Management', date: new Date(Date.now() - 345600000) }
        ],
        upcomingDeadlines: [
            { tenderId: '12347', tenderTitle: 'School Furniture Supply', deadline: new Date(Date.now() + 172800000) },
            { tenderId: '12348', tenderTitle: 'Road Construction Project', deadline: new Date(Date.now() + 345600000) }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getUserTenderActivity = catchAsync(async(req, res, next) => {
    // Mock data for user tender activity
    const data = {
        totalViews: 234,
        savedTenders: 42,
        appliedTenders: 18,
        mostViewedCategories: [
            { category: 'Construction', count: 56 },
            { category: 'IT Services', count: 48 },
            { category: 'Healthcare', count: 32 }
        ],
        activityTimeline: [
            { date: '2023-01', views: 45, saved: 8, applied: 3 },
            { date: '2023-02', views: 52, saved: 10, applied: 4 },
            { date: '2023-03', views: 48, saved: 7, applied: 2 },
            { date: '2023-04', views: 63, saved: 12, applied: 6 },
            { date: '2023-05', views: 58, saved: 9, applied: 3 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getUserBidPerformance = catchAsync(async(req, res, next) => {
    // Mock data for user bid performance
    const data = {
        bidStats: {
            totalBids: 32,
            awarded: 7,
            successRate: 21.9,
            averageBidValue: 1250000,
            totalAwardedValue: 8750000
        },
        bidsByDepartment: [
            { department: 'Public Works', submitted: 8, awarded: 2 },
            { department: 'Education', submitted: 6, awarded: 1 },
            { department: 'Healthcare', submitted: 5, awarded: 2 },
            { department: 'IT', submitted: 7, awarded: 1 },
            { department: 'Infrastructure', submitted: 6, awarded: 1 }
        ],
        bidsByValue: [
            { range: '< 100K', submitted: 8, awarded: 1 },
            { range: '100K-500K', submitted: 10, awarded: 2 },
            { range: '500K-1M', submitted: 7, awarded: 2 },
            { range: '1M-5M', submitted: 5, awarded: 1 },
            { range: '> 5M', submitted: 2, awarded: 1 }
        ],
        monthlyPerformance: [
            { month: 'Jan', submitted: 3, awarded: 1 },
            { month: 'Feb', submitted: 4, awarded: 0 },
            { month: 'Mar', submitted: 5, awarded: 2 },
            { month: 'Apr', submitted: 6, awarded: 1 },
            { month: 'May', submitted: 4, awarded: 1 },
            { month: 'Jun', submitted: 5, awarded: 1 },
            { month: 'Jul', submitted: 3, awarded: 1 },
            { month: 'Aug', submitted: 2, awarded: 0 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getUserLearningProgress = catchAsync(async(req, res, next) => {
    // Mock data for user learning progress
    const data = {
        completedResources: 8,
        totalResources: 24,
        progress: 33.3,
        learningPathStatus: [
            { path: 'Tender Basics', completed: 5, total: 5, progress: 100 },
            { path: 'Bid Writing', completed: 3, total: 6, progress: 50 },
            { path: 'Financial Estimation', completed: 0, total: 5, progress: 0 },
            { path: 'Compliance', completed: 0, total: 4, progress: 0 },
            { path: 'Advanced Strategies', completed: 0, total: 4, progress: 0 }
        ],
        recentActivity: [
            { resource: 'Understanding Tender Documents', completed: true, date: new Date(Date.now() - 172800000) },
            { resource: 'Bid Response Structures', completed: true, date: new Date(Date.now() - 345600000) },
            { resource: 'Pricing Strategies', completed: false, lastAccessed: new Date(Date.now() - 518400000) }
        ],
        certifications: [
            { name: 'Tender Basics Certification', earned: new Date(Date.now() - 1209600000) }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

/**
 * Admin analytics controllers
 */
exports.getTenderAnalytics = catchAsync(async(req, res, next) => {
    // Mock data for tender analytics
    const data = {
        tenderCounts: {
            total: 156,
            open: 48,
            closing: 12,
            closed: 96,
            cancelled: 5,
            suspended: 2
        },
        tenderValues: {
            total: 235000000,
            average: 1506410,
            byStatus: {
                open: 78500000,
                closed: 156500000
            }
        },
        monthlyTrends: [
            { month: 'Jan', count: 18, value: 27000000 },
            { month: 'Feb', count: 15, value: 22500000 },
            { month: 'Mar', count: 20, value: 30000000 },
            { month: 'Apr', count: 22, value: 33000000 },
            { month: 'May', count: 19, value: 28500000 },
            { month: 'Jun', count: 21, value: 31500000 },
            { month: 'Jul', count: 23, value: 34500000 },
            { month: 'Aug', count: 18, value: 27000000 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getTenderCategoryDistribution = catchAsync(async(req, res, next) => {
    // Mock data for tender category distribution
    const data = {
        categories: [
            { name: 'Construction', count: 42, value: 63000000 },
            { name: 'IT Services', count: 35, value: 52500000 },
            { name: 'Healthcare', count: 28, value: 42000000 },
            { name: 'Education', count: 18, value: 27000000 },
            { name: 'Transportation', count: 15, value: 22500000 },
            { name: 'Others', count: 18, value: 27000000 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getTenderDepartmentDistribution = catchAsync(async(req, res, next) => {
    // Mock data for tender department distribution
    const data = {
        departments: [
            { name: 'Public Works', count: 38, value: 57000000 },
            { name: 'Health Ministry', count: 28, value: 42000000 },
            { name: 'Education Ministry', count: 22, value: 33000000 },
            { name: 'Transport Ministry', count: 19, value: 28500000 },
            { name: 'Defense', count: 15, value: 22500000 },
            { name: 'IT Department', count: 18, value: 27000000 },
            { name: 'Others', count: 16, value: 24000000 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getTenderTrends = catchAsync(async(req, res, next) => {
    // Mock data for tender trends
    const data = {
        yearlyCounts: [
            { year: 2019, count: 130, value: 195000000 },
            { year: 2020, count: 142, value: 213000000 },
            { year: 2021, count: 148, value: 222000000 },
            { year: 2022, count: 156, value: 234000000 },
            { year: 2023, count: 156, value: 235000000 }
        ],
        quarterlyBreakdown: {
            2023: [
                { quarter: 'Q1', count: 53, value: 79500000 },
                { quarter: 'Q2', count: 62, value: 93000000 },
                { quarter: 'Q3', count: 41, value: 61500000 },
                { quarter: 'Q4', count: 0, value: 0 }
            ]
        }
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getTenderValueAnalytics = catchAsync(async(req, res, next) => {
    // Mock data for tender value analytics
    const data = {
        valueRanges: [
            { range: '< 100K', count: 32 },
            { range: '100K-500K', count: 48 },
            { range: '500K-1M', count: 35 },
            { range: '1M-5M', count: 28 },
            { range: '5M-10M', count: 8 },
            { range: '> 10M', count: 5 }
        ],
        averageValueByCategory: [
            { category: 'Construction', value: 2500000 },
            { category: 'IT Services', value: 1200000 },
            { category: 'Healthcare', value: 1800000 },
            { category: 'Education', value: 950000 },
            { category: 'Transportation', value: 2100000 }
        ],
        averageValueByDepartment: [
            { department: 'Public Works', value: 2800000 },
            { department: 'Health Ministry', value: 1600000 },
            { department: 'Education Ministry', value: 900000 },
            { department: 'Transport Ministry', value: 2200000 },
            { department: 'Defense', value: 3500000 },
            { department: 'IT Department', value: 1300000 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getBidAnalytics = catchAsync(async(req, res, next) => {
    // Mock data for bid analytics
    const data = {
        bidCounts: {
            total: 245,
            submitted: 224,
            draft: 21,
            awarded: 68,
            rejected: 156
        },
        bidValueStats: {
            totalSubmitted: 367500000,
            totalAwarded: 102000000,
            averageSubmitted: 1500000,
            averageAwarded: 1500000
        },
        monthlyTrends: [
            { month: 'Jan', submitted: 28, awarded: 8 },
            { month: 'Feb', submitted: 25, awarded: 7 },
            { month: 'Mar', submitted: 30, awarded: 9 },
            { month: 'Apr', submitted: 32, awarded: 10 },
            { month: 'May', submitted: 29, awarded: 9 },
            { month: 'Jun', submitted: 31, awarded: 9 },
            { month: 'Jul', submitted: 33, awarded: 10 },
            { month: 'Aug', submitted: 28, awarded: 8 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

exports.getBidSuccessRate = catchAsync(async(req, res, next) => {
    // Mock data for bid success rate analytics
    const data = {
        overallSuccessRate: 27.8,
        successRateByDepartment: [
            { department: 'Public Works', rate: 28.3 },
            { department: 'Health Ministry', rate: 31.2 },
            { department: 'Education Ministry', rate: 26.7 },
            { department: 'Transport Ministry', rate: 29.4 },
            { department: 'Defense', rate: 21.5 },
            { department: 'IT Department', rate: 32.8 }
        ],
        successRateByCategory: [
            { category: 'Construction', rate: 26.4 },
            { category: 'IT Services', rate: 31.8 },
            { category: 'Healthcare', rate: 30.2 },
            { category: 'Education', rate: 27.5 },
            { category: 'Transportation', rate: 25.9 }
        ],
        successRateByValueRange: [
            { range: '< 100K', rate: 25.3 },
            { range: '100K-500K', rate: 27.8 },
            { range: '500K-1M', rate: 29.1 },
            { range: '1M-5M', rate: 26.5 },
            { range: '5M-10M', rate: 22.4 },
            { range: '> 10M', rate: 19.3 }
        ],
        successRateByMonth: [
            { month: 'Jan', rate: 28.6 },
            { month: 'Feb', rate: 28.0 },
            { month: 'Mar', rate: 30.0 },
            { month: 'Apr', rate: 31.3 },
            { month: 'May', rate: 31.0 },
            { month: 'Jun', rate: 29.0 },
            { month: 'Jul', rate: 30.3 },
            { month: 'Aug', rate: 28.6 }
        ]
    };

    res.status(200).json({
        status: 'success',
        data
    });
});

/**
 * Export report controllers
 */
exports.exportTenderReport = catchAsync(async(req, res, next) => {
    // In a real implementation, this would generate and return a CSV/Excel file
    res.status(200).json({
        status: 'success',
        message: 'Report generated',
        downloadUrl: 'https://example.com/reports/tenders-report.xlsx'
    });
});

exports.exportBidReport = catchAsync(async(req, res, next) => {
    // In a real implementation, this would generate and return a CSV/Excel file
    res.status(200).json({
        status: 'success',
        message: 'Report generated',
        downloadUrl: 'https://example.com/reports/bids-report.xlsx'
    });
});

exports.exportUserReport = catchAsync(async(req, res, next) => {
    // In a real implementation, this would generate and return a CSV/Excel file
    res.status(200).json({
        status: 'success',
        message: 'Report generated',
        downloadUrl: 'https://example.com/reports/users-report.xlsx'
    });
});