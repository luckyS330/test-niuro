#!/bin/bash

# Script to start all services for the take-home test
# Make sure you have all dependencies installed first:
# - Backend: cd backend-dotnet && dotnet restore
# - Frontends: cd frontend-* && npm install

echo "Starting all services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}Port $1 is already in use${NC}"
        return 1
    fi
    return 0
}

# Check ports
echo "Checking ports..."
check_port 5000 || exit 1
check_port 3000 || exit 1
check_port 4200 || exit 1
check_port 4201 || exit 1

echo -e "${GREEN}All ports are available${NC}"
echo ""

# Start backend
echo -e "${BLUE}Starting .NET Backend (Port 5000)...${NC}"
cd backend-dotnet
dotnet run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 3

# Start Next.js
echo -e "${BLUE}Starting Next.js App (Port 3000)...${NC}"
cd frontend-nextjs
npm run dev > ../nextjs.log 2>&1 &
NEXTJS_PID=$!
cd ..
sleep 3

# Start Angular1
echo -e "${BLUE}Starting Angular User App (Port 4200)...${NC}"
cd frontend-angular1
npm start > ../angular1.log 2>&1 &
ANGULAR1_PID=$!
cd ..
sleep 3

# Start Angular2
echo -e "${BLUE}Starting Angular Admin App (Port 4201)...${NC}"
cd frontend-angular2
npm start > ../angular2.log 2>&1 &
ANGULAR2_PID=$!
cd ..
sleep 3

echo ""
echo -e "${GREEN}All services started!${NC}"
echo ""
echo "Services:"
echo "  - Backend:    http://localhost:5000 (PID: $BACKEND_PID)"
echo "  - Next.js:    http://localhost:3000 (PID: $NEXTJS_PID)"
echo "  - Angular1:   http://localhost:4200 (PID: $ANGULAR1_PID)"
echo "  - Angular2:   http://localhost:4201 (PID: $ANGULAR2_PID)"
echo ""
echo "Logs are being written to:"
echo "  - backend.log"
echo "  - nextjs.log"
echo "  - angular1.log"
echo "  - angular2.log"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo "Or manually kill the PIDs listed above"

# Save PIDs to file for stop script
echo "$BACKEND_PID $NEXTJS_PID $ANGULAR1_PID $ANGULAR2_PID" > .pids

