import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class QueryMechanismsSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'query-overview':
        return this.createQueryOverviewSlide(content, options);
      case 'query-languages':
        return this.createQueryLanguagesSlide(content, options);
      case 'query-patterns':
        return this.createQueryPatternsSlide(content, options);
      case 'query-examples':
        return this.createQueryExamplesSlide(content, options);
      case 'query-performance':
        return this.createQueryPerformanceSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createQueryOverviewSlide(content: any, options?: any): SlideConfig {
    // Create query overview slide
    return this.createSlide(
      'query-overview',
      content.title || 'Knowledge Graph Query Mechanisms',
      {
        definition: content.description || 'Knowledge graphs can be queried using different languages and mechanisms, each with its own strengths and appropriate use cases.',
        keyPoints: content.keyPoints || []
      },
      null,
      {
        transition: 'fade',
        notes: options?.notes || 'Provide an overview of knowledge graph query mechanisms and their importance.'
      }
    );
  }
  
  private createQueryLanguagesSlide(content: any, options?: any): SlideConfig {
    // Create query languages slide
    return this.createSlide(
      'query-languages',
      content.title || 'Knowledge Graph Query Languages',
      {
        definition: content.description || 'Several specialized query languages have been developed for querying graph data structures.',
        listItems: [
          {
            title: 'Major Query Languages',
            items: (content.languages || []).map((lang: any) => `${lang.name}: ${lang.description}`),
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Compare different query languages used with knowledge graphs.'
      }
    );
  }
  
  private createQueryPatternsSlide(content: any, options?: any): SlideConfig {
    // Create query patterns slide
    const pattern = content.pattern || {};
    
    return this.createSlide(
      `pattern-${pattern.name || 'general'}`,
      pattern.name ? `Query Pattern: ${pattern.name}` : 'Knowledge Graph Query Patterns',
      {
        definition: pattern.description || content.description || 'Common patterns for querying knowledge graphs that address specific data retrieval needs.',
        keyPoints: pattern.purpose ? [pattern.purpose] : [],
        listItems: pattern.examples ? [
          {
            title: 'Examples',
            items: pattern.examples,
            type: 'bullet'
          }
        ] : []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || `Explain the ${pattern.name || 'various'} query pattern(s) and when to use ${pattern.name ? 'it' : 'them'}.`
      }
    );
  }
  
  private createQueryExamplesSlide(content: any, options?: any): SlideConfig {
    // Create query examples slide
    const example = content.example || {};
    
    const codeSnippets: { language: string; code: string; caption: string }[] = [];
    if (example.code) {
      codeSnippets.push({
        language: example.language || 'sparql',
        code: example.code,
        caption: example.title || `${example.language || 'SPARQL'} Example`
      });
    }
    
    return this.createSlide(
      `example-${example.language || 'query'}`,
      example.title || 'Knowledge Graph Query Examples',
      {
        definition: example.description || content.description || 'Practical examples of knowledge graph queries in different languages.',
        codeSnippets: codeSnippets
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Walk through practical query examples and their results.'
      }
    );
  }
  
  private createQueryPerformanceSlide(content: any, options?: any): SlideConfig {
    // Create query performance slide
    return this.createSlide(
      'query-performance',
      content.title || 'Query Performance Considerations',
      {
        definition: content.description || 'The performance of knowledge graph queries depends on various factors including query complexity, graph size, and optimization techniques.',
        listItems: [
          {
            title: 'Optimization Tips',
            items: content.optimizationTips || [],
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Discuss performance considerations and optimization techniques for knowledge graph queries.'
      }
    );
  }
}