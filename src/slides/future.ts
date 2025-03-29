/**
 * Future Directions Slides Module
 * Defines slides covering emerging trends and future directions in knowledge graph technology
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Research frontiers timeline
 */
const researchTimelineData = [
  { 
    period: '2023-2024', 
    label: 'Current Focus', 
    items: ['LLM+KG Integration', 'Neural-Symbolic Methods', 'Graph Neural Networks'] 
  },
  { 
    period: '2024-2026', 
    label: 'Near Term', 
    items: ['Multimodal Knowledge Graphs', 'Decentralized KGs', 'Automated Knowledge Engineering'] 
  },
  { 
    period: '2026-2028', 
    label: 'Medium Term', 
    items: ['Dynamic Probabilistic KGs', 'Quantum KG Algorithms', 'KG-Based Autonomous Agents'] 
  },
  { 
    period: '2028-2030', 
    label: 'Long Term', 
    items: ['Emergent Knowledge Properties', 'General Knowledge Reasoning', 'Cognitive Knowledge Systems'] 
  }
];

/**
 * Knowledge graph and LLM integration
 */
const llmIntegrationData: GraphData = {
  nodes: [
    { id: 'kg', label: 'Knowledge Graph', type: 'System' },
    { id: 'llm', label: 'Large Language Model', type: 'System' },
    { id: 'qa', label: 'Question Answering', type: 'Capability' },
    { id: 'grounding', label: 'Factual Grounding', type: 'Capability' },
    { id: 'reasoning', label: 'Reasoning Engine', type: 'Capability' },
    { id: 'retrieval', label: 'Retrieval System', type: 'Capability' },
    { id: 'embedding', label: 'Embedding Space', type: 'Capability' },
    { id: 'text', label: 'Text Generation', type: 'Capability' },
    { id: 'user', label: 'User', type: 'Actor' },
    { id: 'structure', label: 'Structured Knowledge', type: 'Data' },
    { id: 'unstructured', label: 'Unstructured Content', type: 'Data' }
  ],
  edges: [
    { source: 'user', target: 'qa', label: 'INTERACTS_WITH' },
    { source: 'qa', target: 'kg', label: 'QUERIES' },
    { source: 'qa', target: 'llm', label: 'LEVERAGES' },
    { source: 'kg', target: 'structure', label: 'CONTAINS' },
    { source: 'kg', target: 'reasoning', label: 'ENABLES' },
    { source: 'llm', target: 'text', label: 'GENERATES' },
    { source: 'llm', target: 'embedding', label: 'CREATES' },
    { source: 'llm', target: 'unstructured', label: 'PROCESSES' },
    { source: 'kg', target: 'grounding', label: 'PROVIDES' },
    { source: 'grounding', target: 'llm', label: 'CONSTRAINS' },
    { source: 'embedding', target: 'kg', label: 'ENHANCES' },
    { source: 'reasoning', target: 'qa', label: 'IMPROVES' },
    { source: 'kg', target: 'retrieval', label: 'GUIDES' },
    { source: 'retrieval', target: 'llm', label: 'FEEDS' },
    { source: 'llm', target: 'kg', label: 'POPULATES' }
  ]
};

/**
 * Multimodal knowledge graph integration
 */
const multimodalKgData: GraphData = {
  nodes: [
    { id: 'entity1', label: 'Eiffel Tower', type: 'Entity' },
    { id: 'concept1', label: 'Cultural Landmark', type: 'Concept' },
    { id: 'location1', label: 'Paris, France', type: 'Location' },
    { id: 'image1', label: 'Image Embedding', type: 'ImageData' },
    { id: 'image2', label: 'Visual Attributes', type: 'ImageData' },
    { id: 'text1', label: 'Text Description', type: 'TextData' },
    { id: 'text2', label: 'Historical Context', type: 'TextData' },
    { id: 'audio1', label: 'Ambient Sounds', type: 'AudioData' },
    { id: 'spatial1', label: 'Geospatial Data', type: 'SpatialData' },
    { id: 'temporal1', label: 'Construction Timeline', type: 'TemporalData' },
    { id: 'query1', label: 'Multimodal Query', type: 'Query' }
  ],
  edges: [
    { source: 'entity1', target: 'concept1', label: 'IS_A' },
    { source: 'entity1', target: 'location1', label: 'LOCATED_IN' },
    { source: 'entity1', target: 'image1', label: 'HAS_VISUAL' },
    { source: 'image1', target: 'image2', label: 'CONTAINS' },
    { source: 'entity1', target: 'text1', label: 'HAS_DESCRIPTION' },
    { source: 'entity1', target: 'text2', label: 'HAS_CONTEXT' },
    { source: 'entity1', target: 'audio1', label: 'HAS_AUDIO' },
    { source: 'entity1', target: 'spatial1', label: 'HAS_GEOMETRY' },
    { source: 'entity1', target: 'temporal1', label: 'HAS_TIMELINE' },
    { source: 'query1', target: 'image1', label: 'MATCHES' },
    { source: 'query1', target: 'text1', label: 'RELATES_TO' }
  ]
};

