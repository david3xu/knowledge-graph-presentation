import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class ComparativeAnalysisDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Determine the specific transformation to apply
    if (rawContent.comparisonType === 'relational') {
      return this.transformRelationalComparison(rawContent, options);
    } else if (rawContent.comparisonType === 'document') {
      return this.transformDocumentComparison(rawContent, options);
    } else if (rawContent.comparisonType === 'technologies') {
      return this.transformTechnologyComparison(rawContent, options);
    } else if (rawContent.useCases) {
      return this.transformUseCaseComparison(rawContent, options);
    }
    
    // Default normalization for generic content
    return this.normalizeContent(rawContent);
  }
  
  private transformRelationalComparison(rawContent: any, _options?: any): any {
    return {
      title: rawContent.title || 'Knowledge Graphs vs. Relational Databases',
      description: rawContent.description || 'Comparing the capabilities of knowledge graphs with traditional relational databases',
      comparisonPoints: rawContent.comparisonPoints || [],
      features: this.extractFeatureComparison(rawContent),
      scenarios: rawContent.scenarios || [],
      visualization: rawContent.visualization || null
    };
  }
  
  private transformDocumentComparison(rawContent: any, _options?: any): any {
    return {
      title: rawContent.title || 'Knowledge Graphs vs. Document Databases',
      description: rawContent.description || 'Comparing the capabilities of knowledge graphs with document databases',
      comparisonPoints: rawContent.comparisonPoints || [],
      features: this.extractFeatureComparison(rawContent),
      scenarios: rawContent.scenarios || [],
      visualization: rawContent.visualization || null
    };
  }
  
  private transformTechnologyComparison(rawContent: any, _options?: any): any {
    return {
      title: rawContent.title || 'Technology Comparison',
      description: rawContent.description || 'Comparison of different technologies for knowledge representation',
      technologies: rawContent.technologies || [],
      criteria: rawContent.criteria || [],
      ratings: rawContent.ratings || [],
      recommendations: rawContent.recommendations || []
    };
  }
  
  private transformUseCaseComparison(rawContent: any, _options?: any): any {
    return {
      title: rawContent.title || 'Use Case Suitability',
      description: rawContent.description || 'Comparing the suitability of different data technologies for various use cases',
      useCases: rawContent.useCases || [],
      technologies: rawContent.technologies || [],
      suitabilityMatrix: rawContent.suitabilityMatrix || [],
      bestFitExplanations: rawContent.bestFitExplanations || []
    };
  }
  
  private extractFeatureComparison(rawContent: any): any[] {
    // Extract feature comparison data
    interface Feature {
      name: string;
      kgRating: number;
      comparisonRating: number;
      description: string;
      winningTechnology: string;
    }
    
    const features: Feature[] = [];
    
    if (rawContent.features) {
      for (const feature of rawContent.features) {
        features.push({
          name: feature.name,
          kgRating: feature.kgRating || 0,
          comparisonRating: feature.comparisonRating || 0,
          description: feature.description || '',
          winningTechnology: this.determineWinner(feature.kgRating, feature.comparisonRating)
        });
      }
    }
    
    return features;
  }
  
  private determineWinner(kgRating: number, comparisonRating: number): string {
    if (kgRating > comparisonRating) return 'kg';
    if (comparisonRating > kgRating) return 'comparison';
    return 'tie';
  }
  
  private normalizeContent(rawContent: any): any {
    // Default normalization for generic content
    return {
      title: rawContent.title || '',
      description: rawContent.description || '',
      keyPoints: rawContent.keyPoints || [],
      notes: rawContent.notes || ''
    };
  }
}