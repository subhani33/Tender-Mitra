const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all articles with optional filtering
 */
exports.getAllArticles = catchAsync(async(req, res, next) => {
    // Extract query parameters
    const { category, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Mock articles data
    let articles = [{
            _id: '1a2b3c',
            title: 'Understanding Government Tender Process',
            slug: 'understanding-government-tender-process',
            summary: 'A comprehensive guide to the government tender process in India',
            content: 'The government tender process in India follows specific procedures and regulations...',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Tender Basics',
            tags: ['beginners', 'process', 'guidelines'],
            coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
            readTime: 8,
            views: 1250,
            likes: 56,
            createdAt: new Date(Date.now() - 3024000000),
            updatedAt: new Date(Date.now() - 3024000000)
        },
        {
            _id: '2d3e4f',
            title: 'Bid Writing Best Practices',
            slug: 'bid-writing-best-practices',
            summary: 'Key strategies for writing winning government tender bids',
            content: 'Writing a successful bid requires attention to detail and a strategic approach...',
            author: {
                _id: 'author2',
                firstName: 'Priya',
                lastName: 'Singh',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            category: 'Bid Writing',
            tags: ['writing', 'strategy', 'success'],
            coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            readTime: 12,
            views: 980,
            likes: 78,
            createdAt: new Date(Date.now() - 2592000000),
            updatedAt: new Date(Date.now() - 2592000000)
        },
        {
            _id: '3g4h5i',
            title: 'Financial Estimation for Government Projects',
            slug: 'financial-estimation-government-projects',
            summary: 'How to create accurate financial estimates for government tenders',
            content: 'Financial estimation is a critical aspect of bid preparation...',
            author: {
                _id: 'author3',
                firstName: 'Amit',
                lastName: 'Sharma',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
            },
            category: 'Financial',
            tags: ['finance', 'estimation', 'budgeting'],
            coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
            readTime: 15,
            views: 745,
            likes: 42,
            createdAt: new Date(Date.now() - 1728000000),
            updatedAt: new Date(Date.now() - 1728000000)
        },
        {
            _id: '4j5k6l',
            title: 'Navigating Compliance Requirements',
            slug: 'navigating-compliance-requirements',
            summary: 'A guide to understanding and meeting compliance requirements in tenders',
            content: 'Compliance is non-negotiable when it comes to government tenders...',
            author: {
                _id: 'author2',
                firstName: 'Priya',
                lastName: 'Singh',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            category: 'Compliance',
            tags: ['legal', 'compliance', 'requirements'],
            coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
            readTime: 10,
            views: 632,
            likes: 35,
            createdAt: new Date(Date.now() - 864000000),
            updatedAt: new Date(Date.now() - 864000000)
        },
        {
            _id: '5m6n7o',
            title: 'Tender Evaluation Criteria Explained',
            slug: 'tender-evaluation-criteria-explained',
            summary: 'Understanding how government agencies evaluate tender applications',
            content: 'Government agencies follow specific criteria when evaluating tender submissions...',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Evaluation',
            tags: ['evaluation', 'criteria', 'selection'],
            coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
            readTime: 9,
            views: 876,
            likes: 63,
            createdAt: new Date(Date.now() - 432000000),
            updatedAt: new Date(Date.now() - 432000000)
        }
    ];

    // Apply category filter if provided
    if (category) {
        articles = articles.filter(article => article.category === category);
    }

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedArticles = articles.slice(skip, skip + Number(limit));

    res.status(200).json({
        status: 'success',
        results: paginatedArticles.length,
        data: {
            articles: paginatedArticles
        }
    });
});

/**
 * Get featured articles for the homepage
 */
exports.getFeaturedArticles = catchAsync(async(req, res, next) => {
    // Mock featured articles (could be most liked, most viewed, or manually selected)
    const articles = [{
            _id: '2d3e4f',
            title: 'Bid Writing Best Practices',
            slug: 'bid-writing-best-practices',
            summary: 'Key strategies for writing winning government tender bids',
            author: {
                _id: 'author2',
                firstName: 'Priya',
                lastName: 'Singh',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            category: 'Bid Writing',
            coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            readTime: 12,
            views: 980,
            likes: 78,
            createdAt: new Date(Date.now() - 2592000000)
        },
        {
            _id: '5m6n7o',
            title: 'Tender Evaluation Criteria Explained',
            slug: 'tender-evaluation-criteria-explained',
            summary: 'Understanding how government agencies evaluate tender applications',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Evaluation',
            coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
            readTime: 9,
            views: 876,
            likes: 63,
            createdAt: new Date(Date.now() - 432000000)
        }
    ];

    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles
        }
    });
});

/**
 * Get popular articles
 */
exports.getPopularArticles = catchAsync(async(req, res, next) => {
    // Mock popular articles (based on views)
    const articles = [{
            _id: '1a2b3c',
            title: 'Understanding Government Tender Process',
            slug: 'understanding-government-tender-process',
            summary: 'A comprehensive guide to the government tender process in India',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Tender Basics',
            coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
            readTime: 8,
            views: 1250,
            likes: 56,
            createdAt: new Date(Date.now() - 3024000000)
        },
        {
            _id: '5m6n7o',
            title: 'Tender Evaluation Criteria Explained',
            slug: 'tender-evaluation-criteria-explained',
            summary: 'Understanding how government agencies evaluate tender applications',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Evaluation',
            coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
            readTime: 9,
            views: 876,
            likes: 63,
            createdAt: new Date(Date.now() - 432000000)
        }
    ];

    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles
        }
    });
});

