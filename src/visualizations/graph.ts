/**
 * Knowledge Graph Visualization Component
 * Uses Cytoscape.js to render interactive graph visualizations
 */
import cytoscape from 'cytoscape';
import { GraphData, GraphNode, GraphEdge, GraphLayoutOptions } from '../types/graph-data';
import { GraphVisualizationOptions } from '../types/chart-config';

/**
 * Core visualization class for rendering knowledge graphs
 */
export class GraphVisualization {
  private cy: cytoscape.Core | null = null;
  private container: HTMLElement;
  private data: GraphData;
  private options: GraphVisualizationOptions;
  private highlightedNodes: Set<string> = new Set();
  private highlightedEdges: Set<string> = new Set();

  /**
   * Creates a new graph visualization instance
   * @param options Configuration options for the graph visualization
   */
  constructor(options: GraphVisualizationOptions) {
    this.container = options.container;
    this.data = options.data;
    this.options = this.applyDefaultOptions(options);
    
    // Set initial highlighted elements if provided
    if (options.highlightNodes) {
      options.highlightNodes.forEach(nodeId => this.highlightedNodes.add(nodeId));
    }
    
    if (options.highlightEdges) {
      options.highlightEdges.forEach(edgeId => this.highlightedEdges.add(edgeId));
    }
  }

  /**
   * Applies default options to user-provided options
   * @param options User options
   * @returns Merged options with defaults applied
   */
  private applyDefaultOptions(options: GraphVisualizationOptions): GraphVisualizationOptions {
    const defaults: Partial<GraphVisualizationOptions> = {
      width: this.container.clientWidth || 800,
      height: this.container.clientHeight || 600,
      responsive: true,
      nodeStyle: {
        color: '#6FB1FC',
        size: 30,
        shape: 'ellipse',
        borderColor: '#fff',
        borderWidth: 2,
        labelColor: '#000',
        fontSize: 12,
        opacity: 1
      },
      edgeStyle: {
        color: '#ccc',
        width: 2,
        style: 'solid',
        arrowShape: 'triangle',
        arrowSize: 8,
        labelColor: '#777',
        fontSize: 10,
        opacity: 0.8
      },
      physics: true,
      draggable: true,
      zoomable: true,
      initialZoom: 1,
      minZoom: 0.1,
      maxZoom: 10,
      nodeSpacing: 50,
      curvedEdges: true,
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        padding: 30,
        randomize: false
      }
    };

