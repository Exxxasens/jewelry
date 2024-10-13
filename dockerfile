# Use the official Node.js image as the base image
FROM node:18 AS base

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]