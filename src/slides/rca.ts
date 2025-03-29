/**
 * Root Cause Analysis Slides Module
 * Defines slides covering knowledge graph applications for root cause analysis
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Causal graph example for incident analysis
 */
const incidentCausalGraphData: GraphData = {
  nodes: [
    { id: 'incident', label: 'Service Outage', type: 'Incident', 
      properties: { duration: '47 minutes', impact: 'High', date: '2023-05-15' } },
    { id: 'cause1', label: 'Database Overload', type: 'DirectCause', 
      properties: { system: 'Primary DB Cluster', time: '14:23:05' } },
    { id: 'cause2', label: 'Query Timeout', type: 'Symptom', 
      properties: { count: '1,243 queries', error_code: 'DB-500' } },
    { id: 'cause3', label: 'Connection Pool Exhaustion', type: 'Symptom', 
      properties: { max_connections: '500', reached_at: '14:20:17' } },
    { id: 'cause4', label: 'API Request Spike', type: 'RootCause', 
      properties: { volume: '10x normal', origin: 'Mobile App' } },
    { id: 'cause5', label: 'App Release', type: 'Event', 
      properties: { version: '2.5.0', release_time: '14:00:00' } },
    { id: 'cause6', label: 'Missing Index', type: 'RootCause', 
      properties: { table: 'user_sessions', impact: 'Sequential Scan' } },
    { id: 'cause7', label: 'Cache Failure', type: 'ContributingFactor', 
      properties: { service: 'Redis Cluster', time: '14:15:22' } },
    { id: 'resolution', label: 'Database Scaling', type: 'Resolution', 
      properties: { action: 'Increased capacity by 200%', time: '14:55:12' } }
  ],
  edges: [
    { source: 'cause1', target: 'incident', label: 'CAUSED' },
    { source: 'cause2', target: 'cause1', label: 'INDICATES' },
    { source: 'cause3', target: 'cause1', label: 'INDICATES' },
    { source: 'cause4', target: 'cause3', label: 'CAUSED' },
    { source: 'cause5', target: 'cause4', label: 'TRIGGERED' },
    { source: 'cause6', target: 'cause2', label: 'CAUSED' },
    { source: 'cause7', target: 'cause3', label: 'CONTRIBUTED_TO' },
    { source: 'resolution', target: 'cause1', label: 'RESOLVED' }
  ],
  metadata: {
    name: 'Service Outage Causal Graph',
    description: 'Causal analysis of service outage incident',
    lastModified: new Date().toISOString()
  }
};

/**
 * Manufacturing defect causal graph
 */
const manufacturingCausalGraphData: GraphData = {
  nodes: [
    { id: 'defect', label: 'Product Defect: Joint Failure', type: 'Defect', 
      properties: { failure_rate: '3.2%', detection_date: '2023-04-10' } },
    { id: 'cause1', label: 'Structural Weakness', type: 'DirectCause', 
      properties: { location: 'Connection Joint', material: 'Polymer' } },
    { id: 'cause2', label: 'Material Degradation', type: 'Symptom', 
      properties: { pattern: 'Stress fractures', test_result: 'Below spec' } },
    { id: 'cause3', label: 'Temperature Variation', type: 'ContributingFactor', 
      properties: { deviation: '+/-15°C', process: 'Curing' } },
    { id: 'cause4', label: 'Raw Material Change', type: 'RootCause', 
      properties: { date: '2023-03-15', supplier: 'Acme Materials' } },
    { id: 'cause5', label: 'Process Parameter Drift', type: 'RootCause', 
      properties: { calibration: 'Out of spec', equipment: 'Line 3 Extruder' } },
    { id: 'cause6', label: 'Operator Error', type: 'ContributingFactor', 
      properties: { shift: 'Night', training: 'Incomplete' } },
    { id: 'cause7', label: 'Quality Check Gap', type: 'SystemicCause', 
      properties: { process: 'In-line inspection', reason: 'Equipment malfunction' } },
    { id: 'resolution1', label: 'Material Specification Update', type: 'Resolution', 
      properties: { document: 'MS-2023-04', effective_date: '2023-05-01' } },
    { id: 'resolution2', label: 'Process Revalidation', type: 'Resolution', 
      properties: { scope: 'Full line validation', completed: '2023-04-25' } }
  ],
  edges: [
    { source: 'cause1', target: 'defect', label: 'CAUSED' },
    { source: 'cause2', target: 'cause1', label: 'INDICATES' },
    { source: 'cause3', target: 'cause2', label: 'CONTRIBUTED_TO' },
    { source: 'cause4', target: 'cause2', label: 'CAUSED' },
    { source: 'cause5', target: 'cause3', label: 'CAUSED' },
    { source: 'cause6', target: 'cause5', label: 'CONTRIBUTED_TO' },
    { source: 'cause7', target: 'defect', label: 'ALLOWED' },
    { source: 'resolution1', target: 'cause4', label: 'ADDRESSES' },
    { source: 'resolution2', target: 'cause5', label: 'ADDRESSES' },
    { source: 'resolution2', target: 'cause7', label: 'ADDRESSES' }
  ]
};

