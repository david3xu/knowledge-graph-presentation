/**
 * Code Block Visualization
 * Renders formatted code snippets with syntax highlighting, line numbers,
 * and highlighted lines for presentations
 */
import * as d3 from 'd3';
import { BaseVisualizationConfig } from '../types/chart-config';

/**
 * Configuration options for code block visualization
 */
export interface CodeBlockOptions extends BaseVisualizationConfig {
  /** Code content to display */
  code: string;
  
  /** Programming language for syntax highlighting */
  language: string;
  
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  
  /** Array of line numbers to highlight */
  highlightLines?: number[];
  
  /** Theme for code styling (dark/light) */
  theme?: 'dark' | 'light';
  
  /** Font size in pixels */
  fontSize?: number;
  
  /** Font family for code */
  fontFamily?: string;
  
  /** Maximum height for the code block with scrolling */
  maxHeight?: number;
  
  /** Padding inside the code block */
  padding?: number;
  
  /** Whether to enable copying code to clipboard */
  enableCopy?: boolean;
  
  /** Whether to automatically wrap long lines */
  wrapLines?: boolean;
  
  /** Tab size in spaces */
  tabSize?: number;
  
  /** Whether to use CSS-based highlighting (fallback mode) */
  useCssHighlighting?: boolean;
  
  /** Custom line number formatting function */
  lineNumberFormatter?: (lineNumber: number) => string;
  
  /** Function to run after code block is rendered */
  onRender?: (codeBlockElement: HTMLElement) => void;
  
  /** Annotations to add to specific lines */
  annotations?: Array<{
    /** Line number for the annotation */
    line: number;
    /** Annotation text */
    text: string;
    /** Annotation color */
    color?: string;
  }>;
  
  /** Line highlight style */
  highlightStyle?: {
    /** Background color for highlighted lines */
    backgroundColor?: string;
    /** Border color for highlighted lines */
    borderColor?: string;
    /** Border width for highlighted lines */
    borderWidth?: number;
    /** Border style for highlighted lines */
    borderStyle?: string;
  };
  
  /** Style for the code container */
  containerStyle?: {
    /** Border radius */
    borderRadius?: number;
    /** Border color */
    borderColor?: string;
    /** Border width */
    borderWidth?: number;
    /** Border style */
    borderStyle?: string;
    /** Box shadow */
    boxShadow?: string;
  };
}

/**
 * Language-specific syntax highlighting rules
 */
interface SyntaxRules {
  /** Regular expressions for keyword matching */
  keywords: RegExp[];
  /** Regular expressions for string literal matching */
  strings: RegExp[];
  /** Regular expressions for number literal matching */
  numbers: RegExp[];
  /** Regular expressions for comment matching */
  comments: RegExp[];
  /** Regular expressions for function name matching */
  functions: RegExp[];
  /** Regular expressions for class name matching */
  classes: RegExp[];
  /** Regular expressions for variable name matching */
  variables: RegExp[];
  /** Regular expressions for operator matching */
  operators: RegExp[];
  /** Regular expressions for special token matching */
  special: RegExp[];
}

/**
 * CSS classes for syntax highlighting
 */
interface SyntaxClasses {
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  class: string;
  variable: string;
  operator: string;
  special: string;
}

/**
 * Code Block visualization for displaying formatted source code with syntax highlighting
 */
export class CodeBlockVisualization {
  private container: HTMLElement;
  private codeElement: HTMLElement | null = null;
  private options: CodeBlockOptions;
  private width: number;
  private height: number;
  private syntaxRules: Record<string, SyntaxRules>;
  private currentTheme: 'dark' | 'light';
  
  // Syntax highlighting classes
  private readonly SYNTAX_CLASSES: SyntaxClasses = {
    keyword: 'code-keyword',
    string: 'code-string',
    number: 'code-number',
    comment: 'code-comment',
    function: 'code-function',
    class: 'code-class',
    variable: 'code-variable',
    operator: 'code-operator',
    special: 'code-special'
  };
  
