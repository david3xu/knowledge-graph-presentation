// /**
//  * Knowledge Graph Visualization Integration Example
//  * 
//  * This example demonstrates how the utility modules work together to create
//  * an interactive knowledge graph visualization with advanced features.
//  */
// import { GraphData, GraphNode, GraphEdge } from '../types/graph-data';
// import { filterGraph, extractSubgraph, calculateNodeSizes, applyLayout } from '../utils/graph-utils';
// import { InteractionManager, InteractionEvent } from '../utils/interactions';
// import { createHoverEffect, createTooltip } from '../utils/interactions';
// import { Timer } from '../utils/timer';
// import { enableResponsiveVisualization } from '../utils/responsive';
// import { animate, sequence, stagger, Easing } from '../utils/animation';
// import { formatNumber } from '../utils/chart-utils';
// import { highlightCode } from '../utils/code-highlighter';
// import { parseMarkdown, markdownToSlideContent } from '../utils/markdown-parser';

// /**
//  * Knowledge Graph Visualization Configuration
//  */
// interface KGVisualizationConfig {
//   /** Container element for the visualization */
//   container: HTMLElement;
  
//   /** Graph data */
//   data: GraphData;
  
//   /** Width of the visualization */
//   width?: number;
  
//   /** Height of the visualization */
//   height?: number;
  
//   /** Whether to enable zooming */
//   zoomable?: boolean;
  
//   /** Whether to enable dragging */
//   draggable?: boolean;
  
//   /** Whether to enable selection */
//   selectable?: boolean;
  
//   /** Whether to show labels */
//   showLabels?: boolean;
  
//   /** Whether to animate the initial layout */
//   animate?: boolean;
  
//   /** Layout algorithm to use */
//   layout?: 'force-directed' | 'circular' | 'grid' | 'concentric';
  
//   /** Node size strategy */
//   nodeSizeStrategy?: 'fixed' | 'degree' | 'property';
  
//   /** Node size property (if strategy is 'property') */
//   nodeSizeProperty?: string;
  
//   /** Node color property */
//   nodeColorProperty?: string;
  
//   /** Node shape property */
//   nodeShapeProperty?: string;
  
//   /** Edge width strategy */
//   edgeWidthStrategy?: 'fixed' | 'weight' | 'property';
  
//   /** Edge width property (if strategy is 'property') */
//   edgeWidthProperty?: string;
  
//   /** Default node size */
//   defaultNodeSize?: number;
  
//   /** Min node size */
//   minNodeSize?: number;
  
//   /** Max node size */
//   maxNodeSize?: number;
  
//   /** Default edge width */
//   defaultEdgeWidth?: number;
  
//   /** Callback when a node is clicked */
//   onNodeClick?: (nodeId: string, node: GraphNode) => void;
  
//   /** Callback when an edge is clicked */
//   onEdgeClick?: (edgeId: string, edge: GraphEdge) => void;
  
//   /** Callback when selection changes */
//   onSelectionChange?: (selectedNodes: string[], selectedEdges: string[]) => void;
// }

// /**
//  * Knowledge Graph Visualization class that integrates the utility modules
//  */
// export class KGVisualization {
//   private config: KGVisualizationConfig;
//   private container: HTMLElement;
//   private svg: SVGElement;
//   private nodeElements: Map<string, SVGElement> = new Map();
//   private edgeElements: Map<string, SVGElement> = new Map();
//   private labelElements: Map<string, SVGElement> = new Map();
//   private interactionManager: InteractionManager;
//   private selectedNodes: Set<string> = new Set();
//   private selectedEdges: Set<string> = new Set();
//   private transform: { scale: number; translateX: number; translateY: number } = {
//     scale: 1,
//     translateX: 0,
//     translateY: 0
//   };
//   private cleanupFunctions: Array<() => void> = [];
//   private tooltips: Map<string, () => void> = new Map();
//   private hoverEffects: Map<string, () => void> = new Map();
//   private animationTimer: Timer | null = null;
//   private width: number;
//   private height: number;
//   private resizeObserver: ResizeObserver | null = null;
  
//   /**
//    * Node shape functions
//    */
//   private static readonly NODE_SHAPES: Record<string, (x: number, y: number, size: number) => string> = {
//     circle: (x, y, size) => `M${x},${y} m-${size/2},0 a${size/2},${size/2} 0 1,0 ${size},0 a${size/2},${size/2} 0 1,0 -${size},0`,
//     square: (x, y, size) => `M${x-size/2},${y-size/2} h${size} v${size} h-${size} z`,
//     diamond: (x, y, size) => `M${x},${y-size/2} L${x+size/2},${y} L${x},${y+size/2} L${x-size/2},${y} Z`,
//     triangle: (x, y, size) => `M${x},${y-size/2} L${x+size/2},${y+size/4} L${x-size/2},${y+size/4} Z`,
//     hexagon: (x, y, size) => {
//       const s = size / 2;
//       const h = s * Math.sqrt(3) / 2;
//       return `M${x},${y-s} L${x+h},${y-s/2} L${x+h},${y+s/2} L${x},${y+s} L${x-h},${y+s/2} L${x-h},${y-s/2} Z`;
//     }
//   };
  
//   /**
//    * Node color map for different node types
//    */
//   private static readonly NODE_COLORS: Record<string, string> = {
//     Entity: '#4C9AFF',
//     Concept: '#C0B6F2',
//     Event: '#FF8F73',
//     Process: '#FFC400',
//     Property: '#79E2F2',
//     Relationship: '#57D9A3',
//     default: '#999999'
//   };
  
