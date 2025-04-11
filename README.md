# Tender-Mitra

A comprehensive platform for government tender management, bid assistance, analytics, and learning resources.

## Site Building Process

This Tender-Mitra platform was built using modern web development technologies and practices:

1. **Setup & Architecture**: Created a React+TypeScript project using Vite for fast development and optimized builds.
2. **UI Framework**: Implemented Tailwind CSS for responsive, utility-first styling with a custom gold/navy theme.
3. **Component Structure**: Developed modular React components for reusability and maintainability.
4. **3D Visualizations**: Added interactive 3D tender visualizations using Three.js and React Three Fiber.
5. **Authentication**: Implemented secure JWT-based user authentication system.
6. **Error Handling**: Added robust error boundaries and fallbacks throughout the application.
7. **Responsive Design**: Ensured the application works seamlessly across all device sizes.
8. **Performance Optimization**: Used React's best practices for efficient rendering and code splitting.

The entire development process followed a component-first approach with continuous integration and testing to ensure high quality and performance.

## Features

- **Tender Portal**: Browse and search government tenders from various departments and categories
- **Bid Management**: Create, manage, and track bid submissions
- **Analytics Dashboard**: Visual representation of tender data and bid performance
- **Knowledge Base**: Articles and resources for tender processes
- **Task Management**: Organize and track tender-related tasks
- **Learning Hub**: Educational resources for bid preparation

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Axios for API requests
  - Socket.io-client for real-time features

- **Backend**:
  - Node.js with Express
  - MongoDB for database (optional, can run with mock data)
  - JWT for authentication
  - Socket.io for real-time updates
  - Winston for logging
  - Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm (v7+)
- MongoDB (optional)

### Quick Setup

1. Run the setup script:
```bash
./setup.sh
```

This script will:
- Make development scripts executable
- Create necessary directories
- Install dependencies
- Set up environment variables

2. Start the application:
```bash
./run-dev.sh
```

### Manual Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/edtodo-technovations.git
cd edtodo-technovations
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example .env file
cp .env.example .env
```

4. Create required directories
```bash
mkdir -p server/public/uploads
mkdir -p logs
```

5. Make scripts executable
```bash
chmod +x run-dev.sh
chmod +x setup.sh
chmod +x check-environment.sh
```

### Running the Application

#### Development Mode

Run both frontend and backend servers concurrently:
```bash
./run-dev.sh
```

Or run them separately:

```bash
# Backend server
npm run server

# Frontend server
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

#### Environment Check

To verify your environment is correctly set up:
```bash
./check-environment.sh
```

### Mock Mode

The application can run without a MongoDB connection by using mock data services. This is the default when no MongoDB URI is provided.

### MongoDB Setup

The application can run in two modes:
1. **With MongoDB**: Full database functionality with persistent storage
2. **With Mock Data**: Using in-memory mock data (default if MongoDB connection fails)

To set up MongoDB, use the provided setup script:
```bash
./setup-mongodb.sh
```

This script will:
- Check if MongoDB is already installed
- Provide installation instructions for your operating system
- Show options for using MongoDB Atlas (cloud) if preferred
- Guide you through updating your connection string

#### MongoDB Options:

1. **Local MongoDB Installation**:
   - macOS: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
   - Ubuntu/Debian: Follow the instructions in the setup script
   - Other: See [MongoDB installation documentation](https://docs.mongodb.com/manual/installation/)

2. **MongoDB Atlas (Cloud)**:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Set up a cluster and get your connection string
   - Update your `.env` file with the connection string

#### Troubleshooting Connection Issues

If you see "MongoDB connection error: ECONNREFUSED", this means either:
- MongoDB is not running on your machine
- The connection string in your `.env` file is incorrect

The application will automatically fall back to using mock data, allowing you to continue development.

## Documentation

- **QUICKSTART.md**: Fast setup guide
- **GUIDE.md**: Detailed instructions and API documentation
- **PROJECT_SUMMARY.md**: Overview of all components
- **WELCOME.txt**: Features and quick reference
- **CODEBASE.md**: Detailed documentation of code structure, component usage, and development guidelines

## Project Structure

```
/
├── server/                # Backend code
│   ├── controllers/       # API logic
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── app.js             # Express app setup
│   └── server.js          # Entry point
│
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript definitions
│   ├── App.tsx            # Main React component
│   └── main.tsx           # Entry point
│
├── public/                # Static assets
├── dist/                  # Build output
└── .env                   # Environment variables
```

## Development

### Adding New Features

1. Backend: Add routes, controllers, and services as needed
2. Frontend: Create new components and update the UI
3. Test your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact:
- Email: info@edtodo.tech

# Authentication and User Management

We've added full user authentication and registration functionality to the Tender Mitra platform:

## Authentication Features

- **User Registration**: Users can create new accounts with email, password, and username.
- **User Login**: Secure login with JWT token-based authentication.
- **Password Security**: Passwords are hashed using bcrypt with salt rounds for maximum security.
- **JWT Authentication**: JSON Web Tokens for secure, stateless authentication.
- **Token Management**: Automatic token refresh and secure storage.
- **Protected Routes**: Routes that require authentication are protected on both frontend and backend.

## Implementation Details

- **Frontend**: React components for Login and Registration
- **Backend**: Express.js routes for authentication with JWT
- **Database**: MongoDB for user storage (with fallback to mock data)
- **Security**: CSRF protection, rate limiting, and secure HTTP-only cookies

## Getting Started with Authentication

1. Register at `/register` with your email, username, and a strong password
2. Log in at `/login` with your credentials
3. Access protected features like bid submission and tender management

For development, you can use these test credentials:
- Email: user@example.com
- Password: password123
