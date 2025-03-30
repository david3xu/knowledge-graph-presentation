import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class RCAConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'graph':
        return this.createCausalGraphConfig(data, options);
      case 'flowDiagram':
        return this.createMethodologyFlowConfig(data, options);
      case 'table':
        return this.createComparisonTableConfig(data, options);
      case 'radar':
        return this.createMethodRadarConfig(data, options);
      default:
        return {};
    }
  }
  
  /**
   * Creates configuration for causal graph visualizations
   */
  private createCausalGraphConfig(data: any, options?: any): any {
    return {
      layout: {
        name: 'dagre', // Directed Acyclic Graph layout
        rankDir: 'LR',
        align: 'UL',
        ranker: 'network-simplex',
        nodeSep: 50,
        edgeSep: 10,
        rankSep: 75
      },
      nodeStyle: {
        event: {
          shape: 'rectangle',
          color: '#4C9AFF',
          borderColor: '#0747A6',
          borderWidth: 1,
          size: 40,
          fontColor: '#172B4D'
        },
        cause: {
          shape: 'diamond',
          color: '#FF5630',
          borderColor: '#DE350B',
          borderWidth: 1,
          size: 40,
          fontColor: '#172B4D'
        },
        effect: {
          shape: 'ellipse',
          color: '#36B37E',
          borderColor: '#006644',
          borderWidth: 1,
          size: 40,
          fontColor: '#172B4D'
        },
        factor: {
          shape: 'hexagon',
          color: '#FFAB00',
          borderColor: '#FF8B00',
          borderWidth: 1,
          size: 40,
          fontColor: '#172B4D'
        }
      },
      edgeStyle: {
        arrowShape: 'triangle',
        arrowSize: 6,
        curvedEdges: true,
        textDistanceRatio: 0.6
      },
      interactivity: {
        draggable: options?.interactive !== false,
        zoomable: true,
        selectable: true,
        highlighting: true,
        tooltips: true,
        contextMenu: options?.advancedInteraction === true
      },
      animation: {
        enabled: true,
        duration: 800,
        sequentialEdges: true
      }
    };
  }
  
  /**
   * Creates configuration for methodology flow diagrams
   */
  private createMethodologyFlowConfig(data: any, options?: any): any {
    return {
      direction: data.direction || 'TB',
      align: 'center',
      rankSep: 100,
      edgeSep: 30,
      nodeSep: 50,
      nodeStyle: {
        process: {
          shape: 'rectangle',
          fillColor: '#4C9AFF',
          strokeColor: '#0747A6',
          textColor: '#FFFFFF',
          cornerRadius: 5,
          width: 160,
          height: 60
        },
        decision: {
          shape: 'diamond',
          fillColor: '#FFAB00',
          strokeColor: '#FF8B00',
          textColor: '#172B4D',
          width: 140,
          height: 70
        },
        output: {
          shape: 'parallelogram',
          fillColor: '#36B37E',
          strokeColor: '#006644',
          textColor: '#FFFFFF',
          width: 160,
          height: 60
        }
      },
      edgeStyle: {
        strokeWidth: 1.5,
        strokeColor: '#6B778C',
        textColor: '#172B4D',
        fontSize: 12,
        arrowSize: 8
      },
      animation: {
        sequential: true,
        duration: 600,
        delay: 150
      }
    };
  }
  
  /**
   * Creates configuration for comparison tables
   */
  private createComparisonTableConfig(data: any, options?: any): any {
    return {
      striped: true,
      highlightOnHover: true,
      bordered: true,
      condensed: options?.condensed === true,
      headerStyle: {
        backgroundColor: '#172B4D',
        color: '#FFFFFF',
        fontWeight: 'bold',
        padding: '10px'
      },
      cellStyle: {
        padding: '8px',
        borderBottom: '1px solid #DFE1E6',
        verticalAlign: 'top'
      },
      sortable: options?.sortable !== false,
      filterable: options?.filterable === true
    };
  }
  
  /**
   * Creates configuration for method radar charts
   */
  private createMethodRadarConfig(data: any, options?: any): any {
    return {
      width: options?.width || 500,
      height: options?.height || 400,
      radius: options?.radius || 150,
      axes: [
        { key: 'accuracy', label: 'Accuracy' },
        { key: 'complexity', label: 'Complexity' },
        { key: 'scalability', label: 'Scalability' },
        { key: 'interpretability', label: 'Interpretability' },
        { key: 'automation', label: 'Automation' }
      ],
      colors: ['#00B8D9', '#36B37E', '#6554C0', '#FF5630', '#FFAB00'],
      strokeWidth: 2,
      fillOpacity: 0.3,
      dotRadius: 4,
      gridLevels: 5,
      animation: {
        duration: 800
      },
      legend: true,
      tooltips: true
    };
  }
}