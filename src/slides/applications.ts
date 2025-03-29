/**
 * Applications Slides Module
 * Defines slides showcasing knowledge graph applications across domains
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Semantic search architecture
 */
const semanticSearchData = {
  nodes: [
    { id: 'query', label: 'User Query', type: 'io' },
    { id: 'parsing', label: 'Query Parsing', type: 'process' },
    { id: 'entities', label: 'Entity Recognition', type: 'process' },
    { id: 'expansion', label: 'Query Expansion', type: 'process' },
    { id: 'graph', label: 'Knowledge Graph', type: 'io' },
    { id: 'traversal', label: 'Graph Traversal', type: 'process' },
    { id: 'ranking', label: 'Result Ranking', type: 'process' },
    { id: 'results', label: 'Search Results', type: 'io' },
    { id: 'feedback', label: 'User Feedback', type: 'io' },
    { id: 'learning', label: 'Learning System', type: 'process' },
    { id: 'profiles', label: 'User Profiles', type: 'io' }
  ],
  edges: [
    { from: 'query', to: 'parsing' },
    { from: 'parsing', to: 'entities' },
    { from: 'entities', to: 'expansion' },
    { from: 'expansion', to: 'traversal' },
    { from: 'graph', to: 'traversal' },
    { from: 'traversal', to: 'ranking' },
    { from: 'profiles', to: 'ranking' },
    { from: 'ranking', to: 'results' },
    { from: 'results', to: 'feedback' },
    { from: 'feedback', to: 'learning' },
    { from: 'learning', to: 'expansion', label: 'Improves' },
    { from: 'learning', to: 'profiles', label: 'Updates' }
  ]
};

/**
 * Recommendation system architecture
 */
const recommendationSystemData = {
  nodes: [
    { id: 'items', label: 'Item Catalog', type: 'io' },
    { id: 'users', label: 'User Profiles', type: 'io' },
    { id: 'behaviors', label: 'User Behaviors', type: 'io' },
    { id: 'kg', label: 'Knowledge Graph', type: 'io' },
    { id: 'candidate', label: 'Candidate Generation', type: 'process' },
    { id: 'filtering', label: 'Candidate Filtering', type: 'process' },
    { id: 'ranking', label: 'Ranking Model', type: 'process' },
    { id: 'diversity', label: 'Diversity Layer', type: 'process' },
    { id: 'explanation', label: 'Explanation Generator', type: 'process' },
    { id: 'recs', label: 'Recommendations', type: 'io' },
    { id: 'feedback', label: 'User Feedback', type: 'io' },
    { id: 'learning', label: 'Model Training', type: 'process' }
  ],
  edges: [
    { from: 'items', to: 'kg' },
    { from: 'users', to: 'kg' },
    { from: 'behaviors', to: 'kg' },
    { from: 'users', to: 'candidate' },
    { from: 'kg', to: 'candidate' },
    { from: 'candidate', to: 'filtering' },
    { from: 'filtering', to: 'ranking' },
    { from: 'kg', to: 'ranking' },
    { from: 'ranking', to: 'diversity' },
    { from: 'diversity', to: 'explanation' },
    { from: 'kg', to: 'explanation' },
    { from: 'explanation', to: 'recs' },
    { from: 'recs', to: 'feedback' },
    { from: 'feedback', to: 'learning' },
    { from: 'learning', to: 'kg', label: 'Updates' },
    { from: 'learning', to: 'ranking', label: 'Improves' }
  ]
};

/**
 * Virtual assistant architecture
 */
