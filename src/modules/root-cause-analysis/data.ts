import { BaseDataTransformer } from '../../utils/templates/data-transformer';
import { GraphData } from '../../types/graph-data';

export class RCADataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Route to appropriate transformation method based on content type
    if (rawContent.causalGraph) {
      return this.transformCausalGraphData(rawContent, options);
    } else if (rawContent.rcaMethodology) {
      return this.transformRCAMethodologyData(rawContent, options);
    } else if (rawContent.casestudy) {
      return this.transformCaseStudyData(rawContent, options);
    } else if (rawContent.comparisonMatrix) {
      return this.transformComparisonMatrixData(rawContent, options);
    }
    
    // Return normalized content for standard slide types
    return this.normalizeRCAContent(rawContent);
  }
  
  /**
   * Transforms causal graph data for visualization
   */
  private transformCausalGraphData(rawContent: any, options?: any): GraphData {
    // Extract nodes from causal graph entities
    const nodes = rawContent.causalGraph.entities.map((entity: any) => ({
      id: entity.id,
      label: entity.name,
      type: entity.type || 'event',
      properties: {
        description: entity.description,
        impact: entity.impact,
        probability: entity.probability,
        category: entity.category
      }
    }));
    
    // Extract edges from causal relationships
    const edges = rawContent.causalGraph.relationships.map((rel: any) => ({
      source: rel.source,
      target: rel.target,
      label: rel.type || 'causes',
      directed: true,
      properties: {
        description: rel.description,
        strength: rel.strength,
        confidence: rel.confidence,
        evidence: rel.evidence
      },
      style: {
        width: this.mapCausalStrengthToWidth(rel.strength),
        color: this.mapCausalConfidenceToColor(rel.confidence)
      }
    }));
    
    return {
      nodes,
      edges,
      metadata: {
        name: rawContent.title || 'Causal Analysis Graph',
        description: rawContent.description || 'Causal relationships between entities'
      }
    };
  }
  
  /**
   * Transforms RCA methodology data
   */
  private transformRCAMethodologyData(rawContent: any, options?: any): any {
    const steps = rawContent.rcaMethodology.steps.map((step: any, index: number) => ({
      id: `step-${index + 1}`,
      label: step.name,
      type: step.type || 'process',
      description: step.description,
      techniques: step.techniques || [],
      outputs: step.outputs || []
    }));
    
    return {
      title: rawContent.title || 'Root Cause Analysis Methodology',
      description: rawContent.description || 'A systematic approach to identifying causes of problems',
      steps,
      direction: rawContent.rcaMethodology.direction || 'TB'
    };
  }
  
  /**
   * Transforms case study data
   */
  private transformCaseStudyData(rawContent: any, options?: any): any {
    return {
      title: rawContent.casestudy.title || 'RCA Case Study',
      industry: rawContent.casestudy.industry,
      problem: rawContent.casestudy.problem,
      approach: rawContent.casestudy.approach,
      findings: rawContent.casestudy.findings,
      solution: rawContent.casestudy.solution,
      results: rawContent.casestudy.results,
      keyLessons: rawContent.casestudy.keyLessons || []
    };
  }
  
  /**
   * Transforms comparison matrix data
   */
  private transformComparisonMatrixData(rawContent: any, options?: any): any {
    const headers = ['Method', 'Approach', 'Strengths', 'Limitations', 'Best For'];
    
    const rows = rawContent.comparisonMatrix.methods.map((method: any) => ({
      'Method': method.name,
      'Approach': method.approach,
      'Strengths': method.strengths,
      'Limitations': method.limitations,
      'Best For': method.bestFor
    }));
    
    return {
      headers,
      rows,
      title: rawContent.title || 'RCA Method Comparison',
      description: rawContent.description || 'Comparing different root cause analysis methods'
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