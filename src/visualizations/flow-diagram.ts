/**
 * Flow Diagram Visualization Component
 * Renders interactive flow diagrams for knowledge graph processes and architectures
 */
import { FlowDiagramVisualizationOptions } from '../types/chart-config';
import * as d3 from 'd3';
import { SimulationNodeDatum } from 'd3';

/**
 * Node data interface for flow diagrams
 */
interface FlowNode {
  id: string;
  label: string;
  type: 'process' | 'decision' | 'start' | 'end' | 'io' | 'custom';
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  properties?: Record<string, any>;
  [key: string]: any;
}

/**
 * Edge data interface for flow diagrams
 */
interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted';
  [key: string]: any;
}

/**
 * Node implementation with positioning and rendering information
 */
interface PositionedNode extends d3.SimulationNodeDatum, FlowNode {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: string;
  pathData?: string;
  textPosition?: { x: number; y: number };
}

/**
 * Edge implementation with positioning information
 */
interface PositionedEdge extends d3.SimulationLinkDatum<PositionedNode>, FlowEdge {
  source: PositionedNode;
  target: PositionedNode;
  points: Array<{ x: number; y: number }>;
  labelPosition?: { x: number; y: number };
}

export class FlowDiagramVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private nodesGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private edgesGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private nodes: PositionedNode[] = [];
  private edges: PositionedEdge[] = [];
  private options: FlowDiagramVisualizationOptions;
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private highlightedNodeId: string | null = null;
  private dagLayout = false;
  
  /**
   * Creates a new flow diagram visualization
   * @param options Visualization options
   */
  constructor(options: FlowDiagramVisualizationOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    this.options = this.initializeOptions(options);
    
    // Determine if we should use DAG layout
    this.dagLayout = this.options.direction === 'TB' || 
                     this.options.direction === 'BT' || 
                     this.options.direction === 'LR' || 
                     this.options.direction === 'RL';
    
    // Process input data
    this.processNodes(options.nodes);
    this.processEdges(options.edges);
    
    // Perform layout if auto layout is enabled
    if (this.options.autoLayout) {
      this.performLayout();
    }
    
    // Initialize the visualization
    this.initializeVisualization();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: FlowDiagramVisualizationOptions): FlowDiagramVisualizationOptions {
    // Default node styles by type
    const defaultNodeStyles: Record<string, any> = {
      process: {
        fill: '#4C9AFF',
        stroke: '#2684FF',
        strokeWidth: 2,
        width: 120,
        height: 60,
        textColor: '#FFFFFF',
        shape: 'rect'
      },
      decision: {
        fill: '#FFC400',
        stroke: '#FF991F',
        strokeWidth: 2,
        width: 100,
        height: 100,
        textColor: '#172B4D',
        shape: 'diamond'
      },
      start: {
        fill: '#36B37E',
        stroke: '#00875A',
        strokeWidth: 2,
        width: 100,
        height: 60,
        textColor: '#FFFFFF',
        shape: 'stadium'
      },
      end: {
        fill: '#FF5630',
        stroke: '#DE350B',
        strokeWidth: 2,
        width: 100,
        height: 60,
        textColor: '#FFFFFF',
        shape: 'stadium'
      },
      io: {
        fill: '#6554C0',
        stroke: '#403294',
        strokeWidth: 2,
        width: 120,
        height: 60,
        textColor: '#FFFFFF',
        shape: 'parallelogram'
      },
      custom: {
        fill: '#79E2F2',
        stroke: '#00B8D9',
        strokeWidth: 2,
        width: 120,
        height: 60,
        textColor: '#172B4D',
        shape: 'rect'
      }
    };
    
    // Default edge style
    const defaultEdgeStyle = {
      stroke: '#6B778C',
      strokeWidth: 2,
      arrowSize: 8,
      textColor: '#172B4D',
      fontSize: 12
    };
    
    // Merge defaults with provided options
    return {
      ...options,
      direction: options.direction || 'TB',
      autoLayout: options.autoLayout !== false,
      draggable: options.draggable !== false,
      snapToGrid: options.snapToGrid !== false,
      gridSize: options.gridSize || 20,
      nodeSeparation: options.nodeSeparation || 50,
      levelSeparation: options.levelSeparation || 100,
      rankAlignment: options.rankAlignment !== false,
      processNodeStyle: { ...defaultNodeStyles.process, ...options.processNodeStyle },
      decisionNodeStyle: { ...defaultNodeStyles.decision, ...options.decisionNodeStyle },
      startNodeStyle: { ...defaultNodeStyles.start, ...options.startNodeStyle },
      endNodeStyle: { ...defaultNodeStyles.end, ...options.endNodeStyle },
      ioNodeStyle: { ...defaultNodeStyles.io, ...options.ioNodeStyle },
      edgeStyle: { ...defaultEdgeStyle, ...options.edgeStyle }
    };
  }
  
  /**
   * Process and normalize node data
   * @param nodes Input node data
   */
  private processNodes(nodes: FlowNode[]): void {
    // Convert to positioned nodes
    this.nodes = nodes.map(node => {
      // Get style based on node type
      const style = this.getNodeStyleByType(node.type);
      
      // Define node dimensions
      const width = node.width || style.width;
      const height = node.height || style.height;
      
      // Use provided position or initialize at origin
      const position = node.position || { x: 0, y: 0 };
      
      // Create positioned node
      const positionedNode: PositionedNode = {
        ...node,
        x: position.x,
        y: position.y,
        width,
        height,
        shape: style.shape
      };
      
      // Generate path data based on shape
      positionedNode.pathData = this.generateShapePath(
        positionedNode.shape,
        width,
        height
      );
      
      // Calculate text position
      positionedNode.textPosition = {
        x: position.x,
        y: position.y
      };
      
      return positionedNode;
    });
  }
  
  /**
   * Process and normalize edge data
   * @param edges Input edge data
   */
  private processEdges(edges: FlowEdge[]): void {
    // Convert to positioned edges
    this.edges = edges.map(edge => {
      // Find source and target nodes
      const sourceNode = this.nodes.find(node => node.id === edge.from);
      const targetNode = this.nodes.find(node => node.id === edge.to);
      
      if (!sourceNode || !targetNode) {
        console.error(`Edge references non-existent node: ${edge.from} -> ${edge.to}`);
        // Return a minimal edge to avoid crashes
        return {
          ...edge,
          source: sourceNode || { id: edge.from, x: 0, y: 0, width: 0, height: 0, label: '', type: 'custom', shape: 'rect' },
          target: targetNode || { id: edge.to, x: 0, y: 0, width: 0, height: 0, label: '', type: 'custom', shape: 'rect' },
          points: [{ x: 0, y: 0 }, { x: 0, y: 0 }]
        };
      }
      
      // Calculate edge points (straight line from source to target center)
      const points = [
        { x: sourceNode.x, y: sourceNode.y },
        { x: targetNode.x, y: targetNode.y }
      ];
      
      // Calculate label position at midpoint
      const labelPosition = {
        x: (sourceNode.x + targetNode.x) / 2,
        y: (sourceNode.y + targetNode.y) / 2 - 10
      };
      
      return {
        ...edge,
        source: sourceNode,
        target: targetNode,
        points,
        labelPosition
      };
    });
  }
  
  /**
   * Get node style based on node type
   * @param type Node type
   */
  private getNodeStyleByType(type: string): any {
    switch (type) {
      case 'process':
        return this.options.processNodeStyle;
      case 'decision':
        return this.options.decisionNodeStyle;
      case 'start':
        return this.options.startNodeStyle;
      case 'end':
        return this.options.endNodeStyle;
      case 'io':
        return this.options.ioNodeStyle;
      case 'custom':
      default:
        return {
          fill: '#79E2F2',
          stroke: '#00B8D9',
          strokeWidth: 2,
          width: 120,
          height: 60,
          textColor: '#172B4D',
          shape: 'rect'
        };
    }
  }
  
  /**
   * Generate SVG path data for a node shape
   * @param shape Shape type
   * @param width Node width
   * @param height Node height
   */
  private generateShapePath(shape: string, width: number, height: number): string {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    switch (shape) {
      case 'rect':
        return `M${-halfWidth},${-halfHeight} h${width} v${height} h${-width} z`;
        
      case 'diamond':
        return `M0,${-halfHeight} L${halfWidth},0 L0,${halfHeight} L${-halfWidth},0 z`;
        
      case 'stadium':
        const radius = Math.min(height / 2, width / 4);
        return `M${-halfWidth + radius},${-halfHeight} 
                h${width - 2 * radius} 
                a${radius},${radius} 0 0 1 ${radius},${radius} 
                v${height - 2 * radius} 
                a${radius},${radius} 0 0 1 ${-radius},${radius} 
                h${-(width - 2 * radius)} 
                a${radius},${radius} 0 0 1 ${-radius},${-radius} 
                v${-(height - 2 * radius)} 
                a${radius},${radius} 0 0 1 ${radius},${-radius} z`;
        
      case 'parallelogram':
        const offset = height / 4;
        return `M${-halfWidth + offset},${-halfHeight} 
                h${width} 
                l${-offset},${height} 
                h${-width} 
                z`;
        
      case 'circle':
        const r = Math.min(halfWidth, halfHeight);
        return `M${-r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`;
        
      default:
        // Default to rectangle
        return `M${-halfWidth},${-halfHeight} h${width} v${height} h${-width} z`;
    }
  }
  
  /**
   * Perform automatic layout of nodes and edges
   */
  private performLayout(): void {
    if (this.dagLayout) {
      this.performDAGLayout();
    } else {
      this.performForceLayout();
    }
    
    // Update edge positions after node layout
    this.updateEdgePoints();
  }
  
  /**
   * Perform directed acyclic graph (DAG) layout
   */
  private performDAGLayout(): void {
    const direction = this.options.direction || 'TB';
    const isHorizontal = direction === 'LR' || direction === 'RL';
    const isReverse = direction === 'BT' || direction === 'RL';
    
    // Group nodes by rank (implicit or explicit)
    const nodesByRank: Map<number, PositionedNode[]> = new Map();
    const ranks = new Map<string, number>();
    
    // First, identify starting nodes (nodes with no incoming edges)
    const incomingEdges = new Map<string, number>();
    this.nodes.forEach(node => incomingEdges.set(node.id, 0));
    this.edges.forEach(edge => {
      const count = incomingEdges.get(edge.to) || 0;
      incomingEdges.set(edge.to, count + 1);
    });
    
    // Nodes with no incoming edges are rank 0
    const startNodes = this.nodes.filter(node => incomingEdges.get(node.id) === 0);
    startNodes.forEach(node => ranks.set(node.id, 0));
    
    // For nodes with incoming edges, set rank based on maximum rank of source nodes + 1
    let changed = true;
    while (changed) {
      changed = false;
      this.edges.forEach(edge => {
        const sourceRank = ranks.get(edge.from);
        if (sourceRank !== undefined) {
          const targetRank = ranks.get(edge.to);
          const newRank = sourceRank + 1;
          if (targetRank === undefined || newRank > targetRank) {
            ranks.set(edge.to, newRank);
            changed = true;
          }
        }
      });
    }
    
    // Group nodes by rank
    this.nodes.forEach(node => {
      const rank = ranks.get(node.id) || 0;
      if (!nodesByRank.has(rank)) {
        nodesByRank.set(rank, []);
      }
      nodesByRank.get(rank)!.push(node);
    });
    
    // Sort ranks
    const sortedRanks = Array.from(nodesByRank.keys()).sort((a, b) => a - b);
    
    // Position nodes by rank
    const rankSeparation = this.options.levelSeparation || 100;
    const nodeSeparation = this.options.nodeSeparation || 50;
    
    sortedRanks.forEach((rank, rankIndex) => {
      const nodesInRank = nodesByRank.get(rank)!;
      
      // Position nodes within rank
      nodesInRank.forEach((node, nodeIndex) => {
        const x = isHorizontal
          ? (isReverse ? this.width - rankIndex * rankSeparation : rankIndex * rankSeparation)
          : nodeIndex * nodeSeparation;
          
        const y = isHorizontal
          ? nodeIndex * nodeSeparation
          : (isReverse ? this.height - rankIndex * rankSeparation : rankIndex * rankSeparation);
        
        node.x = x;
        node.y = y;
      });
    });
    
    // Center each rank
    sortedRanks.forEach(rank => {
      const nodesInRank = nodesByRank.get(rank)!;
      
      if (isHorizontal) {
        // Center vertically
        const totalHeight = nodesInRank.reduce((sum, node) => sum + node.height, 0)
          + (nodesInRank.length - 1) * nodeSeparation;
        let currentY = (this.height - totalHeight) / 2;
        
        nodesInRank.forEach(node => {
          node.y = currentY + node.height / 2;
          currentY += node.height + nodeSeparation;
        });
      } else {
        // Center horizontally
        const totalWidth = nodesInRank.reduce((sum, node) => sum + node.width, 0)
          + (nodesInRank.length - 1) * nodeSeparation;
        let currentX = (this.width - totalWidth) / 2;
        
        nodesInRank.forEach(node => {
          node.x = currentX + node.width / 2;
          currentX += node.width + nodeSeparation;
        });
      }
    });
    
    // Adjust node positions to stay within bounds
    this.adjustNodesWithinBounds();
  }
  
  /**
   * Perform force-directed layout
   */
  private performForceLayout(): void {
    // Simple force-directed layout
    const simulation = d3.forceSimulation<PositionedNode>()
      .nodes(this.nodes)
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius((node: SimulationNodeDatum) => {
        const n = node as PositionedNode;
        return Math.max(n.width, n.height) / 2 + 20;
      }))
      .force('link', d3.forceLink<PositionedNode, PositionedEdge>()
        .links(this.edges as any)
        .id((d: any) => d.id)
        .distance(100));
    
    // Run simulation
    for (let i = 0; i < 300; ++i) simulation.tick();
    
    // Adjust node positions to stay within bounds
    this.adjustNodesWithinBounds();
  }
  
  /**
   * Adjust node positions to stay within bounds
   */
  private adjustNodesWithinBounds(): void {
    const padding = 20;
    
    // Find min and max coordinates
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.nodes.forEach(node => {
      minX = Math.min(minX, node.x - node.width / 2);
      minY = Math.min(minY, node.y - node.height / 2);
      maxX = Math.max(maxX, node.x + node.width / 2);
      maxY = Math.max(maxY, node.y + node.height / 2);
    });
    
    // Calculate scale and translation to fit within bounds
    const diagramWidth = maxX - minX + 2 * padding;
    const diagramHeight = maxY - minY + 2 * padding;
    
    const scaleX = this.width / diagramWidth;
    const scaleY = this.height / diagramHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up if smaller than container
    
    const offsetX = -minX * scale + padding + (this.width - diagramWidth * scale) / 2;
    const offsetY = -minY * scale + padding + (this.height - diagramHeight * scale) / 2;
    
    // Apply transformation
    this.nodes.forEach(node => {
      node.x = node.x * scale + offsetX;
      node.y = node.y * scale + offsetY;
      
      // Update text position
      node.textPosition = { x: node.x, y: node.y };
    });
  }
  
  /**
   * Update edge points based on current node positions
   */
  private updateEdgePoints(): void {
    this.edges.forEach(edge => {
      const sourceNode = this.nodes.find(node => node.id === edge.from);
      const targetNode = this.nodes.find(node => node.id === edge.to);
      
      if (!sourceNode || !targetNode) return;
      
      // Calculate connection points at node boundaries
      const { sourcePoint, targetPoint } = this.calculateConnectionPoints(sourceNode, targetNode);
      
      // Update edge points
      edge.points = [sourcePoint, targetPoint];
      
      // Update label position
      edge.labelPosition = {
        x: (sourcePoint.x + targetPoint.x) / 2,
        y: (sourcePoint.y + targetPoint.y) / 2 - 10
      };
    });
  }
  
  /**
   * Calculate connection points between nodes
   * @param sourceNode Source node
   * @param targetNode Target node
   */
  private calculateConnectionPoints(sourceNode: PositionedNode, targetNode: PositionedNode): {
    sourcePoint: { x: number; y: number };
    targetPoint: { x: number; y: number };
  } {
    // Calculate direction vector
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const angle = Math.atan2(dy, dx);
    
    // Calculate source connection point based on shape
    let sourcePoint = this.getShapeConnectionPoint(sourceNode, angle);
    
    // Calculate target connection point based on shape (opposite angle)
    let targetPoint = this.getShapeConnectionPoint(targetNode, angle + Math.PI);
    
    return { sourcePoint, targetPoint };
  }
  
  /**
   * Get connection point on a shape's boundary
   * @param node Node with shape
   * @param angle Angle of connection in radians
   */
  private getShapeConnectionPoint(node: PositionedNode, angle: number): { x: number; y: number } {
    const halfWidth = node.width / 2;
    const halfHeight = node.height / 2;
    
    // Normalize angle to [0, 2π)
    while (angle < 0) angle += 2 * Math.PI;
    angle %= 2 * Math.PI;
    
    // Calculate connection point based on shape
    switch (node.shape) {
      case 'diamond': {
        // Parametric equation of diamond
        const t = (angle / (Math.PI / 2)) % 4;
        
        let x, y;
        if (t < 1) {
          // Top right edge
          x = t * halfWidth;
          y = (1 - t) * -halfHeight;
        } else if (t < 2) {
          // Bottom right edge
          x = (2 - t) * halfWidth;
          y = (t - 1) * halfHeight;
        } else if (t < 3) {
          // Bottom left edge
          x = (t - 2) * -halfWidth;
          y = (3 - t) * halfHeight;
        } else {
          // Top left edge
          x = (4 - t) * -halfWidth;
          y = (t - 3) * -halfHeight;
        }
        
        return { x: node.x + x, y: node.y + y };
      }
        
      case 'parallelogram': {
        const offset = halfHeight;
        const corners = [
          { x: node.x - halfWidth + offset, y: node.y - halfHeight },
          { x: node.x + halfWidth + offset, y: node.y - halfHeight },
          { x: node.x + halfWidth - offset, y: node.y + halfHeight },
          { x: node.x - halfWidth - offset, y: node.y + halfHeight }
        ];
        
        return this.getPolygonIntersection(corners, node.x, node.y, angle);
      }
        
      case 'stadium': {
        // Approximate with rectangle with rounded corners
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const rx = halfWidth;
        const ry = halfHeight;
        
        // Intersection with rectangle
        let x, y;
        if (Math.abs(dx) * ry > Math.abs(dy) * rx) {
          // Intersect with left or right edge
          x = (dx > 0 ? 1 : -1) * rx;
          y = dy * (rx / Math.abs(dx));
        } else {
          // Intersect with top or bottom edge
          x = dx * (ry / Math.abs(dy));
          y = (dy > 0 ? 1 : -1) * ry;
        }
        
        return { x: node.x + x, y: node.y + y };
      }
        
      case 'circle': {
        const radius = Math.min(halfWidth, halfHeight);
        return {
          x: node.x + radius * Math.cos(angle),
          y: node.y + radius * Math.sin(angle)
        };
      }
        
      case 'rect':
      default: {
        // Intersection with rectangle
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        
        let x, y;
        if (Math.abs(dx) * halfHeight > Math.abs(dy) * halfWidth) {
          // Intersect with left or right edge
          x = (dx > 0 ? 1 : -1) * halfWidth;
          y = dy * (halfWidth / Math.abs(dx));
        } else {
          // Intersect with top or bottom edge
          x = dx * (halfHeight / Math.abs(dy));
          y = (dy > 0 ? 1 : -1) * halfHeight;
        }
        
        return { x: node.x + x, y: node.y + y };
      }
    }
  }
  
  /**
   * Get intersection point with a polygon
   * @param corners Polygon corner points
   * @param centerX Center X coordinate
   * @param centerY Center Y coordinate
   * @param angle Angle of connection in radians
   */
  private getPolygonIntersection(
    corners: Array<{ x: number; y: number }>,
    centerX: number,
    centerY: number,
    angle: number
  ): { x: number; y: number } {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let minDist = Infinity;
    let closestPoint = { x: centerX, y: centerY };
    
    // Check intersection with each edge
    for (let i = 0; i < corners.length; i++) {
      const j = (i + 1) % corners.length;
      const corner1 = corners[i];
      const corner2 = corners[j];
      
      // Line intersection calculation
      const x1 = corner1.x, y1 = corner1.y;
      const x2 = corner2.x, y2 = corner2.y;
      const x3 = centerX, y3 = centerY;
      const x4 = centerX + dx * 1000, y4 = centerY + dy * 1000; // Point far in ray direction
      
      const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
      if (denominator === 0) continue; // Parallel lines
      
      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
      const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
      
      // Check if intersection is on both line segments
      if (ua >= 0 && ua <= 1 && ub >= 0) {
        const intersectX = x1 + ua * (x2 - x1);
        const intersectY = y1 + ua * (y2 - y1);
        
        // Calculate distance from center to intersection
        const dist = Math.sqrt((intersectX - centerX) ** 2 + (intersectY - centerY) ** 2);
        
        // Keep closest valid intersection
        if (dist < minDist) {
          minDist = dist;
          closestPoint = { x: intersectX, y: intersectY };
        }
      }
    }
    
    return closestPoint;
  }
  
  /**
   * Initialize the visualization container and elements
   */
  private initializeVisualization(): void {
    // Clear any existing content
    this.container.innerHTML = '';
    
    // Create SVG element
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'flow-diagram-visualization')
      .attr('viewBox', [0, 0, this.width, this.height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Initialize zoom behavior
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        this.svg.select('g.diagram-container')
          .attr('transform', event.transform.toString());
      });
    
    // Enable zooming
    this.svg.call(this.zoom);
    
    // Create diagram container
    const diagramContainer = this.svg.append('g')
      .attr('class', 'diagram-container');
    
    // Create groups for edges and nodes
    this.edgesGroup = diagramContainer.append('g').attr('class', 'edges');
    this.nodesGroup = diagramContainer.append('g').attr('class', 'nodes');
    
    // Add markers for arrow heads
    this.addArrowMarkers();
    
    // Initialize tooltip
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'flow-diagram-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none')
      .style('z-index', '10');
    
    // Render the visualization
    this.render();
  }
  
  /**
   * Add arrow markers for directed edges
   */
  private addArrowMarkers(): void {
    // Add defs element for markers
    const defs = this.svg.append('defs');
    
    // Add marker for standard arrows
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', this.options.edgeStyle?.arrowSize || 8)
      .attr('markerHeight', this.options.edgeStyle?.arrowSize || 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', this.options.edgeStyle?.stroke || '#6B778C');
    
    // Add marker for highlighted arrows
    defs.append('marker')
      .attr('id', 'arrow-highlight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', (this.options.edgeStyle?.arrowSize || 8) + 2)
      .attr('markerHeight', (this.options.edgeStyle?.arrowSize || 8) + 2)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#FF5630');
  }
  
  /**
   * Render the flow diagram
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
    
    // Render edges
    this.renderEdges();
    
    // Render nodes
    this.renderNodes();
  }
  
  /**
   * Render the edges of the flow diagram
   */
  private renderEdges(): void {
    // Bind edge data
    const edgeGroups = this.edgesGroup
      .selectAll<SVGGElement, PositionedEdge>('g.edge')
      .data(this.edges, (d: any) => `${d.from}-${d.to}`);
    
    // Remove old edges
    edgeGroups.exit().remove();
    
    // Create new edge groups
    const enterGroups = edgeGroups
      .enter()
      .append('g')
      .attr('class', 'edge');
    
    // Add edge lines
    enterGroups.append('path')
      .attr('class', 'edge-path')
      .attr('marker-end', 'url(#arrow)')
      .attr('fill', 'none');
    
    // Add edge labels
    enterGroups.append('text')
      .attr('class', 'edge-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle');
    
    // Merge and update all edge groups
    const allEdgeGroups = enterGroups.merge(edgeGroups);
    
    // Update edge paths
    allEdgeGroups.select<SVGPathElement>('path.edge-path')
      .attr('d', d => this.generateEdgePath(d))
      .attr('stroke', (d: any) => this.getEdgeStroke(d))
      .attr('stroke-width', () => this.options.edgeStyle?.strokeWidth || 2)
      .attr('stroke-dasharray', d => this.getEdgeDashArray(d))
      .attr('marker-end', d => this.highlightedNodeId && 
                               (d.from === this.highlightedNodeId || d.to === this.highlightedNodeId) 
                             ? 'url(#arrow-highlight)' 
                             : 'url(#arrow)')
      .on('mouseover', (event, d) => this.showEdgeTooltip(event, d))
      .on('mouseout', () => this.hideTooltip());
    
    // Update edge labels
    allEdgeGroups.select<SVGTextElement>('text.edge-label')
      .attr('x', d => d.labelPosition?.x || 0)
      .attr('y', d => d.labelPosition?.y || 0)
      .attr('fill', this.options.edgeStyle?.textColor || '#172B4D')
      .attr('font-size', this.options.edgeStyle?.fontSize || 12)
      .text(d => d.label || '');
  }
  
  /**
   * Render the nodes of the flow diagram
   */
  private renderNodes(): void {
    // Bind node data
    const nodeGroups = this.nodesGroup
      .selectAll<SVGGElement, PositionedNode>('g.node')
      .data(this.nodes, (d: any) => d.id);
    
    // Remove old nodes
    nodeGroups.exit().remove();
    
    // Create new node groups
    const enterGroups = nodeGroups
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', d => `node-${d.id}`);
    
    // Add node shapes
    enterGroups.append('path')
      .attr('class', 'node-shape');
    
    // Add node labels
    enterGroups.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle');
    
    // Add drag behavior if enabled
    if (this.options.draggable) {
      enterGroups.call(this.createDragBehavior());
    }
    
    // Merge and update all node groups
    const allNodeGroups = enterGroups.merge(nodeGroups);
    
    // Update node positions
    allNodeGroups
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .on('mouseover', (event, d) => this.showNodeTooltip(event, d))
      .on('mouseout', () => this.hideTooltip())
      .on('click', (event, d) => {
        this.highlightNode(d.id);
        if (this.options.onClick) {
          this.options.onClick(event, d);
        }
      });
    
    // Update node shapes
    allNodeGroups.select<SVGPathElement>('path.node-shape')
      .attr('d', d => d.pathData || '')
      .attr('fill', (d) => this.getNodeFill(d))
      .attr('stroke', d => this.getNodeStyle(d).stroke)
      .attr('stroke-width', d => this.highlightedNodeId === d.id 
                               ? (this.getNodeStyle(d).strokeWidth || 2) + 2 
                               : this.getNodeStyle(d).strokeWidth || 2);
    
    // Update node labels
    allNodeGroups.select<SVGTextElement>('text.node-label')
      .attr('fill', d => this.getNodeStyle(d).textColor || '#ffffff')
      .attr('font-size', '12px')
      .text(d => d.label)
      .each(function(d) {
        // Handle text wrapping for long labels
        const textElement = d3.select(this);
        const words = d.label.split(/\s+/);
        const lineHeight = 1.1; // ems
        const y = 0;
        const width = Math.min(d.width * 0.9, 30 * words.length);
        
        textElement.text(null); // Clear existing text
        
        // Skip wrapping for very short labels
        if (words.length <= 1 && d.label.length < 10) {
          textElement.text(d.label);
          return;
        }
        
        // Add wrapped text
        let line: string[] = [];
        let lineNumber = 0;
        let tspan = textElement.append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', `${lineNumber * lineHeight}em`);
        
        words.forEach(word => {
          line.push(word);
          tspan.text(line.join(' '));
          
          if (tspan.node()!.getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            lineNumber++;
            tspan = textElement.append('tspan')
              .attr('x', 0)
              .attr('y', y)
              .attr('dy', `${lineNumber * lineHeight}em`)
              .text(word);
          }
        });
        
        // Center the text vertically
        const totalHeight = lineNumber * lineHeight;
        textElement.selectAll('tspan')
          .attr('dy', (_, i) => `${i * lineHeight - totalHeight/2 + 0.3}em`);
      });
  }
  
  /**
   * Create drag behavior for nodes
   */
  private createDragBehavior(): d3.DragBehavior<SVGGElement, PositionedNode, unknown> {
    return d3.drag<SVGGElement, PositionedNode>()
      .on('start', (event, _) => {
        event.sourceEvent.stopPropagation(); // Prevent zoom behavior
      })
      .on('drag', (event, d) => {
        // Update node position
        d.x += event.dx;
        d.y += event.dy;
        
        // Snap to grid if enabled
        if (this.options.snapToGrid) {
          const gridSize = this.options.gridSize || 20;
          d.x = Math.round(d.x / gridSize) * gridSize;
          d.y = Math.round(d.y / gridSize) * gridSize;
        }
        
        // Update node position and connected edges
        d3.select(event.sourceEvent.target.closest('g.node'))
          .attr('transform', `translate(${d.x}, ${d.y})`);
        
        // Update edges connected to this node
        this.updateEdgePoints();
        this.renderEdges();
      })
      .on('end', () => {
        // Update edge points after dragging ends
        this.updateEdgePoints();
        this.renderEdges();
      });
  }
  
  /**
   * Generate path data for an edge
   * @param edge Edge data
   */
  private generateEdgePath(edge: PositionedEdge): string {
    if (edge.points.length < 2) return '';
    
    const sourcePoint = edge.points[0];
    const targetPoint = edge.points[1];
    
    // For diagonal lines, use curved path
    return `M${sourcePoint.x},${sourcePoint.y} C${sourcePoint.x},${sourcePoint.y} ${targetPoint.x},${targetPoint.y} ${targetPoint.x},${targetPoint.y}`;
  }
  
  /**
   * Get node fill color
   * @param node Node data
   */
  private getNodeFill(node: PositionedNode): string {
    const style = this.getNodeStyle(node);
    return style.fill || '#4C9AFF';
  }
  
  /**
   * Get node style based on node type
   * @param node Node data
   */
  private getNodeStyle(node: PositionedNode): any {
    // Return style based on node type
    return this.getNodeStyleByType(node.type);
  }
  
  /**
   * Get edge stroke color
   * @param edge Edge data
   */
  private getEdgeStroke(edge: PositionedEdge): string {
    // Use highlight color if connected to highlighted node
    if (this.highlightedNodeId && (edge.from === this.highlightedNodeId || edge.to === this.highlightedNodeId)) {
      return '#FF5630';
    }
    
    // Use edge-specific style if available
    if (edge.style) {
      return edge.style;
    }
    
    return this.options.edgeStyle?.stroke || '#6B778C';
  }
  
  /**
   * Get edge dash array for different line styles
   * @param edge Edge data
   */
  private getEdgeDashArray(edge: PositionedEdge): string {
    const style = edge.style || 'solid';
    
    switch (style) {
      case 'dashed':
        return '5,5';
      case 'dotted':
        return '2,2';
      case 'solid':
      default:
        return '';
    }
  }
  
  /**
   * Show tooltip for a node
   * @param event Mouse event
   * @param node Node data
   */
  private showNodeTooltip(event: any, node: PositionedNode): void {
    let tooltipContent = `<div><strong>${node.label}</strong></div>`;
    tooltipContent += `<div style="opacity: 0.8">Type: ${node.type}</div>`;
    
    // Add properties if available
    if (node.properties && Object.keys(node.properties).length > 0) {
      tooltipContent += '<div style="margin-top: 5px; border-top: 1px solid #ddd; padding-top: 5px;">';
      
      for (const [key, value] of Object.entries(node.properties)) {
        if (typeof value !== 'object') {
          tooltipContent += `<div><strong>${key}:</strong> ${value}</div>`;
        }
      }
      
      tooltipContent += '</div>';
    }
    
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(tooltipContent);
  }
  
  /**
   * Show tooltip for an edge
   * @param event Mouse event
   * @param edge Edge data
   */
  private showEdgeTooltip(event: any, edge: PositionedEdge): void {
    const fromNode = this.nodes.find(node => node.id === edge.from);
    const toNode = this.nodes.find(node => node.id === edge.to);
    
    let tooltipContent = '';
    
    if (edge.label) {
      tooltipContent += `<div><strong>${edge.label}</strong></div>`;
    }
    
    if (fromNode && toNode) {
      tooltipContent += `<div>${fromNode.label} &rarr; ${toNode.label}</div>`;
    }
    
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(tooltipContent);
  }
  
  /**
   * Hide the tooltip
   */
  private hideTooltip(): void {
    this.tooltip.style('visibility', 'hidden');
  }
  
  /**
   * Highlight a specific node and its connections
   * @param nodeId ID of the node to highlight
   */
  public highlightNode(nodeId: string | null): void {
    this.highlightedNodeId = nodeId;
    this.renderNodes();
    this.renderEdges();
  }
  
  /**
   * Update the visualization with new node data
   * @param nodes New node data
   * @param edges New edge data
   */
  public updateData(nodes: FlowNode[], edges: FlowEdge[]): void {
    // Reset highlight state
    this.highlightedNodeId = null;
    
    // Process new data
    this.processNodes(nodes);
    this.processEdges(edges);
    
    // Perform layout if auto layout is enabled
    if (this.options.autoLayout) {
      this.performLayout();
    }
    
    // Render with new data
    this.render();
  }
  
  /**
   * Update visualization options
   * @param options New options
   */
  public updateOptions(options: Partial<FlowDiagramVisualizationOptions>): void {
    this.options = this.initializeOptions({ ...this.options, ...options });
    
    // Re-create arrow markers with new styles
    this.svg.select('defs').remove();
    this.addArrowMarkers();
    
    // Re-render with new options
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
    
    // Re-layout if auto layout is enabled
    if (this.options.autoLayout) {
      this.performLayout();
    }
    
    // Re-render
    this.render();
  }
  
  /**
   * Fit the diagram to the container
   */
  public fitToContainer(): void {
    // Find the bounds of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.nodes.forEach(node => {
      minX = Math.min(minX, node.x - node.width / 2);
      minY = Math.min(minY, node.y - node.height / 2);
      maxX = Math.max(maxX, node.x + node.width / 2);
      maxY = Math.max(maxY, node.y + node.height / 2);
    });
    
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
    
    // Apply transform
    this.svg.transition().duration(500).call(
      this.zoom.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scale)
    );
  }
  
  /**
   * Clean up resources when the visualization is no longer needed
   */
  public destroy(): void {
    // Remove event listeners
    if (this.svg) {
      this.svg.on('.zoom', null);
      this.svg.selectAll('*').on('mouseover', null).on('mouseout', null).on('click', null);
    }
    
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}