/**
 * Get articles by category
 */
exports.getArticlesByCategory = catchAsync(async(req, res, next) => {
    const { category } = req.params;

    // Mock articles filtered by category
    const articles = [{
        _id: '1a2b3c',
        title: 'Understanding Government Tender Process',
        slug: 'understanding-government-tender-process',
        summary: 'A comprehensive guide to the government tender process in India',
        author: {
            _id: 'author1',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        category: 'Tender Basics',
        coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
        readTime: 8,
        views: 1250,
        likes: 56,
        createdAt: new Date(Date.now() - 3024000000)
    }].filter(article => article.category.toLowerCase() === category.toLowerCase());

    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles
        }
    });
});

/**
 * Get article by slug
 */
exports.getArticleBySlug = catchAsync(async(req, res, next) => {
    const { slug } = req.params;

    // Mock article by slug
    const article = [{
            _id: '1a2b3c',
            title: 'Understanding Government Tender Process',
            slug: 'understanding-government-tender-process',
            summary: 'A comprehensive guide to the government tender process in India',
            content: `
# Understanding the Government Tender Process

The government tender process in India follows specific procedures and regulations designed to ensure fairness, transparency, and value for money in public procurement.

## What is a Government Tender?

A government tender is an invitation to suppliers to submit a bid to provide goods, services, or works to a government department or public sector organization. Tenders are used for procurements above certain thresholds and are subject to rules that ensure:

- Fair competition
- Transparent decision-making
- Value for money
- Equal opportunity for qualified suppliers

## The Tender Lifecycle

### 1. Planning and Preparation

Before a tender is published, the government department identifies a need, secures budget approval, and prepares specifications for the procurement.

### 2. Publication of Tender Notice

The tender notice is published through:
- Government e-procurement portals
- Official gazettes
- Newspapers
- Department websites

### 3. Pre-Bid Meeting

Many tenders include a pre-bid meeting where potential bidders can ask questions and seek clarification about the requirements.

### 4. Bid Submission

Bidders prepare and submit their proposals, which typically include:
- Technical proposal
- Financial proposal
- Supporting documentation
- Bid security/EMD

### 5. Bid Opening

Bids are opened at the specified date and time, often in the presence of bidders' representatives.

### 6. Evaluation

Evaluation is usually done in stages:
- Technical evaluation
- Financial evaluation
- Combined scoring (for quality and cost-based selection)

### 7. Award Decision

The contract is awarded to the bidder who:
- Meets all the qualification criteria
- Offers the best value for money
- Complies with all tender requirements

### 8. Contract Signing

After the award decision, the successful bidder and the government department sign a formal contract.

## Key Considerations for Bidders

- **Read the tender document thoroughly**
- **Ensure compliance with all requirements**
- **Submit all required documents**
- **Meet all deadlines**
- **Attend pre-bid meetings**
- **Request clarifications if needed**
- **Price competitively but realistically**

Success in government tenders requires understanding the process, meeting all requirements, and demonstrating how your solution provides the best value for money.
      `,
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Tender Basics',
            tags: ['beginners', 'process', 'guidelines'],
            coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
            readTime: 8,
            views: 1250,
            likes: 56,
            createdAt: new Date(Date.now() - 3024000000),
            updatedAt: new Date(Date.now() - 3024000000)
        },
        {
            _id: '2d3e4f',
            title: 'Bid Writing Best Practices',
            slug: 'bid-writing-best-practices',
            summary: 'Key strategies for writing winning government tender bids',
            content: 'Writing a successful bid requires attention to detail and a strategic approach...',
            author: {
                _id: 'author2',
                firstName: 'Priya',
                lastName: 'Singh',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            category: 'Bid Writing',
            tags: ['writing', 'strategy', 'success'],
            coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            readTime: 12,
            views: 980,
            likes: 78,
            createdAt: new Date(Date.now() - 2592000000),
            updatedAt: new Date(Date.now() - 2592000000)
        }
    ].find(a => a.slug === slug);

    if (!article) {
        return next(new AppError('Article not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            article
        }
    });
});

/**
 * Get article by ID
 */
exports.getArticle = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // Mock article by ID
    const article = [{
        _id: '1a2b3c',
        title: 'Understanding Government Tender Process',
        slug: 'understanding-government-tender-process',
        summary: 'A comprehensive guide to the government tender process in India',
        content: 'The government tender process in India follows specific procedures and regulations...',
        author: {
            _id: 'author1',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        category: 'Tender Basics',
        tags: ['beginners', 'process', 'guidelines'],
        coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
        readTime: 8,
        views: 1250,
        likes: 56,
        createdAt: new Date(Date.now() - 3024000000),
        updatedAt: new Date(Date.now() - 3024000000)
    }].find(a => a._id === id);

    if (!article) {
        return next(new AppError('Article not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            article
        }
    });
});

