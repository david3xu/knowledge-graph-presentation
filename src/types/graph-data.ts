/**
 * Core type definitions for knowledge graph data structures
 * Provides interfaces for nodes, edges, and complete graph datasets
 */

import * as d3 from 'd3';

/**
 * Represents a node in a knowledge graph
 */
export interface GraphNode extends d3.SimulationNodeDatum {
  /** Unique identifier for the node */
  id: string;
  
  /** Display label for the node (optional, falls back to id) */
  label?: string;
  
  /** Semantic type of the node (e.g., Person, Organization, Concept) */
  type?: string;
  
  /** Optional properties that can be attached to the node */
  properties?: Record<string, any>;
  
  /** Optional positional information for fixed layouts */
  x?: number;
  y?: number;
  
  /** Visual styling overrides for this specific node */
  style?: NodeStyle;

  /** Indicates if this node represents a group of nodes */
  isGroup?: boolean;
  
  /** If this is a group node, contains ids of child nodes */
  children?: string[];

  /** Color of the node */
  color?: string;
  
  /** Size of the node (diameter for circle, width for other shapes) */
  size?: number;
  
  /** Node shape (circle, rectangle, diamond, etc.) */
  shape?: string;
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

/**
 * Graph node properties specific to Knowledge Graphs
 */
export interface KnowledgeGraphNodeProperties {
  /** URI identifier for the entity */
  uri?: string;
  
  /** Detailed description */
  description?: string;
  
  /** Aliases or alternative names */
  aliases?: string[];
  
  /** External references to other knowledge bases */
  externalRefs?: {
    system: string;
    id: string;
    url?: string;
  }[];
  
  /** Confidence score (0-1) */
  confidence?: number;
  
  /** Creation timestamp */
  createdAt?: string;
  
  /** Last updated timestamp */
  updatedAt?: string;
  
  /** Source of the entity information */
  source?: string;
  
  /** Entity status */
  status?: 'active' | 'deprecated' | 'proposed';
  
  /** Domain-specific attributes */
  domainAttributes?: Record<string, any>;
}

/**
 * Graph edge properties specific to Knowledge Graphs
 */
export interface KnowledgeGraphEdgeProperties {
  /** URI identifier for the relationship */
  uri?: string;
  
  /** Detailed description of the relationship */
  description?: string;
  
  /** Quantitative strength of the relationship (0-1) */
  strength?: number;
  
  /** Confidence score (0-1) */
  confidence?: number;
  
  /** Temporal validity of the relationship */
  temporalScope?: {
    startDate?: string;
    endDate?: string;
    isCurrentlyValid?: boolean;
  };
  
  /** Provenance information */
  provenance?: {
    source: string;
    method?: string;
    extractedAt?: string;
  };
  
  /** Creation timestamp */
  createdAt?: string;
  
  /** Last updated timestamp */
  updatedAt?: string;
  
  /** Relationship status */
  status?: 'active' | 'deprecated' | 'proposed';
  
  /** External references to other knowledge bases */
  externalRefs?: {
    system: string;
    id: string;
    url?: string;
  }[];
}

/**
 * Graph traversal options
 */
export interface GraphTraversalOptions {
  /** Starting node ID */
  startNodeId: string;
  
  /** Maximum depth to traverse */
  maxDepth?: number;
  
  /** Edge types to follow */
  edgeTypes?: string[];
  
  /** Direction of traversal */
  direction?: 'outbound' | 'inbound' | 'both';
  
  /** Maximum number of nodes to return */
  limit?: number;
  
  /** Filter function for nodes to include */
  nodeFilter?: (node: GraphNode) => boolean;
  
  /** Filter function for edges to follow */
  edgeFilter?: (edge: GraphEdge) => boolean;
  
  /** Whether to include the starting node in the result */
  includeStartNode?: boolean;
  
  /** Custom traversal strategy */
  strategy?: 'breadthFirst' | 'depthFirst';
}

/**
 * Result of a graph traversal operation
 */
export interface GraphTraversalResult {
  /** Nodes visited during traversal */
  nodes: GraphNode[];
  
  /** Edges traversed */
  edges: GraphEdge[];
  
  /** Path information */
  paths: {
    /** Path from start node to each visited node */
    [targetNodeId: string]: {
      /** Node IDs in the path */
      nodeIds: string[];
      
      /** Edge IDs in the path */
      edgeIds: string[];
      
      /** Total path length (number of edges) */
      distance: number;
    };
  };
  
  /** Statistics about the traversal */
  statistics: {
    /** Total nodes visited */
    nodesVisited: number;
    
    /** Total edges traversed */
    edgesTraversed: number;
    
    /** Depth reached */
    maxDepthReached: number;
    
    /** Time taken for traversal (ms) */
    executionTime: number;
  };
}

/**
 * Graph similarity measure options
 */
export interface GraphSimilarityOptions {
  /** Type of similarity measure to use */
  measure: 'jaccard' | 'cosine' | 'euclidean' | 'pearson' | 'custom';
  
