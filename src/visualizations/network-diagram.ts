/**
 * Network Diagram Visualization Component
 * Specialized network visualization with clustering, community detection, and centrality analysis
 */
import * as d3 from 'd3';

/**
 * Network node interface
 */
export interface NetworkNode {
  /** Unique node identifier */
  id: string;
  
  /** Node label */
  label: string;
  
  /** Node type or category */
  type?: string;
  
  /** Node group/community ID */
  group?: number | string;
  
  /** Node size (represents importance/centrality) */
  size?: number;
  
  /** Custom node properties */
  properties?: Record<string, any>;
  
  /** Initial x-coordinate */
  x?: number;
  
  /** Initial y-coordinate */
  y?: number;
  
  /** Whether the node position is fixed */
  fixed?: boolean;
  
  /** Optional node color */
  color?: string;
}

/**
 * Network link interface
 */
export interface NetworkLink {
  /** Source node ID */
  source: string;
  
  /** Target node ID */
  target: string;
  
  /** Relationship type */
  type?: string;
  
  /** Link weight/strength */
  weight?: number;
  
  /** Whether the link is directed */
  directed?: boolean;
  
  /** Custom link properties */
  properties?: Record<string, any>;
  
  /** Optional link color */
  color?: string;
}

/**
 * Network diagram data structure
 */
export interface NetworkDiagramData {
  /** Network nodes */
  nodes: NetworkNode[];
  
  /** Network links */
  links: NetworkLink[];
  
  /** Optional metadata */
  metadata?: {
    /** Network title */
    title?: string;
    
    /** Network description */
    description?: string;
    
    /** Data source */
    source?: string;
    
    /** Custom properties */
    [key: string]: any;
  };
}

/**
 * Network diagram visualization options
 */
export interface NetworkDiagramOptions {
  /** DOM container for the visualization */
  container: HTMLElement;
  
  /** Diagram width in pixels */
  width?: number;
  
  /** Diagram height in pixels */
  height?: number;
  
  /** Network data */
  data: NetworkDiagramData;
  
  /** Whether to enable physics simulation */
  enableSimulation?: boolean;
  
  /** Whether to enable node dragging */
  draggable?: boolean;
  
  /** Whether to enable zooming and panning */
  zoomable?: boolean;
  
  /** Node size range [min, max] */
  nodeSizeRange?: [number, number];
  
  /** Link width range [min, max] */
  linkWidthRange?: [number, number];
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Label size range [min, max] */
  labelSizeRange?: [number, number];
  
  /** Color scheme for nodes by type */
  nodeColorScheme?: Record<string, string>;
  
  /** Color scheme for links by type */
  linkColorScheme?: Record<string, string>;
  
  /** Default node color */
  defaultNodeColor?: string;
  
  /** Default link color */
  defaultLinkColor?: string;
  
  /** Whether to show a legend */
  showLegend?: boolean;
  
  /** Whether to enable tooltips */
  tooltips?: boolean;
  
  /** Simulation settings */
  simulation?: {
    /** Link distance */
    linkDistance?: number | ((link: NetworkLink) => number);
    
    /** Node charge (repulsion force) */
    charge?: number | ((node: NetworkNode) => number);
    
    /** Collision radius */
    collisionRadius?: number | ((node: NetworkNode) => number);
    
    /** Center force strength */
    centerForce?: number;
    
    /** Alpha decay rate */
    alphaDecay?: number;
  };
  
  /** Community detection algorithm */
  communityDetection?: 'modularity' | 'louvain' | 'none';
  
  /** Centrality measure to use for node sizing */
  centralityMeasure?: 'degree' | 'betweenness' | 'closeness' | 'eigenvector' | 'none';
  
  /** Layout algorithm */
  layout?: 'force' | 'radial' | 'circular' | 'grid' | 'hierarchical';
  
  /** Click handler for nodes and links */
  onClick?: (element: NetworkNode | NetworkLink, type: 'node' | 'link') => void;
  
  /** Double-click handler for nodes */
  onDoubleClick?: (node: NetworkNode) => void;
  
  /** Background color */
  backgroundColor?: string;
  
  /** Node click handler */
  onNodeClick?: (node: NetworkNode) => void;
  
  /** Link click handler */
  onLinkClick?: (link: NetworkLink) => void;
}

/**
 * Internal node type with simulation properties
 */
interface SimulationNode extends NetworkNode, d3.SimulationNodeDatum {
  // D3 force simulation properties
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  
  // Calculated properties
  radius: number;
  degree: number;
  centrality: number;
  color: string;
}

/**
 * Internal link type with simulation properties
 */
interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  // Original link properties
  id: string;
  type?: string;
  weight?: number;
  directed?: boolean;
  properties?: Record<string, any>;
  color: string;
  
  // Calculated properties
  width: number;
}