//   /**
//    * Constructor
//    * @param config Visualization configuration
//    */
//   constructor(config: KGVisualizationConfig) {
//     this.config = {
//       ...{
//         width: 800,
//         height: 600,
//         zoomable: true,
//         draggable: true,
//         selectable: true,
//         showLabels: true,
//         animate: true,
//         layout: 'force-directed',
//         nodeSizeStrategy: 'degree',
//         edgeWidthStrategy: 'fixed',
//         defaultNodeSize: 20,
//         minNodeSize: 10,
//         maxNodeSize: 40,
//         defaultEdgeWidth: 2
//       },
//       ...config
//     };
    
//     this.container = config.container;
//     this.width = this.config.width || 800;
//     this.height = this.config.height || 600;
    
//     // Set container size if not already set
//     if (!this.container.style.width) {
//       this.container.style.width = `${this.width}px`;
//     }
    
//     if (!this.container.style.height) {
//       this.container.style.height = `${this.height}px`;
//     }
    
//     // Create SVG element
//     this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     this.svg.setAttribute('width', '100%');
//     this.svg.setAttribute('height', '100%');
//     this.svg.setAttribute('class', 'kg-visualization');
//     this.container.appendChild(this.svg);
    
//     // Create layers
//     const edgesLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//     edgesLayer.setAttribute('class', 'edges-layer');
    
//     const nodesLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//     nodesLayer.setAttribute('class', 'nodes-layer');
    
//     const labelsLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//     labelsLayer.setAttribute('class', 'labels-layer');
    
//     this.svg.appendChild(edgesLayer);
//     this.svg.appendChild(nodesLayer);
//     this.svg.appendChild(labelsLayer);
    
//     // Set up interaction manager
//     this.interactionManager = new InteractionManager(this.container, {
//       enabled: true,
//       dragThreshold: 5,
//       longPressDelay: 500,
//       doubleTapDelay: 300
//     });
    
//     // Add event listeners
//     this.setupEventListeners();
    
//     // Set up responsive handling
//     this.setupResponsiveness();
    
//     // Render the graph
//     this.render();
//   }
  
//   /**
//    * Set up event listeners
//    */
//   private setupEventListeners(): void {
//     // Handle node clicks
//     this.interactionManager.on('click', (event: InteractionEvent) => {
//       if (event.targetType === 'node') {
//         this.handleNodeClick(event.targetId || '');
//       } else if (event.targetType === 'edge') {
//         this.handleEdgeClick(event.targetId || '');
//       }
//     });
    
//     // Handle selection
//     this.interactionManager.on('select', (event: InteractionEvent) => {
//       if (event.targetType === 'node') {
//         this.toggleNodeSelection(event.targetId || '');
//       } else if (event.targetType === 'edge') {
//         this.toggleEdgeSelection(event.targetId || '');
//       }
//     });
    
//     // Handle zoom
//     if (this.config.zoomable) {
//       this.interactionManager.on('zoom', (event: InteractionEvent) => {
//         const { scale, x, y } = event.payload;
//         this.handleZoom(scale, x, y);
//       });
//     }
    
//     // Handle pan
//     this.interactionManager.on('pan', (event: InteractionEvent) => {
//       const { x, y } = event.payload;
//       this.handlePan(x, y);
//     });
//   }
  
//   /**
//    * Set up responsive behavior
//    */
//   private setupResponsiveness(): void {
//     // Make visualization responsive to container size changes
//     const cleanup = enableResponsiveVisualization(this.container, (width, height) => {
//       this.width = width;
//       this.height = height;
//       this.render();
//     });
    
//     this.cleanupFunctions.push(cleanup);
//   }
  
//   /**
//    * Handle node click
//    * @param nodeId Node ID
//    */
//   private handleNodeClick(nodeId: string): void {
//     const node = this.config.data.nodes.find(n => n.id === nodeId);
    
//     if (node && this.config.onNodeClick) {
//       this.config.onNodeClick(nodeId, node);
//     }
//   }
  
//   /**
//    * Handle edge click
//    * @param edgeId Edge ID
//    */
//   private handleEdgeClick(edgeId: string): void {
//     const edge = this.config.data.edges.find(e => (e.id || `${e.source}-${e.target}`) === edgeId);
    
//     if (edge && this.config.onEdgeClick) {
//       this.config.onEdgeClick(edgeId, edge);
//     }
//   }
  
//   /**
//    * Toggle node selection
//    * @param nodeId Node ID
//    */
//   private toggleNodeSelection(nodeId: string): void {
//     if (this.selectedNodes.has(nodeId)) {
//       this.selectedNodes.delete(nodeId);
//     } else {
//       this.selectedNodes.add(nodeId);
//     }
    
//     this.updateSelectionStyles();
    
//     if (this.config.onSelectionChange) {
//       this.config.onSelectionChange(
//         Array.from(this.selectedNodes),
//         Array.from(this.selectedEdges)
//       );
//     }
//   }
  
//   /**
//    * Toggle edge selection
//    * @param edgeId Edge ID
//    */
//   private toggleEdgeSelection(edgeId: string): void {
//     if (this.selectedEdges.has(edgeId)) {
//       this.selectedEdges.delete(edgeId);
//     } else {
//       this.selectedEdges.add(edgeId);
//     }
    
//     this.updateSelectionStyles();
    
