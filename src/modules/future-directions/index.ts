// src/modules/future-directions/index.ts
import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { FutureDirectionsDataTransformer } from './data';
import { FutureDirectionsConfigFactory } from './config';
import { FutureDirectionsSlideFactory } from './slides';

export interface FutureDirectionsOptions {
  includeOverview?: boolean;
  includeTrends?: boolean;
  includeTechnologyRadar?: boolean;
  includeResearch?: boolean;
  includePredictions?: boolean;
  includeImpact?: boolean;
  includeRecommendations?: boolean;
  trendMapType?: 'network' | 'bubble' | 'heatmap';
  highlightTrend?: string;
  technologyRadarRings?: any[];
  technologyRadarQuadrants?: any[];
  timelineOrientation?: 'horizontal' | 'vertical';
}

export class FutureDirectionsModule extends BaseModuleTemplate<FutureDirectionsOptions> {
  protected dataTransformer: FutureDirectionsDataTransformer;
  protected configFactory: FutureDirectionsConfigFactory;
  protected slideFactory: FutureDirectionsSlideFactory;
  
  constructor(
    dataTransformer: FutureDirectionsDataTransformer,
    configFactory: FutureDirectionsConfigFactory,
    slideFactory: FutureDirectionsSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: FutureDirectionsOptions = {}): SlideGroup {
    // Set default options
    const moduleOptions: FutureDirectionsOptions = {
      includeOverview: true,
      includeTrends: true,
      includeTechnologyRadar: options.includeTechnologyRadar !== false,
      includeResearch: options.includeResearch !== false,
      includePredictions: options.includePredictions !== false,
      includeImpact: options.includeImpact !== false,
      includeRecommendations: options.includeRecommendations !== false,
      trendMapType: options.trendMapType || 'network',
      highlightTrend: options.highlightTrend,
      technologyRadarRings: options.technologyRadarRings,
      technologyRadarQuadrants: options.technologyRadarQuadrants,
      timelineOrientation: options.timelineOrientation || 'horizontal',
      ...options
    };
    
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('future-directions-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Add overview slide if requested
    if (moduleOptions.includeOverview) {
      const overviewContent = this.dataTransformer.transformContent('kg-future-overview');
      slides.push(this.slideFactory.createDomainSlide('future-overview', overviewContent));
    }
    
    // Add emerging trends slide if requested
    if (moduleOptions.includeTrends) {
      const trendsContent = this.dataTransformer.transformContent('kg-emerging-trends');
      
      // Create visualization config for trend map
      const trendMapConfig = this.configFactory.createConfig(
        'trend-map', 
        trendsContent,
        {
          mapType: moduleOptions.trendMapType
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'emerging-trends', 
        trendsContent, 
        { visualizationConfig: trendMapConfig }
      ));
    }
    
    // Add technology radar slide if requested
    if (moduleOptions.includeTechnologyRadar) {
      const techContent = this.dataTransformer.transformContent('kg-emerging-technologies');
      
      // Create visualization config for technology radar
      const radarConfig = this.configFactory.createConfig(
        'technology-radar', 
        techContent,
        {
          rings: moduleOptions.technologyRadarRings,
          quadrants: moduleOptions.technologyRadarQuadrants
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'technology-radar', 
        techContent, 
        { visualizationConfig: radarConfig }
      ));
    }
    
    // Add research frontiers slide if requested
    if (moduleOptions.includeResearch) {
      const researchContent = this.dataTransformer.transformContent('kg-research-frontiers');
      
      // Create visualization config for research network
      const networkConfig = this.configFactory.createConfig(
        'research-network', 
        researchContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'research-frontiers', 
        researchContent, 
        { visualizationConfig: networkConfig }
      ));
    }
    
    // Add future predictions slide if requested
    if (moduleOptions.includePredictions) {
      const predictionsContent = this.dataTransformer.transformContent('kg-future-predictions');
      
      // Create visualization config for future timeline
      const timelineConfig = this.configFactory.createConfig(
        'future-timeline', 
        predictionsContent,
        {
          orientation: moduleOptions.timelineOrientation
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'future-predictions', 
        predictionsContent, 
        { visualizationConfig: timelineConfig }
      ));
    }
    
    // Add impact assessment slide if requested
    if (moduleOptions.includeImpact) {
      const impactContent = this.dataTransformer.transformContent('kg-impact-assessment');
      
      // Create visualization config for impact matrix
      const matrixConfig = this.configFactory.createConfig(
        'impact-matrix', 
        impactContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'impact-assessment', 
        impactContent, 
        { visualizationConfig: matrixConfig }
      ));
    }
    
    // Add strategic recommendations slide if requested
    if (moduleOptions.includeRecommendations) {
      const recommendationsContent = this.dataTransformer.transformContent('kg-strategic-recommendations');
      slides.push(this.slideFactory.createDomainSlide('strategic-recommendations', recommendationsContent));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Future Directions in Knowledge Graphs',
      groupMetadata.id || 'future-directions',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['future-directions-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getFutureDirectionsSlides(options: FutureDirectionsOptions = {}): SlideGroup {
  const dataTransformer = new FutureDirectionsDataTransformer();
  const configFactory = new FutureDirectionsConfigFactory();
  const slideFactory = new FutureDirectionsSlideFactory();
  
  const module = new FutureDirectionsModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}