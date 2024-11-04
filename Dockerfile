# Use Node.js image to build the React app
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory in the container
WORKDIR /app

# Copy package.json and pnpm lock file, then install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all source files and build the React app
COPY . .
RUN pnpm run build-storybook

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx's default directory
COPY --from=builder /app/storybook-static /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80


# Start Nginx
CMD ["nginx", "-g", "daemon off;"]