/**
 * Table Visualization Component
 * Renders interactive data tables for comparative knowledge graph analysis
 */
import { TableVisualizationOptions } from '../types/chart-config';

export class TableVisualization {
  private container: HTMLElement;
  private table: HTMLTableElement | null = null;
  private headers: string[];
  private rows: Record<string, any>[];
  private options: TableVisualizationOptions;
  private sortColumn: string | null = null;
  private sortDirection: 'ascending' | 'descending' = 'ascending';
  private searchTerm: string = '';
  private tableContainer: HTMLDivElement | null = null;
  private paginationContainer: HTMLDivElement | null = null;
  private currentPage: number = 1;
  private highlightedCells: Array<{ rowIndex: number, columnName: string }> = [];
  
  /**
   * Creates a new table visualization
   * @param options Visualization options
   */
  constructor(options: TableVisualizationOptions) {
    this.container = options.container;
    this.headers = options.headers;
    this.rows = options.rows;
    this.options = this.initializeOptions(options);
    this.highlightedCells = options.highlightCells || [];
    
    // Initialize the visualization
    this.initializeVisualization();
  }
  
  /**
   * Initialize visualization options with defaults
   * @param options User-provided options
   */
  private initializeOptions(options: TableVisualizationOptions): TableVisualizationOptions {
    // Define default options
    return {
      ...options,
      sortable: options.sortable !== false,
      filterable: options.filterable || false,
      paginate: options.paginate || false,
      rowsPerPage: options.rowsPerPage || 10,
      showRowNumbers: options.showRowNumbers || false,
      theme: options.theme || 'light',
      resizableColumns: options.resizableColumns || false,
      selectable: options.selectable || false
    };
  }
  
  /**
   * Initialize the visualization container and elements
   */
  private initializeVisualization(): void {
    // Clear any existing content
    this.container.innerHTML = '';
    
    // Create table wrapper with appropriate styling
    this.container.classList.add('table-visualization-container');
    
    // Add filter controls if enabled
    if (this.options.filterable) {
      this.createFilterControls();
    }
    
    // Create table container for scrolling
    this.tableContainer = document.createElement('div');
    this.tableContainer.className = 'table-container';
    this.tableContainer.style.width = '100%';
    this.tableContainer.style.overflowX = 'auto';
    this.container.appendChild(this.tableContainer);
    
    // Create the table
    this.createTable();
    
    // Add caption if provided
    if (this.options.caption) {
      const caption = document.createElement('caption');
      caption.textContent = this.options.caption;
      this.table!.appendChild(caption);
    }
    
    // Add pagination if enabled
    if (this.options.paginate) {
      this.createPagination();
    }
    
    // Apply theme
    this.applyTheme();
  }
  
  /**
   * Apply theme to the table
   */
  private applyTheme(): void {
    if (!this.table) return;
    
    const theme = this.options.theme;
    
    if (theme === 'dark') {
      this.table.classList.add('dark-theme');
      
      // Apply dark theme styles
      this.applyStyleToTable({
        color: '#e0e0e0',
        backgroundColor: '#333333',
        borderColor: '#555555',
        headerBackgroundColor: '#444444',
        headerColor: '#ffffff',
        alternateRowColor: '#3a3a3a',
        hoverColor: '#505050'
      });
    } else {
      this.table.classList.add('light-theme');
      
      // Apply light theme styles
      this.applyStyleToTable({
        color: '#333333',
        backgroundColor: '#ffffff',
        borderColor: '#e0e0e0',
        headerBackgroundColor: '#f5f5f5',
        headerColor: '#333333',
        alternateRowColor: '#f9f9f9',
        hoverColor: '#e9e9e9'
      });
    }
  }
  
