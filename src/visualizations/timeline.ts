/**
 * Timeline Visualization Component
 * Renders interactive timeline visualizations for knowledge graph evolution
 */
import { TimelineVisualizationOptions } from '../types/chart-config';
import * as d3 from 'd3';

/**
 * Timeline event data interface
 */
interface TimelineEvent {
  date: Date | string | number;
  title: string;
  description?: string;
  category?: string;
  [key: string]: any;
}

/**
 * Timeline period data interface
 */
interface TimelinePeriod {
  period: string;
  label: string;
  items?: string[];
  events?: TimelineEvent[];
  color?: string;
  [key: string]: any;
}

export class TimelineVisualization {
  private container: HTMLElement;
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private data: TimelinePeriod[];
  private options: TimelineVisualizationOptions;
  private margin = { top: 40, right: 40, bottom: 40, left: 40 };
  private innerWidth: number;
  private innerHeight: number;
  private xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleBand<string>;
  private axisGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private contentGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private tooltip!: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  
  /**
   * Creates a new timeline visualization
   * @param options Visualization options
   */
  constructor(options: TimelineVisualizationOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    this.data = this.preprocessData(options.data);
    this.options = this.initializeOptions(options);
    
    // Calculate inner dimensions
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    
    // Initialize scales (will be properly configured in render)
    this.xScale = d3.scaleTime().range([0, this.innerWidth]);
    this.yScale = d3.scaleBand().range([0, this.innerHeight]).padding(0.2);
    
    // Initialize visualization
    this.initializeVisualization();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: TimelineVisualizationOptions): TimelineVisualizationOptions {
    // Default color scheme
    const defaultColorScheme = [
      '#4C9AFF', // Blue
      '#36B37E', // Green
      '#FF5630', // Red
      '#6554C0', // Purple
      '#FFAB00', // Yellow
      '#00B8D9', // Cyan
      '#FF8F73', // Orange
      '#998DD9', // Light purple
      '#79E2F2', // Light blue
      '#79F2C0'  // Light green
    ];
    
    // Merge with provided options
    return {
      ...options,
      showAxisLabels: options.showAxisLabels !== false,
      colorScheme: options.colorScheme || defaultColorScheme,
      orientation: options.orientation || 'horizontal',
      timeUnit: options.timeUnit || 'year',
      showGrid: options.showGrid !== false,
      zoomable: options.zoomable !== false,
      showEventLabels: options.showEventLabels !== false,
      showPeriodBackgrounds: options.showPeriodBackgrounds !== false
    };
  }
  
  /**
   * Preprocess timeline data
   * @param data Raw timeline data
   */
  private preprocessData(data: TimelinePeriod[]): TimelinePeriod[] {
    return data.map(period => {
      // Extract start and end dates from period string (e.g., "1990-2000")
      const [startStr, endStr] = period.period.split('-');
      
      // Handle case where end date is 'Present'
      const endDate = endStr.trim().toLowerCase() === 'present' 
        ? new Date() 
        : this.parseDate(endStr);
      
      return {
        ...period,
        startDate: this.parseDate(startStr),
        endDate: endDate,
        events: (period.events || []).map(event => ({
          ...event,
          date: typeof event.date === 'string' || typeof event.date === 'number' 
            ? this.parseDate(event.date) 
            : event.date
        }))
      };
    });
  }
  
