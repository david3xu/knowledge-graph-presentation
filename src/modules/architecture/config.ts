import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class ArchitectureConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'architecture-layers':
        return this.createLayersConfig(data, options);
      case 'technology-matrix':
        return this.createTechnologyMatrixConfig(data, options);
      case 'deployment-diagram':
        return this.createDeploymentDiagramConfig(data, options);
      default:
        return {};
    }
  }
  
  private createLayersConfig(data: any, options?: any): any {
    // Create configuration for architecture layers visualization
    return {
      layout: {
        direction: options?.direction || 'TB',
        layerSpacing: 60,
        nodeSpacing: 30
      },
      nodeStyle: {
        width: 250,
        height: 60,
        cornerRadius: 5,
        fontSize: 14,
        fontColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#0747A6'
      },
      edgeStyle: {
        width: 2,
        color: '#6B778C',
        arrowSize: 10,
        lineStyle: 'solid'
      },
      colorMapping: {
        'data-layer': '#36B37E',
        'storage-layer': '#4C9AFF',
        'processing-layer': '#6554C0',
        'application-layer': '#FF5630',
        'integration-layer': '#00C7E6'
      },
      animation: {
        sequential: true,
        duration: 800
      },
      // Use data for dynamic configuration
      layers: data?.layers || [],
      connections: data?.connections || []
    };
  }
  
  private createTechnologyMatrixConfig(data: any, options?: any): any {
    // Create configuration for technology matrix visualization
    return {
      cellSize: {
        width: options?.cellWidth || 200,
        height: options?.cellHeight || 100
      },
      headerHeight: options?.headerHeight || 40,
      padding: options?.padding || 10,
      fontSize: {
        header: options?.headerFontSize || 14,
        cell: options?.cellFontSize || 12
      },
      colorMapping: {
        maturity: {
          'experimental': '#FF8B00',
          'emerging': '#FFAB00',
          'stable': '#36B37E',
          'mature': '#00875A'
        },
        type: {
          'opensource': '#4C9AFF',
          'commercial': '#6554C0',
          'hybrid': '#8777D9'
        }
      },
      borders: options?.borders ?? true,
      interactive: options?.interactive ?? true,
      highlightOnHover: options?.highlightOnHover ?? true,
      // Use data for dynamic configuration
      technologies: data?.technologies || [],
      categories: data?.categories || []
    };
  }
  
  private createDeploymentDiagramConfig(data: any, options?: any): any {
    // Create configuration for deployment diagram visualization
    return {
      layout: {
        direction: options?.direction || 'TB',
        rankSeparation: options?.rankSeparation || 80,
        nodeSeparation: options?.nodeSeparation || 50
      },
      nodeStyle: {
        width: options?.nodeWidth || 180,
        height: options?.nodeHeight || 60,
        iconSize: options?.iconSize || 24,
        fontSize: options?.fontSize || 12,
        cornerRadius: options?.cornerRadius || 5,
        padding: options?.padding || 10
      },
      edgeStyle: {
        width: options?.edgeWidth || 1.5,
        color: options?.edgeColor || '#6B778C',
        arrowSize: options?.arrowSize || 8,
        fontSize: options?.edgeFontSize || 10
      },
      iconMapping: {
        'database': 'database',
        'server': 'server',
        'cloud': 'cloud',
        'application': 'app',
        'container': 'container',
        'api': 'code'
      },
      colorMapping: {
        'infrastructure': '#4C9AFF',
        'data': '#36B37E',
        'service': '#6554C0',
        'application': '#FF5630',
        'integration': '#00C7E6'
      },
      // Use data for dynamic configuration
      nodes: data?.nodes || [],
      edges: data?.edges || []
    };
  }
}