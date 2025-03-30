import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { RCADataTransformer } from './data';
import { RCAConfigFactory } from './config';
import { RCASlideFactory } from './slides';

export interface RCAModuleOptions {
  includeIntroduction?: boolean;
  includeCausalGraph?: boolean;
  includeMethodology?: boolean;
  includeCaseStudy?: boolean;
  includeComparison?: boolean;
  includeMethodsRadar?: boolean;
  interactiveVisualizations?: boolean;
  advancedInteraction?: boolean;
  industrySpecific?: string;
}

export class RCAModule extends BaseModuleTemplate<RCAModuleOptions> {
  protected dataTransformer: RCADataTransformer;
  protected configFactory: RCAConfigFactory;
  protected slideFactory: RCASlideFactory;
  
  constructor(
    dataTransformer: RCADataTransformer,
    configFactory: RCAConfigFactory,
    slideFactory: RCASlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: RCAModuleOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('rca-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Introduction slide
    if (options.includeIntroduction !== false) {
      const introContent = this.dataTransformer.transformContent('kg-rca-intro');
      slides.push(this.slideFactory.createDomainSlide('rca-intro', introContent));
    }
    
    // Causal graph slide
    if (options.includeCausalGraph !== false) {
      // Determine which causal graph to use based on industry specificity
      const contentKey = options.industrySpecific ? 
        `kg-causal-graph-${options.industrySpecific}` : 
        'kg-causal-graph';
      
      const causalGraphContent = this.dataTransformer.transformContent(contentKey);
      const graphConfig = this.configFactory.createConfig(
        'graph', 
        causalGraphContent,
        { 
          interactive: options.interactiveVisualizations,
          advancedInteraction: options.advancedInteraction
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'causal-graph',
        causalGraphContent,
        { visualizationConfig: graphConfig }
      ));
    }
    
    // Methodology slide
    if (options.includeMethodology !== false) {
      const methodologyContent = this.dataTransformer.transformContent('kg-rca-methodology');
      const methodologyConfig = this.configFactory.createConfig(
        'flowDiagram',
        methodologyContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'methodology',
        methodologyContent,
        { visualizationConfig: methodologyConfig }
      ));
    }
    
    // Case study slide
    if (options.includeCaseStudy !== false) {
      // Determine which case study to use based on industry specificity
      const caseStudyKey = options.industrySpecific ? 
        `kg-case-study-${options.industrySpecific}` : 
        'kg-rca-case-study';
      
      const caseStudyContent = this.dataTransformer.transformContent(caseStudyKey);
      slides.push(this.slideFactory.createDomainSlide('case-study', caseStudyContent));
    }
    
    // Comparison slide
    if (options.includeComparison !== false) {
      const comparisonContent = this.dataTransformer.transformContent('kg-rca-comparison');
      const comparisonConfig = this.configFactory.createConfig(
        'table',
        comparisonContent,
        { sortable: true }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'comparison',
        comparisonContent,
        { visualizationConfig: comparisonConfig }
      ));
    }
    
    // Methods radar chart slide
    if (options.includeMethodsRadar) {
      const methodsContent = this.dataTransformer.transformContent('kg-rca-methods');
      const radarConfig = this.configFactory.createConfig(
        'radar',
        methodsContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'methods-radar',
        methodsContent,
        { visualizationConfig: radarConfig }
      ));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Root Cause Analysis with Knowledge Graphs',
      groupMetadata.id || 'root-cause-analysis',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['rca-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getRCASlides(options: RCAModuleOptions = {}): SlideGroup {
  const dataTransformer = new RCADataTransformer();
  const configFactory = new RCAConfigFactory();
  const slideFactory = new RCASlideFactory();
  
  const module = new RCAModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}