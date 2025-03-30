import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class ConstructionSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string,
    content: any,
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'process-overview':
        return this.createProcessOverviewSlide(content, options);
      case 'data-sources':
        return this.createDataSourcesSlide(content, options);
      case 'extraction-methods':
        return this.createExtractionMethodsSlide(content, options);
      case 'best-practices':
        return this.createBestPracticesSlide(content, options);
      case 'challenges':
        return this.createChallengesSlide(content, options);
      default:
        throw new Error(`Unknown slide type for Construction module: ${type}`);
    }
  }
  
  /**
   * Creates a process overview slide with flow diagram
   */
  private createProcessOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'construction-process',
      content.title || 'Knowledge Graph Construction Process',
      {
        definition: content.description || 'The process of building a knowledge graph involves several key steps.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide shows the overall process of constructing a knowledge graph.',
        classes: ['process-flow-slide']
      }
    );
  }
  
  /**
   * Creates a data sources comparison slide
   */
  private createDataSourcesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'data-sources',
      content.title || 'Knowledge Graph Data Sources',
      {
        definition: content.description || 'Knowledge graphs can be constructed from various data sources.',
        listItems: content.additionalInfo ? [{
          title: 'Key Considerations',
          items: content.additionalInfo,
          type: 'bullet'
        }] : undefined
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide compares different data sources for knowledge graph construction.',
        classes: ['comparison-slide']
      }
    );
  }
  
  /**
   * Creates an extraction methods slide
   */
  private createExtractionMethodsSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'extraction-methods',
      content.title || 'Knowledge Extraction Methods',
      {
        definition: content.description || 'Various methods can be used to extract structured knowledge from data sources.',
        listItems: content.methods ? [{
          title: 'Common Methods',
          items: content.methods.map((m: any) => `<strong>${m.name}</strong>: ${m.description}`),
          type: 'bullet'
        }] : undefined
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide outlines different approaches to knowledge extraction.',
        classes: ['methods-slide']
      }
    );
  }
  
  /**
   * Creates a best practices slide
   */
  private createBestPracticesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'best-practices',
      content.title || 'Knowledge Graph Construction Best Practices',
      {
        definition: content.description || 'Follow these best practices to build effective knowledge graphs.',
        listItems: [{
          title: '',
          items: content.bestPractices || [],
          type: 'numbered'
        }]
      },
      null,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide highlights best practices for knowledge graph construction.',
        classes: ['best-practices-slide']
      }
    );
  }
  
  /**
   * Creates a challenges slide
   */
  private createChallengesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'construction-challenges',
      content.title || 'Challenges in Knowledge Graph Construction',
      {
        definition: content.description || 'Building knowledge graphs presents several challenges that must be addressed.',
        listItems: [{
          title: '',
          items: content.challenges || [],
          type: 'bullet'
        }]
      },
      null,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide outlines common challenges in knowledge graph construction.',
        classes: ['challenges-slide']
      }
    );
  }
}