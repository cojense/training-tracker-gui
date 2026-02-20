#!/bin/bash

# Execution script for the frontend
cd "$(dirname "$0")"

# Load environment variables from .env if it exists
if [ -f .env ]; then
  # Only export lines that are not comments and contain an '='
  export $(grep -v '^#' .env | xargs)
fi

if [[ "$*" == *"--native"* ]]; then
    echo "Starting Native React Frontend on port 5173..."
    
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

    # Run the application
    exec bun run dev
else
    echo "Starting Dockerized React Frontend..."
    exec docker-compose up --build
fi
