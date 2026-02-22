# Stage 1: Build Stage
FROM oven/bun:1 AS build-stage
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# Set environment variables for build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN bun run build

# Stage 2: Development Stage
FROM oven/bun:1 AS development
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
# Match vite.config.ts and docker-compose
EXPOSE 8080
CMD ["bun", "run", "dev"]

# Stage 3: Production Stage (Nginx)
FROM nginx:stable-alpine AS production
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
