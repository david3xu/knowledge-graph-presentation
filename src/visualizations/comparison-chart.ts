/**
 * Comparison Chart Visualization Component
 * Renders interactive comparative visualizations for knowledge graph technologies and approaches
 */
import * as d3 from 'd3';

/**
 * Data structure for comparison chart
 */
export interface ComparisonChartData {
  /** Categories to compare */
  categories: string[];
  
  /** Items being compared */
  items: {
    /** Name of the item */
    name: string;
    
    /** Values for each category */
    values: number[];
    
    /** Optional color for this item */
    color?: string;
  }[];
  
  /** Optional maximum scale value */
  maxValue?: number;
}

/**
 * Comparison chart visualization options
 */
export interface ComparisonChartOptions {
  /** DOM container for the visualization */
  container: HTMLElement;
  
  /** Chart width in pixels */
  width?: number;
  
  /** Chart height in pixels */
  height?: number;
  
  /** Chart data */
  data: ComparisonChartData;
  
  /** Chart title */
  title?: string;
  
  /** Chart type */
  chartType?: 'radar' | 'bar' | 'stacked' | 'grouped';
  
  /** Color scheme for items */
  colors?: string[];
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Whether to show a legend */
  showLegend?: boolean;
  
  /** Whether to enable animation */
  animate?: boolean;
  
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  /** Whether to show data values */
  showValues?: boolean;
  
  /** Whether to enable tooltips */
  tooltips?: boolean;
  
  /** Click handler for interactive elements */
  onClick?: (item: string, category?: string) => void;
}

