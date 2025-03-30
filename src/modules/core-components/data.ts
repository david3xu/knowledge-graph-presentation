import { BaseDataTransformer } from '../../utils/templates/data-transformer';
import { GraphData } from '../../types/graph-data';

export class CoreComponentsDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Determine the specific transformation to apply
    if (rawContent.entities && rawContent.relationships) {
      return this.transformComponentGraph(rawContent, options);
    } else if (rawContent.componentTypes) {
      return this.transformComponentTypes(rawContent, options);
    } else if (rawContent.componentDetails) {
      return this.transformComponentDetails(rawContent, options);
    }
    
    // Default normalization for generic content
    return this.normalizeContent(rawContent);
  }
  
  private transformComponentGraph(rawContent: any, options?: any): GraphData {
    // Transform raw content into graph visualization data
    const nodes = rawContent.entities.map((entity: any) => ({
      id: entity.id,
      label: entity.name,
      type: entity.type || 'Entity',
      properties: {
        description: entity.description || '',
        examples: entity.examples || []
      }
    }));
    
    const edges = rawContent.relationships.map((rel: any) => ({
      source: rel.source,
      target: rel.target,
      label: rel.type || '',
      directed: rel.directed !== false,
      properties: {
        description: rel.description || ''
      }
    }));
    
    return {
      nodes,
      edges,
      metadata: {
        name: rawContent.title || 'Knowledge Graph Components',
        description: rawContent.description || 'Core components of a knowledge graph system'
      }
    };
  }
  
  private transformComponentTypes(rawContent: any, options?: any): any {
    // Transform component types into structured format
    return {
      title: rawContent.title || 'Component Types',
      categories: rawContent.componentTypes.map((type: any) => ({
        name: type.name,
        description: type.description,
        examples: type.examples || [],
        properties: type.properties || [],
        visualAttributes: {
          color: type.color || '#4C9AFF',
          icon: type.icon || 'circle',
          size: type.size || 40
        }
      })),
      relationshipTypes: rawContent.relationshipTypes || []
    };
  }
  
  private transformComponentDetails(rawContent: any, options?: any): any {
    // Transform detailed component information for deep-dive slides
    return {
      title: rawContent.title || 'Component Details',
      component: {
        name: rawContent.componentDetails.name,
        type: rawContent.componentDetails.type,
        description: rawContent.componentDetails.description,
        properties: rawContent.componentDetails.properties || [],
        examples: rawContent.componentDetails.examples || [],
        bestPractices: rawContent.componentDetails.bestPractices || [],
        commonMistakes: rawContent.componentDetails.commonMistakes || []
      }
    };
  }
  
  private normalizeContent(rawContent: any): any {
    // Default normalization for generic content
    return {
      title: rawContent.title || '',
      description: rawContent.description || '',
      keyPoints: rawContent.keyPoints || [],
      examples: rawContent.examples || [],
      notes: rawContent.notes || ''
    };
  }
}