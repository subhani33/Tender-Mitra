#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Starting EdtoDo Technovations Development Servers  ${NC}"
echo -e "${GREEN}==================================================${NC}"

echo "Backend API: http://localhost:3000"
echo "Frontend UI: http://localhost:4173"

# Store the current directory
CURRENT_DIR=$(pwd)

# Start backend server
echo -e "${BLUE}Starting backend server...${NC}"
npm run server &
SERVER_PID=$!

# Wait for backend to start
sleep 2

# Check if backend is running
if ! curl -s http://localhost:3000/health &>/dev/null; then
  echo -e "${RED}Warning: Backend server may not be running correctly${NC}"
  echo -e "${YELLOW}Will continue with frontend startup anyway${NC}"
fi

echo -e "${YELLOW}Backend server running at http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend will start at http://localhost:4173${NC}"

# Start Vite frontend server
echo -e "${BLUE}Starting frontend server...${NC}"
npm run client

# Handle cleanup on exit
trap "kill $SERVER_PID 2>/dev/null || true" EXIT 