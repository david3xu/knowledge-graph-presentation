/**
 * Graph Utilities
 * Provides helper functions for knowledge graph operations and transformations
 */
import { GraphData, GraphNode, GraphEdge, GraphFilter } from '../types/graph-data';

/**
 * Graph traversal options
 */
export interface TraversalOptions {
  /** Maximum depth to traverse (default: Infinity) */
  maxDepth?: number;
  
  /** Whether to follow incoming edges (default: true) */
  followIncoming?: boolean;
  
  /** Whether to follow outgoing edges (default: true) */
  followOutgoing?: boolean;
  
  /** Types of relationships to follow */
  relationshipTypes?: string[];
  
  /** Types of nodes to include */
  nodeTypes?: string[];
  
  /** Edge direction for traversal */
  direction?: 'outbound' | 'inbound' | 'any';
  
  /** Nodes to exclude from traversal */
  excludeNodes?: string[];
  
  /** Maximum number of nodes to return (default: Infinity) */
  limit?: number;
}

/**
 * Default traversal options
 */
const DEFAULT_TRAVERSAL_OPTIONS: TraversalOptions = {
  maxDepth: Infinity,
  followIncoming: true,
  followOutgoing: true,
  direction: 'any',
  limit: Infinity,
  excludeNodes: []
};

/**
 * Graph analysis result
 */
export interface GraphAnalysisResult {
  /** Total number of nodes */
  nodeCount: number;
  
  /** Total number of edges */
  edgeCount: number;
  
  /** Node types and their counts */
  nodeTypes: Record<string, number>;
  
  /** Edge types and their counts */
  edgeTypes: Record<string, number>;
  
  /** Nodes with highest in-degree */
  topInDegreeNodes: Array<{ id: string; label?: string; degree: number }>;
  
  /** Nodes with highest out-degree */
  topOutDegreeNodes: Array<{ id: string; label?: string; degree: number }>;
  
  /** Graph density (0-1) */
  density: number;
  
  /** Average degree of the graph */
  averageDegree: number;
  
  /** Is the graph connected */
  isConnected: boolean;
  
  /** Diameter of the graph (longest shortest path) */
  diameter?: number;
}

/**
 * Graph layout algorithm types
 */
export type LayoutAlgorithm = 
  | 'force-directed'
  | 'circular'
  | 'grid'
  | 'concentric'
  | 'breadthfirst'
  | 'cose'
  | 'dagre'
  | 'random';

/**
 * Options for node positioning
 */
export interface LayoutOptions {
  /** Algorithm to use for layout */
  algorithm: LayoutAlgorithm;
  
  /** Width of the layout area */
  width?: number;
  
  /** Height of the layout area */
  height?: number;
  
  /** Spacing between nodes */
  nodeSpacing?: number;
  
  /** Edge length */
  edgeLength?: number;
  
  /** Whether to use randomization in the layout */
  randomize?: boolean;
  
  /** Number of iterations for force-directed layout */
  iterations?: number;
  
  /** Whether to take node sizes into account */
  considerNodeSizes?: boolean;
  
  /** Layout specific options */
  [key: string]: any;
}

/**
 * Subgraph extraction options
 */
export interface SubgraphOptions {
  /** Root node(s) to start extraction from */
  rootNodes: string[];
  
  /** Traversal options */
  traversal?: TraversalOptions;
  
  /** Whether to include orphaned nodes */
  includeOrphans?: boolean;
  
  /** Whether to auto-position nodes in the resulting subgraph */
  autoPosition?: boolean;
  
  /** Layout options for auto-positioning */
  layoutOptions?: Partial<LayoutOptions>;
}

/**
 * Node size strategy options
 */
export type NodeSizeStrategy = 
  | 'fixed'             // All nodes same size
  | 'degree'            // Size based on total degree
  | 'inDegree'          // Size based on in-degree
  | 'outDegree'         // Size based on out-degree
  | 'betweenness'       // Size based on betweenness centrality
  | 'closeness'         // Size based on closeness centrality
  | 'pageRank'          // Size based on PageRank
  | 'property';         // Size based on a property value

/**
 * Options for calculating node sizes
 */
export interface NodeSizeOptions {
  /** Strategy to use for sizing nodes */
  strategy: NodeSizeStrategy;
  
  /** Minimum node size */
  minSize?: number;
  
  /** Maximum node size */
  maxSize?: number;
  
  /** Property name to use for 'property' strategy */
  propertyName?: string;
  
  /** Whether to use a logarithmic scale */
  logarithmic?: boolean;
}

/**
 * Edge weight strategy options
 */