const virtualAssistantData = {
  nodes: [
    { id: 'input', label: 'User Input', type: 'io' },
    { id: 'nlu', label: 'Natural Language Understanding', type: 'process' },
    { id: 'intent', label: 'Intent Classification', type: 'process' },
    { id: 'entity', label: 'Entity Recognition', type: 'process' },
    { id: 'dialogue', label: 'Dialogue Manager', type: 'process' },
    { id: 'kg', label: 'Knowledge Graph', type: 'io' },
    { id: 'context', label: 'Conversation Context', type: 'io' },
    { id: 'query', label: 'Knowledge Query Engine', type: 'process' },
    { id: 'generation', label: 'Response Generation', type: 'process' },
    { id: 'output', label: 'Assistant Response', type: 'io' },
    { id: 'feedback', label: 'User Feedback', type: 'io' },
    { id: 'learning', label: 'Continuous Learning', type: 'process' }
  ],
  edges: [
    { from: 'input', to: 'nlu' },
    { from: 'nlu', to: 'intent' },
    { from: 'nlu', to: 'entity' },
    { from: 'intent', to: 'dialogue' },
    { from: 'entity', to: 'dialogue' },
    { from: 'dialogue', to: 'query' },
    { from: 'context', to: 'dialogue' },
    { from: 'kg', to: 'query' },
    { from: 'query', to: 'generation' },
    { from: 'dialogue', to: 'generation' },
    { from: 'generation', to: 'output' },
    { from: 'output', to: 'feedback' },
    { from: 'feedback', to: 'learning' },
    { from: 'learning', to: 'kg', label: 'Updates' },
    { from: 'dialogue', to: 'context', label: 'Updates' }
  ]
};

/**
 * Fraud detection example
 */
const fraudDetectionData: GraphData = {
  nodes: [
    { id: 'user1', label: 'User: John Smith', type: 'Person', 
      properties: { risk_score: 'Low', account_age: '3 years' } },
    { id: 'transaction1', label: 'Transaction: #T123', type: 'Transaction', 
      properties: { amount: '$500', date: '2023-06-10', type: 'Purchase' } },
    { id: 'merchant1', label: 'Merchant: TechStore', type: 'Merchant', 
      properties: { category: 'Electronics', risk_score: 'Low' } },
    { id: 'address1', label: 'Address: 123 Main St', type: 'Address', 
      properties: { city: 'Boston', country: 'USA' } },
    { id: 'ip1', label: 'IP: 192.168.1.1', type: 'IPAddress', 
      properties: { location: 'Boston, USA', isp: 'Comcast' } },
    { id: 'device1', label: 'Device: iPhone 12', type: 'Device', 
      properties: { os: 'iOS 16', browser: 'Safari' } },
    { id: 'user2', label: 'User: Jane Wilson', type: 'Person', 
      properties: { risk_score: 'Medium', account_age: '6 months' } },
    { id: 'transaction2', label: 'Transaction: #T456', type: 'Transaction', 
      properties: { amount: '$450', date: '2023-06-12', type: 'Purchase' } },
    { id: 'ip2', label: 'IP: 203.0.113.5', type: 'IPAddress', 
      properties: { location: 'Lagos, Nigeria', isp: 'AfricaNet' } },
    { id: 'device2', label: 'Device: Android Phone', type: 'Device', 
      properties: { os: 'Android 13', browser: 'Chrome' } }
  ],
  edges: [
    { source: 'user1', target: 'transaction1', label: 'MADE' },
    { source: 'transaction1', target: 'merchant1', label: 'AT' },
    { source: 'user1', target: 'address1', label: 'HAS_ADDRESS' },
    { source: 'user1', target: 'device1', label: 'USES' },
    { source: 'transaction1', target: 'ip1', label: 'FROM_IP' },
    { source: 'transaction1', target: 'device1', label: 'FROM_DEVICE' },
    { source: 'user2', target: 'transaction2', label: 'MADE' },
    { source: 'transaction2', target: 'merchant1', label: 'AT' },
    { source: 'user2', target: 'address1', label: 'HAS_ADDRESS' },
    { source: 'transaction2', target: 'ip2', label: 'FROM_IP', properties: { flag: 'Suspicious location mismatch' } },
    { source: 'transaction2', target: 'device2', label: 'FROM_DEVICE' },
    { source: 'user1', target: 'user2', label: 'SHARES_ADDRESS_WITH' }
  ]
};

/**
 * Business use cases comparison
 */
