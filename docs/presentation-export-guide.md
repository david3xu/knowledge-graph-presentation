# Knowledge Graph Presentation: Export & Deployment Options

This technical guide outlines multiple approaches for exporting and deploying your TypeScript-based Knowledge Graph presentation after development is complete. Each method includes implementation steps, code examples, and technical considerations to help you select the most appropriate option.

## 1. Production Build for Web Server Deployment

The standard method using Webpack's production build creates optimized assets for deployment to any web server.

### Implementation

```bash
# Generate production build
npm run build
```

### Technical Details

This command executes the Webpack configuration with optimizations enabled:

- **Tree Shaking**: Eliminates unused code
- **Minification**: Reduces file sizes through code compression
- **Asset Optimization**: Processes images and other assets
- **Code Splitting**: Separates vendor dependencies

The build process creates the following structure in the `/dist` directory:

```
dist/
├── bundle.js         # Main JavaScript bundle (minified)
├── assets/           # Optimized assets (images, fonts)
├── index.html        # Entry point HTML file
└── [chunk-files].js  # Additional code-split chunks
```

### Deployment Steps

1. Copy the entire `/dist` directory to your web server's root or subdirectory
2. Configure your server to handle Single Page Application routing (if applicable)
3. Ensure proper MIME types are configured, especially for `.js` and `.woff2` files

### Example NGINX Configuration

```nginx
server {
    listen 80;
    server_name kg-presentation.example.com;
    root /var/www/kg-presentation/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proper caching headers for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

## 2. PDF Export

For static, non-interactive documentation or printing, export to PDF format.

### Implementation

#### Method 1: Using reveal.js-pdf-export Plugin

```bash
# Install the PDF export plugin
npm install reveal.js-pdf-export --save-dev
```

Add the plugin to your TypeScript code:

```typescript
// src/index.ts
import Reveal from 'reveal.js';
import PdfExport from 'reveal.js-pdf-export';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

document.addEventListener('DOMContentLoaded', () => {
  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide',
    // Register the PDF export plugin
    plugins: [ PdfExport ]
  });
  
  deck.initialize();
});
```

#### Method 2: Using Decktape (CLI Tool)

```bash
# Install decktape globally
npm install -g decktape

# Generate PDF from your deployed presentation
decktape reveal http://localhost:8080 knowledge-graph-presentation.pdf --size 1920x1080
```

### Technical Considerations

- **Vector Graphics**: SVG-based visualizations in your knowledge graphs will maintain quality in PDF
- **Print Stylesheets**: Add specific print media queries to optimize PDF output:

```css
@media print {
  .visualization-container {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  /* Hide navigation controls in print version */
  .reveal .controls, 
  .reveal .progress {
    display: none !important;
  }
}
```

- **Font Embedding**: Ensure fonts are properly embedded to maintain consistency:

```javascript
// webpack.config.js addition for font handling
module.exports = {
  // Other config...
  module: {
    rules: [
      // Other rules...
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  }
};
```

## 3. GitHub Pages Deployment

Automate deployment to GitHub Pages for free, public-facing hosting with version control.

### Implementation

Create a GitHub Actions workflow file:

```bash
mkdir -p .github/workflows
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
          clean: true
```

### Repository Configuration

1. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Set Source to "Deploy from a branch"
   - Select "gh-pages" branch and "/" (root) folder
   - Click Save

2. Add a `base` path if your repository is not deployed at the root:

```javascript
// webpack.config.js modification
module.exports = {
  // Other config...
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // Add this for GitHub Pages deployment
    publicPath: '/knowledge-graph-presentation/'
  }
};
```

### Technical Considerations

- **Custom Domain**: You can set up a custom domain in GitHub Pages settings
- **Environment Variables**: Use environment variables to handle different base paths in development vs. production:

```javascript
// webpack.config.js with environment handling
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    // Other config...
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: isProduction 
        ? '/knowledge-graph-presentation/' 
        : '/'
    }
  };
};
```

## 4. Self-Contained HTML File

Create a standalone HTML file with all assets embedded, ideal for offline presentations.

### Implementation

```bash
# Install the inliner tool
npm install -g inliner

# Build the project
npm run build