/**
 * Emerging standards and specifications
 */
const emergingStandardsData = {
  headers: ['Standard/Specification', 'Focus Area', 'Status', 'Key Features', 'Potential Impact'],
  rows: [
    { 
      'Standard/Specification': 'ISO/IEC 39075 GQL', 
      'Focus Area': 'Property Graph Query Language', 
      'Status': 'Draft (Expected 2024-2025)', 
      'Key Features': 'SQL-inspired syntax, property graph patterns, path expressions, integration with SQL', 
      'Potential Impact': 'Unified standard enabling cross-database compatibility, increased enterprise adoption' 
    },
    { 
      'Standard/Specification': 'W3C RDF-star / SPARQL-star', 
      'Focus Area': 'RDF Statement Metadata', 
      'Status': 'Working draft', 
      'Key Features': 'Statement-level metadata, simplified reification, compatibility with existing RDF', 
      'Potential Impact': 'Simplified provenance tracking, improved statement annotation, better alignment with property graphs' 
    },
    { 
      'Standard/Specification': 'Knowledge Graph Exchange (KGE)', 
      'Focus Area': 'Cross-platform Knowledge Exchange', 
      'Status': 'Community initiative', 
      'Key Features': 'Common exchange format, cross-platform integration, schema mapping', 
      'Potential Impact': 'Improved interoperability between KG platforms, simplified migration, vendor flexibility' 
    },
    { 
      'Standard/Specification': 'SKOS XL (Extended Labels)', 
      'Focus Area': 'Enhanced Concept Labeling', 
      'Status': 'W3C Recommendation (Evolving)', 
      'Key Features': 'Rich label relationships, label metadata, multi-language support', 
      'Potential Impact': 'Better multilingual KGs, enhanced terminology management, improved search' 
    },
    { 
      'Standard/Specification': 'GraphQL Federation', 
      'Focus Area': 'Distributed Graph API', 
      'Status': 'Evolving specification', 
      'Key Features': 'Distributed schema composition, cross-service queries, unified API', 
      'Potential Impact': 'Decentralized knowledge management, domain-specific KGs with unified access' 
    },
    { 
      'Standard/Specification': 'OWL 3', 
      'Focus Area': 'Ontology Language', 
      'Status': 'Early discussion', 
      'Key Features': 'Probabilistic extensions, rule integration, scalability improvements', 
      'Potential Impact': 'Support for uncertain knowledge, better scalability for large ontologies' 
    },
    { 
      'Standard/Specification': 'RDF 1.2', 
      'Focus Area': 'RDF Core Model', 
      'Status': 'Early planning', 
      'Key Features': 'Dataset definitions, graph literals, syntactic enhancements', 
      'Potential Impact': 'Improved RDF expressivity, better property graph alignment' 
    },
    { 
      'Standard/Specification': 'LPG Schema Language', 
      'Focus Area': 'Labeled Property Graph Schema', 
      'Status': 'Vendor explorations', 
      'Key Features': 'Typed constraints, relationship cardinality, property validation', 
      'Potential Impact': 'Improved data quality, consistent property graph modeling' 
    }
  ]
};

/**
 * Knowledge graph applications horizon
 */
