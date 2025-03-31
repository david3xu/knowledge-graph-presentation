/**
 * Process Flow Visualization
 * Renders a sequence of steps or processes in a flowchart-like visualization
 * with support for different node types and conditional paths
 */
import * as d3 from 'd3';
import { BaseVisualizationConfig } from '../types/chart-config';

/**
 * Process step node types
 */
export type ProcessNodeType = 
  | 'start'      // Start of process
  | 'end'        // End of process
  | 'process'    // Standard process step
  | 'decision'   // Decision point with multiple branches
  | 'input'      // Input operation
  | 'output'     // Output operation
  | 'subprocess' // Grouped subprocess
  | 'delay'      // Wait or delay 
  | 'database'   // Database operation
  | 'document'   // Document generation
  | 'manual'     // Manual operation
  | 'preparation'; // Preparation step

/**
 * Process flow node data
 */
export interface ProcessNode {
  /** Unique identifier */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Type of process node */
  type: ProcessNodeType;
  
  /** Additional description */
  description?: string;
  
  /** Optional status */
  status?: 'active' | 'completed' | 'pending' | 'error' | 'warning';
  
  /** Fixed position if manual layout */
  position?: { x: number; y: number };
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Process flow connection data
 */
export interface ProcessConnection {
  /** Source node ID */
  from: string;
  
  /** Target node ID */
  to: string;
  
  /** Optional label */
  label?: string;
  
  /** Connection type */
  type?: 'normal' | 'conditional' | 'error' | 'feedback' | 'dataflow';
  
  /** Condition for conditional connections */
  condition?: string;
  
  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Configuration options for process flow visualization
 */
export interface ProcessFlowOptions extends BaseVisualizationConfig {
  /** Process steps */
  nodes: ProcessNode[];
  
  /** Connections between steps */
  connections: ProcessConnection[];
  
  /** Flow direction */
  direction?: 'TB' | 'LR' | 'RL' | 'BT';
  
  /** Whether to use automatic layout */
  autoLayout?: boolean;
  
  /** Node spacing */
  nodeSpacing?: number;
  
  /** Rank separation distance */
  rankSeparation?: number;
  
  /** Whether to align nodes in the same rank */
  alignRankNodes?: boolean;
  
  /** Whether to use curved edges */
  curvedEdges?: boolean;
  
  /** Node size */
  nodeSize?: {
    width: number;
    height: number;
  };
  
  /** Color scheme for node types */
  nodeColors?: Record<ProcessNodeType, string>;
  
  /** Node status colors */
  statusColors?: Record<string, string>;
  
  /** Connection colors by type */
  connectionColors?: Record<string, string>;
  
  /** Whether to show node labels */
  showNodeLabels?: boolean;
  
  /** Whether to show connection labels */
  showConnectionLabels?: boolean;
  
  /** Whether to enable zooming */
  zoomable?: boolean;
  
  /** Whether to enable dragging */
  draggable?: boolean;
  
  /** Initial zoom level */
  initialZoom?: number;
  
  /** Whether to show a mini-map */
  showMiniMap?: boolean;
  
  /** Whether to highlight the current active node */
  highlightActive?: boolean;
  
  /** Active node ID */
  activeNodeId?: string;
  
  /** Callback for node click */
  onNodeClick?: (nodeId: string, data: ProcessNode) => void;
  
  /** Animation settings */
  animation?: {
    /** Duration in milliseconds */
    duration: number;
    /** Whether to show flow animation */
    showFlowAnimation?: boolean;
    /** Whether to animate the current path */
    animateCurrentPath?: boolean;
  };
}

/**
 * Implements a process flow visualization that shows sequential steps and decision points
 */
export class ProcessFlowVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private mainGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private options: ProcessFlowOptions;
  private nodeElements!: d3.Selection<SVGGElement, ProcessNode, SVGGElement, unknown>;
  private connectionElements!: d3.Selection<SVGPathElement, ProcessConnection, SVGGElement, unknown>;
  private nodeMap: Map<string, ProcessNode> = new Map();
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  
  // Default colors for node types
  private readonly DEFAULT_NODE_COLORS: Record<ProcessNodeType, string> = {
    'start': '#4CAF50',      // Green
    'end': '#F44336',        // Red
    'process': '#2196F3',    // Blue
    'decision': '#FF9800',   // Orange
    'input': '#9C27B0',      // Purple
    'output': '#00BCD4',     // Cyan
    'subprocess': '#3F51B5', // Indigo
    'delay': '#607D8B',      // Blue Grey
    'database': '#795548',   // Brown
    'document': '#9E9E9E',   // Grey
    'manual': '#FFC107',     // Amber
    'preparation': '#8BC34A' // Light Green
  };
  
  // Default colors for connection types
  private readonly DEFAULT_CONNECTION_COLORS: Record<string, string> = {
    'normal': '#666666',
    'conditional': '#FF9800',
    'error': '#F44336',
    'feedback': '#9C27B0',
    'dataflow': '#00BCD4'
  };
  
