import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { CoreComponentsDataTransformer } from './data';
import { CoreComponentsConfigFactory } from './config';
import { CoreComponentsSlideFactory } from './slides';

export interface CoreComponentsOptions {
  includeOverviewSlide?: boolean;
  includeEntityTypesSlide?: boolean;
  includeRelationshipTypesSlide?: boolean;
  includePropertiesSlide?: boolean;
  includeDetailSlides?: boolean;
  includeAdvancedTopics?: boolean;
  detailComponents?: string[];
  highlightedComponents?: string[];
}

export class CoreComponentsModule extends BaseModuleTemplate<CoreComponentsOptions> {
  protected dataTransformer: CoreComponentsDataTransformer;
  protected configFactory: CoreComponentsConfigFactory;
  protected slideFactory: CoreComponentsSlideFactory;
  
  constructor(
    dataTransformer: CoreComponentsDataTransformer,
    configFactory: CoreComponentsConfigFactory,
    slideFactory: CoreComponentsSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: CoreComponentsOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('core-components-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create overview slide if requested
    if (options.includeOverviewSlide !== false) {
      const overviewContent = this.dataTransformer.transformContent('kg-components-overview');
      const graphData = this.dataTransformer.transformContent('kg-components-graph');
      
      // Create visualization configuration
      const visualizationConfig = this.configFactory.createConfig(
        'graph', 
        graphData, 
        { highlightNodes: options.highlightedComponents }
      );
      
      // Add overview slide
      slides.push(this.slideFactory.createDomainSlide(
        'overview', 
        overviewContent, 
        { visualizationConfig }
      ));
    }
    
    // Add entity types slide if requested
    if (options.includeEntityTypesSlide !== false) {
      const entityContent = this.dataTransformer.transformContent('kg-entity-types');
      
      // Create visualization for entity types
      const entityVisualizationData = this.dataTransformer.transformContent('kg-entity-hierarchy');
      const entityVisualizationConfig = this.configFactory.createConfig(
        'hierarchy', 
        entityVisualizationData
      );
      
      // Add entity types slide
      slides.push(this.slideFactory.createDomainSlide(
        'entity-types', 
        entityContent, 
        { visualizationConfig: entityVisualizationConfig }
      ));
    }
    
    // Add relationship types slide if requested
    if (options.includeRelationshipTypesSlide !== false) {
      const relationshipContent = this.dataTransformer.transformContent('kg-relationship-types');
      
      // Create visualization for relationship types
      const relationshipVisualizationData = this.dataTransformer.transformContent('kg-relationship-examples');
      const relationshipVisualizationConfig = this.configFactory.createConfig(
        'graph', 
        relationshipVisualizationData
      );
      
      // Add relationship types slide
      slides.push(this.slideFactory.createDomainSlide(
        'relationship-types', 
        relationshipContent, 
        { visualizationConfig: relationshipVisualizationConfig }
      ));
    }
    
    // Add properties slide if requested
    if (options.includePropertiesSlide !== false) {
      const propertiesContent = this.dataTransformer.transformContent('kg-properties');
      
      // Create visualization for properties
      const propertiesVisualizationData = this.dataTransformer.transformContent('kg-property-examples');
      const propertiesVisualizationConfig = this.configFactory.createConfig(
        'table', 
        propertiesVisualizationData
      );
      
      // Add properties slide
      slides.push(this.slideFactory.createDomainSlide(
        'properties', 
        propertiesContent, 
        { visualizationConfig: propertiesVisualizationConfig }
      ));
    }
    
    // Add advanced topics if requested
    if (options.includeAdvancedTopics) {
      // Additional advanced slides would be added here
      // For example, slides about ontologies, schemas, inference rules, etc.
    }
    
    // Add detail slides if requested
    if (options.includeDetailSlides && options.detailComponents) {
      for (const componentId of options.detailComponents) {
        const componentContent = this.dataTransformer.transformContent(`kg-component-${componentId}`);
        
        // Skip if content not found
        if (!componentContent || componentContent.error) continue;
        
        // Create detailed component slide
        slides.push(this.slideFactory.createDomainSlide(
          'component-detail', 
          { component: componentContent }
        ));
      }
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Core Components',
      groupMetadata.id || 'core-components',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['components-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getCoreComponentsSlides(options: CoreComponentsOptions = {}): SlideGroup {
  const dataTransformer = new CoreComponentsDataTransformer();
  const configFactory = new CoreComponentsConfigFactory();
  const slideFactory = new CoreComponentsSlideFactory();
  
  const module = new CoreComponentsModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}