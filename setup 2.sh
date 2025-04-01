#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  EdtoDo Technovations - Project Setup Script     ${NC}"
echo -e "${GREEN}==================================================${NC}"

# Make sure run-dev.sh is executable
echo -e "${BLUE}Making run-dev.sh executable...${NC}"
chmod +x run-dev.sh

# Create necessary directories
echo -e "${BLUE}Creating necessary directories...${NC}"
mkdir -p server/public/uploads
mkdir -p logs

# Check for environment file
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating default .env file...${NC}"
  cp .env.example .env 2>/dev/null || echo -e "${YELLOW}No .env.example found, please create a .env file manually.${NC}"
fi

# Install dependencies
echo -e "${BLUE}Installing project dependencies...${NC}"
npm install

# Check if global packages are installed
echo -e "${BLUE}Checking for required global packages...${NC}"
if ! command -v concurrently &> /dev/null; then
  echo -e "${YELLOW}Installing concurrently globally...${NC}"
  npm install -g concurrently
fi

if ! command -v nodemon &> /dev/null; then
  echo -e "${YELLOW}Installing nodemon globally...${NC}"
  npm install -g nodemon
fi

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Setup complete!                                ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "${BLUE}To start the development servers, run:${NC}"
echo -e "${YELLOW}  ./run-dev.sh${NC}"
echo -e "${BLUE}Or use npm:${NC}"
echo -e "${YELLOW}  npm run dev${NC}" 