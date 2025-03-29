FROM node:18

# Install essential tools
RUN apt-get update && apt-get -y install git

# Create app directory
WORKDIR /workspace

# Set environment variables
ENV NODE_ENV=development

# Install global npm packages
RUN npm install -g typescript webpack webpack-cli
