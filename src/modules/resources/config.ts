// src/modules/resources/config.ts
import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class ResourcesConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'resource-grid':
        return this.createResourceGridConfig(data, options);
      case 'reference-network':
        return this.createReferenceNetworkConfig(data, options);
      case 'tool-comparison':
        return this.createToolComparisonConfig(data, options);
      case 'learning-path':
        return this.createLearningPathConfig(data, options);
      case 'topic-map':
        return this.createTopicMapConfig(data, options);
      default:
        return {};
    }
  }
  
  private createResourceGridConfig(data: any, options?: any): any {
    return {
      layout: options?.layout || 'grid',
      itemsPerRow: options?.itemsPerRow || 3,
      showFilters: options?.showFilters !== false,
      showSearch: options?.showSearch !== false,
      showCategories: options?.showCategories !== false,
      itemStyle: {
        aspectRatio: '4:3',
        cornerRadius: 8,
        padding: 16,
        shadow: true,
        backgroundColor: '#FFFFFF',
        borderColor: '#DDDDDD',
        borderWidth: 1,
        hoverEffect: 'shadow',
        titleColor: '#172B4D',
        descriptionColor: '#505F79'
      },
      categoryColors: {
        course: '#36B37E', // Green
        book: '#4C9AFF',   // Blue
        video: '#6554C0',  // Purple
        article: '#FF5630', // Red
        tutorial: '#FFC400', // Yellow
        documentation: '#00B8D9', // Cyan
        tool: '#505F79'    // Gray
      },
      textLimits: {
        title: options?.titleLimit || 50,
        description: options?.descriptionLimit || 120
      }
    };
  }
  
  private createReferenceNetworkConfig(data: any, options?: any): any {
    return {
      layout: options?.layout || 'force',
      nodeSizing: 'citations',
      nodeColor: 'type',
      showLabels: options?.showLabels !== false,
      groupByCategory: options?.groupByCategory !== false,
      nodeStyle: {
        shape: 'circle',
        minSize: 20,
        maxSize: 50,
        labelPosition: 'below',
        colorScheme: [
          '#36B37E', // Journal - Green
          '#4C9AFF', // Conference - Blue
          '#6554C0', // Book - Purple
          '#FFC400', // Report - Yellow
          '#FF5630', // Website - Red
          '#00B8D9'  // Other - Cyan
        ]
      },
      linkStyle: {
        width: 1.5,
        opacity: 0.6,
        showLabels: false,
        color: '#505F79'
      },
      legend: {
        show: true,
        position: 'bottom-right',
        orientation: 'vertical'
      }
    };
  }
  
  private createToolComparisonConfig(data: any, options?: any): any {
    return {
      chartType: options?.chartType || 'radar',
      showLegend: options?.showLegend !== false,
      showToolLabels: options?.showToolLabels !== false,
      showAxisLabels: options?.showAxisLabels !== false,
      axisLabelFontSize: 12,
      toolLabelFontSize: 14,
      dimensions: options?.dimensions || [
        { name: 'Features', key: 'featureScore' },
        { name: 'Ease of Use', key: 'easeOfUseScore' },
        { name: 'Documentation', key: 'documentationScore' },
        { name: 'Community', key: 'communityScore' },
        { name: 'Performance', key: 'performanceScore' },
        { name: 'Scalability', key: 'scalabilityScore' }
      ],
      colorScheme: [
        '#36B37E', // Green
        '#4C9AFF', // Blue
        '#6554C0', // Purple
        '#FFC400', // Yellow
        '#FF5630', // Red
        '#00B8D9'  // Cyan
      ],
      gridLines: options?.gridLines !== false,
      scaleMin: 0,
      scaleMax: 5,
      scaleTicks: 5,
      fillOpacity: 0.3,
      strokeWidth: 2,
      showTable: options?.showTable || false,
      tablePlacement: options?.tablePlacement || 'below'
    };
  }
  
  private createLearningPathConfig(data: any, options?: any): any {
    return {
      orientation: options?.orientation || 'vertical',
      nodeStyle: {
        shape: 'rect',
        cornerRadius: 8,
        width: 180,
        height: 70,
        padding: 10,
        fontSize: 12,
        defaultColor: '#4C9AFF',
        textColor: '#FFFFFF',
        borderWidth: 0
      },
      edgeStyle: {
        width: 2,
        arrow: true,
        arrowSize: 10,
        color: '#505F79',
        style: 'solid'
      },
      levelColors: {
        beginner: '#36B37E',    // Green
        intermediate: '#FFC400', // Yellow
        advanced: '#FF5630'     // Red
      },
      typeIcons: options?.typeIcons !== false,
      connectorStyle: 'curved',
      animation: options?.animation || 'sequential',
      showLegend: options?.showLegend !== false,
      tooltips: options?.tooltips !== false
    };
  }
  
  private createTopicMapConfig(data: any, options?: any): any {
    return {
      mapType: options?.mapType || 'bubble',
      bubblePadding: 10,
      minBubbleSize: 40,
      maxBubbleSize: 120,
      bubbleColorScheme: [
        '#36B37E', // Green
        '#4C9AFF', // Blue
        '#6554C0', // Purple
        '#FFC400', // Yellow
        '#FF5630', // Red
        '#00B8D9', // Cyan
        '#505F79'  // Gray
      ],
      tooltips: options?.tooltips !== false,
      showLegend: options?.showLegend !== false,
      labelDisplay: options?.labelDisplay || 'all',
      labelSize: {
        min: 10,
        max: 16
      },
      animation: options?.animation !== false,
      forceStrength: options?.forceStrength || 0.3,
      clusterPadding: options?.clusterPadding || 60,
      interactive: options?.interactive !== false
    };
  }
}