export type EdgeWeightStrategy = 
  | 'fixed'             // All edges same weight
  | 'count'             // Weight based on number of relationships
  | 'property';         // Weight based on a property value

/**
 * Options for calculating edge weights
 */
export interface EdgeWeightOptions {
  /** Strategy to use for weighting edges */
  strategy: EdgeWeightStrategy;
  
  /** Minimum edge weight */
  minWeight?: number;
  
  /** Maximum edge weight */
  maxWeight?: number;
  
  /** Property name to use for 'property' strategy */
  propertyName?: string;
  
  /** Whether to use a logarithmic scale */
  logarithmic?: boolean;
}

/**
 * Options for merging graphs
 */
export interface MergeGraphOptions {
  /** How to handle node conflicts */
  nodeStrategy: 'keep-first' | 'keep-second' | 'merge';
  
  /** How to handle edge conflicts */
  edgeStrategy: 'keep-first' | 'keep-second' | 'merge';
  
  /** Whether to merge node properties */
  mergeNodeProperties?: boolean;
  
  /** Whether to merge edge properties */
  mergeEdgeProperties?: boolean;
  
  /** Prefix to add to node IDs from the second graph to avoid conflicts */
  nodePrefix?: string;
  
  /** Prefix to add to edge IDs from the second graph to avoid conflicts */
  edgePrefix?: string;
}

/**
 * Filters a graph based on specified criteria
 * @param graph The input graph data
 * @param filter Filtering criteria
 * @returns Filtered graph data
 */
