import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { IndustryApplicationsDataTransformer } from './data';
import { IndustryApplicationsConfigFactory } from './config';
import { IndustryApplicationsSlideFactory } from './slides';

export interface IndustryApplicationsOptions {
  includeOverview?: boolean;
  includeIndustryMatrix?: boolean;
  includeUseCases?: boolean;
  selectedIndustries?: string[];
  includeCaseStudies?: boolean;
  includeMetricsComparison?: boolean;
  interactiveVisualizations?: boolean;
  metricToHighlight?: string;
  visualizationType?: 'treemap' | 'bubbleChart' | 'networkGraph';
}

export class IndustryApplicationsModule extends BaseModuleTemplate<IndustryApplicationsOptions> {
  protected dataTransformer: IndustryApplicationsDataTransformer;
  protected configFactory: IndustryApplicationsConfigFactory;
  protected slideFactory: IndustryApplicationsSlideFactory;
  
  constructor(
    dataTransformer: IndustryApplicationsDataTransformer,
    configFactory: IndustryApplicationsConfigFactory,
    slideFactory: IndustryApplicationsSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: IndustryApplicationsOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('industry-applications-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Overview slide
    if (options.includeOverview !== false) {
      const overviewContent = this.dataTransformer.transformContent('kg-industry-overview');
      slides.push(this.slideFactory.createDomainSlide('industry-overview', overviewContent));
    }
    
    // Industry matrix slide
    if (options.includeIndustryMatrix !== false) {
      const matrixContent = this.dataTransformer.transformContent('kg-industry-matrix');
      const matrixConfig = this.configFactory.createConfig(
        'heatmap', 
        matrixContent,
        { interactive: options.interactiveVisualizations }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'industry-matrix',
        matrixContent,
        { visualizationConfig: matrixConfig }
      ));
    }
    
    // Use cases slide
    if (options.includeUseCases !== false) {
      const useCasesContent = this.dataTransformer.transformContent('kg-use-cases');
      
      // Determine visualization type
      const visType = options.visualizationType || 'treemap';
      
      const useCasesConfig = this.configFactory.createConfig(
        visType,
        useCasesContent,
        { 
          interactive: options.interactiveVisualizations,
          highlightIndustry: options.selectedIndustries?.[0]
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'use-cases',
        useCasesContent,
        { visualizationConfig: useCasesConfig }
      ));
    }
    
    // Industry detail slides for selected industries
    if (options.selectedIndustries && options.selectedIndustries.length > 0) {
      options.selectedIndustries.forEach(industry => {
        const industryContent = this.dataTransformer.transformContent(
          'kg-industry-details',
          { industry }
        );
        
        // Skip if industry not found (error handled in transformer)
        if (industryContent.error) return;
        
        // Create a network graph config for this industry
        const industryGraphConfig = this.configFactory.createConfig(
          'networkGraph',
          industryContent,
          { interactive: options.interactiveVisualizations }
        );
        
        slides.push(this.slideFactory.createDomainSlide(
          'industry-detail',
          industryContent,
          { visualizationConfig: industryGraphConfig }
        ));
      });
    }
    
    // Case studies slides
    if (options.includeCaseStudies && options.selectedIndustries?.length) {
      // Add case studies for selected industries
      options.selectedIndustries.forEach(industry => {
        try {
          const caseStudyContent = this.dataTransformer.transformContent(
            `kg-case-study-${industry.toLowerCase()}`
          );
          
          slides.push(this.slideFactory.createDomainSlide('case-study', caseStudyContent));
        } catch (error) {
          // Skip if case study for this industry doesn't exist
          console.warn(`Case study for ${industry} not found`);
        }
      });
    }
    
    // Metrics comparison slide
    if (options.includeMetricsComparison) {
      const metricsContent = this.dataTransformer.transformContent('kg-industry-metrics');
      const metricsConfig = this.configFactory.createConfig(
        'barChart',
        metricsContent,
        { 
          metric: options.metricToHighlight || 'roi',
          sortBars: true
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'metrics-comparison',
        metricsContent,
        { visualizationConfig: metricsConfig }
      ));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Industry Applications of Knowledge Graphs',
      groupMetadata.id || 'industry-applications',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['industry-applications-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getIndustryApplicationsSlides(options: IndustryApplicationsOptions = {}): SlideGroup {
  const dataTransformer = new IndustryApplicationsDataTransformer();
  const configFactory = new IndustryApplicationsConfigFactory();
  const slideFactory = new IndustryApplicationsSlideFactory();
  
  const module = new IndustryApplicationsModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}