const applicationHorizonData = {
  headers: ['Application Area', 'Current State', 'Emerging Capabilities', 'Future Potential (3-5 years)'],
  rows: [
    { 
      'Application Area': 'Semantic Search', 
      'Current State': 'Entity-aware search, basic question answering', 
      'Emerging Capabilities': 'Multi-hop reasoning, contextual personalization', 
      'Future Potential (3-5 years)': 'Conversational exploration, implicit intent understanding, predictive information delivery' 
    },
    { 
      'Application Area': 'Recommendation Systems', 
      'Current State': 'Graph-enhanced collaborative filtering, content-based recommendations', 
      'Emerging Capabilities': 'Knowledge-aware diversity, explainable recommendations', 
      'Future Potential (3-5 years)': 'Cognitive recommendations, interest prediction, context-specific suggestion systems' 
    },
    { 
      'Application Area': 'Intelligent Assistants', 
      'Current State': 'Knowledge lookups, structured task completion', 
      'Emerging Capabilities': 'Multi-turn reasoning, proactive suggestions', 
      'Future Potential (3-5 years)': 'Autonomous task assistants, continuous learning, personalized mental models' 
    },
    { 
      'Application Area': 'Drug Discovery', 
      'Current State': 'Biomedical relationship mining, repurposing candidates', 
      'Emerging Capabilities': 'Mechanism prediction, multi-modal biomedical KGs', 
      'Future Potential (3-5 years)': 'Autonomous hypothesis generation, clinical trial optimization, personalized medicine' 
    },
    { 
      'Application Area': 'Financial Analysis', 
      'Current State': 'Entity relationship detection, risk network analysis', 
      'Emerging Capabilities': 'Causal inference, temporal pattern detection', 
      'Future Potential (3-5 years)': 'Market behavior prediction, autonomous trading strategies, system risk modeling' 
    },
    { 
      'Application Area': 'Industrial Operations', 
      'Current State': 'Asset knowledge management, maintenance optimization', 
      'Emerging Capabilities': 'Digital twins, simulation-enhanced KGs', 
      'Future Potential (3-5 years)': 'Self-optimizing systems, autonomous industrial operations, predictive engineering' 
    },
    { 
      'Application Area': 'Scientific Research', 
      'Current State': 'Literature mining, hypothesis support', 
      'Emerging Capabilities': 'Cross-domain discovery, experimental design', 
      'Future Potential (3-5 years)': 'Automated scientific discovery, simulation-integrated knowledge, theory formation' 
    }
  ]
};

/**
 * Technical challenges on the horizon
 */
const technicalChallengesData = {
  headers: ['Challenge Area', 'Description', 'Current Approaches', 'Research Directions'],
  rows: [
    { 
      'Challenge Area': 'Scalability', 
      'Description': 'Supporting trillion-edge graphs with complex queries', 
      'Current Approaches': 'Distributed processing, specialized indices, query optimization', 
      'Research Directions': 'Quantum algorithms, neuromorphic computing, hypergraph partitioning, adaptive indexing' 
    },
    { 
      'Challenge Area': 'Knowledge Fusion', 
      'Description': 'Integrating knowledge from heterogeneous, conflicting sources', 
      'Current Approaches': 'Entity resolution, truth discovery, provenance tracking', 
      'Research Directions': 'Bayesian knowledge fusion, multi-view learning, active knowledge reconciliation' 
    },
    { 
      'Challenge Area': 'Temporal Reasoning', 
      'Description': 'Modeling and reasoning over time-dependent knowledge', 
      'Current Approaches': 'Temporal properties, validity periods, event modeling', 
      'Research Directions': 'Continuous-time dynamic graphs, temporal logic inference, predictive temporal models' 
    },
    { 
      'Challenge Area': 'Knowledge Acquisition', 
      'Description': 'Automated extraction and validation of knowledge', 
      'Current Approaches': 'NLP-based extraction, distant supervision, human-in-the-loop', 
      'Research Directions': 'Self-supervised knowledge extraction, multi-modal knowledge acquisition, autonomous knowledge curation' 
    },
    { 
      'Challenge Area': 'Reasoning Under Uncertainty', 
      'Description': 'Managing incomplete, probabilistic knowledge', 
      'Current Approaches': 'Probabilistic graphs, fuzzy logic, belief propagation', 
      'Research Directions': 'Neural-symbolic reasoning, quantum probabilistic logic, continuous knowledge representation' 
    },
    { 
      'Challenge Area': 'Explainability', 
      'Description': 'Providing transparent explanations for graph-based inferences', 
      'Current Approaches': 'Path tracing, rule extraction, confidence scoring', 
      'Research Directions': 'Cognitive explanation models, personalized explanations, counterfactual reasoning' 
    },
    { 
      'Challenge Area': 'Privacy & Security', 
      'Description': 'Protecting sensitive knowledge while enabling collaboration', 
      'Current Approaches': 'Access control, anonymization, federated queries', 
      'Research Directions': 'Homomorphic encryption, differential privacy for graphs, secure multi-party computation' 
    },
    { 
      'Challenge Area': 'Knowledge Evolution', 
      'Description': 'Managing dynamic, evolving knowledge over time', 
      'Current Approaches': 'Versioning, change tracking, temporal validity', 
      'Research Directions': 'Self-healing knowledge, automatic obsolescence detection, evolutionary knowledge models' 
    }
  ]
};

