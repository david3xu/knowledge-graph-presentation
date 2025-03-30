// src/utils/templates/slide-factory.ts

import { SlideFactory } from './base-types';
import { SlideConfig, SlideGroup, SlideContent, VisualizationType } from '../../types/slide-data';

/**
 * Base implementation of SlideFactory with standard slide patterns
 */
export abstract class BaseSlideFactory implements SlideFactory {
  /**
   * Creates a slide with standardized structure
   * @param id Slide identifier
   * @param title Slide title
   * @param content Slide content
   * @param visualizationConfig Visualization configuration
   * @param options Slide creation options
   */
  public createSlide(
    id: string,
    title: string,
    content: any,
    visualizationConfig: any = null,
    options: any = {}
  ): SlideConfig {
    // Determine visualization type from configuration
    const visualizationType = visualizationConfig ? 
      (options.visualizationType || this.inferVisualizationType(visualizationConfig)) : 
      'none';
    
    // Standard slide structure
    return {
      id,
      title,
      content: this.createSlideContent(content),
      visualizationType: visualizationType as VisualizationType,
      visualizationConfig,
      transition: options.transition || 'slide',
      notes: options.notes || '',
      classes: options.classes || [],
      background: options.background
    };
  }
  
  /**
   * Creates a slide group with standardized structure
   * @param title Group title
   * @param id Group identifier
   * @param slides Slides in the group
   * @param options Group creation options
   */
  public createSlideGroup(
    title: string,
    id: string,
    slides: SlideConfig[],
    options: any = {}
  ): SlideGroup {
    return {
      title,
      id,
      includeSectionSlide: options.includeSectionSlide !== false,
      slides,
      classes: options.classes || []
    };
  }
  
  /**
   * Creates standardized slide content
   * @param content Raw content object
   */
  protected createSlideContent(content: any): SlideContent | null {
    if (!content) return null;
    
    // Normalize slide content to match SlideContent interface
    const slideContent: SlideContent = {};
    
    // Map common fields
    if (content.definition) slideContent.definition = content.definition;
    if (content.keyPoints) slideContent.keyPoints = content.keyPoints;
    if (content.quote) slideContent.quote = content.quote;
    if (content.codeSnippets) slideContent.codeSnippets = content.codeSnippets;
    if (content.listItems) slideContent.listItems = content.listItems;
    if (content.references) slideContent.references = content.references;
    
    // Handle any additional custom content
    for (const [key, value] of Object.entries(content)) {
      if (!slideContent[key]) {
        slideContent[key] = value;
      }
    }
    
    return slideContent;
  }
  
  /**
   * Infers visualization type from configuration
   * @param config Visualization configuration
   */
  protected inferVisualizationType(config: any): VisualizationType {
    if (config.nodes && config.edges) {
      return 'graph';
    } else if (config.headers && config.rows) {
      return 'table';
    } else if (config.periods || config.events) {
      return 'timeline';
    } else if (config.from && config.to && config.direction) {
      return 'flowDiagram';
    } else if (config.text && (config.boxWidth || config.boxHeight)) {
      return 'ascii';
    }
    
    return 'none';
  }
  
  /**
   * Creates common slide types with domain-specific content
   * @param type Type of slide
   * @param content Slide content
   * @param options Slide creation options
   */
  protected abstract createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig;
}