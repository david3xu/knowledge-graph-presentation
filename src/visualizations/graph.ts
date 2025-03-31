/**
 * Graph Visualization Component
 * Renders interactive knowledge graph visualizations with nodes and edges
 */
import { GraphVisualizationOptions } from '../types/chart-config';
import { GraphData, NodeStyle, EdgeStyle } from '../types/graph-data';
import * as d3 from 'd3';

export class GraphVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private simulation!: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>;
  private nodesGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private edgesGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private nodeElements!: d3.Selection<SVGCircleElement | SVGRectElement | SVGPolygonElement, any, SVGGElement, unknown>;
  private edgeElements!: d3.Selection<SVGLineElement, any, SVGGElement, unknown>;
  private labelElements!: d3.Selection<SVGTextElement, any, SVGGElement, unknown>;
  private data: GraphData;
  private width: number;
  private height: number;
  private options: GraphVisualizationOptions;
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private highlightedNodes: Set<string> = new Set();
  private highlightedEdges: Set<string> = new Set();
  
  /**
   * Creates a new graph visualization
   * @param options Visualization options
   */
  constructor(options: GraphVisualizationOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    this.data = this.preprocessData(options.data);
    this.options = this.initializeOptions(options);
    
    // Initialize the visualization
    this.initializeVisualization();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: GraphVisualizationOptions): GraphVisualizationOptions {
    // Default node style
    const defaultNodeStyle: NodeStyle = {
      color: options.nodeColor || '#4C9AFF',
      borderColor: '#ffffff',
      borderWidth: 2,
      shape: 'circle',
      size: 30,
      opacity: 0.9,
      fontSize: 12,
      fontColor: '#172B4D',
      labelPosition: 'bottom'
    };
    
    // Default edge style
    const defaultEdgeStyle: EdgeStyle = {
      color: options.edgeColor || '#6B778C',
      width: 2,
      lineStyle: 'solid',
      opacity: 0.7,
      arrowShape: 'triangle',
      fontSize: 10,
      fontColor: '#6B778C'
    };
    
    // Default layout
    const defaultLayout = {
      name: 'force',
      padding: 30,
      nodeSpacing: 50,
      edgeLength: 100,
      ...options.layout
    };
    
    // Merge defaults with provided options
    return {
      ...options,
      nodeStyle: { ...defaultNodeStyle, ...options.nodeStyle },
      edgeStyle: { ...defaultEdgeStyle, ...options.edgeStyle },
      layout: defaultLayout,
      physics: options.physics !== false,
      draggable: options.draggable !== false,
      zoomable: options.zoomable !== false,
      initialZoom: options.initialZoom || 1,
      minZoom: options.minZoom || 0.1,
      maxZoom: options.maxZoom || 3
    };
  }
  
  /**
   * Preprocess graph data for visualization
   * @param data Raw graph data
   */
  private preprocessData(data: GraphData): GraphData {
    // Clone the data to avoid mutations
    const processedData: GraphData = JSON.parse(JSON.stringify(data));
    
    // Ensure all nodes have the required properties
    processedData.nodes = processedData.nodes.map(node => ({
      ...node,
      // Add default label if not provided
      label: node.label || node.id,
      // Initialize position if not provided
      x: node.x ?? 0,
      y: node.y ?? 0
    }));
    
    // Ensure all edges have the required properties
    processedData.edges = processedData.edges.map((edge, index) => ({
      ...edge,
      // Add default ID if not provided
      id: edge.id || `edge-${index}`,
      // Default to directed edges
      directed: edge.directed === undefined ? true : edge.directed
    }));
    
    return processedData;
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
      .attr('class', 'graph-visualization')
      .attr('viewBox', [0, 0, this.width, this.height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create groups for edges and nodes
    this.edgesGroup = this.svg.append('g').attr('class', 'edges');
    this.nodesGroup = this.svg.append('g').attr('class', 'nodes');
    
    // Initialize zoom behavior
    if (this.options.zoomable) {
      this.zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([this.options.minZoom!, this.options.maxZoom!])
        .on('zoom', (event) => {
          this.edgesGroup.attr('transform', event.transform.toString());
          this.nodesGroup.attr('transform', event.transform.toString());
        });
      
      this.svg.call(this.zoom as any);
      
      // Set initial zoom level
      if (this.options.initialZoom !== 1) {
        this.svg.call(
          this.zoom.transform,
          d3.zoomIdentity.scale(this.options.initialZoom!)
        );
      }
    }
    
    // Initialize tooltip
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '6px')
      .style('pointer-events', 'none')
      .style('z-index', '10');
    
    // Initialize force simulation
    this.initializeForceSimulation();
    
    // Render the visualization
    this.render();
  }
  
  /**
   * Initialize force simulation for graph layout
   */
  private initializeForceSimulation(): void {
    // Create force simulation
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>()
        .id((d: any) => d.id)
        .distance(this.options.layout?.edgeLength || 100))
      .force('charge', d3.forceManyBody()
        .strength(-200))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collide', d3.forceCollide()
        .radius((d: any) => this.getNodeSize(d) + 10));
    
    // Configure physics based on options
    if (!this.options.physics) {
      this.simulation.alpha(0).stop();
    }
  }
  
  /**
   * Render the graph visualization
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
    
    // Update force center
    this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
    
    // Render edges
    this.renderEdges();
    
    // Render nodes
    this.renderNodes();
    
    // Update simulation
    this.simulation
      .nodes(this.data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>(
        this.data.edges as d3.SimulationLinkDatum<d3.SimulationNodeDatum>[]
      ).id((d: any) => d.id)
        .distance(this.options.layout?.edgeLength || 100));
    
    // Restart simulation if physics is enabled
    if (this.options.physics) {
      this.simulation.alpha(0.3).restart();
    }
  }
  
  /**
   * Render graph edges
   */
  private renderEdges(): void {
    // Bind edge data
    this.edgeElements = this.edgesGroup
      .selectAll<SVGLineElement, any>('line')
      .data(this.data.edges, (d: any) => d.id);
    
    // Remove old edges
    this.edgeElements.exit().remove();
    
    // Create new edges
    const enterEdges = this.edgeElements
      .enter()
      .append('line')
      .attr('class', 'edge')
      .attr('id', (d: any) => `edge-${d.id}`);
    
    // Update all edges
    this.edgeElements = enterEdges.merge(this.edgeElements as any)
      .attr('stroke', (d: any) => this.getEdgeColor(d))
      .attr('stroke-width', (d: any) => this.getEdgeWidth(d))
      .attr('stroke-dasharray', (d: any) => this.getEdgeStyle(d))
      .attr('opacity', (d: any) => this.getEdgeOpacity(d))
      .attr('marker-end', (d: any) => d.directed ? 'url(#arrow)' : null);
    
    // Add arrow marker for directed edges
    if (!this.svg.select('defs').size()) {
      const defs = this.svg.append('defs');
      
      defs.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', 0)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', this.options.edgeStyle?.color || '#6B778C');
    }
    
    // Add tooltips and click handlers
    if (this.options.tooltips) {
      this.edgeElements
        .on('mouseover', (event, d: any) => this.showEdgeTooltip(event, d))
        .on('mouseout', () => this.hideTooltip());
    }
    
    if (this.options.onClick) {
      this.edgeElements.on('click', (event, d: any) => {
        if (this.options.onClick) {
          this.options.onClick({ event, type: 'edge', data: d });
        }
      });
    }
    
    // Update edge positions on simulation tick
    this.simulation.on('tick', () => {
      this.edgeElements
        .attr('x1', (d: any) => (d.source as any).x)
        .attr('y1', (d: any) => (d.source as any).y)
        .attr('x2', (d: any) => (d.target as any).x)
        .attr('y2', (d: any) => (d.target as any).y);
      
      if (this.nodeElements) {
        this.nodeElements
          .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      }
      
      if (this.labelElements) {
        this.labelElements
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y + this.getNodeSize(d) + 12);
      }
    });
  }
  
  /**
   * Render graph nodes
   */
  private renderNodes(): void {
    // Create node groups
    const nodeGroups = this.nodesGroup
      .selectAll<SVGGElement, any>('g.node')
      .data(this.data.nodes, (d: any) => d.id);
    
    // Remove old nodes
    nodeGroups.exit().remove();
    
    // Create new node groups
    const enterGroups = nodeGroups
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', (d: any) => `node-${d.id}`);
    
    // Add drag behavior if enabled
    if (this.options.draggable) {
      const dragBehavior = d3.drag<SVGGElement, any>()
        .on('start', (event, d: any) => {
          if (!event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) this.simulation.alphaTarget(0);
          if (!this.options.physics) {
            d.x = event.x;
            d.y = event.y;
          } else {
            d.fx = null;
            d.fy = null;
          }
        });
      
      enterGroups.call(dragBehavior);
    }
    
    // Add node shapes based on node type
    enterGroups.each((d: any, i, nodes) => {
      const nodeGroup = d3.select(nodes[i]);
      const shape = this.getNodeShape(d);
      const size = this.getNodeSize(d);
      
      switch (shape) {
        case 'circle':
          nodeGroup.append('circle')
            .attr('r', size / 2);
          break;
          
        case 'rectangle':
          nodeGroup.append('rect')
            .attr('width', size)
            .attr('height', size * 0.8)
            .attr('x', -size / 2)
            .attr('y', -size * 0.4)
            .attr('rx', 3)
            .attr('ry', 3);
          break;
          
        case 'diamond':
          nodeGroup.append('polygon')
            .attr('points', `0,-${size/2} ${size/2},0 0,${size/2} -${size/2},0`);
          break;
          
        case 'triangle':
          nodeGroup.append('polygon')
            .attr('points', `0,-${size/2} ${size/2},${size/2} -${size/2},${size/2}`);
          break;
          
        case 'hexagon':
          const hexPoints: [number, number][] = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            hexPoints.push([
              size / 2 * Math.sin(angle),
              -size / 2 * Math.cos(angle)
            ]);
          }
          nodeGroup.append('polygon')
            .attr('points', hexPoints.map(p => p.join(',')).join(' '));
          break;
          
        default:
          nodeGroup.append('circle')
            .attr('r', size / 2);
      }
    });
    
    // Merge node groups
    const allGroups = enterGroups.merge(nodeGroups);
    
    // Select all node shape elements
    this.nodeElements = allGroups.selectAll<SVGCircleElement | SVGRectElement | SVGPolygonElement, any>('circle, rect, polygon');
    
    // Update node styles
    this.nodeElements
      .attr('fill', (d: any) => this.getNodeColor(d))
      .attr('stroke', (d: any) => this.getNodeBorderColor(d))
      .attr('stroke-width', (d: any) => this.getNodeBorderWidth(d))
      .attr('opacity', (d: any) => this.getNodeOpacity(d))
      .classed('highlight', (d: any) => this.highlightedNodes.has(d.id));
    
    // Add node labels
    this.labelElements = this.nodesGroup
      .selectAll<SVGTextElement, any>('text.node-label')
      .data(this.data.nodes, (d: any) => d.id);
    
    this.labelElements.exit().remove();
    
    const enterTexts = this.labelElements
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text((d: any) => d.label || d.id);
    
    this.labelElements = enterTexts.merge(this.labelElements)
      .attr('font-size', () => this.options.nodeStyle?.fontSize || 12)
      .attr('fill', () => this.options.nodeStyle?.labelColor || '#172B4D');
    
    // Add tooltips and click handlers
    if (this.options.tooltips) {
      this.nodeElements
        .on('mouseover', (event, d: any) => this.showNodeTooltip(event, d))
        .on('mouseout', () => this.hideTooltip());
    }
    
    if (this.options.onClick) {
      this.nodeElements.on('click', (event, d: any) => {
        if (this.options.onClick) {
          this.options.onClick({ event, type: 'node', data: d });
        }
      });
    }
  }
  
  /**
   * Show tooltip for a node
   * @param event Mouse event
   * @param node Node data
   */
  private showNodeTooltip(event: any, node: any): void {
    let tooltipContent = `<div><strong>${node.label || node.id}</strong></div>`;
    
    if (node.type) {
      tooltipContent += `<div>Type: ${node.type}</div>`;
    }
    
    if (node.properties) {
      const propertyList = Object.entries(node.properties)
        .filter(([, value]) => typeof value !== 'object' && value !== undefined)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join('');
      
      if (propertyList) {
        tooltipContent += `<ul style="margin:5px 0;padding-left:20px;">${propertyList}</ul>`;
      }
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
  private showEdgeTooltip(event: any, edge: any): void {
    let tooltipContent = `<div><strong>${edge.label || `${edge.source.id} → ${edge.target.id}`}</strong></div>`;
    
    if (edge.properties) {
      const propertyList = Object.entries(edge.properties)
        .filter(([, value]) => typeof value !== 'object' && value !== undefined)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join('');
      
      if (propertyList) {
        tooltipContent += `<ul style="margin:5px 0;padding-left:20px;">${propertyList}</ul>`;
      }
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
   * Get node color based on node data and style options
   * @param node Node data
   */
  private getNodeColor(node: any): string {
    // Check for highlighted nodes
    if (this.highlightedNodes.has(node.id)) {
      return '#FF9900'; // Highlight color
    }
    
    // Use node-specific style if available
    if (node.style?.color) {
      return node.style.color;
    }
    
    // Use node style function if available
    if (this.options.nodeStyleFunction) {
      const style = this.options.nodeStyleFunction(node);
      if (style.color) {
        return style.color;
      }
    }
    
    // Use colors based on node type
    if (node.type) {
      switch (node.type.toLowerCase()) {
        case 'entity':
        case 'person':
        case 'organization':
          return '#4C9AFF'; // Blue
        case 'concept':
        case 'class':
        case 'category':
          return '#C0B6F2'; // Purple
        case 'property':
        case 'attribute':
          return '#79E2F2'; // Light blue
        case 'event':
        case 'process':
          return '#FFC400'; // Yellow
        case 'place':
        case 'location':
          return '#57D9A3'; // Green
        case 'relationship':
        case 'relation':
          return '#FF8F73'; // Orange
      }
    }
    
    // Default to the general node style color
    return this.options.nodeStyle?.color || '#4C9AFF';
  }
  
  /**
   * Get node border color based on node data and style options
   * @param node Node data
   */
  private getNodeBorderColor(node: any): string {
    // Use node-specific style if available
    if (node.style?.borderColor) {
      return node.style.borderColor;
    }
    
    // Use node style function if available
    if (this.options.nodeStyleFunction) {
      const style = this.options.nodeStyleFunction(node);
      if (style.borderColor) {
        return style.borderColor;
      }
    }
    
    // Default to the general node style border color
    return this.options.nodeStyle?.borderColor || '#ffffff';
  }
  
  /**
   * Get node border width based on node data and style options
   * @param node Node data
   */
  private getNodeBorderWidth(node: any): number {
    // Check for highlighted nodes
    if (this.highlightedNodes.has(node.id)) {
      return (this.options.nodeStyle?.borderWidth || 2) + 1; // Increase border width for highlighted nodes
    }
    
    // Use node-specific style if available
    if (node.style?.borderWidth !== undefined) {
      return node.style.borderWidth;
    }
    
    // Use node style function if available
    if (this.options.nodeStyleFunction) {
      const style = this.options.nodeStyleFunction(node);
      if (style.borderWidth !== undefined) {
        return style.borderWidth;
      }
    }
    
    // Default to the general node style border width
    return this.options.nodeStyle?.borderWidth || 2;
  }
  
  /**
   * Get node shape based on node data and style options
   * @param node Node data
   */
  private getNodeShape(node: any): string {
    // Use node-specific style if available
    if (node.style?.shape) {
      return node.style.shape;
    }
    
    // Use node style function if available
    if (this.options.nodeStyleFunction) {
      const style = this.options.nodeStyleFunction(node);
      if (style.shape) {
        return style.shape;
      }
    }
    
    // Use shapes based on node type
    if (node.type) {
      switch (node.type.toLowerCase()) {
        case 'entity':
        case 'person':
        case 'organization':
          return 'circle';
        case 'concept':
        case 'class':
        case 'category':
          return 'hexagon';
        case 'property':
        case 'attribute':
          return 'rectangle';
        case 'relationship':
        case 'relation':
          return 'diamond';
        case 'event':
        case 'process':
          return 'triangle';
      }
    }
    
    // Default to the general node style shape
    return this.options.nodeStyle?.shape || 'circle';
  }
  
  /**
   * Get node size based on node data and style options
   * @param node Node data
   */
  private getNodeSize(node: any): number {
    // Use node-specific style if available
    if (node.style?.size !== undefined) {
      return node.style.size;
    }
    
    // Use node style function if available
    if (this.options.nodeStyleFunction) {
      const style = this.options.nodeStyleFunction(node);
      if (style.size !== undefined) {
        return style.size;
      }
    }
    
    // Default to the general node style size
    return this.options.nodeStyle?.size || 30;
  }
  
  /**
   * Get node opacity based on node data and style options
   * @param node Node data
   */
  private getNodeOpacity(node: any): number {
    // Use node-specific style if available
    if (node.style?.opacity !== undefined) {
      return node.style.opacity;
    }
    
    // Use node style function if available
    if (this.options.nodeStyleFunction) {
      const style = this.options.nodeStyleFunction(node);
      if (style.opacity !== undefined) {
        return style.opacity;
      }
    }
    
    // Default to the general node style opacity
    return this.options.nodeStyle?.opacity || 1;
  }
  
  /**
   * Get edge color based on edge data and style options
   * @param edge Edge data
   */
  private getEdgeColor(edge: any): string {
    // Check for highlighted edges
    if (this.highlightedEdges.has(edge.id)) {
      return '#FF9900'; // Highlight color
    }
    
    // Use edge-specific style if available
    if (edge.style?.color) {
      return edge.style.color;
    }
    
    // Use edge style function if available
    if (this.options.edgeStyleFunction) {
      const style = this.options.edgeStyleFunction(edge);
      if (style.color) {
        return style.color;
      }
    }
    
    // Default to the general edge style color
    return this.options.edgeStyle?.color || '#6B778C';
  }
  
  /**
   * Get edge width based on edge data and style options
   * @param edge Edge data
   */
  private getEdgeWidth(edge: any): number {
    // Check for highlighted edges
    if (this.highlightedEdges.has(edge.id)) {
      return (this.options.edgeStyle?.width || 2) + 1; // Increase width for highlighted edges
    }
    
    // Use edge-specific style if available
    if (edge.style?.width !== undefined) {
      return edge.style.width;
    }
    
    // Use edge style function if available
    if (this.options.edgeStyleFunction) {
      const style = this.options.edgeStyleFunction(edge);
      if (style.width !== undefined) {
        return style.width;
      }
    }
    
    // Use weight if available
    if (edge.weight !== undefined) {
      const baseWidth = this.options.edgeStyle?.width || 2;
      return baseWidth * Math.max(0.5, Math.min(3, edge.weight));
    }
    
    // Default to the general edge style width
    return this.options.edgeStyle?.width || 2;
  }
  
  /**
   * Get edge line style based on edge data and style options
   * @param edge Edge data
   */
  private getEdgeStyle(edge: any): string {
    // Use edge-specific style if available
    if (edge.style?.style) {
      switch (edge.style.style) {
        case 'dashed':
          return '5,5';
        case 'dotted':
          return '2,2';
        case 'solid':
        default:
          return '';
      }
    }
    
    // Use edge style function if available
    if (this.options.edgeStyleFunction) {
      const style = this.options.edgeStyleFunction(edge);
      if (style.style) {
        switch (style.style) {
          case 'dashed':
            return '5,5';
          case 'dotted':
            return '2,2';
          case 'solid':
          default:
            return '';
        }
      }
    }
    
    // Default to the general edge style
    if (this.options.edgeStyle?.style) {
      switch (this.options.edgeStyle.style) {
        case 'dashed':
          return '5,5';
        case 'dotted':
          return '2,2';
        case 'solid':
        default:
          return '';
      }
    }
    
    return '';
  }
  
  /**
   * Get edge opacity based on edge data and style options
   * @param edge Edge data
   */
  private getEdgeOpacity(edge: any): number {
    // Use edge-specific style if available
    if (edge.style?.opacity !== undefined) {
      return edge.style.opacity;
    }
    
    // Use edge style function if available
    if (this.options.edgeStyleFunction) {
      const style = this.options.edgeStyleFunction(edge);
      if (style.opacity !== undefined) {
        return style.opacity;
      }
    }
    
    // Default to the general edge style opacity
    return this.options.edgeStyle?.opacity || 0.7;
  }
  
  /**
   * Highlight specific nodes
   * @param nodeIds Array of node IDs to highlight
   */
  public highlightNodes(nodeIds: string[]): void {
    // Clear previous highlights if not appending
    this.highlightedNodes.clear();
    
    // Add new highlights
    nodeIds.forEach(id => this.highlightedNodes.add(id));
    
    // Update node styles to reflect highlights
    if (this.nodeElements) {
      this.nodeElements
        .classed('highlight', (d: any) => this.highlightedNodes.has(d.id))
        .attr('fill', (d: any) => this.getNodeColor(d))
        .attr('stroke-width', (d: any) => this.getNodeBorderWidth(d));
    }
  }
  
  /**
   * Highlight specific edges
   * @param edgeIds Array of edge IDs to highlight
   */
  public highlightEdges(edgeIds: string[]): void {
    // Clear previous highlights if not appending
    this.highlightedEdges.clear();
    
    // Add new highlights
    edgeIds.forEach(id => this.highlightedEdges.add(id));
    
    // Update edge styles to reflect highlights
    if (this.edgeElements) {
      this.edgeElements
        .classed('highlight', (d: any) => this.highlightedEdges.has(d.id))
        .attr('stroke', (d: any) => this.getEdgeColor(d))
        .attr('stroke-width', (d: any) => this.getEdgeWidth(d));
    }
  }
  
  /**
   * Clear all highlights
   */
  public clearHighlights(): void {
    this.highlightedNodes.clear();
    this.highlightedEdges.clear();
    
    // Update styles
    if (this.nodeElements) {
      this.nodeElements
        .classed('highlight', false)
        .attr('fill', (d: any) => this.getNodeColor(d))
        .attr('stroke-width', (d: any) => this.getNodeBorderWidth(d));
    }
    
    if (this.edgeElements) {
      this.edgeElements
        .classed('highlight', false)
        .attr('stroke', (d: any) => this.getEdgeColor(d))
        .attr('stroke-width', (d: any) => this.getEdgeWidth(d));
    }
  }
  
  /**
   * Update the visualization with new data
   * @param data New graph data
   */
  public updateData(data: GraphData): void {
    this.data = this.preprocessData(data);
    this.render();
  }
  
  /**
   * Update visualization options
   * @param options New options
   */
  public updateOptions(options: Partial<GraphVisualizationOptions>): void {
    this.options = this.initializeOptions({ ...this.options, ...options });
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
    this.render();
  }
  
  /**
   * Reset the view (zoom and pan)
   */
  public resetView(): void {
    if (this.zoom && this.svg) {
      this.svg.transition()
        .duration(750)
        .call(this.zoom.transform, d3.zoomIdentity);
    }
  }
  
  /**
   * Zoom to fit all nodes
   */
  public zoomToFit(): void {
    if (!this.zoom || !this.svg || !this.data.nodes.length) return;
    
    // Calculate the bounds of the graph
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.data.nodes.forEach((node: any) => {
      minX = Math.min(minX, node.x || 0);
      minY = Math.min(minY, node.y || 0);
      maxX = Math.max(maxX, node.x || 0);
      maxY = Math.max(maxY, node.y || 0);
    });
    
    // Add padding
    const padding = 50;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Calculate the scale and translation
    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.min(this.width / width, this.height / height, 2);
    const tx = -minX * scale + (this.width - width * scale) / 2;
    const ty = -minY * scale + (this.height - height * scale) / 2;
    
    // Apply the transformation
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }
  
  /**
   * Focus on a specific node
   * @param nodeId ID of the node to focus on
   */
  public focusNode(nodeId: string): void {
    const node = this.data.nodes.find(n => n.id === nodeId);
    if (!node || !this.zoom || !this.svg) return;
    
    // Calculate the transformation
    const scale = 2;
    const tx = -node.x! * scale + this.width / 2;
    const ty = -node.y! * scale + this.height / 2;
    
    // Apply the transformation
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    
    // Highlight the node
    this.highlightNodes([nodeId]);
  }
  
  /**
   * Clean up resources when the visualization is no longer needed
   */
  public destroy(): void {
    // Stop the simulation
    if (this.simulation) {
      this.simulation.stop();
    }
    
    // Remove event listeners
    if (this.nodeElements) {
      this.nodeElements.on('mouseover', null).on('mouseout', null).on('click', null);
    }
    
    if (this.edgeElements) {
      this.edgeElements.on('mouseover', null).on('mouseout', null).on('click', null);
    }
    
    // Remove zoom behavior
    if (typeof this.zoom === 'function' && this.svg) {
      this.svg.on('.zoom', null);
    }
    
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}