//     if (this.config.onSelectionChange) {
//       this.config.onSelectionChange(
//         Array.from(this.selectedNodes),
//         Array.from(this.selectedEdges)
//       );
//     }
//   }
  
//   /**
//    * Update selection styles
//    */
//   private updateSelectionStyles(): void {
//     // Update node styles
//     this.nodeElements.forEach((element, id) => {
//       if (this.selectedNodes.has(id)) {
//         element.classList.add('selected');
//         element.setAttribute('stroke-width', '3');
//       } else {
//         element.classList.remove('selected');
//         element.setAttribute('stroke-width', '1.5');
//       }
//     });
    
//     // Update edge styles
//     this.edgeElements.forEach((element, id) => {
//       if (this.selectedEdges.has(id)) {
//         element.classList.add('selected');
//         element.setAttribute('stroke-width', '3');
//       } else {
//         element.classList.remove('selected');
        
//         // Reset to original width
//         const edge = this.config.data.edges.find(e => (e.id || `${e.source}-${e.target}`) === id);
//         const width = edge?.style?.width || this.config.defaultEdgeWidth || 2;
//         element.setAttribute('stroke-width', width.toString());
//       }
//     });
//   }
  
//   /**
//    * Handle zoom event
//    * @param scale Scale factor
//    * @param x Center X
//    * @param y Center Y
//    */
//   private handleZoom(scale: number, x: number, y: number): void {
//     this.transform.scale = scale;
    
//     // Apply transform to all layers
//     const layers = this.svg.querySelectorAll('g');
//     layers.forEach(layer => {
//       layer.setAttribute('transform', `scale(${scale}) translate(${this.transform.translateX}, ${this.transform.translateY})`);
//     });
//   }
  
//   /**
//    * Handle pan event
//    * @param x Pan X
//    * @param y Pan Y
//    */
//   private handlePan(x: number, y: number): void {
//     this.transform.translateX += x / this.transform.scale;
//     this.transform.translateY += y / this.transform.scale;
    
//     // Apply transform to all layers
//     const layers = this.svg.querySelectorAll('g');
//     layers.forEach(layer => {
//       layer.setAttribute('transform', `scale(${this.transform.scale}) translate(${this.transform.translateX}, ${this.transform.translateY})`);
//     });
//   }
  
//   /**
//    * Renders the graph visualization
//    */
//   public render(): void {
//     // Clear existing elements
//     this.clearVisualization();
    
//     // Process the graph data
//     let processedData = this.processGraphData();
    
//     // Render the graph elements
//     if (this.config.animate) {
//       this.renderWithAnimation(processedData);
//     } else {
//       this.renderEdges(processedData.edges);
//       this.renderNodes(processedData.nodes);
      
//       if (this.config.showLabels) {
//         this.renderLabels(processedData.nodes);
//       }
//     }
    
//     // Update transform
//     const layers = this.svg.querySelectorAll('g');
//     layers.forEach(layer => {
//       layer.setAttribute('transform', `scale(${this.transform.scale}) translate(${this.transform.translateX}, ${this.transform.translateY})`);
//     });
    
//     // Initialize tooltips
//     this.initializeTooltips(processedData);
    
//     // Initialize hover effects
//     this.initializeHoverEffects();
//   }
  
//   /**
//    * Process graph data and apply desired transformations
//    * @returns Processed graph data
//    */
//   private processGraphData(): GraphData {
//     let processedData = { ...this.config.data };
    
//     // Apply node sizing
//     if (this.config.nodeSizeStrategy !== 'fixed') {
//       processedData = calculateNodeSizes(processedData, {
//         strategy: this.config.nodeSizeStrategy === 'property' ? 'property' : 'degree',
//         minSize: this.config.minNodeSize || 10,
//         maxSize: this.config.maxNodeSize || 40,
//         propertyName: this.config.nodeSizeProperty
//       });
//     } else {
//       // Apply default size
//       processedData.nodes = processedData.nodes.map(node => ({
//         ...node,
//         style: {
//           ...(node.style || {}),
//           size: this.config.defaultNodeSize
//         }
//       }));
//     }
    
//     // Apply layout if nodes don't have positions
//     if (!processedData.nodes.some(node => node.position)) {
//       processedData = applyLayout(processedData, {
//         algorithm: this.config.layout || 'force-directed',
//         width: this.width,
//         height: this.height,
//         nodeSpacing: 20,
//         edgeLength: 80,
//         iterations: 100
//       });
//     }
    
//     return processedData;
//   }
  
//   /**
//    * Render with animation
//    * @param data Graph data
//    */
//   private renderWithAnimation(data: GraphData): void {
//     // Create animation timer
//     this.animationTimer = new Timer({ duration: 1500 });
    
//     // Render edges first (no animation)
//     this.renderEdges(data.edges);
    
//     // Render nodes with staggered animation
//     const nodeCount = data.nodes.length;
//     const staggerDelay = Math.min(1000 / nodeCount, 50); // Max 50ms per node
    
//     stagger(
//       nodeCount,
//       { duration: 800, easing: Easing.easeOutQuad },
//       staggerDelay,
//       (index, progress) => {
//         const node = data.nodes[index];
//         const nodeElement = this.renderNode(node, progress);
        
//         // If near end of animation, render label
//         if (progress > 0.8 && this.config.showLabels) {
//           this.renderLabel(node);
//         }
//       }
//     );
    
//     // Render labels after nodes
//     if (this.config.showLabels) {
//       this.animationTimer.on('complete', () => {
//         this.renderLabels(data.nodes);
//       });
//     }
    
