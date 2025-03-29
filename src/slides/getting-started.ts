/**
 * Implementation Roadmap Slides Module
 * Defines slides covering the process of implementing knowledge graphs in organizations
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';

/**
 * Implementation phases diagram
 */
const implementationPhasesData = {
  nodes: [
    { id: 'phase1', label: 'Phase 1: Assessment & Planning', type: 'process' },
    { id: 'phase2', label: 'Phase 2: Proof of Concept', type: 'process' },
    { id: 'phase3', label: 'Phase 3: Initial Implementation', type: 'process' },
    { id: 'phase4', label: 'Phase 4: Scaling & Integration', type: 'process' },
    { id: 'phase5', label: 'Phase 5: Optimization & Evolution', type: 'process' },
    
    { id: 'req', label: 'Requirements Analysis', type: 'process', properties: { phase: 1 } },
    { id: 'use', label: 'Use Case Prioritization', type: 'process', properties: { phase: 1 } },
    { id: 'tech', label: 'Technology Selection', type: 'process', properties: { phase: 1 } },
    
    { id: 'scope', label: 'Define Limited Scope', type: 'process', properties: { phase: 2 } },
    { id: 'model', label: 'Develop Initial Model', type: 'process', properties: { phase: 2 } },
    { id: 'poc', label: 'Build POC', type: 'process', properties: { phase: 2 } },
    
    { id: 'ontology', label: 'Ontology Development', type: 'process', properties: { phase: 3 } },
    { id: 'etl', label: 'ETL Pipeline Creation', type: 'process', properties: { phase: 3 } },
    { id: 'app', label: 'Application Development', type: 'process', properties: { phase: 3 } },
    
    { id: 'data', label: 'Data Source Expansion', type: 'process', properties: { phase: 4 } },
    { id: 'perf', label: 'Performance Tuning', type: 'process', properties: { phase: 4 } },
    { id: 'api', label: 'API Development', type: 'process', properties: { phase: 4 } },
    
    { id: 'monitor', label: 'Monitoring & Analytics', type: 'process', properties: { phase: 5 } },
    { id: 'gov', label: 'Governance Implementation', type: 'process', properties: { phase: 5 } },
    { id: 'enrich', label: 'Continuous Enrichment', type: 'process', properties: { phase: 5 } }
  ],
  edges: [
    { from: 'phase1', to: 'phase2' },
    { from: 'phase2', to: 'phase3' },
    { from: 'phase3', to: 'phase4' },
    { from: 'phase4', to: 'phase5' },
    
    { from: 'phase1', to: 'req' },
    { from: 'phase1', to: 'use' },
    { from: 'phase1', to: 'tech' },
    
    { from: 'phase2', to: 'scope' },
    { from: 'phase2', to: 'model' },
    { from: 'phase2', to: 'poc' },
    
    { from: 'phase3', to: 'ontology' },
    { from: 'phase3', to: 'etl' },
    { from: 'phase3', to: 'app' },
    
    { from: 'phase4', to: 'data' },
    { from: 'phase4', to: 'perf' },
    { from: 'phase4', to: 'api' },
    
    { from: 'phase5', to: 'monitor' },
    { from: 'phase5', to: 'gov' },
    { from: 'phase5', to: 'enrich' },
    
    { from: 'use', to: 'scope' },
    { from: 'tech', to: 'poc' },
    { from: 'model', to: 'ontology' },
    { from: 'poc', to: 'etl' },
    { from: 'etl', to: 'data' },
    { from: 'app', to: 'api' },
    { from: 'api', to: 'monitor' },
    { from: 'data', to: 'enrich' }
  ]
};

/**
 * Technology selection criteria
 */
