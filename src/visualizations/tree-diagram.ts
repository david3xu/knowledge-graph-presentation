/**
 * Tree Diagram Visualization
 * Renders hierarchical data structures as a visual tree with expandable/collapsible nodes
 */
import * as d3 from 'd3';
import { BaseVisualizationConfig } from '../types/chart-config';

/**
 * Tree node data structure
 */
export interface TreeNode {
  /** Unique identifier for this node */
  id: string;
  
  /** Display label */
  label: string;
  
  /** Optional node type for styling */
  type?: string;
  
  /** Child nodes */
  children?: TreeNode[];
  
  /** Optional node data/attributes */
  data?: Record<string, any>;
  
  /** Whether this node is expanded (for collapsible trees) */
  expanded?: boolean;
  
  /** Whether this node is a leaf node with no children */
  isLeaf?: boolean;
  
  /** Optional tooltip text */
  tooltip?: string;
  
  /** URL for node link if clickable */
  link?: string;
  
  /** CSS classes to apply to this node */
  cssClass?: string;
  
  /** Node icon (text character or SVG path) */
  icon?: string;
  
  /** Optional custom rendering function */
  renderFn?: string;
}

/**
 * Tree edge configuration
 */
export interface TreeEdge {
  /** Source node ID */
  source: string;
  
  /** Target node ID */
  target: string;
  
  /** Optional edge type for styling */
  type?: string;
  
  /** Edge label */
  label?: string;
  
  /** Whether this is a dashed line */
  dashed?: boolean;
  
  /** Edge weight or thickness */
  weight?: number;
  
  /** CSS classes to apply to this edge */
  cssClass?: string;
}

/**
 * Configuration options for tree diagram visualization
 */
export interface TreeDiagramOptions extends BaseVisualizationConfig {
  /** Root node of the tree */
  rootNode: TreeNode;
  
  /** Optional explicit edges (if not derived from parent-child structure) */
  edges?: TreeEdge[];
  
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical' | 'radial';
  
  /** Layout direction for horizontal/vertical trees */
  direction?: 'topToBottom' | 'bottomToTop' | 'leftToRight' | 'rightToLeft';
  
  /** Node separation distance */
  nodeSeparation?: number;
  
  /** Level separation distance */
  levelSeparation?: number;
  
  /** Whether the tree is collapsible */
  collapsible?: boolean;
  
  /** Whether to initially expand all nodes */
  expandAll?: boolean;
  
  /** Maximum depth to initially expand */
  initialExpandLevel?: number;
  
  /** Node size */
  nodeSize?: {
    width: number;
    height: number;
    radius?: number;
  };
  
  /** Node styling */
  nodeStyle?: {
    /** Default color for nodes */
    color?: string;
    
    /** Color map for node types */
    colorMap?: Record<string, string>;
    
    /** Node border color */
    borderColor?: string;
    
    /** Node border width */
    borderWidth?: number;
    
    /** Node border radius */
    borderRadius?: number;
    
    /** Text color */
    textColor?: string;
    
    /** Font size */
    fontSize?: number;
    
    /** Font family */
    fontFamily?: string;
    
    /** Icon size */
    iconSize?: number;
    
    /** Icon color */
    iconColor?: string;
  };
  
  /** Edge styling */
  edgeStyle?: {
    /** Default color for edges */
    color?: string;
    
    /** Color map for edge types */
    colorMap?: Record<string, string>;
    
    /** Line width */
    width?: number;
    
    /** Line curve style */
    curve?: 'linear' | 'step' | 'diagonal' | 'curved';
    
    /** Arrow size */
    arrowSize?: number;
    
    /** Whether to show arrows */
    showArrows?: boolean;
    
    /** Arrow direction */
    arrowDirection?: 'forward' | 'backward' | 'both' | 'none';
  };
  
  /** Whether to enable dragging */
  draggable?: boolean;
  
  /** Whether to enable zooming/panning */
  zoomable?: boolean;
  
  /** Initial zoom level */
  initialZoom?: number;
  
  /** Whether to show a minimap */
  showMinimap?: boolean;
  
  /** Minimap size */
  minimapSize?: {
    width: number;
    height: number;
  };
  
  /** Whether to fit the diagram to the container */
  fitToContainer?: boolean;
  
  /** Whether to center the root node */
  centerRoot?: boolean;
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Whether to truncate long labels */
  truncateLabels?: boolean;
  
  /** Maximum label length */
  maxLabelLength?: number;
  
  /** Whether to show tooltips */
  showTooltips?: boolean;
  
  /** Tooltip configuration */
  tooltipConfig?: {
    /** Tooltip positioning */
    position?: 'top' | 'bottom' | 'left' | 'right';
    
    /** Tooltip max width */
    maxWidth?: number;
    
    /** Tooltip delay in milliseconds */
    delay?: number;
  };
  
  /** Selected node IDs */
  selectedNodeIds?: string[];
  
  /** Animation settings */
  animation?: {
    /** Enable animations */
    enabled?: boolean;
    
    /** Animation duration in milliseconds */
    duration?: number;
    
    /** Animation easing function */
    easing?: string;
  };
  
  /** Callbacks */
  callbacks?: {
    /** Called when a node is clicked */
    onNodeClick?: (nodeId: string, node: TreeNode) => void;
    
    /** Called when a node is expanded */
    onNodeExpand?: (nodeId: string, node: TreeNode) => void;
    
    /** Called when a node is collapsed */
    onNodeCollapse?: (nodeId: string, node: TreeNode) => void;
    
    /** Called when a node is selected */
    onNodeSelect?: (nodeId: string, node: TreeNode) => void;
    
    /** Called when an edge is clicked */
    onEdgeClick?: (sourceId: string, targetId: string, edge: TreeEdge) => void;
  };
}

/**
 * Tree diagram visualization for hierarchical data structures
 */
