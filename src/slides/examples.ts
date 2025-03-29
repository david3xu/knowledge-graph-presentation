/**
 * Examples Slides Module
 * Defines slides that showcase real-world knowledge graph implementations
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Google Knowledge Graph simplified structure
 */
const googleKgData: GraphData = {
  nodes: [
    { id: 'entity1', label: 'Eiffel Tower', type: 'Landmark', 
      properties: { location: 'Paris, France', height: '330m', built: '1889' } },
    { id: 'entity2', label: 'Paris', type: 'City', 
      properties: { country: 'France', population: '2.2M' } },
    { id: 'entity3', label: 'France', type: 'Country', 
      properties: { capital: 'Paris', population: '67M' } },
    { id: 'entity4', label: 'Louvre Museum', type: 'Museum', 
      properties: { location: 'Paris, France', founded: '1793' } },
    { id: 'entity5', label: 'Mona Lisa', type: 'Artwork', 
      properties: { creator: 'Leonardo da Vinci', year: '1503-1506' } },
    { id: 'entity6', label: 'Leonardo da Vinci', type: 'Person', 
      properties: { born: '1452', died: '1519', profession: 'Polymath' } },
    { id: 'entity7', label: 'Museum', type: 'Type', 
      properties: { description: 'Institution that preserves artifacts' } },
    { id: 'entity8', label: 'Tourism', type: 'Industry', 
      properties: { description: 'Travel for recreation' } }
  ],
  edges: [
    { source: 'entity1', target: 'entity2', label: 'LOCATED_IN' },
    { source: 'entity2', target: 'entity3', label: 'PART_OF' },
    { source: 'entity4', target: 'entity2', label: 'LOCATED_IN' },
    { source: 'entity5', target: 'entity4', label: 'EXHIBITED_AT' },
    { source: 'entity5', target: 'entity6', label: 'CREATED_BY' },
    { source: 'entity4', target: 'entity7', label: 'IS_A' },
    { source: 'entity1', target: 'entity8', label: 'RELATED_TO' },
    { source: 'entity4', target: 'entity8', label: 'RELATED_TO' }
  ]
};

/**
 * Enterprise knowledge graph example
 */
const enterpriseKgData: GraphData = {
  nodes: [
    { id: 'product1', label: 'Enterprise Server X1', type: 'Product', 
      properties: { sku: 'ES-X1-2023', launch: '2023-06', price: '$4,500' } },
    { id: 'component1', label: 'RAID Controller', type: 'Component', 
      properties: { type: 'Hardware', criticality: 'High' } },
    { id: 'component2', label: 'Power Supply', type: 'Component', 
      properties: { type: 'Hardware', redundant: true } },
    { id: 'component3', label: 'Management API', type: 'Component', 
      properties: { type: 'Software', version: '3.1.2' } },
    { id: 'issue1', label: 'Overheating Issue', type: 'Issue', 
      properties: { severity: 'Major', reportedDate: '2023-07-15' } },
    { id: 'customer1', label: 'Acme Corporation', type: 'Customer', 
      properties: { segment: 'Enterprise', region: 'North America' } },
    { id: 'person1', label: 'John Smith', type: 'Person', 
      properties: { role: 'Support Engineer', expertise: 'Hardware' } },
    { id: 'document1', label: 'Thermal Design Spec', type: 'Document', 
      properties: { type: 'Specification', version: '2.3' } }
  ],
  edges: [
    { source: 'product1', target: 'component1', label: 'CONTAINS' },
    { source: 'product1', target: 'component2', label: 'CONTAINS' },
    { source: 'product1', target: 'component3', label: 'CONTAINS' },
    { source: 'issue1', target: 'component2', label: 'AFFECTS' },
    { source: 'customer1', target: 'product1', label: 'PURCHASED' },
    { source: 'customer1', target: 'issue1', label: 'REPORTED' },
    { source: 'person1', target: 'issue1', label: 'ASSIGNED_TO' },
    { source: 'document1', target: 'component2', label: 'DESCRIBES' },
    { source: 'document1', target: 'issue1', label: 'REFERENCED_BY' }
  ]
};

/**
 * Biomedical knowledge graph example
 */
