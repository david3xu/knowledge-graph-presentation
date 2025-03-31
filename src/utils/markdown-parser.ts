/**
 * Markdown Parsing Utilities
 * Extends the core markdown parser with additional utilities for special syntax
 */
import * as marked from 'marked';

/**
 * Metadata extracted from markdown frontmatter
 */
export interface MarkdownMetadata {
  /** Title of the document */
  title?: string;
  
  /** Author information */
  author?: string;
  
  /** Date of creation or last update */
  date?: string;
  
  /** Tags or categories */
  tags?: string[];
  
  /** Description or summary */
  description?: string;
  
  /** Additional custom metadata */
  [key: string]: any;
}

/**
 * Result of parsing markdown
 */
export interface MarkdownParseResult {
  /** HTML content */
  html: string;
  
  /** Extracted metadata */
  metadata: MarkdownMetadata;
  
  /** Table of contents */
  toc: TocItem[];
  
  /** Code blocks */
  codeBlocks: CodeBlock[];
  
  /** Special directives */
  directives: Directive[];
}

/**
 * Table of contents item
 */
export interface TocItem {
  /** Item text */
  text: string;
  
  /** Generated ID */
  id: string;
  
  /** Heading level (1-6) */
  level: number;
  
  /** Child items */
  children: TocItem[];
}

/**
 * Extracted code block
 */
export interface CodeBlock {
  /** Language specified for the code block */
  language: string;
  
  /** Code content */
  code: string;
  
  /** Caption (if any) */
  caption?: string;
  
  /** Generated ID */
  id: string;
}

/**
 * Special directive extracted from markdown
 */
export interface Directive {
  /** Type of directive */
  type: string;
  
  /** Directive content */
  content: string;
  
  /** Additional parameters */
  params: Record<string, string>;
}

/**
 * Parser configuration options
 */
export interface MarkdownParserOptions {
  /** Whether to extract and remove metadata */
  extractMetadata?: boolean;
  
  /** Whether to extract special directives */
  extractDirectives?: boolean;
  
  /** Whether to generate and add IDs to headings */
  addHeadingIds?: boolean;
  
  /** Whether to generate a table of contents */
  generateToc?: boolean;
  
  /** Maximum heading level to include in TOC */
  maxTocLevel?: number;
  
  /** Whether to extract code blocks */
  extractCodeBlocks?: boolean;
  
  /** Whether to add line numbers to code blocks */
  codeLineNumbers?: boolean;
  
  /** Whether to parse custom KG-specific syntax */
  parseKgSyntax?: boolean;
  
  /** Custom renderer options */
  rendererOptions?: {
    /** Highlight.js language prefix */
    langPrefix?: string;
    
    /** Whether to sanitize HTML */
    sanitize?: boolean;
    
    /** Whether to convert line breaks to <br> tags */
    breaks?: boolean;
    
    /** Additional renderer methods */
    [key: string]: any;
  };
}

/**
 * Default parser options
 */
const DEFAULT_OPTIONS: MarkdownParserOptions = {
  extractMetadata: true,
  extractDirectives: true,
  addHeadingIds: true,
  generateToc: true,
  maxTocLevel: 3,
  extractCodeBlocks: true,
  codeLineNumbers: false,
  parseKgSyntax: true,
  rendererOptions: {
    langPrefix: 'language-',
    sanitize: false,
    breaks: true
  }
};

/**
 * Enhanced markdown parser with support for special knowledge graph syntax
 */
export class MarkdownParser {
  private options: MarkdownParserOptions;
  private tocItems: TocItem[] = [];
  private codeBlocks: CodeBlock[] = [];
  private directives: Directive[] = [];
  
