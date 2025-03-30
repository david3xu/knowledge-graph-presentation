import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { DataModelsDataTransformer } from './data';
import { DataModelsConfigFactory } from './config';
import { DataModelsSlideFactory } from './slides';

export interface DataModelsOptions {
  includeOverviewSlide?: boolean;
  includeRdfModel?: boolean;
  includePropertyGraph?: boolean;
  includeComparison?: boolean;
  includeExamples?: boolean;
  includePracticalUsage?: boolean;
  showDetailedExamples?: boolean;
  highlightKeyDifferences?: boolean;
}

export class DataModelsModule extends BaseModuleTemplate<DataModelsOptions> {
  protected dataTransformer: DataModelsDataTransformer;
  protected configFactory: DataModelsConfigFactory;
  protected slideFactory: DataModelsSlideFactory;
  
  constructor(
    dataTransformer: DataModelsDataTransformer,
    configFactory: DataModelsConfigFactory,
    slideFactory: DataModelsSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: DataModelsOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('data-models-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create overview slide if requested
    if (options.includeOverviewSlide !== false) {
      const overviewContent = this.dataTransformer.transformContent('kg-data-models-overview');
      slides.push(this.slideFactory.createDomainSlide('overview', overviewContent));
    }
    
    // Add RDF model slide if requested
    if (options.includeRdfModel !== false) {
      const rdfContent = this.dataTransformer.transformContent('kg-rdf-model');
      
      // Create RDF visualization
      const rdfVisualizationData = this.dataTransformer.transformContent('kg-rdf-example');
      const rdfVisualizationConfig = this.configFactory.createConfig(
        'rdf-triple', 
        rdfVisualizationData
      );
      
      // Add RDF model slide
      slides.push(this.slideFactory.createDomainSlide(
        'rdf-model', 
        rdfContent, 
        { visualizationConfig: rdfVisualizationConfig }
      ));
    }
    
    // Add property graph model slide if requested
    if (options.includePropertyGraph !== false) {
      const pgContent = this.dataTransformer.transformContent('kg-property-graph-model');
      
      // Create property graph visualization
      const pgVisualizationData = this.dataTransformer.transformContent('kg-property-graph-example');
      const pgVisualizationConfig = this.configFactory.createConfig(
        'property-graph', 
        pgVisualizationData
      );
      
      // Add property graph model slide
      slides.push(this.slideFactory.createDomainSlide(
        'property-graph-model', 
        pgContent, 
        { visualizationConfig: pgVisualizationConfig }
      ));
    }
    
    // Add comparison slide if requested
    if (options.includeComparison !== false) {
      const comparisonContent = this.dataTransformer.transformContent('kg-model-comparison');
      
      // Create comparison visualization
      const comparisonVisualizationConfig = this.configFactory.createConfig(
        'comparison-table', 
        comparisonContent, 
        { highlightDifferences: options.highlightKeyDifferences }
      );
      
      // Add comparison slide
      slides.push(this.slideFactory.createDomainSlide(
        'model-comparison', 
        comparisonContent, 
        { visualizationConfig: comparisonVisualizationConfig }
      ));
    }
    
    // Add example comparison if requested
    if (options.includeExamples !== false) {
      const exampleContent = this.dataTransformer.transformContent(
        options.showDetailedExamples ? 'kg-detailed-model-examples' : 'kg-model-examples'
      );
      
      // Create code block visualizations
      const codeVisualizationConfigs = exampleContent.examples.map((example: any, index: number) => 
        this.configFactory.createConfig(
          'code-block', 
          example, 
          { 
            language: example.language,
            highlightLines: example.highlights
          }
        )
      );
      
      // Add example comparison slide
      slides.push(this.slideFactory.createDomainSlide(
        'example-comparison', 
        exampleContent, 
        { 
          visualizationConfig: codeVisualizationConfigs[0] // Primary visualization
        }
      ));
    }
    
    // Add practical usage slide if requested
    if (options.includePracticalUsage !== false) {
      const usageContent = this.dataTransformer.transformContent('kg-model-selection');
      slides.push(this.slideFactory.createDomainSlide('practical-usage', usageContent));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Data Models',
      groupMetadata.id || 'data-models',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['data-models-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getDataModelsSlides(options: DataModelsOptions = {}): SlideGroup {
  const dataTransformer = new DataModelsDataTransformer();
  const configFactory = new DataModelsConfigFactory();
  const slideFactory = new DataModelsSlideFactory();
  
  const module = new DataModelsModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}