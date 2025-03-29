/**
 * Construction Slides Module
 * Defines slides explaining how knowledge graphs are constructed
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Knowledge graph construction workflow
 */
const constructionWorkflowData = {
  nodes: [
    { id: 'requirements', label: 'Requirements Analysis', type: 'process' },
    { id: 'design', label: 'Ontology Design', type: 'process' },
    { id: 'sources', label: 'Data Source Selection', type: 'process' },
    { id: 'ingestion', label: 'Data Ingestion', type: 'process' },
    { id: 'extraction', label: 'Entity Extraction', type: 'process' },
    { id: 'linking', label: 'Entity Resolution & Linking', type: 'process' },
    { id: 'enrichment', label: 'Knowledge Enrichment', type: 'process' },
    { id: 'validation', label: 'Quality Validation', type: 'process' },
    { id: 'publication', label: 'Graph Publication', type: 'process' },
    { id: 'maintenance', label: 'Ongoing Maintenance', type: 'process' },
    { id: 'decision1', label: 'Schema First or\nData First?', type: 'decision' }
  ],
  edges: [
    { from: 'requirements', to: 'decision1' },
    { from: 'decision1', to: 'design', label: 'Schema First' },
    { from: 'decision1', to: 'sources', label: 'Data First' },
    { from: 'design', to: 'sources' },
    { from: 'sources', to: 'ingestion' },
    { from: 'ingestion', to: 'extraction' },
    { from: 'extraction', to: 'linking' },
    { from: 'linking', to: 'enrichment' },
    { from: 'enrichment', to: 'validation' },
    { from: 'validation', to: 'publication' },
    { from: 'validation', to: 'design', label: 'Refine' },
    { from: 'publication', to: 'maintenance' },
    { from: 'maintenance', to: 'enrichment', label: 'Update Cycle' }
  ]
};

/**
 * Entity extraction process diagram
 */
const entityExtractionData = {
  nodes: [
    { id: 'input', label: 'Input Text', type: 'io' },
    { id: 'preprocess', label: 'Text Preprocessing', type: 'process' },
    { id: 'ner', label: 'Named Entity Recognition', type: 'process' },
    { id: 'classification', label: 'Entity Classification', type: 'process' },
    { id: 'disambiguation', label: 'Entity Disambiguation', type: 'process' },
    { id: 'resolution', label: 'Entity Resolution', type: 'process' },
    { id: 'relation', label: 'Relation Extraction', type: 'process' },
    { id: 'attributes', label: 'Attribute Extraction', type: 'process' },
    { id: 'validation', label: 'Extraction Validation', type: 'process' },
    { id: 'output', label: 'Entity & Relation\nTriples', type: 'io' },
    { id: 'gazetteer', label: 'Entity Gazetteer', type: 'io' },
    { id: 'knowledgebase', label: 'External Knowledge\nBases', type: 'io' }
  ],
  edges: [
    { from: 'input', to: 'preprocess' },
    { from: 'preprocess', to: 'ner' },
    { from: 'ner', to: 'classification' },
    { from: 'classification', to: 'disambiguation' },
    { from: 'disambiguation', to: 'resolution' },
    { from: 'gazetteer', to: 'disambiguation' },
    { from: 'knowledgebase', to: 'disambiguation' },
    { from: 'knowledgebase', to: 'resolution' },
    { from: 'resolution', to: 'relation' },
    { from: 'resolution', to: 'attributes' },
    { from: 'relation', to: 'validation' },
    { from: 'attributes', to: 'validation' },
    { from: 'validation', to: 'output' },
    { from: 'validation', to: 'ner', label: 'Feedback' }
  ]
};

/**
 * Data ingestion architecture
 */
