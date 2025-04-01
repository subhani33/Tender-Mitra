const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Simplified mock implementation of article routes for development
 */

// Helper function to generate mock articles
const generateMockArticles = (count = 5) => {
    const articles = [];
    for (let i = 0; i < count; i++) {
        articles.push({
            _id: `article-${i + 1}`,
            title: `Mock Article ${i + 1}`,
            slug: `mock-article-${i + 1}`,
            content: `This is the content of mock article ${i + 1}. It includes placeholder text for development purposes.`,
            summary: `Summary of mock article ${i + 1}`,
            author: {
                _id: 'user-1',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: ['Development', 'Tenders', 'Tech'][i % 3],
            tags: ['mock', 'development', 'placeholder'],
            readTime: Math.floor(Math.random() * 10) + 2,
            views: Math.floor(Math.random() * 1000),
            likes: Math.floor(Math.random() * 50),
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            isLiked: false,
            isSaved: false
        });
    }
    return articles;
};

/**
 * Public routes - accessible without authentication
 */
router.get('/', (req, res) => {
    const articles = generateMockArticles(10);
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: { articles }
    });
});

router.get('/featured', (req, res) => {
    const articles = generateMockArticles(3);
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: { articles }
    });
});

router.get('/popular', (req, res) => {
    const articles = generateMockArticles(5);
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: { articles }
    });
});

router.get('/category/:category', (req, res) => {
    const { category } = req.params;
    const articles = generateMockArticles(4);
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: { articles }
    });
});

router.get('/slug/:slug', (req, res) => {
    const { slug } = req.params;
    const article = generateMockArticles(1)[0];
    article.slug = slug;
    res.status(200).json({
        status: 'success',
        data: { article }
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const article = generateMockArticles(1)[0];
    article._id = id;
    res.status(200).json({
        status: 'success',
        data: { article }
    });
});

router.get('/:articleId/related', (req, res) => {
    const articles = generateMockArticles(3);
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: { articles }
    });
});

router.get('/author/:authorId', (req, res) => {
    const { authorId } = req.params;
    const articles = generateMockArticles(4);
    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: { articles }
    });
});

/**
 * Protected routes - simplified for development
 */
router.post('/:id/like', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { isLiked: true }
    });
});

router.post('/:articleId/comments', (req, res) => {
    const comment = {
        _id: `comment-${Date.now()}`,
        content: req.body.content || 'Mock comment content',
        createdAt: new Date().toISOString(),
        user: {
            _id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        likes: 0
    };

    res.status(201).json({
        status: 'success',
        data: { comment }
    });
});

router.get('/:articleId/comments', (req, res) => {
    const comments = [{
            _id: 'comment-1',
            content: 'This is a mock comment.',
            createdAt: new Date().toISOString(),
            user: {
                _id: 'user-1',
                firstName: 'John',
                lastName: 'Doe',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            likes: 5
        },
        {
            _id: 'comment-2',
            content: 'Another mock comment for testing.',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            user: {
                _id: 'user-2',
                firstName: 'Jane',
                lastName: 'Smith',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            likes: 3
        }
    ];

    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: { comments }
    });
});

// For CRUD operations, just return success responses
router.patch('/comments/:id', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            comment: {
                _id: req.params.id,
                content: req.body.content || 'Updated mock content',
                updatedAt: new Date().toISOString()
            }
        }
    });
});

router.delete('/comments/:id', (req, res) => {
    res.status(204).send();
});

router.post('/', (req, res) => {
    const article = {
        _id: `article-new-${Date.now()}`,
        title: req.body.title || 'New Mock Article',
        slug: 'new-mock-article',
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    res.status(201).json({
        status: 'success',
        data: { article }
    });
});

router.patch('/:id', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            article: {
                _id: req.params.id,
                ...req.body,
                updatedAt: new Date().toISOString()
            }
        }
    });
});

router.delete('/:id', (req, res) => {
    res.status(204).send();
});

module.exports = router;