/**
 * Causal inference techniques comparison
 */
const causalInferenceData = {
  headers: ['Technique', 'Approach', 'Strengths', 'Limitations', 'Knowledge Graph Role'],
  rows: [
    { 
      'Technique': 'Causal Bayesian Networks', 
      'Approach': 'Probabilistic model with directed edges representing causal relationships', 
      'Strengths': 'Mathematical foundation, handles uncertainty, supports intervention analysis', 
      'Limitations': 'Requires acyclic graphs, scalability challenges with large models', 
      'Knowledge Graph Role': 'Provides structure and prior knowledge, integrated with probabilistic inference' 
    },
    { 
      'Technique': 'Granger Causality', 
      'Approach': 'Statistical test to determine if one time series helps predict another', 
      'Strengths': 'Works well with time-series data, quantitative assessment', 
      'Limitations': 'Temporal correlation only, misses instantaneous causation', 
      'Knowledge Graph Role': 'Temporal context enrichment, event sequence modeling' 
    },
    { 
      'Technique': 'Structural Equation Modeling', 
      'Approach': 'System of equations modeling relationships between variables', 
      'Strengths': 'Quantifies relationship strength, handles direct/indirect effects', 
      'Limitations': 'Assumes linear relationships, sensitive to model specification', 
      'Knowledge Graph Role': 'Variable relationship mapping, integration with domain knowledge' 
    },
    { 
      'Technique': 'Rubin Causal Model (Potential Outcomes)', 
      'Approach': 'Compares potential outcomes under different treatments', 
      'Strengths': 'Clear counterfactual reasoning, handles experimental design', 
      'Limitations': 'Requires strong assumptions for observational data', 
      'Knowledge Graph Role': 'Event and intervention modeling, contextual enrichment' 
    },
    { 
      'Technique': 'Causal Rule Mining', 
      'Approach': 'Discovers causal rules from data using association rule techniques', 
      'Strengths': 'Produces human-readable rules, handles heterogeneous data', 
      'Limitations': 'May discover spurious correlations, computationally intensive', 
      'Knowledge Graph Role': 'Rule storage, validation against existing knowledge' 
    },
    { 
      'Technique': 'Root Cause Trees', 
      'Approach': 'Hierarchical decomposition of problems into causes', 
      'Strengths': 'Intuitive, supports systematic analysis, traces causality chains', 
      'Limitations': 'Often manual, may miss complex interactions', 
      'Knowledge Graph Role': 'Explicit representation of causal chains and dependencies' 
    },
    { 
      'Technique': 'Process Mining', 
      'Approach': 'Analyzes event logs to extract process models and deviations', 
      'Strengths': 'Data-driven, identifies process bottlenecks and variations', 
      'Limitations': 'Requires detailed event logs, primarily temporal reasoning', 
      'Knowledge Graph Role': 'Event sequencing, process context enrichment' 
    }
  ]
};

/**
 * Time series integration architecture
 */
