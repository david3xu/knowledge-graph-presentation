/**
 * Introduction Slides Module
 * Defines slides that introduce knowledge graph concepts
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Simple example knowledge graph for visualization
 */
const exampleGraphData: GraphData = {
  nodes: [
    { id: 'concept', label: 'Knowledge Graph', type: 'Concept' },
    { id: 'entity', label: 'Entity', type: 'Component' },
    { id: 'relationship', label: 'Relationship', type: 'Component' },
    { id: 'property', label: 'Property', type: 'Component' },
    { id: 'semantic', label: 'Semantic Model', type: 'Component' },
    { id: 'query', label: 'Query Interface', type: 'Component' },
    { id: 'inference', label: 'Inference Engine', type: 'Component' }
  ],
  edges: [
    { source: 'concept', target: 'entity', label: 'CONSISTS_OF' },
    { source: 'concept', target: 'relationship', label: 'CONSISTS_OF' },
    { source: 'concept', target: 'property', label: 'USES' },
    { source: 'concept', target: 'semantic', label: 'DEFINED_BY' },
    { source: 'concept', target: 'query', label: 'ACCESSED_VIA' },
    { source: 'concept', target: 'inference', label: 'ENHANCED_BY' },
    { source: 'entity', target: 'property', label: 'HAS' },
    { source: 'entity', target: 'relationship', label: 'CONNECTED_BY' },
    { source: 'semantic', target: 'inference', label: 'ENABLES' }
  ],
  metadata: {
    name: 'Knowledge Graph Components',
    description: 'Basic components of a knowledge graph',
    lastModified: new Date().toISOString()
  }
};

/**
 * Timeline data for knowledge graph evolution
 */
const evolutionTimelineData = [
  { 
    period: '1960s-1980s', 
    label: 'Early Knowledge Representation', 
    items: ['Semantic Networks', 'Frames & Scripts', 'Expert Systems'] 
  },
  { 
    period: '1990s-2000s', 
    label: 'Semantic Web Foundations', 
    items: ['RDF & OWL', 'Triple Stores', 'Linked Data'] 
  },
  { 
    period: '2012', 
    label: 'Birth of Modern KGs', 
    items: ['Google Knowledge Graph', 'Entity-centric Search'] 
  },
  { 
    period: '2013-2017', 
    label: 'Enterprise Adoption', 
    items: ['Industry KGs', 'Domain-specific Graphs', 'Commercial Platforms'] 
  },
  { 
    period: '2018-Present', 
    label: 'AI Integration', 
    items: ['Graph Neural Networks', 'Embeddings', 'LLM + KG Integration'] 
  }
];

/**
 * Definition slide: What is a Knowledge Graph?
 */
