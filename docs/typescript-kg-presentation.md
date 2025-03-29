# Knowledge Graph Presentation: TypeScript Implementation Guide

## Overview

This document outlines the implementation of an HTML-based presentation system for knowledge graphs using TypeScript. The solution provides interactive visualizations of graph structures, data model comparisons, and process flows based on the provided knowledge graph content.

## Project Structure

```
knowledge-graph-presentation/
├── .devcontainer/              # Development container configuration
│   ├── devcontainer.json       # Container configuration
│   └── Dockerfile              # Container image definition
├── src/
│   ├── index.ts                # Application entry point
│   ├── slides/                 # TypeScript modules for slide content
│   │   ├── intro.ts            # What is a Knowledge Graph?
│   │   ├── core-components.ts  # KG structure and building blocks
│   │   ├── data-models.ts      # KG data models and comparisons
│   │   ├── examples.ts         # Major KG implementations
│   │   ├── construction.ts     # How KGs are built
│   │   ├── applications.ts     # Common applications
│   │   ├── technologies.ts     # KG technology stack
│   │   ├── query-languages.ts  # Query examples
│   │   ├── rca.ts              # Root cause analysis focus
│   │   ├── getting-started.ts  # Implementation roadmap
│   │   └── future.ts           # Future directions
│   ├── visualizations/
│   │   ├── graph.ts            # Knowledge graph visualization
│   │   ├── timeline.ts         # Timeline renderer
│   │   ├── table.ts            # Comparison table component
│   │   ├── flow-diagram.ts     # Process flow diagrams
│   │   └── types/              # TypeScript type definitions
│   │       ├── graph-data.ts   # Node/edge interfaces
│   │       ├── slide-data.ts   # Slide configuration interfaces
│   │       └── chart-config.ts # Visualization config interfaces
│   └── utils/
│       ├── animation.ts        # Transition utilities
│       ├── responsive.ts       # Responsive layout handlers
│       └── ascii-to-svg.ts     # ASCII diagram converter
├── public/
│   ├── index.html              # HTML entry point
│   ├── assets/
│   │   ├── images/             # Static graphics
│   │   ├── fonts/              # Typography assets
│   │   └── data/               # Source data for visualizations
│   └── styles/
│       ├── main.css            # Core presentation styles
│       └── theme.css           # Visual theming
├── dist/                       # Compiled output (generated)
├── package.json                # Project configuration
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Build configuration
└── README.md                   # Project documentation
```

## Development Environment Setup

### Dev Container Configuration

The project includes a development container configuration for consistent development environments:

```json
// .devcontainer/devcontainer.json
{
  "name": "kg-presentation-dev",
  "dockerFile": "Dockerfile",
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash"
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
```

```dockerfile
# .devcontainer/Dockerfile
FROM node:18

# Install essential tools
RUN apt-get update && apt-get -y install git

# Create app directory
WORKDIR /workspace

# Set environment variables
ENV NODE_ENV=development

# Install global npm packages
RUN npm install -g typescript webpack webpack-cli
```

## Core Technologies

| Technology | Purpose |
|------------|---------|
| TypeScript | Type-safe implementation language |
| Reveal.js | Presentation framework |
| D3.js | Data visualization library |
| Cytoscape.js | Graph visualization for knowledge graphs |
| Webpack | Module bundling |
| ESLint | Code quality |
| Jest | Unit testing |

## Key Dependencies

```json
// package.json (partial)
{
  "dependencies": {
    "reveal.js": "^4.4.0",
    "d3": "^7.8.0",
    "cytoscape": "^3.23.0",
    "highlight.js": "^11.7.0"
  },
  "devDependencies": {
    "typescript": "^4.9.5",
    "webpack": "^5.75.0",
    "ts-loader": "^9.4.2",
    "css-loader": "^6.7.3",
    "html-webpack-plugin": "^5.5.0",
    "jest": "^29.4.1",
    "ts-jest": "^29.0.5",
    "@types/d3": "^7.4.0",
    "@types/cytoscape": "^3.19.9",
    "@types/reveal.js": "^4.4.0"
  },
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest"
  }
}
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "sourceMap": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "lib": ["DOM", "ESNext"],
    "jsx": "react"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

## Key Implementation Components

### 1. Slide Management

The presentation uses a modular approach where each section of your content is implemented as a separate TypeScript module:

```typescript
// src/slides/intro.ts
import { SlideConfig } from '../types/slide-data';