const biomedicalKgData: GraphData = {
  nodes: [
    { id: 'disease1', label: 'Type 2 Diabetes', type: 'Disease', 
      properties: { icd10: 'E11', prevalence: 'High', chronic: true } },
    { id: 'gene1', label: 'TCF7L2', type: 'Gene', 
      properties: { chromosome: '10', function: 'Transcription factor' } },
    { id: 'protein1', label: 'TCF7L2 Protein', type: 'Protein', 
      properties: { structure: 'High mobility group box' } },
    { id: 'pathway1', label: 'Wnt Signaling', type: 'Pathway', 
      properties: { function: 'Cell fate and proliferation' } },
    { id: 'drug1', label: 'Metformin', type: 'Drug', 
      properties: { class: 'Biguanide', approved: '1994' } },
    { id: 'symptom1', label: 'Hyperglycemia', type: 'Symptom', 
      properties: { description: 'High blood glucose' } },
    { id: 'publication1', label: 'Grant et al. 2006', type: 'Publication', 
      properties: { journal: 'Nature Genetics', doi: '10.1038/ng1732' } },
    { id: 'cell1', label: 'Pancreatic β-cell', type: 'Cell', 
      properties: { location: 'Pancreatic islets', function: 'Insulin secretion' } }
  ],
  edges: [
    { source: 'gene1', target: 'disease1', label: 'ASSOCIATED_WITH' },
    { source: 'gene1', target: 'protein1', label: 'ENCODES' },
    { source: 'protein1', target: 'pathway1', label: 'PARTICIPATES_IN' },
    { source: 'drug1', target: 'disease1', label: 'TREATS' },
    { source: 'symptom1', target: 'disease1', label: 'SYMPTOM_OF' },
    { source: 'publication1', target: 'gene1', label: 'DESCRIBES' },
    { source: 'cell1', target: 'disease1', label: 'IMPLICATED_IN' },
    { source: 'drug1', target: 'cell1', label: 'TARGETS' }
  ]
};

/**
 * Media and entertainment knowledge graph
 */
const mediaKgData: GraphData = {
  nodes: [
    { id: 'movie1', label: 'The Matrix', type: 'Movie', 
      properties: { released: '1999', genre: 'Science Fiction', runtime: '136m' } },
    { id: 'person1', label: 'Keanu Reeves', type: 'Person', 
      properties: { born: '1964', nationality: 'Canadian' } },
    { id: 'character1', label: 'Neo', type: 'Character', 
      properties: { alias: 'The One', occupation: 'Programmer' } },
    { id: 'person2', label: 'Lana Wachowski', type: 'Person', 
      properties: { born: '1965', nationality: 'American' } },
    { id: 'person3', label: 'Lilly Wachowski', type: 'Person', 
      properties: { born: '1967', nationality: 'American' } },
    { id: 'studio1', label: 'Warner Bros.', type: 'Studio', 
      properties: { founded: '1923', headquarters: 'Burbank, CA' } },
    { id: 'concept1', label: 'Simulation Hypothesis', type: 'Concept', 
      properties: { field: 'Philosophy', related: 'Metaphysics' } },
    { id: 'movie2', label: 'John Wick', type: 'Movie', 
      properties: { released: '2014', genre: 'Action', runtime: '101m' } }
  ],
  edges: [
    { source: 'person1', target: 'movie1', label: 'ACTED_IN' },
    { source: 'person1', target: 'character1', label: 'PORTRAYED' },
    { source: 'character1', target: 'movie1', label: 'APPEARS_IN' },
    { source: 'person2', target: 'movie1', label: 'DIRECTED' },
    { source: 'person3', target: 'movie1', label: 'DIRECTED' },
    { source: 'studio1', target: 'movie1', label: 'PRODUCED' },
    { source: 'movie1', target: 'concept1', label: 'EXPLORES' },
    { source: 'person1', target: 'movie2', label: 'ACTED_IN' }
  ]
};

/**
 * Major knowledge graph implementations comparison
 */
