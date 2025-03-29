/**
 * Flow Diagram Visualization Component
 * Creates interactive flow diagrams for process visualization
 */
import * as d3 from 'd3';
import { FlowDiagramVisualizationOptions } from '../types/chart-config';

/**
 * Core visualization class for rendering process flow diagrams
 */
export class FlowDiagramVisualization {
  private container: HTMLElement;
  private options: FlowDiagramVisualizationOptions;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private width: number;
  private height: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private nodesLayer: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  private edgesLayer: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  private currentTransform: d3.ZoomTransform | null = null;

  /**
   * Node shape generators
   */
  private nodeShapes = {
    process: (width: number, height: number): string => {
      return this.roundedRect(0, 0, width, height, 5);
    },
    
    decision: (width: number, height: number): string => {
      return `M${width/2},0 L${width},${height/2} L${width/2},${height} L0,${height/2} Z`;
    },
    
    start: (width: number, height: number): string => {
      const rx = height / 2;
      return `M${rx},0 H${width-rx} A${rx},${rx} 0 0 1 ${width},${height/2} A${rx},${rx} 0 0 1 ${width-rx},${height} H${rx} A${rx},${rx} 0 0 1 0,${height/2} A${rx},${rx} 0 0 1 ${rx},0 Z`;
    },
    
    end: (width: number, height: number): string => {
      const rx = height / 2;
      return `M${rx},0 H${width-rx} A${rx},${rx} 0 0 1 ${width},${height/2} A${rx},${rx} 0 0 1 ${width-rx},${height} H${rx} A${rx},${rx} 0 0 1 0,${height/2} A${rx},${rx} 0 0 1 ${rx},0 Z`;
    },
    
    io: (width: number, height: number): string => {
      const offset = height * 0.15;
      return `M${offset},0 H${width} L${width-offset},${height} H0 Z`;
    },
    
    custom: (width: number, height: number): string => {
      return this.roundedRect(0, 0, width, height, 5);
    }
  };

  /**
   * Creates a new flow diagram visualization instance
   * @param options Configuration options for the flow diagram visualization
   */
  constructor(options: FlowDiagramVisualizationOptions) {
    this.container = options.container;
    this.options = this.applyDefaultOptions(options);
    
    this.margin = this.options.margin || { top: 40, right: 40, bottom: 40, left: 40 };
    this.width = (this.options.width || this.container.clientWidth) - this.margin.left - this.margin.right;
    this.height = (this.options.height || 600) - this.margin.top - this.margin.bottom;
  }

  /**
   * Applies default options to user-provided options
   * @param options User options
   * @returns Merged options with defaults applied
   */
  private applyDefaultOptions(options: FlowDiagramVisualizationOptions): FlowDiagramVisualizationOptions {
    const defaults: Partial<FlowDiagramVisualizationOptions> = {
      width: this.container.clientWidth,
      height: 600,
      responsive: true,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      animationDuration: 500,
      theme: 'light',
      colorScheme: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8AB4F8', '#F6AEA9', '#FDE293', '#A8DAB5'],
      direction: 'TB',
      autoLayout: true,
      nodeSeparation: 50,
      levelSeparation: 100,
      rankAlignment: true,
      draggable: true,
      snapToGrid: false,
      gridSize: 20,
      showMiniMap: false,
      fitToContainer: true,
      processNodeStyle: {
        fill: '#4285F4',
        stroke: '#2965CC',
        strokeWidth: 2,
        textColor: '#FFFFFF'
      },
      decisionNodeStyle: {
        fill: '#FBBC05',
        stroke: '#E2A604',
        strokeWidth: 2,
        textColor: '#000000'
      },
      startNodeStyle: {
        fill: '#34A853',
        stroke: '#2D9348',
        strokeWidth: 2,
        textColor: '#FFFFFF'
      },
      endNodeStyle: {
        fill: '#EA4335',
        stroke: '#B31412',
        strokeWidth: 2,
        textColor: '#FFFFFF'
      },
      ioNodeStyle: {
        fill: '#8AB4F8',
        stroke: '#4285F4',
        strokeWidth: 2,
        textColor: '#000000'
      },
      edgeStyle: {
        stroke: '#888888',
        strokeWidth: 2,
        arrowSize: 10,
        textColor: '#333333'
      }
    };

    return { ...defaults, ...options };
  }

