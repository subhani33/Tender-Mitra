# EdtoDo Technovations - Step-by-Step Guide

This guide will help you set up and run the EdtoDo Technovations tender platform application. The application consists of a React frontend and a Node.js backend.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v14+) installed
- npm (Node Package Manager) installed
- Git installed (optional, for version control)

## Setup and Installation

### 1. Clone the Repository (if using Git)

```bash
git clone https://github.com/yourusername/edtodo-tenders.git
cd edtodo-tenders
```

### 2. Install Dependencies

Install all required dependencies for both frontend and backend:

```bash
npm install
```

This will install:
- Frontend: React, TypeScript, Tailwind CSS, Framer Motion, Axios, Socket.io client
- Backend: Express, MongoDB drivers, JWT, Socket.io, and other utilities

### 3. Environment Setup

Make sure your `.env` file is properly configured:

```
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# MongoDB Connection (optional)
MONGODB_URI=mongodb://localhost:27017/tender-platform

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration (optional)
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# File Upload
MAX_FILE_UPLOAD=10
FILE_UPLOAD_PATH=./public/uploads

# Supabase (for frontend, optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: The application can run with mock data, so MongoDB and Email configurations are optional.

## Running the Application

### Option 1: Using the Development Script

The simplest way to run both frontend and backend concurrently:

1. Make the development script executable:
   ```bash
   chmod +x run-dev.sh
   ```

2. Run the script:
   ```bash
   ./run-dev.sh
   ```

This will start:
- Frontend server at http://localhost:5173
- Backend server at http://localhost:3000

### Option 2: Running Servers Separately

#### Backend Server

1. Start the backend server:
   ```bash
   npm run server
   ```
   This will start the Node.js server with nodemon for automatic reloading.

#### Frontend Server

2. In a separate terminal, start the frontend development server:
   ```bash
   npm run client
   ```
   This will start the Vite development server.

## Testing the Application

Once both servers are running, you can:

1. Open your browser and navigate to http://localhost:5173
2. The application should load with the home page
3. You can register a new account or use the mock login:
   - Email: user@example.com
   - Password: password123

## API Endpoints

The backend server provides various API endpoints:

- **Authentication**: `/api/auth/`
  - Register: POST `/api/auth/register`
  - Login: POST `/api/auth/login`
  - Logout: GET `/api/auth/logout`

- **Tenders**: `/api/tenders/`
  - Get all tenders: GET `/api/tenders/`
  - Get tender by ID: GET `/api/tenders/:id`
  - Search tenders: GET `/api/tenders/search?query=keyword`

- **Bids**: `/api/bids/`
  - Get user bids: GET `/api/bids/`
  - Create bid: POST `/api/bids/`
  - Get bid by ID: GET `/api/bids/:id`

- **Articles**: `/api/articles/`
  - Get all articles: GET `/api/articles/`
  - Get article by slug: GET `/api/articles/slug/:slug`

You can test these endpoints using tools like Postman or curl.

## File Structure

Understanding the file structure:

- `server/`: Backend code
  - `controllers/`: API logic
  - `routes/`: API routes
  - `middleware/`: Express middleware
  - `models/`: Database schemas
  - `services/`: Mock services and business logic
  - `utils/`: Utility functions

- `src/`: Frontend code
  - `components/`: React UI components
  - `hooks/`: Custom React hooks
  - `services/`: API services
  - `store/`: State management
  - `types/`: TypeScript type definitions

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the port in .env file
   - Kill the process using the port: `npx kill-port 3000`

2. **Node modules issues**:
   - Delete node_modules folder and package-lock.json
   - Run `npm install` again

3. **MongoDB connection failures**:
   - The application will use mock data if MongoDB is not available
   - Check if MongoDB is running locally if you want to use a real database

4. **CORS issues**:
   - Make sure CLIENT_URL in .env matches your frontend URL

## Next Steps

After successfully running the application, you can:

1. Explore the various features
2. Modify components and controllers
3. Add new features
4. Connect to a real MongoDB database for persistent storage
5. Implement real email functionality

## Support

For questions or issues, please contact:
- Email: info@edtodo.tech 