const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all users - Admin only
 */
exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

/**
 * Get user by ID - Admin only
 */
exports.getUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Create user - Admin only
 */
exports.createUser = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
        company: req.body.company,
    });

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
});

/**
 * Update user - Admin only
 */
exports.updateUser = catchAsync(async(req, res, next) => {
    // Do not allow password updates via this route
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /update-password',
                400
            )
        );
    }

    const filteredBody = filterObj(
        req.body,
        'firstName',
        'lastName',
        'email',
        'role',
        'company',
        'verified'
    );

    const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

/**
 * Delete user - Admin only
 */
exports.deleteUser = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Get current user profile
 */
exports.getProfile = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Update current user profile
 */
exports.updateProfile = catchAsync(async(req, res, next) => {
    // Do not allow password updates via this route
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /update-password',
                400
            )
        );
    }

    // Filter out fields that are not allowed to be updated
    const filteredBody = filterObj(
        req.body,
        'firstName',
        'lastName',
        'email',
        'company',
        'bio'
    );

    // Add profile image if it exists
    if (req.file) filteredBody.avatar = req.file.filename;

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

/**
 * Update current user password
 */
exports.updatePassword = catchAsync(async(req, res, next) => {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if posted current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is incorrect', 401));
    }

    // If password is correct, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
});

/**
 * Delete current user account
 */
exports.deleteAccount = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Upload profile image
 */
exports.uploadProfileImage = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.user.id, { avatar: req.file.filename }, { new: true }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Update user role - Admin only
 */
exports.updateUserRole = catchAsync(async(req, res, next) => {
    if (!req.body.role) {
        return next(new AppError('Please provide a role', 400));
    }

    const user = await User.findByIdAndUpdate(
        req.params.id, { role: req.body.role }, { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Verify user account - Admin only
 */
exports.verifyAccount = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id, { verified: true }, { new: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Suspend user account - Admin only
 */
exports.suspendAccount = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id, { active: false }, { new: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Activate user account - Admin only
 */
exports.activateAccount = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id, { active: true }, { new: true }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * Get user preferences
 */
exports.getUserPreferences = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: 'success',
        data: {
            preferences: user.preferences,
        },
    });
});

/**
 * Update user preferences
 */
exports.updateUserPreferences = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id, { preferences: req.body }, { new: true, runValidators: true }
    );

    res.status(200).json({
        status: 'success',
        data: {
            preferences: user.preferences,
        },
    });
});

/**
 * Get notification settings
 */
exports.getNotificationSettings = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: 'success',
        data: {
            notifications: user.preferences.notifications,
        },
    });
});

/**
 * Update notification settings
 */
exports.updateNotificationSettings = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    user.preferences.notifications = {
        ...user.preferences.notifications,
        ...req.body,
    };
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        data: {
            notifications: user.preferences.notifications,
        },
    });
});

/**
 * Get current user's profile
 */
exports.getMe = catchAsync(async(req, res, next) => {
    // Mock user data
    const user = {
        _id: req.user.id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
        company: 'ABC Enterprises',
        position: 'Tender Specialist',
        phone: '+91-9876543210',
        address: '123 Business Park, Mumbai',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        verified: true,
        createdAt: new Date(Date.now() - 2592000000),
        updatedAt: new Date(Date.now() - 432000000)
    };

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

/**
 * Update current user's profile
 */
exports.updateMe = catchAsync(async(req, res, next) => {
    // 1) Check if user is trying to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /update-password', 400));
    }

    // 2) Filter unwanted fields
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'company', 'position', 'phone', 'address');

    // 3) In a real implementation, we would update the user document
    // For mock purposes, combine req.user with filteredBody
    const updatedUser = {
        ...req.user,
        ...filteredBody,
        updatedAt: new Date()
    };

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

/**
 * Update current user's password
 */
exports.updatePassword = catchAsync(async(req, res, next) => {
    const { currentPassword, newPassword, passwordConfirm } = req.body;

    if (!currentPassword || !newPassword || !passwordConfirm) {
        return next(new AppError('Please provide current password, new password and password confirmation', 400));
    }

    if (newPassword !== passwordConfirm) {
        return next(new AppError('New password and password confirmation do not match', 400));
    }

    // In a real implementation, we would verify the current password and update with the new one

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
    });
});

/**
 * Delete (deactivate) current user's account
 */
exports.deleteMe = catchAsync(async(req, res, next) => {
    // In a real implementation, we would set the user as inactive rather than actually deleting

    res.status(204).json({
        status: 'success',
        data: null
    });
});

/**
 * Get user preferences
 */
exports.getPreferences = catchAsync(async(req, res, next) => {
    // Mock user preferences
    const preferences = {
        emailNotifications: {
            tenderAlerts: true,
            deadlineReminders: true,
            bidUpdates: true,
            newsletterAndTips: false
        },
        defaultFilters: {
            departments: ['IT Department', 'Health Ministry'],
            categories: ['IT Services', 'Medical'],
            minValue: 1000000,
            maxValue: 10000000
        },
        dashboardLayout: {
            showRecentTenders: true,
            showSavedTenders: true,
            showBidProgress: true,
            showAnalytics: true
        },
        theme: 'light',
        language: 'en'
    };

    res.status(200).json({
        status: 'success',
        data: {
            preferences
        }
    });
});

