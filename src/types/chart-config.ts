/**
 * Type definitions for visualization configuration parameters
 * Provides interfaces for various chart and visualization types
 */

/**
 * Base configuration interface for all visualizations
 */
export interface BaseVisualizationConfig {
  /** DOM element that will contain the visualization */
  container: HTMLElement;
  
  /** Width of the visualization in pixels */
  width?: number;
  
  /** Height of the visualization in pixels */
  height?: number;
  
  /** Whether the visualization should auto-resize with its container */
  responsive?: boolean;
  
  /** Margin around the visualization */
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  /** Animation duration in milliseconds */
  animationDuration?: number;
  
  /** Visual theme */
  theme?: 'light' | 'dark' | 'colorful';
  
  /** Color scheme to use for the visualization */
  colorScheme?: string[];
  
  /** Title to display above the visualization */
  title?: string;
  
  /** Description text */
  description?: string;
  
  /** Whether to show a legend */
  showLegend?: boolean;
  
  /** Legend position */
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  
  /** Whether to enable tooltips */
  tooltips?: boolean;
  
  /** Callback for handling click events */
  onClick?: (event: MouseEvent, data: any) => void;
}

/**
 * Configuration for graph visualizations
 */
export interface GraphVisualizationOptions extends BaseVisualizationConfig {
  /** Graph data */
  data: {
    nodes: Array<{
      id: string;
      label?: string;
      type: string;
      properties?: Record<string, any>;
      [key: string]: any;
    }>;
    edges: Array<{
      source: string;
      target: string;
      label?: string;
      [key: string]: any;
    }>;
  };
  
  /** Graph layout algorithm to use */
  layout?: {
    name: string;
    [key: string]: any;
  };
  
  /** Node color (shorthand for nodeStyle.color) */
  nodeColor?: string;
  
  /** Edge color (shorthand for edgeStyle.color) */
  edgeColor?: string;
  
  /** Default node appearance */
  nodeStyle?: {
    color?: string;
    size?: number;
    shape?: string;
    borderColor?: string;
    borderWidth?: number;
    labelColor?: string;
    fontSize?: number;
    opacity?: number;
  };
  
  /** Default edge appearance */
  edgeStyle?: {
    color?: string;
    width?: number;
    style?: 'solid' | 'dashed' | 'dotted';
    arrowShape?: string;
    arrowSize?: number;
    labelColor?: string;
    fontSize?: number;
    opacity?: number;
  };
  
  /** Nodes to highlight initially */
  highlightNodes?: string[];
  
  /** Edges to highlight initially */
  highlightEdges?: string[];
  
  /** Enable physics simulation */
  physics?: boolean;
  
  /** Enable node dragging */
  draggable?: boolean;
  
  /** Enable zooming and panning */
  zoomable?: boolean;
  
  /** Initial zoom level */
  initialZoom?: number;
  
  /** Minimum zoom level */
  minZoom?: number;
  
  /** Maximum zoom level */
  maxZoom?: number;
  
  /** Node spacing */
  nodeSpacing?: number;
  
  /** Whether edges should be curved */
  curvedEdges?: boolean;
  
  /** Function to determine node styling based on data */
  nodeStyleFunction?: (node: any) => any;
  
  /** Function to determine edge styling based on data */
  edgeStyleFunction?: (edge: any) => any;
  
  /** Click event handler */
  onClick?: (event: any) => void;
}

/**
 * Configuration for timeline visualizations
 */
export interface TimelineVisualizationOptions extends BaseVisualizationConfig {
  /** Timeline data */
  data: Array<{
    period: string;
    label: string;
    items: string[];
    [key: string]: any;
  }>;
  
  /** Timeline orientation */
  orientation?: 'horizontal' | 'vertical';
  
  /** Time unit to use */
  timeUnit?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'custom';
  
  /** Start date/time */
  startTime?: Date | string | number;
  
  /** End date/time */
  endTime?: Date | string | number;
  
  /** Whether to show axis labels */
  showAxisLabels?: boolean;
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Whether to allow zooming */
  zoomable?: boolean;
  
  /** Whether to show event labels */
  showEventLabels?: boolean;
  
  /** Format for date/time display */
  timeFormat?: string;
  
  /** Spacing between timeline items */
  itemSpacing?: number;
  
  /** Height of each timeline row (for horizontal timeline) */
  rowHeight?: number;
  
  /** Whether to show period backgrounds */
  showPeriodBackgrounds?: boolean;
  
  /** Whether to group items by period */
  groupByPeriod?: boolean;
  
  /** X-axis label text */
  xAxisLabel?: string;
  
  /** Y-axis label text */
  yAxisLabel?: string;
}

