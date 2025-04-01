#!/bin/bash

echo "======================================"
echo "MongoDB Setup for EdtoDo Tender Platform"
echo "======================================"
echo ""

# Check if MongoDB is already installed
if command -v mongod &> /dev/null; then
    echo "MongoDB is already installed on your system."
    
    # Check if MongoDB is running
    if pgrep mongod &> /dev/null; then
        echo "✅ MongoDB is currently running."
    else
        echo "❌ MongoDB is installed but not running."
        
        # Detect OS and provide appropriate start command
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "Start MongoDB with: brew services start mongodb-community"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "Start MongoDB with: sudo systemctl start mongod"
        else
            echo "Start MongoDB according to your OS instructions."
        fi
    fi
    
    echo ""
    echo "Your current MongoDB connection URI in .env file is:"
    grep MONGODB_URI .env || echo "MONGODB_URI not found in .env file"
    
    echo ""
    echo "To use a local MongoDB connection, ensure your .env contains:"
    echo "MONGODB_URI=mongodb://localhost:27017/edtodo_technovations"
    
    exit 0
fi

echo "MongoDB is not installed on your system."
echo ""
echo "You have two options:"
echo ""

echo "Option 1: Install MongoDB locally (requires admin privileges)"
echo "-----------------------------------------------------------"

# Detect operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macOS detected. Installation commands:"
    echo ""
    echo "# Install Homebrew if you don't have it"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    echo ""
    echo "# Install MongoDB Community Edition"
    echo "brew tap mongodb/brew"
    echo "brew install mongodb-community"
    echo ""
    echo "# Start MongoDB service"
    echo "brew services start mongodb-community"
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux detected. Installation commands (for Ubuntu/Debian):"
    echo ""
    echo "# Import MongoDB public GPG key"
    echo "wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -"
    echo ""
    echo "# Create list file for MongoDB"
    echo 'echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list'
    echo ""
    echo "# Reload local package database"
    echo "sudo apt-get update"
    echo ""
    echo "# Install MongoDB packages"
    echo "sudo apt-get install -y mongodb-org"
    echo ""
    echo "# Start MongoDB service"
    echo "sudo systemctl start mongod"
    echo "sudo systemctl enable mongod"
    
else
    echo "Please visit the official MongoDB documentation for installation instructions for your operating system:"
    echo "https://docs.mongodb.com/manual/installation/"
fi

echo ""
echo "Option 2: Use MongoDB Atlas (cloud-hosted, no installation required)"
echo "-----------------------------------------------------------------"
echo "1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account"
echo "2. Create a new cluster (the free tier is sufficient for development)"
echo "3. Set up database access with a username and password"
echo "4. Configure network access (either whitelist your IP or allow access from anywhere for development)"
echo "5. Get your connection string, which will look like:"
echo "   mongodb+srv://<username>:<password>@cluster0.mongodb.net/edtodo_technovations?retryWrites=true&w=majority"
echo "6. Update your .env file with this new connection string"

echo ""
echo "===== Recommended .env Configuration ====="
echo "For local MongoDB:"
echo "MONGODB_URI=mongodb://localhost:27017/edtodo_technovations"
echo ""
echo "For MongoDB Atlas:"
echo "MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/edtodo_technovations?retryWrites=true&w=majority"

echo ""
echo "After setup, restart your application with: npm run dev" 