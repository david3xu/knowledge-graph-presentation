import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class ConstructionDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Check content type and route to appropriate transformation method
    if (rawContent.processSteps) {
      return this.transformProcessFlowData(rawContent, options);
    } else if (rawContent.dataSources) {
      return this.transformDataSourcesData(rawContent, options);
    } else if (rawContent.extractionMethods) {
      return this.transformExtractionMethodsData(rawContent, options);
    }
    
    // Return normalized content for standard slide types
    return this.normalizeConstructionContent(rawContent);
  }
  
  /**
   * Transforms knowledge graph construction process flow data
   */
  private transformProcessFlowData(rawContent: any, options?: any): any {
    // Create nodes for each process step
    const nodes = rawContent.processSteps.map((step: any, index: number) => ({
      id: `step-${index}`,
      label: step.name,
      type: step.type || 'process',
      properties: {
        description: step.description,
        challenges: step.challenges,
        techniques: step.techniques
      }
    }));
    
    interface Edge {
      from: string;
      to: string;
      label: string;
      style?: { dashed: boolean };
    }
    
    const edges: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        from: nodes[i].id,
        to: nodes[i + 1].id,
        label: rawContent.processSteps[i].transitionLabel || ''
      });
    }
    
    // Handle any additional connections defined in the content
    if (rawContent.additionalConnections) {
      rawContent.additionalConnections.forEach((connection: any) => {
        const sourceIndex = rawContent.processSteps.findIndex((step: any) => 
          step.name === connection.from);
        const targetIndex = rawContent.processSteps.findIndex((step: any) => 
          step.name === connection.to);
          
        if (sourceIndex !== -1 && targetIndex !== -1) {
          edges.push({
            from: `step-${sourceIndex}`,
            to: `step-${targetIndex}`,
            label: connection.label || '',
            style: { dashed: true }
          });
        }
      });
    }
    
    return {
      nodes,
      edges,
      direction: options?.direction || rawContent.direction || 'TB',
      title: options?.title || rawContent.title || 'Knowledge Graph Construction Process',
      showProperties: options?.showProperties ?? true,
      showChallenges: options?.showChallenges ?? true
    };
  }
  
  /**
   * Transforms data sources information
   */
  private transformDataSourcesData(rawContent: any, options?: any): any {
    // Transform data sources into table format
    const headers = options?.headers || ['Source Type', 'Description', 'Structure', 'Integration Complexity'];
    
    const rows = rawContent.dataSources.map((source: any) => ({
      'Source Type': source.type,
      'Description': source.description,
      'Structure': source.structure,
      'Integration Complexity': source.complexity
    }));
    
    return {
      headers,
      rows,
      title: options?.title || rawContent.title || 'Knowledge Graph Data Sources',
      description: options?.description || rawContent.description || 'Common data sources for knowledge graph construction',
      showComplexity: options?.showComplexity ?? true,
      sortable: options?.sortable ?? true
    };
  }
  
  /**
   * Transforms extraction methods data
   */
  private transformExtractionMethodsData(rawContent: any, options?: any): any {
    // Transform extraction methods into comparable format
    const methods = rawContent.extractionMethods.map((method: any) => ({
      name: method.name,
      description: method.description,
      accuracy: method.accuracy,
      scalability: method.scalability,
      useCase: method.useCase,
      limitations: method.limitations
    }));
    
    return {
      methods,
      title: options?.title || rawContent.title || 'Knowledge Extraction Methods',
      description: options?.description || rawContent.description || 'Techniques for extracting knowledge from various data sources',
      showAccuracy: options?.showAccuracy ?? true,
      showScalability: options?.showScalability ?? true,
      showLimitations: options?.showLimitations ?? true
    };
  }
  
  /**
   * Normalizes generic construction content
   */
  private normalizeConstructionContent(rawContent: any): any {
    return {
      title: rawContent.title || 'Knowledge Graph Construction',
      subtitle: rawContent.subtitle,
      description: rawContent.description || '',
      keyPoints: rawContent.keyPoints || [],
      challenges: rawContent.challenges || [],
      bestPractices: rawContent.bestPractices || [],
      presenterNotes: rawContent.presenterNotes || ''
    };
  }
}