const Bid = require('../models/Bid');
const Tender = require('../models/Tender');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const { generatePdf } = require('../utils/pdfGenerator');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all bids for the current user
 */
exports.getUserBids = catchAsync(async(req, res, next) => {
    // Mock data for user bids
    const bids = [{
            id: '1a2b3c',
            tenderId: '123456',
            tenderTitle: 'School Furniture Supply',
            tenderReference: 'EDU/2023/123',
            department: 'Education Ministry',
            status: 'draft',
            value: 1250000,
            deadline: new Date(Date.now() + 864000000),
            createdAt: new Date(Date.now() - 172800000),
            progress: 35
        },
        {
            id: '2d3e4f',
            tenderId: '234567',
            tenderTitle: 'Hospital Equipment Maintenance',
            tenderReference: 'HEALTH/2023/456',
            department: 'Health Ministry',
            status: 'submitted',
            value: 3400000,
            deadline: new Date(Date.now() + 432000000),
            createdAt: new Date(Date.now() - 432000000),
            submittedAt: new Date(Date.now() - 86400000),
            progress: 100
        },
        {
            id: '3g4h5i',
            tenderId: '345678',
            tenderTitle: 'Road Maintenance Project',
            tenderReference: 'PWD/2023/789',
            department: 'Public Works',
            status: 'awarded',
            value: 7800000,
            deadline: new Date(Date.now() - 864000000),
            createdAt: new Date(Date.now() - 1728000000),
            submittedAt: new Date(Date.now() - 1296000000),
            progress: 100
        }
    ];

    res.status(200).json({
        status: 'success',
        results: bids.length,
        data: { bids }
    });
});

/**
 * Get bid statistics for the current user
 */
exports.getUserBidStats = catchAsync(async(req, res, next) => {
    // Mock bid statistics
    const stats = {
        total: 18,
        draft: 3,
        inProgress: 4,
        submitted: 7,
        awarded: 3,
        rejected: 1,
        totalValue: 32500000,
        awardedValue: 14800000,
        successRate: 30
    };

    res.status(200).json({
        status: 'success',
        data: { stats }
    });
});

/**
 * Get single bid by ID
 */
exports.getBid = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // Mock data for a single bid with full details
    const bid = {
        id,
        tenderId: '234567',
        tender: {
            id: '234567',
            title: 'Hospital Equipment Maintenance',
            referenceNumber: 'HEALTH/2023/456',
            department: 'Health Ministry',
            value: 3400000,
            deadline: new Date(Date.now() + 432000000),
            description: 'Comprehensive maintenance of hospital equipment including X-ray machines, MRI scanners, and other diagnostic equipment.',
            requirements: [
                'Minimum 5 years experience in medical equipment maintenance',
                'Certified technicians',
                'Available 24/7 for emergency repairs',
                'Must provide warranty for repairs'
            ]
        },
        status: 'submitted',
        progress: 100,
        financialDetails: {
            bidAmount: 3350000,
            margin: 12,
            expenses: [
                { item: 'Labor', amount: 1800000 },
                { item: 'Parts', amount: 950000 },
                { item: 'Transport', amount: 200000 },
                { item: 'Overheads', amount: 400000 }
            ]
        },
        team: [
            { id: '1', name: 'John Smith', role: 'Project Manager', email: 'john@example.com' },
            { id: '2', name: 'Sarah Johnson', role: 'Technical Lead', email: 'sarah@example.com' },
            { id: '3', name: 'Robert Chen', role: 'Finance Specialist', email: 'robert@example.com' }
        ],
        documents: [
            { id: '1', name: 'Technical Proposal.pdf', type: 'application/pdf', size: 2540000, uploadDate: new Date(Date.now() - 345600000), status: 'completed' },
            { id: '2', name: 'Financial Proposal.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1120000, uploadDate: new Date(Date.now() - 259200000), status: 'completed' },
            { id: '3', name: 'Company Profile.pdf', type: 'application/pdf', size: 3650000, uploadDate: new Date(Date.now() - 172800000), status: 'completed' }
        ],
        checklist: [
            { id: '1', item: 'Read and understand tender requirements', completed: true },
            { id: '2', item: 'Prepare technical proposal', completed: true },
            { id: '3', item: 'Prepare financial proposal', completed: true },
            { id: '4', item: 'Gather required certifications', completed: true },
            { id: '5', item: 'Get management approval', completed: true }
        ],
        notes: [
            { id: '1', content: 'Need to highlight our experience with GE medical equipment', createdAt: new Date(Date.now() - 432000000) },
            { id: '2', content: 'Confirmed availability of certified technicians', createdAt: new Date(Date.now() - 345600000) },
            { id: '3', content: 'Reduced margin to be more competitive', createdAt: new Date(Date.now() - 259200000) }
        ],
        createdAt: new Date(Date.now() - 432000000),
        updatedAt: new Date(Date.now() - 86400000),
        submittedAt: new Date(Date.now() - 86400000)
    };

    res.status(200).json({
        status: 'success',
        data: { bid }
    });
});

