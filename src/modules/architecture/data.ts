import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class ArchitectureDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Handle different content types
    if (rawContent.type === 'architecture-layers') {
      return this.transformArchitectureLayers(rawContent, options);
    } else if (rawContent.type === 'technology-stack') {
      return this.transformTechnologyStack(rawContent, options);
    } else if (rawContent.type === 'deployment-models') {
      return this.transformDeploymentModels(rawContent, options);
    }
    
    // Return normalized content for other types
    return this.normalizeContent(rawContent);
  }
  
  private transformArchitectureLayers(rawContent: any, options?: any): any {
    // Transform architecture layers data
    return {
      layers: (rawContent.layers || []).map((layer: any) => ({
        id: layer.id,
        name: layer.name,
        description: layer.description,
        components: layer.components || [],
        position: layer.position
      })),
      connections: rawContent.connections || [],
      description: rawContent.description || 'Knowledge Graph Architecture Layers'
    };
  }
  
  private transformTechnologyStack(rawContent: any, options?: any): any {
    // Transform technology stack data
    return {
      categories: (rawContent.categories || []).map((category: any) => ({
        name: category.name,
        technologies: (category.technologies || []).map((tech: any) => ({
          name: tech.name,
          description: tech.description,
          maturity: tech.maturity || 'stable',
          type: tech.type || 'opensource',
          url: tech.url
        }))
      })),
      description: rawContent.description || 'Knowledge Graph Technology Stack'
    };
  }
  
  private transformDeploymentModels(rawContent: any, options?: any): any {
    // Transform deployment models data
    return {
      models: (rawContent.models || []).map((model: any) => ({
        name: model.name,
        description: model.description,
        advantages: model.advantages || [],
        disadvantages: model.disadvantages || [],
        useCases: model.useCases || [],
        diagram: model.diagram
      })),
      description: rawContent.description || 'Knowledge Graph Deployment Models'
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