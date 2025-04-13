# Use PHP base image
FROM php:8.2-cli

# Set working directory
WORKDIR /app

# Copy your app into the container
COPY . /app

# Install dependencies (optional, like mysqli, pdo)
RUN docker-php-ext-install mysqli

# Expose port 10000 (Render expects this)
EXPOSE 10000

# Start built-in PHP server
CMD ["php", "-S", "0.0.0.0:10000"]
