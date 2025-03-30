import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class IntroConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'graph':
        return this.createConceptGraphConfig(data, options);
      case 'timeline':
        return this.createEvolutionTimelineConfig(data, options);
      default:
        return {};
    }
  }
  
  private createConceptGraphConfig(data: any, options?: any): any {
    // Create configuration for concept graph visualization
    return {
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        padding: 30,
        randomize: false
      },
      nodeStyle: {
        color: options?.nodeColor || '#4C9AFF',
        borderColor: options?.borderColor || '#0747A6',
        borderWidth: 2,
        shape: 'circle',
        size: 45,
        fontSize: 12,
        fontColor: '#172B4D'
      },
      edgeStyle: {
        color: options?.edgeColor || '#6B778C',
        width: 1.5,
        opacity: 0.8,
        arrowShape: 'triangle',
        fontSize: 10
      },
      physics: true,
      draggable: true,
      highlightNodes: options?.highlightNodes || []
    };
  }
  
  private createEvolutionTimelineConfig(data: any, options?: any): any {
    // Create configuration for evolution timeline visualization
    return {
      orientation: options?.orientation || 'horizontal',
      timeUnit: 'year',
      showAxisLabels: true,
      showGrid: true,
      showEventLabels: true,
      colorScheme: [
        '#4C9AFF', // Early developments
        '#36B37E', // Semantic web era
        '#FF5630', // Modern KG era
        '#6554C0'  // Future developments
      ],
      rowHeight: 80,
      showPeriodBackgrounds: true,
      timeFormat: 'YYYY'
    };
  }
}