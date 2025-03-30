/**
 * Type definitions for table visualization data structures
 * Provides interfaces for tabular data representation and display configurations
 */

/**
 * Represents a cell in a table with value and optional styling
 */
export interface TableCell {
    /** Cell value (can be string, number, boolean, or complex data) */
    value: any;
    
    /** Optional formatter function to control cell display */
    formatter?: (value: any) => string;
    
    /** Display text (overrides formatted value) */
    displayText?: string;
    
    /** Whether this cell spans multiple columns */
    colSpan?: number;
    
    /** Whether this cell spans multiple rows */
    rowSpan?: number;
    
    /** CSS alignment for the cell content */
    alignment?: 'left' | 'center' | 'right';
    
    /** Whether this cell is a header cell */
    isHeader?: boolean;
    
    /** Whether the cell should be highlighted */
    highlight?: boolean;
    
    /** Additional CSS classes to apply to the cell */
    classes?: string[];
    
    /** Cell background color */
    backgroundColor?: string;
    
    /** Cell text color */
    textColor?: string;
    
    /** Additional styling properties */
    style?: Record<string, string>;
    
    /** Additional custom attributes for the cell */
    attributes?: Record<string, string>;
  }
  
  /**
   * Represents a column definition in a table
   */
  export interface TableColumn {
    /** Unique identifier for the column */
    id: string;
    
    /** Display name for the column header */
    title: string;
    
    /** Field name in the data object to display in this column */
    field?: string;
    
    /** Width of the column (as CSS value) */
    width?: string;
    
    /** Whether the column is visible */
    visible?: boolean;
    
    /** Default alignment for cells in this column */
    alignment?: 'left' | 'center' | 'right';
    
    /** Whether this column can be sorted */
    sortable?: boolean;
    
    /** Whether this column can be filtered */
    filterable?: boolean;
    
    /** Whether this column can be resized by the user */
    resizable?: boolean;
    
    /** Default sort direction for this column */
    defaultSortDirection?: 'asc' | 'desc';
    
    /** Custom formatter function for all cells in this column */
    formatter?: (value: any, row?: any) => string;
    
    /** Custom CSS classes for the column */
    classes?: string[];
    
    /** Custom tooltip text for the column header */
    tooltip?: string;
    
    /** Whether this column should be frozen during horizontal scrolling */
    frozen?: boolean;
    
    /** Custom cell styling function for this column */
    cellStyleFunction?: (value: any, row?: any) => Partial<TableCell>;
  }
  
  /**
   * Represents a row in a table
   */
  export interface TableRow {
    /** Unique identifier for the row */
    id: string;
    
    /** Whether this is a header row */
    isHeader?: boolean;
    
    /** Row data as a record of field -> value */
    data: Record<string, any>;
    
    /** Row cells with explicit configuration (overrides automatic generation from data) */
    cells?: Record<string, TableCell>;
    
    /** Whether this row should be highlighted */
    highlight?: boolean;
    
    /** Whether this row is selectable */
    selectable?: boolean;
    
    /** Whether this row is currently selected */
    selected?: boolean;
    
    /** Whether this row is expandable */
    expandable?: boolean;
    
    /** Whether this row is currently expanded */
    expanded?: boolean;
    
    /** Content to display when the row is expanded */
    expandedContent?: any;
    
    /** Row height (as CSS value) */
    height?: string;
    
    /** Background color for the entire row */
    backgroundColor?: string;
    
    /** Text color for the entire row */
    textColor?: string;
    
    /** Additional CSS classes for the row */
    classes?: string[];
    
    /** Custom attributes for the row */
    attributes?: Record<string, string>;
  }
  
  /**
   * Represents a complete table dataset
   */
  export interface TableData {
    /** Table columns definition */
    columns: TableColumn[];
    
    /** Table rows data */
    rows: TableRow[];
    
    /** Table caption or title */
    caption?: string;
    
    /** Grouping configuration if rows are grouped */
    grouping?: {
      /** Field to group by */
      field: string;
      
      /** Whether groups are initially collapsed */
      collapsed?: boolean;
      
      /** Custom formatter for group headers */
      headerFormatter?: (value: any, count: number) => string;
    };
    
    /** Table footer rows */
    footerRows?: TableRow[];
    
    /** Global cell styling defaults */
    defaultCellStyle?: Partial<TableCell>;
    
    /** Default sorting configuration */
    defaultSort?: {
      /** Column id to sort by */
      columnId: string;
      
      /** Sort direction */
      direction: 'asc' | 'desc';
    };
    
    /** Initial filter state */
    initialFilters?: Record<string, any>;
    
    /** Metadata about the table data */
    metadata?: {
      /** Source of the data */
      source?: string;
      
      /** When the data was last updated */
      lastUpdated?: string;
      
      /** Any additional properties */
      [key: string]: any;
    };
  }
  
  /**
   * Configuration options for table visualization
   */
  export interface TableConfiguration {
    /** Table data to display */
    data: TableData;
    
    /** Whether to enable row selection */
    selectable?: boolean;
    
    /** Selection mode for the table */
    selectionMode?: 'single' | 'multiple';
    
    /** Whether to enable sorting */
    sortable?: boolean;
    
    /** Whether to enable filtering */
    filterable?: boolean;
    
    /** Whether to enable pagination */
    paginate?: boolean;
    
    /** Number of rows per page if pagination is enabled */
    rowsPerPage?: number;
    
    /** Whether to enable column resizing */
    resizableColumns?: boolean;
    
    /** Whether to enable column reordering */
    reorderableColumns?: boolean;
    
    /** Whether to enable row expansion */
    expandableRows?: boolean;
    
    /** Whether to highlight rows on hover */
    highlightOnHover?: boolean;
    
    /** Whether to add zebra striping (alternating row colors) */
    striped?: boolean;
    
    /** Whether to add borders between cells */
    bordered?: boolean;
    
    /** Whether to make the table responsive to container size */
    responsive?: boolean;
    
    /** Whether to enable horizontal scrolling */
    horizontalScroll?: boolean;
    
    /** How to handle text overflow in cells */
    textOverflow?: 'wrap' | 'ellipsis' | 'clip';
    
    /** Whether to show line numbers */
    showRowNumbers?: boolean;
    
    /** Maximum height of the table (as CSS value) */
    maxHeight?: string;
    
    /** Density of the table layout */
    density?: 'compact' | 'standard' | 'comfortable';
    
    /** Table header configuration */
    header?: {
      /** Whether the header is sticky when scrolling */
      sticky?: boolean;
      
      /** Background color for the header */
      backgroundColor?: string;
      
      /** Text color for the header */
      textColor?: string;
      
      /** Font weight for header text */
      fontWeight?: string;
    };
    
    /** Cell highlighting configuration */
    highlighting?: {
      /** Cells to highlight */
      cells?: Array<{
        /** Row identifier */
        rowId: string;
        
        /** Column identifier */
        columnId: string;
        
        /** Highlight color */
        color?: string;
      }>;
      
      /** Function to determine cell highlighting dynamically */
      highlightFunction?: (value: any, rowId: string, columnId: string) => boolean | string;
    };
    
    /** Callback functions for table events */
    callbacks?: {
      /** Called when a row is selected */
      onRowSelect?: (row: TableRow) => void;
      
      /** Called when a row is expanded */
      onRowExpand?: (row: TableRow) => void;
      
      /** Called when a cell is clicked */
      onCellClick?: (value: any, rowId: string, columnId: string) => void;
      
      /** Called when sorting changes */
      onSortChange?: (columnId: string, direction: 'asc' | 'desc') => void;
      
      /** Called when filtering changes */
      onFilterChange?: (filters: Record<string, any>) => void;
      
      /** Called when pagination changes */
      onPageChange?: (page: number) => void;
    };
  }