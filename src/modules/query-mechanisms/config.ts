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
        direction: 'LR',
        rankSeparation: 100,
        nodeSeparation: 50,
        edgeSeparation: 20
      },
      nodeStyle: {
        shape: 'circle',
        size: 40,
        fontSize: 12,
        labelPosition: 'bottom',
        color: '#4C9AFF',
        borderColor: '#0747A6',
        borderWidth: 2
      },
      edgeStyle: {
        arrowShape: 'triangle',
        color: '#6B778C',
        width: 1.5,
        labelFontSize: 10,
        labelColor: '#172B4D',
        labelBackgroundColor: '#FFFFFF'
      },
      highlightPaths: options?.highlightPaths || [],
      animation: {
        stepByStep: true,
        duration: 500,
        delay: 200
      }
    };
  }
  
  private createResultGraphConfig(data: any, options?: any): any {
    // Create configuration for query result graph visualization
    return {
      layout: {
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 500,
        padding: 30,
        nodeRepulsion: 4500
      },
      nodeStyle: {
        shape: 'circle',
        size: 35,
        color: '#4C9AFF',
        borderColor: '#0747A6',
        borderWidth: 2,
        fontSize: 10,
        fontColor: '#172B4D',
        labelPosition: 'bottom'
      },
      edgeStyle: {
        width: 1.5,
        color: '#6B778C',
        arrowShape: 'triangle',
        arrowSize: 5,
        labelFontSize: 8,
        curvature: 0.2
      },
      highlightResults: true,
      focusOnResults: options?.focusOnResults !== false,
      interactive: options?.interactive !== false
    };
  }
  
  private createPerformanceChartConfig(data: any, options?: any): any {
    // Create configuration for performance chart visualization
    return {
      chartType: options?.chartType || 'bar',
      dimensions: {
        width: 600,
        height: 400,
        margin: { top: 20, right: 30, bottom: 60, left: 60 }
      },
      axisLabels: {
        x: options?.xAxisLabel || 'Query Type',
        y: options?.yAxisLabel || 'Execution Time (ms)'
      },
      colors: [
        '#36B37E', // SPARQL
        '#4C9AFF', // Cypher
        '#6554C0', // Gremlin
        '#FF5630'  // GraphQL
      ],
      legend: {
        position: 'bottom',
        alignment: 'center'
      },
      gridLines: true,
      animation: {
        enabled: true,
        duration: 1000
      }
    };
  }
}