const majorKgImplementationsData = {
  headers: ['Implementation', 'Organization', 'Scale', 'Primary Purpose', 'Technology', 'Public Access'],
  rows: [
    { 
      'Implementation': 'Google Knowledge Graph', 
      'Organization': 'Google', 
      'Scale': '500B+ facts, 5B+ entities', 
      'Primary Purpose': 'Search enhancement, question answering', 
      'Technology': 'Proprietary graph database', 
      'Public Access': 'Limited API, search results' 
    },
    { 
      'Implementation': 'Wikidata', 
      'Organization': 'Wikimedia Foundation', 
      'Scale': '100M+ statements, 100M+ entities', 
      'Primary Purpose': 'Centralized structured data for Wikimedia projects', 
      'Technology': 'RDF/Blazegraph', 
      'Public Access': 'Full (open data, SPARQL endpoint)' 
    },
    { 
      'Implementation': 'Facebook Entity Graph', 
      'Organization': 'Meta', 
      'Scale': 'Trillions of entities and connections', 
      'Primary Purpose': 'Social network analysis, recommendations', 
      'Technology': 'TAO (distributed data store)', 
      'Public Access': 'None (internal use)' 
    },
    { 
      'Implementation': 'Microsoft Academic Graph', 
      'Organization': 'Microsoft', 
      'Scale': '250M+ publications, 250M+ authors', 
      'Primary Purpose': 'Academic research and analysis', 
      'Technology': 'Azure Cosmos DB', 
      'Public Access': 'Limited API, discontinued in 2021' 
    },
    { 
      'Implementation': 'LinkedIn Economic Graph', 
      'Organization': 'LinkedIn (Microsoft)', 
      'Scale': '800M+ members, 60M+ companies', 
      'Primary Purpose': 'Professional connections, labor market insights', 
      'Technology': 'Proprietary graph platform', 
      'Public Access': 'None (internal use, aggregated insights)' 
    },
    { 
      'Implementation': 'Amazon Product Graph', 
      'Organization': 'Amazon', 
      'Scale': 'Billions of products and relationships', 
      'Primary Purpose': 'Product discovery, recommendations', 
      'Technology': 'Neptune and proprietary systems', 
      'Public Access': 'None (internal use, visible in recommendations)' 
    },
    { 
      'Implementation': 'DBpedia', 
      'Organization': 'DBpedia Association', 
      'Scale': '3B+ facts, 4.5M+ entities', 
      'Primary Purpose': 'Structured extraction from Wikipedia', 
      'Technology': 'RDF/Virtuoso', 
      'Public Access': 'Full (open data, SPARQL endpoint)' 
    }
  ]
};

/**
 * Domain-specific knowledge graph implementations
 */
const domainSpecificKgData = {
  headers: ['Domain', 'Example KG', 'Scale', 'Key Features', 'Use Cases'],
  rows: [
    { 
      'Domain': 'Biomedical', 
      'Example KG': 'UMLS (Unified Medical Language System)', 
      'Scale': '3.5M+ concepts, 12M+ relationships', 
      'Key Features': 'Multi-lingual, integrates 200+ source vocabularies', 
      'Use Cases': 'Drug discovery, clinical decision support, literature mining' 
    },
    { 
      'Domain': 'Financial', 
      'Example KG': 'FIBO (Financial Industry Business Ontology)', 
      'Scale': '30K+ concepts, formal OWL ontology', 
      'Key Features': 'ISO standard, regulatory compliance support', 
      'Use Cases': 'Regulatory reporting, risk analysis, compliance automation' 
    },
    { 
      'Domain': 'Legal', 
      'Example KG': 'Thomson Reuters Legal Knowledge Graph', 
      'Scale': 'Millions of legal documents and entities', 
      'Key Features': 'Jurisdiction-aware, precedent linking', 
      'Use Cases': 'Legal research, case prediction, compliance monitoring' 
    },
    { 
      'Domain': 'Manufacturing', 
      'Example KG': 'Siemens Industrial Knowledge Graph', 
      'Scale': 'Billions of component and process relationships', 
      'Key Features': 'Digital twin integration, process modeling', 
      'Use Cases': 'Predictive maintenance, supply chain optimization, design reuse' 
    },
    { 
      'Domain': 'Media/Entertainment', 
      'Example KG': 'Netflix Graph', 
      'Scale': 'Billions of viewing behaviors and content metadata', 
      'Key Features': 'User preference modeling, content tagging', 
      'Use Cases': 'Content recommendations, viewer segmentation, content acquisition' 
    },
    { 
      'Domain': 'eCommerce', 
      'Example KG': 'eBay Product Knowledge Graph', 
      'Scale': '2B+ products with attributes', 
      'Key Features': 'Automatic catalog integration, multi-lingual', 
      'Use Cases': 'Product search, catalog organization, attribute extraction' 
    },
    { 
      'Domain': 'Cybersecurity', 
      'Example KG': 'MITRE ATT&CK Knowledge Base', 
      'Scale': '14 tactics, 185+ techniques, thousands of relationships', 
      'Key Features': 'Threat actor behaviors, mitigation techniques', 
      'Use Cases': 'Threat intelligence, attack path analysis, defense planning' 
    }
  ]
};