  // Default colors for node status
  private readonly DEFAULT_STATUS_COLORS: Record<string, string> = {
    'active': '#4CAF50',
    'completed': '#2196F3',
    'pending': '#9E9E9E',
    'error': '#F44336',
    'warning': '#FFC107'
  };
  
  /**
   * Creates a new process flow visualization
   * @param options Process flow configuration options
   */
  constructor(options: ProcessFlowOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 800;
    this.height = options.height || this.container.clientHeight || 600;
    
    // Apply default options
    this.options = this.applyDefaultOptions(options);
    
    // Build node map for quick lookups
    this.buildNodeMap();
    
    // Create SVG container
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'process-flow-visualization');
      
    // Add zoom behavior if enabled
    if (this.options.zoomable) {
      this.zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          this.mainGroup.attr('transform', event.transform);
        });
      
      this.svg.call(this.zoom);
      
      // Set initial zoom level if specified
      if (this.options.initialZoom && this.options.initialZoom !== 1) {
        this.svg.call(this.zoom.transform, d3.zoomIdentity
          .translate(this.width / 2, this.height / 2)
          .scale(this.options.initialZoom)
          .translate(-this.width / 2, -this.height / 2));
      }
    }
    
    // Create the main group for the diagram
    this.mainGroup = this.svg.append('g')
      .attr('class', 'process-flow-main-group');
      
    // Add markers for arrowheads
    this.createMarkers();
    
    // Initialize the visualization
    this.initializeVisualization();
    
    // Add window resize handler
    window.addEventListener('resize', this.handleResize);
  }
  
  /**
   * Apply default options to user-provided configuration
   * @param options User options
   * @returns Merged options with defaults
   */
  private applyDefaultOptions(options: ProcessFlowOptions): ProcessFlowOptions {
    return {
      ...options,
      direction: options.direction || 'TB',
      autoLayout: options.autoLayout !== false,
      nodeSpacing: options.nodeSpacing || 50,
      rankSeparation: options.rankSeparation || 100,
      alignRankNodes: options.alignRankNodes !== false,
      curvedEdges: options.curvedEdges !== false,
      nodeSize: options.nodeSize || { width: 150, height: 60 },
      nodeColors: { ...this.DEFAULT_NODE_COLORS, ...options.nodeColors },
      statusColors: { ...this.DEFAULT_STATUS_COLORS, ...options.statusColors },
      connectionColors: { ...this.DEFAULT_CONNECTION_COLORS, ...options.connectionColors },
      showNodeLabels: options.showNodeLabels !== false,
      showConnectionLabels: options.showConnectionLabels !== false,
      zoomable: options.zoomable !== false,
      draggable: options.draggable || false,
      initialZoom: options.initialZoom || 1,
      showMiniMap: options.showMiniMap || false,
      highlightActive: options.highlightActive !== false,
      animation: {
        duration: options.animation?.duration || 500,
        showFlowAnimation: options.animation?.showFlowAnimation || false,
        animateCurrentPath: options.animation?.animateCurrentPath || false,
        ...(options.animation || {})
      }
    };
  }
  
  /**
   * Build a map of nodes for quick lookups
   */
  private buildNodeMap(): void {
    this.nodeMap.clear();
    this.options.nodes.forEach(node => {
      this.nodeMap.set(node.id, node);
    });
  }
  
  /**
   * Create SVG markers for connection arrowheads
   */
  private createMarkers(): void {
    // Create marker definitions
    const defs = this.svg.append('defs');
    
    // Create markers for each connection type
    const connectionColors = this.options.connectionColors || this.DEFAULT_CONNECTION_COLORS;
    Object.entries(connectionColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrowhead-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5L5,0Z')
        .attr('fill', color);
    });
    
    // Create special marker for conditional paths
    defs.append('marker')
      .attr('id', 'conditional-marker')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .attr('markerUnits', 'userSpaceOnUse')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5L5,0Z')
      .attr('fill', this.options.connectionColors?.['conditional'] || this.DEFAULT_CONNECTION_COLORS['conditional']);
  }
  
  /**
   * Compute node positions using a layout algorithm
   */
  private computeLayout(): void {
    if (!this.options.autoLayout) {
      // Use provided positions if auto layout is disabled
      return;
    }
    
    // Get direction parameters
    const isHorizontal = this.options.direction === 'LR' || this.options.direction === 'RL';
    // const rankDir = {
    //   'TB': [0, 1],
    //   'LR': [1, 0],
    //   'RL': [-1, 0],
    //   'BT': [0, -1]
    // }[this.options.direction || 'TB'];
    
    // First, establish ranks (levels) for each node
    const ranks = this.assignRanks();
    const maxRank = Math.max(...Array.from(ranks.values()));
    
    // Group nodes by rank
    const nodesByRank = new Map<number, ProcessNode[]>();
    ranks.forEach((rank, nodeId) => {
      const node = this.nodeMap.get(nodeId);
      if (node) {
        if (!nodesByRank.has(rank)) {
          nodesByRank.set(rank, []);
        }
        nodesByRank.get(rank)?.push(node);
      }
    });
    
    // Position nodes based on rank
    const nodeWidth = this.options.nodeSize?.width ?? 100;
    // const nodeHeight = this.options.nodeSize?.height ?? 60;
    const nodeSpacing = this.options.nodeSpacing ?? 50;
    const rankSeparation = this.options.rankSeparation ?? 100;
    // const direction = this.options.direction ?? 'TB';
    
    nodesByRank.forEach((nodes, rank) => {
      // Position nodes within each rank
      const rankWidth = nodes.length * nodeWidth + (nodes.length - 1) * nodeSpacing;
      const startX = (this.width - rankWidth) / 2;
      
      nodes.forEach((node, index) => {
        const x = startX + index * (nodeWidth + nodeSpacing) + nodeWidth / 2;
        const y = isHorizontal ? 
          (this.height / 2) + (rank - maxRank / 2) * rankSeparation :
          rankSeparation + rank * rankSeparation;
          
        // Adjust position based on direction
        node.position = {
          x: this.options.direction === 'RL' ? this.width - x : x,
          y: this.options.direction === 'BT' ? this.height - y : y
        };
      });
    });
  }
  
  /**
   * Assign ranks (levels) to nodes based on dependencies
   * @returns Map of node IDs to their rank
   */
  private assignRanks(): Map<string, number> {
    const ranks = new Map<string, number>();
    const startNodes = this.findStartNodes();
    const seen = new Set<string>();
    
    // Initialize with start nodes at rank 0
    startNodes.forEach(node => {
      ranks.set(node.id, 0);
      seen.add(node.id);
    });
    
    // Breadth-first traversal to assign ranks
    let currentNodes = [...startNodes];
    let rank = 1;
    
    while (currentNodes.length > 0) {
      const nextNodes: ProcessNode[] = [];
      
      currentNodes.forEach(node => {
        // Find outgoing connections
        const outgoing = this.options.connections.filter(conn => conn.from === node.id);
        
        outgoing.forEach(conn => {
          const targetNode = this.nodeMap.get(conn.to);
          if (targetNode && !seen.has(targetNode.id)) {
            // Assign rank and mark as seen
            ranks.set(targetNode.id, rank);
            seen.add(targetNode.id);
            nextNodes.push(targetNode);
          } else if (targetNode && ranks.get(targetNode.id)! <= ranks.get(node.id)!) {
            // Handle cycles by incrementing the target's rank
            ranks.set(targetNode.id, Math.max(ranks.get(targetNode.id)!, rank));
          }
        });
      });
      
      currentNodes = nextNodes;
      rank++;
    }
    
    // Handle nodes not reached in traversal (isolated nodes)
    this.options.nodes.forEach(node => {
      if (!seen.has(node.id)) {
        ranks.set(node.id, 0);
      }
    });
    
    return ranks;
  }
  
  /**
   * Find start nodes in the process (nodes with no incoming connections)
   * @returns Array of start nodes
   */
  private findStartNodes(): ProcessNode[] {
    const nodesWithIncoming = new Set<string>();
    
    this.options.connections.forEach(conn => {
      nodesWithIncoming.add(conn.to);
    });
    
    // Nodes with no incoming connections are start nodes
    return this.options.nodes.filter(node => !nodesWithIncoming.has(node.id));
  }
  
  /**
   * Initialize the visualization
   */
  private initializeVisualization(): void {
    // Calculate node positions if using auto layout
    if (this.options.autoLayout) {
      this.computeLayout();
    }
    
    // Create container groups
    const connectionsGroup = this.mainGroup.append('g').attr('class', 'connections');
    const nodesGroup = this.mainGroup.append('g').attr('class', 'nodes');
    
    // Create the connections
    this.connectionElements = connectionsGroup.selectAll('.connection')
      .data(this.options.connections)
      .enter()
      .append('path')
      .attr('class', 'connection')
      .attr('d', d => this.calculateConnectionPath(d))
      .attr('stroke', d => this.getConnectionColor(d))
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', d => `url(#arrowhead-${d.type || 'normal'})`)
      .attr('stroke-dasharray', d => d.type === 'conditional' ? '5,5' : null);
    
    // Add connection labels if enabled
    if (this.options.showConnectionLabels) {
      connectionsGroup.selectAll('.connection-label')
        .data(this.options.connections.filter(c => c.label))
        .enter()
        .append('text')
        .attr('class', 'connection-label')
        .attr('text-anchor', 'middle')
        .attr('dy', -5)
        .attr('font-size', 12)
        .attr('transform', (d: unknown) => {
          const connection = d as ProcessConnection;
          const sourceNode = this.nodeMap.get(connection.from);
          const targetNode = this.nodeMap.get(connection.to);
          if (!sourceNode || !targetNode) return '';
          
          const sx = sourceNode.position?.x || 0;
          const sy = sourceNode.position?.y || 0;
          const tx = targetNode.position?.x || 0;
          const ty = targetNode.position?.y || 0;
          
          return `translate(${(sx + tx) / 2},${(sy + ty) / 2})`;
        })
        .text(d => d.label || '');
    }
    
    // Create the nodes
    this.nodeElements = nodesGroup.selectAll('.node')
      .data(this.options.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.position?.x || 0}, ${d.position?.y || 0})`)
      .each((d, i, nodes) => {
        // Create node shape based on type
        this.createNodeShape(d3.select(nodes[i]) as unknown as d3.Selection<SVGGElement, any, SVGGElement, unknown>, d);
      })
      // Add dragging if enabled
      .call(this.options.draggable ? this.setupDragBehavior() : (selection => selection));
      
    // Highlight active node if specified
    if (this.options.highlightActive && this.options.activeNodeId) {
      this.highlightNode(this.options.activeNodeId);
    }
    
    // Add mini-map if enabled
    if (this.options.showMiniMap) {
      this.createMiniMap();
    }
    
    // Add flow animation if enabled
    if (this.options.animation?.showFlowAnimation) {
      this.animateFlow();
    }
    
    // Add click handlers if callback is provided
    if (this.options.onNodeClick) {
      this.nodeElements
        .style('cursor', 'pointer')
        .on('click', (_, d) => {
          if (this.options.onNodeClick) {
            this.options.onNodeClick(d.id, d);
          }
        });
    }
  }
  
  /**
   * Create the appropriate shape for a node based on its type
   * @param nodeGroup The SVG group element for the node
   * @param node The node data
   */
  private createNodeShape(nodeGroup: d3.Selection<SVGGElement, any, SVGGElement, unknown>, node: ProcessNode): void {
    const width = this.options.nodeSize?.width ?? 100;
    const height = this.options.nodeSize?.height ?? 60;
    const color = this.getNodeColor(node);
    
    // Add base shape based on node type
    switch (node.type) {
      case 'start':
      case 'end':
        // Ellipse for start/end
        nodeGroup.append('ellipse')
          .attr('rx', width / 2)
          .attr('ry', height / 2)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'decision':
        // Diamond for decision
        nodeGroup.append('polygon')
          .attr('points', `0,${-height/2} ${width/2},0 0,${height/2} ${-width/2},0`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'process':
      case 'subprocess':
        // Rectangle for process
        nodeGroup.append('rect')
          .attr('x', -width / 2)
          .attr('y', -height / 2)
          .attr('width', width)
          .attr('height', height)
          .attr('rx', node.type === 'subprocess' ? 10 : 0)
          .attr('ry', node.type === 'subprocess' ? 10 : 0)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
          
        // Add double border for subprocess
        if (node.type === 'subprocess') {
          nodeGroup.append('rect')
            .attr('x', -width / 2 + 5)
            .attr('y', -height / 2 + 5)
            .attr('width', width - 10)
            .attr('height', height - 10)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-width', 0.5);
        }
        break;
        
      case 'input':
        // Parallelogram for input
        nodeGroup.append('polygon')
          .attr('points', `${-width/2 + 15},${-height/2} ${width/2},${-height/2} ${width/2 - 15},${height/2} ${-width/2},${height/2}`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'output':
        // Parallelogram for output (reversed)
        nodeGroup.append('polygon')
          .attr('points', `${-width/2},${-height/2} ${width/2 - 15},${-height/2} ${width/2},${height/2} ${-width/2 + 15},${height/2}`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'database':
        // Cylinder for database
        const cylinderGroup = nodeGroup.append('g');
        cylinderGroup.append('ellipse')
          .attr('cx', 0)
          .attr('cy', -height / 2 + 10)
          .attr('rx', width / 2)
          .attr('ry', 10)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
          
        cylinderGroup.append('rect')
          .attr('x', -width / 2)
          .attr('y', -height / 2 + 10)
          .attr('width', width)
          .attr('height', height - 20)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
          
        cylinderGroup.append('ellipse')
          .attr('cx', 0)
          .attr('cy', height / 2 - 10)
          .attr('rx', width / 2)
          .attr('ry', 10)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'document':
        // Document shape
        nodeGroup.append('path')
          .attr('d', `M${-width/2},${-height/2} h${width} v${height-10} 
                     c${-width/6},${10} ${-width/3},${-5} ${-width/2},${10} 
                     c${-width/6},${-15} ${-width/3},${10} ${-width/2},${-10} z`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'delay':
        // Delay symbol (half circle)
        nodeGroup.append('path')
          .attr('d', `M${-width/2},${-height/2} h${width/2} a${width/2},${height} 0 0 1 0,${height} h${-width/2} z`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'manual':
        // Trapezoid for manual operation
        nodeGroup.append('polygon')
          .attr('points', `${-width/2},${-height/2} ${width/2},${-height/2} ${width/2 - 15},${height/2} ${-width/2 + 15},${height/2}`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      case 'preparation':
        // Hexagon for preparation
        nodeGroup.append('polygon')
          .attr('points', `${-width/2},0 ${-width/4},${-height/2} ${width/4},${-height/2} ${width/2},0 ${width/4},${height/2} ${-width/4},${height/2}`)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
        break;
        
      default:
        // Default to rectangle
        nodeGroup.append('rect')
          .attr('x', -width / 2)
          .attr('y', -height / 2)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', color)
          .attr('stroke', '#000')
          .attr('stroke-width', 1);
    }
    
    // Add status indicator if status is specified
    if (node.status) {
      nodeGroup.append('circle')
        .attr('cx', width / 2 - 8)
        .attr('cy', -height / 2 + 8)
        .attr('r', 6)
        .attr('fill', this.options.statusColors?.[node.status] || this.DEFAULT_STATUS_COLORS[node.status]);
    }
    
    // Add label if enabled
    if (this.options.showNodeLabels) {
      const label = node.label;
      const words = label.split(' ');
      const lineHeight = 16;
      
      // Split label into multiple lines if it's long
      if (words.length > 3) {
        const lines: string[] = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
          if (currentLine.length + words[i].length + 1 <= 15) {
            currentLine += ' ' + words[i];
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }
        lines.push(currentLine);
        
        // Add multiline text
        const textElement = nodeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('font-size', 12)
          .attr('dy', -(lines.length - 1) * lineHeight / 2);
          
        lines.forEach((line, i) => {
          textElement.append('tspan')
            .attr('x', 0)
            .attr('dy', i === 0 ? 0 : lineHeight)
            .text(line);
        });
      } else {
        // Add single line text
        nodeGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('font-size', 12)
          .text(label);
      }
    }
    
    // Add tooltips with extended information
    nodeGroup.append('title')
      .text(d => {
        const typeLabel = `Type: ${d.type}\n`;
        const statusLabel = d.status ? `Status: ${d.status}\n` : '';
        const descLabel = d.description ? `Description: ${d.description}` : '';
        return `${d.label}\n${typeLabel}${statusLabel}${descLabel}`;
      });
  }
  
  /**
   * Set up drag behavior for nodes
   */
  private setupDragBehavior(): d3.DragBehavior<SVGGElement, ProcessNode, any> {
    return d3.drag<SVGGElement, ProcessNode>()
      .on('start', this.dragStarted.bind(this))
      .on('drag', this.dragged.bind(this))
      .on('end', this.dragEnded.bind(this));
  }
  
  /**
   * Handle drag start event
   */
  private dragStarted(event: any): void {
    d3.select(event.sourceEvent.currentTarget).raise().classed('dragging', true);
  }
  
  /**
   * Handle drag event
   */
  private dragged(event: any, d: ProcessNode): void {
    // Update node position
    d.position = { x: event.x, y: event.y };
    
    // Update node element position
    d3.select(event.sourceEvent.currentTarget)
      .attr('transform', `translate(${event.x}, ${event.y})`);
      
    // Update connected edges
    this.updateConnectionPaths();
  }
  
  /**
   * Handle drag end event
   */
  private dragEnded(event: any): void {
    d3.select(event.sourceEvent.currentTarget).classed('dragging', false);
  }
  
  /**
   * Calculate the path for a connection
   * @param connection The connection data
   * @returns SVG path string
   */
  private calculateConnectionPath(connection: ProcessConnection): string {
    const sourceNode = this.nodeMap.get(connection.from);
    const targetNode = this.nodeMap.get(connection.to);
    
    if (!sourceNode || !targetNode) {
      return '';
    }
    
    const sx = sourceNode.position?.x || 0;
    const sy = sourceNode.position?.y || 0;
    const tx = targetNode.position?.x || 0;
    const ty = targetNode.position?.y || 0;
    
    // Calculate node dimensions based on type
    const sourceWidth = this.options.nodeSize?.width ?? 100;
    const sourceHeight = this.options.nodeSize?.height ?? 60;
    const targetWidth = this.options.nodeSize?.width ?? 100;
    const targetHeight = this.options.nodeSize?.height ?? 60;
    
    // Calculate start and end points based on node shapes and directions
    const points = this.calculateConnectionPoints(
      sourceNode, targetNode,
      sx, sy, tx, ty,
      sourceWidth, sourceHeight, targetWidth, targetHeight
    );
    
    // Draw curved or straight path based on configuration
    if (this.options.curvedEdges) {
      // Calculate control points for curved path
      const dx = points.end.x - points.start.x;
      // const dy = points.end.y - points.start.y;
      const controlPoint1 = {
        x: points.start.x + dx / 2,
        y: points.start.y
      };
      const controlPoint2 = {
        x: points.end.x - dx / 2,
        y: points.end.y
      };
      
      // Return cubic bezier curve
      return `M${points.start.x},${points.start.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${points.end.x},${points.end.y}`;
    } else {
      // Return straight line
      return `M${points.start.x},${points.start.y} L${points.end.x},${points.end.y}`;
    }
  }
  
  /**
   * Calculate the start and end points for a connection
   */
  private calculateConnectionPoints(
    sourceNode: ProcessNode, targetNode: ProcessNode,
    sx: number, sy: number, tx: number, ty: number,
    sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number
  ): { start: {x: number, y: number}, end: {x: number, y: number} } {
    // Calculate direction vector
    const dx = tx - sx;
    const dy = ty - sy;
    const angle = Math.atan2(dy, dx);
    
    // Calculate source node edge point based on node type
    let sourcePoint = { x: sx, y: sy };
    if (sourceNode.type === 'decision') {
      // Intersection with diamond shape
      if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
        // Horizontal intersection
        sourcePoint.x = sx + Math.sign(dx) * sourceWidth / 2;
        sourcePoint.y = sy;
      } else {
        // Vertical intersection
        sourcePoint.x = sx;
        sourcePoint.y = sy + Math.sign(dy) * sourceHeight / 2;
      }
    } else if (sourceNode.type === 'start' || sourceNode.type === 'end') {
      // Intersection with ellipse
      sourcePoint.x = sx + Math.cos(angle) * sourceWidth / 2;
      sourcePoint.y = sy + Math.sin(angle) * sourceHeight / 2;
    } else {
      // Intersection with rectangle (or other shapes simplified to rectangle)
      if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
        // Horizontal intersection
        sourcePoint.x = sx + Math.sign(dx) * sourceWidth / 2;
        sourcePoint.y = sy;
      } else {
        // Vertical intersection
        sourcePoint.x = sx;
        sourcePoint.y = sy + Math.sign(dy) * sourceHeight / 2;
      }
    }
    
    // Calculate target node edge point based on node type
    let targetPoint = { x: tx, y: ty };
    if (targetNode.type === 'decision') {
      // Intersection with diamond shape
      if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
        // Horizontal intersection
        targetPoint.x = tx - Math.sign(dx) * targetWidth / 2;
        targetPoint.y = ty;
      } else {
        // Vertical intersection
        targetPoint.x = tx;
        targetPoint.y = ty - Math.sign(dy) * targetHeight / 2;
      }
    } else if (targetNode.type === 'start' || targetNode.type === 'end') {
      // Intersection with ellipse
      targetPoint.x = tx - Math.cos(angle) * targetWidth / 2;
      targetPoint.y = ty - Math.sin(angle) * targetHeight / 2;
    } else {
      // Intersection with rectangle (or other shapes simplified to rectangle)
      if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
        // Horizontal intersection
        targetPoint.x = tx - Math.sign(dx) * targetWidth / 2;
        targetPoint.y = ty;
      } else {
        // Vertical intersection
        targetPoint.x = tx;
        targetPoint.y = ty - Math.sign(dy) * targetHeight / 2;
      }
    }
    
    return {
      start: sourcePoint,
      end: targetPoint
    };
  }
  
  /**
   * Update all connection paths
   */
  private updateConnectionPaths(): void {
    this.connectionElements
      .attr('d', d => this.calculateConnectionPath(d));
      
    // Update connection labels
    this.svg.selectAll('.connection-label')
      .attr('transform', (d: unknown) => {
        const connection = d as ProcessConnection;
        const sourceNode = this.nodeMap.get(connection.from);
        const targetNode = this.nodeMap.get(connection.to);
        if (!sourceNode || !targetNode) return '';
        
        const sx = sourceNode.position?.x || 0;
        const sy = sourceNode.position?.y || 0;
        const tx = targetNode.position?.x || 0;
        const ty = targetNode.position?.y || 0;
        
        return `translate(${(sx + tx) / 2},${(sy + ty) / 2})`;
      });
  }
  
  /**
   * Get the color for a node based on its type and status
   * @param node The node data
   * @returns Color string
   */
  private getNodeColor(node: ProcessNode): string {
    if (node.status && this.options.statusColors?.[node.status]) {
      // Use status color with reduced opacity
      const baseColor = this.options.nodeColors?.[node.type] || this.DEFAULT_NODE_COLORS[node.type];
      return d3.color(baseColor)!.brighter(0.5).toString();
    }
    return this.options.nodeColors?.[node.type] || this.DEFAULT_NODE_COLORS[node.type];
  }
  
  /**
   * Get the color for a connection based on its type
   * @param connection The connection data
   * @returns Color string
   */
  private getConnectionColor(connection: ProcessConnection): string {
    return this.options.connectionColors?.[connection.type || 'normal'] || this.DEFAULT_CONNECTION_COLORS[connection.type || 'normal'];
  }
  
  /**
   * Create a mini-map for the process flow
   */
  private createMiniMap(): void {
    const miniMapSize = 150;
    const padding = 10;
    
    // Create mini-map container
    const miniMap = this.svg.append('g')
      .attr('class', 'mini-map')
      .attr('transform', `translate(${this.width - miniMapSize - padding}, ${padding})`);
      
    // Add mini-map background
    miniMap.append('rect')
      .attr('width', miniMapSize)
      .attr('height', miniMapSize)
      .attr('fill', '#f5f5f5')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);
      
    // Calculate bounds of the process flow
    const bounds = this.calculateBounds();
    const scale = Math.min(
      miniMapSize / (bounds.maxX - bounds.minX || 1),
      miniMapSize / (bounds.maxY - bounds.minY || 1)
    ) * 0.9;
    
    // Create mini-map nodes
    miniMap.selectAll('.mini-node')
      .data(this.options.nodes)
      .enter()
      .append('circle')
      .attr('class', 'mini-node')
      .attr('cx', d => (d.position!.x - bounds.minX) * scale + 5)
      .attr('cy', d => (d.position!.y - bounds.minY) * scale + 5)
      .attr('r', 2)
      .attr('fill', d => this.options.nodeColors?.[d.type] || this.DEFAULT_NODE_COLORS[d.type]);
      
    // Create mini-map connections
    miniMap.selectAll('.mini-connection')
      .data(this.options.connections)
      .enter()
      .append('line')
      .attr('class', 'mini-connection')
      .attr('x1', d => {
        const sourceNode = this.nodeMap.get(d.from);
        return ((sourceNode?.position?.x || 0) - bounds.minX) * scale + 5;
      })
      .attr('y1', d => {
        const sourceNode = this.nodeMap.get(d.from);
        return ((sourceNode?.position?.y || 0) - bounds.minY) * scale + 5;
      })
      .attr('x2', d => {
        const targetNode = this.nodeMap.get(d.to);
        return ((targetNode?.position?.x || 0) - bounds.minX) * scale + 5;
      })
      .attr('y2', d => {
        const targetNode = this.nodeMap.get(d.to);
        return ((targetNode?.position?.y || 0) - bounds.minY) * scale + 5;
      })
      .attr('stroke', '#666')
      .attr('stroke-width', 0.5);
      
    // Add viewport indicator
    const viewportRect = miniMap.append('rect')
      .attr('class', 'viewport-indicator')
      .attr('width', miniMapSize)
      .attr('height', miniMapSize)
      .attr('fill', 'none')
      .attr('stroke', '#0066ff')
      .attr('stroke-width', 2);
      
    // Update viewport indicator on zoom
    if (this.options.zoomable) {
      this.zoom.on('zoom.minimap', (event) => {
        const { x, y, k } = event.transform;
        
        // Calculate viewport bounds in mini-map coordinates
        const vpWidth = this.width / k * scale;
        const vpHeight = this.height / k * scale;
        const vpX = (-x / k) * scale + 5;
        const vpY = (-y / k) * scale + 5;
        
        // Update viewport indicator
        viewportRect
          .attr('x', Math.max(0, vpX))
          .attr('y', Math.max(0, vpY))
          .attr('width', Math.min(vpWidth, miniMapSize))
          .attr('height', Math.min(vpHeight, miniMapSize));
      });
    }
  }
  
  /**
   * Calculate the bounds of the process flow
   * @returns Bounds object with min and max coordinates
   */
  private calculateBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    const positions = this.options.nodes.map(node => node.position || { x: 0, y: 0 });
    
    return {
      minX: Math.min(...positions.map(pos => pos.x)) - (this.options.nodeSize?.width || 100) / 2,
      minY: Math.min(...positions.map(pos => pos.y)) - (this.options.nodeSize?.height || 60) / 2,
      maxX: Math.max(...positions.map(pos => pos.x)) + (this.options.nodeSize?.width || 100) / 2,
      maxY: Math.max(...positions.map(pos => pos.y)) + (this.options.nodeSize?.height || 60) / 2
    };
  }
  
  /**
   * Animate the flow of the process
   */
  private animateFlow(): void {
    // Find start nodes
    const startNodes = this.findStartNodes();
    if (startNodes.length === 0) return;
    
    // Start animation from each start node
    startNodes.forEach(node => {
      this.animatePathFromNode(node.id);
    });
  }
  
  /**
   * Animate the flow path starting from a specific node
   * @param nodeId ID of the starting node
   * @param delay Initial animation delay
   */
  private animatePathFromNode(nodeId: string, delay: number = 0): void {
    // Highlight the current node
    this.nodeElements.filter(d => d.id === nodeId)
      .select('circle, rect, polygon, path, ellipse')
      .transition()
      .duration(this.options.animation!.duration / 2)
      .attr('stroke', '#FFC107')
      .attr('stroke-width', 3)
      .transition()
      .duration(this.options.animation!.duration / 2)
      .attr('stroke', '#000')
      .attr('stroke-width', 1);
      
    // Find outgoing connections
    const outgoingConnections = this.options.connections.filter(conn => conn.from === nodeId);
    
    // Animate each connection
    outgoingConnections.forEach((connection, index) => {
      // Animate the connection path
      const path = this.connectionElements.filter(d => d.from === connection.from && d.to === connection.to);
      
      const pathLength = path.node()?.getTotalLength() || 0;
      
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .delay(delay + index * 200)
        .duration(this.options.animation!.duration)
        .attr('stroke-dashoffset', 0)
        .on('end', () => {
          // Continue animation to next node
          this.animatePathFromNode(
            connection.to,
            delay + index * 200 + this.options.animation!.duration
          );
        });
    });
  }
  
  /**
   * Highlight a specific node
   * @param nodeId ID of the node to highlight
   */
  public highlightNode(nodeId: string): void {
    // Reset all nodes
    this.nodeElements.select('circle, rect, polygon, path, ellipse')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);
      
    // Highlight the specified node
    this.nodeElements.filter(d => d.id === nodeId)
      .select('circle, rect, polygon, path, ellipse')
      .attr('stroke', '#FFC107')
      .attr('stroke-width', 3);
      
    // Update active node ID
    this.options.activeNodeId = nodeId;
    
    // Animate the current path if enabled
    if (this.options.animation?.animateCurrentPath) {
      this.animateCurrentPath(nodeId);
    }
  }
  
  /**
   * Animate the current path leading to a specific node
   * @param nodeId ID of the target node
   */
  private animateCurrentPath(nodeId: string): void {
    // Reset all connections
    this.connectionElements
      .attr('stroke-dasharray', null)
      .attr('stroke-dashoffset', null)
      .attr('stroke-opacity', 0.3);
      
    // Find the path to this node
    const path = this.findPathToNode(nodeId);
    
    // Highlight path nodes
    this.nodeElements.filter(d => path.includes(d.id))
      .select('circle, rect, polygon, path, ellipse')
      .attr('stroke', '#FFC107')
      .attr('stroke-width', 2);
      
    // Highlight path connections
    for (let i = 0; i < path.length - 1; i++) {
      const fromId = path[i];
      const toId = path[i + 1];
      
      this.connectionElements.filter(d => d.from === fromId && d.to === toId)
        .attr('stroke-opacity', 1)
        .attr('stroke-width', 3);
    }
  }
  
  /**
   * Find a path from a start node to the specified node
   * @param targetId ID of the target node
   * @returns Array of node IDs representing the path
   */
  private findPathToNode(targetId: string): string[] {
    // Implementation of breadth-first search to find a path
    const startNodes = this.findStartNodes();
    if (startNodes.length === 0 || !this.nodeMap.has(targetId)) return [];
    
    const queue: Array<{ id: string, path: string[] }> = startNodes.map(node => ({
      id: node.id,
      path: [node.id]
    }));
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { id, path } = queue.shift()!;
      
      if (id === targetId) {
        return path;
      }
      
      if (visited.has(id)) continue;
      visited.add(id);
      
      // Find outgoing connections
      const outgoingConnections = this.options.connections.filter(conn => conn.from === id);
      
      // Add next nodes to queue
      outgoingConnections.forEach(conn => {
        if (!visited.has(conn.to)) {
          queue.push({
            id: conn.to,
            path: [...path, conn.to]
          });
        }
      });
    }
    
    return [];
  }
  
  /**
   * Handle window resize
   */
  private handleResize = (): void => {
    this.width = this.options.width || this.container.clientWidth || 800;
    this.height = this.options.height || this.container.clientHeight || 600;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
      
    // If mini-map is enabled, update it
    if (this.options.showMiniMap) {
      const miniMap = this.svg.select('.mini-map');
      if (!miniMap.empty()) {
        miniMap.attr('transform', `translate(${this.width - 160}, 10)`);
      }
    }
  };
  
  /**
   * Update the visualization with new data
   * @param nodes Updated node data
   * @param connections Updated connection data
   */
  public updateData(nodes: ProcessNode[], connections: ProcessConnection[]): void {
    // Update data
    this.options.nodes = nodes;
    this.options.connections = connections;
    
    // Rebuild node map
    this.buildNodeMap();
    
    // Clear existing elements
    this.mainGroup.selectAll('*').remove();
    
    // Reinitialize the visualization
    this.initializeVisualization();
  }
  
  /**
   * Update visualization options
   * @param options New options to apply
   */
  public updateOptions(options: Partial<ProcessFlowOptions>): void {
    this.options = this.applyDefaultOptions({
      ...this.options,
      ...options,
      container: this.options.container, // Ensure container doesn't change
      nodes: options.nodes || this.options.nodes,
      connections: options.connections || this.options.connections
    });
    
    // Rebuild node map if nodes changed
    if (options.nodes) {
      this.buildNodeMap();
    }
    
    // Recreate visualization with new options
    this.svg.selectAll('*').remove();
    
    // Recreate markers
    this.createMarkers();
    
    // Recreate main group
    this.mainGroup = this.svg.append('g')
      .attr('class', 'process-flow-main-group');
      
    // Reinitialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Render or re-render the visualization
   */
  public render(): void {
    this.width = this.options.width || this.container.clientWidth || 800;
    this.height = this.options.height || this.container.clientHeight || 600;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    window.removeEventListener('resize', this.handleResize);
    
    if (this.svg) {
      this.svg.remove();
    }
  }
}