/**
 * Configuration for table visualizations
 */
export interface TableVisualizationOptions extends BaseVisualizationConfig {
  /** Column headers */
  headers: string[];
  
  /** Row data */
  rows: Array<Record<string, any>>;
  
  /** Table caption */
  caption?: string;
  
  /** Whether to enable sorting */
  sortable?: boolean;
  
  /** Whether to enable filtering */
  filterable?: boolean;
  
  /** Whether to enable pagination */
  paginate?: boolean;
  
  /** Number of rows per page if pagination is enabled */
  rowsPerPage?: number;
  
  /** Whether to show row numbers */
  showRowNumbers?: boolean;
  
  /** Cell formatting function */
  formatCell?: (value: any, columnName: string, rowData: Record<string, any>) => string;
  
  /** Function to determine cell styling */
  cellStyleFunction?: (value: any, columnName: string, rowData: Record<string, any>) => Record<string, any>;
  
  /** Cells to highlight */
  highlightCells?: Array<{
    rowIndex: number;
    columnName: string;
  }>;
  
  /** Whether to allow cell editing */
  editable?: boolean;
  
  /** Whether to allow column resizing */
  resizableColumns?: boolean;
  
  /** Default column widths */
  columnWidths?: Record<string, string>;
  
  /** Whether to enable row selection */
  selectable?: boolean;
  
  /** Function called when a row is selected */
  onRowSelect?: (rowData: Record<string, any>, rowIndex: number) => void;
}

/**
 * Configuration for flow diagram visualizations
 */
export interface FlowDiagramVisualizationOptions extends BaseVisualizationConfig {
  /** Node data */
  nodes: Array<{
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start' | 'end' | 'io' | 'custom';
    position?: { x: number; y: number };
    properties?: Record<string, any>;
    width?: number;
    height?: number;
    [key: string]: any;
  }>;
  
  /** Edge data */
  edges: Array<{
    from: string;
    to: string;
    label?: string;
    style?: 'solid' | 'dashed' | 'dotted';
    [key: string]: any;
  }>;
  
  /** Flow direction */
  direction?: 'TB' | 'LR' | 'RL' | 'BT';
  
  /** Whether to automatically position nodes */
  autoLayout?: boolean;
  
  /** Node separation in pixels */
  nodeSeparation?: number;
  
  /** Level separation in pixels */
  levelSeparation?: number;
  
  /** Whether to align nodes in the same rank */
  rankAlignment?: boolean;
  
  /** Style for process nodes */
  processNodeStyle?: Record<string, any>;
  
  /** Style for decision nodes */
  decisionNodeStyle?: Record<string, any>;
  
  /** Style for start nodes */
  startNodeStyle?: Record<string, any>;
  
  /** Style for end nodes */
  endNodeStyle?: Record<string, any>;
  
  /** Style for input/output nodes */
  ioNodeStyle?: Record<string, any>;
  
  /** Default edge style */
  edgeStyle?: Record<string, any>;
  
  /** Whether to enable node dragging */
  draggable?: boolean;
  
  /** Whether to snap nodes to grid when dragging */
  snapToGrid?: boolean;
  
  /** Grid size for snapping */
  gridSize?: number;
  
  /** Whether to show a mini-map */
  showMiniMap?: boolean;
  
  /** Whether to fit the diagram to the container */
  fitToContainer?: boolean;
}

/**
 * Configuration for bar chart visualizations
 */
export interface BarChartVisualizationOptions extends BaseVisualizationConfig {
  /** Chart data */
  data: Array<{
    category: string;
    value: number;
    [key: string]: any;
  }>;
  
  /** X-axis label */
  xAxisLabel?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** Whether to show data values on bars */
  showValues?: boolean;
  
  /** Bar orientation */
  orientation?: 'vertical' | 'horizontal';
  
  /** Whether to stack bars for multi-series data */
  stacked?: boolean;
  
  /** Whether to group bars for multi-series data */
  grouped?: boolean;
  
  /** Bar padding ratio */
  barPadding?: number;
  
  /** Format for value labels */
  valueFormat?: string;
  
  /** Y-axis start value */
  yAxisStartsAtZero?: boolean;
  
  /** Whether to sort bars by value */
  sortBars?: boolean;
  
  /** Sort direction if sorting is enabled */
  sortDirection?: 'ascending' | 'descending';
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Whether bars should have rounded corners */
  roundedBars?: boolean;
  
  /** Whether to animate on data change */
  animate?: boolean;
}

/**
 * Configuration for pie chart visualizations
 */
export interface PieChartVisualizationOptions extends BaseVisualizationConfig {
  /** Chart data */
  data: Array<{
    label: string;
    value: number;
    [key: string]: any;
  }>;
  
