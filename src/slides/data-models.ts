/**
 * Data Models Slides Module
 * Defines slides that explain different knowledge graph data models
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Example RDF graph data structure
 */
const rdfGraphData: GraphData = {
  nodes: [
    { id: 'subject1', label: 'ex:TechCorp', type: 'Subject', 
      properties: { uri: 'http://example.org/TechCorp' } },
    { id: 'predicate1', label: 'ex:founded', type: 'Predicate', 
      properties: { uri: 'http://example.org/founded' } },
    { id: 'object1', label: '2010', type: 'Literal' },
    { id: 'predicate2', label: 'rdf:type', type: 'Predicate', 
      properties: { uri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' } },
    { id: 'object2', label: 'ex:Company', type: 'Object', 
      properties: { uri: 'http://example.org/Company' } },
    { id: 'predicate3', label: 'ex:employs', type: 'Predicate', 
      properties: { uri: 'http://example.org/employs' } },
    { id: 'object3', label: 'ex:JaneDoe', type: 'Object', 
      properties: { uri: 'http://example.org/JaneDoe' } }
  ],
  edges: [
    { source: 'subject1', target: 'predicate1', label: 'statement' },
    { source: 'predicate1', target: 'object1', label: 'statement' },
    { source: 'subject1', target: 'predicate2', label: 'statement' },
    { source: 'predicate2', target: 'object2', label: 'statement' },
    { source: 'subject1', target: 'predicate3', label: 'statement' },
    { source: 'predicate3', target: 'object3', label: 'statement' }
  ]
};

/**
 * Example property graph data structure
 */
const propertyGraphData: GraphData = {
  nodes: [
    { id: 'company', label: 'Company', type: 'Entity', 
      properties: { name: 'TechCorp', founded: '2010', headquarters: 'San Francisco' } },
    { id: 'person', label: 'Person', type: 'Entity', 
      properties: { name: 'Jane Doe', title: 'Senior Engineer', joined: '2015' } },
    { id: 'product', label: 'Product', type: 'Entity', 
      properties: { name: 'Widget', launched: '2018', category: 'Hardware' } }
  ],
  edges: [
    { source: 'company', target: 'person', label: 'EMPLOYS', 
      properties: { since: '2015', role: 'Engineer', department: 'R&D' } },
    { source: 'company', target: 'product', label: 'PRODUCES', 
      properties: { since: '2018', revenue: '$10M', team_size: 12 } },
    { source: 'person', target: 'product', label: 'WORKS_ON', 
      properties: { since: '2018', contribution: 'Architecture', commit_count: 342 } }
  ]
};

/**
 * Example hypergraph data structure
 */
const hypergraphData: GraphData = {
  nodes: [
    { id: 'person1', label: 'Jane Doe', type: 'Person' },
    { id: 'person2', label: 'John Smith', type: 'Person' },
    { id: 'person3', label: 'Alex Chen', type: 'Person' },
    { id: 'project1', label: 'Widget Project', type: 'Project' },
    { id: 'role1', label: 'Architect', type: 'Role' },
    { id: 'company', label: 'TechCorp', type: 'Company' },
    { id: 'hyperedge1', label: 'Project Team', type: 'Hyperedge', isGroup: true },
    { id: 'hyperedge2', label: 'Employment', type: 'Hyperedge', isGroup: true }
  ],
  edges: [
    { source: 'hyperedge1', target: 'person1', label: 'MEMBER' },
    { source: 'hyperedge1', target: 'person2', label: 'MEMBER' },
    { source: 'hyperedge1', target: 'person3', label: 'MEMBER' },
    { source: 'hyperedge1', target: 'project1', label: 'PROJECT' },
    { source: 'hyperedge1', target: 'role1', label: 'ROLE' },
    { source: 'hyperedge2', target: 'person1', label: 'EMPLOYEE' },
    { source: 'hyperedge2', target: 'person2', label: 'EMPLOYEE' },
    { source: 'hyperedge2', target: 'person3', label: 'EMPLOYEE' },
    { source: 'hyperedge2', target: 'company', label: 'EMPLOYER' }
  ]
};

/**
 * Graph models detailed comparison data
 */
const graphModelsDetailedData = {
  headers: ['Feature', 'RDF Graph', 'Property Graph', 'Hypergraph', 'Labeled Property Graph'],
  rows: [
    { 
      'Feature': 'Basic Element', 
      'RDF Graph': 'Triple (subject-predicate-object)', 
      'Property Graph': 'Nodes and edges with properties', 
      'Hypergraph': 'Hyperedges connecting multiple nodes',
      'Labeled Property Graph': 'Labeled nodes and edges with properties'
    },
    { 
      'Feature': 'Schema', 
      'RDF Graph': 'RDFS, OWL ontologies', 
      'Property Graph': 'Optional, application-defined', 
      'Hypergraph': 'Typically schemaless',
      'Labeled Property Graph': 'Optional, constraints and indexes'
    },
    { 
      'Feature': 'Property Support', 
      'RDF Graph': 'On subjects and objects only', 
      'Property Graph': 'On both nodes and edges', 
      'Hypergraph': 'On nodes and hyperedges',
      'Labeled Property Graph': 'Rich property support on both nodes and edges'
    },
    { 
      'Feature': 'Edge Properties', 
      'RDF Graph': 'Requires reification', 
      'Property Graph': 'Native support', 
      'Hypergraph': 'Native support on hyperedges',
      'Labeled Property Graph': 'Native support with multiple labels'
    },
    { 
      'Feature': 'Multi-Relation Support', 
      'RDF Graph': 'Multiple triples needed', 
      'Property Graph': 'Multiple distinct edges', 
      'Hypergraph': 'Single hyperedge can connect many nodes',
      'Labeled Property Graph': 'Multiple labeled edges'
    },
    { 
      'Feature': 'Standards', 
      'RDF Graph': 'W3C (RDF, RDFS, OWL, SPARQL)', 
      'Property Graph': 'De facto (no formal standard)', 
      'Hypergraph': 'Research implementations',
      'Labeled Property Graph': 'Vendor-specific (Neo4j, etc.)'
    },
    { 
      'Feature': 'Query Languages', 
      'RDF Graph': 'SPARQL', 
      'Property Graph': 'Cypher, Gremlin', 
      'Hypergraph': 'Custom query languages',
      'Labeled Property Graph': 'Cypher, GQL (emerging standard)'
    },
    { 
      'Feature': 'Inference', 
      'RDF Graph': 'RDFS/OWL reasoning', 
      'Property Graph': 'Procedural/custom', 
      'Hypergraph': 'Probabilistic models',
      'Labeled Property Graph': 'Graph algorithms, procedural'
    },
    { 
      'Feature': 'Implementations', 
      'RDF Graph': 'GraphDB, Virtuoso, RDF4J, Jena', 
      'Property Graph': 'Neo4j, JanusGraph, ArangoDB', 
      'Hypergraph': 'HypergraphDB, in-memory libraries',
      'Labeled Property Graph': 'Neo4j, TigerGraph, Amazon Neptune'
    },
    { 
      'Feature': 'Serialization', 
      'RDF Graph': 'RDF/XML, Turtle, N-Triples, JSON-LD', 
      'Property Graph': 'GraphSON, GraphML, custom JSON', 
      'Hypergraph': 'Custom formats',
      'Labeled Property Graph': 'Custom JSON formats, GraphML extensions'
    }
  ]
};

/**
 * RDF serialization formats comparison
 */
const rdfSerializationData = {
  headers: ['Format', 'Syntax', 'Human Readability', 'Verbosity', 'Use Cases'],
  rows: [
    { 
      'Format': 'RDF/XML', 
      'Syntax': 'XML-based', 
      'Human Readability': 'Low', 
      'Verbosity': 'High', 
      'Use Cases': 'Legacy systems, XML toolchains' 
    },
    { 
      'Format': 'Turtle', 
      'Syntax': 'Compact text notation', 
      'Human Readability': 'High', 
      'Verbosity': 'Low', 
      'Use Cases': 'Development, debugging, small datasets' 
    },
    { 
      'Format': 'N-Triples', 
      'Syntax': 'Line-based text format', 
      'Human Readability': 'Medium', 
      'Verbosity': 'Medium', 
      'Use Cases': 'Streaming processing, large datasets' 
    },
    { 
      'Format': 'JSON-LD', 
      'Syntax': 'JSON-based', 
      'Human Readability': 'Medium', 
      'Verbosity': 'Medium', 
      'Use Cases': 'Web APIs, JavaScript integration' 
    },
    { 
      'Format': 'TriG', 
      'Syntax': 'Extended Turtle', 
      'Human Readability': 'High', 
      'Verbosity': 'Low', 
      'Use Cases': 'Named graphs, provenance tracking' 
    },
    { 
      'Format': 'N-Quads', 
      'Syntax': 'Extended N-Triples', 
      'Human Readability': 'Medium', 
      'Verbosity': 'Medium', 
      'Use Cases': 'Named graphs in large datasets' 
    }
  ]
};

/**
 * Database performance comparison data
 */
const dbPerformanceData = {
  headers: ['Metric', 'Relational DB', 'Document DB', 'Triple Store', 'Property Graph DB'],
  rows: [
    { 
      'Metric': 'Multi-hop Traversal', 
      'Relational DB': 'Poor (requires joins)', 
      'Document DB': 'Limited', 
      'Triple Store': 'Good', 
      'Property Graph DB': 'Excellent' 
    },
    { 
      'Metric': 'Simple Key-Value Lookup', 
      'Relational DB': 'Excellent', 
      'Document DB': 'Excellent', 
      'Triple Store': 'Good', 
      'Property Graph DB': 'Good' 
    },
    { 
      'Metric': 'Complex Pattern Matching', 
      'Relational DB': 'Limited', 
      'Document DB': 'Poor', 
      'Triple Store': 'Good', 
      'Property Graph DB': 'Excellent' 
    },
    { 
      'Metric': 'Recursive Queries', 
      'Relational DB': 'Limited (CTEs)', 
      'Document DB': 'Poor', 
      'Triple Store': 'Good (property paths)', 
      'Property Graph DB': 'Excellent (native)' 
    },
    { 
      'Metric': 'Logical Inference', 
      'Relational DB': 'Limited', 
      'Document DB': 'Poor', 
      'Triple Store': 'Excellent (OWL/RDFS)', 
      'Property Graph DB': 'Limited' 
    },
    { 
      'Metric': 'Schema Evolution', 
      'Relational DB': 'Difficult', 
      'Document DB': 'Excellent', 
      'Triple Store': 'Excellent', 
      'Property Graph DB': 'Excellent' 
    },
    { 
      'Metric': 'Write Performance', 
      'Relational DB': 'Good', 
      'Document DB': 'Excellent', 
      'Triple Store': 'Moderate', 
      'Property Graph DB': 'Good' 
    },
    { 
      'Metric': 'Scaling Strategy', 
      'Relational DB': 'Vertical + Sharding', 
      'Document DB': 'Horizontal Scaling', 
      'Triple Store': 'Distributed Storage', 
      'Property Graph DB': 'Graph Partitioning' 
    }
  ]
};

/**
 * RDF Data Model Slide
 */
const rdfModelSlide: SlideConfig = {
  id: 'rdf-data-model',
  title: 'RDF Data Model',
  content: {
    definition: 'The Resource Description Framework (RDF) represents knowledge as a directed graph of subject-predicate-object triples, where nodes are resources identified by URIs or literal values.',
    keyPoints: [
      'Based on subject-predicate-object triples (e.g., "TechCorp employs JaneDoe")',
      'Resources identified by Uniform Resource Identifiers (URIs)',
      'Schema defined through RDF Schema (RDFS) and Web Ontology Language (OWL)',
      'Standardized by W3C as foundation of the Semantic Web',
      'Designed for data integration across the web with globally unique identifiers'
    ],
    codeSnippets: [
      {
        language: 'turtle',
        caption: 'Example RDF in Turtle syntax',
        code: `@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

ex:TechCorp rdf:type ex:Company ;
    ex:founded "2010" ;
    ex:employs ex:JaneDoe .`
      }
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: rdfGraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Emphasize that RDF is optimized for global data integration and inference through its standard semantics. The triple structure makes it ideal for distributed data but can be less intuitive for complex property relationships.'
};

/**
 * Property Graph Model Slide
 */
const propertyGraphModelSlide: SlideConfig = {
  id: 'property-graph-model',
  title: 'Property Graph Model',
  content: {
    definition: 'Property graphs organize data as nodes and relationships with properties attached to both, providing a flexible and intuitive structure for domain modeling.',
    keyPoints: [
      'Nodes represent entities with identity and properties',
      'Edges represent typed, directed relationships between entities',
      'Both nodes and edges can have key-value properties',
      'No standardized schema language, but typically use labels for typing',
      'More intuitive for domain modeling but less standardized than RDF',
      'Optimized for traversals and pattern matching queries'
    ],
    codeSnippets: [
      {
        language: 'cypher',
        caption: 'Example Property Graph in Cypher syntax',
        code: `// Create company node
CREATE (c:Company {name: "TechCorp", founded: "2010", headquarters: "San Francisco"})

// Create person node
CREATE (p:Person {name: "Jane Doe", title: "Senior Engineer", joined: "2015"})

// Create relationship with properties
CREATE (c)-[:EMPLOYS {since: "2015", role: "Engineer", department: "R&D"}]->(p)`
      }
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: propertyGraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Highlight that property graphs are intuitive for domain modeling and widely used in enterprise environments. Key differentiators are native property support on relationships and schema flexibility.'
};

/**
 * Hypergraph Model Slide
 */
const hypergraphModelSlide: SlideConfig = {
  id: 'hypergraph-model',
  title: 'Hypergraph Model',
  content: {
    definition: 'Hypergraphs extend traditional graphs by allowing edges (hyperedges) to connect any number of nodes, which enables representing complex multi-entity relationships as a single logical unit.',
    keyPoints: [
      'Hyperedges can connect more than two nodes simultaneously',
      'Enables natural representation of many-to-many relationships',
      'Can model complex relationships that would require multiple edges in other models',
      'Supports both directed and undirected hyperedges',
      'Used in specialized domains like molecular biology, natural language processing, and recommendation systems',
      'Less widespread adoption compared to RDF and property graphs'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: hypergraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 140,
      nodeOverlap: 20,
      padding: 40
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'fade',
  notes: 'Explain that hypergraphs excel at representing complex relationships that inherently involve multiple entities, such as event participation, team membership, or molecular interactions. They remain more niche but are valuable for specific use cases.'
};

/**
 * Graph Models Comparison Slide
 */
const graphModelsComparisonSlide: SlideConfig = {
  id: 'graph-models-comparison',
  title: 'Graph Data Models Comparison',
  content: {
    definition: 'Different graph data models offer distinct trade-offs in terms of expressivity, standardization, and implementation characteristics.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: graphModelsDetailedData.headers,
    rows: graphModelsDetailedData.rows,
    caption: 'Comprehensive comparison of graph data models',
    sortable: true,
    filterable: true
  },
  transition: 'slide',
  notes: 'Emphasize that the choice of graph model should be driven by specific use case requirements, available tools, and developer expertise. Each model has strengths for particular applications.'
};

/**
 * RDF Serialization Formats Slide
 */
const rdfSerializationSlide: SlideConfig = {
  id: 'rdf-serialization-formats',
  title: 'RDF Serialization Formats',
  content: {
    definition: 'RDF data can be serialized in multiple standardized formats, each with different characteristics for human readability, processing efficiency, and integration scenarios.',
    keyPoints: [
      'Multiple formats allow flexibility for different use cases',
      'All formats represent the same underlying triple model',
      'Choice of format impacts storage size and processing efficiency',
      'Most RDF tools support all standard formats with conversion utilities'
    ]
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: rdfSerializationData.headers,
    rows: rdfSerializationData.rows,
    caption: 'Comparison of RDF serialization formats',
    sortable: true
  },
  transition: 'fade',
  notes: 'Highlight that format selection should be based on the specific use case: Turtle for human-readable development, N-Triples for large datasets, JSON-LD for web integration, etc.'
};

/**
 * Property Graph Serialization Slide
 */
const propertyGraphSerializationSlide: SlideConfig = {
  id: 'property-graph-serialization',
  title: 'Property Graph Serialization',
  content: {
    definition: 'Property graphs lack standardized serialization formats, with each database system typically offering multiple import/export options.',
    keyPoints: [
      'GraphML: XML-based format supporting properties but complex for large graphs',
      'GraphSON: JSON-based format designed for interoperability (TinkerPop)',
      'CSV pairs: Separate node and edge files with headers for properties',
      'Cypher script: Database-specific statements for Neo4j',
      'Custom JSON: Vendor-specific or application-specific JSON structures',
      'GQL: Emerging standard for graph query language that includes data definition'
    ],
    codeSnippets: [
      {
        language: 'json',
        caption: 'Example GraphSON format',
        code: `{
  "vertices": [
    {
      "id": "company",
      "label": "Company",
      "properties": {
        "name": [{"id": "p1", "value": "TechCorp"}],
        "founded": [{"id": "p2", "value": "2010"}]
      }
    },
    {
      "id": "person",
      "label": "Person",
      "properties": {
        "name": [{"id": "p3", "value": "Jane Doe"}],
        "title": [{"id": "p4", "value": "Senior Engineer"}]
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "label": "EMPLOYS",
      "outV": "company",
      "inV": "person",
      "properties": {
        "since": "2015",
        "role": "Engineer"
      }
    }
  ]
}`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize the challenge of interoperability between property graph systems due to lack of standardization, and how this impacts data migration and integration scenarios.'
};

/**
 * Performance Characteristics Slide
 */
const performanceCharacteristicsSlide: SlideConfig = {
  id: 'performance-characteristics',
  title: 'Performance Characteristics',
  content: {
    definition: 'Graph data models exhibit distinct performance characteristics compared to other database paradigms, particularly for relationship-focused queries.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: dbPerformanceData.headers,
    rows: dbPerformanceData.rows,
    caption: 'Performance comparison across database models',
    highlightCells: [
      { row: 0, col: 4 },
      { row: 2, col: 4 },
      { row: 3, col: 4 },
      { row: 4, col: 3 }
    ],
    sortable: true
  },
  transition: 'slide',
  notes: 'Explain that graph databases dramatically outperform relational databases for relationship-centric queries, especially as the number of joins/hops increases. However, they may underperform for simpler record retrieval operations.'
};

/**
 * Knowledge Graph Schema Slide
 */
const knowledgeGraphSchemaSlide: SlideConfig = {
  id: 'knowledge-graph-schema',
  title: 'Knowledge Graph Schema Approaches',
  content: {
    definition: 'Knowledge graphs employ various schema approaches, ranging from schema-free to rigidly defined ontologies, each with different trade-offs in flexibility and consistency.',
    keyPoints: [
      'Schema-free: Maximum flexibility but minimal consistency guarantees',
      'Schema-optional: Define constraints only where needed',
      'Ontology-based: Formal semantics with RDFS/OWL for inference',
      'Hybrid approaches: Combine formal ontologies with flexible properties',
      'Schema evolution: Techniques for managing schema changes over time'
    ],
    listItems: [
      {
        title: 'Schema Definition Languages',
        items: [
          'RDFS (RDF Schema): Basic class and property hierarchies',
          'OWL (Web Ontology Language): Advanced logical constraints and inference',
          'SHACL (Shapes Constraint Language): Validation rules for RDF graphs',
          'ShEx (Shape Expressions): Alternative validation language for RDF',
          'GQL Schema (emerging): Schema definitions for property graphs'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that schema approach should balance flexibility for evolution with constraints for data quality and inference capabilities. Schema-optional approaches are increasingly common in enterprise knowledge graphs.'
};

/**
 * Query Languages Overview Slide
 */
const queryLanguagesOverviewSlide: SlideConfig = {
  id: 'query-languages-overview',
  title: 'Graph Query Languages Overview',
  content: {
    definition: 'Graph query languages provide specialized syntax for traversing and manipulating graph structures, with different languages designed for specific graph models.',
    listItems: [
      {
        title: 'RDF Query Languages',
        items: [
          'SPARQL: W3C standard for querying RDF data with pattern matching',
          'SPARQL 1.1: Adds aggregation, subqueries, property paths, and updates',
          'SPARQL-star: Extension for handling statement-level metadata (reification)'
        ],
        type: 'bullet'
      },
      {
        title: 'Property Graph Query Languages',
        items: [
          'Cypher: Declarative language created for Neo4j, now evolving into an open standard',
          'Gremlin: Imperative traversal language from Apache TinkerPop',
          'GraphQL: API query language adaptable to graph data (not natively a graph query language)',
          'GQL: ISO emerging standard combining aspects of Cypher and SQL'
        ],
        type: 'bullet'
      }
    ],
    codeSnippets: [
      {
        language: 'sparql',
        caption: 'Example SPARQL Query',
        code: `PREFIX ex: <http://example.org/>

SELECT ?person ?title
WHERE {
  ?company a ex:Company ;
           ex:name "TechCorp" ;
           ex:employs ?person .
  ?person ex:title ?title .
}`
      },
      {
        language: 'cypher',
        caption: 'Equivalent Cypher Query',
        code: `MATCH (c:Company {name: "TechCorp"})-[:EMPLOYS]->(p:Person)
RETURN p.name, p.title`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Explain that query language choice is typically determined by the underlying graph model and database system. Each language has different strengths in terms of expressivity, optimization, and ease of use.'
};

/**
 * Data Models slide group configuration
 */
export const dataModelsSlideGroup: SlideGroup = {
  title: 'Knowledge Graph Data Models',
  id: 'data-models',
  includeSectionSlide: true,
  slides: [
    rdfModelSlide,
    propertyGraphModelSlide,
    hypergraphModelSlide,
    graphModelsComparisonSlide,
    rdfSerializationSlide,
    propertyGraphSerializationSlide,
    performanceCharacteristicsSlide,
    knowledgeGraphSchemaSlide,
    queryLanguagesOverviewSlide
  ]
};

/**
 * Data Models slides module
 */
export const dataModelsSlides = dataModelsSlideGroup.slides;