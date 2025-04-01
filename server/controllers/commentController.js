const Comment = require('../models/Comment');
const Article = require('../models/Article');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new comment
 */
exports.createComment = catchAsync(async(req, res, next) => {
    const { articleId } = req.params;
    const { content } = req.body;

    if (!content) {
        return next(new AppError('Comment content is required', 400));
    }

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('No article found with that ID', 404));
    }

    // Create comment with user and article reference
    const newComment = await Comment.create({
        content,
        article: articleId,
        user: req.user.id
    });

    // Populate user data
    await newComment.populate({
        path: 'user',
        select: 'firstName lastName avatar'
    });

    res.status(201).json({
        status: 'success',
        data: {
            comment: newComment
        }
    });
});

/**
 * Get all comments for an article
 */
exports.getCommentsByArticle = catchAsync(async(req, res, next) => {
    const { articleId } = req.params;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
        return next(new AppError('No article found with that ID', 404));
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get comments
    const comments = await Comment.find({ article: articleId })
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .populate({
            path: 'user',
            select: 'firstName lastName avatar'
        });

    // Get total count
    const totalCount = await Comment.countDocuments({ article: articleId });

    res.status(200).json({
        status: 'success',
        results: comments.length,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data: {
            comments
        }
    });
});

/**
 * Update a comment
 * Users can only update their own comments
 */
exports.updateComment = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return next(new AppError('Comment content is required', 400));
    }

    const comment = await Comment.findById(id);

    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    // Check if user is comment owner
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to update this comment', 403));
    }

    // Update comment
    comment.content = content;
    comment.edited = true;
    comment.updatedAt = new Date();
    await comment.save();

    await comment.populate({
        path: 'user',
        select: 'firstName lastName avatar'
    });

    res.status(200).json({
        status: 'success',
        data: {
            comment
        }
    });
});

/**
 * Delete a comment
 * Users can delete their own comments, admins can delete any comment
 */
exports.deleteComment = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    // Check if user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to delete this comment', 403));
    }

    await Comment.findByIdAndDelete(id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});

/**
 * Get all comments (admin only)
 */
exports.getAllComments = catchAsync(async(req, res, next) => {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find()
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .populate({
            path: 'user',
            select: 'firstName lastName avatar'
        })
        .populate({
            path: 'article',
            select: 'title slug'
        });

    const totalCount = await Comment.countDocuments();

    res.status(200).json({
        status: 'success',
        results: comments.length,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data: {
            comments
        }
    });
});

/**
 * Get comments by user
 */
exports.getCommentsByUser = catchAsync(async(req, res, next) => {
    const userId = req.params.userId || req.user.id;

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ user: userId })
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .populate({
            path: 'article',
            select: 'title slug'
        });

    const totalCount = await Comment.countDocuments({ user: userId });

    res.status(200).json({
        status: 'success',
        results: comments.length,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data: {
            comments
        }
    });
});

/**
 * Like a comment
 */
exports.likeComment = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    // In a real implementation, we would toggle the like status

    res.status(200).json({
        status: 'success',
        data: {
            commentId: id,
            liked: true
        }
    });
});

/**
 * Get comment replies
 */
exports.getCommentReplies = catchAsync(async(req, res, next) => {
    const { commentId } = req.params;

    // Mock replies data
    const replies = [{
        _id: '4h5i6j',
        content: 'I agree! The evaluation criteria section was very informative.',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        user: {
            _id: 'user4',
            firstName: 'Sunita',
            lastName: 'Gupta',
            avatar: 'https://randomuser.me/api/portraits/women/7.jpg'
        },
        likes: 2
    }];

    res.status(200).json({
        status: 'success',
        results: replies.length,
        data: {
            replies
        }
    });
});

/**
 * Add a reply to a comment
 */
exports.addCommentReply = catchAsync(async(req, res, next) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        return next(new AppError('Reply content is required', 400));
    }

    // In a real implementation, we would create a new reply in the database
    const newReply = {
        _id: uuidv4(),
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
            _id: req.user.id,
            firstName: req.user.name.split(' ')[0],
            lastName: req.user.name.split(' ')[1] || '',
            avatar: req.user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
        },
        likes: 0
    };

    res.status(201).json({
        status: 'success',
        data: {
            reply: newReply
        }
    });
});