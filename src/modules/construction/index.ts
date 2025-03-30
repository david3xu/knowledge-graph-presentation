import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { ConstructionDataTransformer } from './data';
import { ConstructionConfigFactory } from './config';
import { ConstructionSlideFactory } from './slides';

export interface ConstructionModuleOptions {
  includeProcessOverview?: boolean;
  includeDataSources?: boolean;
  includeExtractionMethods?: boolean;
  includeBestPractices?: boolean;
  includeChallenges?: boolean;
  interactiveVisualizations?: boolean;
  highlightAdvancedTechniques?: boolean;
}

export class ConstructionModule extends BaseModuleTemplate<ConstructionModuleOptions> {
  protected dataTransformer: ConstructionDataTransformer;
  protected configFactory: ConstructionConfigFactory;
  protected slideFactory: ConstructionSlideFactory;
  
  constructor(
    dataTransformer: ConstructionDataTransformer,
    configFactory: ConstructionConfigFactory,
    slideFactory: ConstructionSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: ConstructionModuleOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('construction-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Process overview slide
    if (options.includeProcessOverview !== false) {
      const processContent = this.dataTransformer.transformContent('kg-construction-process');
      const processConfig = this.configFactory.createConfig(
        'flowDiagram', 
        processContent,
        { interactive: options.interactiveVisualizations }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'process-overview',
        processContent,
        { visualizationConfig: processConfig }
      ));
    }
    
    // Data sources slide
    if (options.includeDataSources !== false) {
      const dataSourcesContent = this.dataTransformer.transformContent('kg-data-sources');
      const dataSourcesConfig = this.configFactory.createConfig(
        'table',
        dataSourcesContent,
        { sortable: true }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'data-sources',
        dataSourcesContent,
        { visualizationConfig: dataSourcesConfig }
      ));
    }
    
    // Extraction methods slide
    if (options.includeExtractionMethods !== false) {
      const extractionContent = this.dataTransformer.transformContent(
        options.highlightAdvancedTechniques ? 
        'kg-extraction-methods-advanced' : 
        'kg-extraction-methods'
      );
      
      const extractionConfig = this.configFactory.createConfig(
        'barChart',
        extractionContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'extraction-methods',
        extractionContent,
        { visualizationConfig: extractionConfig }
      ));
    }
    
    // Best practices slide
    if (options.includeBestPractices !== false) {
      const bestPracticesContent = this.dataTransformer.transformContent('kg-construction-best-practices');
      slides.push(this.slideFactory.createDomainSlide(
        'best-practices',
        bestPracticesContent
      ));
    }
    
    // Challenges slide
    if (options.includeChallenges !== false) {
      const challengesContent = this.dataTransformer.transformContent('kg-construction-challenges');
      slides.push(this.slideFactory.createDomainSlide(
        'challenges',
        challengesContent
      ));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Construction',
      groupMetadata.id || 'construction',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['construction-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getConstructionSlides(options: ConstructionModuleOptions = {}): SlideGroup {
  const dataTransformer = new ConstructionDataTransformer();
  const configFactory = new ConstructionConfigFactory();
  const slideFactory = new ConstructionSlideFactory();
  
  const module = new ConstructionModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}