const businessUseCasesData = {
  headers: ['Use Case', 'Description', 'Key Benefits', 'Challenges', 'Example Implementation'],
  rows: [
    { 
      'Use Case': 'Customer 360', 
      'Description': 'Unified view of customer data across touchpoints', 
      'Key Benefits': 'Improved customer experience, higher retention, cross-selling opportunities', 
      'Challenges': 'Data integration, privacy compliance, real-time updates', 
      'Example Implementation': 'Salesforce Customer 360 Truth, Reltio Connected Customer 360' 
    },
    { 
      'Use Case': 'Supply Chain Visibility', 
      'Description': 'End-to-end tracking and optimization of supply networks', 
      'Key Benefits': 'Reduced costs, improved resilience, better inventory management', 
      'Challenges': 'Partner integration, data standards, geographical dispersion', 
      'Example Implementation': 'IBM Sterling Supply Chain, SAP Ariba Supply Chain Collaboration' 
    },
    { 
      'Use Case': 'Product Recommendations', 
      'Description': 'Contextual product suggestions based on user behavior and preferences', 
      'Key Benefits': 'Increased conversion rates, higher AOV, improved engagement', 
      'Challenges': 'Cold start problem, maintaining freshness, balancing exploration/exploitation', 
      'Example Implementation': 'Amazon Personalize, Netflix Recommendation Engine' 
    },
    { 
      'Use Case': 'Risk Assessment', 
      'Description': 'Comprehensive evaluation of financial and compliance risks', 
      'Key Benefits': 'Reduced fraud, improved regulatory compliance, better decision making', 
      'Challenges': 'Data quality, explainability requirements, evolving regulations', 
      'Example Implementation': 'FICO Falcon Fraud Manager, Moody\'s Analytics' 
    },
    { 
      'Use Case': 'Content Management', 
      'Description': 'Semantic organization and retrieval of enterprise content', 
      'Key Benefits': 'Improved findability, content reuse, consistent tagging', 
      'Challenges': 'Legacy content migration, taxonomy maintenance, user adoption', 
      'Example Implementation': 'Adobe Experience Manager, Box Skills' 
    },
    { 
      'Use Case': 'IT Service Management', 
      'Description': 'Dependency mapping and impact analysis for IT assets', 
      'Key Benefits': 'Faster incident resolution, better change management, reduced downtime', 
      'Challenges': 'Keeping topology current, scale of modern infrastructures, cloud integration', 
      'Example Implementation': 'ServiceNow CMDB, BMC Helix' 
    }
  ]
};

/**
 * Industry-specific applications
 */
const industryApplicationsData = {
  headers: ['Industry', 'Key Applications', 'Business Impact', 'Technical Requirements', 'Notable Examples'],
  rows: [
    { 
      'Industry': 'Healthcare & Life Sciences', 
      'Key Applications': 'Drug discovery, clinical decision support, patient 360, literature analysis', 
      'Business Impact': 'Accelerated research cycles, improved diagnostics, reduced readmissions', 
      'Technical Requirements': 'HIPAA compliance, medical ontologies, high accuracy requirements', 
      'Notable Examples': 'UMLS, Pharma.AI (Insilico Medicine), IBM Watson for Health' 
    },
    { 
      'Industry': 'Financial Services', 
      'Key Applications': 'Fraud detection, risk assessment, compliance monitoring, wealth management', 
      'Business Impact': 'Reduced fraud losses, improved regulatory reporting, personalized services', 
      'Technical Requirements': 'Real-time processing, strict security, audit trails', 
      'Notable Examples': 'JP Morgan COIN, Capital One Graph, Thomson Reuters Risk Intelligence' 
    },
    { 
      'Industry': 'Retail & E-commerce', 
      'Key Applications': 'Product recommendations, inventory optimization, customer segmentation', 
      'Business Impact': 'Increased basket size, improved inventory turns, reduced cart abandonment', 
      'Technical Requirements': 'High query volume, seasonal scaling, real-time personalization', 
      'Notable Examples': 'Alibaba\'s E-commerce Graph, eBay Knowledge Graph, Walmart Product Graph' 
    },
    { 
      'Industry': 'Manufacturing', 
      'Key Applications': 'Digital twins, predictive maintenance, supply chain optimization', 
      'Business Impact': 'Reduced downtime, improved quality, optimized production planning', 
      'Technical Requirements': 'IoT integration, time-series data, industrial standards', 
      'Notable Examples': 'Siemens Industrial Knowledge Graph, GE Predix, Bosch IoT Suite' 
    },
    { 
      'Industry': 'Media & Entertainment', 
      'Key Applications': 'Content recommendations, audience insights, rights management', 
      'Business Impact': 'Increased engagement, content discovery, targeted advertising', 
      'Technical Requirements': 'Rich metadata, sentiment analysis, personalization', 
      'Notable Examples': 'Netflix Graph, Spotify Knowledge Graph, BBC Ontologies' 
    },
    { 
      'Industry': 'Public Sector', 
      'Key Applications': 'Fraud detection, intelligence analysis, public service delivery', 
      'Business Impact': 'Improved service access, reduced fraud, better resource allocation', 
      'Technical Requirements': 'Security clearance levels, interagency data sharing, privacy protection', 
      'Notable Examples': 'US Treasury\'s Financial Crimes Enforcement Network, UK GOV.UK Knowledge Graph' 
    }
  ]
};

