/**
 * Causal Graph Visualization
 * Renders a directed graph that visualizes cause-effect relationships
 * with special styling to highlight causal influences and directionality
 */
import * as d3 from 'd3';
import { BaseType } from 'd3';
import { BaseVisualizationConfig } from '../types/chart-config';

interface CausalGraphEdge extends d3.SimulationLinkDatum<CausalGraphNode> {
  source: CausalGraphNode;
  target: CausalGraphNode;
  label?: string;
  type?: 'causal' | 'correlational' | 'bidirectional';
  strength?: number;
  polarity?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

interface CausalGraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type?: 'cause' | 'effect' | 'mediator' | 'confounder' | 'variable';
  strength?: number;
  description?: string;
}

/**
 * Configuration options for causal graph visualization
 */
export interface CausalGraphOptions extends BaseVisualizationConfig {
  /** Node data representing factors or variables */
  nodes: CausalGraphNode[];
  
  /** Edge data representing causal relationships */
  edges: CausalGraphEdge[];
  
  /** Layout configuration */
  layout?: {
    /** Forces configuration for the force-directed layout */
    forces?: {
      collision?: number;
      link?: number;
      charge?: number;
      center?: number;
    };
    /** Direction for layout orientation */
    direction?: 'LR' | 'TB' | 'RL' | 'BT';
    /** Link distance between nodes */
    linkDistance?: number;
    /** Node separation distance */
    nodeSeparation?: number;
  };
  
  /** Node styling options */
  nodeStyle?: {
    /** Base radius for nodes */
    radius?: number;
    /** Color scale for nodes based on type */
    colorScheme?: Record<string, string>;
    /** Border width */
    borderWidth?: number;
    /** Border color */
    borderColor?: string;
    /** Label font size */
    fontSize?: number;
    /** Label placement */
    labelPlacement?: 'center' | 'below' | 'right';
  };
  
  /** Edge styling options */
  edgeStyle?: {
    /** Width of standard edges */
    width?: number;
    /** Width factor for strength */
    widthFactor?: number;
    /** Color scale for edges based on polarity */
    colorScheme?: Record<string, string>;
    /** Dash array for different edge types */
    dashArrays?: Record<string, string>;
    /** Arrow head size */
    arrowSize?: number;
    /** Label font size */
    fontSize?: number;
  };
  
  /** Highlight specific nodes by ID */
  highlightNodeIds?: string[];
  
  /** Highlight specific edges by source-target pairs */
  highlightEdgePairs?: Array<{source: string, target: string}>;
  
  /** Whether to enable interactive features */
  interactive?: boolean;
  
  /** Whether to show the legend */
  showLegend?: boolean;
  
  /** Callback for node click events */
  onNodeClick?: (nodeId: string, data: any) => void;
  
  /** Callback for edge click events */
  onEdgeClick?: (source: string, target: string, data: any) => void;
}

/**
 * Implements a causal graph visualization that shows cause-effect relationships
 */
export class CausalGraphVisualization {
  private container: HTMLElement;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private options: CausalGraphOptions;
  private simulation: d3.Simulation<CausalGraphNode, CausalGraphEdge> | null = null;
  private nodeElements: d3.Selection<SVGGElement, CausalGraphNode, BaseType, unknown>;
  private linkElements: d3.Selection<SVGLineElement, CausalGraphEdge, BaseType, unknown>;
  private markerElements: d3.Selection<SVGPathElement, [string, string], SVGDefsElement, unknown>;
  
  // Default color schemes
  private readonly DEFAULT_NODE_COLORS = {
    'cause': '#FF7043',       // Orange
    'effect': '#5C6BC0',      // Indigo
    'mediator': '#66BB6A',    // Green
    'confounder': '#8D6E63',  // Brown
    'variable': '#78909C'     // Blue-grey
  };
  
  private readonly DEFAULT_EDGE_COLORS = {
    'positive': '#2E7D32',    // Dark green
    'negative': '#C62828',    // Dark red
    'neutral': '#546E7A'      // Dark blue-grey
  };
  
