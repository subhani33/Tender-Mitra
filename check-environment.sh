#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  EdtoDo Technovations - Environment Check        ${NC}"
echo -e "${GREEN}==================================================${NC}"

# Check Node.js and npm
echo -e "${BLUE}Checking Node.js and npm...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js is installed: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js v14 or higher${NC}"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm is installed: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}✗ npm is not installed${NC}"
    echo -e "${YELLOW}Please install npm v7 or higher${NC}"
fi

# Check for required packages
echo -e "\n${BLUE}Checking for required global packages...${NC}"
PACKAGES_MISSING=0

if command -v concurrently &> /dev/null; then
    echo -e "${GREEN}✓ concurrently is installed${NC}"
else
    echo -e "${RED}✗ concurrently is not installed${NC}"
    echo -e "${YELLOW}Run: npm install -g concurrently${NC}"
    PACKAGES_MISSING=1
fi

if command -v nodemon &> /dev/null; then
    echo -e "${GREEN}✓ nodemon is installed${NC}"
else
    echo -e "${RED}✗ nodemon is not installed${NC}"
    echo -e "${YELLOW}Run: npm install -g nodemon${NC}"
    PACKAGES_MISSING=1
fi

# Check for .env file
echo -e "\n${BLUE}Checking for environment configuration...${NC}"
if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
else
    echo -e "${RED}✗ .env file is missing${NC}"
    echo -e "${YELLOW}Run: cp .env.example .env${NC}"
fi

# Check for required directories
echo -e "\n${BLUE}Checking for required directories...${NC}"
DIRECTORIES_MISSING=0

if [ -d "server/public/uploads" ]; then
    echo -e "${GREEN}✓ Upload directory exists${NC}"
else
    echo -e "${RED}✗ Upload directory is missing${NC}"
    echo -e "${YELLOW}Run: mkdir -p server/public/uploads${NC}"
    DIRECTORIES_MISSING=1
fi

if [ -d "logs" ]; then
    echo -e "${GREEN}✓ Logs directory exists${NC}"
else
    echo -e "${RED}✗ Logs directory is missing${NC}"
    echo -e "${YELLOW}Run: mkdir -p logs${NC}"
    DIRECTORIES_MISSING=1
fi

# Check for executable scripts
echo -e "\n${BLUE}Checking for executable scripts...${NC}"
if [ -x "run-dev.sh" ]; then
    echo -e "${GREEN}✓ run-dev.sh is executable${NC}"
else
    echo -e "${RED}✗ run-dev.sh is not executable${NC}"
    echo -e "${YELLOW}Run: chmod +x run-dev.sh${NC}"
fi

if [ -x "setup.sh" ]; then
    echo -e "${GREEN}✓ setup.sh is executable${NC}"
else
    echo -e "${RED}✗ setup.sh is not executable${NC}"
    echo -e "${YELLOW}Run: chmod +x setup.sh${NC}"
fi

# Summary
echo -e "\n${GREEN}==================================================${NC}"
if [ $PACKAGES_MISSING -eq 0 ] && [ $DIRECTORIES_MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ Environment check passed!${NC}"
    echo -e "${GREEN}Ready to start development.${NC}"
    echo -e "${BLUE}Run: ./run-dev.sh${NC}"
else
    echo -e "${YELLOW}⚠ Some issues were found.${NC}"
    echo -e "${YELLOW}Please fix the issues above before continuing.${NC}"
    echo -e "${BLUE}Or run: ./setup.sh${NC}"
fi
echo -e "${GREEN}==================================================${NC}" 