const definitionSlide: SlideConfig = {
  id: 'kg-definition',
  title: 'What is a Knowledge Graph?',
  content: {
    definition: 'A <em>knowledge graph</em> is a structured representation of knowledge as a network of entities and relationships, enriched with domain semantics, context, and systems for acquisition, integration, and inference.',
    keyPoints: [
      'Represents real-world entities and their interrelationships',
      'Integrates data from multiple sources into a unified view',
      'Encodes semantic meaning through ontologies and taxonomies',
      'Enables contextual connections across domains',
      'Supports reasoning and inference capabilities'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: exampleGraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      padding: 30
    },
    highlightNodes: ['concept'],
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Knowledge graphs represent a powerful paradigm for knowledge representation and reasoning, combining graph structures with semantic technologies.'
};

/**
 * Evolution slide: How have Knowledge Graphs evolved?
 */
const evolutionSlide: SlideConfig = {
  id: 'kg-evolution',
  title: 'Evolution of Knowledge Graphs',
  content: {
    definition: 'Knowledge graphs have evolved from early semantic networks into sophisticated knowledge management systems integrated with AI capabilities.',
    keyPoints: [
      'Emerged from semantic networks, frames, and expert systems',
      'Standardized through Semantic Web technologies (RDF, OWL)',
      'Popularized by Google\'s Knowledge Graph in 2012',
      'Expanded to enterprise and domain-specific applications',
      'Now integrating with machine learning and neural approaches'
    ]
  },
  visualizationType: 'timeline',
  visualizationConfig: {
    data: evolutionTimelineData,
    orientation: 'horizontal',
    showLabels: true,
    colorScheme: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8AB4F8']
  },
  transition: 'fade',
  notes: 'Emphasize how knowledge graphs have transitioned from academic research to mainstream commercial applications, and now represent a key component in modern AI systems.'
};

/**
 * Benefits slide: Why use Knowledge Graphs?
 */
const benefitsSlide: SlideConfig = {
  id: 'kg-benefits',
  title: 'Why Use Knowledge Graphs?',
  content: {
    keyPoints: [
      'Integrates heterogeneous data sources into a unified view',
      'Discovers non-obvious connections between entities',
      'Provides context and semantics for AI and machine learning',
      'Enables explainable reasoning and inference',
      'Supports complex querying across domains',
      'Facilitates knowledge discovery and data exploration'
    ],
    quote: {
      text: 'Knowledge graphs are to unstructured and semi-structured data what relational databases have been to structured data.',
      author: 'Jans Aasman',
      source: 'CEO, Franz Inc.'
    }
  },
  visualizationType: 'none',
  transition: 'convex',
  background: {
    color: '#f5f5f5'
  },
  notes: 'Highlight real-world use cases that demonstrate these benefits across different industries.'
};

/**
 * Comparison slide: Knowledge Graphs vs. Traditional Databases
 */
const comparisonSlide: SlideConfig = {
  id: 'kg-vs-databases',
  title: 'Knowledge Graphs vs. Traditional Databases',
  content: {
    definition: 'Knowledge graphs offer distinct advantages over traditional database technologies for certain types of data and queries.'
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: ['Feature', 'Relational Databases', 'Document Stores', 'Knowledge Graphs'],
    rows: [
      { 
        'Feature': 'Data Model', 
        'Relational Databases': 'Tables, rows, columns', 
        'Document Stores': 'Documents, collections', 
        'Knowledge Graphs': 'Nodes, edges, properties' 
      },
      { 
        'Feature': 'Schema', 
        'Relational Databases': 'Fixed schema', 
        'Document Stores': 'Schema-less', 
        'Knowledge Graphs': 'Flexible ontology' 
      },
      { 
        'Feature': 'Relationships', 
        'Relational Databases': 'Foreign keys, joins', 
        'Document Stores': 'Embedded documents, references', 
        'Knowledge Graphs': 'First-class citizens' 
      },
      { 
        'Feature': 'Query Complexity', 
        'Relational Databases': 'Complex joins degrade performance', 
        'Document Stores': 'Limited relationship traversal', 
        'Knowledge Graphs': 'Efficient for deeply connected data' 
      },
      { 
        'Feature': 'Semantic Context', 
        'Relational Databases': 'Limited', 
        'Document Stores': 'Limited', 
        'Knowledge Graphs': 'Rich semantics' 
      },
      { 
        'Feature': 'Inference', 
        'Relational Databases': 'Triggers & stored procedures', 
        'Document Stores': 'Application logic', 
        'Knowledge Graphs': 'Built-in reasoning capabilities' 
      }
    ],
    caption: 'Comparison of knowledge graphs with traditional database technologies',
    highlightCells: [
      { row: 2, col: 3 },
      { row: 3, col: 3 },
      { row: 4, col: 3 }
    ],
    sortable: true,
    filterable: true
  },
  transition: 'slide',
  notes: 'Emphasize that knowledge graphs are not a replacement for traditional databases but complement them for specific use cases requiring rich relationships and semantic context.'
};

/**
 * Introduction slide group configuration
 */
export const introSlideGroup: SlideGroup = {
  title: 'Introduction to Knowledge Graphs',
  id: 'intro',
  includeSectionSlide: true,
  slides: [
    definitionSlide,
    evolutionSlide,
    benefitsSlide,
    comparisonSlide
  ]
};

/**
 * Introduction slides module
 */
export const introSlides = introSlideGroup.slides;