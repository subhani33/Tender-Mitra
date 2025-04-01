# EdtoDo Technovations - Quick Start Guide

This guide will help you get the EdtoDo Technovations Tender Platform up and running quickly.

## Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)

## Setup in 5 Easy Steps

1. **Run the setup script**

   ```bash
   ./setup.sh
   ```

   This script will:
   - Make the development script executable
   - Create necessary directories
   - Install project dependencies
   - Set up environment variables

2. **Configure your environment variables**

   Edit the `.env` file to configure your application:

   ```bash
   # Basic settings you might want to change:
   PORT=3000                                   # Backend port
   MONGODB_URI=mongodb://localhost:27017/edtodo_technovations  # MongoDB connection
   JWT_SECRET=your_secure_secret_key           # Change this!
   ```

3. **Start the development servers**

   ```bash
   ./run-dev.sh
   ```

   Or use npm:

   ```bash
   npm run dev
   ```

4. **Access the application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

5. **Test with mock login**

   - Email: user@example.com
   - Password: password123

## Project Structure

- `server/` - Backend code (Node.js/Express)
- `src/` - Frontend code (React)
- `public/` - Static assets
- `.env` - Environment configuration
- `run-dev.sh` - Development startup script
- `setup.sh` - Initial setup script

## Additional Documentation

- `README.md` - Complete project overview
- `GUIDE.md` - Detailed instructions and API documentation
- `WELCOME.txt` - Features and quick reference

## Troubleshooting

If you encounter any issues:

1. Ensure MongoDB is running if using a local database
2. Check that ports 3000 and 5173 are available
3. Verify that all environment variables are set correctly
4. Look for error messages in the terminal output

For more help, refer to the full documentation in GUIDE.md. 