  /**
   * Parse date string or number into Date object
   * @param dateStr Date string or number
   */
  private parseDate(dateStr: string | number): Date {
    if (typeof dateStr === 'number') {
      // Assume it's a year
      return new Date(dateStr, 0, 1);
    }
    
    // Try to parse various date formats
    dateStr = dateStr.toString().trim();
    
    // Check if it's just a year
    if (/^\d{4}$/.test(dateStr)) {
      return new Date(parseInt(dateStr, 10), 0, 1);
    }
    
    // Check if it's month and year (e.g., "Jan 2020" or "01/2020")
    if (/^[a-z]{3}\s+\d{4}$/i.test(dateStr) || /^\d{1,2}\/\d{4}$/.test(dateStr)) {
      const parts = dateStr.split(/[\s\/]/);
      const year = parseInt(parts[1], 10);
      let month = parts[0];
      
      if (/^\d{1,2}$/.test(month)) {
        // Convert numeric month to zero-based index
        return new Date(year, parseInt(month, 10) - 1, 1);
      } else {
        // Convert month name to zero-based index
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthIndex = monthNames.indexOf(month.toLowerCase().substring(0, 3));
        return new Date(year, monthIndex, 1);
      }
    }
    
    // Fallback: try native Date parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Last resort: return current date and log error
    console.error(`Failed to parse date: ${dateStr}`);
    return new Date();
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
      .attr('class', 'timeline-visualization')
      .attr('viewBox', [0, 0, this.width, this.height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create groups for axes and content
    this.contentGroup = this.svg.append('g')
      .attr('class', 'content')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    
    this.axisGroup = this.svg.append('g')
      .attr('class', 'axes');
    
    // Initialize tooltip
    this.tooltip = d3.select(this.container)
      .append('div')
      .attr('class', 'timeline-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '8px')
      .style('pointer-events', 'none')
      .style('z-index', '10');
    
    // Render the visualization
    this.render();
  }
  
  /**
   * Render the timeline visualization
   */
  public render(): void {
    // Update dimensions based on container size
    this.width = this.container.clientWidth || this.width;
    this.height = this.container.clientHeight || this.height;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    
    // Update SVG dimensions
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height].join(' '));
    
    // Configure scales based on orientation
    if (this.options.orientation === 'horizontal') {
      this.renderHorizontalTimeline();
    } else {
      this.renderVerticalTimeline();
    }
  }
  
  /**
   * Render a horizontal timeline
   */
  private renderHorizontalTimeline(): void {
    // Extract all dates for scale domain
    const dates = this.data.flatMap(period => [period.startDate, period.endDate]);
    const minDate = d3.min(dates) || new Date(1900, 0, 1);
    const maxDate = d3.max(dates) || new Date();
    
    // Configure scales
    this.xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([0, this.innerWidth]);
    
    this.yScale = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, this.innerHeight])
      .padding(0.2);
    
    // Clear content group
    this.contentGroup.selectAll('*').remove();
    this.axisGroup.selectAll('*').remove();
    
    // Render period backgrounds if enabled
    if (this.options.showPeriodBackgrounds) {
      this.renderPeriodBackgrounds(true);
    }
    
