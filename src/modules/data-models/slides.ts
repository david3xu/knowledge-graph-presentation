import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class DataModelsSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch (type) {
      case 'overview':
        return this.createOverviewSlide(content, options);
      case 'rdf-model':
        return this.createRdfModelSlide(content, options);
      case 'property-graph-model':
        return this.createPropertyGraphModelSlide(content, options);
      case 'model-comparison':
        return this.createModelComparisonSlide(content, options);
      case 'example-comparison':
        return this.createExampleComparisonSlide(content, options);
      case 'practical-usage':
        return this.createPracticalUsageSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'data-models-overview',
      content.title || 'Knowledge Graph Data Models',
      {
        definition: content.description || 'Knowledge graphs can be implemented using different data models, each with unique characteristics.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.notes || 'This slide introduces the different data models used for knowledge graphs.'
      }
    );
  }
  
  private createRdfModelSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'rdf-model',
      content.title || 'RDF Data Model',
      {
        definition: content.description || 'The Resource Description Framework (RDF) is based on subject-predicate-object triples.',
        keyPoints: content.keyPoints || [],
        codeSnippets: content.examples ? content.examples.map((ex: any) => ({
          language: ex.language || 'turtle',
          code: ex.code,
          caption: ex.caption || 'RDF Example'
        })) : []
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide explains the RDF data model for knowledge graphs.'
      }
    );
  }
  
  private createPropertyGraphModelSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'property-graph-model',
      content.title || 'Property Graph Model',
      {
        definition: content.description || 'Property graphs store data in nodes and relationships, both with properties.',
        keyPoints: content.keyPoints || [],
        codeSnippets: content.examples ? content.examples.map((ex: any) => ({
          language: ex.language || 'cypher',
          code: ex.code,
          caption: ex.caption || 'Property Graph Example'
        })) : []
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide explains the property graph model for knowledge graphs.'
      }
    );
  }
  
  private createModelComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'model-comparison',
      content.title || 'Data Model Comparison',
      {
        definition: content.description || 'Comparing different knowledge graph data models to understand their strengths and limitations.',
        tables: [{
          headers: content.comparisonTable?.headers || [],
          data: content.comparisonTable?.rows || [],
          caption: 'Data Model Comparison'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide compares different knowledge graph data models.'
      }
    );
  }
  
  private createExampleComparisonSlide(content: any, options?: any): SlideConfig {
    const codeSnippets = content.examples ? 
      content.examples.map((ex: any) => ({
        language: ex.language || 'text',
        code: ex.code,
        caption: `${ex.modelName} Representation`
      })) : [];
    
    return this.createSlide(
      'example-comparison',
      content.title || 'Same Data, Different Models',
      {
        definition: content.description || 'The same knowledge can be represented differently in various data models.',
        subtitle: content.scenario || 'Example scenario',
        codeSnippets
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide shows how the same knowledge graph data looks in different models.'
      }
    );
  }
  
  private createPracticalUsageSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'practical-usage',
      content.title || 'Practical Model Selection',
      {
        definition: content.description || 'Guidelines for selecting the appropriate data model for your knowledge graph.',
        listItems: [
          {
            title: 'Use Cases for RDF',
            items: content.rdfUseCases || [
              'Open knowledge with standard vocabularies',
              'Semantic Web integration',
              'Data that requires reasoning capabilities',
              'Highly interconnected public datasets'
            ],
            type: 'bullet'
          },
          {
            title: 'Use Cases for Property Graphs',
            items: content.propertyGraphUseCases || [
              'Enterprise knowledge graphs',
              'Graph analytics applications',
              'Path-finding and traversal operations',
              'Systems with complex relationship properties'
            ],
            type: 'bullet'
          }
        ]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide provides guidance on when to use each data model.'
      }
    );
  }
}