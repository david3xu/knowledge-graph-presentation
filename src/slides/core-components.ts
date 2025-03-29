/**
 * Core Components Slides Module
 * Defines slides that explain core components and structure of knowledge graphs
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Example property graph data structure
 */
const propertyGraphData: GraphData = {
  nodes: [
    { id: 'company', label: 'Company:TechCorp', type: 'Company', 
      properties: { founded: '2010', headquarters: 'San Francisco', employees: 1500 } },
    { id: 'person', label: 'Person:JaneDoe', type: 'Person', 
      properties: { born: '1985', title: 'Senior Engineer', email: 'jane@example.com' } },
    { id: 'product', label: 'Product:Widget', type: 'Product', 
      properties: { launched: '2018', category: 'Hardware', price: '$299' } },
    { id: 'role', label: 'Role:Engineer', type: 'Role', 
      properties: { department: 'R&D', level: 'Senior' } },
    { id: 'category', label: 'Category:Hardware', type: 'Category', 
      properties: { description: 'Physical computing devices' } }
  ],
  edges: [
    { source: 'company', target: 'person', label: 'EMPLOYS', 
      properties: { since: '2015', position: 'Full-time' } },
    { source: 'company', target: 'product', label: 'PRODUCES', 
      properties: { launched: '2018', revenue: '$10M' } },
    { source: 'person', target: 'role', label: 'HAS_ROLE', 
      properties: { since: '2018' } },
    { source: 'product', target: 'category', label: 'BELONGS_TO', 
      properties: { primary: true } }
  ]
};

/**
 * Knowledge representation types comparison data
 */
const representationTableData = {
  headers: ['Representation', 'Structure', 'Semantics', 'Inferencing', 'Query Complexity', 'Best For'],
  rows: [
    { 
      'Representation': 'Taxonomies', 
      'Structure': 'Hierarchical', 
      'Semantics': 'Limited (is-a relationships)', 
      'Inferencing': 'Basic inheritance', 
      'Query Complexity': 'Low', 
      'Best For': 'Classification, categorization' 
    },
    { 
      'Representation': 'Thesauri', 
      'Structure': 'Network', 
      'Semantics': 'Moderate (synonyms, related terms)', 
      'Inferencing': 'Term expansion', 
      'Query Complexity': 'Low-Medium', 
      'Best For': 'Information retrieval, search' 
    },
    { 
      'Representation': 'Ontologies', 
      'Structure': 'Graph/Network', 
      'Semantics': 'Rich (complex relationships, axioms)', 
      'Inferencing': 'Logical reasoning', 
      'Query Complexity': 'High', 
      'Best For': 'Knowledge representation, logic' 
    },
    { 
      'Representation': 'Knowledge Graphs', 
      'Structure': 'Property Graph or RDF', 
      'Semantics': 'Rich (ontology + instance data)', 
      'Inferencing': 'Multiple reasoning paradigms', 
      'Query Complexity': 'Very High', 
      'Best For': 'Integrated knowledge management' 
    }
  ]
};

/**
 * Graph models comparison data
 */
const graphModelsTableData = {
  headers: ['Feature', 'RDF Graph', 'Property Graph', 'Hypergraph'],
  rows: [
    { 
      'Feature': 'Basic Unit', 
      'RDF Graph': 'Triple (subject-predicate-object)', 
      'Property Graph': 'Nodes and edges with properties', 
      'Hypergraph': 'Hyperedges connecting multiple nodes' 
    },
    { 
      'Feature': 'Edge Properties', 
      'RDF Graph': 'Requires reification', 
      'Property Graph': 'Native support', 
      'Hypergraph': 'Native support' 
    },
    { 
      'Feature': 'Semantic Standards', 
      'RDF Graph': 'W3C standards (RDFS, OWL)', 
      'Property Graph': 'Vendor-specific', 
      'Hypergraph': 'Limited standardization' 
    },
    { 
      'Feature': 'Serialization', 
      'RDF Graph': 'Multiple formats (RDF/XML, Turtle, N-Triples)', 
      'Property Graph': 'JSON, GraphML, custom formats', 
      'Hypergraph': 'Custom formats' 
    },
    { 
      'Feature': 'Query Language', 
      'RDF Graph': 'SPARQL', 
      'Property Graph': 'Cypher, Gremlin', 
      'Hypergraph': 'Custom query languages' 
    },
    { 
      'Feature': 'Implementations', 
      'RDF Graph': 'AllegroGraph, Virtuoso, GraphDB', 
      'Property Graph': 'Neo4j, JanusGraph, TigerGraph', 
      'Hypergraph': 'HypergraphDB, research systems' 
    }
  ]
};