const timeSeriesIntegrationData = {
  nodes: [
    { id: 'kg', label: 'Knowledge Graph', type: 'component' },
    { id: 'tsdb', label: 'Time Series Database', type: 'component' },
    { id: 'events', label: 'Event Stream', type: 'component' },
    { id: 'devices', label: 'IoT Devices', type: 'source' },
    { id: 'logs', label: 'System Logs', type: 'source' },
    { id: 'sensors', label: 'Sensors', type: 'source' },
    { id: 'kafka', label: 'Kafka Streams', type: 'processor' },
    { id: 'spark', label: 'Spark Streaming', type: 'processor' },
    { id: 'entity', label: 'Entity Resolution', type: 'processor' },
    { id: 'anomaly', label: 'Anomaly Detection', type: 'processor' },
    { id: 'causal', label: 'Causal Analysis', type: 'processor' },
    { id: 'dash', label: 'Analytics Dashboard', type: 'consumer' },
    { id: 'alert', label: 'Alert System', type: 'consumer' },
    { id: 'api', label: 'Query API', type: 'consumer' }
  ],
  edges: [
    { from: 'devices', to: 'events' },
    { from: 'logs', to: 'events' },
    { from: 'sensors', to: 'events' },
    { from: 'events', to: 'kafka' },
    { from: 'kafka', to: 'spark' },
    { from: 'spark', to: 'tsdb' },
    { from: 'tsdb', to: 'anomaly' },
    { from: 'spark', to: 'entity' },
    { from: 'entity', to: 'kg' },
    { from: 'kg', to: 'causal' },
    { from: 'tsdb', to: 'causal' },
    { from: 'anomaly', to: 'causal' },
    { from: 'causal', to: 'kg', label: 'Updates' },
    { from: 'anomaly', to: 'alert' },
    { from: 'kg', to: 'api' },
    { from: 'api', to: 'dash' }
  ]
};

/**
 * RCA methodologies comparison
 */
const rcaMethodologiesData = {
  headers: ['Methodology', 'Approach', 'Best For', 'Knowledge Graph Application'],
  rows: [
    { 
      'Methodology': '5 Whys', 
      'Approach': 'Repeatedly ask why to drill down to root causes', 
      'Best For': 'Simple incidents, team analysis sessions', 
      'Knowledge Graph Application': 'Capturing cause chains, knowledge accumulation across incidents' 
    },
    { 
      'Methodology': 'Fishbone Diagram (Ishikawa)', 
      'Approach': 'Categorize potential causes by major dimensions', 
      'Best For': 'Complex problems with multiple contributing factors', 
      'Knowledge Graph Application': 'Multi-dimensional cause modeling, factor categorization' 
    },
    { 
      'Methodology': 'Fault Tree Analysis', 
      'Approach': 'Boolean logic tree of events leading to failure', 
      'Best For': 'Safety-critical systems, formal analysis', 
      'Knowledge Graph Application': 'Logical relationship modeling, probability calculation' 
    },
    { 
      'Methodology': 'Failure Mode and Effects Analysis (FMEA)', 
      'Approach': 'Systematic identification of potential failures and impacts', 
      'Best For': 'Preventive analysis, risk prioritization', 
      'Knowledge Graph Application': 'Linking components to failure modes, propagating impacts' 
    },
    { 
      'Methodology': 'Pareto Analysis', 
      'Approach': 'Focus on the vital few causes over the trivial many', 
      'Best For': 'Resource allocation, prioritizing improvements', 
      'Knowledge Graph Application': 'Frequency analysis, pattern recognition across incidents' 
    },
    { 
      'Methodology': 'Barrier Analysis', 
      'Approach': 'Identify barriers that failed to prevent an incident', 
      'Best For': 'Safety incidents, process breakdowns', 
      'Knowledge Graph Application': 'Modeling controls, defenses, and their relationships' 
    },
    { 
      'Methodology': 'Change Analysis', 
      'Approach': 'Compare before/after conditions to identify relevant changes', 
      'Best For': 'Incidents following system or process changes', 
      'Knowledge Graph Application': 'Temporal modeling, change impact tracing' 
    }
  ]
};

/**
 * Uncertainty representation approaches
 */
