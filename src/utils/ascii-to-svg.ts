/**
 * ASCII to SVG Converter
 * Converts ASCII art diagrams to SVG for presentation
 */

export interface AsciiToSvgOptions {
    text: string;
    boxWidth?: number;
    boxHeight?: number;
    lineColor?: string;
    textColor?: string;
}

export class AsciiToSvg {
  private text: string;
  private boxWidth: number;
  private boxHeight: number;
  private lineColor: string;
  private textColor: string;
  
  constructor(options: AsciiToSvgOptions) {
    this.text = options.text;
    this.boxWidth = options.boxWidth || 10;
    this.boxHeight = options.boxHeight || 20;
    this.lineColor = options.lineColor || '#333';
    this.textColor = options.textColor || '#000';
  }
  
  /**
   * Converts ASCII art to SVG
   * @returns SVG element
   */
  convert(): SVGElement {
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    // Split text into lines
    const lines = this.text.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      
    // Set SVG dimensions
    svg.setAttribute('width', (maxLineLength * this.boxWidth).toString());
    svg.setAttribute('height', (lines.length * this.boxHeight).toString());
    svg.setAttribute('viewBox', `0 0 ${maxLineLength * this.boxWidth} ${lines.length * this.boxHeight}`);
      
      // Process each line
    lines.forEach((line, lineIndex) => {
        // Process each character
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const char = line[charIndex];
        const x = charIndex * this.boxWidth;
        const y = lineIndex * this.boxHeight;
        
        // Skip spaces
        if (char === ' ') continue;
        
        // Create text element for the character
        if (char !== '-' && char !== '|' && char !== '+' && char !== '<' && char !== '>' && char !== '^' && char !== 'v') {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', (x + this.boxWidth / 2).toString());
          text.setAttribute('y', (y + this.boxHeight / 2 + 5).toString()); // +5 for vertical centering
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', this.textColor);
          text.textContent = char;
          svg.appendChild(text);
        }
        
        // Create line or box elements for special characters
        if (char === '-' || char === '=' || char === '_') {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x.toString());
          line.setAttribute('y1', (y + this.boxHeight / 2).toString());
          line.setAttribute('x2', (x + this.boxWidth).toString());
          line.setAttribute('y2', (y + this.boxHeight / 2).toString());
          line.setAttribute('stroke', this.lineColor);
          line.setAttribute('stroke-width', '1');
          svg.appendChild(line);
        } else if (char === '|') {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', (x + this.boxWidth / 2).toString());
          line.setAttribute('y1', y.toString());
          line.setAttribute('x2', (x + this.boxWidth / 2).toString());
          line.setAttribute('y2', (y + this.boxHeight).toString());
          line.setAttribute('stroke', this.lineColor);
          line.setAttribute('stroke-width', '1');
          svg.appendChild(line);
        } else if (char === '+' || char === '┌' || char === '┐' || char === '└' || char === '┘') {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x.toString());
          rect.setAttribute('y', y.toString());
          rect.setAttribute('width', this.boxWidth.toString());
          rect.setAttribute('height', this.boxHeight.toString());
          rect.setAttribute('fill', 'none');
          rect.setAttribute('stroke', this.lineColor);
          rect.setAttribute('stroke-width', '1');
          svg.appendChild(rect);
        } else if (char === '>' || char === '<' || char === '^' || char === 'v') {
          // Draw arrows
          const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          let points = '';
          
          if (char === '>') {
            points = `${x},${y + this.boxHeight / 2 - 5} ${x + this.boxWidth},${y + this.boxHeight / 2} ${x},${y + this.boxHeight / 2 + 5}`;
          } else if (char === '<') {
            points = `${x + this.boxWidth},${y + this.boxHeight / 2 - 5} ${x},${y + this.boxHeight / 2} ${x + this.boxWidth},${y + this.boxHeight / 2 + 5}`;
          } else if (char === '^') {
            points = `${x + this.boxWidth / 2 - 5},${y + this.boxHeight} ${x + this.boxWidth / 2},${y} ${x + this.boxWidth / 2 + 5},${y + this.boxHeight}`;
          } else if (char === 'v') {
            points = `${x + this.boxWidth / 2 - 5},${y} ${x + this.boxWidth / 2},${y + this.boxHeight} ${x + this.boxWidth / 2 + 5},${y}`;
          }
          
          arrow.setAttribute('points', points);
          arrow.setAttribute('fill', this.lineColor);
          svg.appendChild(arrow);
        }
      }
    });
    
    return svg;
    }
  }