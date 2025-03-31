import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class QueryMechanismsConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'query-languages-comparison':
        return this.createLanguagesComparisonConfig(data, options);
      case 'query-pattern-diagram':
        return this.createPatternDiagramConfig(data, options);
      case 'query-result-graph':
        return this.createResultGraphConfig(data, options);
      case 'performance-chart':
        return this.createPerformanceChartConfig(data, options);
      default:
        return {};
    }
  }
  
  private createLanguagesComparisonConfig(data: any, options?: any): any {
    // Create configuration for languages comparison visualization
    return {
      tableConfig: {
        headers: data.comparisonMetrics || ['Language', 'Paradigm', 'Standardization', 'Applicability'],
        columns: {
          widths: options?.columnWidths || ['20%', '20%', '20%', '40%'],
          alignment: ['left', 'center', 'center', 'left']
        },
        highlightRow: options?.highlightLanguage,
        styles: {
          headerBg: '#0747A6',
          headerColor: '#FFFFFF',
          cellPadding: 10,
          alternateRowColors: true,
          evenRowBg: '#F4F5F7',
          oddRowBg: '#FFFFFF',
          borderColor: '#DFE1E6'
        }
      },
      codeBlockConfig: {
        theme: 'dracula',
        showLineNumbers: true,
        highlightLines: options?.highlightLines || [],
        maxHeight: 200
      }
    };
  }
  
  private createPatternDiagramConfig(data: any, options?: any): any {
    // Create configuration for query pattern diagram visualization
    return {
      layout: {
        direction: data?.layout?.direction || 'LR',
        rankSeparation: data?.layout?.rankSeparation || 100,
        nodeSeparation: data?.layout?.nodeSeparation || 50,
        edgeSeparation: data?.layout?.edgeSeparation || 20
      },
      nodeStyle: {
        shape: data?.nodeStyle?.shape || 'circle',
        size: data?.nodeStyle?.size || 40,
        fontSize: data?.nodeStyle?.fontSize || 12,
        labelPosition: data?.nodeStyle?.labelPosition || 'bottom',
        color: data?.nodeStyle?.color || '#4C9AFF',
        borderColor: data?.nodeStyle?.borderColor || '#0747A6',
        borderWidth: data?.nodeStyle?.borderWidth || 2
      },
      edgeStyle: {
        arrowShape: data?.edgeStyle?.arrowShape || 'triangle',
        color: data?.edgeStyle?.color || '#6B778C',
        width: data?.edgeStyle?.width || 1.5,
        labelFontSize: data?.edgeStyle?.labelFontSize || 10,
        labelColor: data?.edgeStyle?.labelColor || '#172B4D',
        labelBackgroundColor: data?.edgeStyle?.labelBackgroundColor || '#FFFFFF'
      },
      highlightPaths: options?.highlightPaths || data?.highlightPaths || [],
      animation: {
        stepByStep: data?.animation?.stepByStep ?? true,
        duration: data?.animation?.duration || 500,
        delay: data?.animation?.delay || 200
      }
    };
  }
  
  private createResultGraphConfig(data: any, options?: any): any {
    // Create configuration for query result graph visualization
    return {
      layout: {
        name: data?.layout?.name || 'cose-bilkent',
        animate: data?.layout?.animate ?? true,
        animationDuration: data?.layout?.animationDuration || 500,
        padding: data?.layout?.padding || 30,
        nodeRepulsion: data?.layout?.nodeRepulsion || 4500
      },
      nodeStyle: {
        shape: data?.nodeStyle?.shape || 'circle',
        size: data?.nodeStyle?.size || 35,
        color: data?.nodeStyle?.color || '#4C9AFF',
        borderColor: data?.nodeStyle?.borderColor || '#0747A6',
        borderWidth: data?.nodeStyle?.borderWidth || 2,
        fontSize: data?.nodeStyle?.fontSize || 10,
        fontColor: data?.nodeStyle?.fontColor || '#172B4D',
        labelPosition: data?.nodeStyle?.labelPosition || 'bottom'
      },
      edgeStyle: {
        width: data?.edgeStyle?.width || 1.5,
        color: data?.edgeStyle?.color || '#6B778C',
        arrowShape: data?.edgeStyle?.arrowShape || 'triangle',
        arrowSize: data?.edgeStyle?.arrowSize || 5,
        labelFontSize: data?.edgeStyle?.labelFontSize || 8,
        curvature: data?.edgeStyle?.curvature || 0.2
      },
      highlightResults: data?.highlightResults ?? true,
      focusOnResults: options?.focusOnResults !== false,
      interactive: options?.interactive !== false
    };
  }
  
  private createPerformanceChartConfig(data: any, options?: any): any {
    // Create configuration for performance chart visualization
    return {
      chartType: options?.chartType || data?.chartType || 'bar',
      dimensions: {
        width: data?.width || 600,
        height: data?.height || 400,
        margin: data?.margin || { top: 20, right: 30, bottom: 60, left: 60 }
      },
      axisLabels: {
        x: options?.xAxisLabel || data?.xAxisLabel || 'Query Type',
        y: options?.yAxisLabel || data?.yAxisLabel || 'Execution Time (ms)'
      },
      colors: data?.colors || [
        '#36B37E', // SPARQL
        '#4C9AFF', // Cypher
        '#6554C0', // Gremlin
        '#FF5630'  // GraphQL
      ],
      legend: {
        position: data?.legendPosition || 'bottom',
        alignment: data?.legendAlignment || 'center'
      },
      gridLines: data?.gridLines ?? true,
      animation: {
        enabled: data?.animationEnabled ?? true,
        duration: data?.animationDuration || 1000
      }
    };
  }
}