/**
 * Knowledge graph scale metrics comparison
 */
const scaleMetricsData = {
  headers: ['Metric', 'Small KG', 'Medium KG', 'Large KG', 'Very Large KG'],
  rows: [
    { 
      'Metric': 'Node Count', 
      'Small KG': '< 100K', 
      'Medium KG': '100K - 10M', 
      'Large KG': '10M - 1B', 
      'Very Large KG': '> 1B' 
    },
    { 
      'Metric': 'Edge Count', 
      'Small KG': '< 1M', 
      'Medium KG': '1M - 100M', 
      'Large KG': '100M - 10B', 
      'Very Large KG': '> 10B' 
    },
    { 
      'Metric': 'Storage Size', 
      'Small KG': '< 10 GB', 
      'Medium KG': '10 GB - 1 TB', 
      'Large KG': '1 TB - 100 TB', 
      'Very Large KG': '> 100 TB' 
    },
    { 
      'Metric': 'Entity Types', 
      'Small KG': '< 50', 
      'Medium KG': '50 - 500', 
      'Large KG': '500 - 5,000', 
      'Very Large KG': '> 5,000' 
    },
    { 
      'Metric': 'Relation Types', 
      'Small KG': '< 100', 
      'Medium KG': '100 - 1,000', 
      'Large KG': '1,000 - 10,000', 
      'Very Large KG': '> 10,000' 
    },
    { 
      'Metric': 'Update Frequency', 
      'Small KG': 'Real-time', 
      'Medium KG': 'Minutes/Hours', 
      'Large KG': 'Hours/Daily', 
      'Very Large KG': 'Daily/Weekly' 
    },
    { 
      'Metric': 'Query Response Time', 
      'Small KG': 'Milliseconds', 
      'Medium KG': 'Milliseconds-Seconds', 
      'Large KG': 'Seconds', 
      'Very Large KG': 'Seconds-Minutes' 
    }
  ]
};

/**
 * Knowledge graph architecture components
 */
const architectureComponentsData = {
  nodes: [
    { id: 'ingestion', label: 'Data Ingestion', type: 'component' },
    { id: 'extraction', label: 'Entity Extraction', type: 'component' },
    { id: 'storage', label: 'Graph Storage', type: 'component' },
    { id: 'index', label: 'Search Index', type: 'component' },
    { id: 'query', label: 'Query Engine', type: 'component' },
    { id: 'inference', label: 'Inference Engine', type: 'component' },
    { id: 'api', label: 'API Layer', type: 'component' },
    { id: 'ui', label: 'User Interface', type: 'component' },
    { id: 'data_sources', label: 'Data Sources', type: 'external' },
    { id: 'applications', label: 'Applications', type: 'external' }
  ],
  edges: [
    { from: 'data_sources', to: 'ingestion' },
    { from: 'ingestion', to: 'extraction' },
    { from: 'extraction', to: 'storage' },
    { from: 'storage', to: 'index' },
    { from: 'storage', to: 'query' },
    { from: 'storage', to: 'inference' },
    { from: 'inference', to: 'storage', label: 'Updates' },
    { from: 'query', to: 'api' },
    { from: 'index', to: 'api' },
    { from: 'api', to: 'ui' },
    { from: 'api', to: 'applications' }
  ]
};

/**
 * Google Knowledge Graph Slide
 */
