import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class ArchitectureSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    id: string,
    content: any,
    options: any = {}
  ): SlideConfig {
    switch(id) {
      case 'architecture-overview':
        return this.createArchitectureOverviewSlide(content, options);
      case 'layer-detail':
        return this.createLayerDetailSlide(content, options);
      case 'technology-stack':
        return this.createTechnologyStackSlide(content, options);
      case 'deployment-models':
        return this.createDeploymentModelsSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${id}`);
    }
  }
  
  private createArchitectureOverviewSlide(content: any, options?: any): SlideConfig {
    // Create architecture overview slide
    return this.createSlide(
      'architecture-overview',
      content.title || 'Knowledge Graph Architecture',
      {
        definition: content.description || 'The architecture of a knowledge graph system typically consists of multiple layers that handle different aspects of data management and processing.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: options?.notes || 'Provide an overview of the knowledge graph architecture layers and their relationships.'
      }
    );
  }
  
  private createLayerDetailSlide(content: any, options?: any): SlideConfig {
    // Create layer detail slide
    const layer = content.layer || {};
    
    return this.createSlide(
      `layer-${layer.id || 'detail'}`,
      `${layer.name || 'Layer'} Details`,
      {
        definition: layer.description || '',
        listItems: [
          {
            title: 'Components',
            items: layer.components?.map((comp: any) => comp.name) || [],
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || `Detail the ${layer.name || 'selected'} layer and its key components.`
      }
    );
  }
  
  private createTechnologyStackSlide(content: any, options?: any): SlideConfig {
    // Create technology stack slide
    return this.createSlide(
      'technology-stack',
      content.title || 'Knowledge Graph Technology Stack',
      {
        definition: content.description || 'A range of technologies support different aspects of knowledge graph implementation.',
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Present the technology stack across different categories and their maturity levels.'
      }
    );
  }
  
  private createDeploymentModelsSlide(content: any, options?: any): SlideConfig {
    // Create deployment models slide
    return this.createSlide(
      'deployment-models',
      content.title || 'Knowledge Graph Deployment Models',
      {
        definition: content.description || 'Knowledge graphs can be deployed in various configurations depending on requirements.',
        listItems: content.models?.map((model: any) => ({
          title: model.name,
          items: [model.description],
          type: 'bullet'
        })) || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Discuss different deployment models and their appropriate use cases.'
      }
    );
  }
}