    // Render time axis
    const xAxis = d3.axisBottom(this.xScale);
    this.axisGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(${this.margin.left},${this.margin.top + this.innerHeight})`)
      .call(xAxis);
    
    // Render y-axis (period labels)
    if (this.options.showAxisLabels) {
      const yAxis = d3.axisLeft(this.yScale);
      this.axisGroup.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
        .call(yAxis);
    }
    
    // Add grid lines if enabled
    if (this.options.showGrid) {
      this.contentGroup.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(this.xScale.ticks())
        .enter()
        .append('line')
        .attr('x1', d => this.xScale(d))
        .attr('x2', d => this.xScale(d))
        .attr('y1', 0)
        .attr('y2', this.innerHeight)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '3,3');
    }
    
    // Render events for each period
    this.data.forEach((period, i) => {
      const rowY = this.yScale(period.label) || 0;
      const rowHeight = this.yScale.bandwidth();
      
      // Render event points
      if (period.events && period.events.length > 0) {
        this.contentGroup.selectAll(`.event-${i}`)
          .data(period.events)
          .enter()
          .append('circle')
          .attr('class', `event-${i}`)
          .attr('cx', d => this.xScale(d.date instanceof Date ? d.date : new Date(d.date)))
          .attr('cy', rowY + rowHeight / 2)
          .attr('r', 6)
          .attr('fill', period.color || this.options.colorScheme![i % this.options.colorScheme!.length])
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .on('mouseover', (event, d) => this.showEventTooltip(event, d))
          .on('mouseout', () => this.hideTooltip());
        
        // Add event labels if enabled
        if (this.options.showEventLabels) {
          this.contentGroup.selectAll(`.event-label-${i}`)
            .data(period.events)
            .enter()
            .append('text')
            .attr('class', `event-label-${i}`)
            .attr('x', d => this.xScale(d.date instanceof Date ? d.date : new Date(d.date)))
            .attr('y', rowY + rowHeight / 2 - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .text(d => d.title.length > 15 ? d.title.substring(0, 12) + '...' : d.title);
        }
      }
      
      // Render item indicators (bullets)
      if (period.items && period.items.length > 0) {
        // Distribute items evenly across the period
        const startX = this.xScale(period.startDate);
        const endX = this.xScale(period.endDate);
        const itemWidth = (endX - startX) / (period.items.length + 1);
        
        period.items.forEach((item, j) => {
          const itemX = startX + itemWidth * (j + 1);
          
          // Add bullet point
          this.contentGroup.append('circle')
            .attr('cx', itemX)
            .attr('cy', rowY + rowHeight / 2)
            .attr('r', 4)
            .attr('fill', period.color || this.options.colorScheme![i % this.options.colorScheme!.length])
            .on('mouseover', (event) => this.showItemTooltip(event, item))
            .on('mouseout', () => this.hideTooltip());
        });
      }
    });
    
    // Add x-axis label if provided
    if (this.options.xAxisLabel) {
      this.svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', this.width / 2)
        .attr('y', this.height - 5)
        .attr('text-anchor', 'middle')
        .text(this.options.xAxisLabel);
    }
  }
  
  /**
   * Render a vertical timeline
   */
  private renderVerticalTimeline(): void {
    // Extract all dates for scale domain
    const dates = this.data.flatMap(period => [period.startDate, period.endDate]);
    const minDate = d3.min(dates) || new Date(1900, 0, 1);
    const maxDate = d3.max(dates) || new Date();
    
    // Configure scales (inverted for vertical layout)
    this.yScale = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, this.innerWidth])
      .padding(0.2);
    
    this.xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([this.innerHeight, 0]);
    
    // Clear content group
    this.contentGroup.selectAll('*').remove();
    this.axisGroup.selectAll('*').remove();
    
    // Render period backgrounds if enabled
    if (this.options.showPeriodBackgrounds) {
      this.renderPeriodBackgrounds(false);
    }
    
    // Render time axis
    const yAxis = d3.axisLeft(this.xScale);
    this.axisGroup.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      .call(yAxis);
    
    // Render x-axis (period labels)
    if (this.options.showAxisLabels) {
      const xAxis = d3.axisBottom(this.yScale);
      this.axisGroup.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(${this.margin.left},${this.margin.top + this.innerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    }
    
    // Add grid lines if enabled
    if (this.options.showGrid) {
      this.contentGroup.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(this.xScale.ticks())
        .enter()
        .append('line')
        .attr('y1', d => this.xScale(d))
        .attr('y2', d => this.xScale(d))
        .attr('x1', 0)
        .attr('x2', this.innerWidth)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-dasharray', '3,3');
    }
    
    // Render events for each period
    this.data.forEach((period, i) => {
      const rowX = this.yScale(period.label) || 0;
      const rowWidth = this.yScale.bandwidth();
      
      // Render event points
      if (period.events && period.events.length > 0) {
        this.contentGroup.selectAll(`.event-${i}`)
          .data(period.events)
          .enter()
          .append('circle')
          .attr('class', `event-${i}`)
          .attr('cy', d => this.xScale(d.date instanceof Date ? d.date : new Date(d.date)))
          .attr('cx', rowX + rowWidth / 2)
          .attr('r', 6)
          .attr('fill', period.color || this.options.colorScheme![i % this.options.colorScheme!.length])
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .on('mouseover', (event, d) => this.showEventTooltip(event, d))
          .on('mouseout', () => this.hideTooltip());
        
        // Add event labels if enabled
        if (this.options.showEventLabels) {
          this.contentGroup.selectAll(`.event-label-${i}`)
            .data(period.events)
            .enter()
            .append('text')
            .attr('class', `event-label-${i}`)
            .attr('y', d => this.xScale(d.date instanceof Date ? d.date : new Date(d.date)) + 4)
            .attr('x', rowX + rowWidth / 2 + 10)
            .attr('text-anchor', 'start')
            .attr('font-size', '10px')
            .text(d => d.title.length > 15 ? d.title.substring(0, 12) + '...' : d.title);
        }
      }
      
      // Render item indicators (bullets)
      if (period.items && period.items.length > 0) {
        // Distribute items evenly across the period
        const startY = this.xScale(period.endDate);
        const endY = this.xScale(period.startDate);
        const itemHeight = (endY - startY) / (period.items.length + 1);
        
        period.items.forEach((item, j) => {
          const itemY = startY + itemHeight * (j + 1);
          
          // Add bullet point
          this.contentGroup.append('circle')
            .attr('cy', itemY)
            .attr('cx', rowX + rowWidth / 2)
            .attr('r', 4)
            .attr('fill', period.color || this.options.colorScheme![i % this.options.colorScheme!.length])
            .on('mouseover', (event) => this.showItemTooltip(event, item))
            .on('mouseout', () => this.hideTooltip());
        });
      }
    });
    
    // Add y-axis label if provided
    if (this.options.yAxisLabel) {
      this.svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -this.height / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .text(this.options.yAxisLabel);
    }
  }
  
  /**
   * Render period backgrounds
   * @param horizontal Whether the timeline is horizontal or vertical
   */
  private renderPeriodBackgrounds(horizontal: boolean): void {
    this.data.forEach((period, i) => {
      const color = period.color || this.options.colorScheme![i % this.options.colorScheme!.length];
      
      if (horizontal) {
        const y = this.yScale(period.label) || 0;
        const height = this.yScale.bandwidth();
        const x1 = this.xScale(period.startDate);
        const x2 = this.xScale(period.endDate);
        
        this.contentGroup.append('rect')
          .attr('x', x1)
          .attr('y', y)
          .attr('width', x2 - x1)
          .attr('height', height)
          .attr('fill', color)
          .attr('opacity', 0.2);
      } else {
        const x = this.yScale(period.label) || 0;
        const width = this.yScale.bandwidth();
        const y1 = this.xScale(period.endDate);
        const y2 = this.xScale(period.startDate);
        
        this.contentGroup.append('rect')
          .attr('y', y1)
          .attr('x', x)
          .attr('height', y2 - y1)
          .attr('width', width)
          .attr('fill', color)
          .attr('opacity', 0.2);
      }
    });
  }
  
  /**
   * Show tooltip for an event
   * @param event Mouse event
   * @param eventData Event data
   */
  private showEventTooltip(event: any, eventData: any): void {
    // Format date for display
    const dateFormatter = d3.timeFormat('%b %d, %Y');
    const formattedDate = eventData.date instanceof Date 
      ? dateFormatter(eventData.date) 
      : eventData.date;
    
    let tooltipContent = `
      <div><strong>${eventData.title}</strong></div>
      <div><em>${formattedDate}</em></div>
    `;
    
    if (eventData.description) {
      tooltipContent += `<div>${eventData.description}</div>`;
    }
    
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(tooltipContent);
  }
  
  /**
   * Show tooltip for a period item
   * @param event Mouse event
   * @param item Item text
   */
  private showItemTooltip(event: any, item: string): void {
    this.tooltip
      .style('visibility', 'visible')
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .html(`<div>${item}</div>`);
  }
  
  /**
   * Hide the tooltip
   */
  private hideTooltip(): void {
    this.tooltip.style('visibility', 'hidden');
  }
  
  /**
   * Update the visualization with new data
   * @param data New timeline data
   */
  public updateData(data: TimelinePeriod[]): void {
    this.data = this.preprocessData(data);
    this.render();
  }
  
  /**
   * Update visualization options
   * @param options New options
   */
  public updateOptions(options: Partial<TimelineVisualizationOptions>): void {
    this.options = this.initializeOptions({ ...this.options, ...options });
    this.render();
  }
  
  /**
   * Resize the visualization
   * @param width New width
   * @param height New height
   */
  public resize(width?: number, height?: number): void {
    this.width = width || this.container.clientWidth || this.width;
    this.height = height || this.container.clientHeight || this.height;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.render();
  }
  
  /**
   * Clean up resources when the visualization is no longer needed
   */
  public destroy(): void {
    // Remove event listeners
    this.svg.selectAll('*').on('mouseover', null).on('mouseout', null).on('click', null);
    
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}