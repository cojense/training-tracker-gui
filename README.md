# Training Tracker GUI

A modern TypeScript/React frontend for the Training Tracker application.

## Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js

## Getting Started

### Local Development
1. Install dependencies:
   ```bash
   bun install
   ```
2. Create a `.env` file with necessary variables (see `.env.example`).
3. Start the development server:
   ```bash
   ./run.bash
   ```

### Docker
To build and run the frontend in a container:
```bash
docker build -t training-tracker-gui .
docker run -p 8080:80 training-tracker-gui
```
