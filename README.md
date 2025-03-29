# Knowledge Graph Presentation

A TypeScript-based interactive presentation focused on Knowledge Graphs, featuring responsive visualizations of graph structures, data model comparisons, and process flows.

## Overview

This project provides an HTML-based interactive presentation system that renders knowledge graph concepts using interactive visualizations. It leverages TypeScript for type safety and modern web technologies to create an engaging educational experience.

## Key Features

- Interactive graph visualizations using Cytoscape.js
- Timeline visualizations for knowledge graph evolution
- Comparative view of data models and database technologies
- Process flow diagrams for implementation roadmaps
- Responsive design for presentations on various devices

## Technology Stack

- **TypeScript** - Type-safe implementation language
- **Reveal.js** - Presentation framework
- **D3.js** - Data visualization library
- **Cytoscape.js** - Graph visualization for knowledge graphs
- **Webpack** - Module bundling and build system

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- VS Code with Dev Containers extension (recommended)

### Setup with Dev Container

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/knowledge-graph-presentation.git
   cd knowledge-graph-presentation
   ```

2. Open in VS Code and reopen in container:
   - Open the project in VS Code
   - Press F1, type "Remote-Containers: Reopen in Container" and select it

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:8080`

### Standard Setup (without Dev Container)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
knowledge-graph-presentation/
├── src/                         # Source code
│   ├── slides/                  # Slide content modules
│   ├── visualizations/          # Visualization components
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
├── docs/                        # Documentation files
├── .devcontainer/               # Development container config
├── dist/                        # Build output (generated)
└── README.md                    # This file
```

## Development Workflow

1. Define slide content in the appropriate modules under `src/slides/`
2. Create or update visualizations in `src/visualizations/`
3. Run the development server with `npm run dev`
4. View changes in real-time at `http://localhost:8080`

## Building and Deployment

To create a production build:

```bash
npm run build
```

For detailed deployment options, see the [Export & Deployment Guide](./docs/presentation-export-guide.md).

## Documentation

Detailed documentation is available in the `docs` directory:

- [TypeScript Implementation Guide](./docs/typescript-kg-presentation.md) - Technical architecture and implementation details
- [GitHub Setup Guide](./docs/github-setup-guide.md) - Repository setup and GitHub integration
- [Export & Deployment Options](./docs/presentation-export-guide.md) - Publishing and sharing options

## Visualization Components

The project includes specialized visualization components for knowledge graphs:

- **GraphVisualization** - Renders knowledge graph node-edge structures
- **TimelineVisualization** - Displays evolutionary timelines
- **TableVisualization** - Creates interactive comparison tables
- **FlowDiagramVisualization** - Illustrates process flows

Each component is designed to be reusable and configurable through TypeScript interfaces.

## Customization

To customize the presentation for your specific knowledge graph content:

1. Update slide configurations in `src/slides/` modules
2. Modify visualization data in `public/assets/data/`
3. Adjust styles in `public/styles/theme.css`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
