#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}        MongoDB Setup Script for EdTodo App              ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo

# Function to detect OS
detect_os() {
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "linux"
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macos"
  elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "windows"
  else
    echo "unknown"
  fi
}

OS=$(detect_os)
echo -e "${YELLOW}Detected operating system: ${OS}${NC}"
echo

# Check if MongoDB is already installed
check_mongodb_installed() {
  if command -v mongod &> /dev/null; then
    local version=$(mongod --version | grep -oP 'db version v\K[0-9\.]+')
    echo -e "${GREEN}MongoDB is already installed (version $version)${NC}"
    return 0
  else
    echo -e "${YELLOW}MongoDB is not installed on this system${NC}"
    return 1
  fi
}

# Function to install MongoDB based on OS
install_mongodb() {
  echo -e "${BLUE}Installing MongoDB...${NC}"
  
  case $OS in
    linux)
      echo -e "${YELLOW}Installing MongoDB on Linux...${NC}"
      echo -e "This script supports Ubuntu/Debian and RHEL/CentOS/Fedora"
      
      if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        echo -e "${BLUE}Detected Debian/Ubuntu system${NC}"
        echo -e "${YELLOW}Running: sudo apt-get update${NC}"
        sudo apt-get update
        
        echo -e "${YELLOW}Installing MongoDB packages...${NC}"
        sudo apt-get install -y gnupg
        wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
        
        # Determine Ubuntu version
        if [ -f /etc/lsb-release ]; then
          # Ubuntu
          ubuntu_version=$(grep -oP 'DISTRIB_RELEASE=\K[\d\.]+' /etc/lsb-release)
          echo -e "${BLUE}Ubuntu version: $ubuntu_version${NC}"
          
          echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        else
          # Debian
          echo "deb http://repo.mongodb.org/apt/debian $(lsb_release -cs)/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        fi
        
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        
        echo -e "${YELLOW}Starting MongoDB service...${NC}"
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
      elif [ -f /etc/redhat-release ]; then
        # RHEL/CentOS/Fedora
        echo -e "${BLUE}Detected RHEL/CentOS/Fedora system${NC}"
        
        echo -e "${YELLOW}Creating MongoDB repository file...${NC}"
        cat <<EOF | sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
        
        echo -e "${YELLOW}Installing MongoDB packages...${NC}"
        sudo yum install -y mongodb-org
        
        echo -e "${YELLOW}Starting MongoDB service...${NC}"
        sudo systemctl start mongod
        sudo systemctl enable mongod
      else
        echo -e "${RED}Unsupported Linux distribution. Please install MongoDB manually.${NC}"
        echo -e "Visit: https://docs.mongodb.com/manual/administration/install-on-linux/"
        return 1
      fi
      ;;
      
    macos)
      echo -e "${YELLOW}Installing MongoDB on macOS using Homebrew...${NC}"
      
      # Check if Homebrew is installed
      if ! command -v brew &> /dev/null; then
        echo -e "${YELLOW}Homebrew not found. Installing Homebrew...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      fi
      
      # Install MongoDB
      echo -e "${YELLOW}Running: brew tap mongodb/brew${NC}"
      brew tap mongodb/brew
      
      echo -e "${YELLOW}Running: brew install mongodb-community${NC}"
      brew install mongodb-community
      
      echo -e "${YELLOW}Starting MongoDB service...${NC}"
      brew services start mongodb-community
      ;;
      
    windows)
      echo -e "${RED}Automatic installation on Windows is not supported.${NC}"
      echo -e "Please download and install MongoDB from:"
      echo -e "https://www.mongodb.com/try/download/community"
      echo
      echo -e "After installing:"
      echo -e "1. Make sure the MongoDB service is running"
      echo -e "2. Add MongoDB bin directory to your PATH"
      return 1
      ;;
      
    *)
      echo -e "${RED}Unsupported operating system. Please install MongoDB manually.${NC}"
      echo -e "Visit: https://docs.mongodb.com/manual/installation/"
      return 1
      ;;
  esac
  
  return 0
}

# Function to check if MongoDB is running
check_mongodb_running() {
  echo -e "${YELLOW}Checking if MongoDB is running...${NC}"
  
  case $OS in
    linux)
      if systemctl is-active --quiet mongod; then
        echo -e "${GREEN}MongoDB service is running${NC}"
        return 0
      else
        echo -e "${RED}MongoDB service is not running${NC}"
        return 1
      fi
      ;;
      
    macos)
      if pgrep -x mongod > /dev/null; then
        echo -e "${GREEN}MongoDB service is running${NC}"
        return 0
      else
        echo -e "${RED}MongoDB service is not running${NC}"
        return 1
      fi
      ;;
      
    windows)
      if tasklist | grep mongod > /dev/null; then
        echo -e "${GREEN}MongoDB service is running${NC}"
        return 0
      else
        echo -e "${RED}MongoDB service may not be running${NC}"
        return 1
      fi
      ;;
      
    *)
      echo -e "${RED}Cannot check MongoDB status on this OS${NC}"
      return 1
      ;;
  esac
}

# Function to start MongoDB if not running
start_mongodb() {
  echo -e "${YELLOW}Starting MongoDB service...${NC}"
  
  case $OS in
    linux)
      sudo systemctl start mongod
      sudo systemctl enable mongod
      ;;
      
    macos)
      brew services start mongodb-community
      ;;
      
    windows)
      echo -e "${YELLOW}Please start MongoDB service manually:${NC}"
      echo -e "1. Open Services (services.msc)"
      echo -e "2. Find 'MongoDB Server' and start it"
      ;;
      
    *)
      echo -e "${RED}Cannot start MongoDB on this OS${NC}"
      return 1
      ;;
  esac
  
  # Verify it started
  sleep 2
  check_mongodb_running
  return $?
}

