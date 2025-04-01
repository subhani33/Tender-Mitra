const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Tender Schema for MongoDB
 * Represents government tender data with status and category validation
 */

// Schema for tender document
const tenderDocumentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Document name is required']
    },
    description: {
        type: String
    },
    fileName: {
        type: String,
        required: [true, 'File name is required']
    },
    fileSize: {
        type: Number,
        required: [true, 'File size is required']
    },
    fileType: {
        type: String,
        required: [true, 'File type is required']
    },
    path: {
        type: String,
        required: [true, 'File path is required']
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

// Schema for tender requirement
const requirementSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Requirement title is required']
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ['technical', 'financial', 'legal', 'administrative', 'other'],
        default: 'other'
    },
    mandatory: {
        type: Boolean,
        default: true
    }
});

// Schema for eligibility criteria
const eligibilityCriteriaSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Criteria title is required']
    },
    description: {
        type: String
    },
    mandatory: {
        type: Boolean,
        default: true
    }
});

// Main tender schema
const tenderSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Tender title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    referenceNumber: {
        type: String,
        required: [true, 'Reference number is required'],
        unique: true,
        trim: true,
        index: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        index: true
    },
    value: {
        type: Number,
        required: [true, 'Tender value is required'],
        min: [0, 'Value cannot be negative']
    },
    deadline: {
        type: Date,
        required: [true, 'Submission deadline is required'],
        index: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['Open', 'Closing Soon', 'Closed', 'Under Review', 'Awarded'],
            message: '{VALUE} is not a valid tender status'
        },
        default: 'Open',
        index: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    location: {
        type: String,
        required: false,
        trim: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: [
                'IT & Technology',
                'Construction',
                'Healthcare',
                'Education',
                'Infrastructure',
                'Aviation',
                'Defense',
                'Energy',
                'Transportation',
                'Agriculture',
                'Other'
            ],
            message: '{VALUE} is not a valid tender category'
        },
        index: true
    },
    documents: [tenderDocumentSchema],
    requirements: [requirementSchema],
    eligibilityCriteria: [eligibilityCriteriaSchema],
    evaluationCriteria: {
        type: String
    },
    contactPerson: {
        name: String,
        email: String,
        phone: String
    },
    currency: {
        type: String,
        default: 'USD'
    },
    issueDate: {
        type: Date,
        required: [true, 'Issue date is required']
    },
    awardDate: {
        type: Date
    },
    additionalInformation: {
        type: String,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator reference is required']
    },
    awardedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    tags: [String],
    source: {
        type: String,
        trim: true
    },
    published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for days remaining until deadline
tenderSchema.virtual('daysRemaining').get(function() {
    if (!this.deadline) return null;
    const now = new Date();
    const diffTime = this.deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
});

// Set status to "Closing Soon" if deadline is within 3 days
tenderSchema.pre('save', function(next) {
    if (this.status === 'Open' && this.daysRemaining <= 3 && this.daysRemaining > 0) {
        this.status = 'Closing Soon';
    }
    if (this.deadline < new Date() && (this.status === 'Open' || this.status === 'Closing Soon')) {
        this.status = 'Closed';
    }
    next();
});

// Create text index for full text search
tenderSchema.index({ title: 'text', description: 'text', department: 'text', referenceNumber: 'text' });

// Virtual for bid count
tenderSchema.virtual('bids', {
    ref: 'Bid',
    localField: '_id',
    foreignField: 'tender',
    count: true
});

// Virtual for active status
tenderSchema.virtual('isActive').get(function() {
    return this.status === 'Open' && this.daysRemaining > 0;
});

// Pre-save middleware for formatting reference number
tenderSchema.pre('save', function(next) {
    // Format reference number if needed
    if (this.isNew && !this.referenceNumber.includes('-')) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        // Create a formatted reference number if not already formatted
        this.referenceNumber = `TN-${year}${month}-${this.referenceNumber}`;
    }

    next();
});

// Pre-find middleware to populate bid count
tenderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'bids',
        select: 'count'
    });

    next();
});

// Static method to find active tenders
tenderSchema.statics.findActive = function() {
    const now = new Date();
    return this.find({
        status: 'Open',
        deadline: { $gt: now }
    });
};

// Static method to find tenders closing soon
tenderSchema.statics.findClosingSoon = function(days = 7) {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    return this.find({
        status: 'Open',
        deadline: { $gt: now, $lt: future }
    }).sort('deadline');
};

// Instance method to check if tender can be edited
tenderSchema.methods.canBeEdited = function() {
    return ['Open', 'Closing Soon'].includes(this.status);
};

// Instance method to check if tender can be bid on
tenderSchema.methods.canBeBidOn = function() {
    return ['Open', 'Closing Soon'].includes(this.status) && this.daysRemaining > 0;
};

const Tender = mongoose.model('Tender', tenderSchema);

module.exports = Tender;