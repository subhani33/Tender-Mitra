const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

/**
 * Authentication middleware for Express
 * Handles user authentication and role-based authorization
 */

/**
 * Middleware to protect routes that require authentication
 * Verifies the JWT token and attaches user to request
 */
exports.protect = catchAsync(async(req, res, next) => {
    // 1) Get token from headers or cookies
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    try {
        // 2) Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists', 401));
        }

        // 4) Check if user changed password after token was issued
        if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password. Please log in again', 401));
        }

        // Grant access to protected route
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    } catch (error) {
        logger.error(`Auth error: ${error.message}`);
        return next(new AppError('Authentication failed. Please log in again.', 401));
    }
});

/**
 * Mock protect middleware for development without a database
 * This allows testing protected routes without a real database connection
 */
exports.mockProtect = (req, res, next) => {
    // Set a mock user for development
    req.user = {
        _id: 'mock-user-123',
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'user'
    };

    res.locals.user = req.user;
    next();
};

/**
 * Middleware to restrict access to certain roles
 * @param  {...String} roles - Roles that are allowed access
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array [admin, manager, etc]
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

/**
 * Middleware to check if user is verified
 * Prevents unverified users from accessing certain routes
 */
exports.isVerified = catchAsync(async(req, res, next) => {
    if (!req.user.verified) {
        return next(new AppError('Please verify your email to access this resource', 403));
    }

    next();
});

/**
 * Middleware to determine which auth middleware to use based on environment
 * Uses mockProtect in development if no MongoDB URI is provided
 */
exports.chooseAuthMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'production' || process.env.MONGODB_URI) {
        return exports.protect(req, res, next);
    } else {
        return exports.mockProtect(req, res, next);
    }
};

/**
 * Middleware to check if user owns a resource
 */
exports.isResourceOwner = (Model) => catchAsync(async(req, res, next) => {
    // In a real implementation, we would check if the user owns the resource
    // For mock implementation, we'll just continue
    next();
});

/**
 * Utility to check if user has required role
 */
exports.hasRole = (user, ...roles) => {
    return roles.includes(user.role);
};

/**
 * Middleware to handle user session (for views)
 */
exports.isLoggedIn = async(req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) Verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // 4) Check if user is active
            if (!currentUser.active) {
                return next();
            }

            // There is a logged in user
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};