const googleKgSlide: SlideConfig = {
  id: 'google-knowledge-graph',
  title: 'Google Knowledge Graph',
  content: {
    definition: 'Google Knowledge Graph is one of the most prominent public knowledge graphs, used to enhance search results with structured information about entities and their relationships.',
    keyPoints: [
      'Launched in 2012 to provide semantic search capabilities',
      'Contains over 500 billion facts about 5 billion entities',
      'Powers Google\'s information boxes, carousel results, and other structured content',
      'Sources include Wikipedia, Wikidata, CIA World Factbook, and thousands of specialized sources',
      'Enables natural language understanding and question-answering',
      'Provides limited API access for third-party applications'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: googleKgData,
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
  notes: 'Emphasize how Google KG transformed search from keyword matching to entity-centric information retrieval. The visualization shows a simplified subset focused on tourism entities, demonstrating the interconnected nature of facts in the knowledge graph.'
};

/**
 * Enterprise Knowledge Graph Slide
 */
const enterpriseKgSlide: SlideConfig = {
  id: 'enterprise-knowledge-graphs',
  title: 'Enterprise Knowledge Graphs',
  content: {
    definition: 'Enterprise Knowledge Graphs integrate diverse organizational data into a unified semantic layer, enabling cross-domain knowledge discovery and advanced analytics.',
    keyPoints: [
      'Connect siloed data sources across the organization (CRM, ERP, documents, etc.)',
      'Model complex business relationships with rich context',
      'Support knowledge discovery, search, and 360° views of business entities',
      'Enable semantic interoperability between systems',
      'Provide foundation for AI applications like chatbots and recommendation systems',
      'Maintain institutional knowledge and support knowledge workers'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: enterpriseKgData,
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
  notes: 'This example shows a product support knowledge graph that connects products, components, issues, customers, and documentation. Emphasize how this unified view enables better support resolution, product improvement, and knowledge reuse.'
};

/**
 * Domain-Specific Knowledge Graphs Slide
 */
const domainSpecificKgsSlide: SlideConfig = {
  id: 'domain-specific-kgs',
  title: 'Domain-Specific Knowledge Graphs',
  content: {
    definition: 'Domain-specific knowledge graphs capture specialized knowledge for particular industries or fields, with tailored ontologies and relationship types optimized for domain-specific reasoning.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: domainSpecificKgData.headers,
    rows: domainSpecificKgData.rows,
    caption: 'Examples of domain-specific knowledge graphs',
    sortable: true
  },
  transition: 'slide',
  notes: 'Highlight that domain-specific KGs often incorporate specialized vocabularies, standards, and reasoning rules unique to their field. They typically provide more value than general-purpose KGs for specific use cases.'
};

/**
 * Biomedical Knowledge Graph Slide
 */
const biomedicalKgSlide: SlideConfig = {
  id: 'biomedical-knowledge-graph',
  title: 'Biomedical Knowledge Graphs',
  content: {
    definition: 'Biomedical knowledge graphs integrate complex biological, chemical, and medical data to accelerate research, drug discovery, and clinical applications.',
    keyPoints: [
      'Integrate diverse data: genes, proteins, diseases, drugs, symptoms, pathways',
      'Link to literature and experimental evidence',
      'Enable discovery of non-obvious relationships and drug repurposing',
      'Support precision medicine by connecting patient data to medical knowledge',
      'Examples: SPOKE (Scalable Precision Medicine Open Knowledge Engine), Hetionet, KG-COVID-19'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: biomedicalKgData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'fade',
  notes: 'This example shows a fragment of a biomedical knowledge graph focusing on Type 2 Diabetes, related genes, and treatments. Emphasize how these connections can reveal new therapeutic targets and improve understanding of disease mechanisms.'
};

/**
 * Media and Entertainment Knowledge Graph Slide
 */
const mediaKgSlide: SlideConfig = {
  id: 'media-entertainment-kg',
  title: 'Media & Entertainment Knowledge Graphs',
  content: {
    definition: 'Media and entertainment knowledge graphs model content, creators, characters, and concepts to power recommendations, content discovery, and enhanced viewing experiences.',
    keyPoints: [
      'Connect content metadata, talent information, characters, and concepts',
      'Support personalized recommendations and content discovery',
      'Enable sophisticated content search (e.g., "movies with car chases in Tokyo")',
      'Power "x-ray" features showing cast information during playback',
      'Support content licensing decisions and acquisition strategies',
      'Examples: Netflix Graph, IMDb Knowledge Graph, BBC Ontologies'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: mediaKgData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'fade',
  notes: 'This example shows a simplified view of movie entities and relationships. Note how discovering that the same actor appears in different movies creates a connection point for recommendations.'
};

/**
 * Major KG Implementations Comparison Slide
 */
const majorKgImplementationsSlide: SlideConfig = {
  id: 'major-kg-implementations',
  title: 'Major Knowledge Graph Implementations',
  content: {
    definition: 'Large-scale knowledge graphs have been implemented by major technology companies and organizations, each with different purposes, scales, and levels of public accessibility.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: majorKgImplementationsData.headers,
    rows: majorKgImplementationsData.rows,
    caption: 'Comparison of major knowledge graph implementations',
    sortable: true
  },
  transition: 'slide',
  notes: 'Emphasize the scale differences and how public vs. private access impacts the usage and applications. Many of these KGs power services we use daily without realizing the graph technology behind them.'
};

/**
 * Knowledge Graph Scale Slide
 */
const kgScaleSlide: SlideConfig = {
  id: 'kg-scale-metrics',
  title: 'Knowledge Graph Scale Characteristics',
  content: {
    definition: 'Knowledge graphs vary dramatically in scale, from small domain-specific graphs to massive web-scale implementations, each with distinct characteristics and challenges.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: scaleMetricsData.headers,
    rows: scaleMetricsData.rows,
    caption: 'Knowledge graph scale metrics and characteristics',
    sortable: false
  },
  transition: 'fade',
  notes: 'Explain that scale impacts architecture choices, query performance, update strategies, and infrastructure requirements. Very large KGs typically require distributed storage and specialized optimization techniques.'
};

/**
 * Knowledge Graph Architecture Slide
 */
const kgArchitectureSlide: SlideConfig = {
  id: 'kg-architecture',
  title: 'Knowledge Graph Architecture',
  content: {
    definition: 'Knowledge graph systems typically implement a layered architecture with components for data ingestion, storage, inference, and access.',
    keyPoints: [
      'Data Ingestion: Extract, transform, and load data from diverse sources',
      'Entity Extraction: Identify entities and relationships from structured and unstructured data',
      'Graph Storage: Optimized database for storing and querying graph data',
      'Search Index: Fast retrieval of entities and attributes',
      'Inference Engine: Apply rules and derive new knowledge',
      'API Layer: Standardized access for applications',
      'User Interface: Exploration, visualization, and search capabilities'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: architectureComponentsData.nodes,
    edges: architectureComponentsData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Highlight that actual implementations may vary but most follow this general pattern. Each component may be implemented using different technologies based on requirements and constraints.'
};

/**
 * Open Source Knowledge Graphs Slide
 */
const openSourceKgSlide: SlideConfig = {
  id: 'open-source-kgs',
  title: 'Open Knowledge Graphs',
  content: {
    definition: 'Open knowledge graphs provide freely accessible structured knowledge for research, application development, and data integration.',
    keyPoints: [
      'Wikidata: Collaborative, multilingual knowledge base with 100M+ statements',
      'DBpedia: Structured data extracted from Wikipedia articles',
      'YAGO: Knowledge graph derived from Wikipedia, WordNet, and GeoNames',
      'ConceptNet: Multilingual semantic network of everyday knowledge',
      'WordNet: Lexical database grouping words into cognitive synonyms',
      'GeoNames: Geographical database covering all countries and territories'
    ],
    listItems: [
      {
        title: 'Benefits of Open Knowledge Graphs',
        items: [
          'Free access to structured knowledge for applications',
          'Community curation and continuous improvement',
          'Standardized identifiers for entity linking',
          'Foundation for bootstrapping domain-specific knowledge graphs',
          'Training data for machine learning models',
          'Academic research and benchmarking'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that open knowledge graphs play a crucial role in the ecosystem by providing common reference data, but may lack the depth or specificity of proprietary implementations for certain domains.'
};

/**
 * Examples slide group configuration
 */
export const examplesSlideGroup: SlideGroup = {
  title: 'Knowledge Graph Implementations',
  id: 'examples',
  includeSectionSlide: true,
  slides: [
    googleKgSlide,
    enterpriseKgSlide,
    domainSpecificKgsSlide,
    biomedicalKgSlide,
    mediaKgSlide,
    majorKgImplementationsSlide,
    kgScaleSlide,
    kgArchitectureSlide,
    openSourceKgSlide
  ]
};

/**
 * Examples slides module
 */
export const examplesSlides = examplesSlideGroup.slides;