# Function to create a MongoDB database and user for the app
setup_mongodb_database() {
  echo -e "${BLUE}Setting up MongoDB database for EdTodo app...${NC}"
  
  local DB_NAME="edtodo_technovations"
  local DB_USER="edtodo_user"
  local DB_PASS="password123"  # In real setup, this should be randomly generated
  
  # Create MongoDB database and user
  mongo --eval "
    db = db.getSiblingDB('$DB_NAME');
    db.createUser({
      user: '$DB_USER',
      pwd: '$DB_PASS',
      roles: [{ role: 'readWrite', db: '$DB_NAME' }]
    });
    db.createCollection('init');
    db.init.insertOne({ setup: 'complete', timestamp: new Date() });
    print('Database setup completed successfully');
  " || {
    echo -e "${RED}Failed to create database. Trying with mongosh...${NC}"
    
    # Try with mongosh (newer MongoDB versions use mongosh instead of mongo)
    if command -v mongosh &> /dev/null; then
      mongosh --eval "
        db = db.getSiblingDB('$DB_NAME');
        db.createUser({
          user: '$DB_USER',
          pwd: '$DB_PASS',
          roles: [{ role: 'readWrite', db: '$DB_NAME' }]
        });
        db.createCollection('init');
        db.init.insertOne({ setup: 'complete', timestamp: new Date() });
        print('Database setup completed successfully');
      " || {
        echo -e "${RED}Failed to create database and user.${NC}"
        return 1
      }
    else
      echo -e "${RED}Neither mongo nor mongosh commands are available.${NC}"
      return 1
    fi
  }
  
  # Create/update .env file with MongoDB URI
  update_env_file "$DB_NAME" "$DB_USER" "$DB_PASS"
  
  return 0
}

# Function to update .env file with MongoDB URI
update_env_file() {
  local DB_NAME="$1"
  local DB_USER="$2"
  local DB_PASS="$3"
  local ENV_FILE="../../.env"
  
  echo -e "${YELLOW}Updating .env file with MongoDB connection details...${NC}"
  
  # Check if .env file exists
  if [ -f "$ENV_FILE" ]; then
    # Update existing MONGODB_URI
    if grep -q "MONGODB_URI=" "$ENV_FILE"; then
      sed -i.bak "s|MONGODB_URI=.*|MONGODB_URI=mongodb://$DB_USER:$DB_PASS@localhost:27017/$DB_NAME|g" "$ENV_FILE" || {
        # For macOS compatibility
        sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=mongodb://$DB_USER:$DB_PASS@localhost:27017/$DB_NAME|g" "$ENV_FILE"
      }
    else
      # Add MONGODB_URI if not exists
      echo "MONGODB_URI=mongodb://$DB_USER:$DB_PASS@localhost:27017/$DB_NAME" >> "$ENV_FILE"
    fi
  else
    # Create new .env file
    echo "# MongoDB Connection" > "$ENV_FILE"
    echo "MONGODB_URI=mongodb://$DB_USER:$DB_PASS@localhost:27017/$DB_NAME" >> "$ENV_FILE"
    echo "" >> "$ENV_FILE"
  fi
  
  echo -e "${GREEN}Updated .env file with MongoDB connection string${NC}"
  echo -e "${BLUE}MongoDB URI: ${YELLOW}mongodb://$DB_USER:$DB_PASS@localhost:27017/$DB_NAME${NC}"
  
  return 0
}

# Main function
main() {
  # Step 1: Check if MongoDB is installed
  if ! check_mongodb_installed; then
    echo -e "${YELLOW}MongoDB is not installed. Would you like to install it? (y/n)${NC}"
    read -r install_choice
    
    if [[ "$install_choice" =~ ^[Yy]$ ]]; then
      install_mongodb || {
        echo -e "${RED}Failed to install MongoDB.${NC}"
        exit 1
      }
    else
      echo -e "${YELLOW}Skipping MongoDB installation.${NC}"
      echo -e "${RED}Note: The application requires MongoDB to function properly.${NC}"
      exit 0
    fi
  fi
  
  # Step 2: Check if MongoDB is running
  if ! check_mongodb_running; then
    echo -e "${YELLOW}MongoDB is not running. Starting it now...${NC}"
    start_mongodb || {
      echo -e "${RED}Failed to start MongoDB.${NC}"
      echo -e "${YELLOW}Please start MongoDB manually and run this script again.${NC}"
      exit 1
    }
  fi
  
  # Step 3: Setup MongoDB database
  echo -e "${YELLOW}Do you want to set up the MongoDB database for EdTodo? (y/n)${NC}"
  read -r setup_choice
  
  if [[ "$setup_choice" =~ ^[Yy]$ ]]; then
    setup_mongodb_database || {
      echo -e "${RED}Failed to set up MongoDB database.${NC}"
      exit 1
    }
  else
    echo -e "${YELLOW}Skipping database setup.${NC}"
  fi
  
  # Success message
  echo -e "${GREEN}=====================================================${NC}"
  echo -e "${GREEN}MongoDB setup completed successfully!${NC}"
  echo -e "${GREEN}=====================================================${NC}"
  echo
  echo -e "${YELLOW}You can now run the EdTodo application.${NC}"
  echo -e "${YELLOW}If you encounter any issues, please check the logs or run this script again.${NC}"
  
  exit 0
}

# Run the main function
main 