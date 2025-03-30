// src/modules/resources/index.ts
import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { ResourcesDataTransformer } from './data';
import { ResourcesConfigFactory } from './config';
import { ResourcesSlideFactory } from './slides';

export interface ResourcesOptions {
  includeOverview?: boolean;
  includeAcademicReferences?: boolean;
  includeSoftwareTools?: boolean;
  includeToolComparison?: boolean;
  includeLearningResources?: boolean;
  includeLearningPath?: boolean;
  includeCommunities?: boolean;
  includeNextSteps?: boolean;
  referencesLimit?: number;
  toolsLimit?: number;
  learningResourcesLimit?: number;
  communitiesLimit?: number;
  resourceLayout?: 'grid' | 'list';
  topicMapType?: 'bubble' | 'network';
}

export class ResourcesModule extends BaseModuleTemplate<ResourcesOptions> {
  protected dataTransformer: ResourcesDataTransformer;
  protected configFactory: ResourcesConfigFactory;
  protected slideFactory: ResourcesSlideFactory;
  
  constructor(
    dataTransformer: ResourcesDataTransformer,
    configFactory: ResourcesConfigFactory,
    slideFactory: ResourcesSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: ResourcesOptions = {}): SlideGroup {
    // Set default options
    const moduleOptions: ResourcesOptions = {
      includeOverview: true,
      includeAcademicReferences: options.includeAcademicReferences !== false,
      includeSoftwareTools: options.includeSoftwareTools !== false,
      includeToolComparison: options.includeToolComparison !== false,
      includeLearningResources: options.includeLearningResources !== false,
      includeLearningPath: options.includeLearningPath !== false,
      includeCommunities: options.includeCommunities !== false,
      includeNextSteps: options.includeNextSteps !== false,
      referencesLimit: options.referencesLimit || 10,
      toolsLimit: options.toolsLimit || 10,
      learningResourcesLimit: options.learningResourcesLimit || 8,
      communitiesLimit: options.communitiesLimit || 6,
      resourceLayout: options.resourceLayout || 'grid',
      topicMapType: options.topicMapType || 'bubble',
      ...options
    };
    
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('resources-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Add overview slide if requested
    if (moduleOptions.includeOverview) {
      const overviewContent = this.dataTransformer.transformContent('kg-resources-overview');
      slides.push(this.slideFactory.createDomainSlide('resources-overview', overviewContent));
    }
    
    // Add academic references slide if requested
    if (moduleOptions.includeAcademicReferences) {
      const referencesContent = this.dataTransformer.transformContent('kg-academic-references');
      
      // Create visualization config for references
      const networkConfig = this.configFactory.createConfig(
        'reference-network', 
        referencesContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'academic-references', 
        referencesContent, 
        { 
          visualizationConfig: networkConfig,
          limit: moduleOptions.referencesLimit
        }
      ));
    }
    
    // Add software tools slide if requested
    if (moduleOptions.includeSoftwareTools) {
      const toolsContent = this.dataTransformer.transformContent('kg-software-tools');
      
      // Create visualization config for tools
      const gridConfig = this.configFactory.createConfig(
        'resource-grid', 
        toolsContent,
        {
          layout: moduleOptions.resourceLayout
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'software-tools', 
        toolsContent, 
        { 
          visualizationConfig: gridConfig,
          limit: moduleOptions.toolsLimit
        }
      ));
    }
    
    // Add tool comparison slide if requested
    if (moduleOptions.includeToolComparison) {
      const comparisonContent = this.dataTransformer.transformContent('kg-tool-comparison');
      
      // Create visualization config for tool comparison
      const radarConfig = this.configFactory.createConfig(
        'tool-comparison', 
        comparisonContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'tool-comparison', 
        comparisonContent, 
        { visualizationConfig: radarConfig }
      ));
    }
    
    // Add learning resources slide if requested
    if (moduleOptions.includeLearningResources) {
      const learningContent = this.dataTransformer.transformContent('kg-learning-resources');
      
      // Create visualization config for learning resources
      const topicConfig = this.configFactory.createConfig(
        'topic-map', 
        learningContent,
        {
          mapType: moduleOptions.topicMapType
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'learning-resources', 
        learningContent, 
        { 
          visualizationConfig: topicConfig,
          limit: moduleOptions.learningResourcesLimit
        }
      ));
    }
    
    // Add learning path slide if requested
    if (moduleOptions.includeLearningPath) {
      const pathContent = this.dataTransformer.transformContent('kg-learning-path');
      
      // Create visualization config for learning path
      const pathConfig = this.configFactory.createConfig(
        'learning-path', 
        pathContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'learning-path', 
        pathContent, 
        { visualizationConfig: pathConfig }
      ));
    }
    
    // Add communities slide if requested
    if (moduleOptions.includeCommunities) {
      const communitiesContent = this.dataTransformer.transformContent('kg-communities');
      slides.push(this.slideFactory.createDomainSlide(
        'communities', 
        communitiesContent, 
        { limit: moduleOptions.communitiesLimit }
      ));
    }
    
    // Add next steps slide if requested
    if (moduleOptions.includeNextSteps) {
      const nextStepsContent = this.dataTransformer.transformContent('kg-next-steps');
      slides.push(this.slideFactory.createDomainSlide('next-steps', nextStepsContent));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Resources',
      groupMetadata.id || 'resources',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['resources-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getResourcesSlides(options: ResourcesOptions = {}): SlideGroup {
  const dataTransformer = new ResourcesDataTransformer();
  const configFactory = new ResourcesConfigFactory();
  const slideFactory = new ResourcesSlideFactory();
  
  const module = new ResourcesModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}