/**
 * Knowledge graph role in AI landscape
 */
const aiIntegrationData = {
  nodes: [
    { id: 'kg', label: 'Knowledge Graph', type: 'component' },
    { id: 'ml', label: 'Machine Learning', type: 'component' },
    { id: 'nlp', label: 'Natural Language Processing', type: 'component' },
    { id: 'llm', label: 'Large Language Models', type: 'component' },
    { id: 'cv', label: 'Computer Vision', type: 'component' },
    { id: 'search', label: 'Semantic Search', type: 'application' },
    { id: 'qa', label: 'Question Answering', type: 'application' },
    { id: 'rec', label: 'Recommendation Systems', type: 'application' },
    { id: 'insight', label: 'Data Insights', type: 'application' },
    { id: 'knowledge', label: 'Domain Knowledge', type: 'input' },
    { id: 'structured', label: 'Structured Data', type: 'input' },
    { id: 'unstructured', label: 'Unstructured Content', type: 'input' }
  ],
  edges: [
    { from: 'kg', to: 'search', label: 'Powers' },
    { from: 'kg', to: 'qa', label: 'Enhances' },
    { from: 'kg', to: 'rec', label: 'Improves' },
    { from: 'kg', to: 'insight', label: 'Enables' },
    { from: 'ml', to: 'kg', label: 'Constructs' },
    { from: 'nlp', to: 'kg', label: 'Populates' },
    { from: 'kg', to: 'ml', label: 'Contextualizes' },
    { from: 'kg', to: 'nlp', label: 'Disambiguates' },
    { from: 'llm', to: 'kg', label: 'Extracts facts for' },
    { from: 'kg', to: 'llm', label: 'Grounds' },
    { from: 'cv', to: 'kg', label: 'Identifies entities for' },
    { from: 'kg', to: 'cv', label: 'Provides context to' },
    { from: 'knowledge', to: 'kg', label: 'Encoded in' },
    { from: 'structured', to: 'kg', label: 'Mapped to' },
    { from: 'unstructured', to: 'nlp', label: 'Processed by' },
    { from: 'unstructured', to: 'cv', label: 'Analyzed by' }
  ]
};

/**
 * KG applications impact metrics
 */
