# Build Stage
FROM oven/bun:1 AS build-stage
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

# Production Stage
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Default nginx port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