  /**
   * Apply styles to the table
   * @param styles Object containing style properties
   */
  private applyStyleToTable(styles: {
    color: string;
    backgroundColor: string;
    borderColor: string;
    headerBackgroundColor: string;
    headerColor: string;
    alternateRowColor: string;
    hoverColor: string;
  }): void {
    if (!this.table) return;
    
    // Apply container styles
    this.tableContainer!.style.color = styles.color;
    this.tableContainer!.style.backgroundColor = styles.backgroundColor;
    
    // Apply table styles
    this.table.style.width = '100%';
    this.table.style.borderCollapse = 'collapse';
    this.table.style.border = `1px solid ${styles.borderColor}`;
    
    // Apply styles to header cells
    const headerCells = this.table.querySelectorAll('th');
    headerCells.forEach(cell => {
      cell.style.backgroundColor = styles.headerBackgroundColor;
      cell.style.color = styles.headerColor;
      cell.style.padding = '12px';
      cell.style.textAlign = 'left';
      cell.style.borderBottom = `2px solid ${styles.borderColor}`;
      cell.style.position = 'sticky';
      cell.style.top = '0';
    });
    
    // Apply styles to data cells
    const rows = this.table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
      // Apply alternating row styles
      if (index % 2 === 1) {
        (row as HTMLElement).style.backgroundColor = styles.alternateRowColor;
      }
      
      // Apply hover effect
      row.addEventListener('mouseenter', () => {
        (row as HTMLElement).style.backgroundColor = styles.hoverColor;
      });
      
      row.addEventListener('mouseleave', () => {
        if (index % 2 === 1) {
          (row as HTMLElement).style.backgroundColor = styles.alternateRowColor;
        } else {
          (row as HTMLElement).style.backgroundColor = styles.backgroundColor;
        }
      });
      
      // Style cells
      const cells = row.querySelectorAll('td');
      cells.forEach(cell => {
        cell.style.padding = '8px 12px';
        cell.style.borderBottom = `1px solid ${styles.borderColor}`;
      });
    });
  }
  
  /**
   * Create filter controls for the table
   */
  private createFilterControls(): void {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.marginBottom = '15px';
    filterContainer.style.display = 'flex';
    filterContainer.style.alignItems = 'center';
    
    // Create search label
    const searchLabel = document.createElement('label');
    searchLabel.textContent = 'Search: ';
    searchLabel.style.marginRight = '8px';
    filterContainer.appendChild(searchLabel);
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Filter table...';
    searchInput.style.padding = '6px 10px';
    searchInput.style.border = '1px solid #ddd';
    searchInput.style.borderRadius = '4px';
    searchInput.style.flexGrow = '1';
    
    // Add event listener for filtering
    searchInput.addEventListener('input', (event) => {
      this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
      this.currentPage = 1; // Reset to first page when filtering
      this.renderTableBody();
      
      // Update pagination if enabled
      if (this.options.paginate) {
        this.updatePagination();
      }
    });
    
    filterContainer.appendChild(searchInput);
    this.container.appendChild(filterContainer);
  }
  
  /**
   * Create the main table element
   */
  private createTable(): void {
    // Create table element
    this.table = document.createElement('table');
    this.table.className = 'table-visualization';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add row number header if enabled
    if (this.options.showRowNumbers) {
      const rowNumberHeader = document.createElement('th');
      rowNumberHeader.textContent = '#';
      rowNumberHeader.style.width = '50px';
      headerRow.appendChild(rowNumberHeader);
    }
    
    // Add column headers
    this.headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      
      // Add sort functionality if enabled
      if (this.options.sortable) {
        th.style.cursor = 'pointer';
        
        // Add sort indicator
        const sortIndicator = document.createElement('span');
        sortIndicator.className = 'sort-indicator';
        sortIndicator.style.marginLeft = '5px';
        sortIndicator.textContent = '';
        th.appendChild(sortIndicator);
        
        // Update sort indicator if this is the sort column
        if (header === this.sortColumn) {
          sortIndicator.textContent = this.sortDirection === 'ascending' ? '↑' : '↓';
        }
        
        // Add click event for sorting
        th.addEventListener('click', () => this.sortTable(header));
      }
      
      // Add resize functionality if enabled
      if (this.options.resizableColumns) {
        th.style.position = 'relative';
        
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '0';
        resizeHandle.style.top = '0';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.width = '5px';
        resizeHandle.style.cursor = 'col-resize';
        
        // Add resize functionality
        this.addResizeHandlers(resizeHandle, th);
        
        th.appendChild(resizeHandle);
      }
      
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    this.table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    this.table.appendChild(tbody);
    
    // Render table body content
    this.renderTableBody();
    
    // Add table to container
    this.tableContainer!.appendChild(this.table);
  }
  
  /**
   * Render the table body content
   */
  private renderTableBody(): void {
    if (!this.table) return;
    
    const tbody = this.table.querySelector('tbody');
    if (!tbody) return;
    
    // Clear existing content
    tbody.innerHTML = '';
    
    // Filter rows if search term is present
    let filteredRows = this.rows;
    if (this.searchTerm) {
      filteredRows = this.rows.filter(row => {
        return Object.values(row).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(this.searchTerm);
        });
      });
    }
    
    // Sort rows if sort column is set
    if (this.sortColumn) {
      filteredRows = [...filteredRows].sort((a, b) => {
        const valueA = a[this.sortColumn!] || '';
        const valueB = b[this.sortColumn!] || '';
        
        // Determine sort order based on data type
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortDirection === 'ascending' 
            ? valueA - valueB 
            : valueB - valueA;
        } else {
          const strA = String(valueA).toLowerCase();
          const strB = String(valueB).toLowerCase();
          
          return this.sortDirection === 'ascending' 
            ? strA.localeCompare(strB) 
            : strB.localeCompare(strA);
        }
      });
    }
    
    // Apply pagination if enabled
    let displayedRows = filteredRows;
    if (this.options.paginate) {
      const startIndex = (this.currentPage - 1) * this.options.rowsPerPage!;
      displayedRows = filteredRows.slice(
        startIndex,
        startIndex + this.options.rowsPerPage!
      );
    }
    
    // Create rows
    displayedRows.forEach((rowData, displayIndex) => {
      const rowIndex = this.rows.indexOf(rowData); // Original index for highlighting
      const tr = document.createElement('tr');
      
      // Make row selectable if enabled
      if (this.options.selectable) {
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => {
          if (this.options.onRowSelect) {
            this.options.onRowSelect(rowData, rowIndex);
          }
          
          // Toggle selected class
          const selectedRows = tbody.querySelectorAll('tr.selected');
          selectedRows.forEach(row => row.classList.remove('selected'));
          tr.classList.add('selected');
        });
      }
      
      // Add row number if enabled
      if (this.options.showRowNumbers) {
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = (this.options.paginate 
          ? (this.currentPage - 1) * this.options.rowsPerPage! + displayIndex + 1 
          : displayIndex + 1).toString();
        rowNumberCell.style.textAlign = 'center';
        tr.appendChild(rowNumberCell);
      }
      
      // Add data cells
      this.headers.forEach(header => {
        const td = document.createElement('td');
        
        // Format cell content if formatter is provided
        if (this.options.formatCell) {
          td.innerHTML = this.options.formatCell(rowData[header], header, rowData);
        } else {
          // Handle null or undefined values
          const value = rowData[header];
          td.textContent = value !== null && value !== undefined ? String(value) : '';
        }
        
        // Apply cell styling if provided
        if (this.options.cellStyleFunction) {
          const style = this.options.cellStyleFunction(rowData[header], header, rowData);
          Object.assign(td.style, style);
        }
        
        // Check if cell should be highlighted
        const isHighlighted = this.highlightedCells.some(cell => 
          cell.rowIndex === rowIndex && cell.columnName === header
        );
        
        if (isHighlighted) {
          td.style.backgroundColor = this.options.theme === 'dark' ? '#4b513d' : '#fffacd';
          td.style.fontWeight = 'bold';
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    
    // Display message if no rows match filter
    if (displayedRows.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = this.options.showRowNumbers ? this.headers.length + 1 : this.headers.length;
      emptyCell.textContent = 'No matching records found';
      emptyCell.style.textAlign = 'center';
      emptyCell.style.padding = '20px';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    }
  }
  
  /**
   * Sort the table by a column
   * @param columnName Column to sort by
   */
  private sortTable(columnName: string): void {
    // Toggle sort direction if already sorted by this column
    if (this.sortColumn === columnName) {
      this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    } else {
      this.sortColumn = columnName;
      this.sortDirection = 'ascending';
    }
    
    // Update sort indicators
    if (this.table) {
      const headerCells = this.table.querySelectorAll('th');
      headerCells.forEach(cell => {
        const sortIndicator = cell.querySelector('.sort-indicator');
        if (sortIndicator) {
          if (cell.textContent!.startsWith(columnName)) {
            sortIndicator.textContent = this.sortDirection === 'ascending' ? '↑' : '↓';
          } else {
            sortIndicator.textContent = '';
          }
        }
      });
    }
    
    // Re-render table body with sorted data
    this.renderTableBody();
  }
  
  /**
   * Create pagination controls
   */
  private createPagination(): void {
    this.paginationContainer = document.createElement('div');
    this.paginationContainer.className = 'pagination-container';
    this.paginationContainer.style.marginTop = '15px';
    this.paginationContainer.style.display = 'flex';
    this.paginationContainer.style.justifyContent = 'center';
    this.paginationContainer.style.alignItems = 'center';
    
    this.updatePagination();
    this.container.appendChild(this.paginationContainer);
  }
  
  /**
   * Update pagination controls based on current data
   */
  private updatePagination(): void {
    if (!this.paginationContainer) return;
    
    // Clear existing pagination
    this.paginationContainer.innerHTML = '';
    
    // Filter rows based on search term
    let filteredRows = this.rows;
    if (this.searchTerm) {
      filteredRows = this.rows.filter(row => {
        return Object.values(row).some(value => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(this.searchTerm);
        });
      });
    }
    
    // Calculate total pages
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / this.options.rowsPerPage!));
    
    // Ensure current page is valid
    this.currentPage = Math.min(Math.max(1, this.currentPage), totalPages);
    
    // Create pagination controls
    
    // First page button
    const firstButton = document.createElement('button');
    firstButton.innerHTML = '&laquo;';
    firstButton.title = 'First page';
    firstButton.disabled = this.currentPage === 1;
    firstButton.addEventListener('click', () => {
      this.currentPage = 1;
      this.renderTableBody();
      this.updatePagination();
    });
    
    // Previous page button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&lsaquo;';
    prevButton.title = 'Previous page';
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () => {
      this.currentPage--;
      this.renderTableBody();
      this.updatePagination();
    });
    
    // Add buttons to container
    this.paginationContainer.appendChild(firstButton);
    this.paginationContainer.appendChild(prevButton);
    
    // Page number buttons
    const maxPageButtons = 5; // Maximum number of page buttons to show
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    // Adjust start page if we can't show enough pages
    startPage = Math.max(1, endPage - maxPageButtons + 1);
    
    // Create page buttons
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i.toString();
      pageButton.title = `Page ${i}`;
      
      if (i === this.currentPage) {
        pageButton.disabled = true;
        pageButton.style.fontWeight = 'bold';
        pageButton.style.backgroundColor = this.options.theme === 'dark' ? '#666' : '#ddd';
      }
      
      pageButton.addEventListener('click', () => {
        this.currentPage = i;
        this.renderTableBody();
        this.updatePagination();
      });
      
      this.paginationContainer.appendChild(pageButton);
    }
    
    // Next page button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&rsaquo;';
    nextButton.title = 'Next page';
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      this.currentPage++;
      this.renderTableBody();
      this.updatePagination();
    });
    
    // Last page button
    const lastButton = document.createElement('button');
    lastButton.innerHTML = '&raquo;';
    lastButton.title = 'Last page';
    lastButton.disabled = this.currentPage === totalPages;
    lastButton.addEventListener('click', () => {
      this.currentPage = totalPages;
      this.renderTableBody();
      this.updatePagination();
    });
    
    // Add buttons to container
    this.paginationContainer.appendChild(nextButton);
    this.paginationContainer.appendChild(lastButton);
    
    // Style pagination buttons
    const buttons = this.paginationContainer.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.margin = '0 4px';
      button.style.padding = '6px 12px';
      button.style.border = '1px solid #ddd';
      button.style.borderRadius = '3px';
      button.style.backgroundColor = this.options.theme === 'dark' ? '#444' : '#f5f5f5';
      button.style.color = this.options.theme === 'dark' ? '#e0e0e0' : '#333';
      button.style.cursor = button.disabled ? 'default' : 'pointer';
      
      if (!button.disabled) {
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = this.options.theme === 'dark' ? '#555' : '#e0e0e0';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = this.options.theme === 'dark' ? '#444' : '#f5f5f5';
        });
      }
    });
    
    // Add page info
    const pageInfo = document.createElement('span');
    pageInfo.style.marginLeft = '10px';
    pageInfo.textContent = `Page ${this.currentPage} of ${totalPages} (${filteredRows.length} records)`;
    this.paginationContainer.appendChild(pageInfo);
  }
  
  /**
   * Add resize handlers to a column header
   * @param handle Resize handle element
   * @param th Header cell element
   */
  private addResizeHandlers(handle: HTMLDivElement, th: HTMLTableCellElement): void {
    let startX: number;
    let startWidth: number;
    
    const startResize = (e: MouseEvent) => {
      startX = e.pageX;
      startWidth = th.offsetWidth;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      
      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
    };
    
    const resize = (e: MouseEvent) => {
      const width = startWidth + (e.pageX - startX);
      th.style.width = `${Math.max(50, width)}px`; // Enforce minimum width
    };
    
    const stopResize = () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.userSelect = '';
    };
    
    handle.addEventListener('mousedown', startResize);
  }
  
  /**
   * Update the table with new data
   * @param rows New row data
   */
  public updateData(rows: Record<string, any>[]): void {
    this.rows = rows;
    this.currentPage = 1; // Reset to first page
    this.renderTableBody();
    
    // Update pagination if enabled
    if (this.options.paginate && this.paginationContainer) {
      this.updatePagination();
    }
  }
  
  /**
   * Highlight specific cells in the table
   * @param cells Array of cells to highlight
   */
  public highlightCells(cells: Array<{ rowIndex: number, columnName: string }>): void {
    this.highlightedCells = cells;
    this.renderTableBody();
  }
  
  /**
   * Update visualization options
   * @param options New options
   */
  public updateOptions(options: Partial<TableVisualizationOptions>): void {
    this.options = { ...this.options, ...options };
    
    // Re-initialize visualization with new options
    this.initializeVisualization();
  }
  
  /**
   * Clean up resources when the visualization is no longer needed
   */
  public destroy(): void {
    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}