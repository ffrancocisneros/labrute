#!/bin/bash

# LaBrute Installation Script
# This script installs dependencies for both backend and frontend

echo "========================================="
echo "  LaBrute Installation"
echo "========================================="

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ is required"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Node.js version: $(node -v)"
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "Error generating Prisma client"
    exit 1
fi

cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "========================================="
echo "  Installation Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with your database URL"
echo "2. Run 'npm run dev' in backend/ to start the API"
echo "3. Run 'npm run dev' in frontend/ to start the React app"
echo ""
echo "Or use Docker: docker-compose up -d"

