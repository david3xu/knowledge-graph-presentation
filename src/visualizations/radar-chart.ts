/**
 * Radar Chart Visualization Component
 * Specialized radar chart for technology maturity assessment and feature comparisons
 */
import * as d3 from 'd3';

/**
 * Data structure for radar chart data
 */
export interface RadarChartData {
  /** Axes (dimensions) of the radar chart */
  axes: {
    /** Name of the axis/dimension */
    name: string;
    
    /** Optional axis label */
    label?: string;
    
    /** Optional axis description */
    description?: string;
    
    /** Optional maximum value for this axis */
    maxValue?: number;
  }[];
  
  /** Series (datasets) to display */
  series: {
    /** Name of the series */
    name: string;
    
    /** Values for each axis */
    values: number[];
    
    /** Optional color for this series */
    color?: string;
    
    /** Optional fill opacity */
    fillOpacity?: number;
    
    /** Optional stroke width */
    strokeWidth?: number;
  }[];
  
  /** Global maximum value */
  maxValue?: number;
}

/**
 * Radar chart visualization options
 */
export interface RadarChartOptions {
  /** DOM container for the visualization */
  container: HTMLElement;
  
  /** Chart width in pixels */
  width?: number;
  
  /** Chart height in pixels */
  height?: number;
  
  /** Chart data */
  data: RadarChartData;
  
  /** Chart title */
  title?: string;
  
  /** Color scheme for series */
  colors?: string[];
  
  /** Number of circular levels to display */
  levels?: number;
  
  /** Whether to draw axis lines */
  drawAxes?: boolean;
  
  /** Whether to show axis labels */
  showAxisLabels?: boolean;
  
  /** Whether to show a legend */
  showLegend?: boolean;
  
  /** Whether to show axis values */
  showValues?: boolean;
  
  /** Whether to normalize data to a 0-1 scale */
  normalize?: boolean;
  
  /** Whether to enable animation */
  animate?: boolean;
  
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  /** Whether to use curved or straight lines */
  useCurvedLines?: boolean;
  
  /** Whether to enable tooltips */
  tooltips?: boolean;
  
  /** Optional dot radius for data points */
  dotRadius?: number;
  
  /** Optional factor to scale the radius */
  radiusScaleFactor?: number;
  
  /** Click handler for interactive elements */
  onClick?: (series: string, axis?: string) => void;
  
  /** Optional callback to format axis values */
  formatAxisValue?: (value: number, axisName: string) => string;
}

