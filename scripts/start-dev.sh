#!/bin/bash

# LaBrute Development Server Startup Script

echo "Starting LaBrute in development mode..."

# Check if we're using docker
if command -v docker &> /dev/null && [ -f "docker-compose.yml" ]; then
    echo "Docker detected. Starting with docker-compose..."
    docker-compose up -d
    echo ""
    echo "Services started:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:3001"
    echo "  - Database: localhost:5432"
    echo ""
    echo "Use 'docker-compose logs -f' to view logs"
    echo "Use 'docker-compose down' to stop"
else
    echo "Docker not found or no docker-compose.yml"
    echo "Please start services manually:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd backend && npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd frontend && npm run dev"
fi

