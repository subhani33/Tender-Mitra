const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { doubleCsrf } = require('csrf-csrf');

const connectDB = require('./db');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Set up Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Set trust proxy for heroku
app.set('trust proxy', 1);

// Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again after an hour!'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Add CSRF protection with csrf-csrf
const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_change_in_production',
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === 'production',
        path: "/"
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

// Apply CSRF protection to routes that need it (except for API endpoints used by external clients)
app.use('/api/auth/change-password', doubleCsrfProtection);
app.use('/api/auth/update-profile', doubleCsrfProtection);
app.use('/api/bids/submit', doubleCsrfProtection);

// Route to get CSRF token
app.get('/api/csrf-token', (req, res) => {
    res.json({
        status: 'success',
        data: {
            csrfToken: generateToken(req, res)
        }
    });
});

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
        'status',
        'category',
        'department',
        'value'
    ]
}));

// Compression
app.use(compression());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection handler
io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Handle tender dashboard events
    require('./socketHandlers/tenderHandler')(io, socket);

    // Handle bid management events
    require('./socketHandlers/bidHandler')(io, socket);

    // Handle connection events
    socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
        logger.error(`Socket error: ${error.message}`);
    });
});

// API Routes
app.use('/api/tenders', require('./routes/tenderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/service', require('./routes/serviceRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'Service is healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        dbStatus: connectDB.isConnected() ? 'connected' : (connectDB.isUsingMockData() ? 'mock' : 'disconnected')
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('Tender Platform API is running');
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.name}: ${err.message}`, { stack: err.stack });
    logger.error(err.stack);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.name}: ${err.message}`, { stack: err.stack });
    logger.error(err.stack);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = { app, server, io };