export class RadarChartVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private data: RadarChartData;
  private options: RadarChartOptions;
  private margin = { top: 60, right: 100, bottom: 40, left: 60 };
  private radius: number;
  private chartGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private legendGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private colorScale: d3.ScaleOrdinal<string, string>;
  private angleSlice: number;
  private radarLine: d3.LineRadial<number>;
  private radialScale: d3.ScaleLinear<number, number>;
  private currentHighlightedSeries: string | null = null;
  
  /**
   * Creates a new radar chart visualization
   * @param options Visualization options
   */
  constructor(options: RadarChartOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    this.data = this.preprocessData(options.data);
    this.options = this.initializeOptions(options);
    
    // Calculate radar chart dimensions
    this.radius = Math.min(this.width - this.margin.left - this.margin.right, 
                           this.height - this.margin.top - this.margin.bottom) / 2;
    
    // Apply radius scale factor if specified
    if (this.options.radiusScaleFactor) {
      this.radius *= this.options.radiusScaleFactor;
    }
    
    // Calculate angle for each axis
    this.angleSlice = (Math.PI * 2) / this.data.axes.length;
    
    // Create radial scale
    this.radialScale = d3.scaleLinear()
      .domain([0, this.getMaxValue()])
      .range([0, this.radius]);
    
    // Create radar line generator
    this.radarLine = d3.lineRadial<number>()
      .angle((d, i) => this.angleSlice * i)
      .radius(d => this.radialScale(d))
      .curve(this.options.useCurvedLines ? d3.curveCardinalClosed.tension(0.5) : d3.curveLinearClosed);
    
    // Create color scale
    this.colorScale = d3.scaleOrdinal<string, string>()
      .domain(this.data.series.map(item => item.name))
      .range(this.options.colors || d3.schemeCategory10);
    
    // Initialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: RadarChartOptions): RadarChartOptions {
    // Default color scheme
    const defaultColors = d3.schemeCategory10;
    
    // Merge with provided options
    return {
      ...options,
      colors: options.colors || [...defaultColors],
      levels: options.levels || 5,
      drawAxes: options.drawAxes !== false,
      showAxisLabels: options.showAxisLabels !== false,
      showLegend: options.showLegend !== false,
      showValues: options.showValues || false,
      normalize: options.normalize || false,
      animate: options.animate !== false,
      animationDuration: options.animationDuration || 800,
      useCurvedLines: options.useCurvedLines || false,
      tooltips: options.tooltips !== false,
      dotRadius: options.dotRadius || 4,
      radiusScaleFactor: options.radiusScaleFactor || 0.85
    };
  }
  
  /**
   * Preprocess and normalize chart data
   * @param data Raw chart data
   */
  private preprocessData(data: RadarChartData): RadarChartData {
    // Create a deep copy of data
    const processedData: RadarChartData = JSON.parse(JSON.stringify(data));
    
    // Normalize data if enabled
    if (this.options && this.options.normalize) {
      processedData.series = processedData.series.map(series => {
        const normalizedValues = series.values.map((value, i) => {
          const maxValue = data.axes[i].maxValue || data.maxValue || d3.max(data.series, s => s.values[i]) || 1;
          return value / maxValue;
        });
        
        return {
          ...series,
          values: normalizedValues
        };
      });
    }
    
    return processedData;
  }
  
  /**
   * Get the maximum value across all series and axes
   */
  private getMaxValue(): number {
    // Use global max value if provided
    if (this.data.maxValue !== undefined) {
      return this.data.maxValue;
    }
    
    // Otherwise find the maximum value
    let max = -Infinity;
    
    this.data.series.forEach(series => {
      series.values.forEach((value, i) => {
        // Check axis-specific max value
        const axisMax = this.data.axes[i]?.maxValue;
        if (axisMax !== undefined) {
          max = Math.max(max, axisMax);
        } else {
          max = Math.max(max, value);
        }
      });
    });
    
    return max;
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
      .attr('class', 'radar-chart-visualization')
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
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
    
    // Create legend group
    this.legendGroup = this.svg.append('g')
      .attr('class', 'legend-group')
      .attr('transform', `translate(${this.width - this.margin.right + 20}, ${this.margin.top})`);
    
    // Initialize tooltip
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'radar-chart-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none')
      .style('z-index', '10');
    
    // Render the visualization
    this.renderRadarChart();
    
    // Add legend
    if (this.options.showLegend) {
      this.renderLegend();
    }
  }
  
  /**
   * Render the radar chart visualization
   */
  private renderRadarChart(): void {
    const { axes, series } = this.data;
    const levels = this.options.levels || 5;
    
    // Draw radar background levels
    this.drawLevels(levels);
    
    // Draw axis lines
    if (this.options.drawAxes) {
      this.drawAxes(axes);
    }
    
    // Draw axis labels
    if (this.options.showAxisLabels) {
      this.drawAxisLabels(axes);
    }
    
    // Draw radar areas for each series
    this.drawSeriesAreas(series);
    
    // Draw data points if enabled or tooltips are active
    if (this.options.tooltips || this.options.showValues) {
      this.drawDataPoints(series);
    }
  }
  
  /**
   * Draw the circular levels of the radar chart
   * @param numLevels Number of levels to draw
   */
  private drawLevels(numLevels: number): void {
    // Create web levels group
    const webLevels = this.chartGroup.append('g')
      .attr('class', 'web-levels');
    
    // Draw each level
    for (let level = 0; level < numLevels; level++) {
      const levelFactor = (level + 1) / numLevels;
      
      // Draw level circle
      webLevels.append('circle')
        .attr('class', 'radar-level')
        .attr('r', this.radius * levelFactor)
        .attr('fill', 'none')
        .attr('stroke', '#CDCDCD')
        .attr('stroke-dasharray', level === 0 ? '' : '3,3')
        .attr('stroke-width', level === 0 ? 1.5 : 1);
      
      // Add level values if enabled
      if (this.options.showValues && level > 0) {
        const value = (this.getMaxValue() * levelFactor).toFixed(1);
        webLevels.append('text')
          .attr('class', 'level-value')
          .attr('x', 5)
          .attr('y', -this.radius * levelFactor)
          .attr('font-size', '10px')
          .attr('fill', '#666')
          .text(value);
      }
    }
  }
  
  /**
   * Draw axis lines and optional grid
   * @param axes Axis definitions
   */
  private drawAxes(axes: RadarChartData['axes']): void {
    const axisGroup = this.chartGroup.append('g')
      .attr('class', 'radar-axes');
    
    // Draw each axis line
    axes.forEach((axis, i) => {
      const angle = this.angleSlice * i;
      const lineX = this.radius * Math.cos(angle);
      const lineY = this.radius * Math.sin(angle);
      
      axisGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', lineX)
        .attr('y2', lineY)
        .attr('stroke', '#999999')
        .attr('stroke-width', 1);
    });
  }
  
  /**
   * Draw axis labels
   * @param axes Axis definitions
   */
  private drawAxisLabels(axes: RadarChartData['axes']): void {
    const labelGroup = this.chartGroup.append('g')
      .attr('class', 'radar-axis-labels');
    
    // Draw each axis label
    axes.forEach((axis, i) => {
      const angle = this.angleSlice * i;
      const labelDistance = this.radius * 1.15; // Position labels slightly outside the radar
      const labelX = labelDistance * Math.cos(angle);
      const labelY = labelDistance * Math.sin(angle);
      
      // Calculate text anchor based on position
      let textAnchor = 'middle';
      if (Math.abs(labelX) > this.radius * 0.3) {
        textAnchor = labelX > 0 ? 'start' : 'end';
      }
      
      // Calculate dominant baseline based on position
      let dominantBaseline = 'central';
      if (Math.abs(labelY) > this.radius * 0.3) {
        dominantBaseline = labelY > 0 ? 'hanging' : 'auto';
      }
      
      // Create label group for interactivity
      const label = labelGroup.append('g')
        .attr('class', 'axis-label-group')
        .attr('transform', `translate(${labelX}, ${labelY})`)
        .attr('data-axis', axis.name)
        .style('cursor', 'pointer');
      
      // Add label text
      label.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', dominantBaseline)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', '#333333')
        .text(axis.label || axis.name);
      
      // Add hover and click behaviors
      label
        .on('mouseover', (event) => {
          if (this.options.tooltips) {
            this.showAxisTooltip(event, axis);
          }
          
          // Highlight this axis
          labelGroup.selectAll('.axis-label')
            .filter(function() {
              return d3.select((this as SVGElement).parentElement).attr('data-axis') !== axis.name;
            })
            .transition().duration(200)
            .attr('opacity', 0.3);
        })
        .on('mouseout', () => {
          if (this.options.tooltips) {
            this.hideTooltip();
          }
          
          // Restore all axis labels
          labelGroup.selectAll('.axis-label')
            .transition().duration(200)
            .attr('opacity', 1);
        })
        .on('click', () => {
          if (this.options.onClick) {
            this.options.onClick(this.currentHighlightedSeries || '', axis.name);
          }
        });
    });
  }
  
  /**
   * Draw radar areas for each series
   * @param series Series data
   */
  private drawSeriesAreas(series: RadarChartData['series']): void {
    // Add series group
    const seriesGroup = this.chartGroup.append('g')
      .attr('class', 'radar-series');
    
    // Draw each series in reverse order so first series is on top
    [...series].reverse().forEach((item, reversedIndex) => {
      const originalIndex = series.length - 1 - reversedIndex;
      const color = item.color || this.colorScale(item.name);
      const fillOpacity = item.fillOpacity !== undefined ? item.fillOpacity : 0.3;
      const strokeWidth = item.strokeWidth !== undefined ? item.strokeWidth : 2;
      
      // Create series group
      const seriesItem = seriesGroup.append('g')
        .attr('class', `series-${originalIndex}`)
        .attr('data-series', item.name);
      
      // Draw radar area
      const radarArea = seriesItem.append('path')
        .attr('class', 'radar-area')
        .attr('d', this.radarLine(item.values))
        .attr('fill', color)
        .attr('fill-opacity', fillOpacity)
        .attr('stroke', color)
        .attr('stroke-width', strokeWidth)
        .style('pointer-events', 'all');
      
      // Add hover and click behaviors
      seriesItem
        .on('mouseover', (event) => {
          // Store current highlighted series
          this.currentHighlightedSeries = item.name;
          
          if (this.options.tooltips) {
            this.showSeriesTooltip(event, item);
          }
          
          // Highlight this series
          seriesGroup.selectAll('path.radar-area')
            .filter(function() {
              return d3.select((this as SVGElement).parentElement).attr('data-series') !== item.name;
            })
            .transition().duration(200)
            .attr('fill-opacity', 0.1)
            .attr('stroke-opacity', 0.3);
          
          // Highlight this series in the legend
          this.highlightLegendItem(item.name);
        })
        .on('mouseout', () => {
          // Clear current highlighted series
          this.currentHighlightedSeries = null;
          
          if (this.options.tooltips) {
            this.hideTooltip();
          }
          
          // Restore all series
          seriesGroup.selectAll('path.radar-area')
            .transition().duration(200)
            .attr('fill-opacity', d => (d as any).fillOpacity !== undefined ? (d as any).fillOpacity : 0.3)
            .attr('stroke-opacity', 1);
          
          // Restore legend
          this.resetLegendHighlight();
        })
        .on('click', () => {
          if (this.options.onClick) {
            this.options.onClick(item.name);
          }
        });
      
      // Animate area if enabled
      if (this.options.animate) {
        radarArea
          .attr('opacity', 0)
          .transition()
          .duration(this.options.animationDuration || 800)
          .attr('opacity', 1);
      }
    });
  }
  
  /**
   * Draw data points for each value in each series
   * @param series Series data
   */
  private drawDataPoints(series: RadarChartData['series']): void {
    const { axes } = this.data;
    const { dotRadius } = this.options;
    
    // Add points group
    const pointsGroup = this.chartGroup.append('g')
      .attr('class', 'radar-points');
    
    // Draw points for each series
    series.forEach((item, seriesIndex) => {
      const color = item.color || this.colorScale(item.name);
      
      item.values.forEach((value, valueIndex) => {
        // Calculate point position
        const angle = this.angleSlice * valueIndex;
        const r = this.radialScale(value);
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        // Add point
        pointsGroup.append('circle')
          .attr('class', `radar-point series-${seriesIndex} axis-${valueIndex}`)
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', dotRadius || 4)
          .attr('fill', color)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('data-series', item.name)
          .attr('data-axis', axes[valueIndex].name || axes[valueIndex].label || `Axis ${valueIndex + 1}`)
          .attr('data-value', value)
          .style('pointer-events', 'all')
          .on('mouseover', (event) => {
            // Store current highlighted series
            this.currentHighlightedSeries = item.name;
            
            if (this.options.tooltips) {
              this.showPointTooltip(event, {
                series: item.name,
                axis: axes[valueIndex].name || axes[valueIndex].label || `Axis ${valueIndex + 1}`,
                value
              });
            }
            
            // Increase point size
            d3.select(event.target)
              .transition().duration(200)
              .attr('r', (dotRadius || 4) * 1.5);
            
            // Highlight this series
            pointsGroup.selectAll('circle.radar-point')
              .filter(function() {
                return d3.select((this as SVGElement).parentElement).attr('data-series') !== item.name;
              })
              .transition().duration(200)
              .attr('opacity', 0.3);
            
            // Highlight series area
            this.chartGroup.selectAll('path.radar-area')
              .filter(function() {
                return d3.select((this as SVGElement).parentElement).attr('data-series') !== item.name;
              })
              .transition().duration(200)
              .attr('fill-opacity', 0.1)
              .attr('stroke-opacity', 0.3);
            
            // Highlight legend item
            this.highlightLegendItem(item.name);
          })
          .on('mouseout', (event) => {
            // Clear current highlighted series
            this.currentHighlightedSeries = null;
            
            if (this.options.tooltips) {
              this.hideTooltip();
            }
            
            // Restore point size
            d3.select(event.target)
              .transition().duration(200)
              .attr('r', dotRadius || 4);
            
            // Restore all points
            pointsGroup.selectAll('circle.radar-point')
              .transition().duration(200)
              .attr('opacity', 1);
            
            // Restore series areas
            this.chartGroup.selectAll('path.radar-area')
              .transition().duration(200)
              .attr('fill-opacity', d => (d as any).fillOpacity !== undefined ? (d as any).fillOpacity : 0.3)
              .attr('stroke-opacity', 1);
            
            // Reset legend highlight
            this.resetLegendHighlight();
          })
          .on('click', () => {
            if (this.options.onClick) {
              this.options.onClick(item.name, axes[valueIndex].name);
            }
          });
        
        // Add value label if enabled
        if (this.options.showValues) {
          const formattedValue = this.options.formatAxisValue
            ? this.options.formatAxisValue(value, axes[valueIndex].name)
            : value.toString();
          
          // Position label slightly offset from the point
          const labelOffset = dotRadius! * 1.5;
          const labelX = (r + labelOffset) * Math.cos(angle);
          const labelY = (r + labelOffset) * Math.sin(angle);
          
          pointsGroup.append('text')
            .attr('class', 'radar-value')
            .attr('x', labelX)
            .attr('y', labelY)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#333')
            .text(formattedValue);
        }
      });
    });
  }
  
  /**
   * Render the chart legend
   */
  private renderLegend(): void {
    const legendItems = this.data.series;
    const legendItemHeight = 20;
    
    // Create legend items
    const legend = this.legendGroup.selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('data-series', d => d.name)
      .attr('transform', (d, i) => `translate(0, ${i * legendItemHeight})`)
      .style('cursor', 'pointer');
    
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
    
    // Add hover and click behaviors
    legend
      .on('mouseover', (event, d) => {
        // Store current highlighted series
        this.currentHighlightedSeries = d.name;
        
        // Highlight this item
        this.highlightLegendItem(d.name);
        
        // Highlight corresponding series
        this.chartGroup.selectAll('path.radar-area')
          .filter(function() {
            return d3.select((this as SVGElement).parentElement).attr('data-series') !== d.name;
          })
          .transition().duration(200)
          .attr('fill-opacity', 0.1)
          .attr('stroke-opacity', 0.3);
        
        // Highlight corresponding points
        this.chartGroup.selectAll('circle.radar-point')
          .filter(function() {
            return d3.select((this as SVGElement).parentElement).attr('data-series') !== d.name;
          })
          .transition().duration(200)
          .attr('opacity', 0.3);
      })
      .on('mouseout', () => {
        // Clear current highlighted series
        this.currentHighlightedSeries = null;
        
        // Reset legend highlights
        this.resetLegendHighlight();
        
        // Restore series areas
        this.chartGroup.selectAll('path.radar-area')
          .transition().duration(200)
          .attr('fill-opacity', d => (d as any).fillOpacity !== undefined ? (d as any).fillOpacity : 0.3)
          .attr('stroke-opacity', 1);
        
        // Restore points
        this.chartGroup.selectAll('circle.radar-point')
          .transition().duration(200)
          .attr('opacity', 1);
      })
      .on('click', (event, d) => {
        if (this.options.onClick) {
          this.options.onClick(d.name);
        }
      });
  }
  
  /**
   * Highlight a legend item
   * @param seriesName Name of the series to highlight
   */
  private highlightLegendItem(seriesName: string): void {
    // Dim other legend items
    this.legendGroup.selectAll('.legend-item')
      .filter(function() {
        return d3.select((this as SVGElement).parentElement).attr('data-series') !== seriesName;
      })
      .transition().duration(200)
      .attr('opacity', 0.3);
    
    // Highlight selected item
    this.legendGroup.selectAll('.legend-item')
      .filter(function() {
        return d3.select((this as SVGElement).parentElement).attr('data-series') === seriesName;
      })
      .transition().duration(200)
      .attr('opacity', 1);
  }
  
  /**
   * Reset legend highlight
   */
  private resetLegendHighlight(): void {
    this.legendGroup.selectAll('.legend-item')
      .transition().duration(200)
      .attr('opacity', 1);
  }
  
  /**
   * Show tooltip for a series
   * @param event Mouse event
   * @param series Series data
   */
  private showSeriesTooltip(event: any, series: RadarChartData['series'][0]): void {
    const { axes } = this.data;
    
    let tooltipContent = `<div style="font-weight: bold; margin-bottom: 5px;">${series.name}</div>`;
    tooltipContent += '<table style="border-collapse: collapse;">';
    
    axes.forEach((axis, i) => {
      const axisName = axis.label || axis.name;
      const value = series.values[i];
      const formattedValue = this.options.formatAxisValue
        ? this.options.formatAxisValue(value, axis.name)
        : value;
      
      tooltipContent += `
        <tr>
          <td style="padding: 2px 8px 2px 0;">${axisName}:</td>
          <td style="padding: 2px 0; text-align: right; font-weight: bold;">${formattedValue}</td>
        </tr>
      `;
    });
    
    tooltipContent += '</table>';
    
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(tooltipContent);
  }
  
  /**
   * Show tooltip for a specific data point
   * @param event Mouse event
   * @param data Point data
   */
  private showPointTooltip(event: any, data: { series: string, axis: string, value: number }): void {
    const formattedValue = this.options.formatAxisValue
      ? this.options.formatAxisValue(data.value, data.axis)
      : data.value;
    
    const tooltipContent = `
      <div style="font-weight: bold; margin-bottom: 5px;">${data.series}</div>
      <div>${data.axis}: <span style="font-weight: bold;">${formattedValue}</span></div>
    `;
    
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(tooltipContent);
  }
  
  /**
   * Show tooltip for an axis
   * @param event Mouse event
   * @param axis Axis data
   */
  private showAxisTooltip(event: any, axis: RadarChartData['axes'][0]): void {
    let tooltipContent = `<div style="font-weight: bold; margin-bottom: 5px;">${axis.label || axis.name}</div>`;
    
    if (axis.description) {
      tooltipContent += `<div>${axis.description}</div>`;
    }
    
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
  public updateData(data: RadarChartData): void {
    this.data = this.preprocessData(data);
    
    // Update radial scale domain based on new data
    this.radialScale.domain([0, this.getMaxValue()]);
    
    // Update color scale domain
    this.colorScale.domain(this.data.series.map(series => series.name));
    
    // Clear SVG content
    this.svg.selectAll('*').remove();
    
    // Recalculate angle slice if number of axes changed
    this.angleSlice = (Math.PI * 2) / this.data.axes.length;
    
    // Reinitialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Update chart options
   * @param options New options
   */
  public updateOptions(options: Partial<RadarChartOptions>): void {
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
    
    // Recalculate radius
    this.radius = Math.min(this.width - this.margin.left - this.margin.right, 
                           this.height - this.margin.top - this.margin.bottom) / 2;
    
    // Apply radius scale factor
    if (this.options.radiusScaleFactor) {
      this.radius *= this.options.radiusScaleFactor;
    }
    
    // Update radial scale range
    this.radialScale.range([0, this.radius]);
    
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
   * Highlight a specific series
   * @param seriesName Name of the series to highlight
   */
  public highlightSeries(seriesName: string): void {
    this.currentHighlightedSeries = seriesName;
    
    // Highlight in legend
    this.highlightLegendItem(seriesName);
    
    // Highlight radar area
    this.chartGroup.selectAll('path.radar-area')
      .filter(function() {
        return d3.select((this as SVGElement).parentElement).attr('data-series') !== seriesName;
      })
      .transition().duration(200)
      .attr('fill-opacity', 0.1)
      .attr('stroke-opacity', 0.3);
    
    // Highlight points
    this.chartGroup.selectAll('circle.radar-point')
      .filter(function() {
        return d3.select((this as SVGElement).parentElement).attr('data-series') !== seriesName;
      })
      .transition().duration(200)
      .attr('opacity', 0.3);
  }
  
  /**
   * Clear any highlight
   */
  public clearHighlight(): void {
    this.currentHighlightedSeries = null;
    
    // Reset legend
    this.resetLegendHighlight();
    
    // Reset radar areas
    this.chartGroup.selectAll('path.radar-area')
      .transition().duration(200)
      .attr('fill-opacity', d => (d as any).fillOpacity !== undefined ? (d as any).fillOpacity : 0.3)
      .attr('stroke-opacity', 1);
    
    // Reset points
    this.chartGroup.selectAll('circle.radar-point')
      .transition().duration(200)
      .attr('opacity', 1);
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