const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Article Schema for Knowledge Base
 * Represents educational content with categories, tags, and rich content
 */
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    content: {
        type: String,
        required: [true, 'Article content is required']
    },
    summary: {
        type: String,
        required: [true, 'Article summary is required'],
        trim: true,
        maxlength: [250, 'Summary cannot exceed 250 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: [
                'Tender Basics',
                'Bid Writing',
                'Compliance',
                'Legal',
                'Technical',
                'Financial',
                'Digital Submission',
                'Success Stories',
                'Case Studies',
                'Best Practices'
            ],
            message: '{VALUE} is not a valid article category'
        },
        index: true
    },
    tags: {
        type: [String],
        validate: {
            validator: function(tags) {
                return tags.length <= 10;
            },
            message: 'Articles cannot have more than 10 tags'
        }
    },
    featuredImage: {
        type: String,
        default: 'default-article.jpg'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Article must have an author']
    },
    published: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    readTime: {
        type: Number,
        min: 1,
        comment: 'Estimated read time in minutes'
    },
    difficulty: {
        type: String,
        enum: {
            values: ['Beginner', 'Intermediate', 'Advanced'],
            message: '{VALUE} is not a valid difficulty level'
        },
        default: 'Beginner'
    },
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['Link', 'PDF', 'Video', 'Template']
        }
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    relatedArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create slug from the title before saving
articleSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        });
    }

    // Set published date when article is published
    if (this.isModified('published') && this.published && !this.publishedAt) {
        this.publishedAt = Date.now();
    }

    // Calculate read time based on content length (average reading speed: 200 words/minute)
    if (this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }

    next();
});

// Create text index for full text search
articleSchema.index({
    title: 'text',
    content: 'text',
    summary: 'text',
    tags: 'text'
});

// Virtual populate for comments
articleSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'article',
    localField: '_id'
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;