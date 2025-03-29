/**
 * ASCII to SVG Converter
 * Transforms ASCII diagrams into SVG visualizations
 */

/**
 * Configuration options for the ASCII to SVG conversion
 */
export interface AsciiToSvgOptions {
    /** ASCII text to convert */
    text: string;
    
    /** Width of each character cell in pixels */
    boxWidth?: number;
    
    /** Height of each character cell in pixels */
    boxHeight?: number;
    
    /** Color for lines */
    lineColor?: string;
    
    /** Color for text */
    textColor?: string;
    
    /** Color for box backgrounds */
    boxColor?: string;
    
    /** Font family for text */
    fontFamily?: string;
    
    /** Font size for text */
    fontSize?: number;
    
    /** Whether to add padding around the diagram */
    padding?: number;
    
    /** Debug mode to show grid */
    debug?: boolean;
  }
  
  /**
   * Types of nodes in the ASCII grid
   */
  enum NodeType {
    Empty = 'empty',
    Text = 'text',
    Line = 'line',
    Junction = 'junction',
    Box = 'box',
    Arrow = 'arrow'
  }
  
  /**
   * Character mappings for special ASCII characters
   */
  const CHARACTER_MAP: Record<string, { type: NodeType, data?: any }> = {
    // Line characters
    '-': { type: NodeType.Line, data: { horizontal: true } },
    '|': { type: NodeType.Line, data: { vertical: true } },
    
    // Junction characters
    '+': { type: NodeType.Junction, data: { top: true, right: true, bottom: true, left: true } },
    '┌': { type: NodeType.Junction, data: { right: true, bottom: true } },
    '┐': { type: NodeType.Junction, data: { bottom: true, left: true } },
    '└': { type: NodeType.Junction, data: { top: true, right: true } },
    '┘': { type: NodeType.Junction, data: { top: true, left: true } },
    '├': { type: NodeType.Junction, data: { top: true, right: true, bottom: true } },
    '┤': { type: NodeType.Junction, data: { top: true, bottom: true, left: true } },
    '┬': { type: NodeType.Junction, data: { right: true, bottom: true, left: true } },
    '┴': { type: NodeType.Junction, data: { top: true, right: true, left: true } },
    '┼': { type: NodeType.Junction, data: { top: true, right: true, bottom: true, left: true } },
    
    // Arrow characters
    '>': { type: NodeType.Arrow, data: { direction: 'right' } },
    '<': { type: NodeType.Arrow, data: { direction: 'left' } },
    '^': { type: NodeType.Arrow, data: { direction: 'up' } },
    'v': { type: NodeType.Arrow, data: { direction: 'down' } },
    'V': { type: NodeType.Arrow, data: { direction: 'down' } },
    
    // Box characters
    '[': { type: NodeType.Box, data: { side: 'left' } },
    ']': { type: NodeType.Box, data: { side: 'right' } },
    
    // Special box corners for clearly marked boxes
    '/': { type: NodeType.Junction, data: { specialCorner: 'topLeft' } },
    '\\': { type: NodeType.Junction, data: { specialCorner: 'topRight' } }
  };
  
  /**
   * Represents a node in the ASCII grid
   */
  interface GridNode {
    /** Type of node */
    type: NodeType;
    
    /** Character at this position */
    char: string;
    
    /** Row index */
    row: number;
    
    /** Column index */
    col: number;
    
    /** Additional data for the node */
    data?: any;
  }
  
  /**
   * Represents a special construct in the diagram
   * (like a box with text, arrow, etc.)
   */
  interface DiagramShape {
    /** Type of shape */
    type: 'box' | 'arrow' | 'line' | 'text';
    
    /** Coordinates and dimensions */
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    
    /** Text content if applicable */
    text?: string;
    
    /** Connection points */
    connectors?: {
      position: 'top' | 'right' | 'bottom' | 'left';
      x: number;
      y: number;
    }[];
    
    /** Additional shape-specific data */
    data?: any;
  }
  
  /**
   * Main class for converting ASCII diagrams to SVG
   */
  export class AsciiToSvg {
    private options: Required<AsciiToSvgOptions>;
    private grid: GridNode[][] = [];
    private shapes: DiagramShape[] = [];
    private svgWidth: number = 0;
    private svgHeight: number = 0;
    
    /**
     * Creates a new ASCII to SVG converter
     * @param options Configuration options
     */
    constructor(options: AsciiToSvgOptions) {
      // Apply default options
      this.options = {
        text: options.text,
        boxWidth: options.boxWidth || 10,
        boxHeight: options.boxHeight || 20,
        lineColor: options.lineColor || '#333333',
        textColor: options.textColor || '#000000',
        boxColor: options.boxColor || '#f8f9fa',
        fontFamily: options.fontFamily || 'monospace',
        fontSize: options.fontSize || 14,
        padding: options.padding || 10,
        debug: options.debug || false
      };
    }
    
    /**
     * Parses the ASCII grid into a structured representation
     */
    private parseGrid(): void {
      // Split the text into lines
      const lines = this.options.text.split('\n');
      
      // Find the maximum line length
      const maxLineLength = Math.max(...lines.map(line => line.length));
      
      // Initialize grid
      this.grid = [];
      
      // Process each line
      lines.forEach((line, rowIndex) => {
        const row: GridNode[] = [];
        
        // Process each character
        for (let colIndex = 0; colIndex < maxLineLength; colIndex++) {
          const char = colIndex < line.length ? line[colIndex] : ' ';
          
          // Create grid node
          const node: GridNode = {
            type: NodeType.Empty,
            char,
            row: rowIndex,
            col: colIndex
          };
          
          // Check if this is a special character
          if (char !== ' ') {
            const mapping = CHARACTER_MAP[char];
            
            if (mapping) {
              // This is a special character
              node.type = mapping.type;
              node.data = mapping.data;
            } else {
              // This is regular text
              node.type = NodeType.Text;
            }
          }
          
          row.push(node);
        }
        
        this.grid.push(row);
      });
      
      // Calculate SVG dimensions
      this.svgWidth = maxLineLength * this.options.boxWidth + 2 * this.options.padding;
      this.svgHeight = lines.length * this.options.boxHeight + 2 * this.options.padding;
      
      // Identify shapes in the grid
      this.identifyShapes();
    }
    
    /**
     * Identifies shapes, boxes, and connections in the ASCII grid
     */
    private identifyShapes(): void {
      this.shapes = [];
      
      // Process boxes
      this.identifyBoxes();
      
      // Process lines
      this.identifyLines();
      
      // Process text
      this.identifyText();
      
      // Process arrows
      this.identifyArrows();
    }
    
    /**
     * Identifies box shapes in the grid
     */
    private identifyBoxes(): void {
      const rows = this.grid.length;
      const cols = this.grid[0].length;
      
      // Create a temporary grid to track processed cells
      const processed: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));
      
      // Helper function to check if a node is a potential box corner
      const isCorner = (node: GridNode): boolean => {
        return node.type === NodeType.Junction;
      };
      
      // Helper function to check if a node is a box side
      const isBoxSide = (node: GridNode, direction: 'horizontal' | 'vertical'): boolean => {
        if (direction === 'horizontal') {
          return node.type === NodeType.Line && 
                 node.data?.horizontal === true;
        } else {
          return node.type === NodeType.Line && 
                 node.data?.vertical === true;
        }
      };
      
      // Scan for top-left corners of boxes
      for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols - 1; col++) {
          const node = this.grid[row][col];
          
          // Skip if already processed
          if (processed[row][col]) continue;
          
          // Check if this could be the top-left corner of a box
          if (!isCorner(node)) continue;
          
          // Look for a potential box
          let rightCol = -1;
          let bottomRow = -1;
          
          // Find the top-right corner
          for (let c = col + 1; c < cols; c++) {
            if (isCorner(this.grid[row][c])) {
              rightCol = c;
              break;
            }
            // Stop if we find a non-horizontal line
            if (!isBoxSide(this.grid[row][c], 'horizontal')) {
              break;
            }
          }
          
          // If no right edge found, continue
          if (rightCol === -1) continue;
          
          // Find the bottom-left corner
          for (let r = row + 1; r < rows; r++) {
            if (isCorner(this.grid[r][col])) {
              bottomRow = r;
              break;
            }
            // Stop if we find a non-vertical line
            if (!isBoxSide(this.grid[r][col], 'vertical')) {
              break;
            }
          }
          
          // If no bottom edge found, continue
          if (bottomRow === -1) continue;
          
          // Check if we have a bottom-right corner
          if (!isCorner(this.grid[bottomRow][rightCol])) continue;
          
          // Verify all sides are box sides
          let validBox = true;
          
          // Check top edge
          for (let c = col + 1; c < rightCol; c++) {
            if (!isBoxSide(this.grid[row][c], 'horizontal')) {
              validBox = false;
              break;
            }
          }
          
          // Check bottom edge
          if (validBox) {
            for (let c = col + 1; c < rightCol; c++) {
              if (!isBoxSide(this.grid[bottomRow][c], 'horizontal')) {
                validBox = false;
                break;
              }
            }
          }
          
          // Check left edge
          if (validBox) {
            for (let r = row + 1; r < bottomRow; r++) {
              if (!isBoxSide(this.grid[r][col], 'vertical')) {
                validBox = false;
                break;
              }
            }
          }
          
          // Check right edge
          if (validBox) {
            for (let r = row + 1; r < bottomRow; r++) {
              if (!isBoxSide(this.grid[r][rightCol], 'vertical')) {
                validBox = false;
                break;
              }
            }
          }
          
          // If we have a valid box, create a shape
          if (validBox) {
            // Mark all cells in the box as processed
            for (let r = row; r <= bottomRow; r++) {
              for (let c = col; c <= rightCol; c++) {
                processed[r][c] = true;
              }
            }
            
            // Extract text inside the box
            const textLines: string[] = [];
            for (let r = row + 1; r < bottomRow; r++) {
              let line = '';
              for (let c = col + 1; c < rightCol; c++) {
                line += this.grid[r][c].char;
              }
              textLines.push(line.trimRight());
            }
            
            // Create box shape
            const boxShape: DiagramShape = {
              type: 'box',
              bounds: {
                x: col * this.options.boxWidth,
                y: row * this.options.boxHeight,
                width: (rightCol - col) * this.options.boxWidth,
                height: (bottomRow - row) * this.options.boxHeight
              },
              text: textLines.join('\n'),
              connectors: [
                { position: 'top', x: (col + (rightCol - col) / 2) * this.options.boxWidth, y: row * this.options.boxHeight },
                { position: 'right', x: rightCol * this.options.boxWidth, y: (row + (bottomRow - row) / 2) * this.options.boxHeight },
                { position: 'bottom', x: (col + (rightCol - col) / 2) * this.options.boxWidth, y: bottomRow * this.options.boxHeight },
                { position: 'left', x: col * this.options.boxWidth, y: (row + (bottomRow - row) / 2) * this.options.boxHeight }
              ]
            };
            
            this.shapes.push(boxShape);
          }
        }
      }
    }
    
    /**
     * Identifies line shapes in the grid
     */
    private identifyLines(): void {
      const rows = this.grid.length;
      const cols = this.grid[0].length;
      
      // Create a temporary grid to track processed cells
      const processed: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));
      
      // Helper function to check if a node is part of a line
      const isLineNode = (node: GridNode): boolean => {
        return node.type === NodeType.Line || node.type === NodeType.Junction || node.type === NodeType.Arrow;
      };
      
      // Helper function to trace a line from a starting point
      const traceLine = (startRow: number, startCol: number): { points: [number, number][], arrows: { row: number, col: number, direction: string }[] } => {
        const points: [number, number][] = [[startRow, startCol]];
        const arrows: { row: number, col: number, direction: string }[] = [];
        
        // Mark starting point as processed
        processed[startRow][startCol] = true;
        
        // If starting point is an arrow, add it
        const startNode = this.grid[startRow][startCol];
        if (startNode.type === NodeType.Arrow) {
          arrows.push({ row: startRow, col: startCol, direction: startNode.data.direction });
        }
        
        // Find connected line segments
        let currentRow = startRow;
        let currentCol = startCol;
        let continueTracing = true;
        
        while (continueTracing) {
          continueTracing = false;
          
          // Check all four directions
          const directions = [
            { dr: -1, dc: 0, name: 'up' },   // Up
            { dr: 1, dc: 0, name: 'down' },  // Down
            { dr: 0, dc: -1, name: 'left' }, // Left
            { dr: 0, dc: 1, name: 'right' }  // Right
          ];
          
          for (const dir of directions) {
            const nextRow = currentRow + dir.dr;
            const nextCol = currentCol + dir.dc;
            
            // Check if next position is valid and unprocessed
            if (nextRow >= 0 && nextRow < rows && 
                nextCol >= 0 && nextCol < cols &&
                !processed[nextRow][nextCol]) {
              
              const nextNode = this.grid[nextRow][nextCol];
              
              // Check if next node is part of a line
              if (isLineNode(nextNode)) {
                // Add point to the line
                points.push([nextRow, nextCol]);
                processed[nextRow][nextCol] = true;
                
                // If it's an arrow, add it to the arrows list
                if (nextNode.type === NodeType.Arrow) {
                  arrows.push({ row: nextRow, col: nextCol, direction: nextNode.data.direction });
                }
                
                // Continue tracing from this point
                currentRow = nextRow;
                currentCol = nextCol;
                continueTracing = true;
                break;
              }
            }
          }
        }
        
        return { points, arrows };
      };
      
      // Scan for unprocessed line segments
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const node = this.grid[row][col];
          
          // Skip if already processed
          if (processed[row][col]) continue;
          
          // Check if this is a line node
          if (isLineNode(node)) {
            // Trace the line
            const { points, arrows } = traceLine(row, col);
            
            // If we have a line with at least two points, create a shape
            if (points.length >= 2) {
              const svgPoints = points.map(([r, c]) => ({
                x: c * this.options.boxWidth + this.options.boxWidth / 2,
                y: r * this.options.boxHeight + this.options.boxHeight / 2
              }));
              
              const svgArrows = arrows.map(arrow => ({
                x: arrow.col * this.options.boxWidth + this.options.boxWidth / 2,
                y: arrow.row * this.options.boxHeight + this.options.boxHeight / 2,
                direction: arrow.direction
              }));
              
              const lineShape: DiagramShape = {
                type: 'line',
                bounds: {
                  x: Math.min(...svgPoints.map(p => p.x)),
                  y: Math.min(...svgPoints.map(p => p.y)),
                  width: Math.max(...svgPoints.map(p => p.x)) - Math.min(...svgPoints.map(p => p.x)),
                  height: Math.max(...svgPoints.map(p => p.y)) - Math.min(...svgPoints.map(p => p.y))
                },
                data: {
                  points: svgPoints,
                  arrows: svgArrows
                }
              };
              
              this.shapes.push(lineShape);
            }
          }
        }
      }
    }
    
    /**
     * Identifies text blocks in the grid
     */
    private identifyText(): void {
      const rows = this.grid.length;
      const cols = this.grid[0].length;
      
      // Create a temporary grid to track processed cells
      const processed: boolean[][] = Array(rows).fill(0).map(() => Array(cols).fill(false));
      
      // Helper function to check if a node is text
      const isTextNode = (node: GridNode): boolean => {
        return node.type === NodeType.Text;
      };
      
      // Scan for unprocessed text
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const node = this.grid[row][col];
          
          // Skip if already processed
          if (processed[row][col]) continue;
          
          // Check if this is a text node
          if (isTextNode(node)) {
            // Find the extent of this text block horizontally
            let endCol = col;
            let text = node.char;
            
            // Scan to the right for more text
            for (let c = col + 1; c < cols; c++) {
              const nextNode = this.grid[row][c];
              if (isTextNode(nextNode)) {
                endCol = c;
                text += nextNode.char;
                processed[row][c] = true;
              } else {
                break;
              }
            }
            
            // Mark the starting node as processed
            processed[row][col] = true;
            
            // Create text shape
            const textShape: DiagramShape = {
              type: 'text',
              bounds: {
                x: col * this.options.boxWidth,
                y: row * this.options.boxHeight,
                width: (endCol - col + 1) * this.options.boxWidth,
                height: this.options.boxHeight
              },
              text: text.trimRight()
            };
            
            this.shapes.push(textShape);
          }
        }
      }
    }
    
    /**
     * Identifies arrow shapes in the grid
     */
    private identifyArrows(): void {
      // Arrows are already processed as part of lines,
      // but this method could be extended for standalone arrows
    }
    
    /**
     * Converts the parsed grid to an SVG element
     * @returns SVG element
     */
    public convert(): SVGElement {
      // Parse the ASCII grid
      this.parseGrid();
      
      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', this.svgWidth.toString());
      svg.setAttribute('height', this.svgHeight.toString());
      svg.setAttribute('viewBox', `0 0 ${this.svgWidth} ${this.svgHeight}`);
      svg.style.fontFamily = this.options.fontFamily;
      
      // Add a background if in debug mode
      if (this.options.debug) {
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        background.setAttribute('width', this.svgWidth.toString());
        background.setAttribute('height', this.svgHeight.toString());
        background.setAttribute('fill', '#f0f0f0');
        svg.appendChild(background);
      }
      
      // Create a main group with padding
      const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      mainGroup.setAttribute('transform', `translate(${this.options.padding}, ${this.options.padding})`);
      svg.appendChild(mainGroup);
      
      // Render debug grid if needed
      if (this.options.debug) {
        this.renderDebugGrid(mainGroup);
      }
      
      // Render all shapes
      this.renderShapes(mainGroup);
      
      return svg;
    }
    
    /**
     * Renders a debug grid
     * @param parent Parent SVG group element
     */
    private renderDebugGrid(parent: SVGGElement): void {
      const rows = this.grid.length;
      const cols = this.grid[0].length;
      
      // Create a group for the grid
      const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gridGroup.setAttribute('class', 'grid');
      parent.appendChild(gridGroup);
      
      // Render grid lines
      for (let row = 0; row <= rows; row++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', (row * this.options.boxHeight).toString());
        line.setAttribute('x2', (cols * this.options.boxWidth).toString());
        line.setAttribute('y2', (row * this.options.boxHeight).toString());
        line.setAttribute('stroke', '#cccccc');
        line.setAttribute('stroke-width', '0.5');
        gridGroup.appendChild(line);
      }
      
      for (let col = 0; col <= cols; col++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (col * this.options.boxWidth).toString());
        line.setAttribute('y1', '0');
        line.setAttribute('x2', (col * this.options.boxWidth).toString());
        line.setAttribute('y2', (rows * this.options.boxHeight).toString());
        line.setAttribute('stroke', '#cccccc');
        line.setAttribute('stroke-width', '0.5');
        gridGroup.appendChild(line);
      }
      
      // Render cell contents
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const node = this.grid[row][col];
          
          // Skip empty cells
          if (node.type === NodeType.Empty) continue;
          
          // Render cell content
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', ((col + 0.5) * this.options.boxWidth).toString());
          text.setAttribute('y', ((row + 0.5) * this.options.boxHeight).toString());
          text.setAttribute('font-size', '8px');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.textContent = node.char;
          gridGroup.appendChild(text);
        }
      }
    }
    
    /**
     * Renders all identified shapes
     * @param parent Parent SVG group element
     */
    private renderShapes(parent: SVGGElement): void {
      // First render lines
      this.shapes.filter(shape => shape.type === 'line').forEach(shape => {
        this.renderLine(parent, shape);
      });
      
      // Then render boxes
      this.shapes.filter(shape => shape.type === 'box').forEach(shape => {
        this.renderBox(parent, shape);
      });
      
      // Then render text
      this.shapes.filter(shape => shape.type === 'text').forEach(shape => {
        this.renderText(parent, shape);
      });
      
      // Then render arrows (standalone ones, if any)
      this.shapes.filter(shape => shape.type === 'arrow').forEach(shape => {
        this.renderArrow(parent, shape);
      });
    }
    
    /**
     * Renders a box shape
     * @param parent Parent SVG group element
     * @param shape Box shape to render
     */
    private renderBox(parent: SVGGElement, shape: DiagramShape): void {
      // Create a group for this box
      const boxGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      boxGroup.setAttribute('class', 'box');
      parent.appendChild(boxGroup);
      
      // Render the box rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', shape.bounds.x.toString());
      rect.setAttribute('y', shape.bounds.y.toString());
      rect.setAttribute('width', shape.bounds.width.toString());
      rect.setAttribute('height', shape.bounds.height.toString());
      rect.setAttribute('fill', this.options.boxColor);
      rect.setAttribute('stroke', this.options.lineColor);
      rect.setAttribute('stroke-width', '1');
      boxGroup.appendChild(rect);
      
      // Render text inside the box if present
      if (shape.text) {
        const textLines = shape.text.split('\n');
        const lineHeight = this.options.fontSize * 1.2;
        const textY = shape.bounds.y + shape.bounds.height / 2 - 
                     (textLines.length * lineHeight / 2) + this.options.fontSize / 2;
        
        textLines.forEach((line, index) => {
          if (line.trim() === '') return;
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', (shape.bounds.x + shape.bounds.width / 2).toString());
          text.setAttribute('y', (textY + index * lineHeight).toString());
          text.setAttribute('font-size', this.options.fontSize.toString());
          text.setAttribute('fill', this.options.textColor);
          text.setAttribute('text-anchor', 'middle');
          text.textContent = line;
          boxGroup.appendChild(text);
        });
      }
    }
    
    /**
     * Renders a line shape
     * @param parent Parent SVG group element
     * @param shape Line shape to render
     */
    private renderLine(parent: SVGGElement, shape: DiagramShape): void {
      // Create a group for this line
      const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      lineGroup.setAttribute('class', 'line');
      parent.appendChild(lineGroup);
      
      // Get the points for the line
      const points = shape.data.points;
      
      // Create a polyline
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', this.options.lineColor);
      polyline.setAttribute('stroke-width', '1');
      lineGroup.appendChild(polyline);
      
      // Render arrows if present
      if (shape.data.arrows && shape.data.arrows.length > 0) {
        shape.data.arrows.forEach(arrow => {
          this.renderArrowHead(lineGroup, arrow.x, arrow.y, arrow.direction);
        });
      }
    }
    
    /**
     * Renders a text shape
     * @param parent Parent SVG group element
     * @param shape Text shape to render
     */
    private renderText(parent: SVGGElement, shape: DiagramShape): void {
      // Create text element
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', shape.bounds.x.toString());
      text.setAttribute('y', (shape.bounds.y + this.options.boxHeight * 0.7).toString());
      text.setAttribute('font-size', this.options.fontSize.toString());
      text.setAttribute('fill', this.options.textColor);
      text.textContent = shape.text;
      parent.appendChild(text);
    }
    
    /**
     * Renders an arrow shape
     * @param parent Parent SVG group element
     * @param shape Arrow shape to render
     */
    private renderArrow(parent: SVGGElement, shape: DiagramShape): void {
      // Arrows are typically part of lines and handled by renderLine,
      // but this method could be extended for standalone arrows
    }
    
    /**
     * Renders an arrow head
     * @param parent Parent SVG group element
     * @param x X coordinate of the arrow head
     * @param y Y coordinate of the arrow head
     * @param direction Direction of the arrow
     */
    private renderArrowHead(parent: SVGGElement, x: number, y: number, direction: string): void {
      // Define arrow head size
      const size = this.options.boxWidth * 0.4;
      
      // Calculate points based on direction
      let points: string;
      
      switch (direction) {
        case 'right':
          points = `${x},${y} ${x-size},${y-size/2} ${x-size},${y+size/2}`;
          break;
        case 'left':
          points = `${x},${y} ${x+size},${y-size/2} ${x+size},${y+size/2}`;
          break;
        case 'up':
          points = `${x},${y} ${x-size/2},${y+size} ${x+size/2},${y+size}`;
          break;
        case 'down':
          points = `${x},${y} ${x-size/2},${y-size} ${x+size/2},${y-size}`;
          break;
        default:
          points = '';
      }
      
      // Create arrow head polygon
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', points);
      polygon.setAttribute('fill', this.options.lineColor);
      parent.appendChild(polygon);
    }
    
    /**
     * Converts the ASCII diagram to an SVG string
     * @returns SVG markup as a string
     */
    public toString(): string {
      const svg = this.convert();
      return new XMLSerializer().serializeToString(svg);
    }
    
    /**
     * Creates an SVG data URL for embedding in images
     * @returns Data URL with SVG content
     */
    public toDataURL(): string {
      const svgString = this.toString();
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    }
  }