const dataIngestionData = {
  nodes: [
    { id: 'sources', label: 'Data Sources', type: 'io' },
    { id: 'connectors', label: 'Source Connectors', type: 'process' },
    { id: 'extraction', label: 'Data Extraction', type: 'process' },
    { id: 'transform', label: 'Data Transformation', type: 'process' },
    { id: 'quality', label: 'Data Quality Checks', type: 'process' },
    { id: 'mapping', label: 'Schema Mapping', type: 'process' },
    { id: 'loading', label: 'Graph Loading', type: 'process' },
    { id: 'kg', label: 'Knowledge Graph', type: 'io' },
    { id: 'monitoring', label: 'Ingestion Monitoring', type: 'process' },
    { id: 'orchestration', label: 'Workflow Orchestration', type: 'process' },
    { id: 'staging', label: 'Staging Area', type: 'io' }
  ],
  edges: [
    { from: 'sources', to: 'connectors' },
    { from: 'connectors', to: 'extraction' },
    { from: 'extraction', to: 'transform' },
    { from: 'transform', to: 'staging' },
    { from: 'staging', to: 'quality' },
    { from: 'quality', to: 'mapping' },
    { from: 'mapping', to: 'loading' },
    { from: 'loading', to: 'kg' },
    { from: 'orchestration', to: 'connectors' },
    { from: 'orchestration', to: 'extraction' },
    { from: 'orchestration', to: 'transform' },
    { from: 'orchestration', to: 'quality' },
    { from: 'orchestration', to: 'mapping' },
    { from: 'orchestration', to: 'loading' },
    { from: 'monitoring', to: 'orchestration' }
  ]
};

/**
 * Knowledge graph quality dimensions
 */
const qualityDimensionsData = {
  headers: ['Dimension', 'Description', 'Example Metrics', 'Implementation Techniques'],
  rows: [
    { 
      'Dimension': 'Accuracy', 
      'Description': 'Correctness of facts and relationships', 
      'Example Metrics': 'Error rate, precision/recall against gold standard', 
      'Implementation Techniques': 'Human validation, trusted source selection, automated fact checking' 
    },
    { 
      'Dimension': 'Completeness', 
      'Description': 'Coverage of relevant entities and relationships', 
      'Example Metrics': 'Entity coverage ratio, relationship density', 
      'Implementation Techniques': 'Gap analysis, automated discovery, regular audits' 
    },
    { 
      'Dimension': 'Consistency', 
      'Description': 'Absence of contradictions in the graph', 
      'Example Metrics': 'Constraint violation count, logical contradiction frequency', 
      'Implementation Techniques': 'SHACL/ShEx validation, logical reasoners, constraint checking' 
    },
    { 
      'Dimension': 'Timeliness', 
      'Description': 'Currency and freshness of information', 
      'Example Metrics': 'Average age of facts, update frequency', 
      'Implementation Techniques': 'Change detection, versioning, temporal modeling' 
    },
    { 
      'Dimension': 'Accessibility', 
      'Description': 'Ease of access and query performance', 
      'Example Metrics': 'Query response time, API availability', 
      'Implementation Techniques': 'Indexing, caching, load balancing, query optimization' 
    },
    { 
      'Dimension': 'Relevance', 
      'Description': 'Alignment with user needs and use cases', 
      'Example Metrics': 'User satisfaction, query success rate', 
      'Implementation Techniques': 'Requirements analysis, user testing, usage analytics' 
    },
    { 
      'Dimension': 'Provenance', 
      'Description': 'Tracking the origin and lineage of facts', 
      'Example Metrics': 'Source coverage percentage, confidence scores', 
      'Implementation Techniques': 'Source attribution, confidence modeling, evidence tracking' 
    }
  ]
};

/**
 * Entity resolution techniques comparison
 */
