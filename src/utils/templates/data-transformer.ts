// src/utils/templates/data-transformer.ts

import { DataTransformer } from './base-types';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

/**
 * Base implementation of DataTransformer with standard patterns
 */
export abstract class BaseDataTransformer implements DataTransformer {
  /**
   * Retrieves and transforms content with comprehensive error handling
   * @param contentId Content identifier in the registry
   * @param options Transformation options
   */
  public transformContent(contentId: string, options?: any): any {
    try {
      const rawContent = this.getContentFromRegistry(contentId);
      return this.transformContentImpl(rawContent, options);
    } catch (error) {
      return this.handleTransformationError(error as Error, contentId);
    }
  }
  
  /**
   * Standardized error handling with fallback content generation
   * @param error Error that occurred during transformation
   * @param contentId Content identifier that failed
   */
  public handleTransformationError(error: Error, contentId: string): any {
    console.error(`Transformation error for content "${contentId}":`, error);
    
    // Return fallback content structure
    return {
      error: true,
      message: `Failed to transform content: ${error.message}`,
      contentId,
      timestamp: new Date().toISOString(),
      // Provide default empty data structures for different content types
      examples: [],
      nodes: [],
      edges: [],
      events: [],
      triples: []
    };
  }
  
  /**
   * Protected registry access with error boundary
   * @param contentId Content identifier
   */
  protected getContentFromRegistry(contentId: string): any {
    try {
      // First try to get with native method
      return markdownContentRegistry.getContent(contentId);
    } catch (error) {
      // If that fails, use fallbacks for common content types
      const fallback = this.getDefaultContentForId(contentId);
      if (fallback !== null) {
        return fallback;
      }
      throw new Error(`Content not found: ${contentId}`);
    }
  }
  
  /**
   * Provides default content for known content IDs
   * @param contentId Content identifier
   * @returns Default content or null if no default exists
   */
  protected getDefaultContentForId(contentId: string): any {
    // Common data patterns for different content types
    const defaultContent: Record<string, any> = {
      // Intro module contents
      'intro-title': 'Introduction to Knowledge Graphs',
      'intro-definition': 'A knowledge graph is a structured representation of information that models real-world entities and their relationships in a graph format.',
      'concept-graph-data': {
        nodes: [
          { id: 'entities', label: 'Entities' },
          { id: 'relationships', label: 'Relationships' },
          { id: 'properties', label: 'Properties' }
        ]
      },
      'kg-evolution': 'Evolution of knowledge graph technology',
      'evolution-timeline-data': {
        events: [
          { year: 2012, event: 'Google Knowledge Graph introduced' },
          { year: 2015, event: 'Schema.org adoption increases' },
          { year: 2018, event: 'Enterprise knowledge graphs emerge' }
        ]
      },
      
      // Core components content
      'kg-components-overview': 'Knowledge graphs consist of three fundamental elements',
      'kg-components-graph': {
        nodes: [
          { id: 'entity', label: 'Entity' },
          { id: 'relationship', label: 'Relationship' },
          { id: 'property', label: 'Property' }
        ],
        edges: [
          { source: 'entity', target: 'relationship', label: 'connects through' },
          { source: 'entity', target: 'property', label: 'has' },
          { source: 'relationship', target: 'property', label: 'has' }
        ]
      },
      'kg-entity-types': 'Objects, concepts, or events with unique identities',
      'kg-entity-hierarchy': {
        root: { id: 'thing', label: 'Thing' },
        children: [
          { id: 'person', label: 'Person' },
          { id: 'place', label: 'Place' },
          { id: 'organization', label: 'Organization' }
        ]
      },
      'kg-relationship-types': 'Directed, typed connections between entities',
      'kg-relationship-examples': {
        examples: [
          { source: 'Person', relationship: 'WORKS_FOR', target: 'Organization' },
          { source: 'Person', relationship: 'KNOWS', target: 'Person' },
          { source: 'Organization', relationship: 'LOCATED_IN', target: 'Place' }
        ]
      },
      'kg-properties': 'Key-value pairs that describe characteristics of entities and relationships',
      'kg-property-examples': {
        examples: [
          { entity: 'Person', properties: ['name', 'age', 'email'] },
          { entity: 'Organization', properties: ['name', 'founded', 'industry'] }
        ]
      },
      
      // Data models content
      'kg-data-models-overview': 'Knowledge graphs can be implemented using different data models',
      'kg-rdf-model': 'The RDF model represents data as triples (subject, predicate, object)',
      'kg-rdf-example': {
        triples: [
          { subject: 'Person1', predicate: 'name', object: 'John Doe' },
          { subject: 'Person1', predicate: 'worksFor', object: 'Company1' },
          { subject: 'Company1', predicate: 'name', object: 'ACME Inc' }
        ]
      },
      'kg-property-graph-model': 'Property graphs use labeled nodes and edges with properties',
      'kg-property-graph-example': {
        nodes: [
          { id: 'p1', label: 'Person', properties: { name: 'John Doe' } },
          { id: 'c1', label: 'Company', properties: { name: 'ACME Inc' } }
        ],
        edges: [
          { source: 'p1', target: 'c1', label: 'WORKS_FOR', properties: { since: '2020' } }
        ]
      },
      'kg-model-comparison': 'Comparison between RDF and Property Graph models',
      'kg-model-examples': {
        examples: [
          {
            title: 'RDF Example',
            language: 'turtle',
            code: '@prefix ex: <http://example.org/> .\nex:Person1 ex:name "John Doe" .\nex:Person1 ex:worksFor ex:Company1 .\nex:Company1 ex:name "ACME Inc" .',
            highlights: [2, 3]
          },
          {
            title: 'Property Graph Example',
            language: 'cypher',
            code: 'CREATE (p:Person {name: "John Doe"})-[:WORKS_FOR {since: 2020}]->(c:Company {name: "ACME Inc"})',
            highlights: [1]
          }
        ]
      },
      'kg-model-selection': {
        title: 'Model Selection',
        content: 'Choose the appropriate knowledge graph model based on your use case requirements.',
        recommendations: [
          { model: 'RDF', useCase: 'For semantic web and linked open data applications' },
          { model: 'Property Graph', useCase: 'For enterprise applications with complex property needs' }
        ]
      }
    };
    
    return defaultContent[contentId] || null;
  }
  
  /**
   * Domain-specific implementation of content transformation
   * @param rawContent Raw content from registry
   * @param options Transformation options
   */
  protected abstract transformContentImpl(rawContent: any, options?: any): any;
}