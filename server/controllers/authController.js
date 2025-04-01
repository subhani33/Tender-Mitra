const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

/**
 * Generate JWT token for authenticated users
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/**
 * Create and send token with response
 */
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    // Set JWT as an HTTP-Only cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

/**
 * User registration
 */
exports.register = catchAsync(async(req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        company,
        role,
    } = req.body;

    // Create new user
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        company,
        role: role === 'admin' ? 'user' : role, // Prevent admin self-assignment
    });

    // Generate email verification token
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // Send verification email
    const verificationURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/verify-email/${verificationToken}`;

    const message = `Welcome to EdtoDo Technovations! Please verify your email by clicking on the following link: ${verificationURL}`;

    try {
        await sendEmail({
            email: newUser.email,
            subject: 'Email Verification',
            message,
        });

        createSendToken(newUser, 201, req, res);
    } catch (err) {
        newUser.emailVerificationToken = undefined;
        newUser.emailVerificationExpires = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the verification email. Please try again later.',
                500
            )
        );
    }
});

/**
 * User login
 */
exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // Send token to client
    createSendToken(user, 200, req, res);
});

/**
 * User logout
 */
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

/**
 * Verify email with token
 */
exports.verifyEmail = catchAsync(async(req, res, next) => {
    // Get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
    });

    // If token has not expired and user exists, verify email
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, req, res);
});

/**
 * Refresh authentication token
 */
exports.refreshToken = catchAsync(async(req, res, next) => {
    let token;

    // Get token from cookie
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError('You are not logged in. Please log in to get access.', 401)
        );
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError('The user belonging to this token no longer exists.', 401)
        );
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password. Please log in again.', 401)
        );
    }

    // Create new token
    createSendToken(currentUser, 200, req, res);
});

/**
 * Send verification email
 */
exports.sendVerificationEmail = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.verified) {
        return next(new AppError('Email already verified', 400));
    }

    // Generate token
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    const verificationURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/verify-email/${verificationToken}`;

    const message = `Please verify your email by clicking on the following link: ${verificationURL}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Verification email sent',
        });
    } catch (err) {
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the verification email. Please try again later.',
                500
            )
        );
    }
});

/**
 * Forgot password
 */
exports.forgotPassword = catchAsync(async(req, res, next) => {
    // Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with that email address.', 404));
    }

    // Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500
            )
        );
    }
});

/**
 * Reset password with token
 */
exports.resetPassword = catchAsync(async(req, res, next) => {
    // Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in, send JWT
    createSendToken(user, 200, req, res);
});

/**
 * Get current user profile
 */
exports.getMe = catchAsync(async(req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
        },
    });
});

/**
 * Google OAuth authentication
 */
exports.googleAuth = (req, res, next) => {
    // Implementation would depend on OAuth library being used
    res.status(200).json({
        status: 'success',
        message: 'Google OAuth route placeholder',
    });
};

/**
 * Google OAuth callback
 */
exports.googleCallback = (req, res, next) => {
    // Implementation would depend on OAuth library being used
    res.status(200).json({
        status: 'success',
        message: 'Google OAuth callback placeholder',
    });
};