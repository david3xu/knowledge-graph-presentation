import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class IndustryApplicationsSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'industry-overview':
        return this.createIndustryOverviewSlide(content, options);
      case 'industry-matrix':
        return this.createIndustryMatrixSlide(content, options);
      case 'use-cases':
        return this.createUseCasesSlide(content, options);
      case 'industry-detail':
        return this.createIndustryDetailSlide(content, options);
      case 'case-study':
        return this.createCaseStudySlide(content, options);
      case 'metrics-comparison':
        return this.createMetricsComparisonSlide(content, options);
      default:
        throw new Error(`Unknown slide type for Industry Applications module: ${type}`);
    }
  }
  
  /**
   * Creates an industry overview slide
   */
  private createIndustryOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'industry-overview',
      content.title || 'Industry Applications of Knowledge Graphs',
      {
        definition: content.description || 'Knowledge graphs are applied across diverse industries to solve domain-specific challenges.',
        keyPoints: content.keyPoints || []
      },
      null,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide introduces knowledge graph applications across different industries.',
        classes: ['overview-slide']
      }
    );
  }
  
  /**
   * Creates an industry matrix comparison slide
   */
  private createIndustryMatrixSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'industry-matrix',
      content.title || 'Knowledge Graph Capabilities by Industry',
      {
        definition: content.description || 'Comparing knowledge graph capabilities and their relevance across industries.'
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide presents a matrix view of knowledge graph capabilities across industries.',
        classes: ['matrix-slide']
      }
    );
  }
  
  /**
   * Creates a use cases slide
   */
  private createUseCasesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'use-cases',
      content.title || 'Knowledge Graph Use Cases by Industry',
      {
        definition: content.description || 'Common applications of knowledge graphs across different sectors.'
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide showcases common use cases for knowledge graphs across industries.',
        classes: ['use-cases-slide']
      }
    );
  }
  
  /**
   * Creates an industry detail slide
   */
  private createIndustryDetailSlide(content: any, options?: any): SlideConfig {
    // Format industry applications as list items
    const applications = content.keyApplications ? [{
      title: 'Key Applications',
      items: content.keyApplications.map((app: any) => 
        typeof app === 'string' ? app : `<strong>${app.name}</strong>: ${app.description}`
      ),
      type: 'bullet'
    }] : undefined;
    
    return this.createSlide(
      `industry-${content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      content.title || 'Industry-Specific Applications',
      {
        definition: content.description || 'How knowledge graphs address specific industry challenges.',
        listItems: applications
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || `This slide details knowledge graph applications in ${content.title}.`,
        classes: ['industry-detail-slide']
      }
    );
  }
  
  /**
   * Creates a case study slide
   */
  private createCaseStudySlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'case-study',
      content.title || `Case Study: ${content.organization || content.industry}`,
      {
        definition: content.challenge || 'A real-world application of knowledge graphs.',
        listItems: [
          {
            title: 'Solution',
            items: [content.solution],
            type: 'bullet'
          },
          {
            title: 'Results',
            items: typeof content.results === 'string' ? [content.results] : content.results,
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide presents a case study of knowledge graph application in industry.',
        classes: ['case-study-slide']
      }
    );
  }
  
  /**
   * Creates a metrics comparison slide
   */
  private createMetricsComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'metrics-comparison',
      content.title || 'ROI and Benefits by Industry',
      {
        definition: content.description || 'Comparing the return on investment and benefits of knowledge graphs across industries.'
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide compares the metrics and benefits of knowledge graphs across industries.',
        classes: ['metrics-slide']
      }
    );
  }
}