  /**
   * Creates a new markdown parser
   * @param options Parser configuration options
   */
  constructor(options: MarkdownParserOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Parses markdown content
   * @param markdown Markdown content
   * @returns Parsing result
   */
  parse(markdown: string): MarkdownParseResult {
    // Reset state
    this.tocItems = [];
    this.codeBlocks = [];
    this.directives = [];
    
    // Extract metadata if enabled
    let content = markdown;
    let metadata: MarkdownMetadata = {};
    
    if (this.options.extractMetadata) {
      const result = this.extractMetadata(content);
      content = result.content;
      metadata = result.metadata;
    }
    
    // Extract directives if enabled
    if (this.options.extractDirectives) {
      const result = this.extractDirectives(content);
      content = result.content;
      this.directives = result.directives;
    }
    
    // Configure marked
    const renderer = new marked.Renderer();
    
    // Customize heading renderer to add IDs
    if (this.options.addHeadingIds || this.options.generateToc) {
      const originalHeading = renderer.heading.bind(renderer);
      
      renderer.heading = (heading: marked.Tokens.Heading) => {
        const text = heading.text;
        const id = this.generateId(text);
        
        // Add to TOC if needed
        if (this.options.generateToc && heading.depth <= (this.options.maxTocLevel || 3)) {
          this.addToToc(text, id, heading.depth);
        }
        
        // Use original renderer with added ID
        if (this.options.addHeadingIds) {
          return originalHeading(heading).replace('<h', `<h id="${id}"`);
        } else {
          return originalHeading(heading);
        }
      };
    }
    
    // Customize code block renderer to extract code blocks and add line numbers
    if (this.options.extractCodeBlocks || this.options.codeLineNumbers) {
      const originalCode = renderer.code.bind(renderer);
      
      renderer.code = (code: marked.Tokens.Code) => {
        // Extract the code block if needed
        if (this.options.extractCodeBlocks) {
          const id = `code-${this.codeBlocks.length + 1}`;
          this.codeBlocks.push({
            language: code.lang || 'plain',
            code: code.text,
            id
          });
        }
        
        // Add line numbers if enabled
        if (this.options.codeLineNumbers && code.text) {
          const lines = code.text.split('\n');
          const lineNumbers = lines.map((_, i) => i + 1).join('\n');
          const wrappedCode = lines.map(line => `<span class="line">${line}</span>`).join('\n');
          
          return `<div class="code-block-wrapper">
            <div class="line-numbers">${lineNumbers}</div>
            <pre><code class="${this.options.rendererOptions?.langPrefix || ''}${code.lang || 'plain'}">${wrappedCode}</code></pre>
          </div>`;
        }
        
        // Use original renderer
        return originalCode(code);
      };
    }
    
    // Apply KG-specific syntax transformations if enabled
    if (this.options.parseKgSyntax) {
      content = this.transformKgSyntax(content);
    }
    
    // Parse markdown using marked
    const html = marked.parse(content, { 
      renderer,
      ...this.options.rendererOptions
    }) as string;
    
    // Return result
    return {
      html,
      metadata,
      toc: this.tocItems,
      codeBlocks: this.codeBlocks,
      directives: this.directives
    };
  }
  
  /**
   * Extracts metadata from markdown frontmatter
   * @param markdown Markdown content
   * @returns Content without metadata and extracted metadata
   */
  private extractMetadata(markdown: string): { content: string; metadata: MarkdownMetadata } {
    const metadata: MarkdownMetadata = {};
    
    // Check for YAML frontmatter
    const yamlMatch = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    
    if (yamlMatch) {
      // Extract frontmatter content
      const frontmatter = yamlMatch[1];
      
      // Parse frontmatter lines
      frontmatter.split('\n').forEach(line => {
        const match = line.match(/^(\w+):\s*(.*)$/);
        
        if (match) {
          const [, key, value] = match;
          
          // Handle arrays (comma-separated values)
          if (value.includes(',')) {
            metadata[key] = value.split(',').map(item => item.trim());
          } else {
            metadata[key] = value.trim();
          }
        }
      });
      
      // Remove frontmatter from content
      return {
        content: markdown.slice(yamlMatch[0].length),
        metadata
      };
    }
    
    // No frontmatter found
    return {
      content: markdown,
      metadata
    };
  }
  
  /**
   * Extracts special directives from markdown
   * @param markdown Markdown content
   * @returns Content without directives and extracted directives
   */
  private extractDirectives(markdown: string): { content: string; directives: Directive[] } {
    const directives: Directive[] = [];
    let content = markdown;
    
    // Match directive pattern: *[DirectiveType: Content]*
    const directivePattern = /\*\[(\w+):\s*([^\]]+)(?:\{([^\}]*)\})?\]\*/g;
    let match;
    