const impactMetricsData = {
  headers: ['Application', 'Metric', 'Typical Improvement', 'Measurement Method', 'Example Case Study'],
  rows: [
    { 
      'Application': 'Semantic Search', 
      'Metric': 'Search Relevance', 
      'Typical Improvement': '25-40% increase', 
      'Measurement Method': 'Mean Reciprocal Rank (MRR), Normalized Discounted Cumulative Gain (NDCG)', 
      'Example Case Study': 'Google saw 30% more accurate search results after KG implementation' 
    },
    { 
      'Application': 'Recommendations', 
      'Metric': 'Conversion Rate', 
      'Typical Improvement': '15-30% increase', 
      'Measurement Method': 'A/B testing, Click-through rate (CTR)', 
      'Example Case Study': 'Netflix reports 75% of viewer activity influenced by recommendations' 
    },
    { 
      'Application': 'Customer Service', 
      'Metric': 'Time to Resolution', 
      'Typical Improvement': '20-50% reduction', 
      'Measurement Method': 'Average handle time, First contact resolution rate', 
      'Example Case Study': 'eBay reduced resolution time by 35% with knowledge graph-powered support' 
    },
    { 
      'Application': 'Fraud Detection', 
      'Metric': 'False Positive Rate', 
      'Typical Improvement': '30-60% reduction', 
      'Measurement Method': 'Precision/Recall curves, F1 score', 
      'Example Case Study': 'PayPal reduced false alerts by 50% with graph-based detection' 
    },
    { 
      'Application': 'Drug Discovery', 
      'Metric': 'Lead Compound Identification', 
      'Typical Improvement': '2-5x speedup', 
      'Measurement Method': 'Time to identify candidates, Success rate', 
      'Example Case Study': 'BenevolentAI identified baricitinib for COVID-19 treatment in days' 
    },
    { 
      'Application': 'Supply Chain Optimization', 
      'Metric': 'Inventory Costs', 
      'Typical Improvement': '10-25% reduction', 
      'Measurement Method': 'Inventory turns, Carrying costs', 
      'Example Case Study': 'Walmart reduced inventory costs by 15% with graph-based visibility' 
    }
  ]
};

/**
 * Semantic Search Slide
 */
