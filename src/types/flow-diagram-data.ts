/**
 * Type definitions for flow diagram visualizations
 * Provides interfaces for flow charts, process diagrams, and directed graphs
 */

/**
 * Represents a node in a flow diagram
 */
export interface FlowNode {
    /** Unique identifier for the node */
    id: string;
    
    /** Display label for the node */
    label: string;
    
    /** Type of node that determines its shape and behavior */
    type: 'process' | 'decision' | 'start' | 'end' | 'io' | 'database' | 'document' | 'manual' | 'preparation' | 'subroutine' | 'custom';
    
    /** Detailed description for the node (shown in tooltip or details panel) */
    description?: string;
    
    /** Position of the node in the diagram (if manually positioned) */
    position?: {
      x: number;
      y: number;
    };
    
    /** Dimensions of the node */
    size?: {
      width: number;
      height: number;
    };
    
    /** Optional properties that can be attached to the node */
    properties?: Record<string, any>;
    
    /** Visual styling for this specific node */
    style?: FlowNodeStyle;
    
    /** Whether the node is currently expanded (for collapsible nodes) */
    expanded?: boolean;
    
    /** Child nodes if this is a parent node in a hierarchical diagram */
    children?: string[];
    
    /** Whether the node is collapsible */
    collapsible?: boolean;
    
    /** Whether the node has a details panel */
    hasDetails?: boolean;
    