  /** Whether to render as a donut chart */
  donut?: boolean;
  
  /** Inner radius ratio for donut charts */
  innerRadius?: number;
  
  /** Outer radius */
  outerRadius?: number;
  
  /** Start angle in degrees */
  startAngle?: number;
  
  /** End angle in degrees */
  endAngle?: number;
  
  /** Whether to show data labels on slices */
  showLabels?: boolean;
  
  /** Whether to show percentage values */
  showPercentages?: boolean;
  
  /** Format for value labels */
  labelFormat?: string;
  
  /** Minimum angle for a slice to show label */
  minLabelAngle?: number;
  
  /** Label position */
  labelPosition?: 'inside' | 'outside';
  
  /** Values to explode (pull out from the center) */
  explode?: number[];
  
  /** Whether to enable slice selection */
  selectable?: boolean;
  
  /** Function called when a slice is selected */
  onSelect?: (data: any, index: number) => void;
}

/**
 * Configuration for radar chart visualizations
 */
export interface RadarChartVisualizationOptions extends BaseVisualizationConfig {
  /** Chart data */
  data: Array<{
    category: string;
    values: Record<string, number>;
  }>;
  
  /** Maximum value for the radius */
  maxValue?: number;
  
  /** Whether to fill the radar area */
  fill?: boolean;
  
  /** Fill opacity */
  fillOpacity?: number;
  
  /** Whether to show labels for each axis */
  showAxisLabels?: boolean;
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Number of grid levels */
  gridLevels?: number;
  
  /** Whether to show data points */
  showPoints?: boolean;
  
  /** Whether to show value labels */
  showValues?: boolean;
  
  /** Format for value labels */
  valueFormat?: string;
  
  /** Whether to smooth the connecting lines */
  smoothLines?: boolean;
}

/**
 * Configuration for line chart visualizations
 */
export interface LineChartVisualizationOptions extends BaseVisualizationConfig {
  /** Chart data */
  data: Array<{
    x: number | string | Date;
    y: number;
    [key: string]: any;
  }>;
  
  /** Series configuration for multi-series data */
  series?: Array<{
    name: string;
    data: Array<{ x: number | string | Date; y: number }>;
    color?: string;
    lineWidth?: number;
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    showPoints?: boolean;
    pointSize?: number;
    pointShape?: string;
    fillArea?: boolean;
    fillOpacity?: number;
  }>;
  
  /** X-axis label */
  xAxisLabel?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** X-axis format */
  xAxisFormat?: string;
  
  /** Y-axis format */
  yAxisFormat?: string;
  
  /** X-axis tick rotation in degrees */
  xAxisTickRotation?: number;
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Whether to curve the lines */
  curveLines?: boolean;
  
  /** Curve interpolation type */
  curveType?: 'linear' | 'monotone' | 'step' | 'natural';
  
  /** Whether to show data points */
  showPoints?: boolean;
  
  /** Whether to show value labels */
  showValues?: boolean;
  
  /** Whether to show a trend line */
  showTrendLine?: boolean;
  
  /** Whether y-axis starts at zero */
  yAxisStartsAtZero?: boolean;
}

/**
 * Configuration for scatter plot visualizations
 */
export interface ScatterPlotVisualizationOptions extends BaseVisualizationConfig {
  /** Plot data */
  data: Array<{
    x: number;
    y: number;
    size?: number;
    color?: string;
    label?: string;
    [key: string]: any;
  }>;
  
  /** X-axis label */
  xAxisLabel?: string;
  
  /** Y-axis label */
  yAxisLabel?: string;
  
  /** X-axis min value */
  xMin?: number;
  
  /** X-axis max value */
  xMax?: number;
  
  /** Y-axis min value */
  yMin?: number;
  
  /** Y-axis max value */
  yMax?: number;
  
  /** Whether to show grid lines */
  showGrid?: boolean;
  
  /** Point size (default if not specified in data) */
  pointSize?: number;
  
  /** Point shape */
  pointShape?: 'circle' | 'square' | 'triangle' | 'cross' | 'diamond';
  
  /** Whether to show labels for points */
  showLabels?: boolean;
  
  /** Whether to show a trend line */
  showTrendLine?: boolean;
  
  /** Whether to show point borders */
  showPointBorders?: boolean;
  
  /** Whether to show quadrant lines */
  showQuadrants?: boolean;
  
  /** Labels for quadrants */
  quadrantLabels?: [string, string, string, string];
}

/**
 * Configuration for heatmap visualizations
 */
export interface HeatmapVisualizationOptions extends BaseVisualizationConfig {
  /** Heatmap data as a matrix */
  data: Array<Array<number>>;
  