export const introSlides: SlideConfig[] = [
  {
    id: 'kg-definition',
    title: 'What is a Knowledge Graph?',
    content: {
      definition: 'A structured representation of knowledge as a network of entities and relationships',
      keyPoints: [
        'Focus on connections and context rather than isolated data points',
        'Evolution from semantic networks to modern knowledge graphs'
      ]
    },
    visualizationType: 'none'
  },
  {
    id: 'kg-evolution',
    title: 'Knowledge Graph Evolution',
    content: null,
    visualizationType: 'timeline',
    visualizationConfig: {
      data: [
        { period: '1960s-1980s', label: 'Early Knowledge Representation', items: ['Semantic Networks', 'Frames, Scripts', 'Expert Systems'] },
        { period: '1990s-2012', label: 'Semantic Web & First KGs', items: ['RDF, OWL, Linked Data', 'Google KG Launch (2012)'] },
        { period: '2013-Present', label: 'Modern Knowledge Graph Era', items: ['Enterprise Implementation', 'AI Integration & Applications'] }
      ]
    }
  }
];
```

### 2. Graph Visualization

The graph visualization component renders knowledge graph structures from data definitions:

```typescript
// src/visualizations/graph.ts
import cytoscape from 'cytoscape';
import { GraphData } from './types/graph-data';

export interface GraphVisualizationOptions {
  container: HTMLElement;
  data: GraphData;
  height: number;
  width: number;
  nodeColor?: string;
  edgeColor?: string;
}

export class GraphVisualization {
  private cy: cytoscape.Core;
  
  constructor(options: GraphVisualizationOptions) {
    this.cy = cytoscape({
      container: options.container,
      elements: this.transformData(options.data),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': options.nodeColor || '#6FB1FC',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': options.edgeColor || '#ccc',
            'target-arrow-color': options.edgeColor || '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)'
          }
        }
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        padding: 30
      }
    });
  }

  private transformData(data: GraphData): cytoscape.ElementDefinition[] {
    const elements: cytoscape.ElementDefinition[] = [];
    
    // Add nodes
    data.nodes.forEach(node => {
      elements.push({
        data: {
          id: node.id,
          label: node.label || node.id,
          type: node.type
        }
      });
    });
    
    // Add edges
    data.edges.forEach(edge => {
      elements.push({
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: edge.label
        }
      });
    });
    
    return elements;
  }
  
  public render(): void {
    this.cy.resize();
    this.cy.fit();
  }
}
```

### 3. ASCII to SVG Converter

This utility converts ASCII diagrams from your content into SVG visualizations:

```typescript
// src/utils/ascii-to-svg.ts
export interface AsciiToSvgOptions {
  text: string;
  boxWidth: number;
  boxHeight: number;
  lineColor: string;
  textColor: string;
  boxColor: string;
}

export class AsciiToSvg {
  private text: string;
  private boxWidth: number;
  private boxHeight: number;
  private lineColor: string;
  private textColor: string;
  private boxColor: string;
  
  constructor(options: AsciiToSvgOptions) {
    this.text = options.text;
    this.boxWidth = options.boxWidth || 100;
    this.boxHeight = options.boxHeight || 40;
    this.lineColor = options.lineColor || '#333';
    this.textColor = options.textColor || '#000';
    this.boxColor = options.boxColor || '#f5f5f5';
  }
  
  public convert(): SVGElement {
    // Implementation of ASCII to SVG conversion logic
    // This would parse characters like '+', '-', '|', etc. to create
    // corresponding SVG elements representing boxes, lines, and text
    
    // Simplified example - in practice this would be much more comprehensive
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const lines = this.text.split('\n');
    const width = Math.max(...lines.map(l => l.length)) * 10;
    const height = lines.length * 20;
    
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Parsing logic would go here
    // ...
    
    return svg;
  }
}
```

### 4. Main Application Entry Point

The main application initializes the presentation framework and loads slides:

```typescript
// src/index.ts
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

// Import slide configurations
import { introSlides } from './slides/intro';
import { coreComponentsSlides } from './slides/core-components';
// Import other slide modules

