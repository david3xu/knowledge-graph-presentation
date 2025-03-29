/**
 * Timeline Visualization Component
 * Uses D3.js to render interactive timeline visualizations
 */
import * as d3 from 'd3';
import { TimelineVisualizationOptions } from '../types/chart-config';

/**
 * Core visualization class for rendering timelines
 */
export class TimelineVisualization {
  private container: HTMLElement;
  private data: Array<{
    period: string;
    label: string;
    items: string[];
    [key: string]: any;
  }>;
  private options: TimelineVisualizationOptions;
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private width: number;
  private height: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private currentTransform: d3.ZoomTransform | null = null;

  /**
   * Creates a new timeline visualization instance
   * @param options Configuration options for the timeline visualization
   */
  constructor(options: TimelineVisualizationOptions) {
    this.container = options.container;
    this.data = options.data;
    this.options = this.applyDefaultOptions(options);
    
    this.margin = this.options.margin || { top: 40, right: 20, bottom: 50, left: 50 };
    this.width = (this.options.width || this.container.clientWidth) - this.margin.left - this.margin.right;
    this.height = (this.options.height || 400) - this.margin.top - this.margin.bottom;
  }

  /**
   * Applies default options to user-provided options
   * @param options User options
   * @returns Merged options with defaults applied
   */
  private applyDefaultOptions(options: TimelineVisualizationOptions): TimelineVisualizationOptions {
    const defaults: Partial<TimelineVisualizationOptions> = {
      width: this.container.clientWidth,
      height: 400,
      responsive: true,
      margin: { top: 40, right: 20, bottom: 50, left: 50 },
      animationDuration: 500,
      theme: 'light',
      colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'],
      orientation: 'horizontal',
      showAxisLabels: true,
      showGrid: true,
      zoomable: true,
      showEventLabels: true,
      itemSpacing: 10,
      rowHeight: 50,
      showPeriodBackgrounds: true,
      groupByPeriod: true
    };

    return { ...defaults, ...options };
  }

