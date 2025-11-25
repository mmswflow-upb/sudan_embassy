FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS="./credentials/firebase-sa-key.json"
ENV FIREBASE_BUCKET="gs://sudan-embassy.firebasestorage.app"
ENV UPLOAD_DIR="./uploads"

# Start the application
CMD ["node", "index.js"]
