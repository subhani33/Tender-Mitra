const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Bid Schema for MongoDB
 * Represents bid submissions with document tracking and status
 */

// Schema for bid document
const bidDocumentSchema = new Schema({
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
    },
    category: {
        type: String,
        enum: ['technical', 'financial', 'legal', 'administrative', 'other'],
        default: 'other'
    }
});

// Schema for checklist item
const checklistItemSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Checklist item title is required']
    },
    description: {
        type: String
    },
    required: {
        type: Boolean,
        default: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    category: {
        type: String,
        enum: ['technical', 'financial', 'legal', 'administrative', 'general'],
        default: 'general'
    }
});

// Schema for financial breakdown item
const financialBreakdownItemSchema = new Schema({
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    quantity: {
        type: Number,
        default: 1
    },
    unit: {
        type: String
    },
    category: {
        type: String
    }
});

// Schema for team member
const teamMemberSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required']
    },
    experience: {
        type: String
    },
    qualifications: {
        type: [String]
    },
    responsibilities: {
        type: String
    }
});

// Schema for notes
const noteSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Note content is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    }
});

// Main bid schema
const bidSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Bid title is required'],
        trim: true
    },
    tender: {
        type: Schema.Types.ObjectId,
        ref: 'Tender',
        required: [true, 'Tender reference is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    status: {
        type: String,
        enum: ['draft', 'in-progress', 'submitted', 'awarded', 'rejected'],
        default: 'draft'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    proposalText: {
        type: String,
        default: ''
    },
    technicalApproach: {
        type: String,
        default: ''
    },
    documents: [bidDocumentSchema],
    checklist: [checklistItemSchema],
    financialDetails: {
        bidAmount: {
            type: Number
        },
        currency: {
            type: String,
            default: 'USD'
        },
        validityPeriod: {
            type: Number, // days
            default: 90
        },
        paymentTerms: {
            type: String
        },
        breakdown: [financialBreakdownItemSchema]
    },
    companyDetails: {
        name: {
            type: String
        },
        contactPerson: {
            type: String
        },
        email: {
            type: String
        },
        registrationNumber: {
            type: String
        },
        taxNumber: {
            type: String
        },
        yearEstablished: {
            type: Number
        },
        employeeCount: {
            type: Number
        }
    },
    team: [teamMemberSchema],
    notes: [noteSchema],
    adminFeedback: {
        content: {
            type: String
        },
        providedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        providedAt: {
            type: Date
        }
    },
    submittedAt: {
        type: Date
    },
    decisionDate: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
bidSchema.index({ user: 1, createdAt: -1 });
bidSchema.index({ tender: 1 });
bidSchema.index({ status: 1 });

// Virtual for calculating completion percentage
bidSchema.virtual('completionPercentage').get(function() {
    return this.progress;
});

// Pre-save middleware
bidSchema.pre('save', function(next) {
    // Calculate progress based on completed fields and checklist items
    let totalPoints = 0;
    let earnedPoints = 0;

    // Basic information - 20 points
    totalPoints += 20;
    if (this.title) earnedPoints += 5;
    if (this.proposalText && this.proposalText.length > 100) earnedPoints += 10;
    if (this.technicalApproach && this.technicalApproach.length > 100) earnedPoints += 5;

    // Financial details - 20 points
    totalPoints += 20;
    if (this.financialDetails.bidAmount) earnedPoints += 10;
    if (this.financialDetails.breakdown && this.financialDetails.breakdown.length > 0) earnedPoints += 10;

    // Company details - 15 points
    totalPoints += 15;
    const companyFields = ['name', 'contactPerson', 'email', 'registrationNumber', 'taxNumber'];
    companyFields.forEach(field => {
        if (this.companyDetails[field]) earnedPoints += 3;
    });

    // Documents - 20 points
    totalPoints += 20;
    if (this.documents.length > 0) {
        earnedPoints += Math.min(20, this.documents.length * 5);
    }

    // Checklist - 15 points
    if (this.checklist.length > 0) {
        totalPoints += 15;
        const completedItems = this.checklist.filter(item => item.completed).length;
        earnedPoints += Math.round((completedItems / this.checklist.length) * 15);
    }

    // Team - 10 points
    totalPoints += 10;
    if (this.team.length > 0) {
        earnedPoints += Math.min(10, this.team.length * 2);
    }

    // Calculate final progress
    this.progress = Math.round((earnedPoints / totalPoints) * 100);

    next();
});

// Static method to calculate bid statistics for a user
bidSchema.statics.calcBidStats = async function(userId) {
    const stats = await this.aggregate([{
            $match: { user: mongoose.Types.ObjectId(userId) }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    return stats;
};

// Instance method to check if bid is editable
bidSchema.methods.isEditable = function() {
    return ['draft', 'in-progress'].includes(this.status);
};

// Instance method to check if bid can be submitted
bidSchema.methods.canBeSubmitted = function() {
    return this.progress >= 80 && ['draft', 'in-progress'].includes(this.status);
};

// Create the model
const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;