#!/bin/bash

# Execution script for the frontend
cd "$(dirname "$0")"

# Load environment variables from .env if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env..."
  # Only export lines that are not comments and contain an '='
  export $(grep -v '^#' .env | xargs)
fi

# Native execution (no container)
if [[ "$*" == *"--native"* ]]; then
    echo "Starting Native React Frontend on port 8080..."
    
    # Check if bun is installed
    if ! command -v bun >/dev/null 2>&1; then
        echo "ERROR: 'bun' not found. Please install Bun (https://bun.sh) or use Docker mode."
        exit 1
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies with bun..."
        bun install
    fi

    # Run the application (Vite uses port 8080 from vite.config.ts)
    exec bun run dev
fi

# Default: Docker Development mode (hot-reloading)
echo "Starting Dockerized Development React Frontend (Hot-reloading on port 8080)..."
exec docker-compose up --build --remove-orphans
