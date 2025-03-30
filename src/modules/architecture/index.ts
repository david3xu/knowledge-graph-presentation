import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { ArchitectureDataTransformer } from './data';
import { ArchitectureConfigFactory } from './config';
import { ArchitectureSlideFactory } from './slides';

export interface ArchitectureOptions {
  includeLayerDetails?: boolean;
  includeTechnologyStack?: boolean;
  includeDeploymentModels?: boolean;
  highlightComponents?: string[];
  highlightTechnologies?: string[];
  direction?: 'TB' | 'LR';
}

export class ArchitectureModule extends BaseModuleTemplate<ArchitectureOptions> {
  protected dataTransformer: ArchitectureDataTransformer;
  protected configFactory: ArchitectureConfigFactory;
  protected slideFactory: ArchitectureSlideFactory;
  
  constructor(
    dataTransformer: ArchitectureDataTransformer,
    configFactory: ArchitectureConfigFactory,
    slideFactory: ArchitectureSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: ArchitectureOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('architecture-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create architecture overview slide
    const architectureContent = this.dataTransformer.transformContent('architecture-layers');
    
    // Create layers visualization
    const layersConfig = this.configFactory.createConfig(
      'architecture-layers', 
      architectureContent,
      { direction: options.direction || 'TB' }
    );
    
    slides.push(this.slideFactory.createDomainSlide(
      'architecture-overview', 
      architectureContent, 
      { 
        visualizationType: 'graph',
        visualizationConfig: layersConfig,
        notes: 'Present the overall architecture of knowledge graph systems with their key layers.'
      }
    ));
    
    // Conditionally add layer details slides
    if (options.includeLayerDetails) {
      (architectureContent.layers || []).forEach(layer => {
        const layerVisualizationConfig = this.configFactory.createConfig(
          'architecture-layers',
          {
            layers: [layer],
            connections: architectureContent.connections?.filter(
              conn => conn.source === layer.id || conn.target === layer.id
            ) || []
          },
          { 
            direction: options.direction,
            highlightComponents: options.highlightComponents
          }
        );
        
        slides.push(this.slideFactory.createDomainSlide(
          'layer-detail',
          { layer },
          {
            visualizationConfig: layerVisualizationConfig,
            notes: `Detail the ${layer.name} layer and its components.`
          }
        ));
      });
    }
    
    // Conditionally add technology stack slide
    if (options.includeTechnologyStack) {
      const technologyContent = this.dataTransformer.transformContent('technology-stack');
      
      const technologyConfig = this.configFactory.createConfig(
        'technology-matrix',
        technologyContent,
        { highlightTechnologies: options.highlightTechnologies }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'technology-stack', 
        technologyContent, 
        { 
          visualizationConfig: technologyConfig,
          notes: 'Present the technology ecosystem for knowledge graph implementation.'
        }
      ));
    }
    
    // Conditionally add deployment models slide
    if (options.includeDeploymentModels) {
      const deploymentContent = this.dataTransformer.transformContent('deployment-models');
      
      const deploymentConfig = this.configFactory.createConfig(
        'deployment-diagram',
        deploymentContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'deployment-models', 
        deploymentContent, 
        { 
          visualizationConfig: deploymentConfig,
          notes: 'Discuss various deployment options for knowledge graph systems.'
        }
      ));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Architecture',
      groupMetadata.id || 'architecture',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['architecture-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getArchitectureSlides(options: ArchitectureOptions = {}): SlideGroup {
  const dataTransformer = new ArchitectureDataTransformer();
  const configFactory = new ArchitectureConfigFactory();
  const slideFactory = new ArchitectureSlideFactory();
  
  const module = new ArchitectureModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}