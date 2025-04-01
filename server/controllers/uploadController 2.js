const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

/**
 * Upload a single document
 */
exports.uploadDocument = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            },
        },
    });
});

/**
 * Upload multiple documents
 */
exports.uploadMultipleDocuments = catchAsync(async(req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('No files uploaded', 400));
    }

    const files = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
    }));

    res.status(200).json({
        status: 'success',
        results: files.length,
        data: {
            files,
        },
    });
});

/**
 * Upload profile image
 */
exports.uploadProfileImage = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    // Check if file is an image
    if (!req.file.mimetype.startsWith('image')) {
        // Delete the uploaded file
        await unlinkAsync(req.file.path);
        return next(new AppError('Please upload only images', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            },
        },
    });
});

/**
 * Upload article image
 */
exports.uploadArticleImage = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    // Check if file is an image
    if (!req.file.mimetype.startsWith('image')) {
        // Delete the uploaded file
        await unlinkAsync(req.file.path);
        return next(new AppError('Please upload only images', 400));
    }

    res.status(200).json({
        status: 'success',
        data: {
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
            },
        },
    });
});

/**
 * Upload bid documents
 */
exports.uploadBidDocuments = catchAsync(async(req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('No files uploaded', 400));
    }

    // Get bid ID from params
    const { bidId } = req.params;

    // Map files to the format needed by the database
    const files = req.files.map((file) => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        uploadedAt: Date.now(),
    }));

    res.status(200).json({
        status: 'success',
        results: files.length,
        data: {
            bidId,
            files,
        },
    });
});

/**
 * Validate file before upload
 */
exports.validateFile = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file to validate', 400));
    }

    const fileSize = req.file.size;
    const fileType = req.file.mimetype;
    const maxSize = 10 * 1024 * 1024; // 10 MB

    const validationResult = {
        valid: true,
        errors: [],
        fileInfo: {
            originalname: req.file.originalname,
            size: fileSize,
            type: fileType,
        },
    };

    // Check file size
    if (fileSize > maxSize) {
        validationResult.valid = false;
        validationResult.errors.push(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB`);
    }

    // Check allowed file types - example for documents
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
    ];

    if (!allowedTypes.includes(fileType)) {
        validationResult.valid = false;
        validationResult.errors.push('File type not allowed');
    }

    // Delete the file since we're just validating
    await unlinkAsync(req.file.path);

    res.status(200).json({
        status: 'success',
        data: validationResult,
    });
});

/**
 * Get file info
 */
exports.getFileInfo = catchAsync(async(req, res, next) => {
    const { fileId } = req.params;

    // This would typically involve a database lookup
    // For now, we'll return mock data
    const fileInfo = {
        id: fileId,
        filename: `file-${fileId}.pdf`,
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1024000,
        uploadedAt: Date.now(),
        uploadedBy: req.user.id,
    };

    res.status(200).json({
        status: 'success',
        data: {
            file: fileInfo,
        },
    });
});

/**
 * Delete file
 */
exports.deleteFile = catchAsync(async(req, res, next) => {
    const { fileId } = req.params;

    // This would typically involve a database lookup and file system operation
    // For now, we'll return a success response
    // const filePath = path.join(__dirname, '../uploads', fileId);
    // await unlinkAsync(filePath);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});