#!/bin/bash

# render-build.sh - Build script for Render deployment

echo "Starting Render deployment build process..."

# Create necessary directories
mkdir -p dist/client

# Step 1: Build the client (frontend)
echo "Building frontend assets..."
npm run build:client

# Step 2: Prepare static files
echo "Copying static files..."
cp -r client/dist/* dist/client/

# Step 3: Prepare the server
echo "Preparing server files..."
mkdir -p dist/server
cp -r server/* dist/server/

# Step 4: Copy the main index.js
echo "Copying main entry point..."
cp index.js dist/

echo "Build process complete!"