const uncertaintyRepresentationData = {
  headers: ['Approach', 'Description', 'Representation', 'Best For', 'Implementation'],
  rows: [
    { 
      'Approach': 'Probability Values', 
      'Description': 'Annotate facts with probability of truth', 
      'Representation': 'Edge/node properties with P(0-1)', 
      'Best For': 'Well-understood uncertainty, statistical models', 
      'Implementation': 'Bayesian networks, probabilistic graph DBs' 
    },
    { 
      'Approach': 'Confidence Scores', 
      'Description': 'Indicate strength of belief in a fact', 
      'Representation': 'Edge/node properties with confidence metrics', 
      'Best For': 'Machine learning derived facts, human judgments', 
      'Implementation': 'Property annotations, specialized predicates' 
    },
    { 
      'Approach': 'Fuzzy Logic', 
      'Description': 'Extend logical reasoning to partial truth values', 
      'Representation': 'Membership degrees for facts/concepts', 
      'Best For': 'Linguistic variables, gradual concepts', 
      'Implementation': 'Fuzzy rule systems, OWL with fuzzy extensions' 
    },
    { 
      'Approach': 'Provenance Tracking', 
      'Description': 'Track origin and derivation of facts', 
      'Representation': 'Metadata about source reliability', 
      'Best For': 'Integrating data from multiple sources', 
      'Implementation': 'Named graphs, reification, PROV ontology' 
    },
    { 
      'Approach': 'Evidential Reasoning', 
      'Description': 'Combine evidence for/against facts', 
      'Representation': 'Belief functions, evidential weights', 
      'Best For': 'Conflicting information, intelligence analysis', 
      'Implementation': 'Dempster-Shafer theory, evidential DBs' 
    },
    { 
      'Approach': 'Temporal Validity', 
      'Description': 'Model time periods when facts are valid', 
      'Representation': 'Temporal qualifiers on assertions', 
      'Best For': 'Time-sensitive information, historical data', 
      'Implementation': 'Temporal RDF, temporal property graphs' 
    },
    { 
      'Approach': 'Possible World Semantics', 
      'Description': 'Model alternative realities or scenarios', 
      'Representation': 'Multiple graph versions/branches', 
      'Best For': 'Scenario planning, alternate explanations', 
      'Implementation': 'Hypothetical graphs, branch management' 
    }
  ]
};

/**
 * Root Cause Analysis Introduction Slide
 */
