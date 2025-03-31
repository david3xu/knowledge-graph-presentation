// src/modules/future-directions/config.ts
import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class FutureDirectionsConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    _data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'trend-map':
        return this.createTrendMapConfig(_data, options);
      case 'technology-radar':
        return this.createTechnologyRadarConfig(_data, options);
      case 'research-network':
        return this.createResearchNetworkConfig(_data, options);
      case 'future-timeline':
        return this.createFutureTimelineConfig(_data, options);
      case 'impact-matrix':
        return this.createImpactMatrixConfig(_data, options);
      default:
        return {};
    }
  }
  
  private createTrendMapConfig(_data: any, options?: any): any {
    return {
      mapType: options?.mapType || 'network',
      nodeSizing: options?.nodeSizing || 'impact', // Size nodes based on impact
      clusterByCategory: options?.clusterByCategory !== false,
      legendPosition: options?.legendPosition || 'bottom-right',
      nodeStyle: {
        shape: 'circle',
        minSize: 30,
        maxSize: 80,
        borderWidth: 2,
        labelPosition: 'below',
        colorScheme: [
          '#36B37E', // Green - high maturity
          '#4C9AFF', // Blue - medium maturity
          '#6554C0', // Purple - low maturity
          '#FFC400', // Yellow
          '#FF5630'  // Red
        ]
      },
      linkStyle: {
        width: 2,
        opacity: 0.7,
        curved: true,
        showLabels: options?.showLinkLabels !== false,
        labelFontSize: 10
      },
      interaction: {
        zoom: true,
        drag: true,
        tooltips: true,
        highlighting: true
      }
    };
  }
  
  private createTechnologyRadarConfig(_data: any, options?: any): any {
    return {
      rings: options?.rings || [
        { name: 'Adopt', description: 'Technologies ready for mainstream use' },
        { name: 'Trial', description: 'Technologies ready for real-world testing' },
        { name: 'Assess', description: 'Technologies worth exploring' },
        { name: 'Hold', description: 'Technologies to monitor cautiously' }
      ],
      quadrants: options?.quadrants || [
        { name: 'Integration Technologies', description: 'Tools for connecting data sources' },
        { name: 'Knowledge Representation', description: 'Technologies for modeling knowledge' },
        { name: 'Analysis & Inference', description: 'Technologies for deriving insights' },
        { name: 'Interaction & Access', description: 'Technologies for using knowledge graphs' }
      ],
      showDescriptions: options?.showDescriptions !== false,
      showLegend: options?.showLegend !== false,
      blipStyle: {
        minSize: 12,
        maxSize: 24,
        opacity: 0.8,
        border: true,
        colorByQuadrant: true,
        colorScheme: [
          '#36B37E', // Green
          '#4C9AFF', // Blue
          '#6554C0', // Purple
          '#FFC400'  // Yellow
        ]
      },
      interaction: {
        tooltips: true,
        highlighting: true,
        filtering: options?.filtering !== false
      }
    };
  }
  
  private createResearchNetworkConfig(_data: any, options?: any): any {
    return {
      layout: options?.layout || 'force',
      nodeSizing: 'publications',
      nodeColor: 'domain',
      showLabels: options?.showLabels !== false,
      groupClusters: options?.groupClusters !== false,
      nodeStyle: {
        shape: 'circle',
        minSize: 20,
        maxSize: 60,
        labelPosition: 'right',
        colorScheme: [
          '#36B37E', // Green
          '#4C9AFF', // Blue
          '#6554C0', // Purple
          '#FFC400', // Yellow
          '#FF5630', // Red
          '#00B8D9', // Cyan
          '#6B778C'  // Gray
        ]
      },
      linkStyle: {
        width: 1.5,
        opacity: 0.6,
        showLabels: false,
        colorMode: 'gradient'
      },
      legend: {
        show: true,
        position: 'bottom-left',
        orientation: 'vertical'
      }
    };
  }
  
  private createFutureTimelineConfig(_data: any, options?: any): any {
    return {
      orientation: options?.orientation || 'horizontal',
      timeAxis: {
        position: 'bottom',
        tickFormat: options?.tickFormat || '%Y',
        showAxis: true,
        showGrid: true
      },
      predictions: {
        shape: 'rect',
        height: 60,
        minWidth: 100,
        borderRadius: 4,
        colorByProbability: true,
        labelPosition: 'middle',
        probabilityRamp: [
          { threshold: 0.2, color: '#FF5630' }, // Low probability - Red
          { threshold: 0.5, color: '#FFC400' }, // Medium probability - Yellow
          { threshold: 0.8, color: '#36B37E' }  // High probability - Green
        ]
      },
      milestones: {
        shape: 'circle',
        size: 12,
        color: '#000000'
      },
      showToday: options?.showToday !== false,
      showLegend: options?.showLegend !== false,
      interaction: {
        zoom: true,
        pan: true,
        tooltips: true
      }
    };
  }
  
  private createImpactMatrixConfig(_data: any, options?: any): any {
    return {
      axes: {
        x: {
          title: options?.xTitle || 'Time Horizon',
          min: 0,
          max: 10,
          ticks: options?.xTicks || ['Near-term', 'Mid-term', 'Long-term'],
          gridLines: true
        },
        y: {
          title: options?.yTitle || 'Potential Impact',
          min: 0,
          max: 10,
          ticks: options?.yTicks || ['Low', 'Medium', 'High'],
          gridLines: true
        }
      },
      bubbles: {
        minSize: 40,
        maxSize: 100,
        sizeBy: options?.sizeBy || 'probability',
        colorBy: options?.colorBy || 'category',
        opacity: 0.7,
        border: true,
        showLabels: options?.showLabels !== false,
        labelPosition: 'center'
      },
      quadrants: [
        { name: 'Monitor', description: 'Low impact, longer term' },
        { name: 'Prepare', description: 'High impact, longer term' },
        { name: 'Consider', description: 'Low impact, near term' },
        { name: 'Act', description: 'High impact, near term' }
      ],
      showQuadrantLabels: options?.showQuadrantLabels !== false,
      showLegend: options?.showLegend !== false,
      interaction: {
        tooltips: true,
        highlighting: true,
        filtering: options?.filtering !== false
      }
    };
  }
}