export class TreeDiagramVisualization {
  private container: HTMLElement;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private mainGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private options: TreeDiagramOptions;
  private nodeElements!: d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, SVGGElement, unknown>;
  private edgeElements!: d3.Selection<SVGPathElement, d3.HierarchyPointLink<TreeNode>, SVGGElement, unknown>;
  private hierarchyRoot!: d3.HierarchyNode<TreeNode>;
  private treeLayout!: d3.TreeLayout<TreeNode>;
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;
  private nodesById = new Map<string, d3.HierarchyNode<TreeNode>>();
  private edgesById = new Map<string, d3.HierarchyPointLink<TreeNode>>();
  private tooltipDiv!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  
  /**
   * Creates a new tree diagram visualization
   * @param options Tree diagram configuration options
   */
  constructor(options: TreeDiagramOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 800;
    this.height = options.height || this.container.clientHeight || 600;
    
    // Apply default options
    this.options = this.applyDefaultOptions(options);
    
    // Create SVG container
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'tree-diagram-visualization');
      
    // Add defs for markers
    const defs = this.svg.select('defs') as d3.Selection<SVGDefsElement, unknown, null, undefined>;
    defs.selectAll('*').remove();
    this.createArrowMarkers(defs);
    
    // Add zoom behavior if enabled
    if (this.options.zoomable) {
      this.zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          this.mainGroup.attr('transform', event.transform);
        });
      
      this.svg.call(this.zoom);
      
      // Apply initial zoom if specified
      if (this.options.initialZoom && this.options.initialZoom !== 1) {
        this.svg.call(this.zoom.transform, d3.zoomIdentity
          .translate(this.width / 2, this.height / 2)
          .scale(this.options.initialZoom)
          .translate(-this.width / 2, -this.height / 2));
      }
    }
    
    // Create main group for the tree diagram
    this.mainGroup = this.svg.append('g')
      .attr('class', 'tree-diagram-main-group');
    
    // Create tooltip container if tooltips are enabled
    if (this.options.showTooltips) {
      this.tooltipDiv = d3.select(this.container)
        .append('div')
        .attr('class', 'tree-diagram-tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('max-width', `${this.options.tooltipConfig?.maxWidth || 200}px`)
        .style('pointer-events', 'none')
        .style('z-index', '1000');
    }
    
    // Process tree data
    this.preprocessData();
    
    // Create tree layout
    this.createTreeLayout();
    
    // Initialize visualization
    this.initializeVisualization();
    
    // Create minimap if enabled
    if (this.options.showMinimap) {
      this.createMinimap();
    }
    
    // Add window resize handler
    window.addEventListener('resize', this.handleResize);
  }
  
  /**
   * Apply default options to user-provided configuration
   * @param options User options
   * @returns Merged options with defaults
   */
  private applyDefaultOptions(options: TreeDiagramOptions): TreeDiagramOptions {
    // Keep existing rootNode if not provided
    if (!options.rootNode) {
      options.rootNode = this.options.rootNode;
    }
    
    return {
      ...options,
      orientation: options.orientation || 'vertical',
      direction: options.direction || 'topToBottom',
      nodeSeparation: options.nodeSeparation || 25,
      levelSeparation: options.levelSeparation || 100,
      collapsible: options.collapsible !== false,
      expandAll: options.expandAll || false,
      initialExpandLevel: options.initialExpandLevel || 2,
      nodeSize: {
        width: options.nodeSize?.width || 120,
        height: options.nodeSize?.height || 40,
        radius: options.nodeSize?.radius || 5,
        ...options.nodeSize
      },
      nodeStyle: {
        color: '#4285F4',
        colorMap: {
          'default': '#4285F4',
          'leaf': '#34A853',
          'branch': '#FBBC05',
          'root': '#EA4335'
        },
        borderColor: '#2c3e50',
        borderWidth: 1,
        borderRadius: 5,
        textColor: '#ffffff',
        fontSize: 12,
        fontFamily: 'Arial, sans-serif',
        iconSize: 16,
        iconColor: '#ffffff',
        ...options.nodeStyle
      },
      edgeStyle: {
        color: '#95a5a6',
        colorMap: {},
        width: 1.5,
        curve: 'diagonal',
        arrowSize: 5,
        showArrows: false,
        arrowDirection: 'forward',
        ...options.edgeStyle
      },
      draggable: options.draggable || false,
      zoomable: options.zoomable !== false,
      initialZoom: options.initialZoom || 1,
      showMinimap: options.showMinimap || false,
      minimapSize: {
        width: options.minimapSize?.width || 150,
        height: options.minimapSize?.height || 100,
        ...options.minimapSize
      },
      fitToContainer: options.fitToContainer !== false,
      centerRoot: options.centerRoot !== false,
      showLabels: options.showLabels !== false,
      truncateLabels: options.truncateLabels || false,
      maxLabelLength: options.maxLabelLength || 15,
      showTooltips: options.showTooltips !== false,
      tooltipConfig: {
        position: 'top',
        maxWidth: 200,
        delay: 300,
        ...options.tooltipConfig
      },
      animation: {
        enabled: true,
        duration: 500,
        easing: 'cubic-in-out',
        ...options.animation
      },
      callbacks: {
        ...options.callbacks
      }
    };
  }
  
  /**
   * Preprocess tree data to initialize expanded/collapsed states
   */
  private preprocessData(): void {
    const processNode = (node: TreeNode, level: number): void => {
      // Set expanded state based on options
      if (node.expanded === undefined) {
        node.expanded = this.options.expandAll || level < this.options.initialExpandLevel!;
      }
      
      // Set isLeaf property if not already set
      if (node.isLeaf === undefined) {
        node.isLeaf = !node.children || node.children.length === 0;
      }
      
      // Process children
      if (node.children) {
        node.children.forEach(child => processNode(child, level + 1));
      }
    };
    
    // Start processing from root
    processNode(this.options.rootNode, 0);
  }
  
  /**
   * Create tree layout based on orientation and direction
   */
  private createTreeLayout(): void {
    // Helper to determine tree orientation
    const getTreeOrientation = (): ((node: d3.HierarchyPointNode<TreeNode>) => [number, number]) => {
      switch (this.options.orientation) {
        case 'horizontal':
          return this.options.direction === 'leftToRight' ?
            node => [node.y, node.x] :
            node => [this.width - node.y, node.x];
        case 'radial':
          return node => [
            node.y * Math.cos(node.x - Math.PI / 2),
            node.y * Math.sin(node.x - Math.PI / 2)
          ];
        case 'vertical':
        default:
          return this.options.direction === 'topToBottom' ?
            node => [node.x, node.y] :
            node => [node.x, this.height - node.y];
      }
    };
    
    // Create d3 hierarchy from tree data
    this.hierarchyRoot = d3.hierarchy(this.options.rootNode, node => 
      node.expanded ? node.children : undefined
    );
    
    // Set up the tree layout
    this.treeLayout = d3.tree<TreeNode>()
      .nodeSize([this.options.nodeSeparation!, this.options.levelSeparation!])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.5));
      
    if (this.options.orientation === 'radial') {
      this.treeLayout.size([2 * Math.PI, Math.min(this.width, this.height) / 2 - 50]);
    }
    
    // Apply layout
    this.treeLayout(this.hierarchyRoot);
    
    // Build node and edge lookups
    this.buildNodeLookup();
    
    // Create node positioning function
    this.nodePosition = getTreeOrientation();
  }
  
  /**
   * Build lookup tables for nodes and edges
   */
  private buildNodeLookup(): void {
    this.nodesById.clear();
    this.edgesById.clear();
    
    // Add nodes to lookup table
    this.hierarchyRoot.descendants().forEach(node => {
      this.nodesById.set(node.data.id, node);
    });
    
    // Add edges to lookup table
    this.hierarchyRoot.links().forEach(link => {
      const key = `${link.source.data.id}-${link.target.data.id}`;
      this.edgesById.set(key, link as d3.HierarchyPointLink<TreeNode>);
    });
  }
  
  // Node positioning function - will be set in createTreeLayout
  private nodePosition: (node: d3.HierarchyPointNode<TreeNode>) => [number, number] = 
    node => [node.x, node.y];
  
  /**
   * Create arrow markers for directional edges
   * @param defs SVG defs element
   */
  private createArrowMarkers(defs: d3.Selection<SVGDefsElement, unknown, null, undefined>): void {
    if (!this.options.edgeStyle?.showArrows) return;
    
    // Create default arrow marker
    defs.append('marker')
      .attr('id', 'arrow-default')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', this.options.edgeStyle?.arrowSize || 5)
      .attr('markerHeight', this.options.edgeStyle?.arrowSize || 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', this.options.edgeStyle?.color || '#95a5a6');
      
    // Create color-specific arrow markers
    if (this.options.edgeStyle?.colorMap) {
      Object.entries(this.options.edgeStyle.colorMap).forEach(([type, color]) => {
        defs.append('marker')
          .attr('id', `arrow-${type}`)
          .attr('viewBox', '0 -5 10 10')
          .attr('refX', 15)
          .attr('refY', 0)
          .attr('markerWidth', this.options.edgeStyle?.arrowSize || 5)
          .attr('markerHeight', this.options.edgeStyle?.arrowSize || 5)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M0,-5L10,0L0,5')
          .attr('fill', color);
      });
    }
  }
  
  /**
   * Initialize the visualization
   */
  private initializeVisualization(): void {
    // Create groups for edges and nodes
    const linksGroup = this.mainGroup.append('g')
      .attr('class', 'tree-links');
      
    // const nodesGroup = this.mainGroup.append('g')
    //   .attr('class', 'tree-nodes');
      
    // Calculate initial translation to center the tree
    if (this.options.centerRoot && this.options.orientation !== 'radial') {
      // Get the root node position
      const [rootX, rootY] = this.nodePosition(this.hierarchyRoot as d3.HierarchyPointNode<TreeNode>);
      
      // Calculate the translation
      let translateX = this.width / 2;
      let translateY = this.height / 10;
      
      // Adjust for orientation and direction
      if (this.options.orientation === 'horizontal') {
        translateX = this.options.direction === 'leftToRight' ? 
          this.width / 10 : this.width - this.width / 10;
      }
      
      // Apply the translation
      this.mainGroup.attr('transform', `translate(${translateX - rootX}, ${translateY - rootY})`);
    } else if (this.options.orientation === 'radial') {
      // Center radial layout
      this.mainGroup.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    }
    
    // Create tree links
    this.createTreeLinks(linksGroup);
    
    // Create tree nodes
    this.createTreeNodes();
    
    // Select nodes if specified
    if (this.options.selectedNodeIds && this.options.selectedNodeIds.length > 0) {
      this.selectNodes(this.options.selectedNodeIds);
    }
  }
  
  /**
   * Create tree links between nodes
   * @param linksGroup SVG group for links
   */
  private createTreeLinks(linksGroup: d3.Selection<SVGGElement, unknown, null, undefined>): void {
    // Link generator based on curve style
    const linkGenerator = this.createLinkGenerator();
    
    // Create the links
    this.edgeElements = linksGroup.selectAll<SVGPathElement, d3.HierarchyPointLink<TreeNode>>('.tree-link')
      .data(this.hierarchyRoot.links().map(link => link as d3.HierarchyPointLink<TreeNode>), 
        d => `${d.source.data.id}-${d.target.data.id}`);
    
    // Create the links
    this.edgeElements = linksGroup.selectAll<SVGPathElement, d3.HierarchyPointLink<TreeNode>>('.tree-link')
      .enter()
      .append('path')
      .attr('class', d => `tree-link ${d.target.data.cssClass || ''}`)
      .attr('d', d => linkGenerator(d))
      .attr('fill', 'none')
      .attr('stroke', d => this.getEdgeColor(d))
      .attr('stroke-width', this.options.edgeStyle?.width || 1.5)
      .attr('stroke-dasharray', d => this.getEdgeDashArray(d))
      .attr('marker-end', d => this.getEdgeMarker(d));
      
    // Add tooltips
    if (this.options.showTooltips) {
      this.edgeElements
        .on('mouseover', (event, d) => {
          this.showTooltip(event, `${d.source.data.label} → ${d.target.data.label}`);
        })
        .on('mousemove', this.moveTooltip.bind(this))
        .on('mouseout', this.hideTooltip.bind(this));
    }
    
    // Add click handler
    if (this.options.callbacks?.onEdgeClick) {
      this.edgeElements
        .style('cursor', 'pointer')
        .on('click', (_, d) => {
          if (this.options.callbacks?.onEdgeClick) {
            this.options.callbacks.onEdgeClick(
              d.source.data.id, 
              d.target.data.id, 
              {
                source: d.source.data.id,
                target: d.target.data.id,
                type: d.target.data.type
              } as TreeEdge
            );
          }
        });
    }
  }
  
  /**
   * Create link path generator based on curve style
   */
  private createLinkGenerator(): d3.Link<any, d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>> {
    return d3.linkVertical<any, d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
      .x(node => this.nodePosition(node)[0])
      .y(node => this.nodePosition(node)[1]);
  }
  
  /**
   * Create tree nodes
   */
  private createTreeNodes(): void {
    // Create node elements
    this.nodeElements = this.mainGroup.select<SVGGElement>('.tree-nodes')
      .selectAll<SVGGElement, d3.HierarchyPointNode<TreeNode>>('.tree-node')
      .data(this.hierarchyRoot.descendants().map(node => node as d3.HierarchyPointNode<TreeNode>), 
        d => d.data.id);
    
    // Add node shapes based on isLeaf property
    this.nodeElements.each((d, i, nodes) => {
      const nodeSelection = d3.select(nodes[i]) as d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, null, unknown>;
      
      // Determine node type for styling
      const nodeType = this.getNodeType(d);
      
      // Create the appropriate node shape
      this.createNodeShape(nodeSelection, d, nodeType);
      
      // Add node label if enabled
      if (this.options.showLabels) {
        this.addNodeLabel(nodeSelection, d);
      }
      
      // Add collapse/expand button if collapsible and not a leaf
      if (this.options.collapsible && !d.data.isLeaf) {
        this.addCollapseButton(nodeSelection, d);
      }
      
      // Add tooltip handler
      if (this.options.showTooltips) {
        nodeSelection
          .on('mouseover', (event, d) => {
            this.showTooltip(event, d.data.tooltip || d.data.label);
          })
          .on('mousemove', this.moveTooltip.bind(this))
          .on('mouseout', this.hideTooltip.bind(this));
      }
      
      // Add click handler
      if (this.options.callbacks?.onNodeClick) {
        nodeSelection
          .style('cursor', 'pointer')
          .on('click', (_, d) => {
            if (this.options.callbacks?.onNodeClick) {
              this.options.callbacks.onNodeClick(d.data.id, d.data);
            }
          });
      }
    });
    
    // Add drag behavior if enabled
    if (this.options.draggable) {
      this.nodeElements.call(d3.drag<SVGGElement, d3.HierarchyPointNode<TreeNode>>()
        .on('start', this.dragStarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragEnded.bind(this)));
    }
  }
  
  /**
   * Determine the node type for styling purposes
   * @param node Hierarchy node
   * @returns Node type string
   */
  private getNodeType(node: d3.HierarchyNode<TreeNode>): string {
    if (node.data.type) {
      return node.data.type;
    } else if (node === this.hierarchyRoot) {
      return 'root';
    } else if (node.children && node.children.length > 0) {
      return 'branch';
    } else {
      return 'leaf';
    }
  }
  
  /**
   * Create the appropriate shape for a node
   * @param nodeSelection Node's SVG group selection
   * @param node Hierarchy node data
   * @param nodeType Type of node for styling
   */
  private createNodeShape(
    nodeSelection: d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, null, unknown>,
    node: d3.HierarchyNode<TreeNode>,
    nodeType: string
  ): void {
    const nodeStyle = this.options.nodeStyle!;
    const nodeSize = this.options.nodeSize!;
    
    const nodeColor = nodeStyle.colorMap?.[nodeType] || nodeStyle.color || '#fff';
    const borderRadius = nodeStyle.borderRadius || 4;
    const borderColor = nodeStyle.borderColor || '#000';
    const borderWidth = nodeStyle.borderWidth || 1;
    
    // Create rectangular node shape
    nodeSelection.append('rect')
      .attr('x', -nodeSize.width / 2)
      .attr('y', -nodeSize.height / 2)
      .attr('width', nodeSize.width)
      .attr('height', nodeSize.height)
      .attr('rx', borderRadius)
      .attr('ry', borderRadius)
      .attr('fill', nodeColor)
      .attr('stroke', borderColor)
      .attr('stroke-width', borderWidth);
      
    // Add icon if specified
    if (node.data.icon) {
      const iconSize = nodeStyle.iconSize || 16;
      const iconColor = nodeStyle.iconColor || '#000';
      
      nodeSelection.append('text')
        .attr('class', 'node-icon')
        .attr('x', -nodeSize.width / 2 + iconSize / 2 + 5)
        .attr('y', 0)
        .attr('dy', '.35em')
        .attr('font-size', iconSize)
        .attr('fill', iconColor)
        .text(node.data.icon);
    }
  }
  
  /**
   * Add a label to a node
   * @param nodeSelection Node's SVG group selection
   * @param node Hierarchy node data
   */
  private addNodeLabel(
    nodeSelection: d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, null, unknown>,
    node: d3.HierarchyNode<TreeNode>
  ): void {
    const nodeStyle = this.options.nodeStyle!;
    let label = node.data.label;
    
    // Truncate label if needed
    if (this.options.truncateLabels && label.length > this.options.maxLabelLength!) {
      label = label.substring(0, this.options.maxLabelLength!) + '...';
    }
    
    // Add text element
    const fontSize = nodeStyle.fontSize || 12;
    const fontFamily = nodeStyle.fontFamily || 'Arial, sans-serif';
    const textColor = nodeStyle.textColor || '#000';
    
    nodeSelection.append('text')
      .attr('class', 'node-label')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', fontSize)
      .attr('font-family', fontFamily)
      .attr('fill', textColor)
      .text(label);
  }
  
  /**
   * Add collapse/expand button to node
   * @param nodeSelection Node's SVG group selection
   * @param node Hierarchy node data
   */
  private addCollapseButton(
    nodeSelection: d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, null, unknown>,
    node: d3.HierarchyNode<TreeNode>
  ): void {
    const nodeSize = this.options.nodeSize!;
    const buttonRadius = 8;
    const buttonX = nodeSize.width / 2 - buttonRadius / 2;
    const buttonY = 0;
    
    const buttonGroup = nodeSelection.append('g')
      .attr('class', 'collapse-button')
      .attr('transform', `translate(${buttonX}, ${buttonY})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation(); // Prevent node click
        this.toggleNode(d);
      });
    
    // Add button circle
    buttonGroup.append('circle')
      .attr('r', buttonRadius)
      .attr('fill', '#ffffff')
      .attr('stroke', '#333333')
      .attr('stroke-width', 1);
      
    // Add plus or minus symbol based on expanded state
    buttonGroup.append('text')
      .attr('class', 'button-symbol')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', buttonRadius * 1.5)
      .attr('fill', '#333333')
      .text(node.data.expanded ? '−' : '+');
  }
  
  /**
   * Toggle node expanded/collapsed state
   * @param node Hierarchy node to toggle
   */
  private toggleNode(node: d3.HierarchyNode<TreeNode>): void {
    if (node.data.isLeaf || !node.data.children) return;
    
    // Toggle expanded state
    node.data.expanded = !node.data.expanded;
    
    // Trigger appropriate callback
    if (node.data.expanded) {
      if (this.options.callbacks?.onNodeExpand) {
        this.options.callbacks.onNodeExpand(node.data.id, node.data);
      }
    } else {
      if (this.options.callbacks?.onNodeCollapse) {
        this.options.callbacks.onNodeCollapse(node.data.id, node.data);
      }
    }
    
    // Update visualization
    this.updateVisualization();
  }
  
  /**
   * Update the visualization after data changes
   */
  private updateVisualization(): void {
    // Recreate hierarchy and layout
    this.hierarchyRoot = d3.hierarchy(this.options.rootNode, node => 
      node.expanded ? node.children : undefined
    );
    
    // Apply layout
    this.treeLayout(this.hierarchyRoot);
    
    // Rebuild node lookup
    this.buildNodeLookup();
    
    // Link generator
    const linkGenerator = this.createLinkGenerator();
    
    // Duration for transitions
    const duration = this.options.animation?.enabled ? 
      (this.options.animation.duration || 500) : 0;
    
    // Update links
    this.edgeElements = this.mainGroup.select<SVGGElement>('.tree-links').selectAll<SVGPathElement, d3.HierarchyPointLink<TreeNode>>('.tree-link')
      .data(this.hierarchyRoot.links().map(link => link as d3.HierarchyPointLink<TreeNode>), 
        d => `${d.source.data.id}-${d.target.data.id}`);
    
    // Remove old links with animation
    this.edgeElements.exit()
      .transition()
      .duration(duration)
      .attr('opacity', 0)
      .remove();
    
    // Add new links
    const newLinks = this.edgeElements.enter()
      .append('path')
      .attr('class', d => `tree-link ${d.target.data.cssClass || ''}`)
      .attr('d', d => linkGenerator(d))
      .attr('fill', 'none')
      .attr('stroke', d => this.getEdgeColor(d))
      .attr('stroke-width', this.options.edgeStyle?.width || 1.5)
      .attr('stroke-dasharray', d => this.getEdgeDashArray(d))
      .attr('marker-end', d => this.getEdgeMarker(d))
      .attr('opacity', 0);
    
    // Add tooltips to new links
    if (this.options.showTooltips) {
      newLinks
        .on('mouseover', (event, d) => {
          this.showTooltip(event, `${d.source.data.label} → ${d.target.data.label}`);
        })
        .on('mousemove', this.moveTooltip.bind(this))
        .on('mouseout', this.hideTooltip.bind(this));
    }
    
    // Add click handler to new links
    if (this.options.callbacks?.onEdgeClick) {
      newLinks
        .style('cursor', 'pointer')
        .on('click', (_, d) => {
          if (this.options.callbacks?.onEdgeClick) {
            this.options.callbacks.onEdgeClick(
              d.source.data.id,
              d.target.data.id,
              {
                source: d.source.data.id,
                target: d.target.data.id,
                type: d.target.data.type
              } as TreeEdge
            );
          }
        });
    }
    
    // Merge and update all links
    this.edgeElements = newLinks.merge(this.edgeElements as any);
    
    this.edgeElements.transition()
      .duration(duration)
      .attr('d', d => linkGenerator(d))
      .attr('opacity', 1);
    
    // Update nodes
    this.nodeElements = this.mainGroup.select<SVGGElement>('.tree-nodes')
      .selectAll<SVGGElement, d3.HierarchyPointNode<TreeNode>>('.tree-node')
      .data(this.hierarchyRoot.descendants().map(node => node as d3.HierarchyPointNode<TreeNode>), 
        d => d.data.id);
    
    // Remove old nodes with animation
    this.nodeElements.exit()
      .transition()
      .duration(duration)
      .attr('transform', (d: any) => {
        if (d.parent) {
          const [px, py] = this.nodePosition(d.parent as d3.HierarchyPointNode<TreeNode>);
          return `translate(${px}, ${py})`;
        }
        return `translate(${d.x}, ${d.y})`;
      })
      .attr('opacity', 0)
      .remove();
    
    // Add new nodes
    const newNodes = this.nodeElements.enter()
      .append('g')
      .attr('class', d => `tree-node ${d.data.cssClass || ''}`)
      .attr('transform', d => {
        // Start from parent position if available for better animation
        if (d.parent) {
          const [px, py] = this.nodePosition(d.parent);
          return `translate(${px}, ${py})`;
        }
        const [x, y] = this.nodePosition(d);
        return `translate(${x}, ${y})`;
      })
      .attr('opacity', 0);
    
    // Add node shapes to new nodes
    newNodes.each((d, i, nodes) => {
      const nodeSelection = d3.select(nodes[i]) as d3.Selection<SVGGElement, d3.HierarchyPointNode<TreeNode>, null, unknown>;
      const nodeType = this.getNodeType(d);
      
      // Create node shape
      this.createNodeShape(nodeSelection, d, nodeType);
      
      // Add node label if enabled
      if (this.options.showLabels) {
        this.addNodeLabel(nodeSelection, d);
      }
      
      // Add collapse/expand button if collapsible and not a leaf
      if (this.options.collapsible && !d.data.isLeaf) {
        this.addCollapseButton(nodeSelection, d);
      }
      
      // Add tooltip handler
      if (this.options.showTooltips) {
        nodeSelection
          .on('mouseover', (event, d) => {
            this.showTooltip(event, d.data.tooltip || d.data.label);
          })
          .on('mousemove', this.moveTooltip.bind(this))
          .on('mouseout', this.hideTooltip.bind(this));
      }
      
      // Add click handler
      if (this.options.callbacks?.onNodeClick) {
        nodeSelection
          .style('cursor', 'pointer')
          .on('click', (_, d) => {
            if (this.options.callbacks?.onNodeClick) {
              this.options.callbacks.onNodeClick(d.data.id, d.data);
            }
          });
      }
    });
    
    // Add drag behavior to new nodes if enabled
    if (this.options.draggable) {
      newNodes.call(d3.drag<SVGGElement, d3.HierarchyPointNode<TreeNode>>()
        .on('start', this.dragStarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragEnded.bind(this)));
    }
    
    // Merge and update all nodes
    this.nodeElements = newNodes.merge(this.nodeElements as any);
    
    this.nodeElements.transition()
      .duration(duration)
      .attr('transform', d => {
        const [x, y] = this.nodePosition(d);
        return `translate(${x}, ${y})`;
      })
      .attr('opacity', 1);
      
    // Update collapse button symbols
    this.nodeElements.select('.button-symbol')
      .text(d => d.data.expanded ? '−' : '+');
  }
  
  /**
   * Get edge color based on its type
   * @param edge Edge data
   * @returns Color string
   */
  private getEdgeColor(edge: d3.HierarchyPointLink<TreeNode>): string {
    if (edge.target.data.type && this.options.edgeStyle?.colorMap?.[edge.target.data.type]) {
      return this.options.edgeStyle.colorMap[edge.target.data.type];
    }
    return this.options.edgeStyle?.color || '#95a5a6';
  }
  
  /**
   * Get edge dash array for dashed lines
   * @param edge Edge data
   * @returns Dash array string or null
   */
  private getEdgeDashArray(edge: d3.HierarchyPointLink<TreeNode>): string | null {
    // Check if there's an explicit edge object
    const explicitEdge = this.options.edges?.find(e => 
      e.source === edge.source.data.id && e.target === edge.target.data.id
    );
    
    if (explicitEdge?.dashed) {
      return '5,5';
    }
    
    return null;
  }
  
  /**
   * Get edge marker (arrowhead) if arrows are enabled
   * @param edge Edge data
   * @returns Marker attribute value
   */
  private getEdgeMarker(edge: d3.HierarchyPointLink<TreeNode>): string {
    if (!this.options.edgeStyle?.showArrows) {
      return '';
    }
    
    if (edge.target.data.type && this.options.edgeStyle?.colorMap?.[edge.target.data.type]) {
      return `url(#arrow-${edge.target.data.type})`;
    }
    
    return 'url(#arrow-default)';
  }
  
  /**
   * Show tooltip with specified content
   * @param event Mouse event
   * @param content Tooltip content
   */
  private showTooltip(event: any, content: string): void {
    if (!this.options.showTooltips || !this.tooltipDiv) return;
    
    this.tooltipDiv
      .style('visibility', 'visible')
      .style('opacity', 0)
      .html(content)
      .transition()
      .duration(this.options.tooltipConfig?.delay || 300)
      .style('opacity', 0.9);
      
    this.moveTooltip(event);
  }
  
  /**
   * Move tooltip to follow mouse position
   * @param event Mouse event
   */
  private moveTooltip(event: any): void {
    if (!this.options.showTooltips || !this.tooltipDiv) return;
    
    const position = this.options.tooltipConfig?.position || 'top';
    const offsetX = 10;
    const offsetY = 10;
    
    const tooltipWidth = this.tooltipDiv.node()?.offsetWidth || 100;
    const tooltipHeight = this.tooltipDiv.node()?.offsetHeight || 50;
    
    let x = event.pageX;
    let y = event.pageY;
    
    switch (position) {
      case 'top':
        x = x - tooltipWidth / 2;
        y = y - tooltipHeight - offsetY;
        break;
      case 'bottom':
        x = x - tooltipWidth / 2;
        y = y + offsetY;
        break;
      case 'left':
        x = x - tooltipWidth - offsetX;
        y = y - tooltipHeight / 2;
        break;
      case 'right':
        x = x + offsetX;
        y = y - tooltipHeight / 2;
        break;
    }
    
    // Make sure tooltip stays within window
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    x = Math.max(0, Math.min(x, windowWidth - tooltipWidth));
    y = Math.max(0, Math.min(y, windowHeight - tooltipHeight));
    
    this.tooltipDiv
      .style('left', `${x}px`)
      .style('top', `${y}px`);
  }
  
  /**
   * Hide tooltip
   */
  private hideTooltip(): void {
    if (!this.options.showTooltips || !this.tooltipDiv) return;
    
    this.tooltipDiv
      .transition()
      .duration(100)
      .style('opacity', 0)
      .style('visibility', 'hidden');
  }
  
  /**
   * Create a minimap for the tree diagram
   */
  private createMinimap(): void {
    const miniMapWidth = this.options.minimapSize?.width || 150;
    const miniMapHeight = this.options.minimapSize?.height || 100;
    const padding = 10;
    
    // Create minimap container
    const miniMap = this.svg.append('g')
      .attr('class', 'tree-minimap')
      .attr('transform', `translate(${this.width - miniMapWidth - padding}, ${padding})`);
    
    // Add background
    miniMap.append('rect')
      .attr('width', miniMapWidth)
      .attr('height', miniMapHeight)
      .attr('fill', '#f5f5f5')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);
    
    // Get bounds of the tree
    const bounds = this.calculateBounds();
    
    // Calculate scale
    const scaleX = (miniMapWidth - 10) / (bounds.maxX - bounds.minX || 1);
    const scaleY = (miniMapHeight - 10) / (bounds.maxY - bounds.minY || 1);
    const scale = Math.min(scaleX, scaleY);
    
    // Add nodes to minimap
    miniMap.selectAll('.mini-node')
      .data(this.hierarchyRoot.descendants())
      .enter()
      .append('circle')
      .attr('class', 'mini-node')
      .attr('cx', d => {
        const [x, ] = this.nodePosition(d as d3.HierarchyPointNode<TreeNode>);
        return (x - bounds.minX) * scale + 5;
      })
      .attr('cy', d => {
        const [, y] = this.nodePosition(d as d3.HierarchyPointNode<TreeNode>);
        return (y - bounds.minY) * scale + 5;
      })
      .attr('r', 2)
      .attr('fill', d => {
        const nodeType = this.getNodeType(d);
        return this.options.nodeStyle?.colorMap?.[nodeType] || this.options.nodeStyle?.color || '#4285F4';
      });
      
    // Add links to minimap
    miniMap.selectAll('.mini-link')
      .data(this.hierarchyRoot.links())
      .enter()
      .append('line')
      .attr('class', 'mini-link')
      .attr('x1', d => {
        const [x, ] = this.nodePosition(d.source as d3.HierarchyPointNode<TreeNode>);
        return (x - bounds.minX) * scale + 5;
      })
      .attr('y1', d => {
        const [, y] = this.nodePosition(d.source as d3.HierarchyPointNode<TreeNode>);
        return (y - bounds.minY) * scale + 5;
      })
      .attr('x2', d => {
        const [x, ] = this.nodePosition(d.target as d3.HierarchyPointNode<TreeNode>);
        return (x - bounds.minX) * scale + 5;
      })
      .attr('y2', d => {
        const [, y] = this.nodePosition(d.target as d3.HierarchyPointNode<TreeNode>);
        return (y - bounds.minY) * scale + 5;
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 0.5);
      
    // Add viewport indicator if zoomable
    if (this.options.zoomable) {
      const viewportRect = miniMap.append('rect')
        .attr('class', 'viewport-indicator')
        .attr('width', miniMapWidth)
        .attr('height', miniMapHeight)
        .attr('fill', 'none')
        .attr('stroke', '#0066ff')
        .attr('stroke-width', 1.5);
        
      // Update viewport on zoom
      this.zoom.on('zoom.minimap', (event) => {
        const { x, y, k } = event.transform;
        
        // Calculate viewport size and position
        const vpWidth = this.width / k * scale;
        const vpHeight = this.height / k * scale;
        const vpX = -x / k * scale + 5;
        const vpY = -y / k * scale + 5;
        
        // Update viewport indicator
        viewportRect
          .attr('x', Math.max(0, Math.min(vpX, miniMapWidth)))
          .attr('y', Math.max(0, Math.min(vpY, miniMapHeight)))
          .attr('width', Math.min(vpWidth, miniMapWidth))
          .attr('height', Math.min(vpHeight, miniMapHeight));
      });
    }
  }
  
  /**
   * Calculate the bounds of the tree
   * @returns Bounds object with min and max coordinates
   */
  private calculateBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    const positions = this.hierarchyRoot.descendants().map(node => this.nodePosition(node as d3.HierarchyPointNode<TreeNode>));
    
    return {
      minX: Math.min(...positions.map(pos => pos[0])) - this.options.nodeSize!.width / 2,
      minY: Math.min(...positions.map(pos => pos[1])) - this.options.nodeSize!.height / 2,
      maxX: Math.max(...positions.map(pos => pos[0])) + this.options.nodeSize!.width / 2,
      maxY: Math.max(...positions.map(pos => pos[1])) + this.options.nodeSize!.height / 2
    };
  }
  
  /**
   * Handle drag start event
   * @param event Drag event
   * @param d Node data
   */
  private dragStarted(): void {
    if (this.options.zoomable) {
      this.svg.on('.zoom', null);
    }
  }
  
  /**
   * Handle drag event
   * @param event Drag event
   * @param d Node data
   */
  private dragged(event: any, d: d3.HierarchyPointNode<TreeNode>): void {
    // Move the node
    const [currentX, currentY] = this.nodePosition(d);
    const dx = event.dx;
    const dy = event.dy;
    
    // Update the node's position
    // Here we need to update d.x and d.y directly, which will be translated
    // to absolute position by the nodePosition function
    d.x += dx;
    d.y += dy;
    
    // Update node visual position
    d3.select(event.sourceEvent.currentTarget)
      .attr('transform', `translate(${currentX + dx}, ${currentY + dy})`);
      
    // Update connected links
    this.updateConnectedLinks(d);
  }
  
  /**
   * Handle drag end event
   * @param event Drag event
   * @param d Node data
   */
  private dragEnded(): void {
    if (this.options.zoomable) {
      this.svg.call(this.zoom);
    }
  }
  
  /**
   * Update links connected to a node after dragging
   * @param node Node that was dragged
   */
  private updateConnectedLinks(node: d3.HierarchyPointNode<TreeNode>): void {
    const linkGenerator = this.createLinkGenerator();
    
    // Update links where node is source
    this.edgeElements
      .filter(link => link.source === node || link.target === node)
      .attr('d', linkGenerator);
  }
  
  /**
   * Select specific nodes by ID
   * @param nodeIds Array of node IDs to select
   */
  public selectNodes(nodeIds: string[]): void {
    // Reset all node selections
    this.nodeElements.select('rect, circle')
      .attr('stroke', this.options.nodeStyle?.borderColor || '#2c3e50')
      .attr('stroke-width', this.options.nodeStyle?.borderWidth || 1);
      
    // Highlight selected nodes
    this.nodeElements
      .filter(d => nodeIds.includes(d.data.id))
      .select('rect, circle')
      .attr('stroke', '#FFC107')
      .attr('stroke-width', 3);
      
    // Update selected node IDs
    this.options.selectedNodeIds = nodeIds;
    
    // Trigger selection callback
    if (this.options.callbacks?.onNodeSelect) {
      nodeIds.forEach(id => {
        const node = this.nodesById.get(id);
        if (node) {
          this.options.callbacks!.onNodeSelect!(id, node.data);
        }
      });
    }
  }
  
  /**
   * Expand a specific node by ID
   * @param nodeId ID of the node to expand
   */
  public expandNode(nodeId: string): void {
    const node = this.nodesById.get(nodeId);
    if (node && !node.data.expanded && !node.data.isLeaf) {
      node.data.expanded = true;
      this.updateVisualization();
      
      if (this.options.callbacks?.onNodeExpand) {
        this.options.callbacks.onNodeExpand(nodeId, node.data);
      }
    }
  }
  
  /**
   * Collapse a specific node by ID
   * @param nodeId ID of the node to collapse
   */
  public collapseNode(nodeId: string): void {
    const node = this.nodesById.get(nodeId);
    if (node && node.data.expanded && !node.data.isLeaf) {
      node.data.expanded = false;
      this.updateVisualization();
      
      if (this.options.callbacks?.onNodeCollapse) {
        this.options.callbacks.onNodeCollapse(nodeId, node.data);
      }
    }
  }
  
  /**
   * Expand all nodes in the tree
   */
  public expandAll(): void {
    this.hierarchyRoot.descendants().forEach(node => {
      if (!node.data.isLeaf) {
        node.data.expanded = true;
      }
    });
    
    this.updateVisualization();
  }
  
  /**
   * Collapse all nodes in the tree except for the root
   */
  public collapseAll(): void {
    this.hierarchyRoot.descendants().forEach(node => {
      if (node !== this.hierarchyRoot) {
        node.data.expanded = false;
      }
    });
    
    this.updateVisualization();
  }
  
  /**
   * Center the tree view on a specific node
   * @param nodeId ID of the node to center on
   */
  public centerOnNode(nodeId: string): void {
    const node = this.nodesById.get(nodeId);
    if (!node) return;
    
    // Ensure the node is visible (expand ancestors)
    this.ensureNodeVisible(nodeId);
    
    // Get node position
    const [x, y] = this.nodePosition(node as d3.HierarchyPointNode<TreeNode>);
    
    // Calculate center transform
    const transform = d3.zoomIdentity
      .translate(this.width / 2 - x, this.height / 2 - y)
      .scale(this.options.initialZoom || 1);
      
    // Apply transform with transition
    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, transform);
  }
  
  /**
   * Ensure a node is visible by expanding all its ancestors
   * @param nodeId ID of the node to make visible
   */
  public ensureNodeVisible(nodeId: string): void {
    // Find the node
    const node = this.nodesById.get(nodeId);
    if (!node) return;
    
    // Start from this node and go up to the root
    let current = node;
    while (current.parent) {
      current.parent.data.expanded = true;
      current = current.parent;
    }
    
    // Update the visualization
    this.updateVisualization();
  }
  
  /**
   * Find a node by ID
   * @param nodeId Node ID to find
   * @returns The tree node or undefined if not found
   */
  public findNode(nodeId: string): TreeNode | undefined {
    const node = this.nodesById.get(nodeId);
    return node?.data;
  }
  
  /**
   * Get the path from root to a specific node
   * @param nodeId ID of the target node
   * @returns Array of node IDs in the path
   */
  public getPathToNode(nodeId: string): string[] {
    const path: string[] = [];
    const node = this.nodesById.get(nodeId);
    
    if (!node) return path;
    
    // Start from the node and go up to the root
    let current: d3.HierarchyNode<TreeNode> | null = node;
    while (current) {
      path.unshift(current.data.id);
      current = current.parent;
    }
    
    return path;
  }
  
  /**
   * Update the tree with new data
   * @param rootNode New root node data
   */
  public updateData(rootNode: TreeNode): void {
    this.options.rootNode = rootNode;
    this.preprocessData();
    
    // Recreate hierarchy and layout
    this.createTreeLayout();
    
    // Update visualization
    this.updateVisualization();
  }
  
  /**
   * Update visualization options
   * @param options New options to apply
   */
  public updateOptions(options: Partial<TreeDiagramOptions>): void {
    // Keep existing rootNode if not provided
    if (!options.rootNode) {
      options.rootNode = this.options.rootNode;
    }
    
    this.options = this.applyDefaultOptions(options as TreeDiagramOptions);
    
    // Reprocess data if needed
    if (options.rootNode || options.expandAll !== undefined || options.initialExpandLevel !== undefined) {
      this.preprocessData();
    }
    
    // Recreate layout if needed
    if (options.orientation !== undefined || options.direction !== undefined ||
        options.nodeSeparation !== undefined || options.levelSeparation !== undefined) {
      this.createTreeLayout();
    }
    
    // Update arrowheads if changed
    if (options.edgeStyle) {
      const defs = this.svg.select('defs') as d3.Selection<SVGDefsElement, unknown, null, undefined>;
      defs.selectAll('*').remove();
      this.createArrowMarkers(defs);
    }
    
    // Update visualization
    this.updateVisualization();
  }
  
  /**
   * Handles window resize
   */
  private handleResize = (): void => {
    this.width = this.options.width || this.container.clientWidth || 800;
    this.height = this.options.height || this.container.clientHeight || 600;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
      
    // Update minimap position if present
    if (this.options.showMinimap) {
      const miniMapWidth = this.options.minimapSize?.width || 150;
      const padding = 10;
      
      this.svg.select('.tree-minimap')
        .attr('transform', `translate(${this.width - miniMapWidth - padding}, ${padding})`);
    }
  };
  
  /**
   * Render or re-render the visualization
   */
  public render(): void {
    // Update dimensions
    this.width = this.options.width || this.container.clientWidth || 800;
    this.height = this.options.height || this.container.clientHeight || 600;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
      
    // Recreate hierarchy and layout if orientation depends on dimensions
    if (this.options.orientation === 'radial') {
      this.createTreeLayout();
      this.updateVisualization();
    }
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    window.removeEventListener('resize', this.handleResize);
    
    if (this.svg) {
      this.svg.remove();
    }
    
    if (this.tooltipDiv) {
      this.tooltipDiv.remove();
    }
  }
}