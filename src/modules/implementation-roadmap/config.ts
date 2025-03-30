// src/modules/implementation-roadmap/config.ts
import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class ImplementationRoadmapConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'flow-diagram':
        return this.createFlowDiagramConfig(data, options);
      case 'timeline':
        return this.createTimelineConfig(data, options);
      case 'maturity-model':
        return this.createMaturityModelConfig(data, options);
      case 'gantt':
        return this.createGanttChartConfig(data, options);
      default:
        return {};
    }
  }
  
  private createFlowDiagramConfig(data: any, options?: any): any {
    return {
      direction: data.flowDirection || options?.flowDirection || 'TB',
      nodeSpacing: 60,
      rankSpacing: 80,
      edgeLabels: true,
      nodeStyle: {
        shape: 'rect',
        cornerRadius: 5,
        width: 180,
        height: 60,
        fontSize: 12,
        padding: 10,
        borderWidth: 1,
        defaultColor: '#36B37E',
        highlightColor: '#FF5630',
        textColor: '#FFFFFF'
      },
      edgeStyle: {
        width: 2,
        arrow: true,
        arrowSize: 10,
        color: '#505F79',
        highlightColor: '#FF5630',
        style: 'solid',
        labelFontSize: 10
      },
      animated: options?.animated !== false,
      interactable: options?.interactable !== false,
      tooltips: options?.tooltips !== false,
      fitView: options?.fitView !== false
    };
  }
  
  private createTimelineConfig(data: any, options?: any): any {
    return {
      orientation: options?.orientation || 'horizontal',
      axisPosition: options?.axisPosition || 'middle',
      itemSpacing: 20,
      markerWidth: 200,
      markerHeight: 80,
      lineColor: '#4C9AFF',
      markerColor: '#253858',
      markerTextColor: '#FFFFFF',
      markerBorderRadius: 4,
      milestoneRadius: 8,
      milestoneColor: '#FF5630',
      showLabels: options?.showLabels !== false,
      labelPlacement: options?.labelPlacement || 'alternate',
      animateOnScroll: options?.animateOnScroll !== false,
      colorScheme: options?.colorScheme || [
        '#36B37E', // Green
        '#4C9AFF', // Blue
        '#FFC400', // Yellow
        '#6554C0', // Purple
        '#FF5630'  // Red
      ]
    };
  }
  
  private createMaturityModelConfig(data: any, options?: any): any {
    return {
      chartType: options?.chartType || 'radar',
      showLabels: options?.showLabels !== false,
      showValues: options?.showValues !== false,
      showLegend: options?.showLegend !== false,
      highlightCurrentLevel: options?.highlightCurrentLevel !== false,
      highlightTargetLevel: options?.highlightTargetLevel !== false,
      currentLevelColor: '#36B37E', // Green
      targetLevelColor: '#4C9AFF', // Blue
      levelColorScale: [
        '#FF5630', // Level 1 - Red
        '#FFC400', // Level 2 - Yellow
        '#36B37E', // Level 3 - Green
        '#4C9AFF', // Level 4 - Blue
        '#6554C0'  // Level 5 - Purple
      ],
      fontSize: {
        labels: 12,
        values: 10,
        title: 14
      },
      padding: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
      }
    };
  }
  
  private createGanttChartConfig(data: any, options?: any): any {
    return {
      timeFormat: options?.timeFormat || '%Y-%m',
      showToday: options?.showToday !== false,
      barHeight: 30,
      barPadding: 5,
      headerHeight: 50,
      axisLabelSpacing: 80,
      showProgress: options?.showProgress !== false,
      showDependencies: options?.showDependencies !== false,
      dependencyColor: '#505F79',
      colorMapping: {
        phase: '#36B37E',
        milestone: '#FF5630',
        task: '#4C9AFF',
        deliverable: '#FFC400'
      },
      tooltips: options?.tooltips !== false,
      highlightDependencies: options?.highlightDependencies !== false,
      gridLines: options?.gridLines !== false
    };
  }
}