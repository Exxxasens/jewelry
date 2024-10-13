# Stage 1: Build the app
FROM node:18 AS builder
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npx prisma generate
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app ./
EXPOSE 3000

# Use JSON array format for CMD
CMD ["npm", "run", "start"]