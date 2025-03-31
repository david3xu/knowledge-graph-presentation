import { BaseDataTransformer } from '../../utils/templates/data-transformer';
import { GraphData } from '../../types/graph-data';

export class RCADataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, _options?: any): any {
    // Route to appropriate transformation method based on content type
    if (rawContent.causalGraph) {
      return this.transformCausalGraphData(rawContent);
    } else if (rawContent.rcaMethodology) {
      return this.transformRCAMethodologyData(rawContent);
    } else if (rawContent.casestudy) {
      return this.transformCaseStudyData(rawContent);
    } else if (rawContent.comparisonMatrix) {
      return this.transformComparisonMatrixData(rawContent);
    }
    
    // Return normalized content for standard slide types
    return this.normalizeRCAContent(rawContent);
  }
  
  /**
   * Transforms causal graph data for visualization
   */
  private transformCausalGraphData(rawContent: any): GraphData {
    // Extract nodes from causal graph entities
    const nodes = rawContent.causalGraph.entities.map((entity: any) => ({
      id: entity.id,
      label: entity.name,
      type: entity.type || 'event',
      properties: {
        description: entity.description,
        confidence: entity.confidence,
        impact: entity.impact
      }
    }));
    
    // Extract edges from causal relationships
    const edges = rawContent.causalGraph.relationships.map((rel: any) => ({
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      label: rel.type,
      properties: {
        strength: this.mapCausalStrengthToWidth(rel.strength),
        confidence: this.mapCausalConfidenceToColor(rel.confidence),
        description: rel.description
      }
    }));
    
    return {
      nodes,
      edges,
      metadata: {
        title: rawContent.causalGraph.title,
        description: rawContent.causalGraph.description
      }
    };
  }
  
  /**
   * Transforms RCA methodology data
   */
  private transformRCAMethodologyData(rawContent: any): any {
    return {
      steps: rawContent.methodology.steps.map((step: any) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        order: step.order
      })),
      metadata: {
        title: rawContent.methodology.title,
        description: rawContent.methodology.description
      }
    };
  }
  
  /**
   * Transforms case study data
   */
  private transformCaseStudyData(rawContent: any): any {
    return {
      caseStudies: rawContent.caseStudies.map((study: any) => ({
        id: study.id,
        title: study.title,
        description: study.description,
        outcomes: study.outcomes,
        lessons: study.lessons
      })),
      metadata: {
        title: rawContent.title,
        description: rawContent.description
      }
    };
  }
  
  /**
   * Transforms comparison matrix data
   */
  private transformComparisonMatrixData(rawContent: any): any {
    return {
      methods: rawContent.comparison.methods.map((method: any) => ({
        id: method.id,
        name: method.name,
        description: method.description,
        strengths: method.strengths,
        weaknesses: method.weaknesses
      })),
      metadata: {
        title: rawContent.comparison.title,
        description: rawContent.comparison.description
      }
    };
  }
  
  /**
   * Normalizes RCA content
   */
  private normalizeRCAContent(rawContent: any): any {
    return {
      title: rawContent.title || 'Root Cause Analysis with Knowledge Graphs',
      subtitle: rawContent.subtitle,
      description: rawContent.description || '',
      keyPoints: rawContent.keyPoints || [],
      advantages: rawContent.advantages || [],
      limitations: rawContent.limitations || [],
      presenterNotes: rawContent.presenterNotes || ''
    };
  }
  
  /**
   * Maps causal strength to edge width
   */
  private mapCausalStrengthToWidth(strength: number | string): number {
    if (typeof strength === 'number') {
      // Scale from 1-5 to line width
      return 1 + Math.min(Math.max(strength, 1), 5);
    } else if (typeof strength === 'string') {
      // Map string strength to numeric values
      const strengthMap: Record<string, number> = {
        'weak': 1,
        'moderate': 2,
        'strong': 3,
        'very strong': 4,
        'definitive': 5
      };
      return 1 + (strengthMap[strength.toLowerCase()] || 2);
    }
    return 2; // Default width
  }
  
  /**
   * Maps confidence level to edge color
   */
  private mapCausalConfidenceToColor(confidence: number | string): string {
    if (typeof confidence === 'number') {
      // Color scale from red (low confidence) to green (high confidence)
      if (confidence < 0.3) return '#FF5630'; // Red
      if (confidence < 0.6) return '#FFAB00'; // Amber
      return '#36B37E'; // Green
    } else if (typeof confidence === 'string') {
      // Map string confidence to colors
      const confidenceMap: Record<string, string> = {
        'low': '#FF5630',
        'medium': '#FFAB00',
        'high': '#36B37E',
        'very high': '#00875A',
        'speculative': '#6554C0'
      };
      return confidenceMap[confidence.toLowerCase()] || '#4C9AFF';
    }
    return '#4C9AFF'; // Default color
  }
}