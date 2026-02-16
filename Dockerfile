# Development Stage
FROM oven/bun:1 AS development
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
EXPOSE 5173
CMD ["bun", "run", "start"]

# Build Stage
FROM oven/bun:1 AS build-stage
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

# Set environment variables for build
ARG VITE_API_BASE_URL
ARG VITE_OAUTH_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_OAUTH_CLIENT_ID=$VITE_OAUTH_CLIENT_ID

RUN bun run build

# Production Stage
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Default nginx port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