/**
 * Decentralized knowledge graphs architecture
 */
const decentralizedKgData = {
  nodes: [
    { id: 'org1', label: 'Organization A KG', type: 'KnowledgeGraph' },
    { id: 'org2', label: 'Organization B KG', type: 'KnowledgeGraph' },
    { id: 'org3', label: 'Organization C KG', type: 'KnowledgeGraph' },
    { id: 'user1', label: 'User with Access Rights', type: 'User' },
    { id: 'ledger', label: 'Distributed Ledger', type: 'Infrastructure' },
    { id: 'registry', label: 'Schema Registry', type: 'Infrastructure' },
    { id: 'resolver', label: 'Identity Resolver', type: 'Infrastructure' },
    { id: 'protocol', label: 'Exchange Protocol', type: 'Infrastructure' },
    { id: 'query', label: 'Federated Query Engine', type: 'Service' },
    { id: 'discovery', label: 'Discovery Service', type: 'Service' },
    { id: 'consent', label: 'Consent Manager', type: 'Service' }
  ],
  edges: [
    { source: 'org1', target: 'registry', label: 'REGISTERS_SCHEMA' },
    { source: 'org2', target: 'registry', label: 'REGISTERS_SCHEMA' },
    { source: 'org3', target: 'registry', label: 'REGISTERS_SCHEMA' },
    { source: 'org1', target: 'ledger', label: 'PUBLISHES_PROOFS' },
    { source: 'org2', target: 'ledger', label: 'PUBLISHES_PROOFS' },
    { source: 'org3', target: 'ledger', label: 'PUBLISHES_PROOFS' },
    { source: 'org1', target: 'protocol', label: 'IMPLEMENTS' },
    { source: 'org2', target: 'protocol', label: 'IMPLEMENTS' },
    { source: 'org3', target: 'protocol', label: 'IMPLEMENTS' },
    { source: 'user1', target: 'resolver', label: 'RESOLVES_IDENTITY' },
    { source: 'user1', target: 'query', label: 'SUBMITS_QUERY' },
    { source: 'query', target: 'org1', label: 'QUERIES' },
    { source: 'query', target: 'org2', label: 'QUERIES' },
    { source: 'query', target: 'org3', label: 'QUERIES' },
    { source: 'query', target: 'registry', label: 'USES' },
    { source: 'user1', target: 'discovery', label: 'DISCOVERS_SOURCES' },
    { source: 'discovery', target: 'registry', label: 'READS' },
    { source: 'user1', target: 'consent', label: 'MANAGES_PERMISSIONS' },
    { source: 'consent', target: 'org1', label: 'AUTHORIZES' },
    { source: 'consent', target: 'org2', label: 'AUTHORIZES' }
  ]
};

/**
 * AI and knowledge graphs integration trends
 */