/**
 * Data for the ontology construction process
 */
const ontologyProcessData = {
  nodes: [
    { id: 'domain', label: 'Domain Analysis', type: 'process' },
    { id: 'terms', label: 'Term Extraction', type: 'process' },
    { id: 'classes', label: 'Class Definition', type: 'process' },
    { id: 'properties', label: 'Property Specification', type: 'process' },
    { id: 'relationships', label: 'Relationship Mapping', type: 'process' },
    { id: 'axioms', label: 'Axiom Definition', type: 'process' },
    { id: 'validation', label: 'Validation', type: 'process' },
    { id: 'documentation', label: 'Documentation', type: 'process' },
    { id: 'deployment', label: 'Deployment', type: 'process' }
  ],
  edges: [
    { from: 'domain', to: 'terms' },
    { from: 'terms', to: 'classes' },
    { from: 'classes', to: 'properties' },
    { from: 'properties', to: 'relationships' },
    { from: 'relationships', to: 'axioms' },
    { from: 'axioms', to: 'validation' },
    { from: 'validation', to: 'documentation' },
    { from: 'documentation', to: 'deployment' },
    { from: 'validation', to: 'axioms', label: 'Refine' }
  ]
};

/**
 * Property Graph Structure Slide
 */
const propertyGraphSlide: SlideConfig = {
  id: 'property-graph-structure',
  title: 'Property Graph Structure',
  content: {
    definition: 'Property graphs represent knowledge as nodes (entities) and edges (relationships), both of which can have properties (attributes) attached to them.',
    keyPoints: [
      'Nodes represent entities with identity, labels, and properties',
      'Edges represent directional relationships between entities',
      'Both nodes and edges can have properties (key-value pairs)',
      'Labels categorize nodes and edges by type',
      'No built-in schema or validation (schema-optional)'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: propertyGraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 40
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Highlight how properties on both nodes and edges distinguish property graphs from traditional graph structures. Mention that this model is used by systems like Neo4j, JanusGraph, and Amazon Neptune.'
};

/**
 * RDF Graph Structure Slide
 */
const rdfGraphSlide: SlideConfig = {
  id: 'rdf-graph-structure',
  title: 'RDF Graph Structure',
  content: {
    definition: 'Resource Description Framework (RDF) represents knowledge as a set of triples: subject-predicate-object statements that form a labeled, directed graph.',
    keyPoints: [
      'Every statement is a triple: (subject, predicate, object)',
      'Subjects and predicates are always URIs',
      'Objects can be URIs or literal values',
      'No direct property support on relationships (requires reification)',
      'Built on W3C standards with formal semantics',
      'Forms the foundation of the Semantic Web'
    ],
    codeSnippets: [
      {
        language: 'turtle',
        caption: 'Example RDF in Turtle syntax',
        code: `@prefix ex: <http://example.org/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

ex:TechCorp a ex:Company ;
    ex:founded "2010" ;
    ex:headquarters "San Francisco" ;
    ex:employees 1500 ;
    ex:employs ex:JaneDoe .

ex:JaneDoe a foaf:Person ;
    foaf:name "Jane Doe" ;
    ex:born "1985" ;
    ex:hasRole ex:Engineer .`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Explain that RDF\'s globally unique identifiers (URIs) enable global knowledge integration. Mention that RDF is the foundation for triple stores like Virtuoso, AllegroGraph, and GraphDB.'
};

/**
 * Knowledge Representation Comparison Slide
 */
const representationComparisonSlide: SlideConfig = {
  id: 'knowledge-representation-comparison',
  title: 'Knowledge Representation Approaches',
  content: {
    definition: 'Knowledge graphs build upon and extend earlier knowledge representation paradigms, each with distinct characteristics and capabilities.'
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: representationTableData.headers,
    rows: representationTableData.rows,
    caption: 'Comparison of knowledge representation approaches',
    highlightCells: [
      { row: 3, col: 1 },
      { row: 3, col: 2 },
      { row: 3, col: 3 },
      { row: 3, col: 4 }
    ],
    sortable: true
  },
  transition: 'slide',
  notes: 'Clarify that these approaches are often complementary, with knowledge graphs typically incorporating taxonomies and ontologies as part of their structure.'
};

/**
 * Graph Models Comparison Slide
 */
const graphModelsComparisonSlide: SlideConfig = {
  id: 'graph-models-comparison',
  title: 'Graph Models Comparison',
  content: {
    definition: 'Different graph data models offer distinct approaches to representing knowledge, each with strengths for particular use cases.'
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: graphModelsTableData.headers,
    rows: graphModelsTableData.rows,
    caption: 'Comparison of graph data models',
    sortable: false
  },
  transition: 'slide',
  notes: 'Highlight that RDF is optimized for data integration and standardization, while property graphs excel at rich relationship modeling. Mention that systems like Grakn and Neo4j RDF combine aspects of both.'
};

/**
 * Ontology Construction Process Slide
 */
const ontologyProcessSlide: SlideConfig = {
  id: 'ontology-construction-process',
  title: 'Ontology Construction Process',
  content: {
    definition: 'Ontology development follows a systematic process to define classes, properties, relationships, and logical rules that form the schema of a knowledge graph.',
    keyPoints: [
      'Begins with domain analysis to identify scope and requirements',
      'Extracts key terms and concepts from domain knowledge',
      'Defines class hierarchies and properties',
      'Maps relationships between classes',
      'Adds logical axioms and constraints',
      'Iteratively validates and refines the model',
      'Documents and deploys the ontology'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: ontologyProcessData.nodes,
    edges: ontologyProcessData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Emphasize that ontology development is iterative and typically involves domain experts working with knowledge engineers. Mention tools like Protégé, TopBraid Composer, and OWLGrEd.'
};

/**
 * ASCII Diagram of Knowledge Graph Layers
 */
const kgLayersAsciiSlide: SlideConfig = {
  id: 'kg-layers-ascii',
  title: 'Knowledge Graph Architectural Layers',
  content: {
    definition: 'Knowledge graphs typically implement a layered architecture that separates storage, access, and application concerns.'
  },
  visualizationType: 'ascii',
  visualizationConfig: {
    text: `
+-----------------------------------------------------+
|                 APPLICATIONS LAYER                   |
|  +----------------+  +---------------+  +---------+  |
|  | Search/Recomm. |  | Analytics     |  | BI/ML   |  |
|  +----------------+  +---------------+  +---------+  |
+-----------------------------------------------------+
|                   ACCESS LAYER                       |
|  +----------------+  +---------------+  +---------+  |
|  | Query API      |  | Inference     |  | Search  |  |
|  +----------------+  +---------------+  +---------+  |
+-----------------------------------------------------+
|                  KNOWLEDGE LAYER                     |
|  +----------------+  +---------------+  +---------+  |
|  | Entities       |  | Relationships |  |Properties| |
|  +----------------+  +---------------+  +---------+  |
|  +----------------+  +---------------+               |
|  | Ontologies     |  | Rules         |               |
|  +----------------+  +---------------+               |
+-----------------------------------------------------+
|                   STORAGE LAYER                      |
|  +----------------+  +---------------+  +---------+  |
|  | Graph Database |  | Triple Store  |  | Indexes |  |
|  +----------------+  +---------------+  +---------+  |
+-----------------------------------------------------+`,
    boxWidth: 10,
    boxHeight: 16,
    lineColor: '#333',
    textColor: '#000',
    boxColor: '#f5f5f5'
  },
  transition: 'fade',
  notes: 'Explain that this layered approach enables separation of concerns and makes it possible to swap out components at different layers. For example, the storage layer could be implemented with different graph databases without affecting the knowledge model.'
};

/**
 * Core Components slide group configuration
 */
export const coreComponentsSlideGroup: SlideGroup = {
  title: 'Core Components and Structure',
  id: 'core-components',
  includeSectionSlide: true,
  slides: [
    propertyGraphSlide,
    rdfGraphSlide,
    representationComparisonSlide,
    graphModelsComparisonSlide,
    ontologyProcessSlide,
    kgLayersAsciiSlide
  ]
};

/**
 * Core Components slides module
 */
export const coreComponentsSlides = coreComponentsSlideGroup.slides;