  /**
   * Initializes the SVG container for the visualization
   */
  private initializeSVG(): void {
    // Clear any existing visualization
    d3.select(this.container).selectAll('svg').remove();
    
    // Create SVG container
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('class', 'timeline-visualization')
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`) as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>;
    
    // Add background rect for better interaction
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');
    
    // Set up zooming if enabled
    if (this.options.zoomable) {
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on('zoom', (event) => {
          this.currentTransform = event.transform;
          this.svg?.attr('transform', `translate(${this.margin.left + event.transform.x},${this.margin.top + event.transform.y}) scale(${event.transform.k})`);
        });
      
      d3.select(this.container).select('svg')
        .call(zoom as any);
    }
    
    // Add title if provided
    if (this.options.title) {
      d3.select(this.container).select('svg')
        .append('text')
        .attr('x', this.width / 2 + this.margin.left)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('class', 'timeline-title')
        .text(this.options.title);
    }
  }

  /**
   * Renders a horizontal timeline
   */
  private renderHorizontalTimeline(): void {
    if (!this.svg) return;
    
    const { data, options, width, height } = this;
    
    // Create x scale for periods
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, width])
      .padding(0.1);
    
    // Create axis
    if (options.showAxisLabels) {
      const xAxis = d3.axisBottom(xScale);
      
      this.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'middle')
        .attr('dy', '1em');
      
      // Add axis label if provided
      if (options.xAxisLabel) {
        this.svg.append('text')
          .attr('class', 'axis-label')
          .attr('x', width / 2)
          .attr('y', height + 40)
          .attr('text-anchor', 'middle')
          .text(options.xAxisLabel);
      }
    }
    
    // Add grid lines if enabled
    if (options.showGrid) {
      this.svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(data.map(d => d.period))
        .enter()
        .append('line')
        .attr('x1', d => (xScale(d) || 0) + xScale.bandwidth())
        .attr('y1', 0)
        .attr('x2', d => (xScale(d) || 0) + xScale.bandwidth())
        .attr('y2', height)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '3,3');
    }
    
    // Create period backgrounds if enabled
    if (options.showPeriodBackgrounds) {
      this.svg.selectAll('.period-bg')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'period-bg')
        .attr('x', d => xScale(d.period) || 0)
        .attr('y', 0)
        .attr('width', xScale.bandwidth())
        .attr('height', height)
        .attr('fill', (d, i) => options.colorScheme ? options.colorScheme[i % options.colorScheme.length] : '#f0f0f0')
        .attr('opacity', 0.2);
    }
    
    // Calculate maximum number of items in any period
    const maxItems = d3.max(data, d => d.items.length) || 0;
    
    // Function to calculate y position for items
    const getYPosition = (itemIndex: number) => {
      const itemSpacing = options.itemSpacing || 10;
      const totalHeight = maxItems * itemSpacing;
      const startY = (height - totalHeight) / 2;
      return startY + itemIndex * itemSpacing;
    };
    
    // Create event groups
    const periodGroups = this.svg.selectAll('.period')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'period')
      .attr('transform', d => `translate(${xScale(d.period) || 0},0)`);
    
    // Add period labels
    periodGroups.append('text')
      .attr('class', 'period-label')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .style('font-weight', 'bold');
    
    // Add event items
    data.forEach((period, periodIndex) => {
      const color = options.colorScheme ? options.colorScheme[periodIndex % options.colorScheme.length] : '#1f77b4';
      
      const periodGroup = periodGroups.filter((d, i) => i === periodIndex);
      
      periodGroup.selectAll('.event-item')
        .data(period.items)
        .enter()
        .append('g')
        .attr('class', 'event-item')
        .attr('transform', (d, i) => `translate(${xScale.bandwidth() / 2},${getYPosition(i)})`)
        .call(g => {
          // Add event marker
          g.append('circle')
            .attr('r', 6)
            .attr('fill', color);
          
          // Add event label if enabled
          if (options.showEventLabels) {
            g.append('text')
              .attr('x', 10)
              .attr('y', 5)
              .text(d => d)
              .attr('text-anchor', 'start')
              .style('font-size', '12px');
          }
        });
    });
    
    // Add event hover behavior
    this.svg.selectAll('.event-item')
      .on('mouseover', function() {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 8);
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 6);
      });
  }

  /**
   * Renders a vertical timeline
   */
  private renderVerticalTimeline(): void {
    if (!this.svg) return;
    
    const { data, options, width, height } = this;
    
    // Create y scale for periods
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.period))
      .range([0, height])
      .padding(0.1);
    
    // Create axis
    if (options.showAxisLabels) {
      const yAxis = d3.axisLeft(yScale);
      
      this.svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
      
      // Add axis label if provided
      if (options.yAxisLabel) {
        this.svg.append('text')
          .attr('class', 'axis-label')
          .attr('transform', 'rotate(-90)')
          .attr('x', -height / 2)
          .attr('y', -40)
          .attr('text-anchor', 'middle')
          .text(options.yAxisLabel);
      }
    }
    
    // Add grid lines if enabled
    if (options.showGrid) {
      this.svg.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(data.map(d => d.period))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', d => (yScale(d) || 0) + yScale.bandwidth())
        .attr('x2', width)
        .attr('y2', d => (yScale(d) || 0) + yScale.bandwidth())
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '3,3');
    }
    
    // Create period backgrounds if enabled
    if (options.showPeriodBackgrounds) {
      this.svg.selectAll('.period-bg')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'period-bg')
        .attr('x', 0)
        .attr('y', d => yScale(d.period) || 0)
        .attr('width', width)
        .attr('height', yScale.bandwidth())
        .attr('fill', (d, i) => options.colorScheme ? options.colorScheme[i % options.colorScheme.length] : '#f0f0f0')
        .attr('opacity', 0.2);
    }
    
    // Add a vertical line representing the timeline
    this.svg.append('line')
      .attr('class', 'timeline-line')
      .attr('x1', width / 4)
      .attr('y1', 0)
      .attr('x2', width / 4)
      .attr('y2', height)
      .attr('stroke', '#999')
      .attr('stroke-width', 2);
    
    // Create period groups
    const periodGroups = this.svg.selectAll('.period')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'period')
      .attr('transform', d => `translate(0,${yScale(d.period) || 0})`);
    
    // Add period labels
    periodGroups.append('text')
      .attr('class', 'period-label')
      .attr('x', width / 8)
      .attr('y', yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d.label)
      .style('font-weight', 'bold');
    
    // Add event items
    data.forEach((period, periodIndex) => {
      const color = options.colorScheme ? options.colorScheme[periodIndex % options.colorScheme.length] : '#1f77b4';
      
      const periodGroup = periodGroups.filter((d, i) => i === periodIndex);
      
      // Calculate available width for event items
      const eventStartX = width / 4;
      const eventWidth = width - eventStartX - 20;
      
      // Calculate item width based on number of items
      const itemSpacing = options.itemSpacing || 10;
      const itemsPerRow = Math.floor(eventWidth / 150) || 1;
      const rowCount = Math.ceil(period.items.length / itemsPerRow);
      
      periodGroup.selectAll('.event-item')
        .data(period.items)
        .enter()
        .append('g')
        .attr('class', 'event-item')
        .attr('transform', (d, i) => {
          const row = Math.floor(i / itemsPerRow);
          const col = i % itemsPerRow;
          const x = eventStartX + col * (eventWidth / itemsPerRow);
          const y = yScale.bandwidth() / 2 - (rowCount * itemSpacing / 2) + row * itemSpacing;
          return `translate(${x},${y})`;
        })
        .call(g => {
          // Add event marker
          g.append('circle')
            .attr('r', 6)
            .attr('fill', color);
          
          // Add event label if enabled
          if (options.showEventLabels) {
            g.append('text')
              .attr('x', 10)
              .attr('y', 5)
              .text(d => d)
              .attr('text-anchor', 'start')
              .style('font-size', '12px');
          }
        });
    });
    
    // Add event hover behavior
    this.svg.selectAll('.event-item')
      .on('mouseover', function() {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 8);
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 6);
      });
  }

  /**
   * Sets up responsive behavior for the visualization
   */
  private setupResponsiveBehavior(): void {
    if (!this.options.responsive) return;
    
    const resizeObserver = new ResizeObserver(() => {
      // Update dimensions
      this.width = this.container.clientWidth - this.margin.left - this.margin.right;
      
      // Redraw visualization
      this.render();
    });
    
    resizeObserver.observe(this.container);
  }

  /**
   * Renders the timeline visualization
   */
  public render(): void {
    // Initialize SVG container
    this.initializeSVG();
    
    // Render based on orientation
    if (this.options.orientation === 'vertical') {
      this.renderVerticalTimeline();
    } else {
      this.renderHorizontalTimeline();
    }
    
    // Set up responsive behavior
    this.setupResponsiveBehavior();
  }

  /**
   * Updates the timeline data and rerenders
   * @param data New timeline data
   */
  public updateData(data: Array<{
    period: string;
    label: string;
    items: string[];
    [key: string]: any;
  }>): void {
    this.data = data;
    this.render();
  }

  /**
   * Updates visualization options and reapplies them
   * @param options New visualization options
   */
  public updateOptions(options: Partial<TimelineVisualizationOptions>): void {
    this.options = { ...this.options, ...options };
    this.render();
  }

  /**
   * Highlights specific periods in the timeline
   * @param periods Array of period identifiers to highlight
   */
  public highlightPeriods(periods: string[]): void {
    if (!this.svg) return;
    
    // Reset all periods to normal
    this.svg.selectAll('.period-bg')
      .attr('opacity', 0.2);
    
    // Highlight selected periods
    this.svg.selectAll('.period-bg')
      .filter((d: any) => periods.includes(d.period))
      .attr('opacity', 0.6);
  }

  /**
   * Exports the current visualization as an SVG string
   * @returns SVG markup as a string
   */
  public exportSVG(): string {
    const svgElement = this.container.querySelector('svg');
    if (!svgElement) return '';
    
    // Clone the SVG to avoid modifying the displayed one
    const clone = svgElement.cloneNode(true) as SVGElement;
    
    // Add any required CSS inline for export
    const styles = document.createElement('style');
    styles.textContent = `
      .timeline-visualization text {
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      .period-label {
        font-weight: bold;
      }
      .axis-label {
        font-size: 14px;
      }
    `;
    
    clone.insertBefore(styles, clone.firstChild);
    
    return new XMLSerializer().serializeToString(clone);
  }

  /**
   * Destroys the visualization and cleans up resources
   */
  public destroy(): void {
    // Remove SVG
    d3.select(this.container).selectAll('svg').remove();
    
    // Remove any event listeners or resize observers
    // (Implementation would depend on specific setup)
  }
}