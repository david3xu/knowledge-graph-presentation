import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { ComparativeAnalysisDataTransformer } from './data';
import { ComparativeAnalysisConfigFactory } from './config';
import { ComparativeAnalysisSlideFactory } from './slides';

export interface ComparativeAnalysisOptions {
  includeOverviewSlide?: boolean;
  includeRelationalComparison?: boolean;
  includeDocumentComparison?: boolean;
  includeTechnologyMatrix?: boolean;
  includeUseCaseComparison?: boolean;
  includeDecisionFramework?: boolean;
  highlightKGStrengths?: boolean;
  focusOnEnterprise?: boolean;
}

export class ComparativeAnalysisModule extends BaseModuleTemplate<ComparativeAnalysisOptions> {
  protected dataTransformer: ComparativeAnalysisDataTransformer;
  protected configFactory: ComparativeAnalysisConfigFactory;
  protected slideFactory: ComparativeAnalysisSlideFactory;
  
  constructor(
    dataTransformer: ComparativeAnalysisDataTransformer,
    configFactory: ComparativeAnalysisConfigFactory,
    slideFactory: ComparativeAnalysisSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: ComparativeAnalysisOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('comparative-analysis-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Add overview slide if requested
    if (options.includeOverviewSlide !== false) {
      const overviewContent = this.dataTransformer.transformContent('kg-comparison-overview');
      slides.push(this.slideFactory.createDomainSlide('overview', overviewContent));
    }
    
    // Add relational DB comparison if requested
    if (options.includeRelationalComparison !== false) {
      const relationalContent = this.dataTransformer.transformContent('kg-vs-relational');
      
      // Create radar chart visualization
      const radarConfig = this.configFactory.createConfig(
        'radar-chart', 
        relationalContent, 
        { 
          comparisonName: 'Relational DB',
          highlightKG: options.highlightKGStrengths
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'relational-comparison', 
        relationalContent, 
        { visualizationConfig: radarConfig }
      ));
    }
    
    // Add document DB comparison if requested
    if (options.includeDocumentComparison !== false) {
      const documentContent = this.dataTransformer.transformContent('kg-vs-document');
      
      // Create bar chart visualization
      const barConfig = this.configFactory.createConfig(
        'bar-comparison', 
        documentContent, 
        { 
          comparisonName: 'Document DB',
          highlightKG: options.highlightKGStrengths
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'document-comparison', 
        documentContent, 
        { visualizationConfig: barConfig }
      ));
    }
    
    // Add technology matrix if requested
    if (options.includeTechnologyMatrix !== false) {
      const techContent = this.dataTransformer.transformContent('kg-technology-comparison');
      
      // Create table visualization
      const tableConfig = this.configFactory.createConfig(
        'tech-comparison-table', 
        techContent,
        {
          sortable: true,
          compact: false
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'technology-matrix', 
        techContent, 
        { visualizationConfig: tableConfig }
      ));
    }
    
    // Add use case comparison if requested
    if (options.includeUseCaseComparison !== false) {
      // Determine which use case set to use
      const useCaseContentId = options.focusOnEnterprise ? 
        'kg-enterprise-use-cases' : 'kg-general-use-cases';
      
      const useCaseContent = this.dataTransformer.transformContent(useCaseContentId);
      
      // Create matrix visualization
      const matrixConfig = this.configFactory.createConfig(
        'matrix', 
        useCaseContent,
        {
          highlightBest: true
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'use-case-comparison', 
        useCaseContent, 
        { visualizationConfig: matrixConfig }
      ));
    }
    
    // Add decision framework if requested
    if (options.includeDecisionFramework !== false) {
      const decisionContent = this.dataTransformer.transformContent('kg-decision-framework');
      slides.push(this.slideFactory.createDomainSlide('decision-framework', decisionContent));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Comparative Analysis',
      groupMetadata.id || 'comparative-analysis',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['comparative-analysis-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getComparativeAnalysisSlides(options: ComparativeAnalysisOptions = {}): SlideGroup {
  const dataTransformer = new ComparativeAnalysisDataTransformer();
  const configFactory = new ComparativeAnalysisConfigFactory();
  const slideFactory = new ComparativeAnalysisSlideFactory();
  
  const module = new ComparativeAnalysisModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}