  // Color schemes for syntax highlighting
  private readonly COLOR_SCHEMES = {
    dark: {
      background: '#282c34',
      text: '#abb2bf',
      keywords: '#c678dd',
      strings: '#98c379',
      numbers: '#d19a66',
      comments: '#5c6370',
      functions: '#61afef',
      classes: '#e6c07b',
      variables: '#abb2bf',
      operators: '#56b6c2',
      special: '#e06c75',
      lineNumbers: '#636d83',
      lineHighlight: 'rgba(124, 156, 191, 0.2)',
      selectionBackground: 'rgba(140, 170, 210, 0.28)'
    },
    light: {
      background: '#f8f8f8',
      text: '#383a42',
      keywords: '#a626a4',
      strings: '#50a14f',
      numbers: '#986801',
      comments: '#9ca0a4',
      functions: '#4078f2',
      classes: '#c18401',
      variables: '#383a42',
      operators: '#0184bc',
      special: '#e45649',
      lineNumbers: '#9d9d9f',
      lineHighlight: 'rgba(200, 200, 220, 0.4)',
      selectionBackground: 'rgba(140, 140, 180, 0.1)'
    }
  };
  
  /**
   * Creates a new code block visualization
   * @param options Code block configuration options
   */
  constructor(options: CodeBlockOptions) {
    this.container = options.container;
    this.width = options.width || this.container.clientWidth || 600;
    this.height = options.height || this.container.clientHeight || 400;
    
    // Initialize syntax highlighting rules
    this.syntaxRules = this.initializeSyntaxRules();
    
    // Apply default options
    this.options = this.applyDefaultOptions(options);
    this.currentTheme = this.options.theme || 'dark';
    
    // Create the code block
    this.initializeCodeBlock();
    
    // Add window resize handler
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  private handleResize(): void {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.initializeCodeBlock();
  }
  
  private getThemeColor(key: keyof typeof this.COLOR_SCHEMES.dark): string {
    return this.COLOR_SCHEMES[this.currentTheme][key];
  }
  
  private handleCopyClick(): void {
    if (this.codeElement) {
      navigator.clipboard.writeText(this.options.code);
      const button = event?.target as HTMLButtonElement;
      if (button) {
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 2000);
      }
    }
  }
  
