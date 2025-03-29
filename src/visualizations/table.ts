/**
 * Table Visualization Component
 * Creates interactive data comparison tables with sorting, filtering, and highlighting
 */
import { TableVisualizationOptions } from '../types/chart-config';

/**
 * Core visualization class for rendering comparison tables
 */
export class TableVisualization {
  private container: HTMLElement;
  private options: TableVisualizationOptions;
  private tableElement: HTMLTableElement | null = null;
  private sortState: { column: string; direction: 'asc' | 'desc' } | null = null;
  private filterValues: Record<string, string> = {};
  private currentPage: number = 0;

  /**
   * Creates a new table visualization instance
   * @param options Configuration options for the table visualization
   */
  constructor(options: TableVisualizationOptions) {
    this.container = options.container;
    this.options = this.applyDefaultOptions(options);
  }

  /**
   * Applies default options to user-provided options
   * @param options User options
   * @returns Merged options with defaults applied
   */
  private applyDefaultOptions(options: TableVisualizationOptions): TableVisualizationOptions {
    const defaults: Partial<TableVisualizationOptions> = {
      responsive: true,
      sortable: true,
      filterable: false,
      paginate: false,
      rowsPerPage: 10,
      showRowNumbers: false,
      editable: false,
      resizableColumns: false,
      selectable: false,
    };

    return { ...defaults, ...options };
  }

