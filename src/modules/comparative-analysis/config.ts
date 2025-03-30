import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class ComparativeAnalysisConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch (visualizationType) {
      case 'radar-chart':
        return this.createRadarChartConfig(data, options);
      case 'bar-comparison':
        return this.createBarComparisonConfig(data, options);
      case 'matrix':
        return this.createMatrixConfig(data, options);
      case 'tech-comparison-table':
        return this.createTechTableConfig(data, options);
      default:
        return {};
    }
  }
  
  private createRadarChartConfig(data: any, options?: any): any {
    // Configure radar chart visualization
    return {
      width: options?.width || 600,
      height: options?.height || 400,
      margin: options?.margin || { top: 50, right: 50, bottom: 50, left: 50 },
      scales: {
        min: 0,
        max: 5,
        ticks: 5
      },
      colors: ['#4C9AFF', '#FF8F73'],
      legendPosition: 'bottom',
      categories: data.features?.map((feature: any) => feature.name) || [],
      data: [
        {
          name: 'Knowledge Graph',
          values: data.features?.map((feature: any) => feature.kgRating) || []
        },
        {
          name: options?.comparisonName || 'Comparison Technology',
          values: data.features?.map((feature: any) => feature.comparisonRating) || []
        }
      ],
      animate: true,
      animationDuration: 800,
      gridLines: true,
      labels: true
    };
  }
  
  private createBarComparisonConfig(data: any, options?: any): any {
    // Configure bar chart comparison visualization
    return {
      width: options?.width || 700,
      height: options?.height || 400,
      margin: options?.margin || { top: 30, right: 120, bottom: 70, left: 80 },
      orientation: 'horizontal',
      groupPadding: 0.2,
      colors: ['#4C9AFF', '#FF8F73'],
      categories: data.features?.map((feature: any) => feature.name) || [],
      data: [
        {
          name: 'Knowledge Graph',
          values: data.features?.map((feature: any) => feature.kgRating) || []
        },
        {
          name: options?.comparisonName || 'Comparison Technology',
          values: data.features?.map((feature: any) => feature.comparisonRating) || []
        }
      ],
      xAxis: {
        title: 'Rating (0-5)',
        labelRotation: 0
      },
      yAxis: {
        title: 'Feature',
        labelRotation: 0
      },
      legend: {
        position: 'top-right',
        boxed: false
      },
      tooltips: true,
      valueLabels: options?.showValues || false,
      gridLines: true,
      animate: true,
      animationDuration: 800
    };
  }
  
  private createMatrixConfig(data: any, options?: any): any {
    // Configure matrix visualization
    return {
      width: options?.width || 700,
      height: options?.height || 500,
      cellSize: options?.cellSize || 60,
      padding: options?.padding || 10,
      rowLabels: data.useCases?.map((uc: any) => uc.name) || [],
      columnLabels: data.technologies?.map((tech: any) => tech.name) || [],
      colorScale: [
        { value: 1, color: '#FFE380' }, // Poor
        { value: 2, color: '#FFC400' }, // Fair
        { value: 3, color: '#36B37E' }, // Good
        { value: 4, color: '#00875A' }, // Excellent
        { value: 5, color: '#006644' }  // Best
      ],
      cellText: true,
      legendTitle: 'Suitability',
      legendPosition: 'right',
      tooltips: true,
      highlightBestInRow: options?.highlightBest || false,
      borderColor: '#DFE1E6',
      headerBackgroundColor: '#F4F5F7',
      headerTextColor: '#172B4D'
    };
  }
  
  private createTechTableConfig(data: any, options?: any): any {
    // Configure technology comparison table
    return {
      columns: [
        { key: 'technology', header: 'Technology', width: '20%' },
        ...data.criteria.map((criterion: any) => ({ 
          key: criterion.id, 
          header: criterion.name, 
          width: `${80 / data.criteria.length}%` 
        }))
      ],
      rowData: data.technologies.map((tech: any) => {
        const row: any = { technology: tech.name };
        data.criteria.forEach((criterion: any) => {
          const rating = data.ratings.find(
            (r: any) => r.technology === tech.id && r.criterion === criterion.id
          );
          row[criterion.id] = rating ? rating.score : 0;
        });
        return row;
      }),
      cellFormatters: data.criteria.reduce((formatters: any, criterion: any) => {
        formatters[criterion.id] = (value: number) => {
          const colors = ['#FFBDAD', '#FFE380', '#ABF5D1', '#79F2C0', '#57D9A3'];
          return {
            display: `${value}/5`,
            backgroundColor: colors[value - 1] || '#FFFFFF'
          };
        };
        return formatters;
      }, {}),
      headerStyle: {
        backgroundColor: '#172B4D',
        color: '#FFFFFF',
        fontWeight: 'bold'
      },
      sortable: options?.sortable !== false,
      filterable: options?.filterable || false,
      striped: true,
      compact: options?.compact || false
    };
  }
}