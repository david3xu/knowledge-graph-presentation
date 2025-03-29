/**
 * Core type definitions for knowledge graph data structures
 * Provides interfaces for nodes, edges, and complete graph datasets
 */

/**
 * Represents a node in a knowledge graph
 */
export interface GraphNode {
    /** Unique identifier for the node */
    id: string;
    
    /** Display label for the node (optional, falls back to id) */
    label?: string;
    
    /** Semantic type of the node (e.g., Person, Organization, Concept) */
    type: string;
    
    /** Optional properties that can be attached to the node */
    properties?: Record<string, any>;
    
    /** Optional positional information for fixed layouts */
    position?: {
      x: number;
      y: number;
    };
    
    /** Visual styling overrides for this specific node */
    style?: NodeStyle;
  
    /** Indicates if this node represents a group of nodes */
    isGroup?: boolean;
    
    /** If this is a group node, contains ids of child nodes */
    children?: string[];
  }
  
  /**
   * Represents an edge in a knowledge graph
   */
  export interface GraphEdge {
    /** Optional unique identifier for the edge */
    id?: string;
    
    /** Identifier of the source node */
    source: string;
    
    /** Identifier of the target node */
    target: string;
    
    /** Relationship type or label */
    label?: string;
    
    /** Edge direction - default is directed */
    directed?: boolean;
    
    /** Optional properties that can be attached to the edge */
    properties?: Record<string, any>;
    
    /** Visual styling overrides for this specific edge */
    style?: EdgeStyle;
    
    /** Weight of the relationship (for weighted graphs) */
    weight?: number;
  }
  
  /**
   * Styling options for nodes
   */
  export interface NodeStyle {
    /** Color of the node */
    color?: string;
    
    /** Border color */
    borderColor?: string;
    
    /** Border width in pixels */
    borderWidth?: number;
    
    /** Node shape (circle, rectangle, diamond, etc.) */
    shape?: 'circle' | 'rectangle' | 'diamond' | 'triangle' | 'hexagon' | 'star';
    
    /** Size of the node (diameter for circle, width for other shapes) */
    size?: number;
    
    /** Opacity from 0 to 1 */
    opacity?: number;
    
    /** Font size for label */
    fontSize?: number;
    
    /** Font color for label */
    fontColor?: string;
    
    /** Label position relative to node */
    labelPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  }
  
  /**
   * Styling options for edges
   */
  export interface EdgeStyle {
    /** Color of the edge line */
    color?: string;
    
    /** Width of the edge line in pixels */
    width?: number;
    
    /** Line style */
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    
    /** Opacity from 0 to 1 */
    opacity?: number;
    
    /** Arrow shape for directed edges */
    arrowShape?: 'triangle' | 'circle' | 'diamond' | 'none';
    
    /** Font size for label */
    fontSize?: number;
    
    /** Font color for label */
    fontColor?: string;
  }
  
  /**
   * Complete graph data structure containing nodes and edges
   */
  export interface GraphData {
    /** Array of nodes in the graph */
    nodes: GraphNode[];
    
    /** Array of edges in the graph */
    edges: GraphEdge[];
    
    /** Optional metadata about the graph */
    metadata?: {
      /** Name or title of the graph */
      name?: string;
      
      /** Description of what the graph represents */
      description?: string;
      
      /** Date when the graph was created or last modified */
      lastModified?: string;
      
      /** Source of the graph data */
      source?: string;
      
      /** Any additional properties */
      [key: string]: any;
    };
  }
  
  /**
   * Graph layout options
   */
  export interface GraphLayoutOptions {
    /** Name of the layout algorithm */
    name: 'random' | 'grid' | 'circle' | 'concentric' | 'breadthfirst' | 'cose' | 'dagre' | 'force-directed';
    
    /** Padding around the graph */
    padding?: number;
    
    /** Whether the layout should be fit to the container */
    fit?: boolean;
    
    /** Spacing between connected nodes */
    spacingFactor?: number;
    
    /** Whether the layout positioning is deterministic */
    randomize?: boolean;
    
    /** Layout-specific options */
    [key: string]: any;
  }
  
  /**
   * Filter criteria for graph elements
   */
  export interface GraphFilter {
    /** Filter by node types */
    nodeTypes?: string[];
    
    /** Filter by edge types */
    edgeTypes?: string[];
    
    /** Filter by property values */
    properties?: Record<string, any>;
    
    /** Custom filter function */
    customFilter?: (node: GraphNode | GraphEdge) => boolean;
  }