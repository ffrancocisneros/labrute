#!/bin/bash
# Post-deployment script for Railway/Render
# This script runs after the application is deployed

echo "Running post-deployment tasks..."

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ] || [ -n "$DB_HOST" ]; then
    echo "Running database migrations..."
    php database/migrate.php
    if [ $? -eq 0 ]; then
        echo "✓ Database migrations completed"
    else
        echo "⚠ Database migrations failed (this is OK if tables already exist)"
    fi
else
    echo "⚠ No database configuration found, skipping migrations"
fi

echo "Post-deployment tasks completed!"

