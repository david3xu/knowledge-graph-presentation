import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class RCASlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    _options?: any
  ): SlideConfig {
    switch(type) {
      case 'rca-intro':
        return this.createRCAIntroSlide(content);
      case 'causal-graph':
        return this.createCausalGraphSlide(content);
      case 'methodology':
        return this.createMethodologySlide(content);
      case 'case-study':
        return this.createCaseStudySlide(content);
      case 'comparison':
        return this.createComparisonSlide(content);
      case 'methods-radar':
        return this.createMethodsRadarSlide(content);
      default:
        throw new Error(`Unknown slide type for RCA module: ${type}`);
    }
  }
  
  /**
   * Creates an introduction slide for root cause analysis
   */
  private createRCAIntroSlide(content: any): SlideConfig {
    return this.createSlide(
      'rca-introduction',
      content.title || 'Root Cause Analysis with Knowledge Graphs',
      {
        definition: content.description || 'An introduction to using knowledge graphs for root cause analysis',
        keyPoints: content.keyPoints || []
      },
      {
        transition: 'fade',
        notes: content.presenterNotes || "Presenter: This slide introduces the concept of using knowledge graphs for root cause analysis."
      }
    );
  }
  
  /**
   * Creates a causal graph visualization slide
   */
  private createCausalGraphSlide(content: any): SlideConfig {
    return this.createSlide(
      'causal-graph',
      content.title || 'Causal Graph Analysis',
      {
        definition: content.description || 'Visualizing causal relationships between events and factors',
        graph: content.graph || {}
      },
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide demonstrates how to analyze causal relationships using knowledge graphs."
      }
    );
  }
  
  /**
   * Creates a methodology slide
   */
  private createMethodologySlide(content: any): SlideConfig {
    return this.createSlide(
      'rca-methodology',
      content.title || 'RCA Methodology',
      {
        definition: content.description || 'A systematic approach to root cause analysis',
        steps: content.steps || []
      },
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide outlines the methodology for conducting root cause analysis."
      }
    );
  }
  
  /**
   * Creates a case study slide
   */
  private createCaseStudySlide(content: any): SlideConfig {
    return this.createSlide(
      'case-study',
      content.title || 'Case Study',
      {
        definition: content.description || 'Real-world application of knowledge graph-based RCA',
        caseStudy: content.caseStudy || {}
      },
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide presents a case study of applying knowledge graphs to root cause analysis."
      }
    );
  }
  
  /**
   * Creates a comparison slide
   */
  private createComparisonSlide(content: any): SlideConfig {
    return this.createSlide(
      'method-comparison',
      content.title || 'Method Comparison',
      {
        definition: content.description || 'Comparing different RCA methods and approaches',
        comparison: content.comparison || {}
      },
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide compares different approaches to root cause analysis."
      }
    );
  }
  
  /**
   * Creates a methods radar chart slide
   */
  private createMethodsRadarSlide(content: any): SlideConfig {
    return this.createSlide(
      'methods-radar',
      content.title || 'Methods Radar Chart',
      {
        definition: content.description || 'Multi-dimensional comparison of RCA methods',
        radar: content.radar || {}
      },
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide provides a multi-dimensional view of different RCA methods."
      }
    );
  }
}