  /**
   * Creates a new causal graph visualization
   * @param options Causal graph configuration options
   */
  constructor(options: CausalGraphOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 800;
    this.height = options.height || this.container.clientHeight || 600;
    
    // Apply default options
    this.options = this.applyDefaultOptions(options);
    
    // Create the SVG container
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'causal-graph-visualization');
      
    // Create marker definitions for arrowheads
    const defs = this.svg.append('defs');
    
    // Create marker for each polarity type
    const markerData = Object.entries(this.options.edgeStyle?.colorScheme || this.DEFAULT_EDGE_COLORS);
    this.markerElements = defs.selectAll('marker')
      .data(markerData)
      .enter()
      .append('marker')
      .attr('id', d => `arrowhead-${d[0]}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', this.options.edgeStyle?.arrowSize || 6)
      .attr('markerHeight', this.options.edgeStyle?.arrowSize || 6)
      .attr('orient', 'auto')
      .attr('markerUnits', 'userSpaceOnUse')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d => d[1]);
      
    // Create the container groups for nodes and links
    const links = this.svg.append('g').attr('class', 'links');
    const nodes = this.svg.append('g').attr('class', 'nodes');
    
    // Initialize empty selections
    this.nodeElements = nodes.selectAll('.node');
    this.linkElements = links.selectAll('.link');
    
    // Initialize visualization
    this.initializeVisualization();
    
    // Add a legend if enabled
    if (this.options.showLegend) {
      this.createLegend();
    }
    
    // Add window resize handler
    window.addEventListener('resize', this.handleResize);
  }
  
  /**
   * Apply default options to user-provided configuration
   * @param options User options
   * @returns Merged options with defaults
   */
  private applyDefaultOptions(options: CausalGraphOptions): CausalGraphOptions {
    return {
      ...options,
      layout: {
        forces: {
          collision: 70,
          link: 0.7,
          charge: -300,
          center: 0.1,
          ...options.layout?.forces
        },
        direction: 'LR',
        linkDistance: 150,
        nodeSeparation: 50,
        ...options.layout
      },
      nodeStyle: {
        radius: 20,
        colorScheme: this.DEFAULT_NODE_COLORS,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        fontSize: 12,
        labelPlacement: 'below',
        ...options.nodeStyle
      },
      edgeStyle: {
        width: 2,
        widthFactor: 5,
        colorScheme: this.DEFAULT_EDGE_COLORS,
        dashArrays: {
          'causal': '',
          'correlational': '5,5',
          'bidirectional': '0,10,5'
        },
        arrowSize: 6,
        fontSize: 10,
        ...options.edgeStyle
      },
      interactive: options.interactive !== false,
      showLegend: options.showLegend !== false
    };
  }
  
  /**
   * Initialize the force-directed simulation
   */
  private initializeVisualization(): void {
    const { nodes, edges } = this.options;
    
    // Initialize the force simulation
    this.simulation = d3.forceSimulation<CausalGraphNode, CausalGraphEdge>(nodes)
      .force('link', d3.forceLink<CausalGraphNode, CausalGraphEdge>(edges)
        .id((d: CausalGraphNode) => d.id)
        .distance(this.options.layout?.linkDistance || 150))
      .force('charge', d3.forceManyBody().strength(this.options.layout?.forces?.charge || -300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2)
        .strength(this.options.layout?.forces?.center || 0.1))
      .force('collision', d3.forceCollide().radius(this.options.layout?.forces?.collision || 70));
    
    // Apply direction bias if specified
    if (this.options.layout?.direction) {
      this.applyDirectionalForce(this.options.layout.direction);
    }
    
    // Create the links
    this.linkElements = this.svg.select('.links')
      .selectAll<SVGLineElement, CausalGraphEdge>('.link')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke-width', d => {
        const baseWidth = this.options.edgeStyle?.width || 2;
        const strength = d.strength || 0.5;
        return baseWidth + strength * (this.options.edgeStyle?.widthFactor || 3);
      })
      .attr('stroke', d => {
        const polarity = d.polarity || 'neutral';
        return (this.options.edgeStyle?.colorScheme || this.DEFAULT_EDGE_COLORS)[polarity];
      })
      .attr('stroke-dasharray', d => {
        const type = d.type || 'causal';
        return (this.options.edgeStyle?.dashArrays || {})[type] || '';
      })
      .attr('marker-end', d => {
        const polarity = d.polarity || 'neutral';
        return `url(#arrowhead-${polarity})`;
      });
      