const aiIntegrationTrendsData = {
  headers: ['Integration Area', 'Current State', 'Emerging Trends', 'Long-term Vision'],
  rows: [
    { 
      'Integration Area': 'LLMs & Knowledge Graphs', 
      'Current State': 'Retrieval-augmented generation, basic fact-checking', 
      'Emerging Trends': 'KG-guided reasoning, semantic parsing for KG updates', 
      'Long-term Vision': 'LLM-KG symbiosis, continuous knowledge transfer, self-updating knowledge systems' 
    },
    { 
      'Integration Area': 'Graph Neural Networks', 
      'Current State': 'Node/edge embedding, link prediction, node classification', 
      'Emerging Trends': 'Heterogeneous GNNs, temporal GNNs, knowledge-enhanced GNN architectures', 
      'Long-term Vision': 'Neuromorphic knowledge processing, emergent reasoning capabilities, adaptive neural-symbolic systems' 
    },
    { 
      'Integration Area': 'Knowledge Extraction', 
      'Current State': 'Pattern-based extraction, supervised NER/RE models', 
      'Emerging Trends': 'Zero-shot extraction, multimodal extraction, self-supervised approaches', 
      'Long-term Vision': 'Fully autonomous knowledge acquisition, continual knowledge harvesting' 
    },
    { 
      'Integration Area': 'Reasoning Systems', 
      'Current State': 'Rule-based inference, basic statistical reasoning', 
      'Emerging Trends': 'Neural-symbolic reasoning, reinforcement learning for path finding', 
      'Long-term Vision': 'General knowledge reasoning systems, cognitive reasoning models, emergent inference' 
    },
    { 
      'Integration Area': 'Explainable AI', 
      'Current State': 'Path-based explanations, confidence scores', 
      'Emerging Trends': 'Knowledge-grounded explanations, contrastive explanations', 
      'Long-term Vision': 'Human-like explanatory models, personalized explanation generation, causal explanations' 
    },
    { 
      'Integration Area': 'Multimodal Knowledge', 
      'Current State': 'Text-centric KGs with image/audio metadata', 
      'Emerging Trends': 'Vision-language-knowledge alignment, cross-modal entity grounding', 
      'Long-term Vision': 'Universal knowledge representation across modalities, seamless multimodal reasoning' 
    },
    { 
      'Integration Area': 'Autonomous Agents', 
      'Current State': 'Knowledge-based task automation, planning with KGs', 
      'Emerging Trends': 'Knowledge-grounded agent policies, KG exploration strategies', 
      'Long-term Vision': 'Knowledge-driven autonomous systems, self-improving knowledge agents' 
    }
  ]
};

/**
 * Neural-Symbolic Integration Slide
 */
