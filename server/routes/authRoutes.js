const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { chooseAuthMiddleware } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for authenticated users
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_change_in_production', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
};

/**
 * Create and send token with response
 */
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user.id);

    // Set JWT as an HTTP-Only cookie
    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    const userResponse = {...user };
    if (userResponse.password) delete userResponse.password;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: userResponse
        },
    });
};

// Register new user
router.post('/register', async(req, res) => {
    try {
        const { email, password, firstName, lastName, name } = req.body;

        // Check for required fields
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Parse name if firstName/lastName not provided (backward compatibility)
        let parsedFirstName = firstName;
        let parsedLastName = lastName;

        if (!firstName || !lastName) {
            if (name) {
                const nameParts = name.split(' ');
                parsedFirstName = nameParts[0];
                parsedLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please provide name or firstName/lastName'
                });
            }
        }

        // Check email format
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide a valid email address'
            });
        }

        // Check password strength
        const hasMinLength = password.length >= 8;
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[@$!%*#?&]/.test(password);

        if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecial) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters and contain letters, numbers, and special characters'
            });
        }

        // In a real implementation, you would check if email already exists in the database
        // For demonstration, we'll check a mock user with this email
        if (email === 'test@example.com') {
            return res.status(409).json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // In a real implementation, you would save this user to the database
        // For mock implementation we'll create a fake user
        const user = {
            id: `user-${Date.now()}`,
            firstName: parsedFirstName,
            lastName: parsedLastName,
            email,
            password: hashedPassword,
            role: 'user',
            verified: false,
            verificationToken: hashedToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            createdAt: new Date().toISOString()
        };

        logger.info(`User registered: ${email} (${parsedFirstName} ${parsedLastName})`);

        // For a real implementation, you would send an email with the verification link
        // For now, we'll skip that step

        createSendToken(user, 201, req, res);
    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during registration'
        });
    }
});

// Login user
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // In a real implementation, you would find the user in the database
        // For mock implementation we'll create a fake user
        const user = {
            id: 'user-1',
            name: 'Test User',
            email,
            password: await bcrypt.hash('password123', 10), // This would be retrieved from DB
            role: 'user',
            verified: true,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Check if password is correct
        // In development, always accept 'password123' for testing
        const isPasswordCorrect = process.env.NODE_ENV === 'production' ?
            await bcrypt.compare(password, user.password) :
            (password === 'password123' || await bcrypt.compare(password, user.password));

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        logger.info(`User logged in: ${email}`);
        createSendToken(user, 200, req, res);
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred during login'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
});

// Get current user profile
router.get('/me', chooseAuthMiddleware, (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: req.user._id || req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                preferences: {
                    darkMode: true,
                    notifications: true,
                    language: 'en'
                },
                createdAt: req.user.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                lastLogin: new Date().toISOString()
            }
        }
    });
});

// Refresh token
router.get('/refresh-token', (req, res) => {
    const token = 'mock-refreshed-jwt-token';

    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
});

// Password management
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide your email address'
        });
    }

    // In a real implementation, you would find the user and send the reset email
    res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to your email'
    });
});

router.patch('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide password and password confirmation'
        });
    }

    if (password !== passwordConfirm) {
        return res.status(400).json({
            status: 'error',
            message: 'Passwords do not match'
        });
    }

    // In a real implementation, you would verify the token and update the password
    res.status(200).json({
        status: 'success',
        message: 'Password reset successfully'
    });
});

// Email verification
router.post('/send-verification-email', chooseAuthMiddleware, (req, res) => {
    // In a real implementation, you would generate a token and send an email
    res.status(200).json({
        status: 'success',
        message: 'Verification email sent'
    });
});

router.get('/verify-email/:token', (req, res) => {
    const { token } = req.params;

    // In a real implementation, you would verify the token and update the user
    res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
    });
});

// OAuth routes - simulate success responses
router.get('/google', (req, res) => {
    res.redirect('/api/auth/google/callback');
});

router.get('/google/callback', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: 'google-user-1',
                email: 'google-user@example.com',
                name: 'Google User',
                role: 'user',
                provider: 'google',
                createdAt: new Date().toISOString()
            },
            token: 'mock-google-jwt-token'
        }
    });
});

module.exports = router;