# Generate the self-contained HTML file
inliner dist/index.html > knowledge-graph-presentation.html
```

### Technical Details

The inliner tool:
1. Resolves all CSS file references and embeds styles inline
2. Converts JavaScript file references to inline scripts
3. Embeds images, fonts, and other assets as base64-encoded data URLs
4. Produces a single, completely self-contained HTML file

### Optimization for Knowledge Graph Visualizations

Large graph visualizations can significantly increase file size. Consider implementing lazy loading:

```typescript
// src/visualizations/graph.ts
export class GraphVisualization {
  private cy: cytoscape.Core | null = null;
  private container: HTMLElement;
  private data: GraphData;
  private options: GraphVisualizationOptions;
  
  constructor(options: GraphVisualizationOptions) {
    this.container = options.container;
    this.data = options.data;
    this.options = options;
  }
  
  // Lazy initialization - only create when visible
  public initialize(): void {
    if (this.cy) return;
    
    this.cy = cytoscape({
      container: this.container,
      elements: this.transformData(this.data),
      style: [
        // Style definitions
      ],
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        padding: 30
      }
    });
  }
  
  // Call this when the slide becomes visible
  public render(): void {
    this.initialize();
    this.cy?.resize();
    this.cy?.fit();
  }
}
```

Add an observer to initialize visualizations only when needed:

```typescript
// Add to your slide rendering logic
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const slideId = entry.target.id;
      const slideConfig = allSlides.find(s => s.id === slideId);
      
      if (slideConfig?.visualization) {
        slideConfig.visualization.render();
      }
      
      // Unobserve after rendering
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe each slide
document.querySelectorAll('.slides section').forEach(slide => {
  observer.observe(slide);
});
```

## 5. Docker Containerization

Package your presentation in a Docker container for consistent deployment across environments.

### Implementation

Create a Dockerfile in your project root:

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create an NGINX configuration file:

```
# nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Build and run the Docker container:

```bash
# Build the Docker image
docker build -t kg-presentation .

# Run the container
docker run -p 8080:80 kg-presentation
```

### Deployment Options with Docker

1. **Docker Hub**:
```bash
# Tag and push to Docker Hub
docker tag kg-presentation username/kg-presentation:latest
docker push username/kg-presentation:latest
```

2. **GitHub Container Registry**:
```bash
# Tag and push to GitHub Container Registry
docker tag kg-presentation ghcr.io/username/kg-presentation:latest
docker push ghcr.io/username/kg-presentation:latest
```

## 6. Progressive Web App (PWA)

Convert your presentation into a PWA for offline access and installation capabilities.

### Implementation

1. Install required dependencies:

```bash
npm install --save-dev workbox-webpack-plugin
```

2. Update your webpack configuration:

```javascript
// webpack.config.js
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  // Other webpack config...
  plugins: [
    // Other plugins...
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    }),
  ],
};
```

3. Create a manifest file:

```bash
cat > public/manifest.json << EOL
{
  "name": "Knowledge Graph Presentation",
  "short_name": "KG Presentation",
  "description": "Interactive Knowledge Graph Presentation",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4285f4",
  "icons": [
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOL
```

4. Register the service worker in your entry file:

```typescript
// src/index.ts
// Add this to the end of your file
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}
```

## Technical Comparison of Export Options

| Export Method | Interactive? | Offline Support | Size | Deployment Complexity | Best For |
|---------------|--------------|-----------------|------|----------------------|----------|
| Production Build | ✅ | ❌ | Medium | Low | Standard web hosting |
| PDF Export | ❌ | ✅ | Small-Medium | None | Documentation, printing |
| GitHub Pages | ✅ | ❌ | Medium | Very Low | Public sharing, versioning |
| Self-Contained HTML | ✅ | ✅ | Large | None | Email sharing, offline |
| Docker | ✅ | ❌ | Large | Medium | Consistent environments |
| PWA | ✅ | ✅ | Medium | Medium | Mobile access, offline |

## Knowledge Graph Visualization Considerations

When exporting your presentation, consider these technical aspects specific to knowledge graph visualizations:

### 1. Performance Optimization

For complex graph visualizations:

