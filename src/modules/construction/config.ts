import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class ConstructionConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'flowDiagram':
        return this.createProcessFlowConfig(data, options);
      case 'table':
        return this.createDataSourcesTableConfig(data, options);
      case 'barChart':
        return this.createExtractionMethodsChartConfig(data, options);
      default:
        return {};
    }
  }
  
  /**
   * Creates configuration for process flow diagrams
   */
  private createProcessFlowConfig(data: any, options?: any): any {
    return {
      direction: data.direction || 'TB',
      nodeSeparation: 80,
      levelSeparation: 150,
      nodeStyle: {
        process: {
          shape: 'rectangle',
          fillColor: '#36B37E',
          strokeColor: '#006644',
          textColor: '#FFFFFF',
          cornerRadius: 5,
          width: 180,
          height: 60
        },
        decision: {
          shape: 'diamond',
          fillColor: '#FFAB00',
          strokeColor: '#FF8B00',
          textColor: '#172B4D',
          width: 160,
          height: 80
        },
        io: {
          shape: 'parallelogram',
          fillColor: '#4C9AFF',
          strokeColor: '#0747A6',
          textColor: '#FFFFFF',
          width: 180,
          height: 60
        },
        start: {
          shape: 'circle',
          fillColor: '#6554C0',
          strokeColor: '#403294',
          textColor: '#FFFFFF',
          width: 60,
          height: 60
        },
        end: {
          shape: 'circle',
          fillColor: '#FF5630',
          strokeColor: '#DE350B',
          textColor: '#FFFFFF',
          width: 60,
          height: 60
        }
      },
      edgeStyle: {
        strokeWidth: 2,
        strokeColor: '#6B778C',
        textColor: '#172B4D',
        fontSize: 12,
        arrowSize: 10
      },
      animation: {
        sequential: true,
        duration: 800,
        delay: 200
      },
      interaction: {
        tooltips: true,
        highlighting: true,
        draggable: options?.interactive !== false
      }
    };
  }
  
  /**
   * Creates configuration for data sources table
   */
  private createDataSourcesTableConfig(data: any, options?: any): any {
    return {
      headers: data.headers,
      headerStyle: {
        backgroundColor: '#172B4D',
        color: '#FFFFFF',
        fontWeight: 'bold',
        padding: '12px'
      },
      rowStyle: {
        evenRows: {
          backgroundColor: '#F4F5F7'
        },
        oddRows: {
          backgroundColor: '#FFFFFF'
        },
        hover: {
          backgroundColor: '#E6EFFC'
        }
      },
      cellStyle: {
        padding: '10px',
        borderBottom: '1px solid #DFE1E6'
      },
      sortable: options?.sortable !== false,
      filterable: options?.filterable === true,
      rowHighlighting: options?.rowHighlighting !== false,
      cellHighlighting: options?.cellHighlighting || []
    };
  }
  
  /**
   * Creates configuration for extraction methods chart
   */
  private createExtractionMethodsChartConfig(data: any, options?: any): any {
    return {
      width: options?.width || 700,
      height: options?.height || 400,
      margin: {
        top: 30,
        right: 30,
        bottom: 70,
        left: 60
      },
      xAxisLabel: 'Extraction Method',
      yAxisLabel: 'Accuracy (%)',
      barColor: '#36B37E',
      barHoverColor: '#00875A',
      labelRotation: -45,
      labelOffset: 6,
      animation: {
        duration: 800,
        delay: 50
      },
      tooltips: true,
      grid: true,
      legend: false
    };
  }
}