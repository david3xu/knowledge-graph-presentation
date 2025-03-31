import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class DataModelsDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Delegate to specialized transformers based on content type
    if (rawContent.modelType === 'rdf') {
      return this.transformRdfModelData(rawContent, options);
    } else if (rawContent.modelType === 'property-graph') {
      return this.transformPropertyGraphData(rawContent, options);
    } else if (rawContent.comparisonTable) {
      return this.transformModelComparisonData(rawContent, options);
    } else if (rawContent.dataModelExamples) {
      return this.transformDataModelExamples(rawContent, options);
    }
    
    // Return normalized content for unspecialized types
    return this.normalizeContent(rawContent);
  }
  
  private transformRdfModelData(rawContent: any, options?: any): any {
    // Transform RDF data model content
    return {
      title: options?.title || rawContent.title || 'RDF Data Model',
      description: options?.description || rawContent.description || 'The Resource Description Framework (RDF) is a standard model for data interchange on the Web.',
      keyPoints: rawContent.keyPoints || [],
      examples: rawContent.examples || [],
      components: {
        subjects: rawContent.subjects || [],
        predicates: rawContent.predicates || [],
        objects: rawContent.objects || []
      },
      triples: rawContent.triples || [],
      showTriples: options?.showTriples ?? true,
      showComponents: options?.showComponents ?? true
    };
  }
  
  private transformPropertyGraphData(rawContent: any, options?: any): any {
    // Transform Property Graph data model content
    return {
      title: options?.title || rawContent.title || 'Property Graph Model',
      description: options?.description || rawContent.description || 'Property graphs store data in nodes and relationships, both of which can have properties.',
      keyPoints: rawContent.keyPoints || [],
      examples: rawContent.examples || [],
      components: {
        nodes: rawContent.nodes || [],
        relationships: rawContent.relationships || [],
        properties: rawContent.properties || []
      },
      graphStructure: rawContent.graphStructure || {},
      showGraphStructure: options?.showGraphStructure ?? true,
      showComponents: options?.showComponents ?? true
    };
  }
  
  private transformModelComparisonData(rawContent: any, options?: any): any {
    // Transform comparison data between different models
    return {
      title: options?.title || rawContent.title || 'Data Model Comparison',
      description: options?.description || rawContent.description || 'Comparison of different knowledge graph data models',
      comparisonTable: {
        headers: rawContent.comparisonTable.headers || [],
        rows: rawContent.comparisonTable.rows || []
      },
      highlightedDifferences: rawContent.highlightedDifferences || [],
      useCaseRecommendations: rawContent.useCaseRecommendations || [],
      showHighlights: options?.showHighlights ?? true,
      showRecommendations: options?.showRecommendations ?? true
    };
  }
  
  private transformDataModelExamples(rawContent: any, options?: any): any {
    // Transform example data in different models
    return {
      title: options?.title || rawContent.title || 'Data Model Examples',
      description: options?.description || rawContent.description || 'Practical examples of the same data represented in different models',
      scenario: options?.scenario || rawContent.scenario || 'Basic knowledge graph example',
      examples: rawContent.dataModelExamples.map((example: any) => ({
        modelName: example.modelName,
        modelType: example.modelType,
        representation: example.representation,
        code: example.code,
        language: example.language || 'text',
        highlights: example.highlights || []
      })),
      showHighlights: options?.showHighlights ?? true,
      showCode: options?.showCode ?? true
    };
  }
  
  private normalizeContent(rawContent: any): any {
    // Default normalization for generic content
    return {
      title: rawContent.title || '',
      description: rawContent.description || '',
      keyPoints: rawContent.keyPoints || [],
      examples: rawContent.examples || []
    };
  }
}