const techSelectionData = {
  headers: ['Criteria', 'Description', 'Considerations', 'Weight'],
  rows: [
    { 
      'Criteria': 'Data Model', 
      'Description': 'Support for appropriate graph model (RDF, property graph)', 
      'Considerations': 'Domain requirements, integration needs, flexibility needs', 
      'Weight': 'High' 
    },
    { 
      'Criteria': 'Query Capabilities', 
      'Description': 'Expressiveness and performance of query language', 
      'Considerations': 'Query complexity, traversal depth, analytical needs', 
      'Weight': 'High' 
    },
    { 
      'Criteria': 'Scalability', 
      'Description': 'Ability to handle projected data volume and query load', 
      'Considerations': 'Node/edge count, query concurrency, growth projections', 
      'Weight': 'High' 
    },
    { 
      'Criteria': 'Integration', 
      'Description': 'Connectivity with existing data sources and systems', 
      'Considerations': 'Data formats, APIs, messaging systems, ETL tools', 
      'Weight': 'Medium' 
    },
    { 
      'Criteria': 'Inference', 
      'Description': 'Support for reasoning and inference capabilities', 
      'Considerations': 'Ontology complexity, rule requirements, real-time needs', 
      'Weight': 'Medium' 
    },
    { 
      'Criteria': 'Visualization', 
      'Description': 'Built-in capabilities for graph visualization', 
      'Considerations': 'User roles, exploration needs, dashboard requirements', 
      'Weight': 'Medium' 
    },
    { 
      'Criteria': 'Ecosystem', 
      'Description': 'Available tools, libraries, and community support', 
      'Considerations': 'Development resources, expertise availability, support needs', 
      'Weight': 'Medium' 
    },
    { 
      'Criteria': 'Total Cost', 
      'Description': 'License, infrastructure, and operational costs', 
      'Considerations': 'Budget constraints, TCO calculations, ROI projections', 
      'Weight': 'Medium' 
    },
    { 
      'Criteria': 'Security', 
      'Description': 'Authentication, authorization, and data protection', 
      'Considerations': 'Compliance requirements, data sensitivity, access control model', 
      'Weight': 'High' 
    },
    { 
      'Criteria': 'Deployment', 
      'Description': 'Deployment options and operational requirements', 
      'Considerations': 'Cloud vs. on-premises, containerization, DevOps integration', 
      'Weight': 'Medium' 
    }
  ]
};

/**
 * Team roles for KG implementation
 */
const teamRolesData = {
  headers: ['Role', 'Responsibilities', 'Skills Required', 'When Needed'],
  rows: [
    { 
      'Role': 'Knowledge Architect', 
      'Responsibilities': 'Ontology design, schema modeling, domain modeling', 
      'Skills Required': 'Semantic modeling, domain expertise, knowledge engineering', 
      'When Needed': 'All phases' 
    },
    { 
      'Role': 'Data Engineer', 
      'Responsibilities': 'ETL pipeline development, data integration, quality assurance', 
      'Skills Required': 'ETL tools, data processing, database systems', 
      'When Needed': 'Phase 2-5' 
    },
    { 
      'Role': 'Graph Database Developer', 
      'Responsibilities': 'Query development, performance optimization, database management', 
      'Skills Required': 'SPARQL/Cypher/Gremlin, graph algorithms, index optimization', 
      'When Needed': 'Phase 2-5' 
    },
    { 
      'Role': 'Application Developer', 
      'Responsibilities': 'Frontend/API development, visualization creation, integration', 
      'Skills Required': 'Web development, API design, visualization libraries', 
      'When Needed': 'Phase 3-5' 
    },
    { 
      'Role': 'Domain Expert', 
      'Responsibilities': 'Domain knowledge validation, use case definition, acceptance testing', 
      'Skills Required': 'Subject matter expertise, requirements analysis', 
      'When Needed': 'Phase 1-3, intermittent' 
    },
    { 
      'Role': 'Data Scientist', 
      'Responsibilities': 'Analytical modeling, entity extraction, graph analytics', 
      'Skills Required': 'ML/NLP, statistical analysis, graph algorithms', 
      'When Needed': 'Phase 2-5' 
    },
    { 
      'Role': 'Product Owner', 
      'Responsibilities': 'Feature prioritization, stakeholder management, roadmap planning', 
      'Skills Required': 'Product management, business analysis, agile methodologies', 
      'When Needed': 'All phases' 
    },
    { 
      'Role': 'DevOps Engineer', 
      'Responsibilities': 'Deployment automation, monitoring, scaling, backup', 
      'Skills Required': 'Infrastructure management, CI/CD, container orchestration', 
      'When Needed': 'Phase 3-5' 
    }
  ]
};