//     // Start the animation
//     this.animationTimer.start();
//   }
  
//   /**
//    * Renders the edges
//    * @param edges Graph edges
//    */
//   private renderEdges(edges: GraphEdge[]): void {
//     const edgesLayer = this.svg.querySelector('.edges-layer');
    
//     if (!edgesLayer) return;
    
//     edges.forEach(edge => {
//       const sourceNode = this.config.data.nodes.find(n => n.id === edge.source);
//       const targetNode = this.config.data.nodes.find(n => n.id === edge.target);
      
//       if (!sourceNode || !targetNode || !sourceNode.position || !targetNode.position) {
//         return;
//       }
      
//       const edgeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
//       // Calculate edge path
//       const sourceX = sourceNode.position.x;
//       const sourceY = sourceNode.position.y;
//       const targetX = targetNode.position.x;
//       const targetY = targetNode.position.y;
      
//       // Adjust start and end points based on node sizes
//       const sourceSize = sourceNode.style?.size || this.config.defaultNodeSize || 20;
//       const targetSize = targetNode.style?.size || this.config.defaultNodeSize || 20;
      
//       const dx = targetX - sourceX;
//       const dy = targetY - sourceY;
//       const length = Math.sqrt(dx * dx + dy * dy);
      
//       // Skip if nodes are at the same position
//       if (length === 0) return;
      
//       const sourcePadding = sourceSize / 2;
//       const targetPadding = targetSize / 2;
      
//       const sourceRatio = sourcePadding / length;
//       const targetRatio = targetPadding / length;
      
//       const adjustedSourceX = sourceX + dx * sourceRatio;
//       const adjustedSourceY = sourceY + dy * sourceRatio;
//       const adjustedTargetX = targetX - dx * targetRatio;
//       const adjustedTargetY = targetY - dy * targetRatio;
      
//       // Create edge path
//       if (edge.directed) {
//         // Calculate arrow points
//         const arrowSize = 10;
//         const angle = Math.atan2(dy, dx);
//         const arrowAngle1 = angle + Math.PI / 7;
//         const arrowAngle2 = angle - Math.PI / 7;
        
//         const arrowX1 = adjustedTargetX - arrowSize * Math.cos(arrowAngle1);
//         const arrowY1 = adjustedTargetY - arrowSize * Math.sin(arrowAngle1);
//         const arrowX2 = adjustedTargetX - arrowSize * Math.cos(arrowAngle2);
//         const arrowY2 = adjustedTargetY - arrowSize * Math.sin(arrowAngle2);
        
//         // Create line and arrow path
//         const path = `M${adjustedSourceX},${adjustedSourceY} L${adjustedTargetX},${adjustedTargetY} M${arrowX1},${arrowY1} L${adjustedTargetX},${adjustedTargetY} L${arrowX2},${arrowY2}`;
//         edgeElement.setAttribute('d', path);
//       } else {
//         // Simple line for undirected edge
//         const path = `M${adjustedSourceX},${adjustedSourceY} L${adjustedTargetX},${adjustedTargetY}`;
//         edgeElement.setAttribute('d', path);
//       }
      
//       // Set edge attributes
//       const edgeColor = edge.style?.color || '#999';
//       const edgeWidth = edge.style?.width || edge.weight || this.config.defaultEdgeWidth || 2;
      
//       edgeElement.setAttribute('stroke', edgeColor);
//       edgeElement.setAttribute('stroke-width', edgeWidth.toString());
//       edgeElement.setAttribute('fill', 'none');
      
//       // Set edge style and class
//       if (edge.style?.lineStyle === 'dashed') {
//         edgeElement.setAttribute('stroke-dasharray', '5,5');
//       }
      
//       edgeElement.setAttribute('class', `edge ${edge.label ? `edge-${this.sanitizeClassName(edge.label)}` : ''}`);
      
//       // Set data attributes
//       edgeElement.setAttribute('data-source', edge.source);
//       edgeElement.setAttribute('data-target', edge.target);
//       edgeElement.setAttribute('data-type', edge.label || 'unknown');
//       edgeElement.setAttribute('data-interactive', 'true');
      
//       // Set edge ID
//       const edgeId = edge.id || `${edge.source}-${edge.target}`;
//       edgeElement.setAttribute('id', `edge-${edgeId}`);
      
//       // Register with interaction manager
//       this.interactionManager.registerElement(edgeId, edgeElement as unknown as HTMLElement);
      
//       // Store reference to edge element
//       this.edgeElements.set(edgeId, edgeElement);
      
//       // Add edge to layer
//       edgesLayer.appendChild(edgeElement);
      
//       // Add edge label if available
//       if (edge.label && this.config.showLabels) {
//         const labelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        
//         // Calculate midpoint for label
//         const midX = (adjustedSourceX + adjustedTargetX) / 2;
//         const midY = (adjustedSourceY + adjustedTargetY) / 2;
        
//         // Slightly offset the label from the edge
//         const perpX = dy / length * 5;
//         const perpY = -dx / length * 5;
        
//         labelElement.setAttribute('x', (midX + perpX).toString());
//         labelElement.setAttribute('y', (midY + perpY).toString());
//         labelElement.setAttribute('text-anchor', 'middle');
//         labelElement.setAttribute('dominant-baseline', 'middle');
//         labelElement.setAttribute('font-size', '10');
//         labelElement.setAttribute('fill', '#666');
//         labelElement.setAttribute('class', 'edge-label');
        
//         // Add label text
//         labelElement.textContent = edge.label;
        