    // Add click handlers to links if interactive
    if (this.options.interactive && this.options.onEdgeClick) {
      this.linkElements.style('cursor', 'pointer')
        .on('click', (event, d) => {
          if (this.options.onEdgeClick) {
            this.options.onEdgeClick(d.source.id, d.target.id, d);
          }
        });
    }
    
    // Create the link labels
    const linkLabels = this.svg.select('.links')
      .selectAll('.link-label')
      .data(edges.filter(d => d.label))
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('dy', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', this.options.edgeStyle?.fontSize || 10)
      .text(d => d.label || '');
    
    // Create the nodes
    this.nodeElements = this.svg.select('.nodes')
      .selectAll<SVGGElement, CausalGraphNode>('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, CausalGraphNode>()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this)));
    
    // Add circles for nodes
    this.nodeElements.append('circle')
      .attr('r', d => {
        const baseRadius = this.options.nodeStyle?.radius || 20;
        return d.strength ? baseRadius * (0.8 + d.strength * 0.4) : baseRadius;
      })
      .attr('fill', d => {
        const nodeType = d.type || 'variable';
        return (this.options.nodeStyle?.colorScheme || this.DEFAULT_NODE_COLORS)[nodeType];
      })
      .attr('stroke', this.options.nodeStyle?.borderColor || '#FFFFFF')
      .attr('stroke-width', this.options.nodeStyle?.borderWidth || 2);
    
    // Highlight nodes if specified
    if (this.options.highlightNodeIds && this.options.highlightNodeIds.length > 0) {
      this.nodeElements.filter(d => this.options.highlightNodeIds!.includes(d.id))
        .select('circle')
        .attr('stroke', '#FFC107')
        .attr('stroke-width', 4);
    }
    
    // Add node labels
    this.nodeElements.append('text')
      .attr('dy', d => {
        return this.options.nodeStyle?.labelPlacement === 'center' ? '.35em' : 
               this.options.nodeStyle?.labelPlacement === 'below' ? 
               (this.options.nodeStyle?.radius || 20) + 15 : '.35em';
      })
      .attr('dx', d => {
        return this.options.nodeStyle?.labelPlacement === 'right' ? 
               (this.options.nodeStyle?.radius || 20) + 5 : 0;
      })
      .attr('text-anchor', d => {
        return this.options.nodeStyle?.labelPlacement === 'center' ? 'middle' : 
               this.options.nodeStyle?.labelPlacement === 'below' ? 'middle' : 'start';
      })
      .attr('font-size', this.options.nodeStyle?.fontSize || 12)
      .text(d => d.label);
      
    // Add click handlers to nodes if interactive
    if (this.options.interactive && this.options.onNodeClick) {
      this.nodeElements.style('cursor', 'pointer')
        .on('click', (event, d) => {
          if (this.options.onNodeClick) {
            this.options.onNodeClick(d.id, d);
          }
        });
    }
    
    // Add tooltips if enabled
    if (this.options.interactive) {
      this.addTooltips();
    }
    
    // Start the simulation
    this.simulation.on('tick', () => {
      // Update link positions
      this.linkElements
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);
      
      // Update link label positions
      linkLabels
        .attr('x', d => ((d.source as CausalGraphNode).x! + (d.target as CausalGraphNode).x!) / 2)
        .attr('y', d => ((d.source as CausalGraphNode).y! + (d.target as CausalGraphNode).y!) / 2);
        
      // Update node positions
      this.nodeElements
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });
  }
  