  /**
   * Helper method to create rounded rectangle SVG path
   * @param x X position
   * @param y Y position
   * @param width Width of rectangle
   * @param height Height of rectangle
   * @param radius Corner radius
   * @returns SVG path string
   */
  private roundedRect(x: number, y: number, width: number, height: number, radius: number): string {
    return `
      M${x + radius},${y}
      h${width - 2 * radius}
      a${radius},${radius} 0 0 1 ${radius},${radius}
      v${height - 2 * radius}
      a${radius},${radius} 0 0 1 -${radius},${radius}
      h${-width + 2 * radius}
      a${radius},${radius} 0 0 1 -${radius},-${radius}
      v${-height + 2 * radius}
      a${radius},${radius} 0 0 1 ${radius},-${radius}
      z
    `;
  }

  /**
   * Initializes the SVG container for the visualization
   */
  private initializeSVG(): void {
    // Clear any existing visualization
    d3.select(this.container).selectAll('svg').remove();
    
    // Create SVG container
    const svgContainer = d3.select(this.container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('class', 'flow-diagram-visualization');
    
    // Add definitions for markers
    const defs = svgContainer.append('defs');
    
    // Arrow marker for edges
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', this.options.edgeStyle?.arrowSize || 8)
      .attr('markerHeight', this.options.edgeStyle?.arrowSize || 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', this.options.edgeStyle?.stroke || '#888888');
    
    // Create main group with margin transform
    this.svg = svgContainer.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`) as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>;
    
    // Create layers for edges and nodes
    this.edgesLayer = this.svg.append('g').attr('class', 'edges-layer');
    this.nodesLayer = this.svg.append('g').attr('class', 'nodes-layer');
    
    // Add zoom behavior if enabled
    if (this.options.zoomable) {
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 5])
        .on('zoom', (event) => {
          this.currentTransform = event.transform;
          this.svg?.attr('transform', `translate(${this.margin.left + event.transform.x},${this.margin.top + event.transform.y}) scale(${event.transform.k})`);
        });
      
      svgContainer.call(zoom as any);
    }
    
    // Add title if provided
    if (this.options.title) {
      svgContainer.append('text')
        .attr('x', (this.width + this.margin.left + this.margin.right) / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('class', 'diagram-title')
        .text(this.options.title);
    }
  }

  /**
   * Calculates node positions if automatic layout is enabled
   */
  private calculateLayout(): void {
    const { nodes, edges, direction, nodeSeparation, levelSeparation } = this.options;
    
    if (!this.options.autoLayout) {
      return; // Use provided positions
    }
    
    // Simple layered layout algorithm (similar to Sugiyama)
    
    // Step 1: Assign ranks (levels) to nodes
    const nodeMap = new Map(nodes.map(node => [node.id, { ...node, rank: -1, processed: false }]));
    const outgoingEdges = new Map<string, string[]>();
    const incomingEdges = new Map<string, string[]>();
    
    // Build edge connections maps
    edges.forEach(edge => {
      if (!outgoingEdges.has(edge.from)) {
        outgoingEdges.set(edge.from, []);
      }
      outgoingEdges.get(edge.from)!.push(edge.to);
      
      if (!incomingEdges.has(edge.to)) {
        incomingEdges.set(edge.to, []);
      }
      incomingEdges.get(edge.to)!.push(edge.from);
    });
    
    // Assign ranks through topological sort
    // First find source nodes (no incoming edges)
    const sourceNodes = nodes.filter(node => !incomingEdges.has(node.id) || incomingEdges.get(node.id)!.length === 0);
    
    // Assign rank 0 to source nodes
    sourceNodes.forEach(node => {
      const nodeInfo = nodeMap.get(node.id)!;
      nodeInfo.rank = 0;
      nodeInfo.processed = true;
    });
    
    // Propagate ranks to other nodes
    let done = false;
    while (!done) {
      done = true;
      for (const edge of edges) {
        const sourceNode = nodeMap.get(edge.from)!;
        const targetNode = nodeMap.get(edge.to)!;
        
        if (sourceNode.processed && !targetNode.processed) {
          targetNode.rank = sourceNode.rank + 1;
          targetNode.processed = true;
          done = false;
        }
      }
    }
    
    // Handle unprocessed nodes (disconnected)
    nodes.forEach(node => {
      const nodeInfo = nodeMap.get(node.id)!;
      if (!nodeInfo.processed) {
        nodeInfo.rank = 0;
        nodeInfo.processed = true;
      }
    });
    
    // Step 2: Assign positions based on ranks
    const rankToNodes = new Map<number, any[]>();
    
    // Group nodes by rank
    for (const [id, nodeInfo] of nodeMap.entries()) {
      if (!rankToNodes.has(nodeInfo.rank)) {
        rankToNodes.set(nodeInfo.rank, []);
      }
      rankToNodes.get(nodeInfo.rank)!.push(nodeInfo);
    }
    
    // Sort ranks
    const ranks = Array.from(rankToNodes.keys()).sort((a, b) => a - b);
    
    // Calculate node positions based on direction
    const isHorizontal = direction === 'LR' || direction === 'RL';
    const isReversed = direction === 'RL' || direction === 'BT';
    
    const defaultWidth = 120;
    const defaultHeight = 60;
    
    // Calculate position for each rank
    ranks.forEach((rank, rankIndex) => {
      const nodesInRank = rankToNodes.get(rank)!;
      
      // Position nodes within the same rank
      nodesInRank.forEach((nodeInfo, nodeIndex) => {
        const nodeWidth = nodeInfo.width || defaultWidth;
        const nodeHeight = nodeInfo.height || defaultHeight;
        
        if (isHorizontal) {
          // For horizontal layouts (LR, RL)
          const x = isReversed 
            ? this.width - (rankIndex * (levelSeparation || 100) + nodeWidth)
            : rankIndex * (levelSeparation || 100);
            
          const y = nodeIndex * (nodeSeparation || 50 + nodeHeight);
          
          nodeInfo.position = { x, y };
        } else {
          // For vertical layouts (TB, BT)
          const x = nodeIndex * (nodeSeparation || 50 + nodeWidth);
          
          const y = isReversed
            ? this.height - (rankIndex * (levelSeparation || 100) + nodeHeight)
            : rankIndex * (levelSeparation || 100);
            
          nodeInfo.position = { x, y };
        }
      });
    });
    
    // Update node positions in the original data
    for (const node of nodes) {
      const nodeInfo = nodeMap.get(node.id)!;
      node.position = nodeInfo.position;
    }
  }

  /**
   * Renders the flow diagram nodes
   */
  private renderNodes(): void {
    if (!this.nodesLayer) return;
    
    const { nodes } = this.options;
    
    // Default node dimensions
    const defaultWidth = 120;
    const defaultHeight = 60;
    
    // Create node elements
    const nodeElements = this.nodesLayer.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('data-id', d => d.id)
      .attr('transform', d => `translate(${d.position?.x || 0}, ${d.position?.y || 0})`)
      .classed('draggable', this.options.draggable);
    
    // Add node shapes based on type
    nodeElements.each((d, i, elements) => {
      const node = d3.select(elements[i]);
      const width = d.width || defaultWidth;
      const height = d.height || defaultHeight;
      
      // Get style based on node type
      let style;
      switch (d.type) {
        case 'process': style = this.options.processNodeStyle; break;
        case 'decision': style = this.options.decisionNodeStyle; break;
        case 'start': style = this.options.startNodeStyle; break;
        case 'end': style = this.options.endNodeStyle; break;
        case 'io': style = this.options.ioNodeStyle; break;
        default: style = this.options.processNodeStyle;
      }
      
      // Create shape path
      const shapeFn = this.nodeShapes[d.type] || this.nodeShapes.process;
      
      node.append('path')
        .attr('d', shapeFn(width, height))
        .attr('fill', style?.fill || '#ffffff')
        .attr('stroke', style?.stroke || '#000000')
        .attr('stroke-width', style?.strokeWidth || 1);
      
      // Add label
      node.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', style?.textColor || '#000000')
        .text(d.label);
      
      // Make nodes draggable if enabled
      if (this.options.draggable) {
        this.makeNodeDraggable(node);
      }
    });
  }

  /**
   * Makes a node draggable
   * @param node D3 selection of the node element
   */
  private makeNodeDraggable(node: d3.Selection<d3.BaseType, any, d3.BaseType, any>): void {
    // Create drag behavior
    const drag = d3.drag<any, any>()
      .on('start', (event, d) => {
        // Raise this node to the top
        node.raise();
      })
      .on('drag', (event, d) => {
        // Calculate new position
        let newX = d.position.x + event.dx;
        let newY = d.position.y + event.dy;
        
        // Snap to grid if enabled
        if (this.options.snapToGrid && this.options.gridSize) {
          const gridSize = this.options.gridSize;
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }
        
        // Update position
        d.position.x = newX;
        d.position.y = newY;
        
        // Update node position
        node.attr('transform', `translate(${newX}, ${newY})`);
        
        // Update connected edges
        this.updateEdgesForNode(d.id);
      });
    
    // Apply drag behavior
    node.call(drag as any);
  }

  /**
   * Updates the positions of edges connected to a specific node
   * @param nodeId ID of the node that was moved
   */
  private updateEdgesForNode(nodeId: string): void {
    if (!this.edgesLayer) return;
    
    const { edges } = this.options;
    
    // Find all edges connected to this node
    const connectedEdges = edges.filter(edge => edge.from === nodeId || edge.to === nodeId);
    
    // Update each connected edge
    connectedEdges.forEach(edge => {
      const edgeElement = this.edgesLayer!.select(`.edge[data-id="${edge.from}-${edge.to}"]`);
      const path = edgeElement.select('path');
      const sourceNode = this.options.nodes.find(n => n.id === edge.from);
      const targetNode = this.options.nodes.find(n => n.id === edge.to);
      
      if (sourceNode && targetNode && sourceNode.position && targetNode.position) {
        // Calculate new path
        const sourceX = sourceNode.position.x + (sourceNode.width || 120) / 2;
        const sourceY = sourceNode.position.y + (sourceNode.height || 60) / 2;
        const targetX = targetNode.position.x + (targetNode.width || 120) / 2;
        const targetY = targetNode.position.y + (targetNode.height || 60) / 2;
        
        const pathData = this.calculateEdgePath(
          sourceX, sourceY, 
          targetX, targetY,
          sourceNode.type, targetNode.type,
          sourceNode.width || 120, sourceNode.height || 60,
          targetNode.width || 120, targetNode.height || 60
        );
        
        // Update the path
        path.attr('d', pathData);
        
        // Update label position if present
        const label = edgeElement.select('text');
        if (!label.empty()) {
          // Position label at midpoint of the edge
          const midX = (sourceX + targetX) / 2;
          const midY = (sourceY + targetY) / 2;
          label.attr('x', midX).attr('y', midY - 5);
        }
      }
    });
  }

  /**
   * Renders the flow diagram edges
   */
  private renderEdges(): void {
    if (!this.edgesLayer) return;
    
    const { edges, nodes } = this.options;
    
    // Create edge elements
    const edgeElements = this.edgesLayer.selectAll('.edge')
      .data(edges)
      .enter()
      .append('g')
      .attr('class', 'edge')
      .attr('data-id', d => `${d.from}-${d.to}`);
    
    // Add paths and labels
    edgeElements.each((d, i, elements) => {
      const edge = d3.select(elements[i]);
      const sourceNode = nodes.find(n => n.id === d.from);
      const targetNode = nodes.find(n => n.id === d.to);
      
      if (sourceNode && targetNode && sourceNode.position && targetNode.position) {
        // Calculate source and target centers
        const sourceX = sourceNode.position.x + (sourceNode.width || 120) / 2;
        const sourceY = sourceNode.position.y + (sourceNode.height || 60) / 2;
        const targetX = targetNode.position.x + (targetNode.width || 120) / 2;
        const targetY = targetNode.position.y + (targetNode.height || 60) / 2;
        
        // Calculate the path
        const pathData = this.calculateEdgePath(
          sourceX, sourceY, 
          targetX, targetY,
          sourceNode.type, targetNode.type,
          sourceNode.width || 120, sourceNode.height || 60,
          targetNode.width || 120, targetNode.height || 60
        );
        
        // Add edge path
        edge.append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', this.options.edgeStyle?.stroke || '#888888')
          .attr('stroke-width', this.options.edgeStyle?.strokeWidth || 2)
          .attr('marker-end', 'url(#arrow)')
          .attr('stroke-dasharray', d.style === 'dashed' ? '5,5' : 
                                  d.style === 'dotted' ? '2,2' : null);
        
        // Add edge label if provided
        if (d.label) {
          // Position label at midpoint of the edge
          const midX = (sourceX + targetX) / 2;
          const midY = (sourceY + targetY) / 2;
          
          edge.append('text')
            .attr('x', midX)
            .attr('y', midY - 5)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', this.options.edgeStyle?.textColor || '#333333')
            .attr('font-size', '12px')
            .text(d.label);
        }
      }
    });
  }

  /**
   * Calculates the path for an edge between two nodes
   * @param sourceX Source X coordinate
   * @param sourceY Source Y coordinate
   * @param targetX Target X coordinate
   * @param targetY Target Y coordinate
   * @param sourceType Type of source node
   * @param targetType Type of target node
   * @param sourceWidth Width of source node
   * @param sourceHeight Height of source node
   * @param targetWidth Width of target node
   * @param targetHeight Height of target node
   * @returns SVG path string
   */
  private calculateEdgePath(
    sourceX: number, sourceY: number,
    targetX: number, targetY: number,
    sourceType: string, targetType: string,
    sourceWidth: number, sourceHeight: number,
    targetWidth: number, targetHeight: number
  ): string {
    // Calculate direction vector
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return ''; // Can't draw an edge to itself
    
    // Normalized direction
    const normX = dx / distance;
    const normY = dy / distance;
    
    // Find intersection points with node shapes
    // For simplicity, we'll use a simple approximation based on node dimensions
    // This could be improved with actual intersection calculations for complex shapes
    
    // Source node edge
    const sourceOffsetX = (sourceWidth / 2) * Math.abs(normX);
    const sourceOffsetY = (sourceHeight / 2) * Math.abs(normY);
    const sourceEdgeX = sourceX + (normX >= 0 ? sourceOffsetX : -sourceOffsetX);
    const sourceEdgeY = sourceY + (normY >= 0 ? sourceOffsetY : -sourceOffsetY);
    
    // Target node edge
    const targetOffsetX = (targetWidth / 2) * Math.abs(normX);
    const targetOffsetY = (targetHeight / 2) * Math.abs(normY);
    const targetEdgeX = targetX - (normX >= 0 ? targetOffsetX : -targetOffsetX);
    const targetEdgeY = targetY - (normY >= 0 ? targetOffsetY : -targetOffsetY);
    
    // Check the flow direction to determine path shape
    switch (this.options.direction) {
      case 'TB':
      case 'BT':
        // For vertical flow, use curved paths for non-vertical edges
        if (Math.abs(normX) > 0.2) {
          const cp1x = sourceEdgeX;
          const cp1y = targetEdgeY;
          return `M${sourceEdgeX},${sourceEdgeY} C${cp1x},${cp1y} ${cp1x},${cp1y} ${targetEdgeX},${targetEdgeY}`;
        }
        break;
        
      case 'LR':
      case 'RL':
        // For horizontal flow, use curved paths for non-horizontal edges
        if (Math.abs(normY) > 0.2) {
          const cp1x = targetEdgeX;
          const cp1y = sourceEdgeY;
          return `M${sourceEdgeX},${sourceEdgeY} C${cp1x},${cp1y} ${cp1x},${cp1y} ${targetEdgeX},${targetEdgeY}`;
        }
        break;
    }
    
    // Default to straight line for edges that align with the flow direction
    return `M${sourceEdgeX},${sourceEdgeY} L${targetEdgeX},${targetEdgeY}`;
  }

  /**
   * Sets up responsive behavior for the visualization
   */
  private setupResponsiveBehavior(): void {
    if (!this.options.responsive) return;
    
    const resizeObserver = new ResizeObserver(() => {
      // Update dimensions
      this.width = this.container.clientWidth - this.margin.left - this.margin.right;
      this.height = Math.max(300, this.container.clientHeight - this.margin.top - this.margin.bottom);
      
      // Redraw visualization
      this.render();
    });
    
    resizeObserver.observe(this.container);
  }

  /**
   * Renders the flow diagram visualization
   */
  public render(): void {
    // Calculate layout if automatic layout is enabled
    if (this.options.autoLayout) {
      this.calculateLayout();
    }
    
    // Initialize SVG container
    this.initializeSVG();
    
    // Render edges first (so they're below nodes)
    this.renderEdges();
    
    // Render nodes
    this.renderNodes();
    
    // Fit to container if enabled
    if (this.options.fitToContainer) {
      this.fitToContainer();
    }
    
    // Set up responsive behavior
    this.setupResponsiveBehavior();
    
    // Add mini-map if enabled
    if (this.options.showMiniMap) {
      this.createMiniMap();
    }
  }

  /**
   * Creates a mini-map for navigation
   */
  private createMiniMap(): void {
    if (!this.svg) return;
    
    const miniMapWidth = 150;
    const miniMapHeight = 100;
    const padding = 5;
    
    // Create mini-map container
    const miniMap = d3.select(this.container).select('svg')
      .append('g')
      .attr('class', 'mini-map')
      .attr('transform', `translate(${this.width + this.margin.left - miniMapWidth - padding}, ${padding})`);
    
    // Add background
    miniMap.append('rect')
      .attr('width', miniMapWidth)
      .attr('height', miniMapHeight)
      .attr('fill', '#f5f5f5')
      .attr('stroke', '#cccccc')
      .attr('stroke-width', 1);
    
    // Clone and scale down the diagram
    // This is a simplified representation, not a fully interactive mini-map
    
    // Calculate bounds of the full diagram
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.options.nodes.forEach(node => {
      if (!node.position) return;
      
      const x1 = node.position.x;
      const y1 = node.position.y;
      const x2 = x1 + (node.width || 120);
      const y2 = y1 + (node.height || 60);
      
      minX = Math.min(minX, x1);
      minY = Math.min(minY, y1);
      maxX = Math.max(maxX, x2);
      maxY = Math.max(maxY, y2);
    });
    
    // Calculate scale factor to fit in mini-map
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    const scaleX = (miniMapWidth - 10) / diagramWidth;
    const scaleY = (miniMapHeight - 10) / diagramHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Create mini nodes
    miniMap.append('g')
      .selectAll('.mini-node')
      .data(this.options.nodes)
      .enter()
      .append('rect')
      .attr('x', d => (d.position?.x || 0 - minX) * scale + 5)
      .attr('y', d => (d.position?.y || 0 - minY) * scale + 5)
      .attr('width', d => (d.width || 120) * scale)
      .attr('height', d => (d.height || 60) * scale)
      .attr('fill', d => {
        switch (d.type) {
          case 'process': return this.options.processNodeStyle?.fill || '#4285F4';
          case 'decision': return this.options.decisionNodeStyle?.fill || '#FBBC05';
          case 'start': return this.options.startNodeStyle?.fill || '#34A853';
          case 'end': return this.options.endNodeStyle?.fill || '#EA4335';
          case 'io': return this.options.ioNodeStyle?.fill || '#8AB4F8';
          default: return '#4285F4';
        }
      });
  }

  /**
   * Fits the diagram to the container
   */
  private fitToContainer(): void {
    if (!this.svg) return;
    
    // Calculate bounds of the diagram
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.options.nodes.forEach(node => {
      if (!node.position) return;
      
      const x1 = node.position.x;
      const y1 = node.position.y;
      const x2 = x1 + (node.width || 120);
      const y2 = y1 + (node.height || 60);
      
      minX = Math.min(minX, x1);
      minY = Math.min(minY, y1);
      maxX = Math.max(maxX, x2);
      maxY = Math.max(maxY, y2);
    });
    
    // Calculate padding
    const padding = 40;
    
    // Calculate scale factor to fit in container
    const diagramWidth = maxX - minX + padding * 2;
    const diagramHeight = maxY - minY + padding * 2;
    const scaleX = this.width / diagramWidth;
    const scaleY = this.height / diagramHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1
    
    // Apply transform to fit
    if (scale < 1) {
      this.svg.attr('transform', `translate(${this.margin.left - minX * scale + padding},${this.margin.top - minY * scale + padding}) scale(${scale})`);
    } else {
      // Center the diagram
      const centerX = (this.width - diagramWidth) / 2;
      const centerY = (this.height - diagramHeight) / 2;
      this.svg.attr('transform', `translate(${this.margin.left - minX + centerX + padding},${this.margin.top - minY + centerY + padding})`);
    }
  }

  /**
   * Highlights a specific node in the diagram
   * @param nodeId ID of the node to highlight
   */
  public highlightNode(nodeId: string): void {
    if (!this.nodesLayer) return;
    
    // Reset all nodes to normal
    this.nodesLayer.selectAll('.node path')
      .style('stroke-width', d => {
        const nodeType = (d as any).type;
        switch (nodeType) {
          case 'process': return this.options.processNodeStyle?.strokeWidth || 2;
          case 'decision': return this.options.decisionNodeStyle?.strokeWidth || 2;
          case 'start': return this.options.startNodeStyle?.strokeWidth || 2;
          case 'end': return this.options.endNodeStyle?.strokeWidth || 2;
          case 'io': return this.options.ioNodeStyle?.strokeWidth || 2;
          default: return 2;
        }
      })
      .style('stroke-opacity', 1);
    
    // Highlight the selected node
    this.nodesLayer.select(`.node[data-id="${nodeId}"] path`)
      .style('stroke-width', 4)
      .style('stroke', '#ff6600')
      .style('stroke-opacity', 1);
    
    // Bring node to front
    this.nodesLayer.select(`.node[data-id="${nodeId}"]`).raise();
  }

  /**
   * Highlights a specific path through the diagram
   * @param nodeIds Array of node IDs that form a path
   */
  public highlightPath(nodeIds: string[]): void {
    if (!this.nodesLayer || !this.edgesLayer || nodeIds.length < 2) return;
    
    // Reset all nodes and edges to normal
    this.nodesLayer.selectAll('.node path')
      .style('stroke-width', d => {
        const nodeType = (d as any).type;
        switch (nodeType) {
          case 'process': return this.options.processNodeStyle?.strokeWidth || 2;
          case 'decision': return this.options.decisionNodeStyle?.strokeWidth || 2;
          case 'start': return this.options.startNodeStyle?.strokeWidth || 2;
          case 'end': return this.options.endNodeStyle?.strokeWidth || 2;
          case 'io': return this.options.ioNodeStyle?.strokeWidth || 2;
          default: return 2;
        }
      })
      .style('stroke-opacity', 0.5);
    
    this.edgesLayer.selectAll('.edge path')
      .style('stroke-width', this.options.edgeStyle?.strokeWidth || 2)
      .style('stroke-opacity', 0.3);
    
    // Highlight nodes in the path
    for (const nodeId of nodeIds) {
      this.nodesLayer.select(`.node[data-id="${nodeId}"] path`)
        .style('stroke-width', 3)
        .style('stroke', '#ff6600')
        .style('stroke-opacity', 1);
    }
    
    // Highlight edges in the path
    for (let i = 0; i < nodeIds.length - 1; i++) {
      const fromId = nodeIds[i];
      const toId = nodeIds[i + 1];
      
      this.edgesLayer.select(`.edge[data-id="${fromId}-${toId}"] path`)
        .style('stroke-width', 3)
        .style('stroke', '#ff6600')
        .style('stroke-opacity', 1);
    }
  }

  /**
   * Updates the diagram data and rerenders
   * @param nodes New node data
   * @param edges New edge data
   */
  public updateData(nodes: Array<{
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start' | 'end' | 'io';
    position?: { x: number; y: number };
  }>, edges: Array<{
    from: string;
    to: string;
    label?: string;
  }>): void {
    this.options.nodes = nodes;
    this.options.edges = edges;
    this.render();
  }

  /**
   * Updates visualization options and reapplies them
   * @param options New visualization options
   */
  public updateOptions(options: Partial<FlowDiagramVisualizationOptions>): void {
    this.options = { ...this.options, ...options };
    this.render();
  }

  /**
   * Exports the current diagram as an SVG string
   * @returns SVG markup as a string
   */
  public exportSVG(): string {
    const svgElement = this.container.querySelector('svg');
    if (!svgElement) return '';
    
    // Clone the SVG to avoid modifying the displayed one
    const clone = svgElement.cloneNode(true) as SVGElement;
    
    // Add any required CSS inline for export
    const styles = document.createElement('style');
    styles.textContent = `
      .flow-diagram-visualization text {
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      .node text {
        font-weight: bold;
      }
      .edge path {
        fill: none;
      }
    `;
    
    clone.insertBefore(styles, clone.firstChild);
    
    return new XMLSerializer().serializeToString(clone);
  }

  /**
   * Destroys the visualization and cleans up resources
   */
  public destroy(): void {
    // Remove SVG
    d3.select(this.container).selectAll('svg').remove();
    
    // Remove any event listeners or resize observers
    // (Implementation would depend on specific setup)
  }
}