//         // Add label to edges layer
//         edgesLayer.appendChild(labelElement);
//       }
//     });
//   }
  
//   /**
//    * Renders all nodes
//    * @param nodes Graph nodes
//    */
//   private renderNodes(nodes: GraphNode[]): void {
//     nodes.forEach(node => {
//       this.renderNode(node, 1);
//     });
//   }
  
//   /**
//    * Renders a single node
//    * @param node Node data
//    * @param progress Animation progress (0-1)
//    * @returns Node element
//    */
//   private renderNode(node: GraphNode, progress: number = 1): SVGElement {
//     if (!node.position) return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
//     const nodesLayer = this.svg.querySelector('.nodes-layer');
    
//     if (!nodesLayer) return document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
//     // Create node group
//     const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
//     nodeGroup.setAttribute('class', `node node-${this.sanitizeClassName(node.type)}`);
//     nodeGroup.setAttribute('id', `node-${node.id}`);
//     nodeGroup.setAttribute('data-type', 'node');
//     nodeGroup.setAttribute('data-interactive', 'true');
    
//     // Create node shape element
//     const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
//     // Get node attributes
//     const x = node.position.x;
//     const y = node.position.y;
//     const size = (node.style?.size || this.config.defaultNodeSize || 20) * progress;
//     const color = node.style?.color || 
//                  (this.config.nodeColorProperty && node.properties?.[this.config.nodeColorProperty]) ||
//                  KGVisualization.NODE_COLORS[node.type] || 
//                  KGVisualization.NODE_COLORS.default;
    
//     // Get shape
//     const shape = node.style?.shape || 
//                  (this.config.nodeShapeProperty && node.properties?.[this.config.nodeShapeProperty]) ||
//                  'circle';
    
//     // Get shape function
//     const shapeFunc = KGVisualization.NODE_SHAPES[shape] || KGVisualization.NODE_SHAPES.circle;
    
//     // Set node attributes
//     nodeElement.setAttribute('d', shapeFunc(x, y, size));
//     nodeElement.setAttribute('fill', color);
//     nodeElement.setAttribute('stroke', '#fff');
//     nodeElement.setAttribute('stroke-width', '1.5');
    
//     // Add to group
//     nodeGroup.appendChild(nodeElement);
    
//     // Register node with interaction manager
//     this.interactionManager.registerElement(node.id, nodeGroup as unknown as HTMLElement);
    
//     // Store node element
//     this.nodeElements.set(node.id, nodeElement);
    
//     // Add to layer
//     nodesLayer.appendChild(nodeGroup);
    
//     return nodeElement;
//   }
  
//   /**
//    * Renders all labels
//    * @param nodes Graph nodes
//    */
//   private renderLabels(nodes: GraphNode[]): void {
//     if (!this.config.showLabels) return;
    
//     nodes.forEach(node => {
//       this.renderLabel(node);
//     });
//   }
  
//   /**
//    * Renders a single label
//    * @param node Node data
//    */
//   private renderLabel(node: GraphNode): void {
//     if (!node.position) return;
    
//     const labelsLayer = this.svg.querySelector('.labels-layer');
    
//     if (!labelsLayer) return;
    
//     // Create label element
//     const labelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    
//     // Get node attributes
//     const x = node.position.x;
//     const y = node.position.y;
//     const size = node.style?.size || this.config.defaultNodeSize || 20;
    
//     // Set label position (below node)
//     labelElement.setAttribute('x', x.toString());
//     labelElement.setAttribute('y', (y + size / 2 + 12).toString());
//     labelElement.setAttribute('text-anchor', 'middle');
//     labelElement.setAttribute('font-size', '12');
//     labelElement.setAttribute('fill', '#333');
//     labelElement.setAttribute('class', 'node-label');
    
//     // Add label text
//     labelElement.textContent = node.label || node.id;
    
//     // Store label element
//     this.labelElements.set(node.id, labelElement);
    
//     // Add to layer
//     labelsLayer.appendChild(labelElement);
//   }
  
//   /**
//    * Initializes tooltips for nodes and edges
//    * @param data Graph data
//    */
//   private initializeTooltips(data: GraphData): void {
//     // Clean up any existing tooltips
//     this.tooltips.forEach(cleanup => cleanup());
//     this.tooltips.clear();
    
//     // Add tooltips for nodes
//     data.nodes.forEach(node => {
//       const nodeElement = this.nodeElements.get(node.id);
//       if (!nodeElement) return;
      
//       // Get tooltip content
//       const content = this.createNodeTooltipContent(node);
      
//       // Create tooltip
//       const cleanup = createTooltip(
//         nodeElement.parentElement as HTMLElement,
//         content,
//         {
//           position: 'top',
//           theme: 'dark',
//           maxWidth: 300,
//           showDelay: 300,
//           hideDelay: 200
//         }
//       );
      
//       this.tooltips.set(node.id, cleanup);
//     });
    
//     // Add tooltips for edges
//     data.edges.forEach(edge => {
//       const edgeId = edge.id || `${edge.source}-${edge.target}`;
//       const edgeElement = this.edgeElements.get(edgeId);
//       if (!edgeElement) return;
      
//       // Get tooltip content
//       const content = this.createEdgeTooltipContent(edge);
      
//       // Create tooltip
//       const cleanup = createTooltip(
//         edgeElement as unknown as HTMLElement,
//         content,
//         {
//           position: 'top',
//           theme: 'dark',
//           maxWidth: 300,
//           showDelay: 300,
//           hideDelay: 200
//         }
//       );
      