    while ((match = directivePattern.exec(markdown)) !== null) {
      const [fullMatch, type, directiveContent, paramsString] = match;
      
      // Parse parameters
      const params: Record<string, string> = {};
      
      if (paramsString) {
        const paramPairs = paramsString.split(',');
        
        paramPairs.forEach(pair => {
          const [key, value] = pair.split('=').map(part => part.trim());
          params[key] = value;
        });
      }
      
      // Add directive
      directives.push({
        type,
        content: directiveContent.trim(),
        params
      });
      
      // Remove directive from content
      content = content.replace(fullMatch, '');
    }
    
    return {
      content,
      directives
    };
  }
  
  /**
   * Adds an item to the table of contents
   * @param text Item text
   * @param id Item ID
   * @param level Heading level
   */
  private addToToc(text: string, id: string, level: number): void {
    // Create the TOC item
    const item: TocItem = {
      text,
      id,
      level,
      children: []
    };
    
    // Find where to add this item based on its level
    if (level === 1) {
      // Top-level heading
      this.tocItems.push(item);
    } else {
      // Find the appropriate parent
      let parent = this.findTocParent(this.tocItems, level);
      
      if (parent) {
        parent.children.push(item);
      } else {
        // No appropriate parent found, add to top level
        this.tocItems.push(item);
      }
    }
  }
  
  /**
   * Recursively finds the appropriate parent for a TOC item
   * @param items Items to search
   * @param targetLevel Target heading level
   * @returns Parent item or null if not found
   */
  private findTocParent(items: TocItem[], targetLevel: number): TocItem | null {
    if (items.length === 0) {
      return null;
    }
    
    // Get the last item
    const lastItem = items[items.length - 1];
    
    // If the last item is one level above the target, it's the parent
    if (lastItem.level === targetLevel - 1) {
      return lastItem;
    }
    
    // If the last item has children, try to find a parent there
    if (lastItem.children.length > 0) {
      const childParent = this.findTocParent(lastItem.children, targetLevel);
      if (childParent) {
        return childParent;
      }
    }
    
    // Try siblings
    for (let i = items.length - 2; i >= 0; i--) {
      const item = items[i];
      
      if (item.level === targetLevel - 1) {
        return item;
      }
      
      if (item.level < targetLevel) {
        // If we found an item with a level less than the target,
        // we won't find a proper parent in earlier siblings
        break;
      }
    }
    
    return null;
  }
  
  /**
   * Generates a slug ID from text
   * @param text Text to convert to ID
   * @returns URL-friendly ID
   */
  private generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  /**
   * Transforms knowledge graph specific syntax in markdown
   * @param markdown Markdown content
   * @returns Transformed markdown
   */
  private transformKgSyntax(markdown: string): string {
    let transformed = markdown;
    
    // Transform node-edge syntax: [Entity]-relationship->[Entity]
    transformed = transformed.replace(
      /\[([^\]]+)\]-([^-\]]+)->?\[([^\]]+)\]/g,
      (_, source, relationship, target) => {
        return `<div class="kg-relationship">
          <span class="kg-entity" data-entity="${source.trim()}">${source.trim()}</span>
          <span class="kg-relationship-type">${relationship.trim()}</span>
          <span class="kg-entity" data-entity="${target.trim()}">${target.trim()}</span>
        </div>`;
      }
    );
    
    // Transform property syntax: Entity.property = value
    transformed = transformed.replace(
      /([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\s*=\s*(.+?)(?=$|\n)/g,
      (_, entity, property, value) => {
        return `<div class="kg-property">
          <span class="kg-entity" data-entity="${entity.trim()}">${entity.trim()}</span>
          <span class="kg-property-name">${property.trim()}</span>
          <span class="kg-property-value">${value.trim()}</span>
        </div>`;
      }
    );
    
    // Transform highlight syntax: ==highlighted text==
    transformed = transformed.replace(
      /==([^=]+)==/g,
      '<mark>$1</mark>'
    );
    
    // Transform annotation syntax: ((text:annotation))
    transformed = transformed.replace(
      /\(\(([^:]+):([^)]+)\)\)/g,
      '<span class="annotation" data-annotation="$2">$1</span>'
    );
    
    return transformed;
  }
  
  /**
   * Renders the table of contents as HTML
   * @param items TOC items
   * @param className Optional CSS class for the TOC
   * @returns HTML string
   */
  public renderToc(items: TocItem[] = this.tocItems, className: string = 'toc'): string {
    if (items.length === 0) {
      return '';
    }
    
    let html = `<ul class="${className}">`;
    
    items.forEach(item => {
      html += `<li>
        <a href="#${item.id}">${item.text}</a>
        ${item.children.length > 0 ? this.renderToc(item.children, `${className}-sub`) : ''}
      </li>`;
    });
    
    html += '</ul>';
    return html;
  }
  
  /**
   * Finds code blocks by language
   * @param language Language to filter by
   * @returns Array of matching code blocks
   */
  public getCodeBlocksByLanguage(language: string): CodeBlock[] {
    return this.codeBlocks.filter(block => block.language === language);
  }
  
  /**
   * Finds directives by type
   * @param type Directive type to filter by
   * @returns Array of matching directives
   */
  public getDirectivesByType(type: string): Directive[] {
    return this.directives.filter(directive => directive.type === type);
  }
  
  /**
   * Creates a standalone HTML document from parsed markdown
   * @param result Parse result
   * @param options HTML generation options
   * @returns Complete HTML document
   */
  public createHtmlDocument(
    result: MarkdownParseResult,
    options: {
      title?: string;
      css?: string;
      includeMetadata?: boolean;
      includeToc?: boolean;
    } = {}
  ): string {
    const title = options.title || result.metadata.title || 'Markdown Document';
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    
    pre {
      background-color: #f6f8fa;
      padding: 1em;
      border-radius: 3px;
      overflow: auto;
    }
    
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1em;
      color: #666;
      margin-left: 0;
    }
    
    .kg-relationship {
      display: inline-flex;
      align-items: center;
      margin: 0.5em 0;
    }
    
    .kg-entity {
      background-color: #e6f3ff;
      padding: 0.2em 0.5em;
      border-radius: 3px;
      border: 1px solid #b3d9ff;
    }
    
    .kg-relationship-type {
      margin: 0 0.5em;
      font-style: italic;
      color: #666;
    }
    
    .kg-property {
      display: flex;
      align-items: center;
      margin: 0.5em 0;
    }
    
    .kg-property-name {
      margin: 0 0.5em;
      font-style: italic;
      color: #666;
    }
    
    .kg-property-value {
      font-weight: bold;
    }
    
    .annotation {
      border-bottom: 1px dashed #999;
      position: relative;
      cursor: help;
    }
    
    .annotation:hover::after {
      content: attr(data-annotation);
      position: absolute;
      bottom: 100%;
      left: 0;
      background-color: #333;
      color: #fff;
      padding: 0.5em;
      border-radius: 3px;
      white-space: nowrap;
      z-index: 1;
      font-size: 0.9em;
    }
    
    mark {
      background-color: #ffffd0;
      padding: 0.1em 0.2em;
      border-radius: 2px;
    }
    
    .toc {
      background-color: #f9f9f9;
      padding: 1em;
      border-radius: 3px;
    }
    
    .toc li {
      margin-bottom: 0.5em;
    }
    
    .toc-sub {
      margin-top: 0.5em;
    }
    
    .code-block-wrapper {
      display: flex;
      background-color: #f6f8fa;
      border-radius: 3px;
      overflow: auto;
    }
    
    .line-numbers {
      padding: 1em 0.5em;
      text-align: right;
      color: #999;
      border-right: 1px solid #ddd;
      user-select: none;
    }
    
    .line {
      display: block;
    }
    
    ${options.css || ''}
  </style>