  /** Node features to consider */
  nodeFeatures?: string[];
  
  /** Edge features to consider */
  edgeFeatures?: string[];
  
  /** Weight factors for different features */
  weights?: Record<string, number>;
  
  /** Custom similarity function */
  customFunction?: (g1: GraphData, g2: GraphData) => number;
}

/**
 * Graph clustering options
 */
export interface GraphClusteringOptions {
  /** Clustering algorithm to use */
  algorithm: 'louvain' | 'kmeans' | 'hierarchical' | 'spectral' | 'custom';
  
  /** Number of clusters (for algorithms that require it) */
  numClusters?: number;
  
  /** Distance metric to use */
  distanceMetric?: 'euclidean' | 'manhattan' | 'jaccard' | 'cosine';
  
  /** Features to use for clustering */
  features?: string[];
  
  /** Minimum cluster size */
  minClusterSize?: number;
  
  /** Algorithm-specific parameters */
  parameters?: Record<string, any>;
}

/**
 * Graph clustering result
 */
export interface GraphClusteringResult {
  /** Number of clusters identified */
  numClusters: number;
  
  /** Mapping of node IDs to cluster IDs */
  nodeClusters: Record<string, number>;
  
  /** Information about each cluster */
  clusters: Array<{
    /** Cluster identifier */
    id: number;
    
    /** Node IDs in this cluster */
    nodeIds: string[];
    
    /** Size of the cluster (number of nodes) */
    size: number;
    
    /** Central or representative node ID */
    centralNodeId?: string;
    
    /** Cluster cohesion metric (higher is more cohesive) */
    cohesion?: number;
    
    /** Cluster separation metric (higher is more separated) */
    separation?: number;
  }>;
  
  /** Quality metrics for the clustering */
  metrics?: {
    /** Modularity score (higher is better) */
    modularity?: number;
    
    /** Silhouette score (closer to 1 is better) */
    silhouette?: number;
    
    /** Davies-Bouldin index (lower is better) */
    daviesBouldin?: number;
    
    /** Calinski-Harabasz index (higher is better) */
    calinskiHarabasz?: number;
  };
}

/**
 * Graph centrality measure options
 */
export interface GraphCentralityOptions {
  /** Type of centrality measure */
  measure: 'degree' | 'betweenness' | 'closeness' | 'eigenvector' | 'pagerank' | 'katz';
  
  /** Whether to use weighted edges */
  weighted?: boolean;
  
  /** Whether to normalize the results */
  normalize?: boolean;
  
  /** Filter for nodes to include in calculation */
  nodeFilter?: (node: GraphNode) => boolean;
  
  /** Filter for edges to include in calculation */
  edgeFilter?: (edge: GraphEdge) => boolean;
  
  /** Algorithm-specific parameters */
  parameters?: Record<string, any>;
}

/**
 * Graph centrality calculation result
 */
export interface GraphCentralityResult {
  /** Type of centrality measure used */
  measure: string;
  
  /** Centrality scores by node ID */
  scores: Record<string, number>;
  
  /** Nodes sorted by centrality (highest first) */
  rankedNodes: Array<{
    /** Node ID */
    nodeId: string;
    
    /** Centrality score */
    score: number;
    
    /** Node data */
    node: GraphNode;
  }>;
  
  /** Global graph centralization measure (0-1) */
  centralization?: number;
  
  /** Statistics about the centrality distribution */
  statistics?: {
    mean: number;
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
  };
}

/**
 * Graph path finding options
 */
export interface GraphPathFindingOptions {
  /** Source node ID */
  source: string;
  
  /** Target node ID */
  target: string;
  
  /** Algorithm to use */
  algorithm: 'dijkstra' | 'bellmanFord' | 'aStar' | 'bfs' | 'dfs';
  
  /** Maximum number of paths to find */
  maxPaths?: number;
  
  /** Maximum path length to consider */
  maxLength?: number;
  
  /** Edge property to use as weight */
  weightProperty?: string;
  
  /** Edge types to consider */
  edgeTypes?: string[];
  
  /** Custom cost function */
  costFunction?: (edge: GraphEdge) => number;
  
  /** Custom heuristic function (for A*) */
  heuristicFunction?: (node: GraphNode, targetNode: GraphNode) => number;
}

/**
 * Graph path finding result
 */
export interface GraphPathFindingResult {
  /** Array of found paths */
  paths: Array<{
    /** Node IDs in the path */
    nodeIds: string[];
    
    /** Edge IDs in the path */
    edgeIds: string[];
    
    /** Total cost of the path */
    cost: number;
    
    /** Path length (number of edges) */
    length: number;
  }>;
  
  /** Whether a path was found */
  pathExists: boolean;
  
  /** Statistics about the search */
  statistics: {
    /** Number of nodes explored */
    nodesExplored: number;
    
    /** Execution time in milliseconds */
    executionTime: number;
    
    /** Memory used (if available) */
    memoryUsed?: number;
  };
}