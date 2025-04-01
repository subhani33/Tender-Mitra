const mongoose = require('mongoose');

/**
 * Comment Schema for MongoDB
 * Represents comments for knowledge base articles with user associations
 */
const commentSchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: [true, 'Comment must belong to an article']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    },
    text: {
        type: String,
        required: [true, 'Comment cannot be empty'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editHistory: [{
        text: String,
        editedAt: Date
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for replies (child comments)
commentSchema.virtual('replies', {
    ref: 'Comment',
    foreignField: 'parent',
    localField: '_id'
});

// Pre-find middleware to populate user and handle deleted users
commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName avatar'
    });
    next();
});

// When querying for comments, only return approved comments
commentSchema.pre(/^find/, function(next) {
    // If query is explicitly looking for unapproved comments, don't filter
    if (this.getQuery().isApproved === false) {
        return next();
    }

    // Otherwise filter to approved comments only
    this.find({ isApproved: true });
    next();
});

// Check for profanity/inappropriate content
commentSchema.pre('save', function(next) {
    // Placeholder for future implementation of profanity checking
    // This could integrate with a third-party API or use a word list

    // For now, we'll just pass through
    next();
});

// When a comment is saved, update the comment count on the article
commentSchema.post('save', async function() {
    try {
        const Article = mongoose.model('Article');
        await Article.findByIdAndUpdate(this.article, { $inc: { commentCount: 1 } });
    } catch (err) {
        console.error('Error updating article comment count:', err);
    }
});

// Create indexes for efficient queries
commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ parent: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;