const entityResolutionData = {
  headers: ['Technique', 'Approach', 'Strengths', 'Limitations', 'Best For'],
  rows: [
    { 
      'Technique': 'String Similarity', 
      'Approach': 'Compare entity names using Levenshtein, Jaccard, etc.', 
      'Strengths': 'Simple, fast, no training data needed', 
      'Limitations': 'Sensitive to misspellings, cannot handle synonyms', 
      'Best For': 'Clean, structured data with minor variations' 
    },
    { 
      'Technique': 'Rule-based Matching', 
      'Approach': 'Apply domain-specific matching rules', 
      'Strengths': 'Interpretable, domain knowledge incorporation', 
      'Limitations': 'Labor-intensive to create, hard to maintain', 
      'Best For': 'Domains with clear matching patterns and rules' 
    },
    { 
      'Technique': 'Embeddings', 
      'Approach': 'Match entities based on vector similarity', 
      'Strengths': 'Handles semantic similarity, language-agnostic', 
      'Limitations': 'Requires training data, black-box behavior', 
      'Best For': 'Textual entities with semantic variations' 
    },
    { 
      'Technique': 'Graph-based Resolution', 
      'Approach': 'Use graph structure and relationships to resolve', 
      'Strengths': 'Leverages context and connections', 
      'Limitations': 'Depends on graph connectivity', 
      'Best For': 'Well-connected entities in existing graphs' 
    },
    { 
      'Technique': 'Probabilistic Matching', 
      'Approach': 'Estimate match probability using statistical models', 
      'Strengths': 'Robust to noise, provides confidence scores', 
      'Limitations': 'Complexity, parameter tuning', 
      'Best For': 'Large-scale matching with uncertain data' 
    },
    { 
      'Technique': 'Collective Entity Resolution', 
      'Approach': 'Resolve entities together using interdependencies', 
      'Strengths': 'Handles complex relationships, improves accuracy', 
      'Limitations': 'Computationally expensive, complex implementation', 
      'Best For': 'Interconnected entity sets with relationship context' 
    },
    { 
      'Technique': 'Hybrid Approaches', 
      'Approach': 'Combine multiple techniques, often with ML orchestration', 
      'Strengths': 'High accuracy, adaptability to different entity types', 
      'Limitations': 'Implementation complexity, potential overfitting', 
      'Best For': 'Production systems requiring high accuracy' 
    }
  ]
};

/**
 * Construction Methodologies Slide
 */
