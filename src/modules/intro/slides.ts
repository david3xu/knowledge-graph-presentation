import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class IntroSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'title':
        return this.createTitleSlide(content, options);
      case 'definition':
        return this.createDefinitionSlide(content, options);
      case 'evolution':
        return this.createEvolutionSlide(content, options);
      case 'examples':
        return this.createExamplesSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createTitleSlide(content: any, options?: any): SlideConfig {
    // Create title slide
    return this.createSlide(
      'intro-title',
      content.title || 'Knowledge Graphs: Connecting Data and Knowledge',
      {
        subtitle: content.subtitle || 'A Comprehensive Introduction',
        presenter: content.presenter || {}
      },
      null,
      {
        transition: 'fade',
        classes: ['title-slide'],
        background: options?.background || {
          color: '#172B4D',
          opacity: 1
        }
      }
    );
  }
  
  private createDefinitionSlide(content: any, options?: any): SlideConfig {
    // Create definition slide
    let definition = content.definition || '';
    
    // Highlight terms if specified
    if (options?.highlightTerms && Array.isArray(options.highlightTerms)) {
      options.highlightTerms.forEach((term: string) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        definition = definition.replace(regex, `<strong>${term}</strong>`);
      });
    }
    
    return this.createSlide(
      'intro-definition',
      content.title || 'What is a Knowledge Graph?',
      {
        definition,
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Explain the core concept of knowledge graphs and their key characteristics.'
      }
    );
  }
  
  private createEvolutionSlide(content: any, options?: any): SlideConfig {
    // Create evolution timeline slide
    return this.createSlide(
      'intro-evolution',
      content.title || 'Evolution of Knowledge Graphs',
      {
        definition: content.description || 'Knowledge graphs have evolved significantly over time, from early semantic networks to modern enterprise knowledge systems.'
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: options?.notes || 'Cover the key milestones in knowledge graph evolution, from semantic networks to Google Knowledge Graph and beyond.'
      }
    );
  }
  
  private createExamplesSlide(content: any, options?: any): SlideConfig {
    // Create examples slide
    return this.createSlide(
      'intro-examples',
      content.title || 'Knowledge Graph Examples',
      {
        definition: content.description || 'Knowledge graphs are used in various domains and applications.',
        listItems: [{
          title: 'Real-World Examples',
          items: content.examples || [],
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: options?.notes || 'Showcase practical examples of knowledge graphs in use today.'
      }
    );
  }
}