</head>
<body>`;

    // Add metadata if requested
    if (options.includeMetadata && Object.keys(result.metadata).length > 0) {
      html += '<div class="metadata">';
      
      Object.entries(result.metadata).forEach(([key, value]) => {
        if (key === 'title') {
          return; // Skip title as it's already in the page title
        }
        
        html += `<div class="metadata-item">
          <span class="metadata-key">${key}:</span>
          <span class="metadata-value">${
            Array.isArray(value) ? value.join(', ') : value
          }</span>
        </div>`;
      });
      
      html += '</div>';
    }
    
    // Add TOC if requested
    if (options.includeToc && result.toc.length > 0) {
      html += '<h2>Table of Contents</h2>';
      html += this.renderToc(result.toc);
    }
    
    // Add main content
    html += result.html;
    
    // Close HTML
    html += `
</body>
</html>`;

    return html;
  }
}

/**
 * Parses a markdown string and returns HTML
 * @param markdown Markdown content
 * @param options Parser options
 * @returns HTML string
 */
export function parseMarkdown(
  markdown: string,
  options: MarkdownParserOptions = {}
): string {
  const parser = new MarkdownParser(options);
  const result = parser.parse(markdown);
  return result.html;
}

/**
 * Extracts metadata from markdown
 * @param markdown Markdown content
 * @returns Extracted metadata
 */
export function extractMetadata(markdown: string): MarkdownMetadata {
  const parser = new MarkdownParser({ extractMetadata: true });
  const result = parser.parse(markdown);
  return result.metadata;
}

/**
 * Generates table of contents from markdown
 * @param markdown Markdown content
 * @param maxLevel Maximum heading level to include
 * @returns TOC items
 */
export function generateToc(markdown: string, maxLevel: number = 3): TocItem[] {
  const parser = new MarkdownParser({ 
    generateToc: true,
    maxTocLevel: maxLevel
  });
  const result = parser.parse(markdown);
  return result.toc;
}

/**
 * Extracts code blocks from markdown
 * @param markdown Markdown content
 * @returns Extracted code blocks
 */
export function extractCodeBlocks(markdown: string): CodeBlock[] {
  const parser = new MarkdownParser({ extractCodeBlocks: true });
  const result = parser.parse(markdown);
  return result.codeBlocks;
}

/**
 * Find all headings in markdown
 * @param markdown Markdown content
 * @returns Array of headings with level and text
 */
export function findHeadings(markdown: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?$/gm;
  
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const explicitId = match[3];
    
    // Generate ID if not explicitly provided
    const id = explicitId || text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    headings.push({ level, text, id });
  }
  
  return headings;
}

/**
 * Converts a markdown string to plain text
 * @param markdown Markdown content
 * @returns Plain text
 */
export function markdownToPlainText(markdown: string): string {
  // Remove frontmatter
  let content = markdown.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/, '');
  
  // Remove headers
  content = content.replace(/#{1,6}\s+(.+?)(?:\s+\{#([^}]+)\})?$/gm, '$1');
  
  // Remove emphasis markers
  content = content.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  content = content.replace(/(\*|_)(.*?)\1/g, '$2');    // Italic
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  content = content.replace(/`([^`]+)`/g, '$1');
  
  // Remove blockquotes
  content = content.replace(/^\s*>+\s*/gm, '');
  
  // Remove list markers
  content = content.replace(/^\s*[-*+]\s+/gm, '');
  content = content.replace(/^\s*\d+\.\s+/gm, '');
  
  // Remove images
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // Remove links
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove HTML tags
  content = content.replace(/<[^>]*>/g, '');
  
  // Remove KG syntax
  content = content.replace(/\[([^\]]+)\]-([^-\]]+)->?\[([^\]]+)\]/g, '$1 $2 $3');
  content = content.replace(/==([^=]+)==/g, '$1');
  content = content.replace(/\(\(([^:]+):([^)]+)\)\)/g, '$1');
  
  // Remove extra whitespace
  content = content.replace(/\n\s*\n/g, '\n\n');
  content = content.trim();
  
  return content;
}

/**
 * Creates a slide content structure from markdown
 * @param markdown Markdown content
 * @returns Structured slide content
 */
export function markdownToSlideContent(markdown: string): {
  title?: string;
  subtitle?: string;
  content: string;
  notes?: string;
  directives: Directive[];
} {
  // Extract notes
  const notesRegex = /<!-- Speaker Notes:\s*\n([\s\S]*?)\n-->/;
  const notesMatch = markdown.match(notesRegex);
  const notes = notesMatch ? notesMatch[1].trim() : undefined;
  
  // Remove notes from content
  let content = markdown.replace(notesRegex, '');
  
  // Extract metadata
  const metadata = extractMetadata(content);
  
  // Remove frontmatter from content
  content = content.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/, '');
  
  // Find heading
  const headings = findHeadings(content);
  const title = headings.length > 0 ? headings[0].text : metadata.title;
  
  // Find subtitle (second heading or from metadata)
  const subtitle = headings.length > 1 ? headings[1].text : metadata.subtitle;
  
  // Extract directives
  const parser = new MarkdownParser({ extractDirectives: true });
  const result = parser.parse(content);
  
  return {
    title,
    subtitle,
    content: result.html,
    notes,
    directives: result.directives
  };
}