    return { ...defaults, ...options };
  }

  /**
   * Transforms graph data into Cytoscape elements
   * @param data Graph data containing nodes and edges
   * @returns Array of Cytoscape element definitions
   */
  private transformData(data: GraphData): cytoscape.ElementDefinition[] {
    const elements: cytoscape.ElementDefinition[] = [];
    
    // Add nodes
    data.nodes.forEach(node => {
      elements.push({
        data: {
          id: node.id,
          label: node.label || node.id,
          type: node.type,
          properties: node.properties || {},
          isHighlighted: this.highlightedNodes.has(node.id),
          isGroup: node.isGroup || false,
          children: node.children || []
        },
        position: node.position,
        classes: [
          `type-${node.type.toLowerCase().replace(/\s+/g, '-')}`,
          node.isGroup ? 'group-node' : '',
          this.highlightedNodes.has(node.id) ? 'highlighted' : ''
        ].filter(c => c)
      });
    });
    
    // Add edges
    data.edges.forEach(edge => {
      const edgeId = edge.id || `${edge.source}-${edge.target}`;
      elements.push({
        data: {
          id: edgeId,
          source: edge.source,
          target: edge.target,
          label: edge.label || '',
          directed: edge.directed !== false, // Default to true
          weight: edge.weight || 1,
          properties: edge.properties || {},
          isHighlighted: this.highlightedEdges.has(edgeId)
        },
        classes: [
          edge.label ? `type-${edge.label.toLowerCase().replace(/\s+/g, '-')}` : '',
          this.highlightedEdges.has(edgeId) ? 'highlighted' : ''
        ].filter(c => c)
      });
    });
    
    return elements;
  }

  /**
   * Generates Cytoscape style definitions based on configuration
   * @returns Array of Cytoscape style definitions
   */
  private generateStyles(): cytoscape.Stylesheet[] {
    const { nodeStyle, edgeStyle } = this.options;
    
    return [
      // Node base styles
      {
        selector: 'node',
        style: {
          'background-color': nodeStyle?.color,
          'shape': nodeStyle?.shape as any,
          'width': nodeStyle?.size,
          'height': nodeStyle?.size,
          'border-width': nodeStyle?.borderWidth,
          'border-color': nodeStyle?.borderColor,
          'label': 'data(label)',
          'color': nodeStyle?.labelColor,
          'font-size': nodeStyle?.fontSize,
          'text-valign': 'center',
          'text-halign': 'center',
          'text-wrap': 'wrap',
          'text-max-width': '100px',
          'opacity': nodeStyle?.opacity
        }
      },
      
      // Group node styles
      {
        selector: 'node.group-node',
        style: {
          'background-color': '#f5f5f5',
          'border-width': 3,
          'border-color': '#666',
          'border-style': 'dashed',
          'shape': 'roundrectangle',
          'width': 120,
          'height': 80,
          'opacity': 0.9
        }
      },
      
      // Edge base styles
      {
        selector: 'edge',
        style: {
          'width': edgeStyle?.width,
          'line-color': edgeStyle?.color,
          'target-arrow-color': edgeStyle?.color,
          'source-arrow-color': edgeStyle?.color,
          'target-arrow-shape': edgeStyle?.arrowShape as any,
          'arrow-scale': edgeStyle?.arrowSize,
          'curve-style': this.options.curvedEdges ? 'bezier' : 'straight',
          'line-style': edgeStyle?.style,
          'opacity': edgeStyle?.opacity,
          'label': 'data(label)',
          'font-size': edgeStyle?.fontSize,
          'color': edgeStyle?.labelColor,
          'text-rotation': 'autorotate',
          'text-margin-y': -10
        }
      },
      
      // Highlighted node styles
      {
        selector: 'node.highlighted',
        style: {
          'background-color': '#ff0',
          'border-width': 4,
          'border-color': '#f80',
          'opacity': 1,
          'z-index': 100
        }
      },
      
      // Highlighted edge styles
      {
        selector: 'edge.highlighted',
        style: {
          'width': 4,
          'line-color': '#f80',
          'target-arrow-color': '#f80',
          'opacity': 1,
          'z-index': 100
        }
      },
      
      // Type-specific styles would be added by extending this array
      // based on specific knowledge graph domain requirements
    ];
  }

  /**
   * Initializes the Cytoscape instance
   */
  public initialize(): void {
    if (this.cy) {
      return; // Already initialized
    }

    const elements = this.transformData(this.data);
    const layout = this.options.layout as GraphLayoutOptions;
    
    this.cy = cytoscape({
      container: this.container,
      elements: elements,
      style: this.generateStyles(),
      layout: layout,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      userZoomingEnabled: this.options.zoomable,
      userPanningEnabled: this.options.zoomable,
      boxSelectionEnabled: true,
      autounselectify: !this.options.draggable
    });

    // Set initial zoom
    if (this.options.initialZoom !== 1) {
      this.cy.zoom(this.options.initialZoom);
      this.cy.center();
    }

    // Add event listeners
    this.setupEventListeners();
    
    // Handle responsive behavior
    if (this.options.responsive) {
      this.setupResponsiveBehavior();
    }
  }

  /**
   * Sets up event listeners for graph interactions
   */
  private setupEventListeners(): void {
    if (!this.cy) return;
    
    // Click event handlers
    this.cy.on('tap', 'node', (event) => {
      const node = event.target;
      
      if (this.options.onClick) {
        // Transform Cytoscape data to our GraphNode format for the callback
        const nodeData: GraphNode = {
          id: node.id(),
          label: node.data('label'),
          type: node.data('type'),
          properties: node.data('properties'),
          isGroup: node.data('isGroup')
        };
        
        this.options.onClick({ event: event.originalEvent as MouseEvent, element: nodeData });
      }
    });
    
    this.cy.on('tap', 'edge', (event) => {
      const edge = event.target;
      
      if (this.options.onClick) {
        // Transform Cytoscape data to our GraphEdge format for the callback
        const edgeData: GraphEdge = {
          id: edge.id(),
          source: edge.data('source'),
          target: edge.data('target'),
          label: edge.data('label'),
          properties: edge.data('properties'),
          weight: edge.data('weight')
        };
        
        this.options.onClick({ event: event.originalEvent as MouseEvent, element: edgeData });
      }
    });
    
    // Hover events for tooltips if enabled
    if (this.options.tooltips) {
      this.cy.on('mouseover', 'node, edge', (event) => {
        const element = event.target;
        // Tooltip implementation would go here
        // This could use a library or custom tooltip solution
      });
      
      this.cy.on('mouseout', 'node, edge', () => {
        // Hide tooltip
      });
    }
  }

  /**
   * Sets up responsive behavior for the visualization
   */
  private setupResponsiveBehavior(): void {
    if (!this.cy) return;
    
    const resizeObserver = new ResizeObserver(() => {
      this.cy?.resize();
      this.cy?.fit();
    });
    
    resizeObserver.observe(this.container);
  }

  /**
   * Renders or updates the graph visualization
   */
  public render(): void {
    if (!this.cy) {
      this.initialize();
    } else {
      // Update existing graph if data or options have changed
      this.cy.elements().remove();
      this.cy.add(this.transformData(this.data));
      this.cy.style(this.generateStyles());
      
      // Apply layout
      if (this.options.layout) {
        const layout = this.cy.layout(this.options.layout as cytoscape.LayoutOptions);
        layout.run();
      }
    }
    
    // Fit to container unless initialization set a specific zoom
    if (!this.options.initialZoom) {
      this.cy?.resize();
      this.cy?.fit();
    }
  }

  /**
   * Highlights specific nodes in the graph
   * @param nodeIds Array of node IDs to highlight
   * @param reset Whether to clear previous highlights
   */
  public highlightNodes(nodeIds: string[], reset: boolean = true): void {
    if (!this.cy) return;
    
    if (reset) {
      this.cy.nodes().removeClass('highlighted');
      this.highlightedNodes.clear();
    }
    
    nodeIds.forEach(id => {
      const node = this.cy?.getElementById(id);
      if (node) {
        node.addClass('highlighted');
        this.highlightedNodes.add(id);
      }
    });
  }

  /**
   * Highlights specific edges in the graph
   * @param edgeIds Array of edge IDs to highlight
   * @param reset Whether to clear previous highlights
   */
  public highlightEdges(edgeIds: string[], reset: boolean = true): void {
    if (!this.cy) return;
    
    if (reset) {
      this.cy.edges().removeClass('highlighted');
      this.highlightedEdges.clear();
    }
    
    edgeIds.forEach(id => {
      const edge = this.cy?.getElementById(id);
      if (edge) {
        edge.addClass('highlighted');
        this.highlightedEdges.add(id);
      }
    });
  }

  /**
   * Filters the graph to show only elements matching certain criteria
   * @param filter Filter criteria
   */
  public filter(filter: {
    nodeTypes?: string[],
    edgeLabels?: string[],
    nodeProperties?: Record<string, any>,
    edgeProperties?: Record<string, any>
  }): void {
    if (!this.cy) return;
    
    // Show all elements first
    (this.cy.elements() as any).show();
    
    // Filter nodes by type if specified
    if (filter.nodeTypes && filter.nodeTypes.length > 0) {
      (this.cy.nodes().filter(node => {
        return !filter.nodeTypes?.includes(node.data('type'));
      }) as any).hide();
    }
    
    // Filter edges by label if specified
    if (filter.edgeLabels && filter.edgeLabels.length > 0) {
      (this.cy.edges().filter(edge => {
        return !filter.edgeLabels?.includes(edge.data('label'));
      }) as any).hide();
    }
    
    // More complex property filtering would be implemented here
  }

  /**
   * Centers the view on specific nodes
   * @param nodeIds Array of node IDs to center on
   */
  public centerOnNodes(nodeIds: string[]): void {
    if (!this.cy) return;
    
    const collection = this.cy.collection();
    nodeIds.forEach(id => {
      const element = this.cy?.getElementById(id);
      if (element) {
        collection.merge(element);
      }
    });
    
    if (collection.length > 0) {
      this.cy.fit(collection, 50);
    }
  }

  /**
   * Updates the graph data and rerenders
   * @param data New graph data
   */
  public updateData(data: GraphData): void {
    this.data = data;
    this.render();
  }

  /**
   * Updates visualization options and reapplies them
   * @param options New visualization options
   */
  public updateOptions(options: Partial<GraphVisualizationOptions>): void {
    this.options = { ...this.options, ...options };
    
    if (this.cy) {
      // Apply style updates
      this.cy.style(this.generateStyles());
      
      // Apply layout if specified
      if (options.layout) {
        const layout = this.cy.layout(options.layout as cytoscape.LayoutOptions);
        layout.run();
      }
      
      // Update other options
      this.cy.userZoomingEnabled(!!this.options.zoomable);
      this.cy.userPanningEnabled(!!this.options.zoomable);
      this.cy.autounselectify(!this.options.draggable);
    }
  }

  /**
   * Destroys the visualization and cleans up resources
   */
  public destroy(): void {
    if (this.cy) {
      this.cy.destroy();
      this.cy = null;
    }
  }

  /**
   * Exports the current graph visualization as an image
   * @param format Image format (png or jpg)
   * @param quality Image quality for jpg format (0-1)
   * @returns Base64-encoded image data URL
   */
  public exportImage(format: 'png' | 'jpg' = 'png', quality: number = 0.9): string | undefined {
    if (!this.cy) return undefined;
    
    return this.cy.png({
      output: 'base64uri',
      bg: '#ffffff',
      full: true,
      scale: 2,
      quality: quality
    } as any) as string;
  }

  /**
   * Exports the current graph data to JSON
   * @returns Graph data in JSON format
   */
  public exportData(): GraphData {
    // Use the internal data structure rather than extracting from cytoscape
    // to preserve any custom properties that might not be in the visualization
    return JSON.parse(JSON.stringify(this.data));
  }
}