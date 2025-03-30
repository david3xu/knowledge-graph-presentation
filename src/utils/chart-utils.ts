/**
 * Chart Utilities
 * Provides utility functions for chart creation and data manipulation
 */

/**
 * Data point for charts
 */
export interface DataPoint {
    /** Category or label for the data point */
    category: string;
    
    /** Numeric value */
    value: number;
    
    /** Additional data */
    [key: string]: any;
  }
  
  /**
   * Series data for multi-series charts
   */
  export interface SeriesData {
    /** Series name */
    name: string;
    
    /** Data points for this series */
    data: DataPoint[];
    
    /** Color for this series (optional) */
    color?: string;
    
    /** Additional properties */
    [key: string]: any;
  }
  
  /**
   * Color scale type definition
   */
  export type ColorScale = 'sequential' | 'diverging' | 'categorical';
  
  /**
   * Chart types supported by the utility
   */
  export type ChartType = 
    | 'bar' 
    | 'line' 
    | 'pie' 
    | 'donut' 
    | 'area'
    | 'scatter'
    | 'radar'
    | 'heatmap'
    | 'histogram'
    | 'boxplot'
    | 'treemap';
  
  /**
   * Color scheme definition
   */
  export interface ColorScheme {
    /** Color scale type */
    type: ColorScale;
    
    /** Array of colors */
    colors: string[];
  }
  
  /**
   * Scale type for axes
   */
  export type ScaleType = 'linear' | 'log' | 'time' | 'ordinal' | 'band';
  
  /**
   * Axis configuration
   */
  export interface AxisConfig {
    /** Title for the axis */
    title?: string;
    
    /** Scale type */
    scale?: ScaleType;
    
    /** Whether to include zero in the domain */
    includeZero?: boolean;
    
    /** Domain range (min/max) */
    domain?: [number, number] | [Date, Date] | string[];
    
    /** Format string for tick labels */
    tickFormat?: string;
    
    /** Number of ticks to display */
    tickCount?: number;
    
    /** Whether to show grid lines */
    grid?: boolean;
    
    /** Whether to reverse the axis direction */
    reverse?: boolean;
  }
  
  /**
   * Legend position options
   */
  export type LegendPosition = 'top' | 'right' | 'bottom' | 'left';
  
  /**
   * Legend configuration
   */
  export interface LegendConfig {
    /** Whether to show the legend */
    show: boolean;
    
    /** Position of the legend */
    position: LegendPosition;
    
    /** Title for the legend */
    title?: string;
    
    /** Orientation of the legend items */
    orientation?: 'horizontal' | 'vertical';
    
    /** Shape of legend symbols */
    symbolShape?: 'circle' | 'square' | 'line';
    
    /** Size of legend symbols */
    symbolSize?: number;
  }
  
  /**
   * Options for data transformation
   */
  export interface TransformOptions {
    /** Whether to sort the data */
    sort?: 'ascending' | 'descending' | 'none';
    
    /** Field to sort by */
    sortBy?: string;
    
    /** Number of items to include (others will be grouped) */
    limit?: number;
    
    /** Name for the "others" category */
    othersName?: string;
    
    /** Field to group by */
    groupBy?: string;
    
    /** Aggregation function */
    aggregate?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    
    /** Field to aggregate */
    aggregateField?: string;
  }
  
  /**
   * Predefined color schemes
   */
  export const COLOR_SCHEMES: Record<string, ColorScheme> = {
    category10: {
      type: 'categorical',
      colors: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ]
    },
    paired: {
      type: 'categorical',
      colors: [
        '#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99',
        '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a'
      ]
    },
    blueMono: {
      type: 'sequential',
      colors: ['#deebf7', '#9ecae1', '#3182bd']
    },
    redMono: {
      type: 'sequential',
      colors: ['#fee0d2', '#fc9272', '#de2d26']
    },
    greenMono: {
      type: 'sequential',
      colors: ['#e5f5e0', '#a1d99b', '#31a354']
    },
    blueTeal: {
      type: 'sequential',
      colors: ['#edf8fb', '#b3cde3', '#8c96c6', '#8856a7', '#810f7c']
    },
    redYellowBlue: {
      type: 'diverging',
      colors: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', 
               '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
    }
  };
  
  /**
   * Default data transformation options
   */
  const DEFAULT_TRANSFORM_OPTIONS: TransformOptions = {
    sort: 'none',
    limit: 0,
    othersName: 'Others',
    aggregate: 'sum'
  };
  
  /**
   * Sorts data points based on provided options
   * @param data Array of data points
   * @param options Sort options
   * @returns Sorted array of data points
   */
  export function sortData(data: DataPoint[], options: {
    direction: 'ascending' | 'descending';
    field?: string;
  }): DataPoint[] {
    const field = options.field || 'value';
    
    return [...data].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return options.direction === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return options.direction === 'ascending'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }
  
  /**
   * Limits the number of data points, grouping excess into an "others" category
   * @param data Array of data points
   * @param limit Maximum number of distinct items to show
   * @param othersName Name for the "others" category
   * @returns Limited array of data points
   */
  export function limitData(data: DataPoint[], limit: number, othersName: string = 'Others'): DataPoint[] {
    if (limit <= 0 || data.length <= limit) {
      return [...data];
    }
    
    const topItems = data.slice(0, limit);
    const otherItems = data.slice(limit);
    
    if (otherItems.length > 0) {
      const othersValue = otherItems.reduce((sum, item) => sum + item.value, 0);
      
      topItems.push({
        category: othersName,
        value: othersValue,
        isAggregated: true,
        aggregatedCount: otherItems.length
      });
    }
    
    return topItems;
  }
  
  /**
   * Groups data by a specified field and aggregates values
   * @param data Array of data points
   * @param options Grouping options
   * @returns Grouped and aggregated data
   */
  export function groupData(data: DataPoint[], options: {
    groupBy: string;
    aggregate: 'sum' | 'avg' | 'min' | 'max' | 'count';
    valueField?: string;
  }): DataPoint[] {
    const valueField = options.valueField || 'value';
    const groups = new Map<string, DataPoint[]>();
    
    // Group data by the specified field
    data.forEach(item => {
      const groupKey = String(item[options.groupBy]);
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });
    
    // Aggregate values for each group
    return Array.from(groups.entries()).map(([category, items]) => {
      let value: number;
      
      switch (options.aggregate) {
        case 'sum':
          value = items.reduce((sum, item) => sum + (item[valueField] as number), 0);
          break;
        case 'avg':
          value = items.reduce((sum, item) => sum + (item[valueField] as number), 0) / items.length;
          break;
        case 'min':
          value = Math.min(...items.map(item => item[valueField] as number));
          break;
        case 'max':
          value = Math.max(...items.map(item => item[valueField] as number));
          break;
        case 'count':
          value = items.length;
          break;
        default:
          value = items.reduce((sum, item) => sum + (item[valueField] as number), 0);
      }
      
      return {
        category,
        value,
        items,
        isAggregated: true,
        aggregatedCount: items.length,
        aggregationType: options.aggregate
      };
    });
  }
  
  /**
   * Transforms data according to provided options
   * @param data Array of data points
   * @param options Transformation options
   * @returns Transformed data
   */
  export function transformData(data: DataPoint[], options: TransformOptions = {}): DataPoint[] {
    const mergedOptions = { ...DEFAULT_TRANSFORM_OPTIONS, ...options };
    let result = [...data];
    
    // Group data if specified
    if (mergedOptions.groupBy) {
      result = groupData(result, {
        groupBy: mergedOptions.groupBy,
        aggregate: mergedOptions.aggregate || 'sum',
        valueField: mergedOptions.aggregateField
      });
    }
    
    // Sort data if specified
    if (mergedOptions.sort && mergedOptions.sort !== 'none') {
      result = sortData(result, {
        direction: mergedOptions.sort,
        field: mergedOptions.sortBy
      });
    }
    
    // Limit data if specified
    if (mergedOptions.limit && mergedOptions.limit > 0) {
      result = limitData(result, mergedOptions.limit, mergedOptions.othersName);
    }
    
    return result;
  }
  
  /**
   * Calculates the domain (min and max values) for a dataset
   * @param data Array of data points
   * @param field Field to calculate the domain for
   * @param includeZero Whether to include zero in the domain
   * @returns Domain array [min, max]
   */
  export function calculateDomain(
    data: DataPoint[],
    field: string = 'value',
    includeZero: boolean = true
  ): [number, number] {
    if (data.length === 0) {
      return [0, 10];
    }
    
    const values = data.map(item => Number(item[field]));
    let min = Math.min(...values);
    const max = Math.max(...values);
    
    if (includeZero) {
      min = Math.min(0, min);
    }
    
    // Add a small buffer
    const range = max - min;
    const buffer = range * 0.05;
    
    return [min - buffer, max + buffer];
  }
  
  /**
   * Calculates the categories (distinct values) for a dataset
   * @param data Array of data points
   * @param field Field to extract categories from
   * @returns Array of unique categories
   */
  export function calculateCategories(data: DataPoint[], field: string = 'category'): string[] {
    const categories = new Set<string>();
    
    data.forEach(item => {
      if (item[field] !== undefined) {
        categories.add(String(item[field]));
      }
    });
    
    return Array.from(categories);
  }
  
  /**
   * Gets a color scheme by name or creates one from an array of colors
   * @param scheme Color scheme name or array of colors
   * @param type Type of color scale
   * @returns Color scheme object
   */
  export function getColorScheme(
    scheme: string | string[],
    type: ColorScale = 'categorical'
  ): ColorScheme {
    if (Array.isArray(scheme)) {
      return { type, colors: scheme };
    }
    
    return COLOR_SCHEMES[scheme] || COLOR_SCHEMES.category10;
  }
  
  /**
   * Gets a color from a color scheme for a specific index or value
   * @param scheme Color scheme
   * @param index Index or normalized value (0-1 for sequential/diverging scales)
   * @returns Color string
   */
  export function getColor(scheme: ColorScheme, index: number): string {
    const { colors, type } = scheme;
    
    if (colors.length === 0) {
      return '#000000';
    }
    
    if (type === 'categorical') {
      return colors[index % colors.length];
    }
    
    // For sequential and diverging scales, interpret index as a normalized value (0-1)
    const normalizedIndex = Math.max(0, Math.min(1, index));
    const position = normalizedIndex * (colors.length - 1);
    const lowerIndex = Math.floor(position);
    const upperIndex = Math.ceil(position);
    
    if (lowerIndex === upperIndex) {
      return colors[lowerIndex];
    }
    
    // Interpolate between colors
    const t = position - lowerIndex;
    return interpolateColor(colors[lowerIndex], colors[upperIndex], t);
  }
  
  /**
   * Interpolates between two colors
   * @param color1 First color
   * @param color2 Second color
   * @param t Interpolation factor (0-1)
   * @returns Interpolated color
   */
  export function interpolateColor(color1: string, color2: string, t: number): string {
    // Convert hex to RGB
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) {
      return color1;
    }
    
    // Interpolate RGB values
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
    
    // Convert back to hex
    return rgbToHex(r, g, b);
  }
  
  /**
   * Converts a hex color string to RGB values
   * @param hex Hex color string
   * @returns RGB object or null if invalid
   */
  export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
  
  /**
   * Converts RGB values to a hex color string
   * @param r Red value (0-255)
   * @param g Green value (0-255)
   * @param b Blue value (0-255)
   * @returns Hex color string
   */
  export function rgbToHex(r: number, g: number, b: number): string {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  }
  
  /**
   * Converts a numeric value to a hex string
   * @param c Component value (0-255)
   * @returns Hex string
   */
  function componentToHex(c: number): string {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
  
  /**
   * Formats a number as a string with appropriate units (K, M, B)
   * @param value Numeric value
   * @param decimals Number of decimal places
   * @returns Formatted string
   */
  export function formatNumber(value: number, decimals: number = 1): string {
    if (Math.abs(value) < 1000) {
      return value.toFixed(decimals).replace(/\.0+$/, '');
    }
    
    const units = ['', 'K', 'M', 'B', 'T'];
    const factor = Math.floor(Math.log10(Math.abs(value)) / 3);
    const unitIndex = Math.min(factor, units.length - 1);
    
    const scaledValue = value / Math.pow(1000, unitIndex);
    return `${scaledValue.toFixed(decimals).replace(/\.0+$/, '')}${units[unitIndex]}`;
  }
  
  /**
   * Creates a text label for a data point based on the specified format
   * @param dataPoint Data point
   * @param format Format string
   * @returns Formatted text label
   */
  export function formatLabel(dataPoint: DataPoint, format: string = '{category}: {value}'): string {
    return format.replace(/{([^}]+)}/g, (match, field) => {
      const value = dataPoint[field];
      
      if (field === 'value' && typeof value === 'number') {
        return formatNumber(value);
      }
      
      return value !== undefined ? String(value) : match;
    });
  }
  
  /**
   * Generates tick values for an axis
   * @param domain Domain range [min, max]
   * @param tickCount Approximate number of ticks
   * @returns Array of tick values
   */
  export function generateTicks(domain: [number, number], tickCount: number = 5): number[] {
    const [min, max] = domain;
    const range = max - min;
    
    // Use nice step sizes
    const roughStep = range / (tickCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const steps = [1, 2, 5, 10];
    
    let stepSize = magnitude;
    let error = Math.abs(roughStep - magnitude);
    
    steps.forEach(step => {
      const testSize = magnitude * step;
      const testError = Math.abs(roughStep - testSize);
      
      if (testError < error) {
        stepSize = testSize;
        error = testError;
      }
    });
    
    // Generate ticks with the selected step size
    const ticks: number[] = [];
    const start = Math.ceil(min / stepSize) * stepSize;
    
    for (let tick = start; tick <= max; tick += stepSize) {
      ticks.push(Number(tick.toFixed(10))); // Fix floating point precision issues
    }
    
    return ticks;
  }
  
  /**
   * Formats data for a pie chart
   * @param data Array of data points
   * @param options Transformation options
   * @returns Processed data with percentages
   */
  export function formatPieData(data: DataPoint[], options: TransformOptions = {}): Array<DataPoint & { percentage: number }> {
    const transformedData = transformData(data, options);
    const total = transformedData.reduce((sum, item) => sum + item.value, 0);
    
    return transformedData.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0
    }));
  }
  
  /**
   * Creates a stacked version of series data
   * @param series Array of series data
   * @returns Stacked series data with cumulative values
   */
  export function stackSeries(series: SeriesData[]): SeriesData[] {
    if (series.length === 0) {
      return [];
    }
    
    // Get all unique categories across all series
    const allCategories = new Set<string>();
    series.forEach(s => {
      s.data.forEach(d => {
        allCategories.add(d.category);
      });
    });
    
    // Create a map for quick category lookup in each series
    const seriesMaps = series.map(s => {
      const map = new Map<string, DataPoint>();
      s.data.forEach(d => {
        map.set(d.category, d);
      });
      return map;
    });
    
    // Create stacked series
    const stackedSeries: SeriesData[] = [];
    const cumulativeValues = new Map<string, number>();
    
    // Initialize cumulative values
    allCategories.forEach(category => {
      cumulativeValues.set(category, 0);
    });
    
    // Process each series
    for (let i = 0; i < series.length; i++) {
      const s = series[i];
      const stackedData: DataPoint[] = [];
      
      // Process each category
      allCategories.forEach(category => {
        const originalPoint = seriesMaps[i].get(category);
        const value = originalPoint ? originalPoint.value : 0;
        const previousValue = cumulativeValues.get(category) || 0;
        
        // Create stacked data point
        stackedData.push({
          category,
          value,
          stackedValue: value,
          y0: previousValue,
          y1: previousValue + value,
          ...(originalPoint || { })
        });
        
        // Update cumulative value
        cumulativeValues.set(category, previousValue + value);
      });
      
      // Add to stacked series
      stackedSeries.push({
        ...s,
        data: stackedData
      });
    }
    
    return stackedSeries;
  }
  
  /**
   * Normalizes series data as percentages
   * @param series Array of series data
   * @returns Normalized series data with percentages
   */
  export function normalizeSeries(series: SeriesData[]): SeriesData[] {
    if (series.length === 0) {
      return [];
    }
    
    // Get all unique categories
    const allCategories = new Set<string>();
    series.forEach(s => {
      s.data.forEach(d => {
        allCategories.add(d.category);
      });
    });
    
    // Calculate totals for each category
    const categoryTotals = new Map<string, number>();
    
    allCategories.forEach(category => {
      let total = 0;
      
      series.forEach(s => {
        const point = s.data.find(d => d.category === category);
        if (point) {
          total += point.value;
        }
      });
      
      categoryTotals.set(category, total);
    });
    
    // Normalize each series
    return series.map(s => {
      const normalizedData = s.data.map(d => {
        const total = categoryTotals.get(d.category) || 0;
        const percentage = total > 0 ? (d.value / total) * 100 : 0;
        
        return {
          ...d,
          originalValue: d.value,
          value: percentage,
          percentage
        };
      });
      
      return {
        ...s,
        data: normalizedData
      };
    });
  }
  
  /**
   * Calculates statistics for a dataset
   * @param data Array of data points
   * @param field Field to calculate statistics for
   * @returns Statistical measures
   */
  export function calculateStatistics(data: DataPoint[], field: string = 'value'): {
    min: number;
    max: number;
    sum: number;
    mean: number;
    median: number;
    standardDeviation: number;
    variance: number;
    count: number;
  } {
    if (data.length === 0) {
      return {
        min: 0,
        max: 0,
        sum: 0,
        mean: 0,
        median: 0,
        standardDeviation: 0,
        variance: 0,
        count: 0
      };
    }
    
    // Extract values
    const values = data.map(d => Number(d[field])).filter(v => !isNaN(v));
    const count = values.length;
    
    if (count === 0) {
      return {
        min: 0,
        max: 0,
        sum: 0,
        mean: 0,
        median: 0,
        standardDeviation: 0,
        variance: 0,
        count: 0
      };
    }
    
    // Sort values for median
    const sortedValues = [...values].sort((a, b) => a - b);
    
    // Calculate statistics
    const min = sortedValues[0];
    const max = sortedValues[count - 1];
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    
    // Calculate median
    const midpoint = Math.floor(count / 2);
    const median = count % 2 === 0
      ? (sortedValues[midpoint - 1] + sortedValues[midpoint]) / 2
      : sortedValues[midpoint];
    
    // Calculate variance and standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      min,
      max,
      sum,
      mean,
      median,
      standardDeviation,
      variance,
      count
    };
  }
  
  /**
   * Creates data for a histogram
   * @param data Array of data points
   * @param options Histogram options
   * @returns Histogram bins
   */
  export function createHistogramData(
    data: DataPoint[],
    options: {
      field?: string;
      bins?: number;
      range?: [number, number];
    } = {}
  ): Array<{ bin: [number, number]; count: number; items: DataPoint[] }> {
    const field = options.field || 'value';
    const binCount = options.bins || 10;
    
    // Extract values
    const values = data.map(d => Number(d[field])).filter(v => !isNaN(v));
    
    if (values.length === 0) {
      return [];
    }
    
    // Determine range
    const minValue = options.range ? options.range[0] : Math.min(...values);
    const maxValue = options.range ? options.range[1] : Math.max(...values);
    const range = maxValue - minValue;
    
    if (range === 0) {
      return [{
        bin: [minValue, maxValue],
        count: values.length,
        items: [...data]
      }];
    }
    
    // Calculate bin width
    const binWidth = range / binCount;
    
    // Create bins
    const bins: Array<{ bin: [number, number]; count: number; items: DataPoint[] }> = [];
    
    for (let i = 0; i < binCount; i++) {
      const lowerBound = minValue + i * binWidth;
      const upperBound = minValue + (i + 1) * binWidth;
      
      bins.push({
        bin: [lowerBound, upperBound],
        count: 0,
        items: []
      });
    }
    
    // Assign data points to bins
    data.forEach(item => {
      const value = Number(item[field]);
      
      if (isNaN(value)) {
        return;
      }
      
      // Handle edge case for the maximum value
      if (value === maxValue) {
        const lastBin = bins[bins.length - 1];
        lastBin.count++;
        lastBin.items.push(item);
        return;
      }
      
      // Find the bin for this value
      const binIndex = Math.floor((value - minValue) / binWidth);
      
      // Only add if within range
      if (binIndex >= 0 && binIndex < bins.length) {
        bins[binIndex].count++;
        bins[binIndex].items.push(item);
      }
    });
    
    return bins;
  }
  
  /**
   * Creates data for a box plot
   * @param data Array of data points
   * @param options Box plot options
   * @returns Box plot data
   */
  export function createBoxPlotData(
    data: DataPoint[],
    options: {
      field?: string;
      groupBy?: string;
    } = {}
  ): Array<{
    category: string;
    min: number;
    lowerQuartile: number;
    median: number;
    upperQuartile: number;
    max: number;
    outliers: number[];
    items: DataPoint[];
  }> {
    const field = options.field || 'value';
    
    // If groupBy is specified, create a box plot for each group
    if (options.groupBy) {
      const groups = new Map<string, DataPoint[]>();
      
      // Group data
      data.forEach(item => {
        const groupKey = String(item[options.groupBy!]);
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(item);
      });
      
      // Create box plot for each group
      return Array.from(groups.entries()).map(([category, items]) => {
        return createSingleBoxPlot(items, field, category);
      });
    }
    
    // Create a single box plot for all data
    return [createSingleBoxPlot(data, field, 'All')];
  }
  
  /**
   * Creates a single box plot from data
   * @param data Data points for the box plot
   * @param field Field to use for values
   * @param category Category label
   * @returns Box plot data
   */
  function createSingleBoxPlot(
    data: DataPoint[],
    field: string,
    category: string
  ): {
    category: string;
    min: number;
    lowerQuartile: number;
    median: number;
    upperQuartile: number;
    max: number;
    outliers: number[];
    items: DataPoint[];
  } {
    // Extract values
    const values = data.map(d => Number(d[field])).filter(v => !isNaN(v));
    
    if (values.length === 0) {
      return {
        category,
        min: 0,
        lowerQuartile: 0,
        median: 0,
        upperQuartile: 0,
        max: 0,
        outliers: [],
        items: []
      };
    }
    
    // Sort values
    const sortedValues = [...values].sort((a, b) => a - b);
    const count = sortedValues.length;
    
    // Calculate quartiles
    const q1Index = Math.floor(count * 0.25);
    const q2Index = Math.floor(count * 0.5);
    const q3Index = Math.floor(count * 0.75);
    
    const q1 = count % 4 === 0
      ? (sortedValues[q1Index - 1] + sortedValues[q1Index]) / 2
      : sortedValues[q1Index];
      
    const median = count % 2 === 0
      ? (sortedValues[q2Index - 1] + sortedValues[q2Index]) / 2
      : sortedValues[q2Index];
      
    const q3 = count % 4 === 0
      ? (sortedValues[q3Index - 1] + sortedValues[q3Index]) / 2
      : sortedValues[q3Index];
    
    // Calculate IQR and bounds for outliers
    const iqr = q3 - q1;
    const lowerOutlierBound = q1 - 1.5 * iqr;
    const upperOutlierBound = q3 + 1.5 * iqr;
    
    // Identify outliers
    const outliers = sortedValues.filter(v => 
      v < lowerOutlierBound || v > upperOutlierBound
    );
    
    // Calculate min and max (excluding outliers)
    const nonOutliers = sortedValues.filter(v => 
      v >= lowerOutlierBound && v <= upperOutlierBound
    );
    
    const min = nonOutliers.length > 0 ? nonOutliers[0] : sortedValues[0];
    const max = nonOutliers.length > 0 ? nonOutliers[nonOutliers.length - 1] : sortedValues[count - 1];
    
    return {
      category,
      min,
      lowerQuartile: q1,
      median,
      upperQuartile: q3,
      max,
      outliers,
      items: data
    };
  }