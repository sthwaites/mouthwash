# Stage 1: Base (Shared dependencies)
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development
FROM base AS development
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 3: Build for Production
FROM base AS build
COPY . .
RUN npm run build

# Stage 4: Production Serve (Nginx)
FROM nginx:alpine AS production
# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy and set up the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