const constructionMethodologiesSlide: SlideConfig = {
  id: 'construction-methodologies',
  title: 'Knowledge Graph Construction Methodologies',
  content: {
    definition: 'Knowledge graph construction follows systematic methodologies that incorporate both top-down ontology design and bottom-up data-driven approaches.',
    keyPoints: [
      'Schema-first: Start with ontology design, then populate with data',
      'Data-first: Extract entities from data, derive schema iteratively',
      'Hybrid approaches: Combine predefined schemas with data-driven discovery',
      'Construction is typically iterative, refining the graph over multiple cycles',
      'Quality validation is essential at each stage of construction',
      'Shift towards automation in entity extraction and relation discovery'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: constructionWorkflowData.nodes,
    edges: constructionWorkflowData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Emphasize that construction approach depends on availability of domain experts, quality of source data, and specific use cases. Schema-first works well for formal domains with existing standards, while data-first is better for exploratory projects or when working with unstructured data.'
};

/**
 * Data Ingestion Pipeline Slide
 */
const dataIngestionSlide: SlideConfig = {
  id: 'data-ingestion',
  title: 'Data Ingestion Pipeline',
  content: {
    definition: 'Knowledge graph construction requires robust data ingestion pipelines to extract, transform, and load data from diverse sources while maintaining quality and provenance.',
    keyPoints: [
      'Connectors for multiple data sources (databases, APIs, documents, etc.)',
      'Transformation processes to normalize and standardize data',
      'Schema mapping to align source data with knowledge graph ontology',
      'Quality checks to ensure data meets accuracy and completeness standards',
      'Lineage tracking to maintain provenance information',
      'Orchestration to manage complex ingestion workflows',
      'Incremental updates to maintain graph currency'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: dataIngestionData.nodes,
    edges: dataIngestionData.edges,
    direction: 'LR',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Highlight that ingestion pipelines must be both robust and flexible, handling both bulk initial loads and incremental updates. Emphasize the importance of monitoring and orchestration for production environments.'
};

/**
 * Data Source Types Slide
 */
const dataSourcesSlide: SlideConfig = {
  id: 'data-source-types',
  title: 'Knowledge Graph Data Sources',
  content: {
    definition: 'Knowledge graphs integrate information from diverse data sources, each requiring specific extraction and transformation techniques.',
    listItems: [
      {
        title: 'Structured Data Sources',
        items: [
          'Relational Databases: Direct mapping of entities and relationships',
          'XML/JSON APIs: Structured data with defined schemas',
          'CSV/Excel Files: Tabular data requiring interpretation',
          'Existing Graphs: Direct import with schema alignment'
        ],
        type: 'bullet'
      },
      {
        title: 'Semi-structured Data Sources',
        items: [
          'HTML/Web Content: Information extraction from structured websites',
          'JSON-LD/Microdata: Embedded structured data in web pages',
          'Email/Messages: Template-based information extraction',
          'Log Files: Pattern-based entity and event extraction'
        ],
        type: 'bullet'
      },
      {
        title: 'Unstructured Data Sources',
        items: [
          'Text Documents: NLP-based entity and relation extraction',
          'Scientific Literature: Domain-specific information extraction',
          'News Articles: Event and entity extraction',
          'Social Media: Entity, relation, and sentiment extraction'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Explain that source selection should balance availability, quality, and extraction difficulty. Structured sources provide easier extraction but might miss important information found in unstructured content.'
};

/**
 * Entity Extraction Techniques Slide
 */
const entityExtractionSlide: SlideConfig = {
  id: 'entity-extraction',
  title: 'Entity Extraction Techniques',
  content: {
    definition: 'Entity extraction identifies and classifies real-world objects from source data, forming the nodes of the knowledge graph.',
    keyPoints: [
      'Named Entity Recognition (NER): Identify entity mentions in text',
      'Entity Classification: Categorize entities into types (Person, Organization, etc.)',
      'Entity Disambiguation: Resolve entities to canonical representations',
      'Entity Resolution: Identify and merge duplicate entities',
      'Attribute Extraction: Identify properties and values for entities',
      'Modern approaches use deep learning models like BERT, RoBERTa, etc.',
      'Domain-specific extraction may require specialized models or rules'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: entityExtractionData.nodes,
    edges: entityExtractionData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Emphasize the pipeline nature of extraction - each step builds on previous steps, and errors propagate. Modern systems often integrate machine learning with rule-based approaches for optimal results.'
};

/**
 * Entity Resolution Approaches Slide
 */
const entityResolutionSlide: SlideConfig = {
  id: 'entity-resolution',
  title: 'Entity Resolution Approaches',
  content: {
    definition: 'Entity resolution (also called entity matching, record linkage, or deduplication) identifies and merges references to the same real-world entity across different sources.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: entityResolutionData.headers,
    rows: entityResolutionData.rows,
    caption: 'Comparison of entity resolution techniques',
    sortable: true
  },
  transition: 'slide',
  notes: 'Emphasize that entity resolution is critical for knowledge graph quality - missed matches create disconnected subgraphs, while false matches introduce errors. Production systems typically use multiple techniques in combination.'
};

/**
 * Relation Extraction Slide
 */
const relationExtractionSlide: SlideConfig = {
  id: 'relation-extraction',
  title: 'Relation Extraction Techniques',
  content: {
    definition: 'Relation extraction identifies semantic relationships between entities, forming the edges of the knowledge graph.',
    keyPoints: [
      'Rule-based approaches: Pattern matching using lexical and syntactic rules',
      'Supervised learning: Classification based on labeled examples',
      'Distant supervision: Using existing knowledge bases to automatically label training data',
      'Open information extraction: Identifying relation phrases without predefined schema',
      'Deep learning approaches: BERT, graph neural networks for context-aware extraction',
      'Joint entity and relation extraction: Simultaneously identify entities and relationships'
    ],
    codeSnippets: [
      {
        language: 'python',
        caption: 'Example of relation extraction with spaCy and rule-based patterns',
        code: `import spacy
from spacy.matcher import DependencyMatcher

# Load spaCy model
nlp = spacy.load("en_core_web_lg")

# Define pattern for "company acquires company" relation
pattern = [
    {
        "RIGHT_ID": "acquirer",
        "RIGHT_ATTRS": {"POS": "PROPN"}
    },
    {
        "LEFT_ID": "acquirer",
        "REL_OP": ">",
        "RIGHT_ID": "acquire_verb",
        "RIGHT_ATTRS": {"LEMMA": "acquire"}
    },
    {
        "LEFT_ID": "acquire_verb",
        "REL_OP": ">",
        "RIGHT_ID": "target",
        "RIGHT_ATTRS": {"POS": "PROPN"}
    }
]

# Create matcher and add pattern
matcher = DependencyMatcher(nlp.vocab)
matcher.add("ACQUISITION", [pattern])

# Process text and extract relations
doc = nlp("Microsoft acquired GitHub in 2018 for $7.5 billion.")
matches = matcher(doc)

for match_id, token_ids in matches:
    acquirer = doc[token_ids[0]]
    target = doc[token_ids[2]]
    print(f"Relation: {acquirer.text} ACQUIRED {target.text}")`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Explain that relation extraction is generally more complex than entity extraction due to the need to identify both the relationship type and the correct entity pairs. Context is crucial, especially for disambiguating relationship types.'
};

/**
 * Knowledge Enrichment Slide
 */
const knowledgeEnrichmentSlide: SlideConfig = {
  id: 'knowledge-enrichment',
  title: 'Knowledge Graph Enrichment',
  content: {
    definition: 'Knowledge enrichment extends graph content through inference, external linking, and automated discovery techniques.',
    keyPoints: [
      'Schema-based inference: Derive new facts using ontology rules (RDFS, OWL)',
      'Statistical inference: Predict missing relationships using graph patterns',
      'External linking: Connect entities to established knowledge bases',
      'Knowledge base completion: Fill gaps in the graph automatically',
      'Context enrichment: Add temporal, spatial, and provenance context',
      'Confidence scoring: Attach certainty metrics to derived facts',
      'Human-in-the-loop validation: Expert review of enriched knowledge'
    ],
    listItems: [
      {
        title: 'Enrichment Techniques',
        items: [
          'Logical reasoning: Apply formal inference rules to derive new facts',
          'Embedding-based prediction: Use graph embeddings to identify likely missing edges',
          'Analogical reasoning: Apply patterns from similar entity groups',
          'Rule mining: Discover frequent patterns as candidate rules',
          'Path ranking: Evaluate connection paths to score relationship likelihood'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that enrichment adds tremendous value but requires careful validation. Distinguish between facts directly extracted from sources and those derived through inference, ideally tracking provenance for both.'
};

/**
 * Quality Evaluation Slide
 */
const qualityEvaluationSlide: SlideConfig = {
  id: 'quality-evaluation',
  title: 'Knowledge Graph Quality Evaluation',
  content: {
    definition: 'Quality evaluation assesses knowledge graph validity, consistency, and utility across multiple dimensions.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: qualityDimensionsData.headers,
    rows: qualityDimensionsData.rows,
    caption: 'Knowledge graph quality dimensions',
    sortable: true
  },
  transition: 'fade',
  notes: 'Highlight that quality needs to be assessed relative to intended use cases. A graph that scores well for one application may be inadequate for another with different quality requirements.'
};

/**
 * Ontology Evolution Slide
 */
const ontologyEvolutionSlide: SlideConfig = {
  id: 'ontology-evolution',
  title: 'Ontology Evolution and Maintenance',
  content: {
    definition: 'Knowledge graph schemas evolve over time to accommodate new data sources, use cases, and domain understanding, requiring systematic change management.',
    keyPoints: [
      'Versioning: Track schema changes with semantic versioning',
      'Impact analysis: Evaluate effect of changes on existing data and applications',
      'Forward compatibility: Ensure new clients can work with old data',
      'Backward compatibility: Ensure old clients can work with new data',
      'Migration scripts: Transform data to conform to schema changes',
      'Deprecation process: Phase out obsolete schema elements',
      'Documentation: Maintain clear documentation of schema evolution'
    ],
    listItems: [
      {
        title: 'Common Evolution Patterns',
        items: [
          'Schema extension: Add new entity types, relationships, and attributes',
          'Refinement: Split coarse entity types into more specific subtypes',
          'Consolidation: Merge redundant or overlapping concepts',
          'Alignment: Harmonize schema with external standards or ontologies',
          'Constraint tightening/relaxation: Modify validation rules based on data realities'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that unlike traditional databases, knowledge graphs need to embrace evolution as a continuous process, not an exceptional event. Well-designed graphs accommodate growth without full rebuilds.'
};

/**
 * Construction Tools Slide
 */
const constructionToolsSlide: SlideConfig = {
  id: 'construction-tools',
  title: 'Knowledge Graph Construction Tools',
  content: {
    definition: 'Various tools and frameworks support different aspects of knowledge graph construction, from ontology design to data integration and quality assessment.',
    listItems: [
      {
        title: 'Ontology Development Tools',
        items: [
          'Protégé: Desktop application for ontology editing and visualization',
          'TopBraid Composer: Commercial ontology modeling environment',
          'WebVOWL: Web-based visualization of ontologies',
          'OWLGrEd: Graphical editor for OWL ontologies'
        ],
        type: 'bullet'
      },
      {
        title: 'Entity Extraction and NLP',
        items: [
          'spaCy: Python library for advanced NLP',
          'Stanford CoreNLP: Java-based natural language analysis tools',
          'GATE: General Architecture for Text Engineering',
          'IBM Watson Natural Language Understanding: Commercial API for entity and relation extraction'
        ],
        type: 'bullet'
      },
      {
        title: 'Data Integration Frameworks',
        items: [
          'Apache Beam: Unified model for batch and streaming data processing',
          'KNIME: Graphical ETL and data science platform',
          'Karma: Data integration tool for structured sources',
          'RML: RDF Mapping Language for defining mappings from heterogeneous data'
        ],
        type: 'bullet'
      },
      {
        title: 'Graph Construction Platforms',
        items: [
          'Metaphactory: Enterprise platform for knowledge graph management',
          'GraphDB: RDF database with comprehensive tooling',
          'Stardog: Knowledge graph platform with data virtualization',
          'Amazon Neptune: Managed graph database service with import tools'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Emphasize that tool selection should be based on specific project requirements, team expertise, and scalability needs. Many projects combine multiple tools for different aspects of graph construction.'
};

/**
 * Construction slide group configuration
 */
export const constructionSlideGroup: SlideGroup = {
  title: 'Knowledge Graph Construction',
  id: 'construction',
  includeSectionSlide: true,
  slides: [
    constructionMethodologiesSlide,
    dataIngestionSlide,
    dataSourcesSlide,
    entityExtractionSlide,
    entityResolutionSlide,
    relationExtractionSlide,
    knowledgeEnrichmentSlide,
    qualityEvaluationSlide,
    ontologyEvolutionSlide,
    constructionToolsSlide
  ]
};

/**
 * Construction slides module
 */
export const constructionSlides = constructionSlideGroup.slides;