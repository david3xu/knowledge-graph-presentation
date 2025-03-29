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
   * Configuration for ASCII to SVG conversions
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