const rcaIntroductionSlide: SlideConfig = {
  id: 'rca-introduction',
  title: 'Knowledge Graphs for Root Cause Analysis',
  content: {
    definition: 'Root Cause Analysis (RCA) is a structured approach to identifying the fundamental causes of problems or incidents. Knowledge graphs excel at RCA by modeling complex causal relationships and enabling sophisticated traversal and inference.',
    keyPoints: [
      'Knowledge graphs naturally represent causal relationships in a structured, queryable form',
      'Multi-hop traversal capabilities reveal indirect causes and effects',
      'Integration of domain knowledge enhances causal reasoning',
      'Temporal modeling captures event sequences and timing relationships',
      'Semantic context provides rich background for analysis',
      'Pattern recognition across incidents identifies systemic issues',
      'Explainable reasoning shows the path from symptoms to causes'
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that knowledge graphs provide a powerful framework for RCA by unifying data and domain knowledge in a connected model that matches how people think about causality. Unlike simpler graph representations, knowledge graphs incorporate semantics, properties, and inference capabilities essential for sophisticated cause-effect analysis.'
};

/**
 * Causal Modeling Slide
 */
const causalModelingSlide: SlideConfig = {
  id: 'causal-modeling',
  title: 'Causal Modeling in Knowledge Graphs',
  content: {
    definition: 'Causal modeling in knowledge graphs involves explicitly representing cause-effect relationships with appropriate semantics, properties, and temporal context.',
    keyPoints: [
      'Explicit cause-effect relationship types with semantics',
      'Classification of causes: root, proximate, contributing, etc.',
      'Temporal properties capturing event sequences and timing',
      'Quantification of causal strength and confidence',
      'Incorporation of domain knowledge and rules',
      'Distinction between correlation and causation',
      'Integration with causal inference techniques'
    ],
    codeSnippets: [
      {
        language: 'turtle',
        caption: 'Example causal relationship representation in RDF',
        code: `@prefix ex: <http://example.org/> .
@prefix causal: <http://example.org/causal/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# Define incident
ex:Incident123 a causal:Incident ;
  causal:description "Service outage on May 15, 2023" ;
  causal:startTime "2023-05-15T14:23:05"^^xsd:dateTime ;
  causal:duration "PT47M"^^xsd:duration ;
  causal:impact "High" .

# Define cause entities
ex:DBOverload a causal:DirectCause ;
  causal:description "Database Overload" ;
  causal:system "Primary DB Cluster" ;
  causal:detectedAt "2023-05-15T14:23:05"^^xsd:dateTime .

ex:APISpike a causal:RootCause ;
  causal:description "API Request Spike" ;
  causal:volume "10x normal" ;
  causal:source "Mobile App" .

# Define causal relationships
ex:DBOverload causal:caused ex:Incident123 ;
  causal:confidenceScore "0.95"^^xsd:decimal ;
  causal:evidenceType "Monitoring Alert" .

ex:APISpike causal:caused ex:DBOverload ;
  causal:confidenceScore "0.85"^^xsd:decimal ;
  causal:evidenceType "Log Analysis" .`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Highlight that effective causal modeling goes beyond simply connecting entities with "caused" relationships. Rich semantics, classification of cause types, temporal information, and confidence scoring are essential for sophisticated analysis.'
};

/**
 * Incident Analysis Slide
 */
const incidentAnalysisSlide: SlideConfig = {
  id: 'incident-analysis',
  title: 'IT Incident Analysis with Knowledge Graphs',
  content: {
    definition: 'Knowledge graphs enable sophisticated analysis of IT incidents by modeling the complex relationships between systems, events, and contributing factors.',
    keyPoints: [
      'Capture complex dependencies between systems and components',
      'Model incident timelines with precise temporal relationships',
      'Integrate monitoring data, logs, and human observations',
      'Traverse impact paths to identify affected services',
      'Identify common patterns across multiple incidents',
      'Support both real-time diagnosis and post-mortem analysis',
      'Enable knowledge retention and learning from past incidents'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: incidentCausalGraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    highlightNodes: ['cause4', 'cause6'],
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'Explain that the graph shows an example incident analysis for a service outage. Note how the knowledge graph captures both direct causes (database overload) and root causes (API spike and missing index), along with the relationship to the resolution that addressed the problem.'
};

/**
 * Manufacturing Defect Analysis Slide
 */
const manufacturingDefectSlide: SlideConfig = {
  id: 'manufacturing-defect-analysis',
  title: 'Manufacturing Defect Analysis',
  content: {
    definition: 'Knowledge graphs support manufacturing quality analysis by connecting defects to processes, materials, equipment, and environmental factors in a unified causal model.',
    keyPoints: [
      'Trace defect causality through complex manufacturing processes',
      'Connect quality data with equipment, materials, and process parameters',
      'Model interactions between multiple contributing factors',
      'Integrate with IoT sensor data and time series measurements',
      'Support both reactive analysis and predictive quality control',
      'Enable cross-functional collaboration in quality investigation',
      'Build knowledge base of known defect patterns and solutions'
    ]
  },
  visualizationType: 'graph',
  visualizationConfig: {
    data: manufacturingCausalGraphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 120,
      nodeOverlap: 20,
      padding: 30
    },
    highlightNodes: ['cause4', 'cause5', 'resolution1', 'resolution2'],
    nodeTooltips: true,
    edgeTooltips: true
  },
  transition: 'slide',
  notes: 'This example shows how a knowledge graph captures the multiple factors contributing to a product defect in manufacturing. Note how it distinguishes between direct causes, root causes, and systemic factors, while connecting to the resolutions implemented to address specific causes.'
};

/**
 * Causal Inference Techniques Slide
 */
const causalInferenceSlide: SlideConfig = {
  id: 'causal-inference',
  title: 'Causal Inference Techniques',
  content: {
    definition: 'Knowledge graphs can be integrated with various causal inference techniques to enable more rigorous cause-effect analysis beyond simple correlation.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: causalInferenceData.headers,
    rows: causalInferenceData.rows,
    caption: 'Causal inference techniques and their integration with knowledge graphs',
    sortable: true
  },
  transition: 'fade',
  notes: 'Emphasize that these techniques complement knowledge graphs by providing formal mathematical frameworks for causal reasoning, while knowledge graphs provide the structured knowledge representation. The combination is powerful for both explaining past incidents and predicting potential future issues.'
};

/**
 * RCA Methodologies Slide
 */
const rcaMethodologiesSlide: SlideConfig = {
  id: 'rca-methodologies',
  title: 'RCA Methodologies and Knowledge Graphs',
  content: {
    definition: 'Traditional root cause analysis methodologies can be enhanced and formalized using knowledge graph representations and query capabilities.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: rcaMethodologiesData.headers,
    rows: rcaMethodologiesData.rows,
    caption: 'Root cause analysis methodologies with knowledge graph applications',
    sortable: true
  },
  transition: 'slide',
  notes: 'Highlight that knowledge graphs don\'t replace these methodologies but rather formalize and enhance them by providing a consistent knowledge representation. This allows organizations to systematically capture and reuse causal knowledge across incidents and teams.'
};

/**
 * Temporal Knowledge Graphs Slide
 */
const temporalKnowledgeGraphsSlide: SlideConfig = {
  id: 'temporal-knowledge-graphs',
  title: 'Temporal Knowledge Graphs for RCA',
  content: {
    definition: 'Temporal knowledge graphs extend the standard knowledge graph model with time dimensions, enabling representation of evolving relationships and event sequences crucial for causal analysis.',
    keyPoints: [
      'Timestamp or interval annotation on entities and relationships',
      'Explicit representation of events and their temporal order',
      'Causal ordering and temporal precedence constraints',
      'Time-aware traversal and query capabilities',
      'Versioning to capture knowledge graph evolution',
      'Temporal reasoning to infer potential causal connections',
      'Time-series data integration for continuous monitoring'
    ],
    codeSnippets: [
      {
        language: 'sparql',
        caption: 'Temporal query in SPARQL',
        code: `PREFIX ex: <http://example.org/> 
PREFIX temporal: <http://example.org/temporal/> 

# Find all events preceding an incident within 30 minutes
SELECT ?event ?eventTime ?description
WHERE {
  # The incident of interest
  ex:Incident123 temporal:occuredAt ?incidentTime .
  
  # Events preceding the incident
  ?event a temporal:Event ;
         temporal:occuredAt ?eventTime ;
         temporal:description ?description .
  
  # Temporal filter for events within 30 minutes before the incident
  FILTER (?eventTime < ?incidentTime &&
          ?incidentTime - ?eventTime <= "PT30M"^^xsd:duration)
}
ORDER BY DESC(?eventTime)`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that temporal aspects are crucial for causal analysis since cause must precede effect. Temporal knowledge graphs explicitly model time, enabling more sophisticated analysis of event sequences and potential causality based on temporal relationships.'
};

/**
 * Time Series Integration Slide
 */
const timeSeriesIntegrationSlide: SlideConfig = {
  id: 'time-series-integration',
  title: 'Integrating Knowledge Graphs with Time Series Data',
  content: {
    definition: 'Effective root cause analysis often requires combining knowledge graph representations with time series data from monitoring systems, sensors, and log analytics.',
    keyPoints: [
      'Time series databases store numeric measurements over time',
      'Knowledge graphs provide semantic context for these measurements',
      'Entity resolution links events to knowledge graph entities',
      'Anomaly detection identifies potential incident triggers',
      'Causal analysis correlates events across systems',
      'Graph enrichment adds discovered causes to the knowledge base',
      'Unified querying across knowledge graph and time series data'
    ]
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: timeSeriesIntegrationData.nodes,
    edges: timeSeriesIntegrationData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Explain that many root cause analysis scenarios involve a combination of structured knowledge (in the knowledge graph) and temporal measurements (in time series databases). Effective architectures must integrate these to provide a complete picture for causal reasoning.'
};

/**
 * Uncertainty Representation Slide
 */
const uncertaintyRepresentationSlide: SlideConfig = {
  id: 'uncertainty-representation',
  title: 'Representing Uncertainty in Causal Knowledge',
  content: {
    definition: 'Causal knowledge often involves uncertainty about relationships, strengths, and confidence levels, which must be modeled explicitly in knowledge graphs.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: uncertaintyRepresentationData.headers,
    rows: uncertaintyRepresentationData.rows,
    caption: 'Approaches for representing uncertainty in knowledge graphs',
    sortable: true
  },
  transition: 'fade',
  notes: 'Emphasize that representing uncertainty is crucial for realistic causal models, especially when combining evidence from multiple sources or when using automated inference techniques. Different approaches have trade-offs in terms of expressivity, computational complexity, and ease of interpretation.'
};

/**
 * Query Patterns for RCA Slide
 */
const queryPatternsSlide: SlideConfig = {
  id: 'query-patterns-rca',
  title: 'Knowledge Graph Query Patterns for RCA',
  content: {
    definition: 'Effective root cause analysis with knowledge graphs requires specialized query patterns to traverse causal chains, analyze temporal relationships, and assess contributing factors.',
    keyPoints: [
      'Backward chaining: Trace from symptoms to potential root causes',
      'Forward impact analysis: Identify affected components from a cause',
      'Common cause detection: Find shared causes across multiple incidents',
      'Temporal sequence analysis: Examine event chains with timing',
      'Counterfactual queries: Explore "what if" scenarios',
      'Similarity analysis: Compare incidents with similar characteristics',
      'Pattern mining: Discover recurring causal patterns'
    ],
    codeSnippets: [
      {
        language: 'cypher',
        caption: 'Query patterns in Cypher',
        code: `// Backward chaining to root causes (max 4 levels)
MATCH path = (symptom:Symptom {id: "ConnectionFailure"})<-[:CAUSED*1..4]-(cause)
WHERE NOT (:Cause)-[:CAUSED]->(cause)
RETURN cause.name, [rel in relationships(path) | type(rel)] as causality_chain

// Common cause analysis across incidents
MATCH (incident:Incident)
MATCH (incident)<-[:CAUSED]-(:DirectCause)<-[:CAUSED*1..3]-(root_cause:RootCause)
RETURN root_cause.name, count(distinct incident) as incident_count
ORDER BY incident_count DESC

// Temporal sequence before incident
MATCH (incident:Incident {id: "Outage123"})
MATCH (event:Event)
WHERE event.timestamp > (incident.timestamp - duration("PT1H"))
  AND event.timestamp < incident.timestamp
RETURN event.name, event.timestamp, event.severity
ORDER BY event.timestamp DESC`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that these query patterns represent common analytical approaches in root cause analysis. Knowledge graphs enable these patterns to be expressed as traversals through the causal network, providing both flexibility and structure to the analysis process.'
};

/**
 * Automated RCA Slide
 */
const automatedRcaSlide: SlideConfig = {
  id: 'automated-rca',
  title: 'Automated Root Cause Analysis',
  content: {
    definition: 'Knowledge graphs provide a foundation for automated root cause analysis systems that combine machine learning, graph algorithms, and domain knowledge.',
    keyPoints: [
      'Graph algorithms identify potential causal paths',
      'Machine learning ranks likely causes based on historical patterns',
      'Semantic reasoners apply domain rules and constraints',
      'Natural language processing extracts causal relationships from documents',
      'Decision support systems guide human analysts',
      'Feedback loops improve accuracy over time',
      'Explainable AI techniques provide rationale for suggested causes'
    ],
    listItems: [
      {
        title: 'Key Algorithms for Automated RCA',
        items: [
          'Causal path ranking: Score potential causal chains by probability',
          'Anomaly detection: Identify unusual patterns or deviations',
          'Graph neural networks: Learn to classify cause-effect patterns',
          'Similarity search: Find comparable past incidents and their causes',
          'Temporal pattern matching: Identify sequences preceding failures',
          'Causal Bayesian networks: Model probabilistic cause-effect relationships',
          'Decision trees: Classify incidents based on attributes and factors'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that automated RCA doesn\'t eliminate human judgment but rather augments it by processing vast amounts of data and suggesting likely causes. Knowledge graphs provide the semantic foundation that makes automated suggestions more meaningful and explainable.'
};

/**
 * Cross-Domain Causality Slide
 */
const crossDomainCausalitySlide: SlideConfig = {
  id: 'cross-domain-causality',
  title: 'Cross-Domain Causality Analysis',
  content: {
    definition: 'Knowledge graphs excel at revealing causal relationships that span across traditional domain boundaries, providing insights that siloed analysis would miss.',
    keyPoints: [
      'Connect seemingly unrelated factors from different domains',
      'Bridge organization silos through unified knowledge representation',
      'Reveal indirect causal paths spanning multiple systems',
      'Integrate domain-specific terminology and concepts',
      'Apply domain-specific causal models within a unified framework',
      'Enable collaboration across teams with different expertise',
      'Support multi-perspective analysis of complex problems'
    ],
    listItems: [
      {
        title: 'Cross-Domain RCA Examples',
        items: [
          'IT incidents with business process impacts and financial consequences',
          'Manufacturing defects traced to supply chain issues and market pressures',
          'Customer experience problems linked to technical, operational, and policy factors',
          'Product development decisions affecting quality outcomes and customer satisfaction',
          'Infrastructure failures with environmental, operational, and maintenance causes',
          'Healthcare adverse events spanning clinical, administrative, and technical domains',
          'Financial losses stemming from technology, human factors, and external events'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Highlight that many significant problems span traditional organizational boundaries, and knowledge graphs are uniquely suited to represent these cross-domain relationships. This capability enables holistic analysis that can reveal systemic issues and complex causal chains that might otherwise be missed.'
};

/**
 * RCA Metrics and Benefits Slide
 */
const rcaMetricsSlide: SlideConfig = {
  id: 'rca-metrics-benefits',
  title: 'RCA Metrics and Business Benefits',
  content: {
    definition: 'Knowledge graph-based root cause analysis delivers measurable improvements in incident resolution, problem prevention, and operational efficiency.',
    keyPoints: [
      'Reduced mean time to resolution (MTTR) for incidents',
      'Decreased incident recurrence through effective remediation',
      'Improved accuracy of cause identification',
      'Enhanced collaboration across technical and business teams',
      'Better prioritization of preventive measures based on impact',
      'Increased knowledge retention and reuse across incidents',
      'More effective resource allocation for systemic improvements'
    ],
    listItems: [
      {
        title: 'Key Performance Indicators',
        items: [
          'Time to identify root cause: 40-60% reduction typical',
          'Incident recurrence rate: 30-50% reduction observed',
          'False cause identification: Decreased by 35-45%',
          'Cross-team collaboration: 25-40% improvement in effective resolution',
          'Resolution efficiency: 15-30% labor cost reduction',
          'Knowledge reuse: 50-70% of new incidents match known patterns',
          'Customer impact: 20-35% reduction in outage duration'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that knowledge graph-based RCA delivers tangible business benefits beyond technical improvements. These metrics help justify investment in knowledge graph technology by connecting it to operational efficiency, cost reduction, and improved service quality.'
};

/**
 * RCA slide group configuration
 */
export const rcaSlideGroup: SlideGroup = {
  title: 'Root Cause Analysis with Knowledge Graphs',
  id: 'rca',
  includeSectionSlide: true,
  slides: [
    rcaIntroductionSlide,
    causalModelingSlide,
    incidentAnalysisSlide,
    manufacturingDefectSlide,
    causalInferenceSlide,
    rcaMethodologiesSlide,
    temporalKnowledgeGraphsSlide,
    timeSeriesIntegrationSlide,
    uncertaintyRepresentationSlide,
    queryPatternsSlide,
    automatedRcaSlide,
    crossDomainCausalitySlide,
    rcaMetricsSlide
  ]
};

/**
 * RCA slides module
 */
export const rcaSlides = rcaSlideGroup.slides;