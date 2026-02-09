#!/bin/bash

# Native execution script for the frontend
cd "$(dirname "$0")"

echo "Starting React Frontend on port 5173..."
bun run dev