// Import visualization components
import { GraphVisualization } from './visualizations/graph';
import { TimelineVisualization } from './visualizations/timeline';
import { TableVisualization } from './visualizations/table';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Reveal.js
  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide'
  });
  
  // Generate slides from configuration
  const slidesContainer = document.querySelector('.slides');
  const allSlides = [
    ...introSlides,
    ...coreComponentsSlides,
    // Include other slide sets
  ];
  
  // Create DOM elements for each slide
  allSlides.forEach(slideConfig => {
    const slideElement = document.createElement('section');
    slideElement.id = slideConfig.id;
    
    // Add title
    const titleElement = document.createElement('h2');
    titleElement.textContent = slideConfig.title;
    slideElement.appendChild(titleElement);
    
    // Add content based on slide configuration
    if (slideConfig.content) {
      // Add text content
      // ...
    }
    
    // Add visualization if specified
    if (slideConfig.visualizationType) {
      const visualizationContainer = document.createElement('div');
      visualizationContainer.className = 'visualization-container';
      slideElement.appendChild(visualizationContainer);
      
      // Initialize visualization based on type
      deck.on('slidechanged', event => {
        if (event.currentSlide.id === slideConfig.id) {
          renderVisualization(
            slideConfig.visualizationType,
            visualizationContainer,
            slideConfig.visualizationConfig
          );
        }
      });
    }
    
    slidesContainer.appendChild(slideElement);
  });
  
  // Initialize the presentation
  deck.initialize();
});

function renderVisualization(type: string, container: HTMLElement, config: any): void {
  // Clear the container
  container.innerHTML = '';
  
  switch (type) {
    case 'graph':
      const graph = new GraphVisualization({
        container,
        data: config.data,
        height: 500,
        width: 800
      });
      graph.render();
      break;
    case 'timeline':
      const timeline = new TimelineVisualization({
        container,
        data: config.data,
        height: 400,
        width: 800
      });
      timeline.render();
      break;
    case 'table':
      const table = new TableVisualization({
        container,
        data: config.data
      });
      table.render();
      break;
    // Handle other visualization types
  }
}
```

## Conversion of ASCII Diagrams

The presentation automatically converts ASCII diagrams from your content into SVG visualizations. For example, the knowledge graph structure from your content:

```
     [Company:TechCorp]
        /          \
       /            \
[Person:JaneDoe]    [Product:Widget]
      |                   |
      |                   |
[Role:Engineer]    [Category:Hardware]
```

Would be converted to an interactive graph visualization using this data structure:

```typescript
// Definition in src/slides/core-components.ts
const kgStructureData = {
  nodes: [
    { id: 'company', label: 'Company:TechCorp', type: 'Company' },
    { id: 'person', label: 'Person:JaneDoe', type: 'Person' },
    { id: 'product', label: 'Product:Widget', type: 'Product' },
    { id: 'role', label: 'Role:Engineer', type: 'Role' },
    { id: 'category', label: 'Category:Hardware', type: 'Category' }
  ],
  edges: [
    { source: 'company', target: 'person', label: 'EMPLOYS' },
    { source: 'company', target: 'product', label: 'PRODUCES' },
    { source: 'person', target: 'role', label: 'HAS_ROLE' },
    { source: 'product', target: 'category', label: 'BELONGS_TO' }
  ]
};
```

## Build Process

The project uses Webpack for module bundling and build optimization:

```javascript
// webpack.config.js
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
```

## Getting Started

1. Clone the repository
2. Open in VS Code with Dev Containers extension installed
3. Open command palette and select "Remote-Containers: Reopen in Container"
4. Once the container is built and initialized:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Additional Resources

- [Reveal.js Documentation](https://revealjs.com/): For presentation framework features
- [D3.js Documentation](https://d3js.org/): For visualization customization
- [Cytoscape.js Documentation](https://js.cytoscape.org/): For graph visualization options
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html): For TypeScript language features

## Conclusion

This TypeScript-based presentation solution provides a structured, interactive way to present knowledge graph concepts. It leverages modern web technologies to create engaging visualizations while maintaining type safety and development best practices through the dev container setup.

The modular design allows for easy extension and customization of slides and visualizations, making it adaptable to different presentation needs within the knowledge graph domain.
