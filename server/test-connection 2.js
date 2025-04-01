/**
 * MongoDB Connection Test Script
 * This script tests the connection to MongoDB and provides detailed information
 * on success or failure.
 * 
 * Usage: node test-connection.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        crimson: '\x1b[38m'
    },

    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        crimson: '\x1b[48m'
    }
};

// Print header
console.log('\n' + colors.bg.blue + colors.fg.white + ' MongoDB Connection Test ' + colors.reset + '\n');

// Get MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.log(colors.fg.red + 'Error: MONGODB_URI environment variable is not set.' + colors.reset);
    console.log('Please make sure you have a .env file with MONGODB_URI defined.');
    console.log('Example: MONGODB_URI=mongodb://localhost:27017/edtodo_technovations');
    process.exit(1);
}

// Mask sensitive information in URI for display
const displayUri = uri.includes('@') ?
    `${uri.split('@')[0].split('//')[0]}//****@${uri.split('@')[1]}` :
    uri;

console.log(`${colors.fg.cyan}Connecting to: ${displayUri}${colors.reset}`);
console.log(`${colors.fg.yellow}Attempting connection...${colors.reset}`);

// Set connection options
const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Test MongoDB connection
(async() => {
    try {
        // Get start time
        const startTime = Date.now();

        // Connect to MongoDB
        const conn = await mongoose.connect(uri, options);

        // Calculate connection time
        const connectionTime = Date.now() - startTime;

        console.log(`\n${colors.fg.green}✓ Connection successful!${colors.reset} (${connectionTime}ms)`);
        console.log(`${colors.fg.green}✓ Connected to: ${conn.connection.host}${colors.reset}`);
        console.log(`${colors.fg.green}✓ Database name: ${conn.connection.db.databaseName}${colors.reset}`);

        // Get server info
        const admin = conn.connection.db.admin();
        const serverInfo = await admin.serverInfo();
        console.log(`${colors.fg.green}✓ MongoDB version: ${serverInfo.version}${colors.reset}`);

        // Test a simple operation
        const pingResult = await conn.connection.db.command({ ping: 1 });
        console.log(`${colors.fg.green}✓ Database ping: ${JSON.stringify(pingResult)}${colors.reset}`);

        // List collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`\n${colors.fg.cyan}Collections in database:${colors.reset}`);

        if (collections.length === 0) {
            console.log(`${colors.fg.yellow}No collections found. Database is empty.${colors.reset}`);
        } else {
            collections.forEach(collection => {
                console.log(`  - ${collection.name}`);
            });
        }

        console.log(`\n${colors.bg.green}${colors.fg.black} CONNECTION TEST PASSED ${colors.reset}\n`);

        // Close connection
        await mongoose.connection.close();

    } catch (error) {
        console.log(`\n${colors.bg.red}${colors.fg.white} CONNECTION TEST FAILED ${colors.reset}\n`);

        // Parse error for more specific information
        if (error.name === 'MongoServerSelectionError') {
            console.log(`${colors.fg.red}Error: Could not connect to MongoDB server.${colors.reset}`);
            console.log(`${colors.fg.yellow}Reason: ${error.message}${colors.reset}`);

            if (error.message.includes('connection timed out')) {
                console.log(`\n${colors.fg.yellow}Possible causes:${colors.reset}`);
                console.log(`  - MongoDB server is not running`);
                console.log(`  - Firewall is blocking the connection`);
                console.log(`  - MongoDB is running on a different port`);
                console.log(`  - Network connectivity issues`);
            } else if (error.message.includes('authentication failed')) {
                console.log(`\n${colors.fg.yellow}Possible causes:${colors.reset}`);
                console.log(`  - Username or password is incorrect`);
                console.log(`  - User doesn't have access to the database`);
                console.log(`  - Authentication database is incorrect`);
            } else if (error.message.includes('ECONNREFUSED')) {
                console.log(`\n${colors.fg.yellow}Possible causes:${colors.reset}`);
                console.log(`  - MongoDB server is not running`);
                console.log(`  - MongoDB is running on a different port`);
                console.log(`  - MongoDB is running on a different host`);
            }
        } else {
            console.log(`${colors.fg.red}Error: ${error.message}${colors.reset}`);
        }

        console.log(`\n${colors.fg.yellow}Troubleshooting steps:${colors.reset}`);
        console.log(`  1. Verify MongoDB is installed and running`);
        console.log(`     - Run: mongod --version`);
        console.log(`     - Run: ps aux | grep mongod`);
        console.log(`  2. Check MongoDB connection string in .env file`);
        console.log(`  3. Try connecting with MongoDB Compass to verify credentials`);
        console.log(`  4. Run the setup script: ./config/setup-mongodb.sh`);

        process.exit(1);
    }

    // Exit process
    process.exit(0);
})();