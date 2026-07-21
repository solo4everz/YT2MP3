# ========================================================
# YT2MP3 Studio - Production Dockerfile for VPS Deployment
# Base Image: Alpine Linux with Node.js 20, ffmpeg & yt-dlp
# ========================================================

FROM node:20-alpine

# Install FFmpeg, Python3, and yt-dlp dependencies
RUN apk add --no-gc-compat --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    curl \
    ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build Next.js app
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start production server
CMD ["npm", "run", "start"]