const semanticSearchSlide: SlideConfig = {
  id: 'semantic-search',
  title: 'Semantic Search',
  content: {
    definition: 'Semantic search enhances traditional keyword search by understanding the contextual meaning of query terms and the relationships between entities, powered by knowledge graphs.',
    keyPoints: [
      'Entity recognition maps user queries to knowledge graph entities',
      'Query expansion incorporates synonyms, related concepts, and hierarchical relationships',
      'Graph traversal identifies relevant connected entities beyond direct matches',
      'Result ranking incorporates entity relationships and semantic relevance',
      'Enables natural language queries that capture user intent rather than just keywords',
      'Supports faceted navigation based on entity types and properties',
      'Enables question answering capabilities using structured knowledge'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: semanticSearchData.nodes,
    edges: semanticSearchData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Emphasize how semantic search fundamentally transforms search from keyword matching to intent understanding. This is one of the most mature and widely-deployed knowledge graph applications, with implementations ranging from web search to enterprise knowledge management.'
};

/**
 * Recommendation Systems Slide
 */
const recommendationSystemsSlide: SlideConfig = {
  id: 'recommendation-systems',
  title: 'Recommendation Systems',
  content: {
    definition: 'Knowledge graph-powered recommendation systems enhance suggestions by incorporating semantic relationships, user context, and domain knowledge beyond traditional collaborative filtering.',
    keyPoints: [
      'Entity-based recommendations capture richer relationships between items',
      'Path-based algorithms discover non-obvious connections between users and items',
      'Graph structure incorporates multiple interaction types (viewed, purchased, rated)',
      'Content features integrated through entity properties and relationships',
      'Cold-start problem addressed through knowledge-based inference',
      'Explainable recommendations through relationship paths',
      'Multi-domain recommendations through connected entities across domains'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: recommendationSystemData.nodes,
    edges: recommendationSystemData.edges,
    direction: 'LR',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Highlight that graph-based recommendations address key limitations of traditional approaches, particularly cold-start problems, recommendation diversity, and explainability. Include examples like Amazon\'s product recommendations, Netflix\'s content suggestions, and Spotify\'s music discovery features.'
};

/**
 * Virtual Assistants Slide
 */
const virtualAssistantsSlide: SlideConfig = {
  id: 'virtual-assistants',
  title: 'Virtual Assistants & Chatbots',
  content: {
    definition: 'Knowledge graphs provide virtual assistants with structured background knowledge, contextual understanding, and reasoning capabilities to answer complex questions and engage in multi-turn conversations.',
    keyPoints: [
      'Entity recognition maps user queries to knowledge graph concepts',
      'Knowledge-based dialog management maintains conversation context',
      'Structured knowledge enables precise answers to factual questions',
      'Path traversal supports multi-hop question answering',
      'Relationship awareness enables follow-up question handling',
      'Domain knowledge improves task completion in specialized assistants',
      'Integration with LLMs provides natural language generation with factual grounding'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: virtualAssistantData.nodes,
    edges: virtualAssistantData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Emphasize how knowledge graphs address key limitations of purely statistical approaches to conversational AI, particularly factual correctness and contextual memory. Knowledge graphs are increasingly being integrated with LLMs to combine the strengths of both approaches.'
};

/**
 * Fraud Detection Slide
 */
const fraudDetectionSlide: SlideConfig = {
  id: 'fraud-detection',
  title: 'Fraud Detection & Risk Analysis',
  content: {
    definition: 'Knowledge graphs excel at identifying suspicious patterns and hidden connections in financial transactions, enabling sophisticated fraud detection and risk assessment.',
    keyPoints: [
      'Entity links reveal hidden relationships between seemingly unrelated transactions',
      'Network analysis identifies suspicious clusters and patterns',
      'Temporal analysis tracks behavior changes and anomalies over time',
      'Path analysis discovers chains of transactions designed to obscure origins',
      'Identity resolution connects different identities of the same fraudulent actors',
      'Risk scoring incorporates both direct and indirect indicators',
      'Explainable alerts provide justification for investigation'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: fraudDetectionData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    highlightNodes: ['transaction2', 'ip2'],
    highlightEdges: ['source: transaction2, target: ip2'],
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Explain that graph technology is particularly powerful for fraud detection because sophisticated fraud often involves networks of relationships rather than single transactions. The visualization shows a suspicious transaction from an unusual location that might indicate account takeover.'
};

/**
 * Master Data Management Slide
 */
const masterDataManagementSlide: SlideConfig = {
  id: 'master-data-management',
  title: 'Master Data Management',
  content: {
    definition: 'Knowledge graph-based master data management (MDM) creates a unified, consistent view of key business entities across diverse systems, with rich relationship context.',
    keyPoints: [
      'Entity resolution links records from different systems to canonical representations',
      'Relationship management maintains connections between master data entities',
      'Hierarchy management maintains organizational structures and classifications',
      'Data governance tracks lineage, ownership, and quality metrics',
      'Change management handles updates across connected systems',
      'Versioning captures the evolution of master data over time',
      'APIs provide consistent access across applications'
    ],
    listItems: [
      {
        title: 'Benefits over Traditional MDM',
        items: [
          'Flexible schema adaptation to changing business requirements',
          'Native relationship modeling for complex entity connections',
          'Richer context for entity resolution and matching',
          'Integrated hierarchy management without separate structures',
          'Support for multiple classification systems and viewpoints',
          'Enhanced data lineage with complete relationship tracking'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Highlight that knowledge graph-based MDM extends traditional MDM by focusing on relationships as first-class elements, not just attributes. This enables more sophisticated entity resolution and provides richer context for data consumers.'
};

/**
 * Data Cataloging Slide
 */
const dataCatalogingSlide: SlideConfig = {
  id: 'data-cataloging',
  title: 'Data Cataloging & Discovery',
  content: {
    definition: 'Knowledge graph-based data catalogs create a semantic layer over enterprise data assets, enabling discovery, understanding, and governance through rich metadata and relationships.',
    keyPoints: [
      'Semantic mapping of data assets to business concepts and domains',
      'Automated metadata extraction and classification',
      'Lineage tracking from source systems through transformations',
      'Relationship mapping between datasets, systems, and business concepts',
      'Impact analysis for changes to data sources and models',
      'Governance policy enforcement and compliance monitoring',
      'Self-service data discovery for business users'
    ],
    listItems: [
      {
        title: 'Components of Knowledge Graph Data Catalogs',
        items: [
          'Technical metadata: schema, formats, volumes, locations',
          'Business metadata: definitions, owners, domains, policies',
          'Operational metadata: usage patterns, quality metrics, freshness',
          'Relationship metadata: dependencies, lineage, semantic mappings',
          'Search and discovery interfaces with faceted navigation',
          'APIs for metadata integration with data pipelines and applications'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Emphasize that data catalogs powered by knowledge graphs go beyond traditional metadata repositories by contextualizing data assets within the business domain and capturing the rich web of relationships between data, processes, and organizations.'
};

/**
 * AI Integration Slide
 */
const aiIntegrationSlide: SlideConfig = {
  id: 'ai-kg-integration',
  title: 'AI and Knowledge Graph Integration',
  content: {
    definition: 'Knowledge graphs and AI systems complement each other, with knowledge graphs providing structured domain knowledge and AI bringing pattern recognition and learning capabilities.',
    keyPoints: [
      'Knowledge graphs provide factual grounding for language models',
      'ML enhances knowledge graph construction and completion',
      'Graph neural networks combine structural knowledge with deep learning',
      'LLMs generate natural language from knowledge graph content',
      'Multimodal systems connect vision and language through knowledge graphs',
      'Knowledge graphs explain AI decisions through structured relationships',
      'Hybrid systems combine symbolic and neural approaches for robust AI'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: aiIntegrationData.nodes,
    edges: aiIntegrationData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Emphasize that the combination of knowledge graphs and AI represents a powerful synergy rather than competing approaches. The structured knowledge in graphs addresses key limitations of statistical AI, while machine learning enhances knowledge graph construction and query capabilities.'
};

/**
 * Business Use Cases Slide
 */
const businessUseCasesSlide: SlideConfig = {
  id: 'business-use-cases',
  title: 'Enterprise Knowledge Graph Use Cases',
  content: {
    definition: 'Knowledge graphs address diverse business challenges across enterprise functions through their ability to integrate data, model complex relationships, and derive insights.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: businessUseCasesData.headers,
    rows: businessUseCasesData.rows,
    caption: 'Enterprise knowledge graph business applications',
    sortable: true,
    filterable: true
  },
  transition: 'slide',
  notes: 'Point out that these use cases span industries and business functions, demonstrating the versatility of knowledge graphs as an enterprise technology. The unifying theme is complex relationship modeling that traditional technologies struggle with.'
};

/**
 * Industry Applications Slide
 */
const industryApplicationsSlide: SlideConfig = {
  id: 'industry-applications',
  title: 'Industry-Specific Applications',
  content: {
    definition: 'Knowledge graphs are deployed across industries with specialized applications that address domain-specific challenges and requirements.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: industryApplicationsData.headers,
    rows: industryApplicationsData.rows,
    caption: 'Knowledge graph applications by industry',
    sortable: true
  },
  transition: 'fade',
  notes: 'Emphasize that while the underlying technology is similar, the terminology, ontologies, and integration points vary significantly by industry. Domain expertise is crucial for successful implementation in specialized fields.'
};

/**
 * Business Impact Slide
 */
const businessImpactSlide: SlideConfig = {
  id: 'business-impact',
  title: 'Measuring Business Impact',
  content: {
    definition: 'Knowledge graph applications deliver measurable business value across multiple dimensions, with impact metrics tailored to specific use cases.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: impactMetricsData.headers,
    rows: impactMetricsData.rows,
    caption: 'Knowledge graph impact metrics by application',
    sortable: true
  },
  transition: 'slide',
  notes: 'Highlight that ROI calculations should incorporate both direct metrics (e.g., increased conversion rates) and indirect benefits (e.g., improved customer experience). Knowledge graph projects typically show strong ROI despite initial investment requirements.'
};

/**
 * Applications slide group configuration
 */
export const applicationsSlideGroup: SlideGroup = {
  title: 'Knowledge Graph Applications',
  id: 'applications',
  includeSectionSlide: true,
  slides: [
    semanticSearchSlide,
    recommendationSystemsSlide,
    virtualAssistantsSlide,
    fraudDetectionSlide,
    masterDataManagementSlide,
    dataCatalogingSlide,
    aiIntegrationSlide,
    businessUseCasesSlide,
    industryApplicationsSlide,
    businessImpactSlide
  ]
};

/**
 * Applications slides module
 */
export const applicationsSlides = applicationsSlideGroup.slides;