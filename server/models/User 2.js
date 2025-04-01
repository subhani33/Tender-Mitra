const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const createModelProxy = require('./modelProxy');

/**
 * User Schema for MongoDB
 * Includes authentication, role-based access, and profile information
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password in queries
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'manager'],
            message: '{VALUE} is not a valid role'
        },
        default: 'user'
    },
    company: {
        name: {
            type: String,
            trim: true
        },
        position: {
            type: String,
            trim: true
        },
        industry: {
            type: String,
            trim: true
        }
    },
    savedTenders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tender'
    }],
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            browser: {
                type: Boolean,
                default: true
            }
        },
        categories: [{
            type: String,
            enum: [
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
            ]
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Only return active users by default
userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(12);
        // Hash the password along with the new salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if entered password is correct
userSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token expires in 10 minutes
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// Method to generate email verification token
userSchema.methods.createVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // Token expires in 24 hours
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    return verificationToken;
};

// Export the model
module.exports = createModelProxy(mongoose.model('User', userSchema), 'users');