/**
 * Common implementation challenges
 */
const implementationChallengesData = {
  headers: ['Challenge', 'Description', 'Mitigation Strategy'],
  rows: [
    { 
      'Challenge': 'Data Quality & Integration', 
      'Description': 'Inconsistent, incomplete or siloed source data makes knowledge graph population difficult', 
      'Mitigation Strategy': 'Data profiling, cleansing pipelines, source system SME involvement, incremental quality improvement' 
    },
    { 
      'Challenge': 'Schema Complexity', 
      'Description': 'Overly complex or rigid schemas that are difficult to evolve and maintain', 
      'Mitigation Strategy': 'Iterative schema development, schema-on-read approaches, ontology modularization, domain-driven design' 
    },
    { 
      'Challenge': 'Performance at Scale', 
      'Description': 'Query performance degradation as graph size and complexity increases', 
      'Mitigation Strategy': 'Appropriate indexing, query optimization, data partitioning, caching strategies, workload-specific replicas' 
    },
    { 
      'Challenge': 'Stakeholder Alignment', 
      'Description': 'Difficulty in aligning different departments on ontology, priorities, and governance', 
      'Mitigation Strategy': 'Cross-functional working groups, ontology visualization, concrete use cases, executive sponsorship' 
    },
    { 
      'Challenge': 'Technical Expertise', 
      'Description': 'Shortage of graph database and ontology modeling expertise', 
      'Mitigation Strategy': 'Training programs, external consultants, starting with small expert team, knowledge transfer practices' 
    },
    { 
      'Challenge': 'ROI Demonstration', 
      'Description': 'Difficulty in quantifying value and showing early wins', 
      'Mitigation Strategy': 'Metrics definition, phased implementation, showcase quick wins, business-centric use cases first' 
    },
    { 
      'Challenge': 'Integration Complexity', 
      'Description': 'Challenges in integrating with existing systems and workflows', 
      'Mitigation Strategy': 'API-first approach, façade pattern, gradual integration, compatibility layers' 
    },
    { 
      'Challenge': 'Governance & Maintenance', 
      'Description': 'Unclear ownership, update processes, and quality standards', 
      'Mitigation Strategy': 'Define governance framework early, automated validation, clear ownership model, monitoring tools' 
    }
  ]
};

/**
 * Implementation ROI metrics
 */
const roiMetricsData = {
  headers: ['Metric Category', 'Specific Metrics', 'Measurement Approach', 'Typical Timeline'],
  rows: [
    { 
      'Metric Category': 'Operational Efficiency', 
      'Specific Metrics': 'Query time reduction, integration effort reduction, data update time', 
      'Measurement Approach': 'Before/after timing comparisons, developer time tracking', 
      'Typical Timeline': 'Short-term (1-3 months)' 
    },
    { 
      'Metric Category': 'Search & Discovery', 
      'Specific Metrics': 'Search relevance, time to find information, successful search rate', 
      'Measurement Approach': 'User testing, search log analysis, satisfaction surveys', 
      'Typical Timeline': 'Short-term (1-3 months)' 
    },
    { 
      'Metric Category': 'Decision Support', 
      'Specific Metrics': 'Time to insight, decision accuracy, data consolidation time', 
      'Measurement Approach': 'User interviews, process timing, outcome tracking', 
      'Typical Timeline': 'Medium-term (3-6 months)' 
    },
    { 
      'Metric Category': 'Innovation', 
      'Specific Metrics': 'New connections identified, ideas generated, innovation cycle time', 
      'Measurement Approach': 'Innovation tracking, path analysis, new product metrics', 
      'Typical Timeline': 'Long-term (6-12 months)' 
    },
    { 
      'Metric Category': 'Risk Reduction', 
      'Specific Metrics': 'Compliance issues identified, fraud detection rate, error reduction', 
      'Measurement Approach': 'Incident tracking, pattern detection effectiveness, audit results', 
      'Typical Timeline': 'Medium-term (3-6 months)' 
    },
    { 
      'Metric Category': 'User Experience', 
      'Specific Metrics': 'Adoption rate, feature usage, user satisfaction scores', 
      'Measurement Approach': 'Usage analytics, NPS scores, feature tracking', 
      'Typical Timeline': 'Short to medium-term (1-6 months)' 
    },
    { 
      'Metric Category': 'Data Asset Value', 
      'Specific Metrics': 'Data reuse rate, integration cost savings, maintenance cost reduction', 
      'Measurement Approach': 'Usage tracking, cost modeling, data service metrics', 
      'Typical Timeline': 'Long-term (6-12+ months)' 
    },
    { 
      'Metric Category': 'Business Outcomes', 
      'Specific Metrics': 'Revenue impact, cost reduction, time-to-market improvement', 
      'Measurement Approach': 'Financial analysis, A/B testing, process metrics', 
      'Typical Timeline': 'Long-term (12+ months)' 
    }
  ]
};