export function filterGraph(graph: GraphData, filter: GraphFilter): GraphData {
  const result: GraphData = {
    nodes: [...graph.nodes],
    edges: [...graph.edges]
  };

  // Apply node type filter
  if (filter.nodeTypes && filter.nodeTypes.length > 0) {
    result.nodes = result.nodes.filter(node => {
      if (!node.type) return false;
      if (!filter.nodeTypes!.includes(node.type)) {
        return false;
      }
      return true;
    });
  }
  
  // Filter by properties if specified
  if (filter.properties && Object.keys(filter.properties).length > 0) {
    result.nodes = result.nodes.filter(node => {
      if (!node.properties) return false;
      for (const [key, value] of Object.entries(filter.properties!)) {
        if (node.properties[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }
  
  // Apply custom filter if provided
  if (filter.customFilter) {
    result.nodes = result.nodes.filter(node => filter.customFilter!(node));
  }
  
  // Get IDs of filtered nodes
  const filteredNodeIds = new Set(result.nodes.map(node => node.id));
  
  // Filter edges based on criteria and filtered nodes
  result.edges = result.edges.filter(edge => {
    // Only keep edges where both source and target nodes are in the filtered set
    if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) {
      return false;
    }
    
    // Filter by edge types if specified
    if (filter.edgeTypes && filter.edgeTypes.length > 0) {
      if (!edge.label || !filter.edgeTypes.includes(edge.label)) {
        return false;
      }
    }
    
    // Filter by properties if specified
    if (filter.properties && Object.keys(filter.properties).length > 0) {
      for (const [key, value] of Object.entries(filter.properties)) {
        if (!edge.properties || edge.properties[key] !== value) {
          return false;
        }
      }
    }
    
    // Apply custom filter if provided
    if (filter.customFilter && !filter.customFilter(edge)) {
      return false;
    }
    
    return true;
  });
  
  // Return filtered graph
  return {
    nodes: result.nodes,
    edges: result.edges,
    metadata: graph.metadata
  };
}

/**
 * Extracts a subgraph starting from specified root nodes
 * @param graph The input graph data
 * @param options Subgraph extraction options
 * @returns Extracted subgraph
 */
export function extractSubgraph(graph: GraphData, options: SubgraphOptions): GraphData {
  const traversalOptions = { ...DEFAULT_TRAVERSAL_OPTIONS, ...options.traversal };
  const visitedNodes = new Set<string>();
  const subgraphNodes: GraphNode[] = [];
  const subgraphEdges: GraphEdge[] = [];
  const nodeLookup = new Map<string, GraphNode>();
  
  // Create node lookup for faster access
  graph.nodes.forEach(node => {
    nodeLookup.set(node.id, node);
  });
  
  // Queue for breadth-first traversal
  const queue: Array<{ nodeId: string; depth: number }> = [];
  
  // Initialize queue with root nodes
  options.rootNodes.forEach(nodeId => {
    if (nodeLookup.has(nodeId)) {
      queue.push({ nodeId, depth: 0 });
      visitedNodes.add(nodeId);
    }
  });
  
  // Breadth-first traversal
  while (queue.length > 0 && subgraphNodes.length < (traversalOptions.limit || Infinity)) {
    const { nodeId, depth } = queue.shift()!;
    
    // Add node to subgraph
    const node = nodeLookup.get(nodeId);
    if (node) {
      subgraphNodes.push({ ...node });
    }
    
    // Stop traversal if we've reached the maximum depth
    if (depth >= (traversalOptions.maxDepth || Infinity)) {
      continue;
    }
    
    // Find connected edges and nodes
    for (const edge of graph.edges) {
      // Check if this edge connects to the current node
      const isOutgoing = edge.source === nodeId;
      const isIncoming = edge.target === nodeId;
      
      if (isOutgoing && traversalOptions.followOutgoing || 
          isIncoming && traversalOptions.followIncoming) {
        
        // Determine the direction we're following
        if ((traversalOptions.direction === 'outbound' && !isOutgoing) ||
            (traversalOptions.direction === 'inbound' && !isIncoming)) {
          continue;
        }
        
        // Check relationship type filter
        if (traversalOptions.relationshipTypes && 
            traversalOptions.relationshipTypes.length > 0 && 
            edge.label && 
            !traversalOptions.relationshipTypes.includes(edge.label)) {
          continue;
        }
        
        // Determine the connected node ID
        const connectedNodeId = isOutgoing ? edge.target : edge.source;
        
        // Skip excluded nodes
        if (traversalOptions.excludeNodes?.includes(connectedNodeId)) {
          continue;
        }
        
        // Skip already visited nodes
        if (visitedNodes.has(connectedNodeId)) {
          // Add the edge even if we've visited the node before (to ensure connections)
          subgraphEdges.push({ ...edge });
          continue;
        }
        
        // Get the connected node
        const connectedNode = nodeLookup.get(connectedNodeId);
        if (!connectedNode) continue;
        
        // Check node type filter
        if (traversalOptions.nodeTypes && 
            traversalOptions.nodeTypes.length > 0) {
          if (!connectedNode.type || 
              !traversalOptions.nodeTypes.includes(connectedNode.type)) {
            continue;
          }
        }
        
        // Add edge to subgraph
        subgraphEdges.push({ ...edge });
        
        // Mark node as visited and add to queue
        visitedNodes.add(connectedNodeId);
        queue.push({ nodeId: connectedNodeId, depth: depth + 1 });
      }
    }
  }
  
  // Include orphaned nodes if requested
  if (options.includeOrphans) {
    options.rootNodes.forEach(nodeId => {
      if (!visitedNodes.has(nodeId) && nodeLookup.has(nodeId)) {
        const node = nodeLookup.get(nodeId);
        if (node) {
          subgraphNodes.push({ ...node });
        }
      }
    });
  }
  
  // Apply auto-positioning if requested
  if (options.autoPosition && options.layoutOptions) {
    applyLayout({
      nodes: subgraphNodes,
      edges: subgraphEdges,
      metadata: graph.metadata
    }, {
      algorithm: 'force-directed',
      ...options.layoutOptions
    });
  }
  
  // Return the extracted subgraph
  return {
    nodes: subgraphNodes,
    edges: subgraphEdges,
    metadata: {
      name: `Subgraph from ${graph.metadata?.name || 'Unknown'}`,
      description: `Subgraph extracted from ${options.rootNodes.join(', ')}`,
      ...(graph.metadata || {})
    }
  };
}

/**
 * Merges two graphs into a single graph
 * @param graph1 First graph
 * @param graph2 Second graph
 * @param options Merge options
 * @returns Merged graph
 */
export function mergeGraphs(graph1: GraphData, graph2: GraphData, options: MergeGraphOptions): GraphData {
  const mergedNodes: GraphNode[] = [];
  const mergedEdges: GraphEdge[] = [];
  const nodeMap = new Map<string, GraphNode>();
  
  // Process nodes from first graph
  graph1.nodes.forEach(node => {
    nodeMap.set(node.id, { ...node });
    mergedNodes.push({ ...node });
  });
  
  // Process nodes from second graph
  graph2.nodes.forEach(node => {
    const nodeId = options.nodePrefix ? `${options.nodePrefix}${node.id}` : node.id;
    const existingNode = nodeMap.get(nodeId);
    
    if (existingNode) {
      // Node conflict handling
      if (options.nodeStrategy === 'keep-first') {
        // Keep first graph's node, do nothing
      } else if (options.nodeStrategy === 'keep-second') {
        // Replace with second graph's node
        const idx = mergedNodes.findIndex(n => n.id === nodeId);
        if (idx >= 0) {
          mergedNodes[idx] = { ...node, id: nodeId };
          nodeMap.set(nodeId, { ...node, id: nodeId });
        }
      } else if (options.nodeStrategy === 'merge') {
        // Merge node properties
        const idx = mergedNodes.findIndex(n => n.id === nodeId);
        if (idx >= 0 && options.mergeNodeProperties) {
          const mergedNode = { 
            ...existingNode,
            properties: {
              ...(existingNode.properties || {}),
              ...(node.properties || {})
            }
          };
          mergedNodes[idx] = mergedNode;
          nodeMap.set(nodeId, mergedNode);
        }
      }
    } else {
      // New node, add it
      const newNode = { ...node, id: nodeId };
      mergedNodes.push(newNode);
      nodeMap.set(nodeId, newNode);
    }
  });
  
  // Edge map for duplicate detection
  const edgeMap = new Map<string, GraphEdge>();
  
  // Process edges from first graph
  graph1.edges.forEach(edge => {
    const edgeKey = edge.id || `${edge.source}-${edge.target}-${edge.label || ''}`;
    edgeMap.set(edgeKey, { ...edge });
    mergedEdges.push({ ...edge });
  });
  
  // Process edges from second graph
  graph2.edges.forEach(edge => {
    const sourceId = options.nodePrefix ? `${options.nodePrefix}${edge.source}` : edge.source;
    const targetId = options.nodePrefix ? `${options.nodePrefix}${edge.target}` : edge.target;
    
    // Skip edges that connect to nodes not in the merged graph
    if (!nodeMap.has(sourceId) || !nodeMap.has(targetId)) {
      return;
    }
    
    const edgeId = options.edgePrefix && edge.id 
      ? `${options.edgePrefix}${edge.id}` 
      : edge.id;
      
    const edgeKey = edgeId || `${sourceId}-${targetId}-${edge.label || ''}`;
    const existingEdge = edgeMap.get(edgeKey);
    
    if (existingEdge) {
      // Edge conflict handling
      if (options.edgeStrategy === 'keep-first') {
        // Keep first graph's edge, do nothing
      } else if (options.edgeStrategy === 'keep-second') {
        // Replace with second graph's edge
        const idx = mergedEdges.findIndex(e => 
          (e.id && e.id === edgeKey) || 
          (!e.id && e.source === existingEdge.source && e.target === existingEdge.target && e.label === existingEdge.label)
        );
        if (idx >= 0) {
          const newEdge = { 
            ...edge, 
            id: edgeId,
            source: sourceId,
            target: targetId
          };
          mergedEdges[idx] = newEdge;
          edgeMap.set(edgeKey, newEdge);
        }
      } else if (options.edgeStrategy === 'merge') {
        // Merge edge properties
        const idx = mergedEdges.findIndex(e => 
          (e.id && e.id === edgeKey) || 
          (!e.id && e.source === existingEdge.source && e.target === existingEdge.target && e.label === existingEdge.label)
        );
        if (idx >= 0 && options.mergeEdgeProperties) {
          const mergedEdge = { 
            ...existingEdge,
            properties: {
              ...(existingEdge.properties || {}),
              ...(edge.properties || {})
            }
          };
          mergedEdges[idx] = mergedEdge;
          edgeMap.set(edgeKey, mergedEdge);
        }
      }
    } else {
      // New edge, add it
      const newEdge = { 
        ...edge, 
        id: edgeId,
        source: sourceId,
        target: targetId
      };
      mergedEdges.push(newEdge);
      edgeMap.set(edgeKey, newEdge);
    }
  });
  
  // Merge metadata
  const mergedMetadata = {
    name: `Merged Graph: ${graph1.metadata?.name || 'Graph 1'} + ${graph2.metadata?.name || 'Graph 2'}`,
    description: `Merged from ${graph1.metadata?.name || 'Graph 1'} and ${graph2.metadata?.name || 'Graph 2'}`,
    ...(graph1.metadata || {}),
    ...(graph2.metadata || {})
  };
  
  // Return merged graph
  return {
    nodes: mergedNodes,
    edges: mergedEdges,
    metadata: mergedMetadata
  };
}

/**
 * Applies a layout algorithm to position nodes in a graph
 * @param graph The graph to layout
 * @param options Layout options
 * @returns Graph with positioned nodes
 */
export function applyLayout(graph: GraphData, options: LayoutOptions): GraphData {
  // Clone the graph to avoid modifying the original
  const nodes = graph.nodes.map(node => ({ ...node }));
  const width = options.width || 800;
  const height = options.height || 600;
  
  switch (options.algorithm) {
    case 'grid':
      applyGridLayout(nodes, width, height);
      break;
    case 'circular':
      applyCircularLayout(nodes, width, height);
      break;
    case 'random':
      applyRandomLayout(nodes, width, height);
      break;
    case 'concentric':
      applyConcentricLayout(nodes, graph.edges, width, height);
      break;
    case 'force-directed':
      applyForceLayout(nodes, graph.edges, width, height, options);
      break;
    default:
      // Default to grid layout
      applyGridLayout(nodes, width, height);
  }
  
  // Return graph with updated node positions
  return {
    nodes,
    edges: graph.edges,
    metadata: graph.metadata
  };
}

/**
 * Applies a grid layout to the nodes
 * @param nodes Nodes to position
 * @param width Width of the layout area
 * @param height Height of the layout area
 */
function applyGridLayout(nodes: GraphNode[], width: number, height: number): void {
  const padding = 50;
  const availableWidth = width - (padding * 2);
  const availableHeight = height - (padding * 2);
  
  // Calculate grid dimensions
  const nodeCount = nodes.length;
  const cols = Math.ceil(Math.sqrt(nodeCount));
  const rows = Math.ceil(nodeCount / cols);
  
  // Calculate cell size
  const cellWidth = availableWidth / cols;
  const cellHeight = availableHeight / rows;
  
  // Position nodes in a grid
  nodes.forEach((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    node.position = {
      x: padding + (col * cellWidth) + (cellWidth / 2),
      y: padding + (row * cellHeight) + (cellHeight / 2)
    };
  });
}

/**
 * Applies a circular layout to the nodes
 * @param nodes Nodes to position
 * @param width Width of the layout area
 * @param height Height of the layout area
 */
function applyCircularLayout(nodes: GraphNode[], width: number, height: number): void {
  const padding = 50;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - padding;
  
  // Position nodes in a circle
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    
    node.position = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
}

/**
 * Applies a random layout to the nodes
 * @param nodes Nodes to position
 * @param width Width of the layout area
 * @param height Height of the layout area
 */
function applyRandomLayout(nodes: GraphNode[], width: number, height: number): void {
  const padding = 50;
  
  // Position nodes randomly
  nodes.forEach(node => {
    node.position = {
      x: padding + Math.random() * (width - (padding * 2)),
      y: padding + Math.random() * (height - (padding * 2))
    };
  });
}

/**
 * Applies a concentric layout to the nodes
 * @param nodes Nodes to position
 * @param edges Edges of the graph
 * @param width Width of the layout area
 * @param height Height of the layout area
 */
function applyConcentricLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 50;
  
  // Calculate degree for each node
  const nodeDegrees = new Map<string, number>();
  
  nodes.forEach(node => {
    nodeDegrees.set(node.id, 0);
  });
  
  edges.forEach(edge => {
    nodeDegrees.set(edge.source, (nodeDegrees.get(edge.source) || 0) + 1);
    nodeDegrees.set(edge.target, (nodeDegrees.get(edge.target) || 0) + 1);
  });
  
  // Sort nodes by degree (descending)
  const sortedNodes = [...nodes].sort((a, b) => 
    (nodeDegrees.get(b.id) || 0) - (nodeDegrees.get(a.id) || 0)
  );
  
  // Determine number of circles and nodes per circle
  const circleCount = Math.ceil(Math.sqrt(nodes.length));
  const nodesPerCircle = Math.ceil(nodes.length / circleCount);
  
  // Position nodes in concentric circles
  sortedNodes.forEach((node, index) => {
    const circle = Math.floor(index / nodesPerCircle);
    const posInCircle = index % nodesPerCircle;
    const radius = (circle + 1) * (maxRadius / circleCount);
    const angle = (posInCircle / nodesPerCircle) * 2 * Math.PI;
    
    node.position = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
}

/**
 * Applies a force-directed layout to the nodes
 * @param nodes Nodes to position
 * @param edges Edges of the graph
 * @param width Width of the layout area
 * @param height Height of the layout area
 * @param options Layout options
 */
function applyForceLayout(
  nodes: GraphNode[], 
  edges: GraphEdge[], 
  width: number, 
  height: number, 
  options: LayoutOptions
): void {
  // Start with initial positions
  if (!nodes.some(node => node.position)) {
    // Initialize with random positions if none exist
    applyRandomLayout(nodes, width, height);
  }
  
  const iterations = options.iterations || 100;
  const k = options.edgeLength || Math.sqrt(width * height / nodes.length);
  const nodeSpacing = options.nodeSpacing || 10;
  
  // Create node map for faster lookup
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach(node => {
    nodeMap.set(node.id, node);
  });
  
  // Run simulation
  for (let i = 0; i < iterations; i++) {
    // Calculate forces
    const forces: Record<string, { fx: number; fy: number }> = {};
    
    // Initialize forces
    nodes.forEach(node => {
      forces[node.id] = { fx: 0, fy: 0 };
    });
    
    // Repulsive forces between all pairs of nodes
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const nodeA = nodes[a];
        const nodeB = nodes[b];
        
        if (!nodeA.position || !nodeB.position) continue;
        
        const dx = nodeB.position.x - nodeA.position.x;
        const dy = nodeB.position.y - nodeA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
        
        // Repulsive force: nodes push each other away
        const force = k * k / distance;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        forces[nodeA.id].fx -= fx;
        forces[nodeA.id].fy -= fy;
        forces[nodeB.id].fx += fx;
        forces[nodeB.id].fy += fy;
      }
    }
    
    // Attractive forces along edges
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      
      if (!sourceNode || !targetNode || !sourceNode.position || !targetNode.position) return;
      
      const dx = targetNode.position.x - sourceNode.position.x;
      const dy = targetNode.position.y - sourceNode.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
      
      // Attractive force: connected nodes pull each other closer
      const force = distance * distance / k;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      forces[sourceNode.id].fx += fx;
      forces[sourceNode.id].fy += fy;
      forces[targetNode.id].fx -= fx;
      forces[targetNode.id].fy -= fy;
    });
    
    // Apply forces (with damping as iterations progress)
    const damping = 1 - (i / iterations);
    nodes.forEach(node => {
      if (!node.position) {
        node.position = { x: width / 2, y: height / 2 };
      }
      
      const force = forces[node.id];
      const displacement = Math.sqrt(force.fx * force.fx + force.fy * force.fy);
      const scale = Math.min(displacement, temperature) / displacement || 0;
      
      node.position.x += force.fx * scale * damping;
      node.position.y += force.fy * scale * damping;
      
      // Keep nodes inside the layout area
      node.position.x = Math.max(nodeSpacing, Math.min(width - nodeSpacing, node.position.x));
      node.position.y = Math.max(nodeSpacing, Math.min(height - nodeSpacing, node.position.y));
    });
    
    // Cooling temperature
    const temperature = k * (1 - (i / iterations));
  }
}

/**
 * Calculates node sizes based on a specified strategy
 * @param graph The input graph
 * @param options Node size calculation options
 * @returns Graph with updated node sizes
 */
export function calculateNodeSizes(graph: GraphData, options: NodeSizeOptions): GraphData {
  const { strategy, minSize = 5, maxSize = 30, propertyName, logarithmic = false } = options;
  
  // Clone nodes to avoid modifying the original
  const nodes = graph.nodes.map(node => ({ ...node }));
  
  // Calculate values based on strategy
  let values = new Map<string, number>();
  
  switch (strategy) {
    case 'fixed':
      // All nodes same size
      nodes.forEach(node => values.set(node.id, 1));
      break;
      
    case 'degree': {
      // Calculate degree for each node
      const degrees = calculateDegrees(graph);
      nodes.forEach(node => values.set(node.id, degrees.get(node.id) || 0));
      break;
    }
      
    case 'inDegree': {
      // Calculate in-degree for each node
      const inDegrees = calculateInDegrees(graph);
      nodes.forEach(node => values.set(node.id, inDegrees.get(node.id) || 0));
      break;
    }
      
    case 'outDegree': {
      // Calculate out-degree for each node
      const outDegrees = calculateOutDegrees(graph);
      nodes.forEach(node => values.set(node.id, outDegrees.get(node.id) || 0));
      break;
    }
      
    case 'property':
      // Size based on property value
      if (propertyName) {
        nodes.forEach(node => {
          const value = node.properties?.[propertyName];
          if (typeof value === 'number') {
            values.set(node.id, value);
          } else {
            values.set(node.id, 0);
          }
        });
      }
      break;
      
    // These centrality measures require more complex graph analysis
    // and would typically be implemented with a graph algorithm library
    case 'betweenness':
    case 'closeness':
    case 'pageRank':
      console.warn(`Centrality measure ${strategy} not fully implemented`);
      // Implement a simple approximation based on degree for now
      const degrees = calculateDegrees(graph);
      nodes.forEach(node => values.set(node.id, degrees.get(node.id) || 0));
      break;
  }
  
  // Find min and max values for normalization
  let minValue = Infinity;
  let maxValue = -Infinity;
  
  values.forEach(value => {
    minValue = Math.min(minValue, value);
    maxValue = Math.max(maxValue, value);
  });
  
  // Normalize values and update node sizes
  nodes.forEach(node => {
    let value = values.get(node.id) || 0;
    
    // Apply logarithmic scaling if requested
    if (logarithmic && value > 0) {
      value = Math.log(value + 1);
    }
    
    // Normalize to [0, 1] range
    let normalizedValue = 0;
    if (maxValue > minValue) {
      normalizedValue = (value - minValue) / (maxValue - minValue);
    }
    
    // Scale to [minSize, maxSize] range
    const size = minSize + normalizedValue * (maxSize - minSize);
    
    // Update node style
    node.style = {
      ...(node.style || {}),
      size
    };
  });
  
  // Return graph with updated nodes
  return {
    nodes,
    edges: graph.edges,
    metadata: graph.metadata
  };
}

/**
 * Calculates edge weights based on a specified strategy
 * @param graph The input graph
 * @param options Edge weight calculation options
 * @returns Graph with updated edge weights
 */
export function calculateEdgeWeights(graph: GraphData, options: EdgeWeightOptions): GraphData {
  const { strategy, minWeight = 1, maxWeight = 5, propertyName, logarithmic = false } = options;
  
  // Clone edges to avoid modifying the original
  const edges = graph.edges.map(edge => ({ ...edge }));
  
  // Calculate values based on strategy
  let values = new Map<string, number>();
  
  switch (strategy) {
    case 'fixed':
      // All edges same weight
      edges.forEach(edge => {
        const edgeId = edge.id || `${edge.source}-${edge.target}`;
        values.set(edgeId, 1);
      });
      break;
      
    case 'count': {
      // Count number of edges between each pair of nodes
      const edgeCounts = new Map<string, number>();
      
      edges.forEach(edge => {
        const pairKey = `${edge.source}-${edge.target}`;
        edgeCounts.set(pairKey, (edgeCounts.get(pairKey) || 0) + 1);
      });
      
      edges.forEach(edge => {
        const edgeId = edge.id || `${edge.source}-${edge.target}`;
        const pairKey = `${edge.source}-${edge.target}`;
        values.set(edgeId, edgeCounts.get(pairKey) || 1);
      });
      break;
    }
      
    case 'property':
      // Weight based on property value
      if (propertyName) {
        edges.forEach(edge => {
          const edgeId = edge.id || `${edge.source}-${edge.target}`;
          const value = edge.properties?.[propertyName];
          if (typeof value === 'number') {
            values.set(edgeId, value);
          } else {
            values.set(edgeId, 1);
          }
        });
      }
      break;
  }
  
  // Find min and max values for normalization
  let minValue = Infinity;
  let maxValue = -Infinity;
  
  values.forEach(value => {
    minValue = Math.min(minValue, value);
    maxValue = Math.max(maxValue, value);
  });
  
  // Normalize values and update edge weights
  edges.forEach(edge => {
    const edgeId = edge.id || `${edge.source}-${edge.target}`;
    let value = values.get(edgeId) || 1;
    
    // Apply logarithmic scaling if requested
    if (logarithmic && value > 0) {
      value = Math.log(value + 1);
    }
    
    // Normalize to [0, 1] range
    let normalizedValue = 0;
    if (maxValue > minValue) {
      normalizedValue = (value - minValue) / (maxValue - minValue);
    }
    
    // Scale to [minWeight, maxWeight] range
    const weight = minWeight + normalizedValue * (maxWeight - minWeight);
    
    // Add weight to edge properties
    edge.weight = weight;
    
    // Update edge style
    edge.style = {
      ...(edge.style || {}),
      width: weight
    };
  });
  
  // Return graph with updated edges
  return {
    nodes: graph.nodes,
    edges,
    metadata: graph.metadata
  };
}

/**
 * Analyzes a graph and returns various metrics
 * @param graph The graph to analyze
 * @returns Analysis results
 */
export function analyzeGraph(graph: GraphData): GraphAnalysisResult {
  // Initialize result object
  const result: GraphAnalysisResult = {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    nodeTypes: {},
    edgeTypes: {},
    topInDegreeNodes: [],
    topOutDegreeNodes: [],
    density: 0,
    averageDegree: 0,
    isConnected: false
  };

  // Calculate node type distribution
  graph.nodes.forEach(node => {
    const nodeType = node.type || 'unknown';
    result.nodeTypes[nodeType] = (result.nodeTypes[nodeType] || 0) + 1;
  });
  
  // Count edge types
  graph.edges.forEach(edge => {
    if (edge.label) {
      result.edgeTypes[edge.label] = (result.edgeTypes[edge.label] || 0) + 1;
    } else {
      result.edgeTypes['unlabeled'] = (result.edgeTypes['unlabeled'] || 0) + 1;
    }
  });
  
  // Calculate in-degree and out-degree
  const inDegrees = calculateInDegrees(graph);
  const outDegrees = calculateOutDegrees(graph);
  
  // Find nodes with highest in-degree
  result.topInDegreeNodes = [...inDegrees.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, degree]) => {
      const node = graph.nodes.find(n => n.id === id);
      return { id, label: node?.label || id, degree };
    });
  
  // Find nodes with highest out-degree
  result.topOutDegreeNodes = [...outDegrees.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, degree]) => {
      const node = graph.nodes.find(n => n.id === id);
      return { id, label: node?.label || id, degree };
    });
  
  // Calculate graph density
  const maxPossibleEdges = graph.nodes.length * (graph.nodes.length - 1);
  result.density = maxPossibleEdges > 0 ? graph.edges.length / maxPossibleEdges : 0;
  
  // Calculate average degree
  const totalDegrees = [...inDegrees.values()].reduce((sum, degree) => sum + degree, 0);
  result.averageDegree = graph.nodes.length > 0 ? totalDegrees / graph.nodes.length : 0;
  
  // Check if graph is connected (simple approximation)
  result.isConnected = isGraphConnected(graph);
  
  // Return analysis results
  return result;
}

