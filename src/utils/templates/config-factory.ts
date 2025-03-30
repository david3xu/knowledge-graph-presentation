// src/utils/templates/config-factory.ts

import { ConfigFactory } from './base-types';

/**
 * Base implementation of ConfigFactory with standard configuration patterns
 */
export abstract class BaseConfigFactory implements ConfigFactory {
  /**
   * Creates appropriate configuration based on visualization type
   * @param visualizationType Type of visualization
   * @param data Data to be visualized
   * @param options Configuration options
   */
  public createConfig(visualizationType: string, data: any, options?: any): any {
    const baseConfig = this.getBaseConfig(visualizationType);
    const domainConfig = this.createDomainSpecificConfig(visualizationType, data, options);
    
    return this.extendConfig(baseConfig, domainConfig);
  }
  
  /**
   * Extends base configuration with domain-specific overrides
   * @param baseConfig Base configuration
   * @param overrides Domain-specific overrides
   */
  public extendConfig(baseConfig: any, overrides: any): any {
    // Deep merge configuration objects
    return this.deepMerge(baseConfig, overrides);
  }
  
  /**
   * Provides base configuration settings for visualization types
   * @param visualizationType Type of visualization
   */
  protected getBaseConfig(visualizationType: string): any {
    // Common configuration properties for all visualizations
    const commonConfig = {
      responsive: true,
      animationDuration: 800,
      tooltips: true,
      container: null as unknown as HTMLElement, // Set during runtime
    };
    
    // Type-specific base configurations
    switch (visualizationType) {
      case 'graph':
        return {
          ...commonConfig,
          layout: {
            padding: 30,
          },
          nodeStyle: {
            borderWidth: 2,
            opacity: 0.9,
          },
          edgeStyle: {
            width: 2,
            opacity: 0.7,
          },
          physics: true,
          draggable: true,
          zoomable: true,
        };
      
      case 'table':
        return {
          ...commonConfig,
          sortable: true,
          filterable: false,
          paginate: false,
          showRowNumbers: false,
        };

      case 'timeline':
        return {
          ...commonConfig,
          orientation: 'horizontal',
          showAxisLabels: true,
          showGrid: true,
          rowHeight: 60,
        };
      
      case 'flowDiagram':
        return {
          ...commonConfig,
          direction: 'TB',
          nodeSeparation: 60,
          levelSeparation: 120,
          autoLayout: true,
        };

      case 'ascii':
        return {
          ...commonConfig,
          boxWidth: 10,
          boxHeight: 20,
          lineColor: '#333',
          textColor: '#000',
          boxColor: '#f5f5f5',
        };
      
      default:
        return commonConfig;
    }
  }
  
  /**
   * Deep merge utility for configuration objects
   * @param target Target object
   * @param source Source object
   */
  protected deepMerge(target: any, source: any): any {
    if (!source) return target;
    
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
  }
  
  /**
   * Domain-specific configuration implementation
   * @param visualizationType Type of visualization
   * @param data Data to be visualized
   * @param options Configuration options
   */
  protected abstract createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any;
}

/**
 * Helper function to check if value is an object
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}