  private addSyntaxHighlightingStyles(): void {
    const styleId = 'code-block-syntax-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .code-keyword { color: ${this.getThemeColor('keywords')}; }
        .code-string { color: ${this.getThemeColor('strings')}; }
        .code-number { color: ${this.getThemeColor('numbers')}; }
        .code-comment { color: ${this.getThemeColor('comments')}; }
        .code-function { color: ${this.getThemeColor('functions')}; }
        .code-class { color: ${this.getThemeColor('classes')}; }
        .code-variable { color: ${this.getThemeColor('variables')}; }
        .code-operator { color: ${this.getThemeColor('operators')}; }
        .code-special { color: ${this.getThemeColor('special')}; }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Apply default options to user-provided configuration
   * @param options User options
   * @returns Merged options with defaults
   */
  private applyDefaultOptions(options: CodeBlockOptions): CodeBlockOptions {
    return {
      ...options,
      showLineNumbers: options.showLineNumbers !== false,
      highlightLines: options.highlightLines || [],
      theme: options.theme || 'dark',
      fontSize: options.fontSize || 14,
      fontFamily: options.fontFamily || 'Menlo, Monaco, Consolas, "Courier New", monospace',
      maxHeight: options.maxHeight || 500,
      padding: options.padding !== undefined ? options.padding : 16,
      enableCopy: options.enableCopy !== false,
      wrapLines: options.wrapLines || false,
      tabSize: options.tabSize || 2,
      useCssHighlighting: options.useCssHighlighting !== false,
      highlightStyle: {
        backgroundColor: options.highlightStyle?.backgroundColor || 
          (options.theme === 'dark' ? 'rgba(124, 156, 191, 0.2)' : 'rgba(200, 200, 220, 0.4)'),
        borderColor: options.highlightStyle?.borderColor || 'transparent',
        borderWidth: options.highlightStyle?.borderWidth || 0,
        borderStyle: options.highlightStyle?.borderStyle || 'solid',
        ...options.highlightStyle
      },
      containerStyle: {
        borderRadius: options.containerStyle?.borderRadius || 6,
        borderColor: options.containerStyle?.borderColor || 'transparent',
        borderWidth: options.containerStyle?.borderWidth || 0,
        borderStyle: options.containerStyle?.borderStyle || 'solid',
        boxShadow: options.containerStyle?.boxShadow || '0 2px 10px rgba(0, 0, 0, 0.1)',
        ...options.containerStyle
      }
    };
  }
  
  /**
   * Initialize the code block container and content
   */
  private initializeCodeBlock(): void {
    // Clear container
    this.container.innerHTML = '';
    
    // Create code block container
    const codeContainer = document.createElement('div');
    codeContainer.className = 'code-block-container';
    codeContainer.style.position = 'relative';
    codeContainer.style.width = '100%';
    codeContainer.style.maxHeight = `${this.options.maxHeight}px`;
    codeContainer.style.overflow = 'auto';
    codeContainer.style.backgroundColor = this.getThemeColor('background');
    codeContainer.style.color = this.getThemeColor('text');
    codeContainer.style.borderRadius = `${this.options.containerStyle?.borderRadius}px`;
    codeContainer.style.border = `${this.options.containerStyle?.borderWidth}px ${this.options.containerStyle?.borderStyle} ${this.options.containerStyle?.borderColor}`;
    codeContainer.style.boxShadow = this.options.containerStyle?.boxShadow || '';
    
    // Add copy button if enabled
    if (this.options.enableCopy) {
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-button';
      copyButton.textContent = 'Copy';
      copyButton.style.position = 'absolute';
      copyButton.style.top = '10px';
      copyButton.style.right = '10px';
      copyButton.style.backgroundColor = this.currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      copyButton.style.color = this.getThemeColor('text');
      copyButton.style.border = 'none';
      copyButton.style.borderRadius = '4px';
      copyButton.style.padding = '5px 10px';
      copyButton.style.fontSize = '12px';
      copyButton.style.cursor = 'pointer';
      copyButton.style.transition = 'background-color 0.2s';
      
      copyButton.addEventListener('mouseenter', () => {
        copyButton.style.backgroundColor = this.currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
      });
      
      copyButton.addEventListener('mouseleave', () => {
        copyButton.style.backgroundColor = this.currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      });
      
      copyButton.addEventListener('click', this.handleCopyClick.bind(this));
      
      codeContainer.appendChild(copyButton);
    }
    
    // Create pre and code elements
    const preElement = document.createElement('pre');
    preElement.style.margin = '0';
    preElement.style.padding = `${this.options.padding}px`;
    preElement.style.overflow = 'visible';
    preElement.style.backgroundColor = 'transparent';
    
    this.codeElement = document.createElement('code');
    this.codeElement.className = `language-${this.options.language}`;
    this.codeElement.style.fontFamily = this.options.fontFamily!;
    this.codeElement.style.fontSize = `${this.options.fontSize}px`;
    this.codeElement.style.tabSize = `${this.options.tabSize}`;
    this.codeElement.style.whiteSpace = this.options.wrapLines ? 'pre-wrap' : 'pre';
    this.codeElement.style.display = 'flex';
    
    // Create line numbers container if enabled
    if (this.options.showLineNumbers) {
      const lineNumbersElement = document.createElement('div');
      lineNumbersElement.className = 'line-numbers';
      lineNumbersElement.style.userSelect = 'none';
      lineNumbersElement.style.textAlign = 'right';
      lineNumbersElement.style.paddingRight = '15px';
      lineNumbersElement.style.color = this.getThemeColor('lineNumbers');
      lineNumbersElement.style.borderRight = `1px solid ${this.getThemeColor('lineNumbers')}`;
      lineNumbersElement.style.marginRight = '15px';
      
      // Add line numbers
      const lines = this.options.code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.style.height = '1.5em';
        
        // Use custom formatter if provided
        if (this.options.lineNumberFormatter) {
          lineNumber.textContent = this.options.lineNumberFormatter(i + 1);
        } else {
          lineNumber.textContent = (i + 1).toString();
        }
        
        lineNumbersElement.appendChild(lineNumber);
      }
      
      preElement.style.display = 'flex';
      preElement.appendChild(lineNumbersElement);
    }
    
    // Create code content
    const codeContentElement = document.createElement('div');
    codeContentElement.className = 'code-content';
    codeContentElement.style.flex = '1';
    
    // Process code content with syntax highlighting
    const processedCode = this.formatCode(this.options.code, this.options.language);
    codeContentElement.innerHTML = processedCode;
    
    // Set up line highlighting
    if (this.options.highlightLines && this.options.highlightLines.length > 0) {
      const lines = codeContentElement.querySelectorAll('.code-line');
      this.options.highlightLines.forEach(lineNumber => {
        if (lineNumber > 0 && lineNumber <= lines.length) {
          const line = lines[lineNumber - 1] as HTMLElement;
          line.style.backgroundColor = this.options.highlightStyle?.backgroundColor || this.getThemeColor('lineHighlight');
          line.style.display = 'block';
          line.style.width = '100%';
          
          if (this.options.highlightStyle?.borderWidth && this.options.highlightStyle.borderWidth > 0) {
            line.style.borderLeft = `${this.options.highlightStyle.borderWidth}px ${this.options.highlightStyle.borderStyle} ${this.options.highlightStyle.borderColor}`;
          }
        }
      });
    }
    
    // Add annotations if specified
    if (this.options.annotations && this.options.annotations.length > 0) {
      const lines = codeContentElement.querySelectorAll('.code-line');
      this.options.annotations.forEach(annotation => {
        if (annotation.line > 0 && annotation.line <= lines.length) {
          const line = lines[annotation.line - 1] as HTMLElement;
          
          // Create annotation element
          const annotationElement = document.createElement('div');
          annotationElement.className = 'code-annotation';
          annotationElement.textContent = annotation.text;
          annotationElement.style.fontSize = '12px';
          annotationElement.style.padding = '2px 8px';
          annotationElement.style.backgroundColor = annotation.color || 
            (this.currentTheme === 'dark' ? 'rgba(97, 175, 239, 0.2)' : 'rgba(64, 120, 242, 0.1)');
          annotationElement.style.borderRadius = '3px';
          annotationElement.style.marginTop = '3px';
          annotationElement.style.display = 'inline-block';
          
          // Add annotation after the line
          line.appendChild(annotationElement);
        }
      });
    }
    
    // Add the code content to the code element
    this.codeElement.appendChild(codeContentElement);
    preElement.appendChild(this.codeElement);
    codeContainer.appendChild(preElement);
    
    // Append to container
    this.container.appendChild(codeContainer);
    
    // Add appropriate CSS to the document if it doesn't exist
    this.addSyntaxHighlightingStyles();
    
    // Call onRender callback if provided
    if (this.options.onRender) {
      this.options.onRender(codeContainer);
    }
  }
  