//       this.tooltips.set(edgeId, cleanup);
//     });
//   }
  
//   /**
//    * Creates tooltip content for a node
//    * @param node Node data
//    * @returns Tooltip content
//    */
//   private createNodeTooltipContent(node: GraphNode): HTMLElement {
//     const container = document.createElement('div');
    
//     // Add title
//     const title = document.createElement('div');
//     title.style.fontWeight = 'bold';
//     title.style.marginBottom = '5px';
//     title.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
//     title.style.paddingBottom = '3px';
//     title.textContent = node.label || node.id;
//     container.appendChild(title);
    
//     // Add type
//     const type = document.createElement('div');
//     type.style.marginBottom = '5px';
//     type.style.fontSize = '0.9em';
//     type.style.color = 'rgba(255, 255, 255, 0.8)';
//     type.textContent = `Type: ${node.type}`;
//     container.appendChild(type);
    
//     // Add properties if available
//     if (node.properties && Object.keys(node.properties).length > 0) {
//       const propTitle = document.createElement('div');
//       propTitle.style.marginTop = '5px';
//       propTitle.style.marginBottom = '3px';
//       propTitle.style.fontWeight = 'bold';
//       propTitle.style.fontSize = '0.9em';
//       propTitle.textContent = 'Properties:';
//       container.appendChild(propTitle);
      
//       const propList = document.createElement('div');
//       propList.style.fontSize = '0.9em';
      
//       Object.entries(node.properties).forEach(([key, value]) => {
//         const propItem = document.createElement('div');
//         propItem.style.marginBottom = '2px';
        
//         // Format property value
//         let formattedValue = value;
//         if (typeof value === 'number') {
//           formattedValue = formatNumber(value);
//         } else if (typeof value === 'boolean') {
//           formattedValue = value ? 'Yes' : 'No';
//         }
        
//         propItem.textContent = `${key}: ${formattedValue}`;
//         propList.appendChild(propItem);
//       });
      
//       container.appendChild(propList);
//     }
    
//     return container;
//   }
  
//   /**
//    * Creates tooltip content for an edge
//    * @param edge Edge data
//    * @returns Tooltip content
//    */
//   private createEdgeTooltipContent(edge: GraphEdge): HTMLElement {
//     const container = document.createElement('div');
    
//     // Add title
//     const title = document.createElement('div');
//     title.style.fontWeight = 'bold';
//     title.style.marginBottom = '5px';
//     title.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
//     title.style.paddingBottom = '3px';
//     title.textContent = edge.label || 'Relationship';
//     container.appendChild(title);
    
//     // Add source and target
//     const connection = document.createElement('div');
//     connection.style.marginBottom = '5px';
//     connection.style.fontSize = '0.9em';
    
//     // Get node labels
//     const sourceNode = this.config.data.nodes.find(n => n.id === edge.source);
//     const targetNode = this.config.data.nodes.find(n => n.id === edge.target);
    
//     connection.textContent = `${sourceNode?.label || edge.source} → ${targetNode?.label || edge.target}`;
//     container.appendChild(connection);
    
//     // Add properties if available
//     if (edge.properties && Object.keys(edge.properties).length > 0) {
//       const propTitle = document.createElement('div');
//       propTitle.style.marginTop = '5px';
//       propTitle.style.marginBottom = '3px';
//       propTitle.style.fontWeight = 'bold';
//       propTitle.style.fontSize = '0.9em';
//       propTitle.textContent = 'Properties:';
//       container.appendChild(propTitle);
      
//       const propList = document.createElement('div');
//       propList.style.fontSize = '0.9em';
      
//       Object.entries(edge.properties).forEach(([key, value]) => {
//         const propItem = document.createElement('div');
//         propItem.style.marginBottom = '2px';
        
//         // Format property value
//         let formattedValue = value;
//         if (typeof value === 'number') {
//           formattedValue = formatNumber(value);
//         } else if (typeof value === 'boolean') {
//           formattedValue = value ? 'Yes' : 'No';
//         }
        
//         propItem.textContent = `${key}: ${formattedValue}`;
//         propList.appendChild(propItem);
//       });
      
//       container.appendChild(propList);
//     }
    
//     // Add weight if available
//     if (edge.weight) {
//       const weight = document.createElement('div');
//       weight.style.marginTop = '5px';
//       weight.style.fontSize = '0.9em';
//       weight.textContent = `Weight: ${formatNumber(edge.weight)}`;
//       container.appendChild(weight);
//     }
    
//     return container;
//   }
  
//   /**
//    * Initializes hover effects for nodes and edges
//    */
//   private initializeHoverEffects(): void {
//     // Clean up any existing hover effects
//     this.hoverEffects.forEach(cleanup => cleanup());
//     this.hoverEffects.clear();
    
//     // Add hover effects for nodes
//     this.nodeElements.forEach((nodeElement, nodeId) => {
//       const parentElement = nodeElement.parentElement;
//       if (!parentElement) return;
      
//       // Create hover effect
//       const cleanup = createHoverEffect(
//         parentElement,
//         {
//           scaleAmount: 1.1,
//           glowColor: 'rgba(100, 149, 237, 0.6)',
//           fadeInDuration: 150,
//           fadeOutDuration: 200
//         }
//       );
      
//       this.hoverEffects.set(nodeId, cleanup);
//     });
//   }
  
//   /**
//    * Clears the visualization
//    */
//   private clearVisualization(): void {
//     // Clear node and edge maps
//     this.nodeElements.clear();
//     this.edgeElements.clear();
//     this.labelElements.clear();
    
