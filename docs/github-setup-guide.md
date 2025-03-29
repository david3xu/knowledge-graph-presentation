# GitHub Setup Guide for Knowledge Graph Presentation

This guide provides step-by-step commands to set up a GitHub repository for your TypeScript-based Knowledge Graph presentation project. Each section includes necessary commands with explanations.

## Repository Initialization

Start by creating and configuring your local Git repository:

```bash
# Navigate to your project directory
cd knowledge-graph-presentation

# Initialize a new Git repository
git init

# Create a comprehensive .gitignore file for TypeScript/Node.js projects
cat > .gitignore << EOL
# Dependencies
/node_modules
/.pnp
.pnp.js

# Build outputs
/dist
/build

# Development
/.vscode/*
!/.vscode/extensions.json
!/.vscode/settings.json
.env.local
.env.development.local

# Testing
/coverage

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS specific
.DS_Store
Thumbs.db
EOL
```

## Project Structure Setup

Create the directory structure that will house your TypeScript components:

```bash
# Create the directory structure for source files
mkdir -p src/{slides,visualizations,utils,types}

# Create the directory structure for public assets
mkdir -p public/{assets/{images,fonts,data},styles}

# Create the directory for dev container configuration
mkdir -p .devcontainer

# Initialize the npm project with default values
npm init -y

# Add TypeScript and required type definitions
npm install --save-dev typescript ts-node @types/node

# Generate a TypeScript configuration file
npx tsc --init --target es2020 --module esnext --strict true --esModuleInterop true --outDir ./dist
```

## Development Container Configuration

Set up a consistent development environment using VS Code's Dev Containers:

```bash
# Create the Dev Container configuration file
cat > .devcontainer/devcontainer.json << EOL
{
  "name": "kg-presentation-dev",
  "dockerFile": "Dockerfile",
  "settings": {
    "terminal.integrated.defaultProfile.linux": "bash"
  },
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-tslint-plugin"
  ],
  "forwardPorts": [8080],
  "postCreateCommand": "npm install",
  "remoteUser": "node"
}
EOL

# Create the Dockerfile for the development container
cat > .devcontainer/Dockerfile << EOL
FROM node:18

# Install essential tools
RUN apt-get update && apt-get -y install git

# Create app directory
WORKDIR /workspace

# Set environment variables
ENV NODE_ENV=development

# Install global npm packages
RUN npm install -g typescript webpack webpack-cli
EOL
```

## Initial Commit

Commit your project structure to the local repository:

```bash
# Stage all created files
git add .

# Create the initial commit
git commit -m "Initial project structure and dev container setup"
```

## GitHub Repository Creation

Create and connect to a new GitHub repository:

### Option 1: Using GitHub CLI

```bash
# Login to GitHub CLI (first-time setup)
gh auth login

# Create a new private repository with the current directory as the source
gh repo create knowledge-graph-presentation --private --source=. --remote=origin
```

### Option 2: Using GitHub Web Interface

If you prefer creating the repository through the web interface:

1. Visit https://github.com/new
2. Enter "knowledge-graph-presentation" as the repository name
3. Select visibility (private or public)
4. Click "Create repository"
5. Run the following commands to connect your local repository:

```bash
git remote add origin https://github.com/yourusername/knowledge-graph-presentation.git
```

## Push Code to GitHub

Push your initial commit to the GitHub repository:

```bash
# Push to GitHub and set the upstream branch
git push -u origin main
```

## Branch Protection (Optional)

Set up branch protection rules to maintain code quality:

```bash
# Configure branch protection for the main branch
# Requires at least one review before merging
gh api repos/yourusername/knowledge-graph-presentation/branches/main/protection \
  --method PUT \
  --field required_status_checks=null \
  --field enforce_admins=false \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field restrictions=null
```

## GitHub Actions Setup (Optional)

Configure continuous integration with GitHub Actions:

```bash
# Create the workflows directory
mkdir -p .github/workflows

# Create a basic CI workflow file
cat > .github/workflows/ci.yml << EOL
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test --if-present
EOL

# Commit and push the workflow configuration
git add .github/workflows/ci.yml
git commit -m "Add GitHub Actions CI workflow"
git push
```

## Project Dependencies

Install the core dependencies required for the Knowledge Graph presentation:

```bash
# Install frontend libraries
npm install --save reveal.js d3 cytoscape highlight.js

# Install development dependencies
npm install --save-dev webpack webpack-cli ts-loader css-loader style-loader html-webpack-plugin @types/d3 @types/cytoscape @types/reveal.js jest ts-jest

# Create webpack configuration
cat > webpack.config.js << EOL
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
  },
};
EOL

# Update package.json scripts
npm pkg set scripts.dev="webpack serve --mode development"
npm pkg set scripts.build="webpack --mode production"
npm pkg set scripts.test="jest"

# Commit and push dependencies
git add package.json package-lock.json webpack.config.js
git commit -m "Add core dependencies and webpack configuration"
git push
```

## Creating Initial Source Files

Create the minimum required files to start the project:

```bash
# Create HTML template
cat > public/index.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knowledge Graph Presentation</title>
</head>
<body>
  <div class="reveal">
    <div class="slides"></div>
  </div>
</body>
</html>
EOL

# Create main TypeScript entry point
cat > src/index.ts << EOL
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Reveal.js
  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide'
  });
  
  deck.initialize();
});
EOL

# Commit and push initial source files
git add public/index.html src/index.ts
git commit -m "Add initial HTML template and TypeScript entry point"
git push
```

## Final Steps

After completing these steps, your project is ready for development:

1. If using VS Code with Dev Containers, open the project folder and select "Reopen in Container"
2. Run `npm run dev` to start the development server
3. Open `http://localhost:8080` in your browser to see the presentation

You can now begin implementing the knowledge graph visualization components as outlined in the TypeScript implementation guide.
