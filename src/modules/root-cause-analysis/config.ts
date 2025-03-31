import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class RCAConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'graph':
        return this.createCausalGraphConfig();
      case 'flowDiagram':
        return this.createMethodologyFlowConfig(data);
      case 'table':
        return this.createComparisonTableConfig();
      case 'radar':
        return this.createMethodRadarConfig(options);
      default:
        return {};
    }
  }
  
  /**
   * Creates configuration for causal graph visualizations
   */
  private createCausalGraphConfig(): any {
    return {
      layout: {
        name: 'dagre', // Directed Acyclic Graph layout
        rankDir: 'LR',
      }
    };
  }
  
  /**
   * Creates configuration for methodology flow diagrams
   */
  private createMethodologyFlowConfig(data: any): any {
    return {
      direction: data.direction || 'TB',
      layout: {
        name: 'dagre',
      }
    };
  }
  
  /**
   * Creates configuration for comparison tables
   */
  private createComparisonTableConfig(): any {
    return {
      striped: true,
      layout: {
        name: 'grid',
      }
    };
  }
  
  /**
   * Creates configuration for method radar charts
   */
  private createMethodRadarConfig(options: any): any {
    return {
      width: options?.width || 500,
      height: options?.height || 500,
      margin: options?.margin || { top: 20, right: 20, bottom: 20, left: 20 },
      layout: {
        name: 'radar',
      }
    };
  }
}