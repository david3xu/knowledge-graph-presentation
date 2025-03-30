import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class IndustryApplicationsConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'heatmap':
        return this.createIndustryMatrixConfig(data, options);
      case 'treemap':
        return this.createUseCaseTreemapConfig(data, options);
      case 'barChart':
        return this.createMetricsBarChartConfig(data, options);
      case 'bubbleChart':
        return this.createUseCaseBubbleConfig(data, options);
      case 'networkGraph':
        return this.createIndustryGraphConfig(data, options);
      default:
        return {};
    }
  }
  
  /**
   * Creates configuration for industry matrix heatmap
   */
  private createIndustryMatrixConfig(data: any, options?: any): any {
    return {
      width: options?.width || 700,
      height: options?.height || 500,
      margin: {
        top: 50,
        right: 50,
        bottom: 100,
        left: 150
      },
      colorScale: {
        type: 'sequential',
        range: ['#E6FCFF', '#00C7E6', '#0052CC'],
        domain: [0, 5]
      },
      gridSize: {
        width: 70,
        height: 40
      },
      labels: {
        x: {
          angle: -45,
          fontSize: 12,
          fontWeight: 'bold',
          dy: -5
        },
        y: {
          fontSize: 12,
          fontWeight: 'normal',
          dx: -10
        }
      },
      legend: {
        title: 'Relevance Score',
        ticks: 6,
        width: 200,
        height: 20
      },
      tooltips: true,
      interactive: options?.interactive !== false,
      highlightValue: options?.highlightValue
    };
  }
  
  /**
   * Creates configuration for use case treemap
   */
  private createUseCaseTreemapConfig(data: any, options?: any): any {
    return {
      width: options?.width || 700,
      height: options?.height || 500,
      padding: 2,
      colorScale: {
        type: 'categorical',
        domain: data.industryData.map((d: any) => d.name),
        range: [
          '#36B37E', '#00B8D9', '#6554C0', 
          '#FF5630', '#FFAB00', '#6B778C',
          '#00875A', '#0747A6', '#403294'
        ]
      },
      labels: {
        fontSize: (d: any) => {
          const size = Math.sqrt(d.value) / 5 + 10;
          return Math.min(Math.max(size, 8), 14);
        },
        fontFamily: 'Arial',
        textWrap: true,
        maxWidth: 100
      },
      tooltips: {
        content: (d: any) => `
          <div>
            <strong>${d.name}</strong><br/>
            ${d.description}<br/>
            <em>Value: ${d.value}</em>
          </div>
        `
      },
      animation: {
        duration: 800,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
      },
      interactive: options?.interactive !== false,
      drilldown: options?.drilldown !== false,
      highlightIndustry: options?.highlightIndustry
    };
  }
  
  /**
   * Creates configuration for metrics bar chart
   */
  private createMetricsBarChartConfig(data: any, options?: any): any {
    // Determine which metric to visualize
    const metricKey = options?.metric || 'roi';
    
    // Generate display name for the metric
    const metricDisplayNames: Record<string, string> = {
      'roi': 'Return on Investment (%)',
      'timeToValue': 'Time to Value (months)',
      'dataQualityImprovement': 'Data Quality Improvement (%)',
      'costReduction': 'Cost Reduction (%)',
      'productivityGain': 'Productivity Gain (%)'
    };
    
    return {
      width: options?.width || 700,
      height: options?.height || 400,
      margin: {
        top: 30,
        right: 30,
        bottom: 70,
        left: 80
      },
      xAxis: {
        label: 'Industry',
        tickRotation: -45
      },
      yAxis: {
        label: metricDisplayNames[metricKey] || metricKey,
        tickFormat: (d: number) => `${d}${metricKey === 'timeToValue' ? 'm' : '%'}`
      },
      bars: {
        fillColor: '#36B37E',
        hoverColor: '#00875A',
        borderColor: '#006644',
        borderWidth: 1,
        cornerRadius: 2,
        padding: 0.3
      },
      grid: {
        show: true,
        color: '#DFE1E6',
        opacity: 0.5
      },
      animation: {
        duration: 800,
        delay: (d: any, i: number) => i * 50
      },
      tooltips: true,
      legend: false,
      sortBars: options?.sortBars !== false
    };
  }
  
  /**
   * Creates configuration for use case bubble chart
   */
  private createUseCaseBubbleConfig(data: any, options?: any): any {
    return {
      width: options?.width || 700,
      height: options?.height || 500,
      margin: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
      },
      simulation: {
        strength: -30,
        center: 0.1,
        collision: 1,
        alphaDecay: 0.02
      },
      bubbles: {
        minRadius: 20,
        maxRadius: 70,
        fill: (d: any) => {
          const colors: Record<string, string> = {
            'Healthcare': '#00B8D9',
            'Finance': '#36B37E',
            'Retail': '#FFAB00',
            'Manufacturing': '#FF5630',
            'Government': '#6554C0',
            'Technology': '#0747A6',
            'Education': '#6B778C',
            'Energy': '#57D9A3'
          };
          return colors[d.industry] || '#4C9AFF';
        },
        stroke: '#FFFFFF',
        strokeWidth: 1,
        opacity: 0.9
      },
      labels: {
        fontSize: (d: any) => Math.min(2 * d.radius / 3, 18),
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#FFFFFF',
        textWrap: true
      },
      tooltips: {
        content: (d: any) => `
          <div>
            <strong>${d.name}</strong><br/>
            Industry: ${d.industry}<br/>
            ${d.description}<br/>
            <em>Impact: ${d.impact}</em>
          </div>
        `
      },
      animation: {
        duration: 1000
      },
      highlightIndustry: options?.highlightIndustry
    };
  }
  
  /**
   * Creates configuration for industry relationship graph
   */
  private createIndustryGraphConfig(data: any, options?: any): any {
    return {
      layout: {
        name: 'force',
        iterations: 300,
        rankDir: 'LR',
        animate: true
      },
      nodeStyle: {
        industry: {
          shape: 'circle',
          radius: 40,
          fillColor: '#36B37E',
          strokeColor: '#006644',
          strokeWidth: 2,
          fontSize: 12,
          fontColor: '#FFFFFF',
          fontWeight: 'bold'
        },
        application: {
          shape: 'rectangle',
          width: 120,
          height: 40,
          cornerRadius: 5,
          fillColor: '#4C9AFF',
          strokeColor: '#0747A6',
          strokeWidth: 1,
          fontSize: 10,
          fontColor: '#FFFFFF'
        },
        technology: {
          shape: 'hexagon',
          radius: 30,
          fillColor: '#FFAB00',
          strokeColor: '#FF8B00',
          strokeWidth: 1,
          fontSize: 10,
          fontColor: '#172B4D'
        }
      },
      edgeStyle: {
        uses: {
          strokeColor: '#6B778C',
          strokeWidth: 1,
          arrowSize: 5,
          style: 'solid'
        },
        enables: {
          strokeColor: '#36B37E',
          strokeWidth: 2,
          arrowSize: 6,
          style: 'solid'
        },
        requires: {
          strokeColor: '#FF5630',
          strokeWidth: 1.5,
          arrowSize: 5,
          style: 'dashed'
        }
      },
      physics: {
        enabled: options?.physics !== false,
        stabilization: true,
        repulsion: 800,
        springLength: 150
      },
      interaction: {
        draggable: options?.interactive !== false,
        selectable: true,
        multiselect: true,
        navigation: true,
        hoverHighlight: true,
        tooltips: true
      }
    };
  }
}