  /**
   * Apply directional forces to orient the graph
   * @param direction Direction for layout
   */
  private applyDirectionalForce(direction: 'LR' | 'TB' | 'RL' | 'BT'): void {
    if (!this.simulation) return;
    
    // Remove existing directional forces
    this.simulation.force('x', null);
    this.simulation.force('y', null);
    
    // Apply forces based on direction
    switch (direction) {
      case 'LR': // Left to right
        this.simulation.force('x', d3.forceX((d: CausalGraphNode) => {
          return d.type === 'cause' ? this.width * 0.2 : 
                 d.type === 'effect' ? this.width * 0.8 : this.width * 0.5;
        }).strength(0.2));
        break;
      case 'RL': // Right to left
        this.simulation.force('x', d3.forceX((d: CausalGraphNode) => {
          return d.type === 'cause' ? this.width * 0.8 : 
                 d.type === 'effect' ? this.width * 0.2 : this.width * 0.5;
        }).strength(0.2));
        break;
      case 'TB': // Top to bottom
        this.simulation.force('y', d3.forceY((d: CausalGraphNode) => {
          return d.type === 'cause' ? this.height * 0.2 : 
                 d.type === 'effect' ? this.height * 0.8 : this.height * 0.5;
        }).strength(0.2));
        break;
      case 'BT': // Bottom to top
        this.simulation.force('y', d3.forceY((d: CausalGraphNode) => {
          return d.type === 'cause' ? this.height * 0.8 : 
                 d.type === 'effect' ? this.height * 0.2 : this.height * 0.5;
        }).strength(0.2));
        break;
    }
  }
  
  /**
   * Create a legend explaining node and edge types
   */
  private createLegend(): void {
    const legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(20, 20)`);
      
    // Node type legend
    const nodeTypes = Object.entries(this.options.nodeStyle?.colorScheme || this.DEFAULT_NODE_COLORS);
    const nodeTypeLegend = legend.append('g').attr('class', 'node-type-legend');
    
    nodeTypeLegend.selectAll('.legend-item')
      .data(nodeTypes)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`)
      .each((d, i, nodes) => {
        const g = d3.select(nodes[i]);
        g.append('circle')
          .attr('r', 6)
          .attr('fill', d[1]);
        g.append('text')
          .attr('x', 15)
          .attr('y', 4)
          .attr('font-size', 12)
          .text(d[0]);
      });
      
    // Edge type legend
    const edgeTypes = Object.entries(this.options.edgeStyle?.colorScheme || this.DEFAULT_EDGE_COLORS);
    const edgeTypeLegend = legend.append('g')
      .attr('class', 'edge-type-legend')
      .attr('transform', `translate(120, 0)`);
      