/**
 * Implementation Approach Slide
 */
const implementationApproachSlide: SlideConfig = {
  id: 'implementation-approach',
  title: 'Knowledge Graph Implementation Approach',
  content: {
    definition: 'Implementing a knowledge graph in an organization requires a phased approach that balances immediate value delivery with long-term architecture sustainability.',
    keyPoints: [
      'Start with high-value, well-defined use cases rather than attempting a complete enterprise model',
      'Adopt an iterative, agile methodology with regular stakeholder validation',
      'Balance top-down ontology design with bottom-up data integration',
      'Prioritize data connectivity over perfection in early stages',
      'Build for extensibility from the beginning, even in limited pilots',
      'Consider beginning with a managed service to reduce initial infrastructure complexity',
      'Establish governance processes early, even if lightweight'
    ],
    listItems: [
      {
        title: 'Implementation Philosophies',
        items: [
          'Schema-first: Design comprehensive ontology before data integration',
          'Data-first: Extract entities from existing data then formalize the schema',
          'Hybrid approach: Iteratively develop schema while integrating priority data',
          'Use case-driven: Let specific business needs drive implementation priorities',
          'Domain-driven: Organize around business domains with bounded contexts'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that successful implementations typically start small but think big. The hybrid, use case-driven approach often yields the best results by balancing immediate value with strategic architecture.'
};

/**
 * Implementation Phases Slide
 */
const implementationPhasesSlide: SlideConfig = {
  id: 'implementation-phases',
  title: 'Implementation Phases',
  content: {
    definition: 'Knowledge graph implementations typically progress through several phases, from initial planning to enterprise-scale deployment and optimization.',
  },
  visualizationType: 'flowDiagram',
  visualizationConfig: {
    nodes: implementationPhasesData.nodes,
    edges: implementationPhasesData.edges,
    direction: 'TB',
    autoLayout: true
  },
  transition: 'slide',
  notes: 'Explain that while these phases often occur sequentially, there can be significant overlap and iteration between them. The key is to ensure each phase builds on the success of the previous one while incorporating feedback and lessons learned.'
};

/**
 * Technology Selection Slide
 */
const technologySelectionSlide: SlideConfig = {
  id: 'technology-selection',
  title: 'Technology Selection Criteria',
  content: {
    definition: 'Selecting appropriate technology for a knowledge graph implementation requires evaluating multiple criteria against specific organizational requirements and constraints.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: techSelectionData.headers,
    rows: techSelectionData.rows,
    caption: 'Knowledge graph technology selection criteria',
    sortable: true
  },
  transition: 'fade',
  notes: 'Emphasize that technology selection should be driven by use case requirements rather than trends. Encourage proof of concept testing with actual data and queries when evaluating options.'
};

/**
 * Assessment Phase Slide
 */
const assessmentPhaseSlide: SlideConfig = {
  id: 'assessment-phase',
  title: 'Phase 1: Assessment & Planning',
  content: {
    definition: 'The initial phase establishes the foundation for knowledge graph implementation by understanding requirements, prioritizing use cases, and planning the technical approach.',
    keyPoints: [
      'Business requirements gathering and prioritization',
      'Data landscape assessment and source system inventory',
      'Use case definition and value proposition analysis',
      'Stakeholder identification and engagement strategy',
      'Preliminary ontology and data model scoping',
      'Technology evaluation and selection',
      'Resource planning and team composition',
      'Initial roadmap and success metrics definition'
    ],
    listItems: [
      {
        title: 'Key Deliverables',
        items: [
          'Business requirements document',
          'Prioritized use case inventory',
          'Data source inventory and quality assessment',
          'Preliminary technology selection',
          'Implementation roadmap and phasing plan',
          'Success metrics and KPIs',
          'Resource and budget plan',
          'Risk assessment and mitigation strategy'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Stress that thorough assessment is critical for success but should be time-boxed to avoid analysis paralysis. The goal is to gather enough information to make informed decisions while maintaining momentum.'
};

/**
 * Proof of Concept Slide
 */
const proofOfConceptSlide: SlideConfig = {
  id: 'proof-of-concept',
  title: 'Phase 2: Proof of Concept',
  content: {
    definition: 'A focused proof of concept demonstrates the viability of the knowledge graph approach for a specific use case, validating technical assumptions and building stakeholder support.',
    keyPoints: [
      'Select a specific, high-value use case with manageable scope',
      'Develop a simplified ontology/schema covering the POC domain',
      'Implement basic data ingestion from a limited set of sources',
      'Create a minimal viable query interface or application',
      'Demonstrate key differentiating capabilities of graph technology',
      'Validate assumptions about data quality and integration challenges',
      'Measure against predefined success criteria',
      'Gather feedback from stakeholders and potential users'
    ],
    listItems: [
      {
        title: 'POC Success Criteria',
        items: [
          'Technical feasibility: Can the solution be built as envisioned?',
          'Performance validation: Does the solution meet performance requirements?',
          'Integration viability: Can source systems be integrated effectively?',
          'User acceptance: Do stakeholders see value in the solution?',
          'Resource estimation: Are initial resource estimates accurate?',
          'Risk identification: What challenges emerged during the POC?',
          'Business value: Does the solution deliver expected benefits?',
          'Path to production: Is there a clear path to operationalize the solution?'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Emphasize that the POC should be limited in scope but representative of real-world conditions. It should provide concrete evidence of both technical feasibility and business value to secure support for further development.'
};

/**
 * Initial Implementation Slide
 */
const initialImplementationSlide: SlideConfig = {
  id: 'initial-implementation',
  title: 'Phase 3: Initial Implementation',
  content: {
    definition: 'The initial implementation phase builds on POC learnings to create a production-quality knowledge graph focused on priority use cases, with proper architecture and operational considerations.',
    keyPoints: [
      'Develop a comprehensive ontology/schema for the target domain',
      'Build robust data pipelines for scheduled and/or real-time updates',
      'Implement data quality validation and error handling',
      'Create initial user interfaces and/or APIs',
      'Establish monitoring and operational procedures',
      'Deploy to production environment with appropriate security',
      'Train users and support teams',
      'Define governance processes for ongoing maintenance'
    ],
    listItems: [
      {
        title: 'Technical Focus Areas',
        items: [
          'Data pipeline robustness and error handling',
          'Incremental update mechanisms',
          'Performance optimization for production workloads',
          'Security implementation (authentication, authorization)',
          'Monitoring and alerting setup',
          'Backup and recovery procedures',
          'Documentation and knowledge transfer',
          'User interface refinement based on feedback'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that the transition from POC to initial implementation requires significant attention to production-quality concerns that may have been de-prioritized during the POC phase, particularly around robustness, security, and operational aspects.'
};

/**
 * Team Composition Slide
 */
const teamCompositionSlide: SlideConfig = {
  id: 'team-composition',
  title: 'Team Composition & Roles',
  content: {
    definition: 'Successful knowledge graph implementation requires a multidisciplinary team with a combination of technical, domain, and business expertise.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: teamRolesData.headers,
    rows: teamRolesData.rows,
    caption: 'Knowledge graph implementation team roles',
    sortable: true
  },
  transition: 'slide',
  notes: 'Emphasize that team composition may evolve across implementation phases, with different roles being more critical at different stages. For smaller organizations, individuals may need to fulfill multiple roles.'
};

/**
 * Scaling and Integration Slide
 */
const scalingIntegrationSlide: SlideConfig = {
  id: 'scaling-integration',
  title: 'Phase 4: Scaling & Integration',
  content: {
    definition: 'The scaling and integration phase expands the knowledge graph to incorporate additional data sources, use cases, and integration points while ensuring performance and reliability.',
    keyPoints: [
      'Expand data coverage to include additional domains and sources',
      'Enhance ontology to support new entity types and relationships',
      'Optimize performance for growing data volumes and query complexity',
      'Develop comprehensive API layer for application integration',
      'Implement advanced features like inference and analytics',
      'Integrate with enterprise systems and workflows',
      'Scale infrastructure to support increased load',
      'Enhance security and access control for broader usage'
    ],
    listItems: [
      {
        title: 'Integration Approaches',
        items: [
          'API Gateway: Unified access layer for knowledge graph services',
          'Event-driven: Publish updates to message buses for subscribers',
          'ETL/ELT: Regular extraction and loading into target systems',
          'Virtualization: Federated queries across knowledge graph and other systems',
          'Microservices: Specialized knowledge services for different domains',
          'Embedded: Knowledge components within larger applications',
          'Data fabric: Knowledge graph as central component of data ecosystem'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Highlight that scaling is not just about handling larger data volumes but also about expanding the scope, user base, and integration points while maintaining performance and reliability.'
};

/**
 * Implementation Challenges Slide
 */
const implementationChallengesSlide: SlideConfig = {
  id: 'implementation-challenges',
  title: 'Common Implementation Challenges',
  content: {
    definition: 'Knowledge graph implementations face several common challenges that require proactive strategies and ongoing attention.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: implementationChallengesData.headers,
    rows: implementationChallengesData.rows,
    caption: 'Common knowledge graph implementation challenges and mitigation strategies',
    sortable: true
  },
  transition: 'slide',
  notes: 'Emphasize that anticipating these challenges and planning for them from the beginning is key to successful implementation. Most failed knowledge graph projects encounter several of these issues without adequate mitigation strategies.'
};

/**
 * Governance Framework Slide
 */
const governanceFrameworkSlide: SlideConfig = {
  id: 'governance-framework',
  title: 'Knowledge Graph Governance Framework',
  content: {
    definition: 'A governance framework ensures knowledge graph quality, consistency, and sustainability through defined roles, processes, and policies.',
    keyPoints: [
      'Ontology governance: Processes for schema changes and extensions',
      'Data quality governance: Standards, validation, and remediation processes',
      'Access governance: Policies for security, privacy, and usage rights',
      'Operational governance: Procedures for monitoring, maintenance, and incidents',
      'Development governance: Standards for extensions and integrations',
      'Organizational governance: Roles, responsibilities, and decision rights'
    ],
    listItems: [
      {
        title: 'Governance Components',
        items: [
          'Governance council: Cross-functional decision-making body',
          'Ontology/schema registry: Central repository of schema definitions',
          'Change management process: Workflow for updates and extensions',
          'Quality metrics: Quantitative measures of graph health',
          'Access control model: Framework for permissions and restrictions',
          'Audit mechanisms: Tracking of changes and access patterns',
          'Documentation standards: Requirements for schema and service documentation',
          'Training program: Knowledge transfer to maintain expertise'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Emphasize that governance should be right-sized for the organization and stage of implementation. Start with lightweight governance that addresses the most critical areas and evolve as the knowledge graph grows in scope and criticality.'
};

/**
 * Measuring ROI Slide
 */
const measuringRoiSlide: SlideConfig = {
  id: 'measuring-roi',
  title: 'Measuring Knowledge Graph ROI',
  content: {
    definition: 'Measuring return on investment for knowledge graph initiatives requires a multi-faceted approach that captures both direct and indirect benefits across different time horizons.',
  },
  visualizationType: 'table',
  visualizationConfig: {
    headers: roiMetricsData.headers,
    rows: roiMetricsData.rows,
    caption: 'Knowledge graph ROI measurement framework',
    sortable: true
  },
  transition: 'slide',
  notes: 'Highlight that ROI measurement should combine both quantitative metrics and qualitative assessments. Some of the most significant benefits may be hard to quantify directly but are nonetheless critical to capture and communicate to stakeholders.'
};

/**
 * Optimization and Evolution Slide
 */
const optimizationEvolutionSlide: SlideConfig = {
  id: 'optimization-evolution',
  title: 'Phase 5: Optimization & Evolution',
  content: {
    definition: 'The optimization and evolution phase focuses on continuous improvement, adaptation to changing requirements, and maximizing value from the knowledge graph investment.',
    keyPoints: [
      'Performance tuning based on usage patterns and pain points',
      'Schema evolution to accommodate new business requirements',
      'Knowledge enrichment through machine learning and inference',
      'User experience refinement based on feedback and analytics',
      'Integration with emerging technologies and data sources',
      'Operational optimization for reliability and efficiency',
      'Governance maturation with automated enforcement',
      'Skills development for both technical and business users'
    ],
    listItems: [
      {
        title: 'Evolution Strategies',
        items: [
          'Usage analytics: Track patterns to identify optimization opportunities',
          'Feedback loops: Systematic collection and analysis of user feedback',
          'Technology radar: Regular assessment of relevant technologies',
          'Technical debt management: Scheduled refactoring and upgrades',
          'Value assessment: Regular review of business impact and alignment',
          'Community building: Internal user community for knowledge sharing',
          'Experimentation framework: Structured approach to testing new ideas',
          'Capability roadmap: Long-term vision for knowledge graph evolution'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that knowledge graphs should be viewed as living systems that continuously evolve rather than projects with defined end states. The optimization and evolution phase is not a final phase but an ongoing process throughout the knowledge graph lifecycle.'
};

/**
 * Best Practices Slide
 */
const bestPracticesSlide: SlideConfig = {
  id: 'implementation-best-practices',
  title: 'Implementation Best Practices',
  content: {
    definition: 'Organizations that have successfully implemented knowledge graphs have identified several best practices that increase the likelihood of success and value realization.',
    keyPoints: [
      'Start with business value, not technology exploration',
      'Balance ambition with pragmatism in scope definition',
      'Build incrementally with regular value delivery',
      'Invest in data quality proportionate to its importance',
      'Prefer ontology evolution over upfront perfection',
      'Engage stakeholders throughout the process',
      'Ensure executive sponsorship for strategic initiatives',
      'Establish governance early but apply pragmatically'
    ],
    listItems: [
      {
        title: 'Technical Best Practices',
        items: [
          'Modularize ontologies to enable independent evolution',
          'Implement automated testing for data pipelines and queries',
          'Design for graceful degradation under load',
          'Establish clear versioning strategy for schema and APIs',
          'Document design decisions and trade-offs',
          'Build with standard patterns where possible',
          'Incorporate security from the beginning',
          'Create self-service tools for common tasks'
        ],
        type: 'bullet'
      },
      {
        title: 'Organizational Best Practices',
        items: [
          'Create cross-functional teams with diverse expertise',
          'Invest in knowledge transfer and skills development',
          'Communicate value and progress regularly',
          'Establish clear ownership and decision rights',
          'Balance central coordination with domain autonomy',
          'Create feedback mechanisms for continuous improvement',
          'Celebrate and publicize successes',
          'Connect knowledge graph initiatives to strategic objectives'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Emphasize that these best practices have emerged from both successful and failed implementations. While not all will apply to every scenario, they provide a valuable checklist for teams planning or executing knowledge graph initiatives.'
};

/**
 * Implementation roadmap slide group configuration
 */
export const gettingStartedSlideGroup: SlideGroup = {
  title: 'Knowledge Graph Implementation Roadmap',
  id: 'getting-started',
  includeSectionSlide: true,
  slides: [
    implementationApproachSlide,
    implementationPhasesSlide,
    assessmentPhaseSlide,
    technologySelectionSlide,
    proofOfConceptSlide,
    initialImplementationSlide,
    teamCompositionSlide,
    scalingIntegrationSlide,
    implementationChallengesSlide,
    governanceFrameworkSlide,
    measuringRoiSlide,
    optimizationEvolutionSlide,
    bestPracticesSlide
  ]
};

/**
 * Implementation roadmap slides module
 */
export const gettingStartedSlides = gettingStartedSlideGroup.slides;