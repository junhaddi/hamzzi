# Use an official Node runtime (alpine variant) as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3100

# Define the command to run the application
CMD ["npm", "start"]
