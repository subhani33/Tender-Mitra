# EdTodo Backend Server

This is the backend server for the EdTodo application, providing a REST API for the frontend.

## Features

- Secure authentication with JWT
- MongoDB database for persistent storage
- Automatic fallback to mock data when MongoDB is unavailable
- CSRF protection for secure forms
- Health check endpoints for monitoring
- Comprehensive error handling

## MongoDB Configuration

The application requires MongoDB for data persistence. When MongoDB is unavailable, the application will automatically fall back to using an in-memory mock database to allow development to continue.

### Configuration Options

The MongoDB connection is configured in the `.env` file with the following options:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/edtodo_technovations
MONGODB_TEST_URI=mongodb://localhost:27017/edtodo_technovations_test
```

### Testing MongoDB Connection

To test your MongoDB connection, you can run:

```bash
node server/test-connection.js
```

This will provide detailed information about the connection status and any issues encountered.

### Setup Script

A setup script is provided to help you install and configure MongoDB:

```bash
# Make the script executable
chmod +x server/config/setup-mongodb.sh

# Run the script
./server/config/setup-mongodb.sh
```

The script will:
1. Check if MongoDB is installed
2. Install MongoDB if needed (on supported platforms)
3. Start the MongoDB service
4. Create the required database and user
5. Update your .env file with the correct connection URI

## Mock Data Mode

When MongoDB is unavailable, the application will automatically use an in-memory mock database. This allows development to continue without requiring a MongoDB connection.

Features of mock mode:
- In-memory storage of data (lost on server restart)
- Automatic switching between real and mock data
- API endpoints continue to function
- Useful for development and testing

You can check if the application is using mock data by calling the health endpoint:

```bash
curl http://localhost:3000/api/service/health
```

## Troubleshooting

If you're experiencing issues with MongoDB connection:

1. **Check if MongoDB is installed and running**
   ```bash
   mongod --version
   ps aux | grep mongod
   ```

2. **Verify your connection string**
   Check the MONGODB_URI in your .env file. The format should be:
   ```
   mongodb://[username:password@]host[:port]/database
   ```

3. **Run the diagnostic script**
   ```bash
   node server/test-connection.js
   ```

4. **Check the application logs**
   The application logs detailed information about connection attempts and errors.

5. **Run the setup script**
   ```bash
   ./server/config/setup-mongodb.sh
   ```

6. **Restart the server**
   Sometimes simply restarting the server can resolve connection issues.

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## Development

To start the server in development mode:

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when changes are detected.

## Production

To start the server in production mode:

```bash
npm start
```

Make sure to set NODE_ENV=production in your .env file. 