const neuralSymbolicSlide: SlideConfig = {
  id: 'neural-symbolic-integration',
  title: 'Neural-Symbolic Integration',
  content: {
    definition: 'Neural-symbolic integration combines connectionist AI approaches (neural networks) with symbolic knowledge representation to leverage the strengths of both paradigms.',
    keyPoints: [
      'Combines the learning capabilities of neural networks with the reasoning power of symbolic systems',
      'Neural components handle pattern recognition, uncertainty, and generalization',
      'Symbolic components provide interpretability, logical reasoning, and domain knowledge',
      'Bridges the gap between statistical AI and knowledge representation',
      'Enables knowledge-guided learning and learning-enhanced knowledge',
      'Addresses limitations of pure neural or pure symbolic approaches',
      'Critical for next-generation AI systems requiring both learning and reasoning'
    ],
    listItems: [
      {
        title: 'Key Research Directions',
        items: [
          'Neural theorem provers: Using neural networks to guide symbolic reasoning',
          'Knowledge-infused learning: Incorporating symbolic knowledge into deep learning',
          'Logic as regularization: Using logical rules to constrain neural learning',
          'Neuro-symbolic concept learners: Learning symbolic concepts from sensory data',
          'Differentiable reasoning: Making symbolic operations differentiable for end-to-end learning',
          'Hybrid architectures: System designs that combine neural and symbolic components'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that neural-symbolic integration represents one of the most promising research directions for overcoming current AI limitations and moving toward more robust, trustworthy, and general artificial intelligence systems. Knowledge graphs serve as an ideal symbolic backbone for these hybrid systems.'
};

/**
 * LLM and Knowledge Graph Integration Slide
 */
const llmIntegrationSlide: SlideConfig = {
  id: 'llm-kg-integration',
  title: 'LLM and Knowledge Graph Integration',
  content: {
    definition: 'The integration of large language models with knowledge graphs combines the flexible reasoning and natural language capabilities of LLMs with the structured, verifiable knowledge of graphs.',
    keyPoints: [
      'LLMs provide natural language understanding, generation, and implicit reasoning',
      'Knowledge graphs provide factual grounding, explicit reasoning, and structured information',
      'Integration enhances both technologies through complementary strengths',
      'Reduces hallucination through knowledge graph verification',
      'Enables complex reasoning with factual verification steps',
      'Supports knowledge extraction and graph maintenance through LLMs',
      'Creates more transparent AI systems with explainable components'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: llmIntegrationData,
    layout: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      padding: 30
    },
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Highlight that this integration represents one of the most active and promising research areas, as it addresses fundamental limitations of both technologies. LLMs lack reliable factuality and structured reasoning, while knowledge graphs lack linguistic flexibility and inference capabilities. Together, they create more powerful and reliable systems.'
};

/**
 * AI Integration Trends Slide
 */
const aiIntegrationTrendsSlide: SlideConfig = {
  id: 'ai-integration-trends',
  title: 'AI and Knowledge Graphs: Integration Trends',
  content: {
    definition: 'The convergence of AI and knowledge graph technologies is creating new capabilities and applications that leverage the strengths of both approaches.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: aiIntegrationTrendsData.headers,
    rows: aiIntegrationTrendsData.rows,
    caption: 'AI and knowledge graph integration trends',
    sortable: true
  },
  transition: 'fade',
  notes: 'Emphasize that these integration trends show a clear evolution from using AI to enhance knowledge graphs and vice versa, toward truly hybrid systems where the boundary between symbolic and statistical AI becomes increasingly blurred.'
};

/**
 * Research Frontiers Slide
 */
const researchFrontiersSlide: SlideConfig = {
  id: 'research-frontiers',
  title: 'Knowledge Graph Research Frontiers',
  content: {
    definition: 'Knowledge graph research continues to advance across multiple dimensions, from fundamental representational challenges to novel applications and integration with other technologies.',
  },
  visualizationType: 'timeline',
  visualizationConfig: {
    data: researchTimelineData,
    orientation: 'horizontal',
    showLabels: true,
    colorScheme: ['#4285F4', '#EA4335', '#FBBC05', '#34A853']
  },
  transition: 'slide',
  notes: 'Explain that this timeline represents a projection of research focus areas based on current trends, conference publications, and research funding directions. The actual pace of advancement may vary based on breakthroughs and adoption patterns.'
};

/**
 * Technical Challenges Slide
 */
const technicalChallengesSlide: SlideConfig = {
  id: 'technical-challenges',
  title: 'Technical Challenges on the Horizon',
  content: {
    definition: 'Despite significant progress, knowledge graph technology faces several substantial technical challenges that will drive research and development in the coming years.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: technicalChallengesData.headers,
    rows: technicalChallengesData.rows,
    caption: 'Major knowledge graph technical challenges',
    sortable: true
  },
  transition: 'fade',
  notes: 'Highlight that addressing these challenges requires interdisciplinary approaches drawing from database systems, knowledge representation, machine learning, and distributed systems. Progress on these fronts will significantly expand the capability and application range of knowledge graphs.'
};

/**
 * Multimodal Knowledge Graphs Slide
 */
const multimodalKnowledgeGraphsSlide: SlideConfig = {
  id: 'multimodal-knowledge-graphs',
  title: 'Multimodal Knowledge Graphs',
  content: {
    definition: 'Multimodal knowledge graphs extend traditional text-centric knowledge representation to incorporate and interrelate information from multiple modalities such as images, audio, video, and time series data.',
    keyPoints: [
      'Represents entities and relationships across multiple data modalities',
      'Bridges semantic gap between symbolic knowledge and perceptual content',
      'Enables cross-modal reasoning and knowledge transfer',
      'Supports multimodal question answering and content retrieval',
      'Connects structured knowledge with unstructured media',
      'Facilitates grounding of abstract concepts in perceptual experience',
      'Enhances AI systems with multi-sensory understanding'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: multimodalKgData,
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
  notes: 'Explain that multimodal knowledge graphs represent a significant evolution beyond text-centric knowledge representation, enabling AI systems to reason across different forms of information in ways that more closely resemble human cognition, which naturally integrates multiple sensory inputs.'
};

/**
 * Decentralized Knowledge Graphs Slide
 */
const decentralizedKnowledgeGraphsSlide: SlideConfig = {
  id: 'decentralized-knowledge-graphs',
  title: 'Decentralized Knowledge Graphs',
  content: {
    definition: 'Decentralized knowledge graphs distribute knowledge creation, validation, and access across multiple independent parties while maintaining interoperability and trust.',
    keyPoints: [
      'Enables collaborative knowledge building across organizational boundaries',
      'Preserves data sovereignty and access control for knowledge providers',
      'Leverages distributed ledger technologies for provenance and trust',
      'Supports federated queries across distributed knowledge sources',
      'Reduces central authority requirements through consensus mechanisms',
      'Enables permissioned knowledge sharing with cryptographic guarantees',
      'Aligns with Web3 and decentralized data ecosystem principles'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: decentralizedKgData,
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
  notes: 'Highlight that decentralized knowledge graphs address fundamental limitations of centralized approaches, particularly for cross-organizational knowledge sharing where trust, sovereignty, and privacy concerns are paramount. This approach resonates with broader trends toward decentralized digital infrastructure.'
};

/**
 * Emerging Standards Slide
 */
const emergingStandardsSlide: SlideConfig = {
  id: 'emerging-standards',
  title: 'Emerging Standards and Specifications',
  content: {
    definition: 'The knowledge graph ecosystem continues to evolve through the development of new standards and specifications that improve interoperability, expressivity, and adoption.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: emergingStandardsData.headers,
    rows: emergingStandardsData.rows,
    caption: 'Emerging knowledge graph standards and specifications',
    sortable: true
  },
  transition: 'slide',
  notes: 'Emphasize that standards development, while sometimes slow, is crucial for the long-term growth of the knowledge graph ecosystem. Standards reduce vendor lock-in, improve interoperability, and lower adoption barriers for organizations.'
};

/**
 * Application Horizon Slide
 */
const applicationHorizonSlide: SlideConfig = {
  id: 'application-horizon',
  title: 'Knowledge Graph Applications Horizon',
  content: {
    definition: 'The application landscape for knowledge graphs continues to expand as the technology matures and integrates with other advanced technologies.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: applicationHorizonData.headers,
    rows: applicationHorizonData.rows,
    caption: 'Knowledge graph application evolution',
    sortable: true
  },
  transition: 'fade',
  notes: 'Point out that as knowledge graph technology matures, applications evolve from primarily informational uses toward more automated, predictive, and autonomous capabilities, with increasing levels of inference and agency.'
};

/**
 * Real-time Knowledge Graphs Slide
 */
const realtimeKnowledgeGraphsSlide: SlideConfig = {
  id: 'realtime-knowledge-graphs',
  title: 'Real-time Knowledge Graphs',
  content: {
    definition: 'Real-time knowledge graphs continuously ingest, process, and reason over streaming data to maintain an up-to-date representation of rapidly changing domains.',
    keyPoints: [
      'Process continuous streams of data with minimal latency',
      'Support temporal reasoning and time-aware queries',
      'Detect significant patterns and events as they emerge',
      'Enable time-critical applications like monitoring and alerting',
      'Combine historical knowledge with current observations',
      'Support both batch and stream processing paradigms',
      'Provide immediate insights on dynamic situations'
    ],
    listItems: [
      {
        title: 'Key Technical Innovations',
        items: [
          'Stream processing integration with graph databases',
          'Incremental reasoning and inference techniques',
          'Temporal indexing and query optimization',
          'Change detection and significance assessment',
          'Time-windowed aggregation and pattern matching',
          'Elastic scaling for variable load profiles',
          'Graph-specific CEP (Complex Event Processing)'
        ],
        type: 'bullet'
      },
      {
        title: 'Application Domains',
        items: [
          'Financial fraud detection and market surveillance',
          'Network security and threat intelligence',
          'IoT and sensor networks',
          'Social media monitoring and trend analysis',
          'Supply chain and logistics tracking',
          'Healthcare monitoring and alerting',
          'Smart city infrastructure management'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that real-time knowledge graphs address the fundamental challenge of knowledge currency in rapidly changing environments. They represent a significant evolution from traditional static or batch-updated knowledge bases toward dynamic, event-driven knowledge systems.'
};

/**
 * Edge Knowledge Graphs Slide
 */
const edgeKnowledgeGraphsSlide: SlideConfig = {
  id: 'edge-knowledge-graphs',
  title: 'Edge & Embedded Knowledge Graphs',
  content: {
    definition: 'Edge knowledge graphs deploy graph data and reasoning capabilities directly on edge devices, enabling local intelligence with reduced connectivity requirements and enhanced privacy.',
    keyPoints: [
      'Operate within the resource constraints of edge devices',
      'Support local reasoning without constant cloud connectivity',
      'Preserve privacy by keeping sensitive data on the device',
      'Reduce latency for time-sensitive applications',
      'Enable personalized knowledge adaptation on individual devices',
      'Support hybrid edge-cloud knowledge architectures',
      'Optimize knowledge subsets for specific device contexts'
    ],
    listItems: [
      {
        title: 'Technical Approaches',
        items: [
          'Lightweight graph databases for resource-constrained devices',
          'Knowledge distillation from large graphs to device-specific subgraphs',
          'Differential synchronization with cloud knowledge sources',
          'Context-aware knowledge prioritization',
          'Compressed graph representations for memory efficiency',
          'Hardware-optimized graph operations',
          'Energy-aware reasoning and query processing'
        ],
        type: 'bullet'
      },
      {
        title: 'Application Examples',
        items: [
          'Personal digital assistants with offline capabilities',
          'Smart home systems with local reasoning',
          'Autonomous vehicles with onboard knowledge',
          'Industrial IoT with edge intelligence',
          'Wearable devices with contextual understanding',
          'Field service applications with disconnected operation',
          'AR/VR systems with embedded knowledge models'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Highlight that edge knowledge graphs represent a convergence of knowledge graph technology with edge computing trends, addressing practical limitations of cloud-only approaches such as connectivity requirements, latency, and privacy concerns. This area will grow in importance as intelligent devices proliferate.'
};

/**
 * Knowledge Autonomy Slide
 */
const knowledgeAutonomySlide: SlideConfig = {
  id: 'knowledge-autonomy',
  title: 'Knowledge Autonomy & Self-improving KGs',
  content: {
    definition: 'Self-improving knowledge graphs incorporate mechanisms for autonomous knowledge acquisition, validation, refinement, and adaptation without requiring constant human curation.',
    keyPoints: [
      'Automatically discover and fill knowledge gaps',
      'Validate new knowledge against existing facts and constraints',
      'Detect and resolve inconsistencies and conflicts',
      'Learn from user interactions and feedback',
      'Adapt schema and ontology based on emerging patterns',
      'Maintain temporal relevance by identifying outdated information',
      'Continuously evaluate and improve knowledge quality'
    ],
    listItems: [
      {
        title: 'Enabling Technologies',
        items: [
          'Self-supervised knowledge extraction from unstructured sources',
          'Knowledge quality assessment metrics and frameworks',
          'Automated hypothesis generation and testing',
          'Meta-reasoning about knowledge completeness and consistency',
          'Ontology learning and evolution algorithms',
          'Interactive learning through human feedback loops',
          'Confidence calibration and uncertainty representation'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that knowledge autonomy represents a shift from static, human-curated knowledge bases to dynamic, self-improving systems. While full autonomy remains a research goal, incremental advances in this direction will significantly reduce maintenance costs and improve knowledge freshness and quality.'
};

/**
 * Future directions slide group configuration
 */
export const futureSlideGroup: SlideGroup = {
  title: 'Future Directions in Knowledge Graphs',
  id: 'future',
  includeSectionSlide: true,
  slides: [
    neuralSymbolicSlide,
    llmIntegrationSlide,
    aiIntegrationTrendsSlide,
    researchFrontiersSlide,
    technicalChallengesSlide,
    multimodalKnowledgeGraphsSlide,
    decentralizedKnowledgeGraphsSlide,
    emergingStandardsSlide,
    applicationHorizonSlide,
    realtimeKnowledgeGraphsSlide,
    edgeKnowledgeGraphsSlide,
    knowledgeAutonomySlide
  ]
};

/**
 * Future directions slides module
 */
export const futureSlides = futureSlideGroup.slides;