export class ComparisonChartVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private data: ComparisonChartData;
  private options: ComparisonChartOptions;
  private margin = { top: 60, right: 100, bottom: 60, left: 60 };
  private innerWidth: number;
  private innerHeight: number;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private legendGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private colorScale: d3.ScaleOrdinal<string, string>;
  
  /**
   * Creates a new comparison chart visualization
   * @param options Visualization options
   */
  constructor(options: ComparisonChartOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    this.data = this.preprocessData(options.data);
    this.options = this.initializeOptions(options);
    
    // Calculate inner dimensions
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    
    // Create color scale
    this.colorScale = d3.scaleOrdinal<string, string>()
      .domain(this.data.items.map(item => item.name))
      .range(this.options.colors || d3.schemeCategory10);
    
    // Initialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: ComparisonChartOptions): ComparisonChartOptions {
    // Default color scheme
    const defaultColors = d3.schemeCategory10;
    
    // Merge with provided options
    return {
      ...options,
      chartType: options.chartType || 'radar',
      colors: options.colors || [...defaultColors],
      showLabels: options.showLabels !== false,
      showLegend: options.showLegend !== false,
      animate: options.animate !== false,
      animationDuration: options.animationDuration || 800,
      showValues: options.showValues || false,
      tooltips: options.tooltips !== false
    };
  }
  
  /**
   * Preprocess chart data
   * @param data Raw chart data
   */
  private preprocessData(data: ComparisonChartData): ComparisonChartData {
    // Ensure all items have values for all categories
    const processedData = {
      ...data,
      items: data.items.map(item => ({
        ...item,
        // Pad values array to match categories length if needed
        values: item.values.length < data.categories.length
          ? [...item.values, ...Array(data.categories.length - item.values.length).fill(0)]
          : item.values.slice(0, data.categories.length) // Truncate if longer
      }))
    };
    
    return processedData;
  }
  
  /**
   * Initialize the visualization container and elements
   */
  private initializeVisualization(): void {
    // Clear any existing content
    this.container.innerHTML = '';
    
    // Create SVG element
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'comparison-chart-visualization')
      .attr('viewBox', [0, 0, this.width, this.height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Add title if provided
    if (this.options.title) {
      this.svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', this.width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold')
        .text(this.options.title);
    }
    
    // Create chart group
    this.chartGroup = this.svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${this.margin.left + this.innerWidth / 2}, ${this.margin.top + this.innerHeight / 2})`);
    
    // Create legend group
    this.legendGroup = this.svg.append('g')
      .attr('class', 'legend-group')
      .attr('transform', `translate(${this.width - this.margin.right + 20}, ${this.margin.top})`);
    
    // Initialize tooltip
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'comparison-chart-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none')
      .style('z-index', '10');
    
    // Render the visualization based on chart type
    switch (this.options.chartType) {
      case 'radar':
        this.renderRadarChart();
        break;
      case 'bar':
        this.renderBarChart();
        break;
      case 'stacked':
        this.renderStackedBarChart();
        break;
      case 'grouped':
        this.renderGroupedBarChart();
        break;
      default:
        this.renderRadarChart();
    }
    
    // Add legend
    if (this.options.showLegend) {
      this.renderLegend();
    }
  }
  
  /**
   * Render the radar chart visualization
   */
  private renderRadarChart(): void {
    const radius = Math.min(this.innerWidth, this.innerHeight) / 2;
    const centerX = this.innerWidth / 2;
    const centerY = this.innerHeight / 2;
    
    // Create scales
    const valueScale = d3.scaleLinear()
      .domain([0, this.data.maxValue || 1])
      .range([0, radius]);
    
    // Draw the background circles
    const levels = 5;
    this.chartGroup.selectAll('.radar-level')
      .data(d3.range(1, levels + 1))
      .enter()
      .append('circle')
      .attr('class', 'radar-level')
      .attr('r', d => radius * d / levels)
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('fill', 'none')
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);
    
    // Draw the axes
    this.chartGroup.selectAll('.radar-axis')
      .data(this.data.categories)
      .enter()
      .append('line')
      .attr('class', 'radar-axis')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', (_, i) => centerX + radius * Math.cos(i * 2 * Math.PI / this.data.categories.length - Math.PI / 2))
      .attr('y2', (_, i) => centerY + radius * Math.sin(i * 2 * Math.PI / this.data.categories.length - Math.PI / 2))
      .attr('stroke', '#999')
      .attr('stroke-width', 1);
    
    // Draw the data areas
    this.chartGroup.selectAll('.radar-area')
      .data(this.data.items)
      .enter()
      .append('path')
      .attr('class', 'radar-area')
      .attr('d', d => {
        const points = d.values.map((value, i) => {
          const angle = i * 2 * Math.PI / this.data.categories.length - Math.PI / 2;
          const r = valueScale(value);
          return [
            centerX + r * Math.cos(angle),
            centerY + r * Math.sin(angle)
          ];
        });
        return `M ${points.map(p => p.join(',')).join(' L ')} Z`;
      })
      .attr('fill', d => d.color || this.colorScale(d.name))
      .attr('fill-opacity', 0.3)
      .attr('stroke', d => d.color || this.colorScale(d.name))
      .attr('stroke-width', 2);
    
    // Draw the data points
    this.chartGroup.selectAll('.radar-point')
      .data(this.data.items)
      .enter()
      .append('g')
      .attr('class', 'radar-points')
      .selectAll('circle')
      .data(d => d.values.map((value, i) => ({
        item: d.name,
        category: this.data.categories[i],
        value: value
      })))
      .enter()
      .append('circle')
      .attr('class', 'radar-point')
      .attr('cx', (d, i) => {
        const angle = i * 2 * Math.PI / this.data.categories.length - Math.PI / 2;
        return centerX + valueScale(d.value) * Math.cos(angle);
      })
      .attr('cy', (d, i) => {
        const angle = i * 2 * Math.PI / this.data.categories.length - Math.PI / 2;
        return centerY + valueScale(d.value) * Math.sin(angle);
      })
      .attr('r', 4)
      .attr('fill', d => this.colorScale(d.item))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // Add labels
    if (this.options.showLabels) {
      this.chartGroup.selectAll('.radar-label')
        .data(this.data.categories)
        .enter()
        .append('text')
        .attr('class', 'radar-label')
        .attr('x', (_, i) => {
          const angle = i * 2 * Math.PI / this.data.categories.length - Math.PI / 2;
          return centerX + (radius + 20) * Math.cos(angle);
        })
        .attr('y', (_, i) => {
          const angle = i * 2 * Math.PI / this.data.categories.length - Math.PI / 2;
          return centerY + (radius + 20) * Math.sin(angle);
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(d => d);
    }
  }
  
  /**
   * Render standard bar chart visualization
   */
  private renderBarChart(): void {
    const { categories, items } = this.data;
    
    // Reposition chart group to top-left of inner area
    this.chartGroup.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
    // Create scales
    const x = d3.scaleBand()
      .domain(categories)
      .range([0, this.innerWidth])
      .padding(0.2);
    
    const maxValue = this.data.maxValue || d3.max(items, d => d3.max(d.values)) || 0;
    const y = d3.scaleLinear()
      .domain([0, maxValue])
      .range([this.innerHeight, 0])
      .nice();
    
    // Draw axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
    
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
    
    // Group width
    const groupWidth = x.bandwidth();
    const barWidth = groupWidth / items.length;
    
    // Draw bars for each item
    items.forEach((item, itemIndex) => {
      const barGroups = this.chartGroup.selectAll(`.bar-group-${itemIndex}`)
        .data(item.values)
        .enter()
        .append('rect')
        .attr('class', `bar-group-${itemIndex}`)
        .attr('x', (_, i) => x(categories[i])! + itemIndex * barWidth)
        .attr('y', d => y(d))
        .attr('width', barWidth)
        .attr('height', d => this.innerHeight - y(d))
        .attr('fill', item.color || this.colorScale(item.name))
        .on('mouseover', (event, d) => {
          if (this.options.tooltips) {
            const i = event.target.__data__;
            const categoryIndex = item.values.indexOf(i);
            const category = categories[categoryIndex];
            
            this.showPointTooltip(event, {
              item: item.name,
              category: category,
              value: d
            });
          }
        })
        .on('mouseout', () => {
          if (this.options.tooltips) {
            this.hideTooltip();
          }
        })
        .on('click', (_, d) => {
          if (this.options.onClick) {
            const categoryIndex = item.values.indexOf(d);
            this.options.onClick(item.name, categories[categoryIndex]);
          }
        });
      
      // Animate bars if enabled
      if (this.options.animate) {
        barGroups
          .attr('y', this.innerHeight)
          .attr('height', 0)
          .transition()
          .duration(this.options.animationDuration || 800)
          .attr('y', d => y(d))
          .attr('height', d => this.innerHeight - y(d));
      }
      
      // Add value labels if enabled
      if (this.options.showValues) {
        this.chartGroup.selectAll(`.bar-label-${itemIndex}`)
          .data(item.values)
          .enter()
          .append('text')
          .attr('class', `bar-label-${itemIndex}`)
          .attr('x', (_, i) => x(categories[i])! + itemIndex * barWidth + barWidth / 2)
          .attr('y', d => y(d) - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#555')
          .text(d => d);
      }
    });
  }
  
  /**
   * Render stacked bar chart visualization
   */
  private renderStackedBarChart(): void {
    const { categories, items } = this.data;
    
    // Reposition chart group to top-left of inner area
    this.chartGroup.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
    // Transform data for d3.stack
    const stackedData: any[] = [];
    categories.forEach((category, i) => {
      const entry: any = { category };
      items.forEach(item => {
        entry[item.name] = item.values[i];
      });
      stackedData.push(entry);
    });
    
    // Create scales
    const x = d3.scaleBand()
      .domain(categories)
      .range([0, this.innerWidth])
      .padding(0.2);
    
    // Get stack keys (item names)
    const keys = items.map(item => item.name);
    
    // Create stack generator
    const stack = d3.stack()
      .keys(keys);
    
    // Generate stacked data
    const series = stack(stackedData);
    
    // Calculate maximum y value (sum of all values in a category)
    const maxYValue = d3.max(stackedData, d => {
      return keys.reduce((sum, key) => sum + (d[key] || 0), 0);
    }) || 0;
    
    const y = d3.scaleLinear()
      .domain([0, maxYValue])
      .range([this.innerHeight, 0])
      .nice();
    
    // Draw axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
    
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
    
    // Draw stacked bars
    const barGroups = this.chartGroup.selectAll('.bar-stack')
      .data(series)
      .enter()
      .append('g')
      .attr('class', 'bar-stack')
      .attr('fill', (_, i) => items[i].color || this.colorScale(items[i].name));
    
    const bars = barGroups.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.data.category)!)
      .attr('y', (d: any) => y(d[1]))
      .attr('height', (d: any) => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseover', (event, d: any) => {
        if (this.options.tooltips) {
          const seriesIndex = (d as any).parentNode.__data__.index;
          const item = items[seriesIndex];
          
          this.showPointTooltip(event, {
            item: item.name,
            category: d.data.category,
            value: d.data[item.name]
          });
        }
      })
      .on('mouseout', () => {
        if (this.options.tooltips) {
          this.hideTooltip();
        }
      })
      .on('click', (_, d: any) => {
        if (this.options.onClick) {
          const seriesIndex = (d as any).parentNode.__data__.index;
          const item = items[seriesIndex];
          this.options.onClick(item.name, d.data.category);
        }
      });
    
    // Animate bars if enabled
    if (this.options.animate) {
      bars
        .attr('y', (d: any) => y(d[0]))
        .attr('height', 0)
        .transition()
        .duration(this.options.animationDuration || 800)
        .attr('y', (d: any) => y(d[1]))
        .attr('height', (d: any) => y(d[0]) - y(d[1]));
    }
    
    // Add value labels if enabled
    if (this.options.showValues) {
      barGroups.selectAll('.bar-value')
        .data(d => d)
        .enter()
        .append('text')
        .attr('class', 'bar-value')
        .attr('x', (d: any) => x(d.data.category)! + x.bandwidth() / 2)
        .attr('y', (d: any) => (y(d[0]) + y(d[1])) / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#fff')
        .text((d: any) => {
          const seriesIndex = (d as any).parentNode.__data__.index;
          const item = items[seriesIndex];
          const value = d.data[item.name];
          return value > 0 ? value : '';
        });
    }
  }
  
  /**
   * Render grouped bar chart visualization
   */
  private renderGroupedBarChart(): void {
    const { categories, items } = this.data;
    
    // Reposition chart group to top-left of inner area
    this.chartGroup.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    
    // Create scales
    const x0 = d3.scaleBand()
      .domain(categories)
      .range([0, this.innerWidth])
      .padding(0.2);
    
    const x1 = d3.scaleBand()
      .domain(items.map(d => d.name))
      .range([0, x0.bandwidth()])
      .padding(0.05);
    
    const maxValue = this.data.maxValue || d3.max(items, d => d3.max(d.values)) || 0;
    const y = d3.scaleLinear()
      .domain([0, maxValue])
      .range([this.innerHeight, 0])
      .nice();
    
    // Draw axes
    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y);
    
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
    
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);
    
    // Create data structure for grouped bars
    const groupedData = categories.map(category => {
      const categoryData: { [key: string]: any } = { category };
      items.forEach((item, i) => {
        categoryData[item.name] = item.values[i];
      });
      return categoryData;
    });
    
    // Draw grouped bars
    const categoryGroups = this.chartGroup.selectAll('.category-group')
      .data(groupedData)
      .enter()
      .append('g')
      .attr('class', 'category-group')
      .attr('transform', d => `translate(${x0(d.category)}, 0)`);
    
    items.forEach(item => {
      const bars = categoryGroups.append('rect')
        .attr('class', 'bar')
        .attr('x', () => x1(item.name)!)
        .attr('y', d => y(d[item.name] || 0))
        .attr('width', x1.bandwidth())
        .attr('height', d => this.innerHeight - y(d[item.name] || 0))
        .attr('fill', item.color || this.colorScale(item.name))
        .on('mouseover', (event, d) => {
          if (this.options.tooltips) {
            this.showPointTooltip(event, {
              item: item.name,
              category: d.category,
              value: d[item.name] || 0
            });
          }
        })
        .on('mouseout', () => {
          if (this.options.tooltips) {
            this.hideTooltip();
          }
        })
        .on('click', (_, d) => {
          if (this.options.onClick) {
            this.options.onClick(item.name, d.category);
          }
        });
      
      // Animate bars if enabled
      if (this.options.animate) {
        bars
          .attr('y', this.innerHeight)
          .attr('height', 0)
          .transition()
          .duration(this.options.animationDuration || 800)
          .attr('y', d => y(d[item.name] || 0))
          .attr('height', d => this.innerHeight - y(d[item.name] || 0));
      }
      
      // Add value labels if enabled
      if (this.options.showValues) {
        categoryGroups.append('text')
          .attr('class', 'bar-value')
          .attr('x', () => x1(item.name)! + x1.bandwidth() / 2)
          .attr('y', d => y(d[item.name] || 0) - 5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#555')
          .text(d => d[item.name] || '');
      }
    });
  }
  
  /**
   * Render the chart legend
   */
  private renderLegend(): void {
    const legendItems = this.data.items;
    const legendItemHeight = 20;
    
    // Create legend items
    const legend = this.legendGroup.selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * legendItemHeight})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        if (this.options.onClick) {
          this.options.onClick(d.name);
        }
      });
    
    // Add colored squares
    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => d.color || this.colorScale(d.name));
    
    // Add text labels
    legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .attr('font-size', '12px')
      .text(d => d.name);
    
    // Add hover behavior
    legend
      .on('mouseover', function() {
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 0.7);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition().duration(200)
          .attr('opacity', 1);
      });
  }
  
  /**
   * Show tooltip for a specific data point
   * @param event Mouse event
   * @param data Point data
   */
  private showPointTooltip(event: any, data: { item: string, category: string, value: number }): void {
    const tooltipContent = `
      <div style="font-weight: bold; margin-bottom: 5px;">${data.item}</div>
      <div>${data.category}: <span style="font-weight: bold;">${data.value}</span></div>
    `;
    
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(tooltipContent);
  }
  
  /**
   * Hide the tooltip
   */
  private hideTooltip(): void {
    this.tooltip.style('visibility', 'hidden');
  }
  
  /**
   * Update the chart with new data
   * @param data New chart data
   */
  public updateData(data: ComparisonChartData): void {
    this.data = this.preprocessData(data);
    
    // Update color scale domain
    this.colorScale.domain(this.data.items.map(item => item.name));
    
    // Clear SVG content
    this.svg.selectAll('*').remove();
    
    // Reinitialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Update chart options
   * @param options New options
   */
  public updateOptions(options: Partial<ComparisonChartOptions>): void {
    this.options = this.initializeOptions({ ...this.options, ...options });
    
    // Clear SVG content
    this.svg.selectAll('*').remove();
    
    // Reinitialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Resize the chart
   * @param width New width
   * @param height New height
   */
  public resize(width?: number, height?: number): void {
    this.width = width || this.container.clientWidth || this.width;
    this.height = height || this.container.clientHeight || this.height;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    
    // Update SVG dimensions
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height].join(' '));
    
    // Clear SVG content
    this.svg.selectAll('*').remove();
    
    // Reinitialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Clean up resources when the chart is no longer needed
   */
  public destroy(): void {
    // Remove event listeners
    if (this.svg) {
      this.svg.selectAll('*').on('mouseover', null).on('mouseout', null).on('click', null);
    }
    
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}