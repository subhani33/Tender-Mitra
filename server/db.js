const mongoose = require('mongoose');
const logger = require('./utils/logger');

// Variable to track if we've connected to DB
let isConnected = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 3000;

/**
 * Enhanced MongoDB connection function with robust error handling
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<boolean>} - Whether connection was successful
 */
const connectDB = async(retries = 3, delay = INITIAL_RECONNECT_DELAY) => {
    if (isConnected) {
        logger.info('MongoDB already connected');
        return true;
    }

    // Reset connection attempts on manual call
    if (retries === 3) {
        connectionAttempts = 0;
    }

    // Use URI from environment variable or default to localhost
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edtodo_technovations';
    const displayUri = uri.includes('@') ? `${uri.split('@')[0].split('//')[0]}//****@${uri.split('@')[1]}` : uri;

    try {
        // Validate MongoDB URI format
        if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
            logger.error('Invalid MongoDB URI format. URI must start with mongodb:// or mongodb+srv://');
            return useMockData('Invalid MongoDB URI format');
        }

        logger.info(`Attempting to connect to MongoDB: ${displayUri}`);

        // Set mongoose options for better reliability
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000, // 45 second timeout for operations
            connectTimeoutMS: 30000, // 30 seconds timeout for initial connection
            heartbeatFrequencyMS: 30000, // Check server every 30 seconds
            maxPoolSize: 100, // Maintain up to 100 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            retryWrites: true, // Retry write operations
            retryReads: true, // Retry read operations
            dbName: uri.split('/').pop() || 'edtodo_technovations' // Extract database name from URI or use default
        });

        isConnected = true;
        connectionAttempts = 0;
        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        // Reset mongoose.Promise to global Promise
        mongoose.Promise = global.Promise;

        // Set up connection event handlers
        setupConnectionHandlers();

        return true;
    } catch (error) {
        connectionAttempts++;

        // Analyze the error for more helpful error messages
        let errorReason = error.message;
        if (error.name === 'MongoServerSelectionError') {
            errorReason = 'Could not reach MongoDB server. Please check if MongoDB is running.';
        } else if (error.name === 'MongoNetworkError') {
            errorReason = 'Network error connecting to MongoDB. Please check your network connection.';
        } else if (error.message.includes('authentication failed')) {
            errorReason = 'MongoDB authentication failed. Please check your username and password.';
        } else if (error.message.includes('ECONNREFUSED')) {
            errorReason = 'Connection refused. Please check if MongoDB server is running on the specified host and port.';
        } else if (error.message.includes('bad auth')) {
            errorReason = 'Authentication failed. Ensure your credentials are correct and the user has appropriate permissions.';
        }

        // Retry logic with exponential backoff
        if (retries > 0) {
            const backoffDelay = delay * Math.pow(1.5, MAX_RECONNECT_ATTEMPTS - retries); // Exponential backoff
            logger.warn(`MongoDB connection attempt failed (${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS}). Retrying in ${Math.round(backoffDelay/1000)} seconds...`);
            logger.error(`Error details: ${errorReason}`);

            // Wait for the specified delay
            await new Promise(resolve => setTimeout(resolve, backoffDelay));

            // Retry connection with one less retry attempt
            return connectDB(retries - 1, delay);
        } else {
            return useMockData(errorReason);
        }
    }
};

/**
 * Set up MongoDB connection event handlers
 */
const setupConnectionHandlers = () => {
    const db = mongoose.connection;

    // Handle successful reconnection
    db.on('reconnected', () => {
        isConnected = true;
        logger.info('MongoDB reconnected successfully');
    });

    // Handle MongoDB connection errors
    db.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
        if (isConnected) {
            logger.warn('Connection lost. Attempting to reconnect...');
            isConnected = false;
        }
    });

    // Handle MongoDB disconnection
    db.on('disconnected', () => {
        isConnected = false;
        logger.warn('MongoDB disconnected');

        // Try to reconnect if disconnected unexpectedly
        if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
            const reconnectDelay = INITIAL_RECONNECT_DELAY * Math.pow(1.5, connectionAttempts);
            logger.info(`Attempting to reconnect in ${Math.round(reconnectDelay/1000)} seconds...`);

            setTimeout(() => {
                connectDB(MAX_RECONNECT_ATTEMPTS - connectionAttempts, INITIAL_RECONNECT_DELAY)
                    .catch(err => logger.error(`Reconnection failed: ${err.message}`));
            }, reconnectDelay);
        } else {
            useMockData('Maximum reconnection attempts reached');
        }
    });

    // Log when MongoDB closes the connection
    db.on('close', () => {
        logger.info('MongoDB connection closed');
    });
};

/**
 * Fall back to using mock data services
 * @param {string} reason - The reason for falling back to mock data
 * @returns {boolean} - Always returns false
 */
const useMockData = (reason) => {
    logger.error(`MongoDB connection failed: ${reason}`);
    logger.warn('Falling back to mock data services. Data will not be persisted.');

    // Display a clear box with detailed instructions
    console.log("\n" + "=".repeat(80));
    console.log("  MONGODB CONNECTION ERROR".padStart(50, " "));
    console.log("=".repeat(80));
    console.log(`\n  ERROR: ${reason}\n`);
    console.log("  The application is running in MOCK DATA mode.");
    console.log("  All data will be temporary and not persisted between restarts.\n");
    console.log("  To fix this error, please try the following steps:");
    console.log("  1. Verify MongoDB is installed and running:");
    console.log("     - Run: 'mongod --version' to check installation");
    console.log("     - Run: 'ps aux | grep mongod' to check if MongoDB is running");
    console.log("  2. Check your MongoDB connection string in .env file:");
    console.log(`     - Current setting: ${process.env.MONGODB_URI || 'Not set (using default)'}`);
    console.log("     - Format should be: mongodb://[username:password@]host[:port]/database");
    console.log("  3. If using MongoDB Atlas:");
    console.log("     - Verify your IP address is in the Atlas whitelist");
    console.log("     - Check if credentials are correct");
    console.log("     - Test connection with MongoDB Compass");
    console.log("  4. For local MongoDB:");
    console.log("     - Run the setup script: './setup-mongodb.sh'");
    console.log("     - Check mongod service: 'sudo systemctl status mongod' (Linux)");
    console.log("     - Check network access: telnet localhost 27017\n");
    console.log("  Development can continue with mock data.\n");
    console.log("=".repeat(80) + "\n");

    // Set flag to indicate we're using mock data
    global.USING_MOCK_DATA = true;

    return false;
};

// Export a function that ensures the connection is established
module.exports = connectDB;

// Also export a utility function to check if we're connected
module.exports.isConnected = () => isConnected;

// Export utility to check if using mock data
module.exports.isUsingMockData = () => global.USING_MOCK_DATA === true;