//     // Clear layers
//     const layers = this.svg.querySelectorAll('g');
//     layers.forEach(layer => {
//       layer.innerHTML = '';
//     });
    
//     // Clear tooltips
//     this.tooltips.forEach(cleanup => cleanup());
//     this.tooltips.clear();
    
//     // Clear hover effects
//     this.hoverEffects.forEach(cleanup => cleanup());
//     this.hoverEffects.clear();
    
//     // Clear animation timer
//     if (this.animationTimer) {
//       this.animationTimer.destroy();
//       this.animationTimer = null;
//     }
//   }
  
//   /**
//    * Updates the visualization with new data
//    * @param data New graph data
//    */
//   public update(data: GraphData): void {
//     this.config.data = data;
//     this.render();
//   }
  
//   /**
//    * Highlights specific nodes
//    * @param nodeIds Node IDs to highlight
//    * @param highlightConnections Whether to highlight connected edges
//    */
//   public highlightNodes(nodeIds: string[], highlightConnections: boolean = true): void {
//     // Reset all nodes and edges first
//     this.nodeElements.forEach((element, id) => {
//       element.classList.remove('highlighted');
//       element.setAttribute('stroke-width', '1.5');
//       element.setAttribute('stroke', '#fff');
//     });
    
//     this.edgeElements.forEach((element, id) => {
//       element.classList.remove('highlighted');
      
//       // Reset to original width
//       const edge = this.config.data.edges.find(e => (e.id || `${e.source}-${e.target}`) === id);
//       const width = edge?.style?.width || this.config.defaultEdgeWidth || 2;
//       element.setAttribute('stroke-width', width.toString());
//       element.setAttribute('stroke-opacity', '0.8');
//     });
    
//     // Highlight selected nodes
//     nodeIds.forEach(id => {
//       const element = this.nodeElements.get(id);
//       if (element) {
//         element.classList.add('highlighted');
//         element.setAttribute('stroke-width', '3');
//         element.setAttribute('stroke', '#ff9900');
//       }
//     });
    
//     // Highlight connected edges if requested
//     if (highlightConnections) {
//       this.config.data.edges.forEach(edge => {
//         const sourceHighlighted = nodeIds.includes(edge.source);
//         const targetHighlighted = nodeIds.includes(edge.target);
        
//         if (sourceHighlighted || targetHighlighted) {
//           const edgeId = edge.id || `${edge.source}-${edge.target}`;
//           const element = this.edgeElements.get(edgeId);
          
//           if (element) {
//             element.classList.add('highlighted');
//             element.setAttribute('stroke-width', '3');
//             element.setAttribute('stroke-opacity', '1');
//           }
//         }
//       });
//     }
//   }
  
//   /**
//    * Highlights specific edges
//    * @param edgeIds Edge IDs to highlight
//    */
//   public highlightEdges(edgeIds: string[]): void {
//     // Reset all edges first
//     this.edgeElements.forEach((element, id) => {
//       element.classList.remove('highlighted');
      
//       // Reset to original width
//       const edge = this.config.data.edges.find(e => (e.id || `${e.source}-${e.target}`) === id);
//       const width = edge?.style?.width || this.config.defaultEdgeWidth || 2;
//       element.setAttribute('stroke-width', width.toString());
//       element.setAttribute('stroke-opacity', '0.8');
//     });
    
//     // Highlight selected edges
//     edgeIds.forEach(id => {
//       const element = this.edgeElements.get(id);
//       if (element) {
//         element.classList.add('highlighted');
//         element.setAttribute('stroke-width', '3');
//         element.setAttribute('stroke-opacity', '1');
//       }
//     });
//   }
  
//   /**
//    * Centers the view on specific nodes
//    * @param nodeIds Node IDs to center on
//    * @param padding Padding around the nodes
//    */
//   public centerOnNodes(nodeIds: string[], padding: number = 50): void {
//     if (nodeIds.length === 0) return;
    
//     // Find the nodes
//     const nodes = this.config.data.nodes.filter(node => 
//       nodeIds.includes(node.id) && node.position
//     );
    
//     if (nodes.length === 0) return;
    
//     // Calculate bounding box
//     let minX = Infinity;
//     let minY = Infinity;
//     let maxX = -Infinity;
//     let maxY = -Infinity;
    
//     nodes.forEach(node => {
//       if (!node.position) return;
      
//       minX = Math.min(minX, node.position.x);
//       minY = Math.min(minY, node.position.y);
//       maxX = Math.max(maxX, node.position.x);
//       maxY = Math.max(maxY, node.position.y);
//     });
    
//     // Add padding
//     minX -= padding;
//     minY -= padding;
//     maxX += padding;
//     maxY += padding;
    
//     // Calculate center and dimensions
//     const centerX = (minX + maxX) / 2;
//     const centerY = (minY + maxY) / 2;
//     const width = maxX - minX;
//     const height = maxY - minY;
    
//     // Calculate scale
//     const scaleX = this.width / width;
//     const scaleY = this.height / height;
//     const scale = Math.min(scaleX, scaleY, 2); // Limit zoom to 2x
    
//     // Update transform
//     this.transform.scale = scale;
//     this.transform.translateX = -centerX * scale + this.width / 2;
//     this.transform.translateY = -centerY * scale + this.height / 2;
    
//     // Apply transform with animation
//     const startScale = this.transform.scale;
//     const startX = this.transform.translateX;
//     const startY = this.transform.translateY;
    