/**
 * Calculates the in-degree for each node in the graph
 * @param graph The input graph
 * @returns Map of node IDs to in-degrees
 */
function calculateInDegrees(graph: GraphData): Map<string, number> {
  const inDegrees = new Map<string, number>();
  
  // Initialize all nodes with in-degree 0
  graph.nodes.forEach(node => {
    inDegrees.set(node.id, 0);
  });
  
  // Count incoming edges for each node
  graph.edges.forEach(edge => {
    inDegrees.set(edge.target, (inDegrees.get(edge.target) || 0) + 1);
  });
  
  return inDegrees;
}

/**
 * Calculates the out-degree for each node in the graph
 * @param graph The input graph
 * @returns Map of node IDs to out-degrees
 */
function calculateOutDegrees(graph: GraphData): Map<string, number> {
  const outDegrees = new Map<string, number>();
  
  // Initialize all nodes with out-degree 0
  graph.nodes.forEach(node => {
    outDegrees.set(node.id, 0);
  });
  
  // Count outgoing edges for each node
  graph.edges.forEach(edge => {
    outDegrees.set(edge.source, (outDegrees.get(edge.source) || 0) + 1);
  });
  
  return outDegrees;
}

/**
 * Calculates the total degree for each node in the graph
 * @param graph The input graph
 * @returns Map of node IDs to total degrees
 */
