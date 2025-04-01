#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Starting EdtoDo Technovations Website  ${NC}"
echo -e "${GREEN}==================================================${NC}"

echo -e "${BLUE}Backend API: ${YELLOW}http://localhost:3000${NC}"
echo -e "${BLUE}Frontend UI: ${YELLOW}http://localhost:5173${NC}"

# Check if server directory exists
if [ ! -d "server" ]; then
  echo -e "${RED}Error: Server directory not found!${NC}"
  exit 1
fi

# Start backend server in background
echo -e "${BLUE}Starting backend server...${NC}"
cd server && node server.js &
SERVER_PID=$!

# Wait a moment
sleep 2

# Check if backend is running
if ! curl -s http://localhost:3000/health &>/dev/null; then
  echo -e "${YELLOW}Warning: Backend health check failed, trying dev-server instead...${NC}"
  # Kill the previous attempt
  kill $SERVER_PID 2>/dev/null || true
  # Try dev-server.js instead
  node dev-server.js &
  SERVER_PID=$!
  sleep 2
fi

# Navigate back to project root
cd ..

# Start frontend
echo -e "${BLUE}Starting frontend server...${NC}"
npx vite --port 5173 --host

# When the script is terminated with Ctrl+C, kill the backend server
trap "kill $SERVER_PID 2>/dev/null || true" EXIT 