/**
 * Create a new bid
 */
exports.createBid = catchAsync(async(req, res, next) => {
    const { tenderId, notes } = req.body;

    // In a real implementation, we would create a new bid in the database
    const newBid = {
        id: uuidv4(),
        tenderId,
        status: 'draft',
        progress: 10,
        notes: notes ? [{ id: '1', content: notes, createdAt: new Date() }] : [],
        documents: [],
        checklist: [
            { id: '1', item: 'Read and understand tender requirements', completed: false },
            { id: '2', item: 'Prepare technical proposal', completed: false },
            { id: '3', item: 'Prepare financial proposal', completed: false },
            { id: '4', item: 'Gather required certifications', completed: false },
            { id: '5', item: 'Get management approval', completed: false }
        ],
        financialDetails: {
            bidAmount: 0,
            margin: 0,
            expenses: []
        },
        team: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    res.status(201).json({
        status: 'success',
        data: { bid: newBid }
    });
});

/**
 * Update a bid
 */
exports.updateBid = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // In a real implementation, we would update the bid in the database
    // Mock updated bid data by combining the update with existing data
    const updatedBid = {
        id,
        ...updateData,
        updatedAt: new Date()
    };

    res.status(200).json({
        status: 'success',
        data: { bid: updatedBid }
    });
});

/**
 * Update bid status
 */
exports.updateBidStatus = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'in-progress', 'submitted', 'awarded', 'rejected'].includes(status)) {
        return next(new AppError('Invalid status', 400));
    }

    // Mock response with updated status
    const updatedBid = {
        id,
        status,
        updatedAt: new Date()
    };

    res.status(200).json({
        status: 'success',
        data: { bid: updatedBid }
    });
});

/**
 * Delete a bid
 */
exports.deleteBid = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would delete the bid from the database

    res.status(204).json({
        status: 'success',
        data: null
    });
});

/**
 * Add document to bid
 */
exports.addDocument = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // Mock document data (in a real implementation, would use the uploaded file)
    const newDocument = {
        id: uuidv4(),
        name: req.file ? req.file.originalname : 'document.pdf',
        type: req.file ? req.file.mimetype : 'application/pdf',
        size: req.file ? req.file.size : 1024000,
        uploadDate: new Date(),
        status: 'completed',
        url: `https://example.com/documents/${id}/${req.file ? req.file.filename : 'document.pdf'}`
    };

    res.status(201).json({
        status: 'success',
        data: { document: newDocument }
    });
});

/**
 * Submit bid
 */
exports.submitBid = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would update the bid status to 'submitted'

    const submittedBid = {
        id,
        status: 'submitted',
        progress: 100,
        submittedAt: new Date(),
        updatedAt: new Date()
    };

    res.status(200).json({
        status: 'success',
        data: { bid: submittedBid }
    });
});

/**
 * Generate PDF for bid
 */
exports.generateBidPdf = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would generate a PDF using a library like PDFKit

    res.status(200).json({
        status: 'success',
        message: 'PDF generated',
        data: {
            downloadUrl: `https://example.com/bids/${id}/download-pdf`
        }
    });
});