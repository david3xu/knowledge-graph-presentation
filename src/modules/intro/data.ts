import { BaseDataTransformer } from '../../utils/templates/data-transformer';
import { GraphData } from '../../types/graph-data';

export class IntroDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Handle different content types based on identifiers
    if (rawContent.type === 'concept-graph') {
      return this.transformConceptGraphData(rawContent, options);
    } else if (rawContent.type === 'evolution-timeline') {
      return this.transformEvolutionTimelineData(rawContent, options);
    } else if (rawContent.key === 'intro-definition') {
      return this.transformDefinitionContent(rawContent, options);
    }
    
    // Return normalized content for other types
    return this.normalizeContent(rawContent);
  }
  
  private transformConceptGraphData(rawContent: any, options?: any): GraphData {
    // Transform raw content into graph data structure
    const nodes = (rawContent.entities || []).map((entity: any) => ({
      id: entity.id,
      label: entity.name,
      type: entity.type,
      properties: entity.properties || {}
    }));
    
    const edges = (rawContent.relationships || []).map((rel: any) => ({
      source: rel.source,
      target: rel.target,
      label: rel.type,
      directed: true,
      properties: rel.properties || {}
    }));
    
    return {
      nodes,
      edges,
      metadata: {
        name: rawContent.title || 'Knowledge Graph Concepts',
        description: rawContent.description || ''
      }
    };
  }
  
  private transformEvolutionTimelineData(rawContent: any, options?: any): any {
    // Transform timeline data
    return {
      periods: (rawContent.periods || []).map((period: any) => ({
        period: period.timeframe,
        label: period.name,
        items: period.achievements || [],
        events: (period.keyEvents || []).map((event: any) => ({
          date: event.date,
          title: event.title,
          description: event.description
        }))
      })),
      orientation: options?.orientation || 'horizontal',
      startTime: rawContent.startTime || '1960',
      endTime: rawContent.endTime || 'Present'
    };
  }
  
  private transformDefinitionContent(rawContent: any, options?: any): any {
    // Extract definition and key points
    return {
      title: rawContent.title || 'What is a Knowledge Graph?',
      definition: rawContent.definition || '',
      keyPoints: rawContent.keyPoints || [],
      examples: rawContent.examples || [],
      highlightTerms: options?.highlightTerms || []
    };
  }
  
  private normalizeContent(rawContent: any): any {
    // Default normalization for generic content
    return {
      title: rawContent.title || '',
      content: rawContent.content || '',
      metadata: rawContent.metadata || {}
    };
  }
}