function calculateDegrees(graph: GraphData): Map<string, number> {
  const inDegrees = calculateInDegrees(graph);
  const outDegrees = calculateOutDegrees(graph);
  const degrees = new Map<string, number>();
  
  // Sum in-degree and out-degree for each node
  graph.nodes.forEach(node => {
    const inDegree = inDegrees.get(node.id) || 0;
    const outDegree = outDegrees.get(node.id) || 0;
    degrees.set(node.id, inDegree + outDegree);
  });
  
  return degrees;
}

/**
 * Checks if a graph is connected
 * @param graph The input graph
 * @returns True if the graph is connected
 */
function isGraphConnected(graph: GraphData): boolean {
  if (graph.nodes.length === 0) return true;
  
  // Create adjacency list
  const adjList = new Map<string, Set<string>>();
  
  // Initialize adjacency list for all nodes
  graph.nodes.forEach(node => {
    adjList.set(node.id, new Set<string>());
  });
  
  // Add edges to adjacency list (treating as undirected)
  graph.edges.forEach(edge => {
    const sourceAdj = adjList.get(edge.source);
    const targetAdj = adjList.get(edge.target);
    
    if (sourceAdj) sourceAdj.add(edge.target);
    if (targetAdj) targetAdj.add(edge.source);
  });
  
  // Perform BFS to check connectivity
  const visited = new Set<string>();
  const queue: string[] = [];
  
  // Start from the first node
  const startNode = graph.nodes[0].id;
  queue.push(startNode);
  visited.add(startNode);
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const neighbors = adjList.get(nodeId);
    
    if (neighbors) {
      neighbors.forEach(neighborId => {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      });
    }
  }
  
  // Graph is connected if all nodes were visited
  return visited.size === graph.nodes.length;
}