  /** Labels for x-axis cells */
  xLabels: string[];
  
  /** Labels for y-axis cells */
  yLabels: string[];
  
  /** Color scale type */
  colorScale?: 'sequential' | 'diverging';
  
  /** Colors to use for the heatmap gradient */
  colors?: string[];
  
  /** Minimum value for color scaling */
  minValue?: number;
  
  /** Maximum value for color scaling */
  maxValue?: number;
  
  /** Whether to show cell values */
  showValues?: boolean;
  
  /** Format for cell values */
  valueFormat?: string;
  
  /** Whether to show x-axis labels */
  showXLabels?: boolean;
  
  /** Whether to show y-axis labels */
  showYLabels?: boolean;
  
  /** X-axis label rotation in degrees */
  xLabelRotation?: number;
  
  /** Whether to enable cell selection */
  selectable?: boolean;
  
  /** Cell padding */
  cellPadding?: number;
  
  /** Whether to show cell borders */
  showCellBorders?: boolean;
}

/**
 * Configuration for tree map visualizations
 */
export interface TreeMapVisualizationOptions extends BaseVisualizationConfig {
  /** Hierarchical data for the tree map */
  data: {
    name: string;
    value?: number;
    children?: any[];
  };
  
  /** Color scale type */
  colorScale?: 'categorical' | 'sequential' | 'diverging';
  
  /** Colors to use for the tree map */
  colors?: string[];
  
  /** Whether to show labels */
  showLabels?: boolean;
  
  /** Whether to show values */
  showValues?: boolean;
  
  /** Format for value labels */
  valueFormat?: string;
  
  /** Padding between cells */
  padding?: number;
  
  /** Whether to enable zooming into nodes */
  zoomable?: boolean;
  
  /** Whether to show borders */
  showBorders?: boolean;
  
  /** Border color */
  borderColor?: string;
  
  /** Levels to display initially */
  maxDepth?: number;
  
  /** Sort function for nodes */
  sortFunction?: (a: any, b: any) => number;
}

/**
 * Configuration for ASCII to SVG visualizations
 */
export interface AsciiToSvgOptions extends BaseVisualizationConfig {
  /** ASCII text to convert */
  text: string;
  
  /** Cell width for characters */
  boxWidth?: number;
  
  /** Cell height for characters */
  boxHeight?: number;
  
  /** Color for lines */
  lineColor?: string;
  
  /** Color for text */
  textColor?: string;
  
  /** Color for boxes */
  boxColor?: string;
  
  /** Character map for special elements */
  charMap?: Record<string, {
    type: 'line' | 'junction' | 'box' | 'arrow' | 'text';
    [key: string]: any;
  }>;
  
  /** Font family for text */
  fontFamily?: string;
  
  /** Font size for text */
  fontSize?: number;
  
  /** Whether to add padding around the diagram */
  padding?: boolean;
  
  /** Padding amount if padding is enabled */
  paddingAmount?: number;
  
  /** Whether to allow the diagram to be editable */
  editable?: boolean;
}

/**
 * Configuration for force-directed graph layout
 */
export interface ForceDirectedLayoutOptions {
  /** Strength of node repulsion (negative values) or attraction (positive values) */
  repulsionStrength?: number;
  
  /** Strength of link forces */
  linkStrength?: number;
  
  /** Ideal link distance */
  linkDistance?: number;
  
  /** Friction coefficient */
  friction?: number;
  
  /** Gravity strength */
  gravity?: number;
  
  /** Whether to enable charge optimization */
  chargeOptimization?: boolean;
  
  /** Maximum iterations for force simulation */
  iterations?: number;
  
  /** Alpha decay rate */
  alphaDecay?: number;
  
  /** Alpha minimum */
  alphaMin?: number;
  
  /** Velocity decay rate */
  velocityDecay?: number;
}

/**
 * Configuration for hierarchical graph layout
 */
export interface HierarchicalLayoutOptions {
  /** Layout direction */
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  
  /** Vertical level separation */
  levelSeparation?: number;
  
  /** Horizontal node separation within a level */
  nodeSeparation?: number;
  
  /** Edge routing style */
  edgeRouting?: 'orthogonal' | 'curved' | 'straight';
  
  /** Whether to align parents with their children */
  parentCentralization?: boolean;
  
  /** Whether to sort nodes within the same level */
  sortMethod?: 'hubsize' | 'directed' | 'none';
  
  /** Whether to shorten edges */
  shortEdges?: boolean;
  
  /** Whether to position leafs at the edge of the graph */
  edgeBundling?: boolean;
  
  /** Strength of edge bundling */
  edgeBundlingStrength?: number;
}