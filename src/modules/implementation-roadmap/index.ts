// src/modules/implementation-roadmap/index.ts
import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { ImplementationRoadmapDataTransformer } from './data';
import { ImplementationRoadmapConfigFactory } from './config';
import { ImplementationRoadmapSlideFactory } from './slides';

export interface ImplementationRoadmapOptions {
  includeOverview?: boolean;
  includePhases?: boolean;
  includeTimeline?: boolean;
  includeMaturityModel?: boolean;
  includeSteps?: boolean;
  includeSuccessFactors?: boolean;
  includeResources?: boolean;
  highlightPhase?: string;
  timelineOrientation?: 'horizontal' | 'vertical';
  flowDirection?: 'TB' | 'LR' | 'RL' | 'BT';
  animated?: boolean;
}

export class ImplementationRoadmapModule extends BaseModuleTemplate<ImplementationRoadmapOptions> {
  protected dataTransformer: ImplementationRoadmapDataTransformer;
  protected configFactory: ImplementationRoadmapConfigFactory;
  protected slideFactory: ImplementationRoadmapSlideFactory;
  
  constructor(
    dataTransformer: ImplementationRoadmapDataTransformer,
    configFactory: ImplementationRoadmapConfigFactory,
    slideFactory: ImplementationRoadmapSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: ImplementationRoadmapOptions = {}): SlideGroup {
    // Set default options
    const moduleOptions: ImplementationRoadmapOptions = {
      includeOverview: true,
      includePhases: true,
      includeTimeline: true,
      includeMaturityModel: options.includeMaturityModel !== false,
      includeSteps: options.includeSteps !== false,
      includeSuccessFactors: options.includeSuccessFactors !== false,
      includeResources: options.includeResources !== false,
      highlightPhase: options.highlightPhase,
      timelineOrientation: options.timelineOrientation || 'horizontal',
      flowDirection: options.flowDirection || 'TB',
      animated: options.animated !== false,
      ...options
    };
    
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('implementation-roadmap-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Add overview slide if requested
    if (moduleOptions.includeOverview) {
      const overviewContent = this.dataTransformer.transformContent('kg-implementation-overview');
      slides.push(this.slideFactory.createDomainSlide('roadmap-overview', overviewContent));
    }
    
    // Add phases slide if requested
    if (moduleOptions.includePhases) {
      const phasesContent = this.dataTransformer.transformContent('kg-implementation-phases');
      
      // Create visualization config for phases
      const phasesConfig = this.configFactory.createConfig(
        'flow-diagram', 
        {
          nodes: phasesContent.phases.map((phase: any) => ({
            id: phase.id,
            label: phase.name,
            type: 'process'
          })),
          edges: phasesContent.phaseConnections,
          flowDirection: moduleOptions.flowDirection
        },
        {
          flowDirection: moduleOptions.flowDirection,
          animated: moduleOptions.animated
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'phases-detail', 
        phasesContent, 
        { visualizationConfig: phasesConfig }
      ));
    }
    
    // Add timeline slide if requested
    if (moduleOptions.includeTimeline) {
      const timelineContent = this.dataTransformer.transformContent('kg-implementation-timeline');
      
      // Create visualization config for timeline
      const timelineConfig = this.configFactory.createConfig(
        'timeline', 
        timelineContent,
        {
          orientation: moduleOptions.timelineOrientation
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'timeline-view', 
        timelineContent, 
        { visualizationConfig: timelineConfig }
      ));
    }
    
    // Add maturity model slide if requested
    if (moduleOptions.includeMaturityModel) {
      const maturityContent = this.dataTransformer.transformContent('kg-maturity-model');
      
      // Create visualization config for maturity model
      const maturityConfig = this.configFactory.createConfig(
        'maturity-model', 
        maturityContent
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'maturity-model', 
        maturityContent, 
        { visualizationConfig: maturityConfig }
      ));
    }
    
    // Add implementation steps slide if requested
    if (moduleOptions.includeSteps) {
      const stepsContent = this.dataTransformer.transformContent('kg-implementation-steps');
      
      // Create visualization config for steps
      const stepsConfig = this.configFactory.createConfig(
        'flow-diagram', 
        {
          nodes: stepsContent.steps.map((step: any) => ({
            id: step.id,
            label: step.name,
            type: 'process'
          })),
          edges: stepsContent.connections,
          flowDirection: moduleOptions.flowDirection
        },
        {
          flowDirection: moduleOptions.flowDirection,
          animated: moduleOptions.animated
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'implementation-steps', 
        stepsContent, 
        { visualizationConfig: stepsConfig }
      ));
    }
    
    // Add critical success factors slide if requested
    if (moduleOptions.includeSuccessFactors) {
      const factorsContent = this.dataTransformer.transformContent('kg-critical-success-factors');
      slides.push(this.slideFactory.createDomainSlide('critical-success-factors', factorsContent));
    }
    
    // Add resources needed slide if requested
    if (moduleOptions.includeResources) {
      const resourcesContent = this.dataTransformer.transformContent('kg-implementation-resources');
      slides.push(this.slideFactory.createDomainSlide('resources-needed', resourcesContent));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Implementation Roadmap',
      groupMetadata.id || 'implementation-roadmap',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['implementation-roadmap-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getImplementationRoadmapSlides(options: ImplementationRoadmapOptions = {}): SlideGroup {
  const dataTransformer = new ImplementationRoadmapDataTransformer();
  const configFactory = new ImplementationRoadmapConfigFactory();
  const slideFactory = new ImplementationRoadmapSlideFactory();
  
  const module = new ImplementationRoadmapModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}