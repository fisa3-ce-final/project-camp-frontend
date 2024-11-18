# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# COPY package*.json ./

# Install dependencies
# RUN npm install --frozen-lockfile
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production 

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expose the desired port (default Next.js port is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
