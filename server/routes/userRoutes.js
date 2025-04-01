const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Simplified mock implementation of user routes for development
 */

// Helper function to generate mock user
const generateMockUser = (id = 'user-1') => {
    return {
        _id: id,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        company: 'Example Corp',
        preferences: {
            darkMode: true,
            language: 'en',
            notifications: {
                email: true,
                push: false
            }
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
    };
};

// Public routes
router.post('/password-reset', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Password reset link sent to your email'
    });
});

router.patch('/password-reset/:token', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Password reset successful'
    });
});

// User profile routes
router.get('/me', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: generateMockUser() }
    });
});

router.patch('/update-me', (req, res) => {
    const updatedUser = {
        ...generateMockUser(),
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json({
        status: 'success',
        data: { user: updatedUser }
    });
});

router.patch('/update-password', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
    });
});

router.delete('/delete-me', (req, res) => {
    res.status(204).send();
});

// User preferences
router.get('/preferences', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { preferences: generateMockUser().preferences }
    });
});

router.patch('/preferences', (req, res) => {
    const updatedPreferences = {
        ...generateMockUser().preferences,
        ...req.body,
    };

    res.status(200).json({
        status: 'success',
        data: { preferences: updatedPreferences }
    });
});

// User profile image
router.post('/profile-image', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
        }
    });
});

// Admin routes - simplified for development
router.get('/', (req, res) => {
    const users = [generateMockUser('user-1'), generateMockUser('user-2'), generateMockUser('user-3')];

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

router.get('/:id', (req, res) => {
    const user = generateMockUser(req.params.id);

    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

// For all other routes, return appropriate mock responses
router.all('/*', (req, res) => {
    if (req.method === 'GET') {
        res.status(200).json({
            status: 'success',
            data: { data: {} }
        });
    } else if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
        res.status(200).json({
            status: 'success',
            message: 'Operation completed successfully'
        });
    } else {
        res.status(204).send();
    }
});

module.exports = router;