/**
 * Markdown Integration Example
 * 
 * Demonstrates how markdown content is transformed into interactive visualizations
 * using the presentation system's utility modules.
 */
import { SlideConfig, SlideGroup, PresentationConfig } from '../types/slide-data';
import { GraphData } from '../types/graph-data';
import { MarkdownParser, MarkdownParseResult, Directive } from '../utils/markdown-parser';
import { Timer, SlideTimer } from '../utils/timer';
import { KGVisualization } from './kg-visualization-example';
import { highlightCode } from '../utils/code-highlighter';
import { animateEntrance, Easing } from '../utils/animation';

/**
 * Processes markdown content into an interactive knowledge graph presentation
 */
export class MarkdownKGProcessor {
  private markdownParser: MarkdownParser;
  private container: HTMLElement;
  private visualizationContainer: HTMLElement;
  private contentContainer: HTMLElement;
  private kgVisualization: KGVisualization | null = null;
  private currentDirectives: Directive[] = [];
  private slideTimer: SlideTimer | null = null;
  
  /**
   * Constructor
   * @param container Main container for the presentation
   */
  constructor(container: HTMLElement) {
    this.container = container;
    
    // Create parser
    this.markdownParser = new MarkdownParser({
      extractMetadata: true,
      extractDirectives: true,
      addHeadingIds: true,
      generateToc: true,
      extractCodeBlocks: true,
      parseKgSyntax: true
    });
    
    // Create content and visualization containers
    this.contentContainer = document.createElement('div');
    this.contentContainer.className = 'kg-content-container';
    this.contentContainer.style.cssText = `
      flex: 1;
      padding: 20px;
      overflow: auto;
      height: 100%;
    `;
    
    this.visualizationContainer = document.createElement('div');
    this.visualizationContainer.className = 'kg-visualization-container';
    this.visualizationContainer.style.cssText = `
      flex: 1;
      display: flex;
      position: relative;
      height: 100%;
    `;
    
    // Create layout
    container.style.cssText = `
      display: flex;
      flex-direction: row;
      height: 100%;
      width: 100%;
      overflow: hidden;
    `;
    
    container.appendChild(this.contentContainer);
    container.appendChild(this.visualizationContainer);
    
    // Create slide timer
    this.slideTimer = new SlideTimer();
  }
  
  /**
   * Processes markdown content
   * @param markdown Markdown content
   * @returns Parse result
   */
  public process(markdown: string): MarkdownParseResult {
    // Parse markdown
    const result = this.markdownParser.parse(markdown);
    
    // Display content
    this.displayContent(result);
    
    // Process directives
    this.processDirectives(result.directives);
    
    return result;
  }
  
  /**
   * Displays parsed content
   * @param result Parse result
   */
  private displayContent(result: MarkdownParseResult): void {
    // Display HTML content
    this.contentContainer.innerHTML = result.html;
    
    // Apply syntax highlighting to code blocks
    const codeElements = this.contentContainer.querySelectorAll('pre code');
    codeElements.forEach(codeElement => {
      const language = Array.from(codeElement.classList)
        .find(cls => cls.startsWith('language-'))
        ?.replace('language-', '') || 'plain';
      
      const code = codeElement.textContent || '';
      
      // Create highlighted code element
      const highlightedElement = highlightCode(code, {
        language,
        lineNumbers: true,
        theme: 'dark'
      });
      
      // Replace original element
      const preElement = codeElement.parentElement;
      if (preElement && preElement.parentElement) {
        preElement.parentElement.replaceChild(highlightedElement, preElement);
      }
    });
    
    // Add animation to elements
    const headings = this.contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((element, index) => {
      animateEntrance(element as HTMLElement, 'fade', {
        duration: 800,
        easing: Easing.easeOutQuad,
        delay: 100 * index
      });
    });
    
    const paragraphs = this.contentContainer.querySelectorAll('p');
    paragraphs.forEach((element, index) => {
      animateEntrance(element as HTMLElement, 'slide-right', {
        duration: 800,
        easing: Easing.easeOutQuad,
        delay: 200 + 50 * index
      });
    });
    
    const lists = this.contentContainer.querySelectorAll('ul, ol');
    lists.forEach((element, index) => {
      animateEntrance(element as HTMLElement, 'slide-up', {
        duration: 800,
        easing: Easing.easeOutQuad,
        delay: 400 + 50 * index
      });
    });
  }
  
