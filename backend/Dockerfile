FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build (if using TS)
RUN npm run build

# Expose backend port
EXPOSE 4000

# Start server
CMD ["npm", "start"]
