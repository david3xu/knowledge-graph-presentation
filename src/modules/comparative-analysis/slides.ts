import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class ComparativeAnalysisSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    id: string,
    content: any,
    options: any = {}
  ): SlideConfig {
    switch (id) {
      case 'overview':
        return this.createOverviewSlide(content, options);
      case 'relational-comparison':
        return this.createRelationalComparisonSlide(content, options);
      case 'document-comparison':
        return this.createDocumentComparisonSlide(content, options);
      case 'technology-matrix':
        return this.createTechnologyMatrixSlide(content, options);
      case 'use-case-comparison':
        return this.createUseCaseComparisonSlide(content, options);
      case 'decision-framework':
        return this.createDecisionFrameworkSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${id}`);
    }
  }
  
  private createOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'comparison-overview',
      content.title || 'Comparing Knowledge Graphs with Other Technologies',
      {
        definition: content.description || 'Understanding how knowledge graphs compare to other data technologies helps in selecting the right approach for your use case.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.notes || 'This slide introduces comparative analysis of knowledge graphs against other technologies.'
      }
    );
  }
  
  private createRelationalComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'relational-comparison',
      content.title || 'Knowledge Graphs vs. Relational Databases',
      {
        definition: content.description || 'Comparing knowledge graphs with traditional relational database systems.',
        listItems: [
          {
            title: 'Key Differences',
            items: content.comparisonPoints || [],
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide compares knowledge graphs with relational databases.'
      }
    );
  }
  
  private createDocumentComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'document-comparison',
      content.title || 'Knowledge Graphs vs. Document Databases',
      {
        definition: content.description || 'Comparing knowledge graphs with document-oriented databases.',
        listItems: [
          {
            title: 'Key Differences',
            items: content.comparisonPoints || [],
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide compares knowledge graphs with document databases.'
      }
    );
  }
  
  private createTechnologyMatrixSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'technology-matrix',
      content.title || 'Technology Comparison Matrix',
      {
        definition: content.description || 'Comparing different data technologies across key evaluation criteria.',
        subtitle: 'Rating scale: 1 (Poor) to 5 (Excellent)'
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide presents a comparative matrix of different technologies.'
      }
    );
  }
  
  private createUseCaseComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'use-case-comparison',
      content.title || 'Use Case Suitability Comparison',
      {
        definition: content.description || 'Different data technologies are suited to different use cases.',
        subtitle: 'Suitability rating: 1 (Poor) to 5 (Excellent)'
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide compares technology suitability for different use cases.'
      }
    );
  }
  
  private createDecisionFrameworkSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'decision-framework',
      content.title || 'Technology Selection Framework',
      {
        definition: content.description || 'A framework to help select the appropriate technology for your specific needs.',
        listItems: [
          {
            title: 'When to Choose Knowledge Graphs',
            items: content.kgRecommendations || [],
            type: 'bullet'
          },
          {
            title: 'When to Choose Other Technologies',
            items: content.alternativeRecommendations || [],
            type: 'bullet'
          },
          {
            title: 'When to Use Hybrid Approaches',
            items: content.hybridRecommendations || [],
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide provides guidance on when to choose different technologies.'
      }
    );
  }
}