  /**
   * Format code with syntax highlighting
   * @param code Raw code string
   * @param language Programming language
   * @returns HTML string with syntax highlighting
   */
  private formatCode(code: string, language: string): string {
    const lines = code.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Apply syntax highlighting
      const highlightedLine = this.applySyntaxHighlighting(line, language);
      
      // Wrap in div for line highlighting
      return `<div class="code-line" data-line-number="${index + 1}">${highlightedLine}</div>`;
    });
    
    return formattedLines.join('');
  }
  
  /**
   * Apply syntax highlighting to a line of code
   * @param line Single line of code
   * @param language Programming language
   * @returns HTML string with syntax highlighting
   */
  private applySyntaxHighlighting(line: string, language: string): string {
    // If the language isn't supported, return plain text
    if (!this.syntaxRules[language]) {
      // Escape HTML entities
      return this.escapeHtml(line);
    }
    
    // Get rules for the language
    const rules = this.syntaxRules[language];
    
    // Special handling for comments (they take precedence)
    for (const commentRegex of rules.comments) {
      const match = line.match(commentRegex);
      if (match && match.index !== undefined) {
        // Comment starts at a specific index
        if (match.index > 0) {
          // Process code before the comment
          const beforeComment = line.substring(0, match.index);
          const highlightedBefore = this.applySyntaxHighlightingWithoutComments(beforeComment, language);
          
          // Process the comment itself
          const comment = line.substring(match.index);
          const escapedComment = this.escapeHtml(comment);
          
          return highlightedBefore + 
            `<span class="${this.SYNTAX_CLASSES.comment}">${escapedComment}</span>`;
        } else {
          // The whole line is a comment
          return `<span class="${this.SYNTAX_CLASSES.comment}">${this.escapeHtml(line)}</span>`;
        }
      }
    }
    
    // If no comments found, process normally
    return this.applySyntaxHighlightingWithoutComments(line, language);
  }
  
  /**
   * Apply syntax highlighting to a line of code, excluding comment handling
   * @param line Single line of code
   * @param language Programming language
   * @returns HTML string with syntax highlighting
   */
  private applySyntaxHighlightingWithoutComments(line: string, language: string): string {
    if (!this.syntaxRules[language]) {
      return this.escapeHtml(line);
    }
    
    const rules = this.syntaxRules[language];
    let result = this.escapeHtml(line);
    
    // Apply syntax highlighting for each token type
    // Order matters - strings and comments should generally come before keywords
    
    // Strings
    for (const stringRegex of rules.strings) {
      result = result.replace(stringRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.string}">${match}</span>`
      );
    }
    
    // Keywords
    for (const keywordRegex of rules.keywords) {
      result = result.replace(keywordRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.keyword}">${match}</span>`
      );
    }
    
    // Numbers
    for (const numberRegex of rules.numbers) {
      result = result.replace(numberRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.number}">${match}</span>`
      );
    }
    
    // Functions
    for (const functionRegex of rules.functions) {
      result = result.replace(functionRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.function}">${match}</span>`
      );
    }
    
    // Classes
    for (const classRegex of rules.classes) {
      result = result.replace(classRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.class}">${match}</span>`
      );
    }
    
    // Variables
    for (const variableRegex of rules.variables) {
      result = result.replace(variableRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.variable}">${match}</span>`
      );
    }
    
    // Operators
    for (const operatorRegex of rules.operators) {
      result = result.replace(operatorRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.operator}">${match}</span>`
      );
    }
    
    // Special tokens
    for (const specialRegex of rules.special) {
      result = result.replace(specialRegex, match => 
        `<span class="${this.SYNTAX_CLASSES.special}">${match}</span>`
      );
    }
    
    return result;
  }
  
  /**
   * Escape HTML entities in a string
   * @param text Text to escape
   * @returns Escaped HTML string
   */
  private escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, char => htmlEntities[char]);
  }
  
  /**
   * Initialize syntax highlighting rules for supported languages
   * @returns Object mapping language identifiers to syntax rules
   */
  private initializeSyntaxRules(): Record<string, SyntaxRules> {
    // Define language-specific syntax highlighting rules
    return {
      typescript: {
        keywords: [
          /\b(abstract|as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g
        ],
        strings: [
          /"([^"\\]|\\.)*"/g,
          /'([^'\\]|\\.)*'/g,
          /`([^`\\]|\\.)*`/g
        ],
        numbers: [
          /\b-?\d+(\.\d+)?\b/g
        ],
        comments: [
          /\/\/.*$/gm,
          /\/\*[\s\S]*?\*\//g
        ],
        functions: [
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
        ],
        classes: [
          /\b([A-Z][a-zA-Z0-9_$]*)\b/g
        ],
        variables: [
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g
        ],
        operators: [
          /[+\-*/%=<>!&|^~?:]/g
        ],
        special: [
          /\b(type|namespace|readonly|keyof|never|undefined|any|string|number|boolean|symbol|object|unknown|void|bigint)\b/g
        ]
      },
      javascript: {
        keywords: [
          /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|new|null|return|super|switch|this|throw|true|try|typeof|var|void|while|with|let|yield|async|await)\b/g
        ],
        strings: [
          /"([^"\\]|\\.)*"/g,
          /'([^'\\]|\\.)*'/g,
          /`([^`\\]|\\.)*`/g
        ],
        numbers: [
          /\b-?\d+(\.\d+)?\b/g
        ],
        comments: [
          /\/\/.*$/gm,
          /\/\*[\s\S]*?\*\//g
        ],
        functions: [
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
        ],
        classes: [
          /\b([A-Z][a-zA-Z0-9_$]*)\b/g
        ],
        variables: [
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g
        ],
        operators: [
          /[+\-*/%=<>!&|^~?:]/g
        ],
        special: [
          /\b(document|window|Array|String|Object|Number|Boolean|Function|RegExp|Map|Set|Promise|XMLHttpRequest)\b/g
        ]
      },
      python: {
        keywords: [
          /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield|False|None|True)\b/g
        ],
        strings: [
          /"""[\s\S]*?"""/g,
          /'''[\s\S]*?'''/g,
          /"([^"\\]|\\.)*"/g,
          /'([^'\\]|\\.)*'/g,
          /r"([^"\\]|\\.)*"/g,
          /r'([^'\\]|\\.)*'/g,
          /f"([^"\\]|\\.)*"/g,
          /f'([^'\\]|\\.)*'/g
        ],
        numbers: [
          /\b-?\d+(\.\d+)?([eE][+-]?\d+)?\b/g
        ],
        comments: [
          /#.*$/gm
        ],
        functions: [
          /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
          /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g
        ],
        classes: [
          /\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g
        ],
        variables: [
          /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g
        ],
        operators: [
          /[+\-*/%=<>!&|^~@:]/g
        ],
        special: [
          /\b(self|cls|__init__|__name__|__file__|__main__)\b/g
        ]
      },
      java: {
        keywords: [
          /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null)\b/g
        ],
        strings: [
          /"([^"\\]|\\.)*"/g
        ],
        numbers: [
          /\b-?\d+(\.\d+)?([eE][+-]?\d+)?[fFdDlL]?\b/g
        ],
        comments: [
          /\/\/.*$/gm,
          /\/\*[\s\S]*?\*\//g
        ],
        functions: [
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
        ],
        classes: [
          /\b([A-Z][a-zA-Z0-9_$]*)\b/g
        ],
        variables: [
          /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g
        ],
        operators: [
          /[+\-*/%=<>!&|^~?:]/g
        ],
        special: [
          /\b(System|String|Object|Class|Exception|Integer|Double|Boolean)\b/g
        ]
      },
      html: {
        keywords: [
          /\b(html|head|body|div|span|a|img|button|form|input|label|select|option|textarea|script|style|link|meta|title)\b/g
        ],
        strings: [
          /"([^"\\]|\\.)*"/g,
          /'([^'\\]|\\.)*'/g
        ],
        numbers: [
          /\b-?\d+(\.\d+)?([eE][+-]?\d+)?[fFdDlL]?\b/g
        ],
        comments: [
          /<!--[\s\S]*?-->/g
        ],
        functions: [],
        classes: [
          /class=["']([^"']+)["']/g
        ],
        variables: [],
        operators: [],
        special: [
          /&[a-zA-Z0-9#]+;/g,
          /<[^>]*>/g
        ]
      },
      css: {
        keywords: [
          /\b(align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|border|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-shadow|box-sizing|caption-side|clear|clip|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|font|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|grid|grid-area|grid-auto-columns|grid-auto-flow|grid-auto-rows|grid-column|grid-column-end|grid-column-gap|grid-column-start|grid-gap|grid-row|grid-row-end|grid-row-gap|grid-row-start|grid-template|grid-template-areas|grid-template-columns|grid-template-rows|height|justify-content|left|letter-spacing|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-bottom|margin-left)\b/g
        ],
        strings: [/"[^"]*"/g, /'[^']*'/g],
        numbers: [/\b\d+(\.\d+)?(px|em|rem|%|vh|vw)?\b/g],
        comments: [/\/\*[\s\S]*?\*\//g],
        functions: [/\b([a-zA-Z-]+)\s*\(/g],
        classes: [/\.([a-zA-Z-]+)/g],
        variables: [/\$([a-zA-Z-]+)/g],
        operators: [/[+\-*/%=<>!&|^~?:]/g],
        special: [/@[a-zA-Z-]+/g]
      }
    };
  }
}