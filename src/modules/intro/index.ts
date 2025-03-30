import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { IntroDataTransformer } from './data';
import { IntroConfigFactory } from './config';
import { IntroSlideFactory } from './slides';

export interface IntroModuleOptions {
  highlightTerms?: string[];
  includeDefinitionSlide?: boolean;
  includeEvolutionSlide?: boolean;
  includeExamplesSlide?: boolean;
  titleBackground?: any;
  orientation?: 'horizontal' | 'vertical';
}

export class IntroModule extends BaseModuleTemplate<IntroModuleOptions> {
  protected dataTransformer: IntroDataTransformer;
  protected configFactory: IntroConfigFactory;
  protected slideFactory: IntroSlideFactory;
  
  constructor(
    dataTransformer: IntroDataTransformer,
    configFactory: IntroConfigFactory,
    slideFactory: IntroSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: IntroModuleOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('intro-group-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create title slide
    const titleContent = this.dataTransformer.transformContent('intro-title');
    slides.push(this.slideFactory.createDomainSlide('title', titleContent, {
      background: options.titleBackground
    }));
    
    // Conditionally add definition slide
    if (options.includeDefinitionSlide !== false) {
      const definitionContent = this.dataTransformer.transformContent('intro-definition');
      
      // Create concept graph visualization
      const conceptGraphData = this.dataTransformer.transformContent('concept-graph-data');
      const graphConfig = this.configFactory.createConfig(
        'graph', 
        conceptGraphData,
        { highlightNodes: definitionContent.focusEntities }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'definition', 
        definitionContent, 
        { 
          highlightTerms: options.highlightTerms,
          visualizationConfig: graphConfig,
          notes: 'Explain what knowledge graphs are and their fundamental characteristics.'
        }
      ));
    }
    
    // Conditionally add evolution slide
    if (options.includeEvolutionSlide !== false) {
      const evolutionContent = this.dataTransformer.transformContent('kg-evolution');
      
      // Create timeline visualization
      const timelineData = this.dataTransformer.transformContent('evolution-timeline-data');
      const timelineConfig = this.configFactory.createConfig(
        'timeline', 
        timelineData,
        { orientation: options.orientation }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'evolution', 
        evolutionContent, 
        { 
          visualizationConfig: timelineConfig,
          notes: 'Cover the historical development of knowledge graphs from semantic networks to modern applications.'
        }
      ));
    }
    
    // Conditionally add examples slide
    if (options.includeExamplesSlide) {
      const examplesContent = this.dataTransformer.transformContent('kg-examples');
      slides.push(this.slideFactory.createDomainSlide(
        'examples', 
        examplesContent,
        {
          notes: 'Showcase practical examples of knowledge graphs in use today.'
        }
      ));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Introduction to Knowledge Graphs',
      groupMetadata.id || 'intro',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['intro-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getIntroductionSlides(options: IntroModuleOptions = {}): SlideGroup {
  const dataTransformer = new IntroDataTransformer();
  const configFactory = new IntroConfigFactory();
  const slideFactory = new IntroSlideFactory();
  
  const module = new IntroModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}