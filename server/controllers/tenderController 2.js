const mongoose = require('mongoose');
const Tender = require('../models/Tender');
const User = require('../models/User');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const scraperService = require('../services/scraperService');
const { v4: uuidv4 } = require('uuid');

/**
 * Tender Controller
 * Handles all tender-related API operations
 */

/**
 * Get all tenders with filtering, sorting, and pagination
 * Public route
 */
exports.getAllTenders = catchAsync(async(req, res, next) => {
    // Build query
    let query = {};

    // Filter by status - default to published for public users
    if (req.query.status) {
        query.status = req.query.status;
    } else if (!req.user || !req.user.role.includes('admin')) {
        query.status = 'published';
    }

    // Filter by category
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Filter by department
    if (req.query.department) {
        query.department = req.query.department;
    }

    // Filter by value range
    if (req.query.minValue) {
        query.value = {...query.value, $gte: Number(req.query.minValue) };
    }
    if (req.query.maxValue) {
        query.value = {...query.value, $lte: Number(req.query.maxValue) };
    }

    // Text search
    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }

    // Deadline filter
    if (req.query.deadlineAfter) {
        query.deadline = {...query.deadline, $gte: new Date(req.query.deadlineAfter) };
    }
    if (req.query.deadlineBefore) {
        query.deadline = {...query.deadline, $lte: new Date(req.query.deadlineBefore) };
    }

    // Filter by active tenders (deadline > now)
    if (req.query.active === 'true') {
        query.deadline = {...query.deadline, $gt: new Date() };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    let sort = {};
    if (req.query.sort) {
        const sortFields = req.query.sort.split(',');
        sortFields.forEach(field => {
            if (field.startsWith('-')) {
                sort[field.substring(1)] = -1;
            } else {
                sort[field] = 1;
            }
        });
    } else {
        // Default sort by deadline (ascending)
        sort = { deadline: 1 };
    }

    // Execute query with pagination
    const tenders = await Tender.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName email'
        });

    // Get total count for pagination
    const total = await Tender.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: tenders.length,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        },
        data: {
            tenders
        }
    });
});

/**
 * Get tender categories
 * Public route
 */
exports.getTenderCategories = catchAsync(async(req, res, next) => {
    const categories = await Tender.distinct('category');

    res.status(200).json({
        status: 'success',
        data: {
            categories
        }
    });
});

/**
 * Get tender departments
 * Public route
 */
exports.getTenderDepartments = catchAsync(async(req, res, next) => {
    const departments = await Tender.distinct('department');

    res.status(200).json({
        status: 'success',
        data: {
            departments
        }
    });
});

/**
 * Get single tender by ID
 * Public route with some data restricted to authenticated users
 */
exports.getTender = catchAsync(async(req, res, next) => {
    const tender = await Tender.findById(req.params.id)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName email'
        });

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    // Check visibility
    if (tender.status !== 'published' && (!req.user || !['admin', 'manager', 'evaluator'].includes(req.user.role))) {
        return next(new AppError('You do not have permission to view this tender', 403));
    }

    // Check if tender is saved by current user
    let isSaved = false;
    if (req.user) {
        const user = await User.findById(req.user.id).select('savedTenders');
        isSaved = user.savedTenders.includes(tender._id);
    }

    res.status(200).json({
        status: 'success',
        data: {
            tender,
            isSaved
        }
    });
});

/**
 * Create new tender
 * Admin/Manager only
 */
exports.createTender = catchAsync(async(req, res, next) => {
    // Add creator reference
    req.body.createdBy = req.user.id;

    const newTender = await Tender.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tender: newTender
        }
    });
});

/**
 * Update tender
 * Admin/Manager only
 */
exports.updateTender = catchAsync(async(req, res, next) => {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    // Check if tender can be edited
    if (!tender.canBeEdited() && !req.user.role.includes('admin')) {
        return next(new AppError('This tender cannot be edited', 400));
    }

    // Remove protected fields if not admin
    if (!req.user.role.includes('admin')) {
        delete req.body.status;
        delete req.body.createdBy;
        delete req.body.awardedTo;
    }

    const updatedTender = await Tender.findByIdAndUpdate(
        req.params.id,
        req.body, {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            tender: updatedTender
        }
    });
});

/**
 * Delete tender
 * Admin only
 */