```typescript
// Example optimization for large graphs
export function optimizeGraphForExport(graph: GraphData): GraphData {
  // If more than 100 nodes, simplify the graph
  if (graph.nodes.length > 100) {
    // Group nodes by type
    const groupedNodes = {};
    graph.nodes.forEach(node => {
      if (!groupedNodes[node.type]) {
        groupedNodes[node.type] = [];
      }
      groupedNodes[node.type].push(node);
    });
    
    // For types with many nodes, collapse into representative nodes
    const simplifiedNodes = [];
    const nodesToRemove = new Set<string>();
    
    Object.entries(groupedNodes).forEach(([type, nodes]: [string, any[]]) => {
      if (nodes.length > 10) {
        // Create one representative node
        simplifiedNodes.push({
          id: `${type}_group`,
          label: `${type} (${nodes.length})`,
          type: type,
          isGroup: true
        });
        
        // Mark original nodes for removal
        nodes.forEach(node => nodesToRemove.add(node.id));
      }
    });
    
    // Filter out removed nodes and add simplified ones
    const finalNodes = [
      ...graph.nodes.filter(node => !nodesToRemove.has(node.id)),
      ...simplifiedNodes
    ];
    
    // Update edges to connect to group nodes
    const finalEdges = graph.edges.map(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);
      
      let newSource = edge.source;
      let newTarget = edge.target;
      
      if (sourceNode && nodesToRemove.has(sourceNode.id)) {
        newSource = `${sourceNode.type}_group`;
      }
      
      if (targetNode && nodesToRemove.has(targetNode.id)) {
        newTarget = `${targetNode.type}_group`;
      }
      
      return {
        ...edge,
        source: newSource,
        target: newTarget
      };
    });
    
    return {
      nodes: finalNodes,
      edges: finalEdges
    };
  }
  
  return graph;
}
```

### 2. Responsive Design for Different Export Formats

```css
/* Add to your CSS for better adaptability across formats */
@media screen and (max-width: 1024px) {
  .graph-visualization {
    height: 400px;
  }
}

@media screen and (max-width: 768px) {
  .graph-visualization {
    height: 300px;
  }
  
  /* Simplify graph appearance on smaller screens */
  .graph-node-label {
    font-size: 10px;
  }
}

@media print {
  .graph-visualization {
    height: 500px;
    page-break-inside: avoid;
  }
}
```

### 3. Fallback Rendering for Non-Interactive Formats

For PDF and other static exports, consider implementing a static rendering fallback:

```typescript
class GraphVisualization {
  // Add a method to generate static SVG
  public generateStaticSVG(): SVGElement {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "800");
    svg.setAttribute("height", "600");
    
    // Set viewBox for responsiveness
    svg.setAttribute("viewBox", "0 0 800 600");
    
    // Add static representation of nodes and edges
    this.data.nodes.forEach(node => {
      // Position calculation would typically come from your layout algorithm
      // This is a simplified example
      const x = Math.random() * 700 + 50;
      const y = Math.random() * 500 + 50;
      
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "20");
      circle.setAttribute("fill", "#6FB1FC");
      
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x.toString());
      text.setAttribute("y", y.toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dy", "5");
      text.setAttribute("font-size", "12");
      text.textContent = node.label || node.id;
      
      svg.appendChild(circle);
      svg.appendChild(text);
    });
    
    // Similar code for edges would go here
    
    return svg;
  }
  
  // Use this method when exporting to static formats
  public renderStatic(): void {
    const svg = this.generateStaticSVG();
    this.container.innerHTML = '';
    this.container.appendChild(svg);
  }
}
```

## Conclusion

When selecting an export method for your Knowledge Graph presentation, consider the specific requirements of your use case:

1. **For interactive presentations** where the audience needs to explore graph relationships, use the Production Build, GitHub Pages, or PWA options.

2. **For offline usage**, choose the Self-Contained HTML file or PWA approach.

3. **For formal documentation**, the PDF export provides a consistent, printable format.

4. **For deployment consistency**, use the Docker containerization approach.

The Knowledge Graph's interactive nature is best preserved in HTML-based formats that maintain JavaScript execution. Consider implementing responsive designs and performance optimizations to ensure your visualizations work well across different export formats and device sizes.