export class NetworkDiagramVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private data: NetworkDiagramData;
  private options: NetworkDiagramOptions;
  private nodes: SimulationNode[] = [];
  private links: SimulationLink[] = [];
  private simulation: d3.Simulation<SimulationNode, SimulationLink> | null = null;
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private container_g!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private linksGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private nodesGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private labelsGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private legendGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private nodeElements!: d3.Selection<SVGCircleElement, SimulationNode, SVGGElement, unknown>;
  private linkElements!: d3.Selection<SVGLineElement, SimulationLink, SVGGElement, unknown>;
  private labelElements!: d3.Selection<SVGTextElement, SimulationNode, SVGGElement, unknown>;
  private highlightedNode: string | null = null;
  
  /**
   * Creates a new network diagram visualization
   * @param options Visualization options
   */
  constructor(options: NetworkDiagramOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    this.data = this.preprocessData(options.data);
    this.options = this.initializeOptions(options);
    
    // Initialize the visualization
    this.initialize();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: NetworkDiagramOptions): NetworkDiagramOptions {
    // Default node colors based on common entity types
    const defaultNodeColorScheme: Record<string, string> = {
      'entity': '#4C9AFF',      // Blue
      'person': '#36B37E',      // Green
      'organization': '#FF5630', // Red
      'place': '#6554C0',       // Purple
      'concept': '#FFAB00',     // Yellow
      'event': '#00B8D9',       // Cyan
      'document': '#FF8F73',    // Orange
      'product': '#998DD9',     // Light purple
      'default': '#8993A4'      // Gray
    };
    
    // Default link colors based on common relationship types
    const defaultLinkColorScheme: Record<string, string> = {
      'related': '#8993A4',     // Gray
      'causes': '#FF5630',      // Red
      'contains': '#36B37E',    // Green
      'creates': '#00B8D9',     // Cyan
      'belongs_to': '#6554C0',  // Purple
      'located_in': '#FFAB00',  // Yellow
      'default': '#8993A4'      // Gray
    };
    
    return {
      ...options,
      enableSimulation: options.enableSimulation !== false,
      draggable: options.draggable !== false,
      zoomable: options.zoomable !== false,
      nodeSizeRange: options.nodeSizeRange || [5, 30],
      linkWidthRange: options.linkWidthRange || [1, 6],
      showLabels: options.showLabels !== false,
      labelSizeRange: options.labelSizeRange || [10, 16],
      nodeColorScheme: options.nodeColorScheme || defaultNodeColorScheme,
      linkColorScheme: options.linkColorScheme || defaultLinkColorScheme,
      defaultNodeColor: options.defaultNodeColor || defaultNodeColorScheme.default,
      defaultLinkColor: options.defaultLinkColor || defaultLinkColorScheme.default,
      showLegend: options.showLegend !== false,
      tooltips: options.tooltips !== false,
      backgroundColor: options.backgroundColor || '#fff',
      onNodeClick: options.onNodeClick,
      onLinkClick: options.onLinkClick
    };
  }
  
  /**
   * Preprocess network data
   * @param data Raw network data
   */
  private preprocessData(data: NetworkDiagramData): NetworkDiagramData {
    // Create a deep copy of data
    const processedData: NetworkDiagramData = JSON.parse(JSON.stringify(data));
    
    // Generate IDs for links if not provided
    processedData.links.forEach((link, index) => {
      if (!(link as any).id) {
        (link as any).id = `link-${index}`;
      }
    });
    
    // Generate IDs for nodes if not provided
    processedData.nodes.forEach((node, index) => {
      if (!(node as any).id) {
        (node as any).id = `node-${index}`;
      }
    });
    
    return processedData;
  }
  
  /**
   * Initialize the visualization container and elements
   */
  private initialize(): void {
    // Clear any existing content
    d3.select(this.container).selectAll('*').remove();
    
    // Create SVG container
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    
    // Create main container group
    this.container_g = this.svg.append('g');
    
    // Create groups for different elements
    this.linksGroup = this.container_g.append('g').attr('class', 'links');
    this.nodesGroup = this.container_g.append('g').attr('class', 'nodes');
    this.labelsGroup = this.container_g.append('g').attr('class', 'labels');
    
    // Create tooltip
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    
    // Create legend
    this.legendGroup = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - 150}, 20)`);
    
    // Initialize zoom behavior
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        this.container_g.attr('transform', event.transform);
      });
    
    this.svg.call(this.zoom);
    
    // Initialize simulation
    this.initializeSimulation();
    
    // Draw the visualization
    this.draw();
  }
  
  /**
   * Initialize the force simulation
   */
  private initializeSimulation(): void {
    if (!this.options.enableSimulation) return;
    
    this.simulation = d3.forceSimulation<SimulationNode, SimulationLink>(this.nodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(this.links)
        .id(d => d.id)
        .distance((d: SimulationLink) => {
          const linkDistance = this.options.simulation?.linkDistance;
          if (typeof linkDistance === 'function') {
            return (linkDistance as (link: NetworkLink) => number)(d as unknown as NetworkLink);
          }
          return linkDistance || 100;
        }))
      .force('charge', d3.forceManyBody<SimulationNode>()
        .strength(this.options.simulation?.charge || -300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2)
        .strength(this.options.simulation?.centerForce || 0.1))
      .force('collision', d3.forceCollide<SimulationNode>()
        .radius(this.options.simulation?.collisionRadius || ((node: NetworkNode) => (node as SimulationNode).size || 10)))
      .alphaDecay(this.options.simulation?.alphaDecay || 0.02);
  }
  
  /**
   * Draw the network visualization
   */
  private draw(): void {
    // Draw links
    this.linkElements = this.linksGroup
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => d.width)
      .attr('marker-end', d => d.directed ? 'url(#arrowhead)' : null);
    
    // Draw nodes
    this.nodeElements = this.nodesGroup
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Draw labels
    if (this.options.showLabels) {
      this.labelElements = this.labelsGroup
        .selectAll('text')
        .data(this.nodes)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(d => d.label)
        .attr('font-size', d => d.radius * 1.2);
    }
    
    // Add interactions
    if (this.options.draggable) {
      this.nodeElements
        .call(d3.drag<SVGCircleElement, SimulationNode>()
          .on('start', this.dragStarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragEnded.bind(this)));
    }
    
    // Add tooltips
    if (this.options.tooltips) {
      this.nodeElements
        .on('mouseover', this.showNodeTooltip.bind(this))
        .on('mouseout', this.hideTooltip.bind(this));
      
      this.linkElements
        .on('mouseover', this.showLinkTooltip.bind(this))
        .on('mouseout', this.hideTooltip.bind(this));
    }
    
    // Add click handlers
    if (this.options.onNodeClick) {
      this.nodeElements
        .on('click', (_, d) => this.options.onNodeClick?.(d));
    }
    
    if (this.options.onLinkClick) {
      this.linkElements
        .on('click', (_, d) => this.options.onLinkClick?.(d as unknown as NetworkLink));
    }
  }
  
  /**
   * Drag started event handler
   */
  private dragStarted(event: d3.D3DragEvent<SVGCircleElement, SimulationNode, unknown>, d: SimulationNode): void {
    if (!event.active) this.simulation?.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  /**
   * Drag event handler
   */
  private dragged(event: d3.D3DragEvent<SVGCircleElement, SimulationNode, unknown>, d: SimulationNode): void {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  /**
   * Drag ended event handler
   */
  private dragEnded(event: d3.D3DragEvent<SVGCircleElement, SimulationNode, unknown>, d: SimulationNode): void {
    if (!event.active) this.simulation?.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  /**
   * Show tooltip for a node
   */
  private showNodeTooltip(event: MouseEvent, d: SimulationNode): void {
    this.tooltip
      .style('opacity', 1)
      .html(`
        <div class="tooltip-content">
          <strong>${d.label}</strong><br>
          Type: ${d.type}<br>
          Degree: ${d.degree}<br>
          Centrality: ${d.centrality.toFixed(2)}
        </div>
      `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }
  
  /**
   * Show tooltip for a link
   */
  private showLinkTooltip(event: MouseEvent, d: SimulationLink): void {
    this.tooltip
      .style('opacity', 1)
      .html(`
        <div class="tooltip-content">
          <strong>${d.type || 'Related'}</strong><br>
          Weight: ${d.weight || 1}<br>
          Directed: ${d.directed ? 'Yes' : 'No'}
        </div>
      `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }
  
  /**
   * Hide tooltip
   */
  private hideTooltip(): void {
    this.tooltip.style('opacity', 0);
  }
  
  /**
   * Process network data for visualization
   */
  private processNetworkData(): void {
    // Calculate centrality measures if needed
    if (this.options.centralityMeasure !== 'none') {
      this.calculateCentrality();
    }
    
    // Perform community detection if enabled
    if (this.options.communityDetection !== 'none') {
      this.detectCommunities();
    }
    
    // Process nodes
    this.nodes = this.data.nodes.map(node => {
      // Calculate degree (number of connections)
      const degree = this.data.links.filter(
        link => link.source === node.id || link.target === node.id
      ).length;
      
      // Get centrality value (default to degree if not calculated)
      const centrality = (node as any).centrality || degree;
      
      // Calculate node radius based on size/centrality
      const nodeSizeRange = this.options.nodeSizeRange!;
      const baseSize = node.size || 1;
      const sizeScale = d3.scaleLinear()
        .domain([0, d3.max(this.data.nodes, n => n.size || 1) || 1])
        .range(nodeSizeRange);
      
      // Determine node color
      const type = node.type?.toLowerCase() || 'default';
      const color = node.color || 
                   this.options.nodeColorScheme![type] || 
                   this.options.defaultNodeColor!;
      
      return {
        ...node,
        x: node.x || Math.random() * this.width,
        y: node.y || Math.random() * this.height,
        fx: node.fixed ? node.x : null,
        fy: node.fixed ? node.y : null,
        radius: sizeScale(baseSize),
        degree,
        centrality,
        color
      };
    });
    
    // Process links
    this.links = this.data.links.map(link => {
      // Find source and target node objects (not just IDs)
      const source = this.nodes.find(n => n.id === link.source);
      const target = this.nodes.find(n => n.id === link.target);
      
      if (!source || !target) {
        console.error(`Link references unknown node: ${link.source} -> ${link.target}`);
        return null;
      }
      
      // Calculate link width based on weight
      const linkWidthRange = this.options.linkWidthRange!;
      const weight = link.weight || 1;
      const widthScale = d3.scaleLinear()
        .domain([0, d3.max(this.data.links, l => l.weight || 1) || 1])
        .range(linkWidthRange);
      
      // Determine link color
      const type = link.type?.toLowerCase() || 'default';
      const color = link.color || 
                   this.options.linkColorScheme![type] || 
                   this.options.defaultLinkColor!;
      
      return {
        id: (link as any).id,
        source,
        target,
        type: link.type,
        weight: link.weight,
        directed: link.directed,
        properties: link.properties,
        color,
        width: widthScale(weight)
      } as SimulationLink;
    }).filter(link => link !== null) as SimulationLink[];
  }
  
  /**
   * Calculate centrality measures for network nodes
   * This implements simple centrality measures
   */
  private calculateCentrality(): void {
    switch (this.options.centralityMeasure) {
      case 'degree':
        // Degree centrality (already calculated in processNetworkData)
        break;
        
      case 'betweenness':
        // Simplified betweenness centrality approximation
        // This is a simple approximation; a full implementation would use
        // the Floyd-Warshall algorithm or similar for all shortest paths
        this.approximateBetweennessCentrality();
        break;
        
      case 'closeness':
        // Simplified closeness centrality approximation
        this.approximateClosenessCentrality();
        break;
        
      case 'eigenvector':
        // Simplified eigenvector centrality using power iteration
        this.approximateEigenvectorCentrality();
        break;
    }
  }
  
  /**
   * Approximate betweenness centrality
   * Simple approximation using a sampling approach
   */
  private approximateBetweennessCentrality(): void {
    // Create a graph representation for path finding
    const graph: Record<string, string[]> = {};
    
    // Initialize graph with all nodes
    this.data.nodes.forEach(node => {
      graph[node.id] = [];
    });
    
    // Add links to the graph
    this.data.links.forEach(link => {
      graph[link.source].push(link.target);
      // For undirected links, add the reverse connection
      if (!link.directed) {
        graph[link.target].push(link.source);
      }
    });
    
    // Initialize betweenness values
    const betweenness: Record<string, number> = {};
    this.data.nodes.forEach(node => {
      betweenness[node.id] = 0;
    });
    
    // Sample pairs of nodes for shortest paths (full calculation would be O(n^3))
    const numSamples = Math.min(100, this.data.nodes.length * (this.data.nodes.length - 1) / 2);
    const nodes = this.data.nodes.map(n => n.id);
    
    for (let i = 0; i < numSamples; i++) {
      // Select random source and target
      const sourceIndex = Math.floor(Math.random() * nodes.length);
      let targetIndex = Math.floor(Math.random() * (nodes.length - 1));
      if (targetIndex >= sourceIndex) targetIndex++;
      
      const start = nodes[sourceIndex];
      const end = nodes[targetIndex];
      
      // Find shortest paths (using BFS for unweighted graphs)
      const shortestPaths = this.findShortestPaths(graph, start, end);
      
      // Update betweenness values
      if (shortestPaths) {
        shortestPaths.forEach(path => {
          // Skip source and target in the path
          path.slice(1, path.length - 1).forEach(node => {
            betweenness[node] += 1 / shortestPaths.length;
          });
        });
      }
    }
    
    // Normalize and assign to nodes
    const maxBetweenness = Math.max(...Object.values(betweenness));
    this.data.nodes.forEach(node => {
      (node as any).centrality = maxBetweenness > 0 
        ? betweenness[node.id] / maxBetweenness 
        : 0;
    });
  }
  
  /**
   * Find all shortest paths between two nodes using BFS
   * @param graph Graph representation
   * @param start Starting node
   * @param end Ending node
   */
  private findShortestPaths(graph: Record<string, string[]>, start: string, end: string): string[][] {
    // BFS to find shortest paths
    const queue: { node: string; path: string[] }[] = [{ node: start, path: [start] }];
    const visited = new Set<string>([start]);
    const shortestPaths: string[][] = [];
    let shortestLength = Infinity;
    
    while (queue.length > 0) {
      const { node, path } = queue.shift()!;
      
      // Skip paths longer than the shortest found
      if (path.length > shortestLength) continue;
      
      // If we reached the end node
      if (node === end) {
        if (path.length < shortestLength) {
          // New shortest path found
          shortestPaths.length = 0;
          shortestLength = path.length;
        }
        
        // Add to shortest paths
        if (path.length === shortestLength) {
          shortestPaths.push(path);
        }
        continue;
      }
      
      // Explore neighbors
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor) || shortestPaths.length > 0) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
          visited.add(neighbor);
        }
      }
    }
    
    return shortestPaths;
  }
  
  /**
   * Approximate closeness centrality
   */
  private approximateClosenessCentrality(): void {
    // Create a graph representation for path finding
    const graph: Record<string, string[]> = {};
    
    // Initialize graph with all nodes
    this.data.nodes.forEach(node => {
      graph[node.id] = [];
    });
    
    // Add links to the graph
    this.data.links.forEach(link => {
      graph[link.source].push(link.target);
      // For undirected links, add the reverse connection
      if (!link.directed) {
        graph[link.target].push(link.source);
      }
    });
    
    // Calculate closeness for each node
    this.data.nodes.forEach(node => {
      // Calculate distances to all other nodes using BFS
      const distances = this.calculateDistances(graph, node.id);
      
      // Sum of distances (excluding unreachable nodes)
      let sum = 0;
      let reachableNodes = 0;
      
      Object.entries(distances).forEach(([nodeId, distance]) => {
        if (nodeId !== node.id && distance < Infinity) {
          sum += distance;
          reachableNodes++;
        }
      });
      
      // Closeness = 1 / average distance
      (node as any).centrality = reachableNodes > 0 
        ? reachableNodes / sum 
        : 0;
    });
    
    // Normalize closeness values
    const maxCloseness = Math.max(...this.data.nodes.map(n => (n as any).centrality || 0));
    if (maxCloseness > 0) {
      this.data.nodes.forEach(node => {
        (node as any).centrality = ((node as any).centrality || 0) / maxCloseness;
      });
    }
  }
  
  /**
   * Calculate distances from a source node to all other nodes
   * @param graph Graph representation
   * @param source Source node ID
   */
  private calculateDistances(graph: Record<string, string[]>, source: string): Record<string, number> {
    const distances: Record<string, number> = {};
    
    // Initialize all distances to infinity
    Object.keys(graph).forEach(node => {
      distances[node] = Infinity;
    });
    
    // Source to itself is 0
    distances[source] = 0;
    
    // BFS to find shortest paths
    const queue: string[] = [source];
    const visited = new Set<string>([source]);
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      
      // Explore neighbors
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          distances[neighbor] = distances[node] + 1;
          queue.push(neighbor);
          visited.add(neighbor);
        }
      }
    }
    
    return distances;
  }
  
  /**
   * Approximate eigenvector centrality using power iteration
   */
  private approximateEigenvectorCentrality(): void {
    // Create adjacency matrix
    const nodes = this.data.nodes.map(n => n.id);
    const nodeIndexMap: Record<string, number> = {};
    nodes.forEach((id, index) => {
      nodeIndexMap[id] = index;
    });
    
    const n = nodes.length;
    const adjacencyMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // Fill adjacency matrix
    this.data.links.forEach(link => {
      const sourceIndex = nodeIndexMap[link.source];
      const targetIndex = nodeIndexMap[link.target];
      
      // Weight or 1
      const weight = link.weight || 1;
      
      adjacencyMatrix[sourceIndex][targetIndex] = weight;
      
      // For undirected links, mirror the connection
      if (!link.directed) {
        adjacencyMatrix[targetIndex][sourceIndex] = weight;
      }
    });
    
    // Power iteration to find eigenvector
    let centrality = Array(n).fill(1 / n);
    const iterations = 20;
    
    for (let i = 0; i < iterations; i++) {
      const nextCentrality = Array(n).fill(0);
      
      // Matrix-vector multiplication
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          nextCentrality[j] += adjacencyMatrix[j][k] * centrality[k];
        }
      }
      
      // Normalize
      const norm = Math.sqrt(nextCentrality.reduce((sum, c) => sum + c * c, 0));
      if (norm > 0) {
        centrality = nextCentrality.map(c => c / norm);
      } else {
        break;
      }
    }
    
    // Assign centrality values to nodes
    this.data.nodes.forEach((node) => {
      (node as any).centrality = centrality[nodeIndexMap[node.id]];
    });
  }
  
  /**
   * Detect communities in the network
   */
  private detectCommunities(): void {
    switch (this.options.communityDetection) {
      case 'modularity':
        this.detectCommunitiesModularity();
        break;
        
      case 'louvain':
        // Simplified Louvain method (just using the first phase)
        this.detectCommunitiesLouvain();
        break;
    }
  }
  
  /**
   * Simple modularity-based community detection
   * Uses a greedy approach based on the CNM algorithm
   */
  private detectCommunitiesModularity(): void {
    // Create a graph representation
    const nodes = this.data.nodes.map(n => n.id);
    const nodeIndexMap: Record<string, number> = {};
    nodes.forEach((id, index) => {
      nodeIndexMap[id] = index;
    });
    
    const n = nodes.length;
    const edges = this.data.links.map(link => ({
      source: nodeIndexMap[link.source],
      target: nodeIndexMap[link.target],
      weight: link.weight || 1
    }));
    
    // Initialize communities (each node in its own community)
    const communities: number[] = Array(n).fill(0).map((_, i) => i);
    
    // Calculate total edge weight
    const m = edges.reduce((sum, e) => sum + e.weight, 0);
    
    // Calculate node weights (degree)
    const k: number[] = Array(n).fill(0);
    edges.forEach(e => {
      k[e.source] += e.weight;
      k[e.target] += e.weight;
    });
    
    // Build adjacency lists for efficient access
    const adjacencyList: Record<number, Record<number, number>> = {};
    for (let i = 0; i < n; i++) {
      adjacencyList[i] = {};
    }
    
    edges.forEach(e => {
      adjacencyList[e.source][e.target] = (adjacencyList[e.source][e.target] || 0) + e.weight;
      adjacencyList[e.target][e.source] = (adjacencyList[e.target][e.source] || 0) + e.weight;
    });
    
    // Calculate initial modularity
    this.calculateModularity(adjacencyList, communities, k, m);
    
    // First phase of Louvain method
    let improvement = true;
    while (improvement) {
      improvement = false;
      
      // Try moving each node to its neighbors' communities
      for (let i = 0; i < n; i++) {
        const currentCommunity = communities[i];
        
        // Map of community to gain in modularity
        const communityGains: Record<number, number> = {};
        let bestGain = 0;
        let bestCommunity = currentCommunity;
        
        // Calculate gain for each neighboring community
        Object.entries(adjacencyList[i]).forEach(([neighbor]) => {
          const neighborCommunity = communities[parseInt(neighbor)];
          
          // Skip if already checked this community
          if (communityGains[neighborCommunity] !== undefined) return;
          
          // Calculate modularity gain
          const gain = this.calculateModularityGain(
            i, neighborCommunity, communities, adjacencyList, k, m
          );
          
          communityGains[neighborCommunity] = gain;
          
          if (gain > bestGain) {
            bestGain = gain;
            bestCommunity = neighborCommunity;
          }
        });
        
        // Move node to best community if it improves modularity
        if (bestGain > 0 && bestCommunity !== currentCommunity) {
          communities[i] = bestCommunity;
          improvement = true;
        }
      }
    }
    
    // Renumber communities to be consecutive
    const communityMap: Record<number, number> = {};
    let nextId = 0;
    
    for (let i = 0; i < n; i++) {
      if (communityMap[communities[i]] === undefined) {
        communityMap[communities[i]] = nextId++;
      }
    }
    
    // Update node communities
    for (let i = 0; i < n; i++) {
      communities[i] = communityMap[communities[i]];
    }
    
    // Assign communities to nodes
    this.data.nodes.forEach((node) => {
      node.group = communities[nodeIndexMap[node.id]];
    });
  }
  
  /**
   * Simplified Louvain community detection (first phase only)
   */
  private detectCommunitiesLouvain(): void {
    // Create a graph representation
    const nodes = this.data.nodes.map(n => n.id);
    const nodeIndexMap: Record<string, number> = {};
    nodes.forEach((id, index) => {
      nodeIndexMap[id] = index;
    });
    
    const n = nodes.length;
    const edges = this.data.links.map(link => ({
      source: nodeIndexMap[link.source],
      target: nodeIndexMap[link.target],
      weight: link.weight || 1
    }));
    
    // Initialize communities (each node in its own community)
    const communities: number[] = Array(n).fill(0).map((_, i) => i);
    
    // Calculate total edge weight
    const m = edges.reduce((sum, e) => sum + e.weight, 0);
    
    // Calculate node weights (degree)
    const k: number[] = Array(n).fill(0);
    edges.forEach(e => {
      k[e.source] += e.weight;
      k[e.target] += e.weight;
    });
    
    // Build adjacency lists for efficient access
    const adjacencyList: Record<number, Record<number, number>> = {};
    for (let i = 0; i < n; i++) {
      adjacencyList[i] = {};
    }
    
    edges.forEach(e => {
      adjacencyList[e.source][e.target] = (adjacencyList[e.source][e.target] || 0) + e.weight;
      adjacencyList[e.target][e.source] = (adjacencyList[e.target][e.source] || 0) + e.weight;
    });
    
    // Calculate initial modularity
    this.calculateModularity(adjacencyList, communities, k, m);
    
    // First phase of Louvain method
    let improvement = true;
    while (improvement) {
      improvement = false;
      
      // Try moving each node to its neighbors' communities
      for (let i = 0; i < n; i++) {
        const currentCommunity = communities[i];
        
        // Map of community to gain in modularity
        const communityGains: Record<number, number> = {};
        let bestGain = 0;
        let bestCommunity = currentCommunity;
        
        // Calculate gain for each neighboring community
        Object.entries(adjacencyList[i]).forEach(([neighbor]) => {
          const neighborCommunity = communities[parseInt(neighbor)];
          
          // Skip if already checked this community
          if (communityGains[neighborCommunity] !== undefined) return;
          
          // Calculate modularity gain
          const gain = this.calculateModularityGain(
            i, neighborCommunity, communities, adjacencyList, k, m
          );
          
          communityGains[neighborCommunity] = gain;
          
          if (gain > bestGain) {
            bestGain = gain;
            bestCommunity = neighborCommunity;
          }
        });
        
        // Move node to best community if it improves modularity
        if (bestGain > 0 && bestCommunity !== currentCommunity) {
          communities[i] = bestCommunity;
          improvement = true;
        }
      }
    }
    
    // Renumber communities to be consecutive
    const communityMap: Record<number, number> = {};
    let nextId = 0;
    
    for (let i = 0; i < n; i++) {
      if (communityMap[communities[i]] === undefined) {
        communityMap[communities[i]] = nextId++;
      }
    }
    
    // Update node communities
    for (let i = 0; i < n; i++) {
      communities[i] = communityMap[communities[i]];
    }
    
    // Assign communities to nodes
    this.data.nodes.forEach((node) => {
      node.group = communities[nodeIndexMap[node.id]];
    });
  }
  
  /**
   * Calculate modularity of a community assignment
   * @param adjacencyList Adjacency list
   * @param communities Community assignments
   * @param k Node degrees
   * @param m Total edge weight
   */
  private calculateModularity(
    adjacencyList: Record<number, Record<number, number>>,
    communities: number[],
    k: number[],
    m: number
  ): void {
    let q = 0;
    
    // For each pair of nodes
    for (let i = 0; i < communities.length; i++) {
      for (let j = 0; j < communities.length; j++) {
        // Skip if not in same community
        if (communities[i] !== communities[j]) continue;
        
        // Actual edge weight between i and j
        const aij = adjacencyList[i][j] || 0;
        
        // Expected edge weight in random graph
        const expected = k[i] * k[j] / (2 * m);
        
        q += (aij - expected) / (2 * m);
      }
    }
    
    // Normalize modularity
    const maxModularity = Math.max(0, q);
    if (maxModularity > 0) {
      q /= maxModularity;
    }
  }
  
  /**
   * Calculate modularity gain when moving a node to a community
   * @param node Node index
   * @param targetCommunity Target community
   * @param communities Current community assignments
   * @param adjacencyList Adjacency list
   * @param k Node degrees
   * @param m Total edge weight
   */
  private calculateModularityGain(
    node: number,
    targetCommunity: number,
    communities: number[],
    adjacencyList: Record<number, Record<number, number>>,
    k: number[],
    m: number
  ): number {
    // Sum of weights to the target community
    let sumIn = 0;
    Object.entries(adjacencyList[node]).forEach(([neighbor]) => {
      if (communities[parseInt(neighbor)] === targetCommunity) {
        sumIn += adjacencyList[node][parseInt(neighbor)];
      }
    });
    
    // Degree of node
    const ki = k[node];
    
    // Sum of weights in the target community
    let sumTot = 0;
    for (let i = 0; i < communities.length; i++) {
      if (communities[i] === targetCommunity) {
        sumTot += k[i];
      }
    }
    
    // Calculate modularity gain
    return (sumIn - ki * sumTot / (2 * m)) / (2 * m);
  }
  
  /**
   * Perform network layout based on selected algorithm
   */
  private performLayout(): void {
    switch (this.options.layout) {
      case 'force':
        this.createForceSimulation();
        break;
        
      case 'radial':
        this.performRadialLayout();
        break;
        
      case 'circular':
        this.performCircularLayout();
        break;
        
      case 'grid':
        this.performGridLayout();
        break;
        
      case 'hierarchical':
        this.performHierarchicalLayout();
        break;
    }
  }
  
  /**
   * Create force-directed simulation
   */
  private createForceSimulation(): void {
    // Create simulation
    this.simulation = d3.forceSimulation<SimulationNode, SimulationLink>(this.nodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(this.links)
        .id(d => d.id)
        .distance((d: SimulationLink) => {
          const linkDistance = this.options.simulation?.linkDistance;
          if (typeof linkDistance === 'function') {
            return (linkDistance as (link: NetworkLink) => number)(d as unknown as NetworkLink);
          }
          return linkDistance || 100;
        }))
      .force('charge', d3.forceManyBody<SimulationNode>()
        .strength(this.options.simulation?.charge || -300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2)
        .strength(this.options.simulation?.centerForce || 0.1))
      .force('collision', d3.forceCollide<SimulationNode>()
        .radius(this.options.simulation?.collisionRadius || ((node: NetworkNode) => (node as SimulationNode).size || 10)))
      .alphaDecay(this.options.simulation?.alphaDecay || 0.02);
    
    // Run simulation for a few iterations
    if (!this.options.enableSimulation) {
      for (let i = 0; i < 300; ++i) this.simulation.tick();
      this.simulation.stop();
    }
    
    // Set up tick event handler
    this.simulation.on('tick', () => {
      this.updatePositions();
    });
  }
  
  /**
   * Perform radial layout
   */
  private performRadialLayout(): void {
    // Group nodes by community or type
    const groups = new Map<string | number, SimulationNode[]>();
    
    this.nodes.forEach(node => {
      const group = node.group !== undefined ? node.group : node.type || 'default';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(node);
    });
    
    // Calculate layout parameters
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.4;
    
    // Position groups in a circle
    let groupIndex = 0;
    groups.forEach((nodes) => {
      const angle = (2 * Math.PI * groupIndex) / groups.size;
      const groupX = centerX + radius * Math.cos(angle);
      const groupY = centerY + radius * Math.sin(angle);
      
      // Position nodes in a smaller circle within their group
      const groupRadius = 50 + 10 * Math.sqrt(nodes.length);
      nodes.forEach((node, i) => {
        const nodeAngle = (2 * Math.PI * i) / nodes.length;
        node.x = groupX + groupRadius * Math.cos(nodeAngle);
        node.y = groupY + groupRadius * Math.sin(nodeAngle);
        
        // Fix position if specified
        if (node.fixed) {
          node.fx = node.x;
          node.fy = node.y;
        }
      });
      
      groupIndex++;
    });
    
    // Run a gentler force simulation to improve the layout
    this.createForceSimulation();
    this.simulation!.force('center', null);
    this.simulation!.force('charge', d3.forceManyBody().strength(-50));
    
    // Add a force to keep nodes close to their assigned positions
    this.simulation!.force('position', d3.forceRadial<SimulationNode>(this.width / 2, this.height / 2)
      .radius(() => radius));
    
    // Run simulation briefly
    for (let i = 0; i < 100; ++i) this.simulation!.tick();
    
    if (!this.options.enableSimulation) {
      this.simulation!.stop();
    }
  }
  
  /**
   * Perform circular layout
   */
  private performCircularLayout(): void {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.4;
    
    // Position nodes in a circle
    this.nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / this.nodes.length;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
      
      // Fix position if specified
      if (node.fixed) {
        node.fx = node.x;
        node.fy = node.y;
      }
    });
    
    // Create a gentle force simulation to refine positions
    this.createForceSimulation();
    this.simulation!.force('center', null);
    
    // Add a force to keep nodes on the circle
    this.simulation!.force('radial', d3.forceRadial<SimulationNode>(radius)
      .x(centerX)
      .y(centerY)
      .strength(1));
    
    // Run simulation briefly
    for (let i = 0; i < 100; ++i) this.simulation!.tick();
    
    if (!this.options.enableSimulation) {
      this.simulation!.stop();
    }
  }
  
  /**
   * Perform grid layout
   */
  private performGridLayout(): void {
    // Calculate grid dimensions
    const n = this.nodes.length;
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    
    // Calculate cell size
    const cellWidth = this.width / (cols + 1);
    const cellHeight = this.height / (rows + 1);
    
    // Position nodes in a grid
    this.nodes.forEach((node, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      node.x = (col + 1) * cellWidth;
      node.y = (row + 1) * cellHeight;
      
      // Fix position if specified
      if (node.fixed) {
        node.fx = node.x;
        node.fy = node.y;
      }
    });
    
    // Run a gentle force simulation to refine layout
    if (this.options.enableSimulation) {
      this.createForceSimulation();
      this.simulation!.force('center', null);
      this.simulation!.force('charge', d3.forceManyBody().strength(-50));
      
      // Add forces to keep nodes near their grid positions
      this.nodes.forEach(node => {
        node.fx = node.fixed ? node.x : null;
        node.fy = node.fixed ? node.y : null;
      });
    }
  }
  
  /**
   * Perform hierarchical layout
   */
  private performHierarchicalLayout(): void {
    // Find root nodes (no incoming edges)
    const hasIncoming = new Set<string>();
    this.data.links.forEach(link => {
      hasIncoming.add(link.target);
    });
    
    const rootIds = this.data.nodes
      .filter(node => !hasIncoming.has(node.id))
      .map(node => node.id);
    
    // If no clear roots, use the nodes with highest centrality as roots
    let roots: string[];
    if (rootIds.length === 0) {
      // Sort nodes by centrality
      const nodesByCentrality = [...this.nodes]
        .sort((a, b) => (b.centrality || 0) - (a.centrality || 0));
      
      // Take top 10% as roots
      const numRoots = Math.max(1, Math.ceil(this.nodes.length * 0.1));
      roots = nodesByCentrality.slice(0, numRoots).map(n => n.id);
    } else {
      roots = rootIds;
    }
    
    // Build adjacency list
    const outgoingLinks: Record<string, string[]> = {};
    this.data.nodes.forEach(node => {
      outgoingLinks[node.id] = [];
    });
    
    this.data.links.forEach(link => {
      outgoingLinks[link.source].push(link.target);
    });
    
    // Assign levels using BFS
    const levels: Record<string, number> = {};
    const queue: Array<{ id: string; level: number }> = roots.map(id => ({ id, level: 0 }));
    const visited = new Set<string>(roots);
    
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      levels[id] = level;
      
      outgoingLinks[id].forEach(targetId => {
        if (!visited.has(targetId)) {
          visited.add(targetId);
          queue.push({ id: targetId, level: level + 1 });
        }
      });
    }
    
    // Handle unvisited nodes (disconnected)
    this.data.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        levels[node.id] = 0;
      }
    });
    
    // Calculate max level
    const maxLevel = Math.max(...Object.values(levels));
    
    // Group nodes by level
    const nodesByLevel: SimulationNode[][] = [];
    for (let i = 0; i <= maxLevel; i++) {
      nodesByLevel.push([]);
    }
    
    this.nodes.forEach(node => {
      const level = levels[node.id];
      nodesByLevel[level].push(node);
    });
    
    // Position nodes by level
    const levelHeight = this.height / (maxLevel + 2);
    
    nodesByLevel.forEach((nodes, level) => {
      const y = (level + 1) * levelHeight;
      const nodeWidth = this.width / (nodes.length + 1);
      
      nodes.forEach((node, i) => {
        node.x = (i + 1) * nodeWidth;
        node.y = y;
        
        // Fix position if specified
        if (node.fixed) {
          node.fx = node.x;
          node.fy = node.y;
        }
      });
    });
    
    // Run a gentle force simulation to refine positions
    if (this.options.enableSimulation) {
      this.createForceSimulation();
      this.simulation!.force('center', null);
      this.simulation!.force('y', d3.forceY<SimulationNode>(d => {
        const level = levels[d.id];
        return (level + 1) * levelHeight;
      }).strength(0.5));
      
      this.simulation!.force('link', d3.forceLink<SimulationNode, SimulationLink>(this.links)
        .id(d => d.id)
        .distance(d => {
          const sourceLevel = levels[(d.source as SimulationNode).id];
          const targetLevel = levels[(d.target as SimulationNode).id];
          return Math.abs(sourceLevel - targetLevel) === 1 ? 70 : 120;
        }));
    }
  }
  
  /**
   * Update element positions based on simulation
   */
  private updatePositions(): void {
    // Update node positions
    if (this.nodeElements) {
      this.nodeElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }
    
    // Update link positions
    if (this.linkElements) {
      this.linkElements
        .attr('x1', d => (d.source as SimulationNode).x)
        .attr('y1', d => (d.source as SimulationNode).y)
        .attr('x2', d => (d.target as SimulationNode).x)
        .attr('y2', d => (d.target as SimulationNode).y);
    }
    
    // Update label positions
    if (this.labelElements) {
      this.labelElements
        .attr('x', d => d.x)
        .attr('y', d => d.y + d.radius + 4);
    }
  }
  
  /**
   * Render the network diagram
   */
  public render(): void {
    // Update dimensions based on container size
    this.width = this.container.clientWidth || this.width;
    this.height = this.container.clientHeight || this.height;
    
    // Update SVG dimensions
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height].join(' '));
    
    // Render links
    this.renderLinks();
    
    // Render nodes
    this.renderNodes();
    
    // Render labels if enabled
    if (this.options.showLabels) {
      this.renderLabels();
    }
    
    // Render legend if enabled
    if (this.options.showLegend) {
      this.renderLegend();
    }
    
    // Center the diagram
    if (this.options.zoomable) {
      this.centerDiagram();
    }
  }
  
  /**
   * Render network links
   */
  private renderLinks(): void {
    // Bind link data
    this.linkElements = this.linksGroup
      .selectAll<SVGLineElement, SimulationLink>('line')
      .data(this.links, d => d.id);
    
    // Remove old links
    this.linkElements.exit().remove();
    
    // Create new links
    const enterLinks = this.linkElements
      .enter()
      .append('line')
      .attr('class', 'network-link')
      .attr('stroke-width', d => d.width)
      .attr('stroke', d => d.color)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', d => d.directed ? 'url(#arrowhead)' : null);
    
    // Merge with existing links
    this.linkElements = enterLinks.merge(this.linkElements);
    
    // Set initial positions
    this.linkElements
      .attr('x1', d => (d.source as SimulationNode).x)
      .attr('y1', d => (d.source as SimulationNode).y)
      .attr('x2', d => (d.target as SimulationNode).x)
      .attr('y2', d => (d.target as SimulationNode).y);
    
    // Add hover effect
    if (this.options.tooltips) {
      this.linkElements
        .on('mouseover', (event, d) => {
          // Highlight link
          this.highlightLink(d.id);
          
          // Show tooltip
          this.showLinkTooltip(event, d);
        })
        .on('mouseout', () => {
          // Clear highlight
          this.clearHighlight();
          
          // Hide tooltip
          this.hideTooltip();
        });
    }
    
    // Add click handler
    if (this.options.onClick) {
      this.linkElements.on('click', (_, d) => {
        if (typeof d.source === 'object' && typeof d.target === 'object') {
          this.options.onClick!({
            source: (d.source as SimulationNode).id,
            target: (d.target as SimulationNode).id,
            type: d.type,
            weight: d.weight,
            directed: d.directed,
            properties: d.properties
          }, 'link');
        }
      });
    }
  }
  
  /**
   * Render network nodes
   */
  private renderNodes(): void {
    // Bind node data
    this.nodeElements = this.nodesGroup
      .selectAll<SVGCircleElement, SimulationNode>('circle')
      .data(this.nodes, d => d.id);
    
    // Remove old nodes
    this.nodeElements.exit().remove();
    
    // Create new nodes
    const enterNodes = this.nodeElements
      .enter()
      .append('circle')
      .attr('class', 'network-node')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    
    // Apply dragging behavior if enabled
    if (this.options.draggable && this.simulation) {
      enterNodes.call(d3.drag<SVGCircleElement, SimulationNode>()
        .on('start', (event) => {
          if (!event.active) this.simulation!.alphaTarget(0.3).restart();
          const d = event.subject;
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event) => {
          const d = event.subject;
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) this.simulation!.alphaTarget(0);
          const d = event.subject;
          if (!d.fixed) {
            d.fx = null;
            d.fy = null;
          }
        }));
    }
    
    // Merge with existing nodes
    this.nodeElements = enterNodes.merge(this.nodeElements);
    
    // Set initial positions
    this.nodeElements
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    // Add hover effect
    if (this.options.tooltips) {
      this.nodeElements
        .on('mouseover', (event, d) => {
          // Highlight node
          this.highlightNode(d.id);
          
          // Show tooltip
          this.showNodeTooltip(event, d);
        })
        .on('mouseout', () => {
          // Clear highlight
          this.clearHighlight();
          
          // Hide tooltip
          this.hideTooltip();
        });
    }
    
    // Add click handler
    if (this.options.onClick) {
      this.nodeElements.on('click', (_, d) => this.options.onNodeClick?.(d));
    }
    
    // Add double-click handler
    if (this.options.onDoubleClick) {
      this.nodeElements.on('dblclick', (_, d) => {
        this.options.onDoubleClick!(d);
      });
    }
  }
  
  /**
   * Render node labels
   */
  private renderLabels(): void {
    // Bind label data
    this.labelElements = this.labelsGroup
      .selectAll<SVGTextElement, SimulationNode>('text')
      .data(this.nodes, d => d.id);
    
    // Remove old labels
    this.labelElements.exit().remove();
    
    // Create new labels
    const enterLabels = this.labelElements
      .enter()
      .append('text')
      .attr('class', 'network-label')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text(d => d.label);
    
    // Merge with existing labels
    this.labelElements = enterLabels.merge(this.labelElements);
    
    // Set positions and style
    this.labelElements
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.radius + 4)
      .attr('font-size', d => {
        // Scale font size based on node importance
        const [min, max] = this.options.labelSizeRange!;
        return min + (max - min) * (d.centrality || 0.5);
      })
      .attr('opacity', d => this.highlightedNode ? 
        (d.id === this.highlightedNode ? 1 : 0.3) : 1);
  }
  
  /**
   * Render network legend
   */
  private renderLegend(): void {
    // Clear legend
    this.legendGroup.selectAll('*').remove();
    
    // Add legend title
    this.legendGroup.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Legend');
    
    // Get unique node types
    const nodeTypes = Array.from(new Set(this.nodes.map(n => n.type || 'default')));
    
    // Draw node type legend
    nodeTypes.forEach((type, i) => {
      const g = this.legendGroup.append('g')
        .attr('transform', `translate(0, ${25 + i * 20})`);
      
      // Color circle
      g.append('circle')
        .attr('r', 6)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', this.options.nodeColorScheme![type.toLowerCase()] || this.options.defaultNodeColor!);
      
      // Type label
      g.append('text')
        .attr('x', 15)
        .attr('y', 4)
        .attr('font-size', '12px')
        .text(type);
    });
    
    // Get unique link types
    const linkTypes = Array.from(new Set(this.links.map(l => l.type || 'default')));
    
    // Draw link type legend
    const startY = 35 + nodeTypes.length * 20;
    
    // Add separator
    this.legendGroup.append('line')
      .attr('x1', 0)
      .attr('y1', startY - 10)
      .attr('x2', 80)
      .attr('y2', startY - 10)
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);
    
    linkTypes.forEach((type, i) => {
      const g = this.legendGroup.append('g')
        .attr('transform', `translate(0, ${startY + i * 20})`);
      
      // Line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 10)
        .attr('y2', 0)
        .attr('stroke-width', 2)
        .attr('stroke', this.options.linkColorScheme![type.toLowerCase()] || this.options.defaultLinkColor!);
      
      // Type label
      g.append('text')
        .attr('x', 15)
        .attr('y', 4)
        .attr('font-size', '12px')
        .text(type);
    });
  }
  
  /**
   * Highlight a node and its connections
   * @param nodeId Node ID to highlight
   */
  public highlightNode(nodeId: string): void {
    this.highlightedNode = nodeId;
    
    // Find connected links
    const connectedLinkIds = this.links
      .filter(link => 
        (link.source as SimulationNode).id === nodeId || 
        (link.target as SimulationNode).id === nodeId
      )
      .map(link => link.id);
    
    // Highlight the node
    if (this.nodeElements) {
      this.nodeElements
        .attr('opacity', d => d.id === nodeId ? 1 : 0.3)
        .attr('stroke-width', d => d.id === nodeId ? 3 : 1.5);
    }
    
    // Highlight connected links
    if (this.linkElements) {
      this.linkElements
        .attr('opacity', d => connectedLinkIds.includes(d.id) ? 1 : 0.1)
        .attr('stroke-width', d => connectedLinkIds.includes(d.id) ? d.width * 1.5 : d.width)
        .attr('marker-end', d => {
          if (!d.directed) return null;
          return connectedLinkIds.includes(d.id) ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)';
        });
    }
    
    // Highlight labels
    if (this.labelElements) {
      this.labelElements
        .attr('opacity', d => d.id === nodeId ? 1 : 0.3);
    }
  }
  
  /**
   * Highlight a link and its connected nodes
   * @param linkId Link ID to highlight
   */
  public highlightLink(linkId: string): void {
    this.highlightedNode = null;
    
    // Find the link
    const link = this.links.find(l => l.id === linkId);
    if (!link) return;
    
    // Find connected node IDs
    const sourceId = (link.source as SimulationNode).id;
    const targetId = (link.target as SimulationNode).id;
    
    // Highlight the link
    if (this.linkElements) {
      this.linkElements
        .attr('opacity', d => d.id === linkId ? 1 : 0.1)
        .attr('stroke-width', d => d.id === linkId ? d.width * 2 : d.width)
        .attr('marker-end', d => {
          if (!d.directed) return null;
          return d.id === linkId ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)';
        });
    }
    
    // Highlight connected nodes
    if (this.nodeElements) {
      this.nodeElements
        .attr('opacity', d => d.id === sourceId || d.id === targetId ? 1 : 0.3)
        .attr('stroke-width', d => d.id === sourceId || d.id === targetId ? 3 : 1.5);
    }
    
    // Highlight labels
    if (this.labelElements) {
      this.labelElements
        .attr('opacity', d => d.id === sourceId || d.id === targetId ? 1 : 0.3);
    }
  }
  
  /**
   * Clear any highlights
   */
  public clearHighlight(): void {
    this.highlightedNode = null;
    
    // Reset node styles
    if (this.nodeElements) {
      this.nodeElements
        .attr('opacity', 1)
        .attr('stroke-width', 1.5);
    }
    
    // Reset link styles
    if (this.linkElements) {
      this.linkElements
        .attr('opacity', 0.6)
        .attr('stroke-width', d => d.width)
        .attr('marker-end', d => d.directed ? 'url(#arrowhead)' : null);
    }
    
    // Reset label styles
    if (this.labelElements) {
      this.labelElements
        .attr('opacity', 1);
    }
  }
  
  /**
   * Center the diagram
   */
  private centerDiagram(): void {
    if (!this.options.zoomable || !this.zoom) return;
    
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.nodes.forEach(node => {
      minX = Math.min(minX, node.x - node.radius);
      minY = Math.min(minY, node.y - node.radius);
      maxX = Math.max(maxX, node.x + node.radius);
      maxY = Math.max(maxY, node.y + node.radius);
    });
    
    // Handle empty or invalid bounds
    if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
      minX = 0;
      minY = 0;
      maxX = this.width;
      maxY = this.height;
    }
    
    // Add padding
    const padding = 40;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Calculate scale and transform
    const width = maxX - minX;
    const height = maxY - minY;
    
    const scale = Math.min(
      this.width / width,
      this.height / height,
      2 // Maximum scale
    );
    
    const translateX = -minX * scale + (this.width - width * scale) / 2;
    const translateY = -minY * scale + (this.height - height * scale) / 2;
    
    // Apply transform with transition
    this.svg.transition().duration(750).call(
      this.zoom.transform as any,
      d3.zoomIdentity.translate(translateX, translateY).scale(scale)
    );
  }
  
  /**
   * Update the visualization with new data
   * @param data New network data
   */
  public updateData(data: NetworkDiagramData): void {
    this.data = this.preprocessData(data);
    
    // Clear simulation if exists
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    
    // Process data and initialize simulation
    this.processNetworkData();
    
    // Perform layout algorithm
    this.performLayout();
    
    // Render with new data
    this.render();
  }
  
  /**
   * Update visualization options
   * @param options New options
   */
  public updateOptions(options: Partial<NetworkDiagramOptions>): void {
    this.options = this.initializeOptions({ ...this.options, ...options, data: this.data });
    
    // Clear simulation if exists
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    
    // Process data and initialize simulation
    this.processNetworkData();
    
    // Perform layout algorithm
    this.performLayout();
    
    // Render with new options
    this.render();
  }
  
  /**
   * Resize the visualization
   * @param width New width
   * @param height New height
   */
  public resize(width?: number, height?: number): void {
    this.width = width || this.container.clientWidth || this.width;
    this.height = height || this.container.clientHeight || this.height;
    
    // Update SVG dimensions
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height].join(' '));
    
    // Update simulation center force
    if (this.simulation) {
      this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
      this.simulation.alpha(0.3).restart();
    }
    
    // Re-render
    this.render();
  }
  
  /**
   * Get node by ID
   * @param nodeId Node ID
   */
  public getNode(nodeId: string): NetworkNode | undefined {
    return this.nodes.find(node => node.id === nodeId);
  }
  
  /**
   * Get link by ID
   * @param linkId Link ID
   */
  public getLink(linkId: string): NetworkLink | undefined {
    const link = this.links.find(link => link.id === linkId);
    if (!link) return undefined;
    
    return {
      source: (link.source as SimulationNode).id,
      target: (link.target as SimulationNode).id,
      type: link.type,
      weight: link.weight,
      directed: link.directed,
      properties: link.properties,
      color: link.color
    };
  }
  
  /**
   * Clean up resources when the visualization is no longer needed
   */
  public destroy(): void {
    // Stop simulation
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    
    // Remove event listeners
    if (this.svg) {
      this.svg.on('.zoom', null);
      
      if (this.nodeElements) {
        this.nodeElements.on('mouseover', null).on('mouseout', null)
          .on('click', null).on('dblclick', null);
      }
      
      if (this.linkElements) {
        this.linkElements.on('mouseover', null).on('mouseout', null)
          .on('click', null);
      }
    }
    
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}