    edgeTypeLegend.selectAll('.legend-item')
      .data(edgeTypes)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 25})`)
      .each((d, i, nodes) => {
        const g = d3.select(nodes[i]);
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 4)
          .attr('x2', 30)
          .attr('y2', 4)
          .attr('stroke', d[1])
          .attr('stroke-width', 2);
        g.append('text')
          .attr('x', 40)
          .attr('y', 7)
          .attr('font-size', 12)
          .text(d[0]);
      });
  }
  
  /**
   * Add tooltips to nodes and edges
   */
  private addTooltips(): void {
    // Add tooltips to nodes
    this.nodeElements.append('title')
      .text(d => {
        const typeLabel = d.type ? `Type: ${d.type}\n` : '';
        const strengthLabel = d.strength !== undefined ? `Strength: ${d.strength.toFixed(2)}\n` : '';
        const descLabel = d.description ? `${d.description}` : '';
        return `${d.label}\n${typeLabel}${strengthLabel}${descLabel}`;
      });
      
    // Add tooltips to links
    this.linkElements.append('title')
      .text(d => {
        const typeLabel = d.type ? `Type: ${d.type}\n` : '';
        const polarityLabel = d.polarity ? `Polarity: ${d.polarity}\n` : '';
        const strengthLabel = d.strength !== undefined ? `Strength: ${d.strength.toFixed(2)}\n` : '';
        const descLabel = d.description ? `${d.description}` : '';
        return `${d.source.id} → ${d.target.id}\n${typeLabel}${polarityLabel}${strengthLabel}${descLabel}`;
      });
  }
  
  /**
   * Handle start of drag operation
   */
  private dragstarted(event: any, d: CausalGraphNode): void {
    if (!event.active && this.simulation) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }
  
  /**
   * Handle drag operation
   */
  private dragged(event: any, d: CausalGraphNode): void {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  /**
   * Handle end of drag operation
   */
  private dragended(event: any, d: CausalGraphNode): void {
    if (!event.active && this.simulation) {
      this.simulation.alphaTarget(0);
    }
    if (!this.options.interactive) {
      d.fx = null;
      d.fy = null;
    }
  }
  
  /**
   * Handle window resize
   */
  private handleResize = (): void => {
    // Update dimensions
    this.width = this.options.width || this.container.clientWidth || 800;
    this.height = this.options.height || this.container.clientHeight || 600;
    
    // Update SVG dimensions
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
      
    // Update force center
    if (this.simulation) {
      this.simulation
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .alpha(0.3)
        .restart();
    }
  };
  
  /**
   * Highlight specific nodes
   * @param nodeIds Array of node IDs to highlight
   */
  public highlightNodes(nodeIds: string[]): void {
    // Reset all nodes
    this.nodeElements.select('circle')
      .attr('stroke', this.options.nodeStyle?.borderColor || '#FFFFFF')
      .attr('stroke-width', this.options.nodeStyle?.borderWidth || 2);
      
    // Highlight specified nodes
    this.nodeElements.filter(d => (this.options.highlightNodeIds || []).includes(d.id))
      .select('circle')
      .attr('stroke', '#FFC107')
      .attr('stroke-width', 4);
  }
  
  /**
   * Highlight specific edges
   * @param edgePairs Array of source-target pairs to highlight
   */
  public highlightEdges(edgePairs: Array<{source: string, target: string}>): void {
    // Reset all edges
    this.linkElements
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => {
        const baseWidth = this.options.edgeStyle?.width || 2;
        const strength = d.strength || 0.5;
        return baseWidth + strength * (this.options.edgeStyle?.widthFactor || 3);
      });
      
    // Highlight specified edges
    this.linkElements.filter(d => {
      return edgePairs.some(pair => 
        (d.source.id === pair.source && d.target.id === pair.target));
    })
      .attr('stroke-opacity', 1)
      .attr('stroke-width', d => {
        const baseWidth = this.options.edgeStyle?.width || 2;
        const strength = d.strength || 0.5;
        return (baseWidth + strength * (this.options.edgeStyle?.widthFactor || 3)) * 1.5;
      });
  }
  
  /**
   * Update the visualization with new data
   * @param nodes Updated node data
   * @param edges Updated edge data
   */
  public updateData(nodes: CausalGraphNode[], edges: CausalGraphEdge[]): void {
    // Stop existing simulation
    if (this.simulation) {
      this.simulation.stop();
    }
    
    // Update options with new data
    this.options.nodes = nodes;
    this.options.edges = edges;
    
    // Remove existing elements
    this.svg.selectAll('.node').remove();
    this.svg.selectAll('.link').remove();
    this.svg.selectAll('.link-label').remove();
    
    // Reinitialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Update visualization options
   * @param options New options to apply
   */
  public updateOptions(options: Partial<CausalGraphOptions>): void {
    this.options = this.applyDefaultOptions({
      ...this.options,
      ...options,
      container: this.options.container, // Ensure container doesn't change
      nodes: options.nodes || this.options.nodes,
      edges: options.edges || this.options.edges
    });
    
    // Recreate visualization with new options
    this.svg.selectAll('*').remove();
    this.initializeVisualization();
  }
  
  /**
   * Render or re-render the visualization
   */
  public render(): void {
    // Updates dimensions
    this.width = this.options.width || this.container.clientWidth || 800;
    this.height = this.options.height || this.container.clientHeight || 600;
    
    // Update SVG dimensions
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
      
    // Update simulation center force
    if (this.simulation) {
      this.simulation
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .alpha(0.3)
        .restart();
    }
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    // Stop simulation
    if (this.simulation) {
      this.simulation.stop();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    
    // Remove the SVG
    if (this.svg) {
      this.svg.remove();
    }
  }

  private updateNodeVisibility(nodeId: string, visible: boolean): void {
    const node = this.nodeElements.filter(d => d.id === nodeId);
    node.style('opacity', visible ? 1 : 0);
    node.style('pointer-events', visible ? 'all' : 'none');
    
    // Update connected links
    const connectedLinks = this.linkElements.filter(d => 
      d.source.id === nodeId || d.target.id === nodeId
    );
    connectedLinks.style('opacity', visible ? 1 : 0);
    connectedLinks.style('pointer-events', visible ? 'all' : 'none');
  }
}