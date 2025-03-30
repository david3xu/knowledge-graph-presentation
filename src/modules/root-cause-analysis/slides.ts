import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class RCASlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'rca-intro':
        return this.createRCAIntroSlide(content, options);
      case 'causal-graph':
        return this.createCausalGraphSlide(content, options);
      case 'methodology':
        return this.createMethodologySlide(content, options);
      case 'case-study':
        return this.createCaseStudySlide(content, options);
      case 'comparison':
        return this.createComparisonSlide(content, options);
      case 'methods-radar':
        return this.createMethodsRadarSlide(content, options);
      default:
        throw new Error(`Unknown slide type for RCA module: ${type}`);
    }
  }
  
  /**
   * Creates an introduction slide for root cause analysis
   */
  private createRCAIntroSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'rca-introduction',
      content.title || 'Root Cause Analysis with Knowledge Graphs',
      {
        definition: content.description || 'Using knowledge graphs to identify causal relationships and determine root causes of problems.',
        keyPoints: content.keyPoints || []
      },
      null,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide introduces the concept of root cause analysis using knowledge graphs.',
        classes: ['intro-slide']
      }
    );
  }
  
  /**
   * Creates a causal graph visualization slide
   */
  private createCausalGraphSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'causal-graph',
      content.title || 'Causal Graph Analysis',
      {
        definition: content.description || 'Causal graphs represent cause-effect relationships between entities.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide demonstrates a causal graph for root cause analysis.',
        classes: ['graph-visualization-slide']
      }
    );
  }
  
  /**
   * Creates a methodology slide
   */
  private createMethodologySlide(content: any, options?: any): SlideConfig {
    // Extract step descriptions for list items
    const methodSteps = content.steps ? 
      content.steps.map((step: any) => `<strong>${step.label}:</strong> ${step.description}`) : 
      [];
    
    return this.createSlide(
      'rca-methodology',
      content.title || 'RCA Methodology',
      {
        definition: content.description || 'A structured approach to identifying the true causes of problems.',
        listItems: methodSteps.length ? [{
          title: 'Methodology Steps',
          items: methodSteps,
          type: 'numbered'
        }] : undefined
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || 'This slide outlines the methodology for performing root cause analysis.',
        classes: ['methodology-slide']
      }
    );
  }
  
  /**
   * Creates a case study slide
   */
  private createCaseStudySlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'rca-case-study',
      content.title || 'Case Study: ' + (content.industry || 'Industry Application'),
      {
        definition: content.problem || 'Problem statement for the case study.',
        listItems: [
          {
            title: 'Approach',
            items: typeof content.approach === 'string' ? [content.approach] : content.approach,
            type: 'bullet'
          },
          {
            title: 'Findings',
            items: typeof content.findings === 'string' ? [content.findings] : content.findings,
            type: 'bullet'
          },
          {
            title: 'Results',
            items: typeof content.results === 'string' ? [content.results] : content.results,
            type: 'bullet'
          }
        ]
      },
      null,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide presents a case study of root cause analysis application.',
        classes: ['case-study-slide']
      }
    );
  }
  
  /**
   * Creates a comparison slide
   */
  private createComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'rca-comparison',
      content.title || 'RCA Method Comparison',
      {
        definition: content.description || 'Comparison of different root cause analysis methods and their applications.'
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide compares different root cause analysis methods.',
        classes: ['comparison-slide']
      }
    );
  }
  
  /**
   * Creates a methods radar chart slide
   */
  private createMethodsRadarSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'rca-methods-radar',
      content.title || 'RCA Methods Comparison',
      {
        definition: content.description || 'Comparing different root cause analysis methods across key dimensions.'
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide compares different root cause analysis methods using a radar chart.',
        classes: ['radar-chart-slide']
      }
    );
  }
}