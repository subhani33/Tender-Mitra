#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Deploying EdtoDo Technovations to Render        ${NC}"
echo -e "${GREEN}==================================================${NC}"

echo -e "${BLUE}Checking for render-cli...${NC}"
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}Render CLI not found, installing...${NC}"
    curl -s https://render.com/download-cli.sh | bash
fi

echo -e "${BLUE}Building application for production...${NC}"
npm run build

echo -e "${BLUE}Deploying to Render via Blueprint...${NC}"
render blueprint launch

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  Deployment initiated!                           ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "${YELLOW}Note: It may take a few minutes for the deployment to complete.${NC}"
echo -e "${YELLOW}Check the Render dashboard for status updates.${NC}" 