  /**
   * Processes special directives from markdown
   * @param directives Array of directives
   */
  private processDirectives(directives: Directive[]): void {
    // Store current directives
    this.currentDirectives = directives;
    
    // Process visualizations
    const visualDirectives = directives.filter(d => 
      ['Graph', 'Visual', 'Visualization', 'KnowledgeGraph'].includes(d.type)
    );
    
    if (visualDirectives.length > 0) {
      this.processVisualizationDirectives(visualDirectives);
    }
    
    // Process timer directives
    const timerDirectives = directives.filter(d => d.type === 'Timer');
    if (timerDirectives.length > 0 && this.slideTimer) {
      const directive = timerDirectives[0];
      const duration = parseInt(directive.content) * 1000 || 300000; // Default to 5 minutes
      
      this.slideTimer.setSlideTimings(0, {
        duration,
        autoAdvance: directive.params.autoAdvance === 'true',
        warningTime: parseInt(directive.params.warningTime) * 1000 || 60000 // Default to 1 minute
      });
      
      this.slideTimer.startSlide(0);
      
      // Create timer display
      const timerDisplay = document.createElement('div');
      timerDisplay.className = 'timer-display';
      timerDisplay.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 14px;
        z-index: 1000;
      `;
      
      this.container.appendChild(timerDisplay);
      
      // Update timer display
      const updateTimer = () => {
        if (this.slideTimer) {
          timerDisplay.textContent = this.slideTimer.getFormattedTime('mm:ss');
          
          // Add warning class if less than a minute remaining
          if (this.slideTimer.getRemainingTime() < 60000) {
            timerDisplay.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
          }
        }
      };
      
      // Set up timer update interval
      const timerInterval = setInterval(updateTimer, 1000);
      updateTimer(); // Initial update
    }
  }
  
  /**
   * Processes visualization directives
   * @param directives Visualization directives
   */
  private processVisualizationDirectives(directives: Directive[]): void {
    // Get the first directive (prioritize explicit KnowledgeGraph directives)
    const kgDirective = directives.find(d => d.type === 'KnowledgeGraph') || directives[0];
    
    // Clear existing visualization
    if (this.kgVisualization) {
      this.kgVisualization.destroy();
      this.kgVisualization = null;
    }
    
    // Look for graph data in code blocks
    const graphData = this.extractGraphData();
    
    if (graphData) {
      // Create visualization
      this.kgVisualization = new KGVisualization({
        container: this.visualizationContainer,
        data: graphData,
        layout: (kgDirective.params.layout as any) || 'force-directed',
        nodeSizeStrategy: (kgDirective.params.nodeSizeStrategy as any) || 'degree',
        showLabels: kgDirective.params.showLabels !== 'false',
        animate: kgDirective.params.animate !== 'false',
        zoomable: true,
        draggable: true,
        onNodeClick: (nodeId, node) => {
          this.handleNodeClick(nodeId, node);
        }
      });
      
      // Initially highlight specific nodes if specified
      if (kgDirective.params.highlightNodes) {
        const nodeIds = kgDirective.params.highlightNodes.split(',');
        this.kgVisualization.highlightNodes(nodeIds);
      }
    }
  }
  
  /**
   * Extracts graph data from code blocks
   * @returns Graph data if found, null otherwise
   */
  private extractGraphData(): GraphData | null {
    // Find code blocks with JSON or JavaScript graph data
    const codeBlocks = Array.from(this.contentContainer.querySelectorAll('pre code'));
    
    for (const codeBlock of codeBlocks) {
      const classList = Array.from(codeBlock.classList);
      const isJsonOrJs = classList.some(cls => 
        cls === 'language-json' || 
        cls === 'language-javascript' || 
        cls === 'language-js'
      );
      
      if (isJsonOrJs) {
        try {
          // Get code content
          const codeContent = codeBlock.textContent || '';
          
          // Remove comments
          const cleanedCode = codeContent
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\/\/.*/g, ''); // Remove single-line comments
          
          // Try to parse as JSON
          const data = JSON.parse(cleanedCode);
          
          // Check if it's a valid graph structure
          if (data && data.nodes && data.edges) {
            // Hide the code block
            const preElement = codeBlock.parentElement;
            if (preElement) {
              preElement.style.display = 'none';
            }
            
            return data as GraphData;
          }
        } catch (error) {
          console.warn('Failed to parse code block as graph data:', error);
        }
      } else if (classList.some(cls => cls === 'language-cypher')) {
        // Extract graph data from Cypher queries
        try {
          const cypher = codeBlock.textContent || '';
          return this.extractGraphFromCypher(cypher);
        } catch (error) {
          console.warn('Failed to extract graph data from Cypher:', error);
        }
      }
    }
    
    // If no valid graph data found in code blocks, check for special syntax in content
    return this.extractGraphFromMarkdown();
  }
  
  /**
   * Extracts graph data from Cypher queries
   * @param cypher Cypher query string
   * @returns Graph data
   */
  private extractGraphFromCypher(cypher: string): GraphData {
    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeMap = new Map<string, boolean>();
    
    // Extract node patterns
    const nodePattern = /\(([a-zA-Z0-9_]+):([a-zA-Z0-9_]+)(\s*\{([^}]*)\})?\)/g;
    let match;
    
    while ((match = nodePattern.exec(cypher)) !== null) {
      const [fullMatch, variable, label, propsMatch, propsStr] = match;
      
      // Skip if already added
      if (nodeMap.has(variable)) {
        continue;
      }
      
      // Create node
      const node: any = {
        id: variable,
        label,
        type: 'Entity'
      };
      
      // Add properties if available
      if (propsStr) {
        try {
          const props = this.parseCypherProps(propsStr);
          node.properties = props;
        } catch (error) {
          console.warn('Failed to parse Cypher properties:', error);
        }
      }
      
      nodes.push(node);
      nodeMap.set(variable, true);
    }
    
    // Extract relationship patterns
    const relPattern = /\(([a-zA-Z0-9_]+)\)-\[([a-zA-Z0-9_]*):?([a-zA-Z0-9_]*)?(\s*\{([^}]*)\})?\]->\(([a-zA-Z0-9_]+)\)/g;
    
    while ((match = relPattern.exec(cypher)) !== null) {
      const [fullMatch, source, relVar, relType, propsMatch, propsStr, target] = match;
      
      // Create relationship
      const edge: any = {
        source,
        target,
        label: relType || 'RELATED_TO',
        directed: true
      };
      
      // Add properties if available
      if (propsStr) {
        try {
          const props = this.parseCypherProps(propsStr);
          edge.properties = props;
        } catch (error) {
          console.warn('Failed to parse Cypher properties:', error);
        }
      }
      
      edges.push(edge);
    }
    
    return {
      nodes,
      edges,
      metadata: {
        name: 'Cypher Graph',
        source: 'Generated from Cypher query'
      }
    };
  }
  
  /**
   * Parses Cypher property string
   * @param propsStr Properties string
   * @returns Properties object
   */
  private parseCypherProps(propsStr: string): Record<string, any> {
    const props: Record<string, any> = {};
    
    // Split by commas not within quotes
    const propPairs = propsStr.split(',').map(s => s.trim());
    
    propPairs.forEach(pair => {
      const [key, valueStr] = pair.split(':').map(s => s.trim());
      
      // Parse value
      let value: any;
      
      if (valueStr.startsWith('"') || valueStr.startsWith("'")) {
        // String value
        value = valueStr.slice(1, -1);
      } else if (valueStr === 'true' || valueStr === 'false') {
        // Boolean value
        value = valueStr === 'true';
      } else if (!isNaN(Number(valueStr))) {
        // Numeric value
        value = Number(valueStr);
      } else {
        // Default to string
        value = valueStr;
      }
      
      props[key] = value;
    });
    
    return props;
  }
  
  /**
   * Extracts graph data from markdown content using KG-specific syntax
   * @returns Graph data if found, null otherwise
   */
  private extractGraphFromMarkdown(): GraphData | null {
    // Get all KG relationship elements
    const relationshipElements = this.contentContainer.querySelectorAll('.kg-relationship');
    
    if (relationshipElements.length === 0) {
      return null;
    }
    
    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeMap = new Map<string, boolean>();
    
    // Process relationships
    relationshipElements.forEach(relationshipElement => {
      const entityElements = relationshipElement.querySelectorAll('.kg-entity');
      const relationshipTypeElement = relationshipElement.querySelector('.kg-relationship-type');
      
      if (entityElements.length >= 2 && relationshipTypeElement) {
        const sourceEntity = entityElements[0];
        const targetEntity = entityElements[1];
        const relationType = relationshipTypeElement.textContent || 'RELATED_TO';
        
        // Add source node if not already added
        const sourceId = sourceEntity.textContent || '';
        if (sourceId && !nodeMap.has(sourceId)) {
          nodes.push({
            id: sourceId,
            label: sourceId,
            type: 'Entity'
          });
          nodeMap.set(sourceId, true);
        }
        
        // Add target node if not already added
        const targetId = targetEntity.textContent || '';
        if (targetId && !nodeMap.has(targetId)) {
          nodes.push({
            id: targetId,
            label: targetId,
            type: 'Entity'
          });
          nodeMap.set(targetId, true);
        }
        
        // Add edge
        if (sourceId && targetId) {
          edges.push({
            source: sourceId,
            target: targetId,
            label: relationType,
            directed: true
          });
        }
      }
    });
    
    // Add any properties
    const propertyElements = this.contentContainer.querySelectorAll('.kg-property');
    
    propertyElements.forEach(propertyElement => {
      const entityElement = propertyElement.querySelector('.kg-entity');
      const propertyNameElement = propertyElement.querySelector('.kg-property-name');
      const propertyValueElement = propertyElement.querySelector('.kg-property-value');
      
      if (entityElement && propertyNameElement && propertyValueElement) {
        const entityId = entityElement.textContent || '';
        const propertyName = propertyNameElement.textContent || '';
        const propertyValue = propertyValueElement.textContent || '';
        
        // Find the node
        const node = nodes.find(n => n.id === entityId);
        
        if (node) {
          // Initialize properties if needed
          if (!node.properties) {
            node.properties = {};
          }
          
          // Add property
          node.properties[propertyName] = propertyValue;
        }
      }
    });
    
    if (nodes.length > 0 || edges.length > 0) {
      return {
        nodes,
        edges,
        metadata: {
          name: 'Markdown Graph',
          source: 'Generated from markdown'
        }
      };
    }
    
    return null;
  }
  
  /**
   * Handles node click events
   * @param nodeId Node ID
   * @param node Node data
   */
  private handleNodeClick(nodeId: string, node: any): void {
    // Find corresponding element in content
    const entityElements = this.contentContainer.querySelectorAll(`.kg-entity[data-entity="${nodeId}"]`);
    
    if (entityElements.length > 0) {
      // Scroll to the first occurrence
      entityElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight all occurrences
      entityElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const originalBackground = htmlElement.style.backgroundColor;
        htmlElement.style.backgroundColor = '#ffeb3b';
        htmlElement.style.transition = 'background-color 0.5s ease';
        
        // Reset after a delay
        setTimeout(() => {
          htmlElement.style.backgroundColor = originalBackground;
        }, 2000);
      });
    }
    
    // Find any heading with the entity name
    const entityHeadings = Array.from(this.contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(heading => heading.textContent?.includes(nodeId));
    
    if (entityHeadings.length > 0) {
      // Scroll to the first heading
      entityHeadings[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  /**
   * Creates a presentation config from markdown content
   * @param markdown Markdown content
   * @returns Presentation config
   */
  public static createPresentationConfig(markdown: string): PresentationConfig {
    const parser = new MarkdownParser({
      extractMetadata: true,
      generateToc: true
    });
    
    const result = parser.parse(markdown);
    
    // Create slide groups based on headings
    const slideGroups: SlideGroup[] = [];
    let currentGroup: SlideGroup | null = null;
    
    // Heading pattern for slide splitting
    const headingPattern = /<h([1-3])[^>]*>(.*?)<\/h\1>/g;
    let match;
    let content = result.html;
    let lastIndex = 0;
    
    while ((match = headingPattern.exec(content)) !== null) {
      const level = parseInt(match[1]);
      const title = match[2];
      const headingHtml = match[0];
      const headingIndex = match.index;
      
      if (level === 1) {
        // Title slide
        const slideParts = content.slice(lastIndex, headingIndex + headingHtml.length);
        
        const slide: SlideConfig = {
          id: `slide-${slideGroups.length}-0`,
          title,
          content: {
            mainContent: slideParts
          },
          visualizationType: 'none',
          transition: 'fade',
          classes: ['title-slide']
        };
        
        // Create title slide group
        currentGroup = {
          title,
          id: `group-${slideGroups.length}`,
          slides: [slide],
          includeSectionSlide: false
        };
        
        slideGroups.push(currentGroup);
      } else if (level === 2) {
        // Section slide
        const slide: SlideConfig = {
          id: `slide-${slideGroups.length}-0`,
          title,
          content: {
            mainContent: headingHtml
          },
          visualizationType: 'none',
          transition: 'fade',
          classes: ['section-slide']
        };
        
        // Create section slide group
        currentGroup = {
          title,
          id: `group-${slideGroups.length}`,
          slides: [slide],
          includeSectionSlide: true
        };
        
        slideGroups.push(currentGroup);
      } else if (level === 3 && currentGroup) {
        // Content slide
        const slideEndIndex = content.indexOf('<h3', headingIndex + headingHtml.length);
        const slideEndPos = slideEndIndex !== -1 ? slideEndIndex : content.length;
        const slideParts = content.slice(headingIndex, slideEndPos);
        
        const slide: SlideConfig = {
          id: `slide-${slideGroups.indexOf(currentGroup)}-${currentGroup.slides.length}`,
          title,
          content: {
            mainContent: slideParts
          },
          visualizationType: 'none',
          transition: 'slide',
          classes: ['content-slide']
        };
        
        currentGroup.slides.push(slide);
      }
      
      lastIndex = headingIndex + headingHtml.length;
    }
    
    // Create presentation config
    return {
      title: result.metadata.title as string || 'Knowledge Graph Presentation',
      presenter: result.metadata.author ? {
        name: result.metadata.author as string,
        title: result.metadata.title as string,
        organization: result.metadata.organization as string
      } : undefined,
      slideGroups,
      settings: {
        theme: 'black',
        defaultTransition: 'slide',
        showSlideNumber: 'all',
        controls: true,
        progress: true,
        center: true
      }
    };
  }
  
  /**
   * Cleans up resources
   */
  public destroy(): void {
    // Clean up visualization
    if (this.kgVisualization) {
      this.kgVisualization.destroy();
      this.kgVisualization = null;
    }
    
    // Clean up timer
    if (this.slideTimer) {
      this.slideTimer.destroy();
      this.slideTimer = null;
    }
    
    // Clean up containers
    this.container.innerHTML = '';
  }
}

/**
 * Example usage:
 * 
 * ```typescript
 * // Sample markdown content
 * const markdown = `
 * # Knowledge Graph Introduction
 * 
 * *[Visual: Interactive knowledge graph visualization {layout=force-directed,showLabels=true}]*
 * 
 * ## What is a Knowledge Graph?
 * 
 * A knowledge graph is a structured representation of knowledge as a network of entities and relationships.
 * 
 * - Entities represent real-world objects, concepts, or events
 * - Relationships connect entities and provide context
 * - Properties add additional attributes to entities and relationships
 * 
 * ### Example Knowledge Graph
 * 
 * \`\`\`json
 * {
 *   "nodes": [
 *     { "id": "Person", "label": "Person", "type": "Entity" },
 *     { "id": "Organization", "label": "Organization", "type": "Entity" },
 *     { "id": "Location", "label": "Location", "type": "Entity" }
 *   ],
 *   "edges": [
 *     { "source": "Person", "target": "Organization", "label": "WORKS_AT", "directed": true },
 *     { "source": "Organization", "target": "Location", "label": "LOCATED_IN", "directed": true },
 *     { "source": "Person", "target": "Location", "label": "LIVES_IN", "directed": true }
 *   ]
 * }
 * \`\`\`
 * `;
 * 
 * // Create processor
 * const container = document.getElementById('markdown-container');
 * const processor = new MarkdownKGProcessor(container);
 * 
 * // Process markdown
 * processor.process(markdown);
 * ```
 */