//     animate(
//       0,
//       1,
//       { duration: 800, easing: Easing.easeInOutQuad },
//       progress => {
//         const currentScale = startScale + (scale - startScale) * progress;
//         const currentX = startX + (this.transform.translateX - startX) * progress;
//         const currentY = startY + (this.transform.translateY - startY) * progress;
        
//         // Apply transform to all layers
//         const layers = this.svg.querySelectorAll('g');
//         layers.forEach(layer => {
//           layer.setAttribute('transform', `translate(${currentX}, ${currentY}) scale(${currentScale})`);
//         });
//       }
//     );
//   }
  
//   /**
//    * Resets the view
//    */
//   public resetView(): void {
//     // Reset transform
//     this.transform.scale = 1;
//     this.transform.translateX = 0;
//     this.transform.translateY = 0;
    
//     // Apply transform with animation
//     animate(
//       0,
//       1,
//       { duration: 800, easing: Easing.easeInOutQuad },
//       progress => {
//         const currentScale = 1 + (1 - 1) * progress;
//         const currentX = this.transform.translateX * (1 - progress);
//         const currentY = this.transform.translateY * (1 - progress);
        
//         // Apply transform to all layers
//         const layers = this.svg.querySelectorAll('g');
//         layers.forEach(layer => {
//           layer.setAttribute('transform', `translate(${currentX}, ${currentY}) scale(${currentScale})`);
//         });
//       }
//     );
//   }
  
//   /**
//    * Filters the graph
//    * @param filter Filter criteria
//    */
//   public filterGraph(filter: {
//     nodeTypes?: string[];
//     edgeTypes?: string[];
//     properties?: Record<string, any>;
//     customFilter?: (node: GraphNode | GraphEdge) => boolean;
//   }): void {
//     const filteredData = filterGraph(this.config.data, filter);
//     this.update(filteredData);
//   }
  
//   /**
//    * Extracts a subgraph
//    * @param rootNodeIds Root node IDs
//    * @param options Subgraph options
//    */
//   public extractSubgraph(
//     rootNodeIds: string[],
//     options: {
//       maxDepth?: number;
//       followIncoming?: boolean;
//       followOutgoing?: boolean;
//       relationshipTypes?: string[];
//       nodeTypes?: string[];
//     } = {}
//   ): void {
//     const subgraph = extractSubgraph(this.config.data, {
//       rootNodes: rootNodeIds,
//       traversal: {
//         maxDepth: options.maxDepth,
//         followIncoming: options.followIncoming,
//         followOutgoing: options.followOutgoing,
//         relationshipTypes: options.relationshipTypes,
//         nodeTypes: options.nodeTypes
//       },
//       autoPosition: true
//     });
    
//     this.update(subgraph);
//   }
  
//   /**
//    * Gets selected nodes
//    * @returns Array of selected node IDs
//    */
//   public getSelectedNodes(): string[] {
//     return Array.from(this.selectedNodes);
//   }
  
//   /**
//    * Gets selected edges
//    * @returns Array of selected edge IDs
//    */
//   public getSelectedEdges(): string[] {
//     return Array.from(this.selectedEdges);
//   }
  
//   /**
//    * Sanitizes a string for use as a CSS class name
//    * @param str String to sanitize
//    * @returns Sanitized string
//    */
//   private sanitizeClassName(str: string): string {
//     return str.toLowerCase().replace(/[^a-z0-9]/g, '-');
//   }
  
//   /**
//    * Cleans up resources
//    */
//   public destroy(): void {
//     // Clean up interaction manager
//     this.interactionManager.destroy();
    
//     // Clean up tooltips
//     this.tooltips.forEach(cleanup => cleanup());
    
//     // Clean up hover effects
//     this.hoverEffects.forEach(cleanup => cleanup());
    
//     // Clean up animation timer
//     if (this.animationTimer) {
//       this.animationTimer.destroy();
//     }
    
//     // Clean up resize observer
//     if (this.resizeObserver) {
//       this.resizeObserver.disconnect();
//     }
    
//     // Clean up other resources
//     this.cleanupFunctions.forEach(cleanup => cleanup());
    
//     // Remove SVG from container
//     if (this.svg.parentNode) {
//       this.svg.parentNode.removeChild(this.svg);
//     }
//   }
// }

// /**
//  * Example usage:
//  * 
//  * ```typescript
//  * // Sample knowledge graph data
//  * const graphData: GraphData = {
//  *   nodes: [
//  *     { id: 'n1', label: 'Person', type: 'Entity', properties: { name: 'John Doe' } },
//  *     { id: 'n2', label: 'Company', type: 'Entity', properties: { name: 'Acme Inc.' } },
//  *     { id: 'n3', label: 'City', type: 'Entity', properties: { name: 'New York' } }
//  *   ],
//  *   edges: [
//  *     { source: 'n1', target: 'n2', label: 'WORKS_AT', directed: true },
//  *     { source: 'n2', target: 'n3', label: 'LOCATED_IN', directed: true }
//  *   ],
//  *   metadata: {
//  *     name: 'Sample Knowledge Graph'
//  *   }
//  * };
//  * 
//  * // Create the visualization
//  * const container = document.getElementById('graph-container');
//  * const visualization = new KGVisualization({
//  *   container,
//  *   data: graphData,
//  *   layout: 'force-directed',
//  *   nodeSizeStrategy: 'degree',
//  *   showLabels: true,
//  *   animate: true
//  * });
//  * ```
//  */