/**
 * Get related articles
 */
exports.getRelatedArticles = catchAsync(async(req, res, next) => {
    const { articleId } = req.params;

    // In a real implementation, we would find the article first and then find related articles
    // For mock purposes, just return some other articles
    const articles = [{
            _id: '2d3e4f',
            title: 'Bid Writing Best Practices',
            slug: 'bid-writing-best-practices',
            summary: 'Key strategies for writing winning government tender bids',
            author: {
                _id: 'author2',
                firstName: 'Priya',
                lastName: 'Singh',
                avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
            },
            category: 'Bid Writing',
            coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            readTime: 12,
            views: 980,
            likes: 78,
            createdAt: new Date(Date.now() - 2592000000)
        },
        {
            _id: '3g4h5i',
            title: 'Financial Estimation for Government Projects',
            slug: 'financial-estimation-government-projects',
            summary: 'How to create accurate financial estimates for government tenders',
            author: {
                _id: 'author3',
                firstName: 'Amit',
                lastName: 'Sharma',
                avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
            },
            category: 'Financial',
            coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
            readTime: 15,
            views: 745,
            likes: 42,
            createdAt: new Date(Date.now() - 1728000000)
        }
    ];

    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles
        }
    });
});

/**
 * Get articles by author
 */
exports.getArticlesByAuthor = catchAsync(async(req, res, next) => {
    const { authorId } = req.params;

    // Mock articles by author
    const articles = [{
            _id: '1a2b3c',
            title: 'Understanding Government Tender Process',
            slug: 'understanding-government-tender-process',
            summary: 'A comprehensive guide to the government tender process in India',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Tender Basics',
            coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
            readTime: 8,
            views: 1250,
            likes: 56,
            createdAt: new Date(Date.now() - 3024000000)
        },
        {
            _id: '5m6n7o',
            title: 'Tender Evaluation Criteria Explained',
            slug: 'tender-evaluation-criteria-explained',
            summary: 'Understanding how government agencies evaluate tender applications',
            author: {
                _id: 'author1',
                firstName: 'Rajesh',
                lastName: 'Kumar',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            category: 'Evaluation',
            coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
            readTime: 9,
            views: 876,
            likes: 63,
            createdAt: new Date(Date.now() - 432000000)
        }
    ].filter(a => a.author._id === authorId);

    res.status(200).json({
        status: 'success',
        results: articles.length,
        data: {
            articles
        }
    });
});

/**
 * Like an article
 */
exports.likeArticle = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would toggle the like status and update the likes count

    res.status(200).json({
        status: 'success',
        data: {
            articleId: id,
            liked: true
        }
    });
});

/**
 * Create a new article (admin and content creators only)
 */
exports.createArticle = catchAsync(async(req, res, next) => {
    const articleData = req.body;

    // In a real implementation, we would create a new article in the database
    const newArticle = {
        _id: uuidv4(),
        ...articleData,
        author: {
            _id: req.user.id,
            firstName: req.user.name.split(' ')[0],
            lastName: req.user.name.split(' ')[1] || '',
            avatar: req.user.avatar
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0
    };

    res.status(201).json({
        status: 'success',
        data: {
            article: newArticle
        }
    });
});

/**
 * Update an article (admin and content creators only)
 */
exports.updateArticle = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // In a real implementation, we would update the article in the database

    res.status(200).json({
        status: 'success',
        data: {
            article: {
                _id: id,
                ...updateData,
                updatedAt: new Date()
            }
        }
    });
});

/**
 * Delete an article (admin and content creators only)
 */
exports.deleteArticle = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would delete the article from the database

    res.status(204).json({
        status: 'success',
        data: null
    });
});