  /**
   * Creates the table structure
   * @returns HTMLTableElement for the comparison table
   */
  private createTable(): HTMLTableElement {
    const { headers, rows, caption } = this.options;
    
    // Create table element
    const table = document.createElement('table');
    table.className = 'comparison-table';
    
    // Add responsive wrapper if needed
    if (this.options.responsive) {
      table.classList.add('responsive');
    }
    
    // Add caption if provided
    if (caption) {
      const captionElement = document.createElement('caption');
      captionElement.textContent = caption;
      table.appendChild(captionElement);
    }
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add row number header if enabled
    if (this.options.showRowNumbers) {
      const rowNumberHeader = document.createElement('th');
      rowNumberHeader.className = 'row-number-header';
      rowNumberHeader.textContent = '#';
      headerRow.appendChild(rowNumberHeader);
    }
    
    // Add column headers
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.dataset.column = header;
      
      // Add sorting functionality if enabled
      if (this.options.sortable) {
        th.classList.add('sortable');
        th.addEventListener('click', () => this.sortTable(header));
      }
      
      // Set width if specified
      if (this.options.columnWidths && this.options.columnWidths[header]) {
        th.style.width = this.options.columnWidths[header];
      }
      
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Add filter row if filtering is enabled
    if (this.options.filterable) {
      const filterRow = document.createElement('tr');
      filterRow.className = 'filter-row';
      
      // Add empty cell for row number column if enabled
      if (this.options.showRowNumbers) {
        const emptyCell = document.createElement('th');
        filterRow.appendChild(emptyCell);
      }
      
      // Add filter inputs for each column
      headers.forEach(header => {
        const filterCell = document.createElement('th');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Filter ${header}...`;
        input.dataset.column = header;
        input.addEventListener('input', (e) => {
          this.filterValues[header] = (e.target as HTMLInputElement).value;
          this.applyFilters();
        });
        
        filterCell.appendChild(input);
        filterRow.appendChild(filterCell);
      });
      
      thead.appendChild(filterRow);
    }
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add rows with pagination if enabled
    const displayedRows = this.options.paginate 
      ? rows.slice(this.currentPage * (this.options.rowsPerPage || 10), (this.currentPage + 1) * (this.options.rowsPerPage || 10))
      : rows;
    
    displayedRows.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      tr.dataset.rowIndex = String(rowIndex);
      
      // Add row number if enabled
      if (this.options.showRowNumbers) {
        const rowNumberCell = document.createElement('td');
        rowNumberCell.className = 'row-number';
        rowNumberCell.textContent = String(this.currentPage * (this.options.rowsPerPage || 10) + rowIndex + 1);
        tr.appendChild(rowNumberCell);
      }
      
      // Add cells for each column
      headers.forEach(header => {
        const td = document.createElement('td');
        const value = row[header];
        
        // Format cell value if formatter is provided
        if (this.options.formatCell) {
          td.innerHTML = this.options.formatCell(value, header, row);
        } else {
          td.textContent = value !== undefined && value !== null ? String(value) : '';
        }
        
        // Add custom styling if style function is provided
        if (this.options.cellStyleFunction) {
          const styles = this.options.cellStyleFunction(value, header, row);
          Object.entries(styles).forEach(([prop, val]) => {
            td.style[prop as any] = val as string;
          });
        }
        
        // Make cell editable if enabled
        if (this.options.editable) {
          td.contentEditable = 'true';
          td.addEventListener('blur', (e) => {
            const newValue = (e.target as HTMLTableCellElement).textContent || '';
            // Update the data
            // Implementation would depend on how you want to handle data updates
          });
        }
        
        // Highlight cell if it's in the highlighted cells list
        if (this.options.highlightCells) {
          const isHighlighted = this.options.highlightCells.some(cell => 
            cell.rowIndex === rowIndex && cell.columnName === header
          );
          
          if (isHighlighted) {
            td.classList.add('highlighted');
          }
        }
        
        tr.appendChild(td);
      });
      
      // Add row selection handling if enabled
      if (this.options.selectable) {
        tr.classList.add('selectable');
        tr.addEventListener('click', () => {
          const allRows = tbody.querySelectorAll('tr');
          allRows.forEach(row => row.classList.remove('selected'));
          tr.classList.add('selected');
          
          if (this.options.onRowSelect) {
            this.options.onRowSelect(row, rowIndex);
          }
        });
      }
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Add pagination controls if enabled
    if (this.options.paginate) {
      const footer = document.createElement('tfoot');
      const paginationRow = document.createElement('tr');
      const paginationCell = document.createElement('td');
      paginationCell.colSpan = headers.length + (this.options.showRowNumbers ? 1 : 0);
      
      const totalPages = Math.ceil(rows.length / (this.options.rowsPerPage || 10));
      
      // Create pagination controls
      const paginationControls = document.createElement('div');
      paginationControls.className = 'pagination-controls';
      
      // Previous button
      const prevButton = document.createElement('button');
      prevButton.textContent = '← Previous';
      prevButton.disabled = this.currentPage === 0;
      prevButton.addEventListener('click', () => {
        if (this.currentPage > 0) {
          this.currentPage--;
          this.render();
        }
      });
      
      // Next button
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Next →';
      nextButton.disabled = this.currentPage >= totalPages - 1;
      nextButton.addEventListener('click', () => {
        if (this.currentPage < totalPages - 1) {
          this.currentPage++;
          this.render();
        }
      });
      
      // Page indicator
      const pageIndicator = document.createElement('span');
      pageIndicator.textContent = `Page ${this.currentPage + 1} of ${totalPages}`;
      
      paginationControls.appendChild(prevButton);
      paginationControls.appendChild(pageIndicator);
      paginationControls.appendChild(nextButton);
      
      paginationCell.appendChild(paginationControls);
      paginationRow.appendChild(paginationCell);
      footer.appendChild(paginationRow);
      table.appendChild(footer);
    }
    
    return table;
  }

  /**
   * Sorts the table by a specific column
   * @param columnName The column header to sort by
   */
  private sortTable(columnName: string): void {
    // Toggle sort direction
    if (this.sortState && this.sortState.column === columnName) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState = { column: columnName, direction: 'asc' };
    }
    
    // Apply sorting
    this.options.rows.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];
      
      // Compare based on data type
      let comparison = 0;
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime();
      } else {
        const stringA = String(valueA || '').toLowerCase();
        const stringB = String(valueB || '').toLowerCase();
        comparison = stringA.localeCompare(stringB);
      }
      
      // Apply sort direction
      return this.sortState!.direction === 'asc' ? comparison : -comparison;
    });
    
    // Update UI
    this.render();
    
    // Update sort indicators in the UI
    if (this.tableElement) {
      const headers = this.tableElement.querySelectorAll('th.sortable');
      headers.forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
        
        if (header.getAttribute('data-column') === columnName) {
          header.classList.add(this.sortState!.direction === 'asc' ? 'sort-asc' : 'sort-desc');
        }
      });
    }
  }

  /**
   * Applies filters to the table data
   */
  private applyFilters(): void {
    // If no filters are active, no need to filter
    const hasActiveFilters = Object.values(this.filterValues).some(value => value.length > 0);
    if (!hasActiveFilters) {
      // Reset to original data
      this.render();
      return;
    }
    
    // Clone the original rows
    const filteredRows = [...this.options.rows].filter(row => {
      // Check each active filter
      return Object.entries(this.filterValues).every(([column, filterValue]) => {
        if (!filterValue) return true; // Skip inactive filters
        
        const cellValue = String(row[column] || '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
    
    // Update the table with filtered data
    // In a real implementation, we might want to update the data in place
    // instead of re-rendering the entire table
    this.currentPage = 0; // Reset to first page when filtering
    this.render(filteredRows);
  }

  /**
   * Applies highlighting to specific cells
   * @param highlightCells Array of cell coordinates to highlight
   */
  public highlightCells(highlightCells: Array<{ rowIndex: number; columnName: string }>): void {
    this.options.highlightCells = highlightCells;
    
    // Update highlighting in the existing table if available
    if (this.tableElement) {
      // Remove existing highlights
      const allCells = this.tableElement.querySelectorAll('tbody td');
      allCells.forEach(cell => cell.classList.remove('highlighted'));
      
      // Apply new highlights
      highlightCells.forEach(({ rowIndex, columnName }) => {
        const colIndex = this.options.headers.findIndex(h => h === columnName);
        
        if (colIndex !== -1) {
          const row = this.tableElement!.querySelector(`tbody tr[data-row-index="${rowIndex}"]`);
          if (row) {
            const offset = this.options.showRowNumbers ? 1 : 0;
            const cell = row.children[colIndex + offset] as HTMLElement;
            if (cell) {
              cell.classList.add('highlighted');
            }
          }
        }
      });
    } else {
      // If table doesn't exist yet, it will be rendered with highlights on next render
      this.render();
    }
  }

  /**
   * Renders the table visualization with optional custom data
   * @param customRows Optional custom rows to display instead of the configured rows
   */
  public render(customRows?: Array<Record<string, any>>): void {
    // Clear previous content
    this.container.innerHTML = '';
    
    // Use custom rows if provided, otherwise use the configured rows
    const rowsToRender = customRows || this.options.rows;
    
    // Create a new table with the current options
    const currentOptions = { ...this.options, rows: rowsToRender };
    this.tableElement = this.createTable();
    
    // Append the table to the container
    this.container.appendChild(this.tableElement);
    
    // Add general styles if not already added
    this.addStyles();
  }

  /**
   * Adds CSS styles for the table visualization
   */
  private addStyles(): void {
    // Check if styles are already added
    if (document.getElementById('table-visualization-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'table-visualization-styles';
    
    // Define CSS rules
    style.textContent = `
      .comparison-table {
        border-collapse: collapse;
        width: 100%;
        border: 1px solid #ddd;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
      }
      
      .comparison-table.responsive {
        overflow-x: auto;
        display: block;
      }
      
      .comparison-table caption {
        font-weight: bold;
        font-size: 1.1em;
        margin-bottom: 8px;
        text-align: left;
      }
      
      .comparison-table th {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      
      .comparison-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      
      .comparison-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      
      .comparison-table tr:hover {
        background-color: #f1f1f1;
      }
      
      .comparison-table th.sortable {
        cursor: pointer;
        position: relative;
        padding-right: 18px;
      }
      
      .comparison-table th.sortable:after {
        content: "↕";
        position: absolute;
        right: 5px;
        color: #999;
      }
      
      .comparison-table th.sort-asc:after {
        content: "↑";
        color: #333;
      }
      
      .comparison-table th.sort-desc:after {
        content: "↓";
        color: #333;
      }
      
      .comparison-table td.highlighted,
      .comparison-table th.highlighted {
        background-color: #fffde7;
        font-weight: bold;
      }
      
      .comparison-table .filter-row input {
        width: calc(100% - 16px);
        padding: 5px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .comparison-table .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 10px;
      }
      
      .comparison-table .pagination-controls button {
        padding: 5px 10px;
        border: 1px solid #ddd;
        background: #f5f5f5;
        cursor: pointer;
        border-radius: 4px;
      }
      
      .comparison-table .pagination-controls button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      
      .comparison-table tr.selectable {
        cursor: pointer;
      }
      
      .comparison-table tr.selected {
        background-color: #e3f2fd;
      }
      
      .comparison-table .row-number {
        background-color: #f5f5f5;
        font-weight: bold;
        text-align: center;
        width: 40px;
      }
      
      .comparison-table .row-number-header {
        text-align: center;
        width: 40px;
      }
    `;
    
    // Add style to document
    document.head.appendChild(style);
  }

  /**
   * Updates the table data and rerenders
   * @param data New row data
   */
  public updateData(rows: Array<Record<string, any>>): void {
    this.options.rows = rows;
    this.currentPage = 0; // Reset to first page
    this.filterValues = {}; // Clear filters
    this.sortState = null; // Clear sorting
    this.render();
  }

  /**
   * Updates column headers and rerenders
   * @param headers New column headers
   */
  public updateHeaders(headers: string[]): void {
    this.options.headers = headers;
    this.currentPage = 0;
    this.filterValues = {};
    this.sortState = null;
    this.render();
  }

  /**
   * Updates visualization options and reapplies them
   * @param options New visualization options
   */
  public updateOptions(options: Partial<TableVisualizationOptions>): void {
    this.options = { ...this.options, ...options };
    this.render();
  }

  /**
   * Gets the currently displayed data
   * @returns The current table data
   */
  public getData(): Array<Record<string, any>> {
    return [...this.options.rows];
  }

  /**
   * Exports the table data as CSV
   * @returns CSV string of the table data
   */
  public exportCSV(): string {
    const { headers, rows } = this.options;
    
    // Create header row
    const csvContent = [
      // Add headers
      headers.join(','),
      
      // Add data rows
      ...rows.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas, quotes, and wrap in quotes if needed
          if (value === null || value === undefined) return '';
          
          const stringVal = String(value);
          return stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')
            ? `"${stringVal.replace(/"/g, '""')}"`
            : stringVal;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }

  /**
   * Exports the table as HTML
   * @returns HTML string of the table
   */
  public exportHTML(): string {
    if (!this.tableElement) return '';
    
    // Clone the table to avoid modifying the displayed one
    const clone = this.tableElement.cloneNode(true) as HTMLTableElement;
    
    // Remove filter inputs and pagination controls if present
    const filterRow = clone.querySelector('.filter-row');
    if (filterRow) filterRow.remove();
    
    const paginationControls = clone.querySelector('.pagination-controls');
    if (paginationControls) {
      const parentRow = paginationControls.closest('tr');
      if (parentRow) parentRow.remove();
    }
    
    return clone.outerHTML;
  }

  /**
   * Destroys the visualization and cleans up resources
   */
  public destroy(): void {
    this.container.innerHTML = '';
    this.tableElement = null;
  }
}