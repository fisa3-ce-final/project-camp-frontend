# Stage 1: Install dependencies and build the application
FROM node:20-alpine AS builder

# Set ARG for backend URL at build time
ARG BACKEND_URL
ARG FRONTEND_URL
ARG NEXTAUTH_URL
ARG COGNITO_LOGOUT_URL
ARG NEXTAUTH_SECRET
ARG COGNITO_DOMAIN
ARG COGNITO_ISSUER
ARG COGNITO_CLIENT_SECRET
ARG COGNITO_CLIENT_ID

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

# Set the environment variable for build time
ENV BACKEND_URL=$BACKEND_URL
ENV FRONTEND_URL=$FRONTEND_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV COGNITO_LOGOUT_URL=$COGNITO_LOGOUT_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV COGNITO_DOMAIN=$COGNITO_DOMAIN
ENV COGNITO_ISSUER=$COGNITO_ISSUER
ENV COGNITO_CLIENT_SECRET=$COGNITO_CLIENT_SECRET
ENV COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID

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
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expose the desired port (default Next.js port is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]
