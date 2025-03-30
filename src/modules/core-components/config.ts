import { BaseConfigFactory } from '../../utils/templates/config-factory';
import { GraphVisualizationOptions } from '../../types/chart-config';

export class CoreComponentsConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch (visualizationType) {
      case 'graph':
        return this.createComponentGraphConfig(data, options);
      case 'hierarchy':
        return this.createHierarchyConfig(data, options);
      case 'table':
        return this.createComponentTableConfig(data, options);
      default:
        return {};
    }
  }
  
  private createComponentGraphConfig(data: any, options?: any): Partial<GraphVisualizationOptions> {
    // Configure visualization for component graph
    return {
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        padding: 30,
        randomize: false
      },
      nodeStyleFunction: (node: any) => {
        // Apply different styles based on node type
        if (node.type === 'Entity') {
          return { color: '#4C9AFF', shape: 'circle', size: 45 };
        } else if (node.type === 'Relation') {
          return { color: '#FF8F73', shape: 'diamond', size: 35 };
        } else if (node.type === 'Property') {
          return { color: '#79E2F2', shape: 'rectangle', size: 40 };
        } else if (node.type === 'Class') {
          return { color: '#C0B6F2', shape: 'hexagon', size: 45 };
        }
        return { color: '#4C9AFF', shape: 'circle', size: 40 }; // Default
      },
      edgeStyleFunction: (edge: any) => {
        // Apply different styles based on edge type
        if (edge.label === 'subClassOf') {
          return { style: 'solid', width: 3, color: '#6B778C' };
        } else if (edge.label === 'hasProperty') {
          return { style: 'dashed', width: 1.5, color: '#6B778C' };
        }
        return {}; // Default styling
      },
      physics: true,
      draggable: true,
      zoomable: true,
      tooltips: true,
      highlightNodes: options?.highlightNodes || []
    };
  }
  
  private createHierarchyConfig(data: any, options?: any): any {
    // Configure hierarchical visualization
    return {
      orientation: options?.orientation || 'vertical',
      nodeSpacing: 60,
      treeSpacing: 100,
      edgeStyle: {
        width: 2,
        color: '#6B778C',
        arrow: {
          to: true,
          scaleFactor: 1
        }
      },
      nodeStyle: {
        width: 160,
        height: 60,
        borderRadius: 5,
        fontSize: 14,
        textWrap: true
      },
      levelColors: [
        '#4C9AFF',  // Level 0
        '#36B37E',  // Level 1
        '#6554C0',  // Level 2
        '#FF8F73'   // Level 3
      ]
    };
  }
  
  private createComponentTableConfig(data: any, options?: any): any {
    // Configure tabular visualization
    return {
      columns: [
        { key: 'name', header: 'Component', width: '20%' },
        { key: 'type', header: 'Type', width: '15%' },
        { key: 'description', header: 'Description', width: '45%' },
        { key: 'examples', header: 'Examples', width: '20%' }
      ],
      sortable: true,
      filterable: true,
      pagination: options?.pagination || false,
      rowsPerPage: options?.rowsPerPage || 10,
      striped: true,
      highlightOnHover: true,
      cellFormatters: {
        examples: (value: any) => Array.isArray(value) ? value.join(', ') : value
      }
    };
  }
}