/**
 * Update user preferences
 */
exports.updatePreferences = catchAsync(async(req, res, next) => {
    // In a real implementation, we would update the user's preferences
    const updatedPreferences = {
        ...req.body
    };

    res.status(200).json({
        status: 'success',
        data: {
            preferences: updatedPreferences
        }
    });
});

/**
 * Upload profile image
 */
exports.uploadProfileImage = catchAsync(async(req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload an image file', 400));
    }

    // In a real implementation, we would save the file and update the user's avatar
    const avatarUrl = `https://example.com/uploads/avatars/${req.user.id}/${req.file.filename}`;

    res.status(200).json({
        status: 'success',
        data: {
            avatarUrl
        }
    });
});

/**
 * Get notification settings
 */
exports.getNotificationSettings = catchAsync(async(req, res, next) => {
    // Mock notification settings
    const settings = {
        email: {
            tenderAlerts: true,
            deadlineReminders: true,
            bidUpdates: true,
            newsletterAndTips: false
        },
        inApp: {
            tenderAlerts: true,
            deadlineReminders: true,
            bidUpdates: true,
            systemAnnouncements: true
        },
        sms: {
            tenderAlerts: false,
            deadlineReminders: true,
            bidUpdates: false
        },
        frequency: 'daily'
    };

    res.status(200).json({
        status: 'success',
        data: {
            settings
        }
    });
});

/**
 * Update notification settings
 */
exports.updateNotificationSettings = catchAsync(async(req, res, next) => {
    // In a real implementation, we would update the notification settings
    const updatedSettings = {
        ...req.body
    };

    res.status(200).json({
        status: 'success',
        data: {
            settings: updatedSettings
        }
    });
});

/**
 * Forgot password
 */
exports.forgotPassword = catchAsync(async(req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide your email address', 400));
    }

    // In a real implementation, we would:
    // 1. Check if user exists
    // 2. Generate reset token
    // 3. Send reset link via email

    res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to your email'
    });
});

/**
 * Reset password
 */
exports.resetPassword = catchAsync(async(req, res, next) => {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
        return next(new AppError('Please provide password and password confirmation', 400));
    }

    if (password !== passwordConfirm) {
        return next(new AppError('Passwords do not match', 400));
    }

    // In a real implementation, we would:
    // 1. Verify the token
    // 2. Update the user's password
    // 3. Log the user in

    res.status(200).json({
        status: 'success',
        message: 'Password has been reset successfully'
    });
});

/**
 * ADMIN ONLY CONTROLLERS
 */

/**
 * Get all users
 */
exports.getAllUsers = catchAsync(async(req, res, next) => {
    // Mock users data
    const users = [{
            _id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'user',
            company: 'ABC Enterprises',
            verified: true,
            createdAt: new Date(Date.now() - 2592000000)
        },
        {
            _id: 'user2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            role: 'user',
            company: 'XYZ Corporation',
            verified: true,
            createdAt: new Date(Date.now() - 1728000000)
        },
        {
            _id: 'admin1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            role: 'admin',
            company: 'EdtoDo Technovations',
            verified: true,
            createdAt: new Date(Date.now() - 3456000000)
        }
    ];

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

/**
 * Create a new user
 */
exports.createUser = catchAsync(async(req, res, next) => {
    const userData = req.body;

    // In a real implementation, we would create a new user in the database
    const newUser = {
        _id: uuidv4(),
        ...userData,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

/**
 * Get a user by ID
 */
exports.getUser = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // Mock user data
    const user = {
        _id: id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
        company: 'ABC Enterprises',
        position: 'Tender Specialist',
        phone: '+91-9876543210',
        address: '123 Business Park, Mumbai',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        verified: true,
        createdAt: new Date(Date.now() - 2592000000),
        updatedAt: new Date(Date.now() - 432000000),
        active: true
    };

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

/**
 * Update a user
 */
exports.updateUser = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // In a real implementation, we would update the user in the database
    const updatedUser = {
        _id: id,
        ...updateData,
        updatedAt: new Date()
    };

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

/**
 * Delete a user
 */
exports.deleteUser = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would delete or deactivate the user

    res.status(204).json({
        status: 'success',
        data: null
    });
});

/**
 * Update a user's role
 */
exports.updateUserRole = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin', 'manager', 'content-creator', 'evaluator'].includes(role)) {
        return next(new AppError('Please provide a valid role', 400));
    }

    // In a real implementation, we would update the user's role

    res.status(200).json({
        status: 'success',
        message: `User role updated to ${role}`
    });
});

/**
 * Verify a user's account
 */
exports.verifyAccount = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would verify the user's account

    res.status(200).json({
        status: 'success',
        message: 'User account verified'
    });
});

/**
 * Suspend a user's account
 */
exports.suspendAccount = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return next(new AppError('Please provide a reason for suspension', 400));
    }

    // In a real implementation, we would suspend the user's account

    res.status(200).json({
        status: 'success',
        message: 'User account suspended'
    });
});

/**
 * Activate a user's account
 */
exports.activateAccount = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would activate the user's account

    res.status(200).json({
        status: 'success',
        message: 'User account activated'
    });
});