exports.deleteTender = catchAsync(async(req, res, next) => {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    // Check if tender has associated bids
    const Bid = mongoose.model('Bid');
    const bidCount = await Bid.countDocuments({ tender: tender._id });

    if (bidCount > 0) {
        return next(new AppError('Cannot delete tender with associated bids', 400));
    }

    await Tender.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

/**
 * Update tender status
 * Admin/Manager only
 */
exports.updateTenderStatus = catchAsync(async(req, res, next) => {
    const { status } = req.body;

    if (!status) {
        return next(new AppError('Status is required', 400));
    }

    const tender = await Tender.findById(req.params.id);

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    // Validate status transition
    const validTransitions = {
        draft: ['published', 'cancelled'],
        published: ['closed', 'cancelled'],
        closed: ['awarded', 'cancelled'],
        awarded: [],
        cancelled: []
    };

    if (!validTransitions[tender.status].includes(status)) {
        return next(new AppError(`Cannot transition from ${tender.status} to ${status}`, 400));
    }

    // Add award date if status is awarded
    if (status === 'awarded') {
        tender.awardDate = new Date();
    }

    tender.status = status;
    await tender.save();

    res.status(200).json({
        status: 'success',
        data: {
            tender
        }
    });
});

/**
 * Award tender to a bidder
 * Admin/Manager only
 */
exports.awardTender = catchAsync(async(req, res, next) => {
    const { bidId, userId } = req.body;

    if (!bidId || !userId) {
        return next(new AppError('Bid ID and User ID are required', 400));
    }

    const tender = await Tender.findById(req.params.id);

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    if (tender.status !== 'closed') {
        return next(new AppError('Tender must be closed before awarding', 400));
    }

    // Update the tender
    tender.status = 'awarded';
    tender.awardedTo = userId;
    tender.awardDate = new Date();
    await tender.save();

    // Update the bid status to awarded
    const Bid = mongoose.model('Bid');
    await Bid.findByIdAndUpdate(bidId, { status: 'awarded' });

    // Update other bids to rejected
    await Bid.updateMany({ tender: tender._id, _id: { $ne: bidId } }, { status: 'rejected' });

    res.status(200).json({
        status: 'success',
        data: {
            tender
        }
    });
});

/**
 * Add document to tender
 * Admin/Manager only
 */
exports.addTenderDocument = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    const tender = await Tender.findById(req.params.id);

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    if (!tender.canBeEdited()) {
        return next(new AppError('This tender cannot be edited', 400));
    }

    // Create document object
    const document = {
        name: req.body.name || req.file.originalname,
        description: req.body.description,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        path: req.file.path,
        uploadedAt: new Date()
    };

    // Add document to tender
    tender.documents.push(document);
    await tender.save();

    res.status(200).json({
        status: 'success',
        data: {
            document
        }
    });
});

/**
 * Remove document from tender
 * Admin/Manager only
 */
exports.removeTenderDocument = catchAsync(async(req, res, next) => {
    const tender = await Tender.findById(req.params.id);

    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    if (!tender.canBeEdited()) {
        return next(new AppError('This tender cannot be edited', 400));
    }

    // Find document by ID
    const documentIndex = tender.documents.findIndex(
        doc => doc._id.toString() === req.params.documentId
    );

    if (documentIndex === -1) {
        return next(new AppError('Document not found', 404));
    }

    // Remove document
    tender.documents.splice(documentIndex, 1);
    await tender.save();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

/**
 * Get tenders closing soon
 * Public route
 */
exports.getTendersClosingSoon = catchAsync(async(req, res, next) => {
    const days = req.query.days ? parseInt(req.query.days, 10) : 7;

    const tenders = await Tender.findClosingSoon(days)
        .populate({
            path: 'createdBy',
            select: 'firstName lastName email'
        });

    res.status(200).json({
        status: 'success',
        results: tenders.length,
        data: {
            tenders
        }
    });
});

/**
 * Save/unsave tender for current user
 * Protected route
 */
exports.toggleSaveTender = catchAsync(async(req, res, next) => {
    const tenderId = req.params.id;
    const userId = req.user.id;

    // Verify tender exists
    const tender = await Tender.findById(tenderId);
    if (!tender) {
        return next(new AppError('No tender found with that ID', 404));
    }

    // Get user with saved tenders
    const user = await User.findById(userId).select('savedTenders');

    // Check if tender is already saved
    const tenderIndex = user.savedTenders.findIndex(
        id => id.toString() === tenderId
    );

    let isSaved;

    if (tenderIndex === -1) {
        // Tender not saved, add it
        user.savedTenders.push(tenderId);
        isSaved = true;
    } else {
        // Tender already saved, remove it
        user.savedTenders.splice(tenderIndex, 1);
        isSaved = false;
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            isSaved
        }
    });
});

/**
 * Get saved tenders for current user
 * Protected route
 */
exports.getSavedTenders = catchAsync(async(req, res, next) => {
    const userId = req.user.id;

    // Get user with populated saved tenders
    const user = await User.findById(userId).populate({
        path: 'savedTenders',
        select: 'title referenceNumber department deadline value status category',
        options: {
            sort: { deadline: 1 }
        }
    });

    res.status(200).json({
        status: 'success',
        results: user.savedTenders.length,
        data: {
            tenders: user.savedTenders
        }
    });
});

// Trigger tender scraping (admin only)
exports.scrapeTenders = catchAsync(async(req, res) => {
    // Start scraping process in the background
    scraperService.startScraping();

    res.status(202).json({
        status: 'success',
        message: 'Tender scraping started in the background'
    });
});

// Upload document for a tender (admin only)
exports.uploadTenderDocument = catchAsync(async(req, res, next) => {
    const tenderId = req.params.id;

    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    const document = {
        name: req.body.name || req.file.originalname,
        url: req.file.path,
        type: req.file.mimetype,
        uploadDate: Date.now()
    };

    const tender = await Tender.findByIdAndUpdate(
        tenderId, { $push: { documents: document } }, { new: true }
    );

    if (!tender) {
        return next(new AppError('Tender not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document: tender.documents[tender.documents.length - 1]
        }
    });
});

// Delete document from a tender (admin only)
exports.deleteTenderDocument = catchAsync(async(req, res, next) => {
    const { id, documentId } = req.params;

    const tender = await Tender.findByIdAndUpdate(
        id, { $pull: { documents: { _id: documentId } } }, { new: true }
    );

    if (!tender) {
        return next(new AppError('Tender not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Document deleted successfully'
    });
});