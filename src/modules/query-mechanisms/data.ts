import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class QueryMechanismsDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Handle different content types
    if (rawContent.type === 'query-languages-comparison') {
      return this.transformQueryLanguagesComparison(rawContent, options);
    } else if (rawContent.type === 'query-patterns') {
      return this.transformQueryPatterns(rawContent, options);
    } else if (rawContent.type === 'query-examples') {
      return this.transformQueryExamples(rawContent, options);
    } else if (rawContent.type === 'query-performance') {
      return this.transformQueryPerformance(rawContent, options);
    }
    
    // Return normalized content for other types
    return this.normalizeContent(rawContent);
  }
  
  private transformQueryLanguagesComparison(rawContent: any, options?: any): any {
    // Transform query languages comparison data
    return {
      languages: (rawContent.languages || []).map((lang: any) => ({
        name: lang.name,
        description: lang.description,
        paradigm: lang.paradigm,
        syntax: lang.syntax,
        standardization: lang.standardization,
        applicability: lang.applicability,
        example: lang.example
      })),
      comparisonMetrics: options?.comparisonMetrics || rawContent.comparisonMetrics || [],
      comparisonTable: options?.comparisonTable || rawContent.comparisonTable || [],
      showExamples: options?.showExamples ?? true,
      showSyntax: options?.showSyntax ?? true
    };
  }
  
  private transformQueryPatterns(rawContent: any, options?: any): any {
    // Transform query patterns data
    return {
      patterns: (rawContent.patterns || []).map((pattern: any) => ({
        name: pattern.name,
        description: pattern.description,
        purpose: pattern.purpose,
        applicableTo: pattern.applicableTo || [],
        examples: pattern.examples || [],
        diagram: pattern.diagram
      })),
      showDiagrams: options?.showDiagrams ?? true,
      showExamples: options?.showExamples ?? true,
      showApplicability: options?.showApplicability ?? true
    };
  }
  
  private transformQueryExamples(rawContent: any, options?: any): any {
    // Transform query examples data
    return {
      examples: (rawContent.examples || []).map((example: any) => ({
        title: example.title,
        description: example.description,
        language: example.language,
        code: example.code,
        resultPreview: example.resultPreview,
        graphData: example.graphData
      })),
      scenarios: options?.scenarios || rawContent.scenarios || [],
      showCode: options?.showCode ?? true,
      showGraphData: options?.showGraphData ?? true
    };
  }
  
  private transformQueryPerformance(rawContent: any, options?: any): any {
    // Transform query performance data
    return {
      metrics: options?.metrics || rawContent.metrics || [],
      benchmarks: options?.benchmarks || rawContent.benchmarks || [],
      optimizationTips: options?.optimizationTips || rawContent.optimizationTips || [],
      chartData: options?.chartData || rawContent.chartData || {},
      showOptimizationTips: options?.showOptimizationTips ?? true
    };
  }
  
  private normalizeContent(rawContent: any): any {
    // Default normalization for generic content
    return {
      title: rawContent.title || '',
      content: rawContent.content || '',
      metadata: rawContent.metadata || {}
    };
  }
}