    /** Status of the node (can be used for visual indication or filtering) */
    status?: 'active' | 'inactive' | 'error' | 'warning' | 'success' | string;
  }
  
  /**
   * Styling options for flow nodes
   */
  export interface FlowNodeStyle {
    /** Fill color of the node */
    fillColor?: string;
    
    /** Border color of the node */
    borderColor?: string;
    
    /** Width of the node border in pixels */
    borderWidth?: number;
    
    /** Border style */
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    
    /** Text color for the node label */
    textColor?: string;
    
    /** Font size for the node label */
    fontSize?: number;
    
    /** Font weight for the node label */
    fontWeight?: 'normal' | 'bold' | number;
    
    /** Opacity of the node (0-1) */
    opacity?: number;
    
    /** Shadow effect for the node */
    shadow?: boolean;
    
    /** Corner radius for rectangular nodes */
    cornerRadius?: number;
    
    /** Custom shape for the node (SVG path) */
    customShape?: string;
    
    /** Icon to display in the node */
    icon?: {
      /** Path to the icon image or SVG code */
      path: string;
      
      /** Width of the icon */
      width?: number;
      
      /** Height of the icon */
      height?: number;
      
      /** Position of the icon relative to the label */
      position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
    };
  }
  
  /**
   * Represents an edge (connection) in a flow diagram
   */
  export interface FlowEdge {
    /** Unique identifier for the edge */
    id?: string;
    
    /** Source node ID */
    source: string;
    
    /** Target node ID */
    target: string;
    
    /** Label for the edge */
    label?: string;
    
    /** Edge type that determines its behavior */
    type?: 'normal' | 'success' | 'failure' | 'conditional' | 'bidirectional';
    
    /** Condition or expression that determines when this path is taken */
    condition?: string;
    
    /** Detailed description for the edge */
    description?: string;
    
    /** Whether the edge represents a directed connection */
    directed?: boolean;
    
    /** Weight or importance of the connection (can affect layout) */
    weight?: number;
    
    /** Visual styling for this specific edge */
    style?: FlowEdgeStyle;
    
    /** Control points for custom edge routing (array of x,y coordinates) */
    controlPoints?: Array<{x: number, y: number}>;
    
    /** Whether this edge represents a primary/main path */
    isPrimary?: boolean;
    
    /** Optional properties that can be attached to the edge */
    properties?: Record<string, any>;
  }
  
  /**
   * Styling options for flow edges
   */
  export interface FlowEdgeStyle {
    /** Color of the edge line */
    lineColor?: string;
    
    /** Width of the edge line in pixels */
    lineWidth?: number;
    
    /** Style of the edge line */
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    
    /** Text color for the edge label */
    textColor?: string;
    
    /** Font size for the edge label */
    fontSize?: number;
    
    /** Opacity of the edge (0-1) */
    opacity?: number;
    
    /** Type of arrow marker to use */
    arrowType?: 'triangle' | 'circle' | 'diamond' | 'custom';
    
    /** Size of the arrow marker */
    arrowSize?: number;
    
    /** Whether to show an arrow at the start of the edge */
    startArrow?: boolean;
    
    /** Whether to show an arrow at the end of the edge */
    endArrow?: boolean;
    
    /** Position of the label along the edge (0-1) */
    labelPosition?: number;
    
    /** Background color for the label */
    labelBackgroundColor?: string;
    
    /** Whether to use curved edges */
    curved?: boolean;
    
    /** Curvature amount when using curved edges (0-1) */
    curvature?: number;
  }
  
  /**
   * Complete flow diagram data structure
   */
  export interface FlowDiagramData {
    /** Array of nodes in the diagram */
    nodes: FlowNode[];
    
    /** Array of edges in the diagram */
    edges: FlowEdge[];
    
    /** Title of the diagram */
    title?: string;
    
    /** Optional description of the diagram */
    description?: string;
    
    /** Groups of nodes (used for visual organization) */
    groups?: Array<{
      /** Unique identifier for the group */
      id: string;
      
      /** Display label for the group */
      label: string;
      
      /** IDs of nodes in this group */
      nodeIds: string[];
      
      /** Visual styling for the group */
      style?: {
        /** Fill color of the group background */
        fillColor?: string;
        
        /** Border color of the group */
        borderColor?: string;
        
        /** Width of the group border in pixels */
        borderWidth?: number;
        
        /** Text color for the group label */
        textColor?: string;
        
        /** Padding inside the group in pixels */
        padding?: number;
      };
    }>;
    
    /** Default style for all nodes (can be overridden by individual nodes) */
    defaultNodeStyle?: FlowNodeStyle;
    
    /** Default style for all edges (can be overridden by individual edges) */
    defaultEdgeStyle?: FlowEdgeStyle;
    
    /** Type-specific node styles (applied based on node type) */
    nodeStyles?: Record<string, FlowNodeStyle>;
    
    /** Type-specific edge styles (applied based on edge type) */
    edgeStyles?: Record<string, FlowEdgeStyle>;
    
    /** Metadata about the diagram */
    metadata?: {
      /** Author of the diagram */
      author?: string;
      
      /** Creation date */
      createdAt?: string;
      
      /** Last modification date */
      modifiedAt?: string;
      
      /** Version of the diagram */
      version?: string;
      
      /** Any additional properties */
      [key: string]: any;
    };
  }
  
  /**
   * Configuration options for flow diagram visualization
   */
  export interface FlowDiagramConfiguration {
    /** Flow diagram data to display */
    data: FlowDiagramData;
    
    /** Direction of the diagram layout */
    direction?: 'TB' | 'BT' | 'LR' | 'RL';
    
    /** Whether to use automatic layout or manual positioning */
    autoLayout?: boolean;
    
    /** Layout algorithm to use */
    layoutAlgorithm?: 'dagre' | 'breadthfirst' | 'concentric' | 'grid' | 'cola' | 'klay';
    
    /** Spacing between nodes horizontally */
    horizontalSpacing?: number;
    
    /** Spacing between nodes vertically */
    verticalSpacing?: number;
    
    /** Whether to rank nodes by levels */
    rankNodes?: boolean;
    
    /** Whether to align nodes in the same rank */
    alignRankNodes?: boolean;
    
    /** Whether to show node labels */
    showNodeLabels?: boolean;
    
    /** Whether to show edge labels */
    showEdgeLabels?: boolean;
    
    /** Whether to enable interactive features */
    interactive?: boolean;
    
    /** Whether nodes can be dragged */
    draggable?: boolean;
    
    /** Whether the diagram can be zoomed and panned */
    zoomable?: boolean;
    
    /** Initial zoom level (1 = 100%) */
    initialZoom?: number;
    
    /** Whether to show tooltips on hover */
    showTooltips?: boolean;
    
    /** Whether to highlight connected nodes/edges on hover */
    highlightConnections?: boolean;
    
    /** Whether to fit the diagram to the container */
    fitToContainer?: boolean;
    
    /** Whether to show grid in the background */
    showGrid?: boolean;
    
    /** Grid size in pixels */
    gridSize?: number;
    
    /** Whether to snap to grid when dragging */
    snapToGrid?: boolean;
    
    /** Whether to show a mini-map */
    showMiniMap?: boolean;
    
    /** Whether to animate changes to the diagram */
    animate?: boolean;
    
    /** Duration of animations in milliseconds */
    animationDuration?: number;
    
    /** Nodes to highlight initially */
    highlightNodes?: string[];
    
    /** Edges to highlight initially */
    highlightEdges?: string[];
  }