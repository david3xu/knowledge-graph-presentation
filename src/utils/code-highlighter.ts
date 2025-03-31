/**
 * Code Highlighting Utility
 * Provides functionality for syntax highlighting of code snippets in presentations
 */

/**
 * Options for syntax highlighting
 */
export interface SyntaxHighlightOptions {
    /** Language identifier for syntax highlighting */
    language: string;
    
    /** Whether to include line numbers */
    lineNumbers?: boolean;
    
    /** Array of line numbers to highlight */
    highlightLines?: number[];
    
    /** Theme to use for highlighting */
    theme?: 'light' | 'dark' | 'high-contrast';
    
    /** Optional CSS class to add to the container */
    containerClass?: string;
    
    /** Font size (in pixels) for the code */
    fontSize?: number;
    
    /** Whether to wrap long lines */
    wrapLines?: boolean;
  }
  
  /**
   * Default options for syntax highlighting
   */
  const DEFAULT_OPTIONS: SyntaxHighlightOptions = {
    language: 'plain',
    lineNumbers: true,
    highlightLines: [],
    theme: 'dark',
    fontSize: 14,
    wrapLines: false
  };
  
  /**
   * Language aliases mapping
   */
  const LANGUAGE_ALIASES: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'sh': 'bash',
    'shell': 'bash',
    'c++': 'cpp',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'cypher': 'cypher',
    'sparql': 'sparql',
    'sql': 'sql',
    'java': 'java',
    'go': 'go',
    'rust': 'rust',
    'yaml': 'yaml',
    'xml': 'xml',
    'graphql': 'graphql'
  };
  
  /**
   * Theme color definitions
   */
  const THEMES = {
    'light': {
      background: '#f8f8f8',
      text: '#333333',
      comment: '#6a737d',
      keyword: '#d73a49',
      string: '#032f62',
      number: '#005cc5',
      function: '#6f42c1',
      operator: '#d73a49',
      variable: '#24292e',
      property: '#005cc5',
      lineNumber: '#6a737d',
      highlightBackground: '#fffbdd'
    },
    'dark': {
      background: '#282c34',
      text: '#abb2bf',
      comment: '#5c6370',
      keyword: '#c678dd',
      string: '#98c379',
      number: '#d19a66',
      function: '#61afef',
      operator: '#56b6c2',
      variable: '#e06c75',
      property: '#e5c07b',
      lineNumber: '#636d83',
      highlightBackground: '#2c313c'
    },
    'high-contrast': {
      background: '#000000',
      text: '#ffffff',
      comment: '#7f7f7f',
      keyword: '#ff8080',
      string: '#80ff80',
      number: '#8080ff',
      function: '#ffff80',
      operator: '#ff80ff',
      variable: '#80ffff',
      property: '#ffaa00',
      lineNumber: '#7f7f7f',
      highlightBackground: '#3a3a3a'
    }
  };
  
  /**
   * Token type definition
   */
  interface Token {
    type: string;
    content: string;
    line: number;
  }
  
  /**
   * Creates an HTML element with syntax highlighted code
   * @param code Code to highlight
   * @param options Highlighting options
   * @returns HTML element containing the highlighted code
   */
  export function highlightCode(code: string, options: Partial<SyntaxHighlightOptions> = {}): HTMLElement {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const language = normalizeLanguage(mergedOptions.language);
    const theme = THEMES[mergedOptions.theme || 'dark'];
    
    // Tokenize the code
    const tokens = tokenize(code, language);
    
    // Create the container element
    const container = document.createElement('div');
    container.className = `code-container ${mergedOptions.containerClass || ''}`;
    container.style.backgroundColor = theme.background;
    container.style.color = theme.text;
    container.style.fontFamily = '"Fira Code", Consolas, Monaco, "Andale Mono", monospace';
    container.style.fontSize = `${mergedOptions.fontSize}px`;
    container.style.lineHeight = '1.5';
    container.style.overflow = 'auto';
    container.style.padding = '16px';
    container.style.borderRadius = '4px';
    
    // Create the code element
    const pre = document.createElement('pre');
    pre.style.margin = '0';
    pre.style.overflow = mergedOptions.wrapLines ? 'auto' : 'auto hidden';
    pre.style.whiteSpace = mergedOptions.wrapLines ? 'pre-wrap' : 'pre';
    
    const codeElement = document.createElement('code');
    codeElement.className = `language-${language}`;
    pre.appendChild(codeElement);
    
    // Split the code into lines
    const lines = code.split('\n');
    
    // Create the line number gutter if needed
    let lineNumbersContainer: HTMLDivElement | null = null;
    
    if (mergedOptions.lineNumbers) {
      lineNumbersContainer = document.createElement('div');
      lineNumbersContainer.className = 'line-numbers';
      lineNumbersContainer.style.float = 'left';
      lineNumbersContainer.style.textAlign = 'right';
      lineNumbersContainer.style.paddingRight = '12px';
      lineNumbersContainer.style.userSelect = 'none';
      lineNumbersContainer.style.color = theme.lineNumber;
      lineNumbersContainer.style.borderRight = `1px solid ${theme.lineNumber}`;
      lineNumbersContainer.style.marginRight = '12px';
      
      // Add line numbers
      for (let i = 1; i <= lines.length; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = String(i);
        lineNumber.style.height = '1.5em';
        lineNumbersContainer.appendChild(lineNumber);
      }
      
      container.appendChild(lineNumbersContainer);
    }
    
    // Process the tokens and create highlighted content
    // let currentLine = 1;
    
    // Group tokens by line
    const tokensByLine: Record<number, Token[]> = {};
    
    tokens.forEach(token => {
      if (!tokensByLine[token.line]) {
        tokensByLine[token.line] = [];
      }
      tokensByLine[token.line].push(token);
    });
    
    // Create line elements
    for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
      const lineElement = document.createElement('div');
      lineElement.style.height = '1.5em';
      
      // Highlight the line if needed
      if (mergedOptions.highlightLines?.includes(lineNumber)) {
        lineElement.style.backgroundColor = theme.highlightBackground;
        lineElement.style.width = '100%';
      }
      
      // Add tokens for this line
      const lineTokens = tokensByLine[lineNumber] || [];
      
      if (lineTokens.length === 0) {
        // Empty line
        lineElement.innerHTML = '&nbsp;';
      } else {
        // Process tokens
        lineTokens.forEach(token => {
          const span = document.createElement('span');
          span.textContent = token.content;
          
          // Apply styling based on token type
          switch (token.type) {
            case 'comment':
              span.style.color = theme.comment;
              break;
            case 'keyword':
              span.style.color = theme.keyword;
              span.style.fontWeight = 'bold';
              break;
            case 'string':
              span.style.color = theme.string;
              break;
            case 'number':
              span.style.color = theme.number;
              break;
            case 'function':
              span.style.color = theme.function;
              break;
            case 'operator':
              span.style.color = theme.operator;
              break;
            case 'variable':
              span.style.color = theme.variable;
              break;
            case 'property':
              span.style.color = theme.property;
              break;
            default:
              // Use default text color
              break;
          }
          
          lineElement.appendChild(span);
        });
      }
      
      codeElement.appendChild(lineElement);
    }
    
    container.appendChild(pre);
    return container;
  }
  
  /**
   * Normalizes language identifier
   * @param language Language identifier
   * @returns Normalized language identifier
   */
  function normalizeLanguage(language: string): string {
    return LANGUAGE_ALIASES[language.toLowerCase()] || language.toLowerCase();
  }
  
  /**
   * Simple tokenizer for code syntax highlighting
   * Note: In a production environment, this would be replaced by a more robust
   * tokenizer library like Prism.js or highlight.js
   * @param code Code to tokenize
   * @param language Language identifier
   * @returns Array of tokens
   */
  function tokenize(code: string, language: string): Token[] {
    const tokens: Token[] = [];
    const lines = code.split('\n');
    
    // Define language-specific patterns
    // This is a simplified implementation - a real implementation would use
    // a more comprehensive set of patterns for each language
    const patterns: Record<string, Array<[RegExp, string]>> = {
      'default': [
        [/\/\/.*$/gm, 'comment'],
        [/\/\*[\s\S]*?\*\//gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`)/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|new|typeof|instanceof|this|throw|const|let|var|class|extends|implements|import|export|from|async|await|yield|super|static|get|set|public|private|protected|in|of|do|delete)\b/gm, 'keyword'],
        [/\b[A-Za-z_$][\w$]*(?=\s*\()/gm, 'function'],
        [/\b[A-Za-z_$][\w$]*\b/gm, 'variable'],
        [/[{}[\]()]/gm, 'operator'],
        [/[&|^=<>!?:*/+-]+/gm, 'operator']
      ],
      'javascript': [
        [/\/\/.*$/gm, 'comment'],
        [/\/\*[\s\S]*?\*\//gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`)/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|new|typeof|instanceof|this|throw|const|let|var|class|extends|implements|import|export|from|async|await|yield|super|static|get|set)\b/gm, 'keyword'],
        [/\b[A-Za-z_$][\w$]*(?=\s*\()/gm, 'function'],
        [/\b[A-Za-z_$][\w$]*\b/gm, 'variable'],
        [/[{}[\]()]/gm, 'operator'],
        [/[&|^=<>!?:*/+-]+/gm, 'operator']
      ],
      'typescript': [
        [/\/\/.*$/gm, 'comment'],
        [/\/\*[\s\S]*?\*\//gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`)/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|new|typeof|instanceof|this|throw|const|let|var|class|extends|implements|import|export|from|async|await|yield|super|static|get|set|interface|type|enum|namespace|abstract|declare|readonly|private|protected|public|as|keyof|unknown|never|any|void|number|string|boolean|object|null|undefined|infer)\b/gm, 'keyword'],
        [/\b[A-Za-z_$][\w$]*(?=\s*\()/gm, 'function'],
        [/\b[A-Za-z_$][\w$]*\b/gm, 'variable'],
        [/[{}[\]()<>]/gm, 'operator'],
        [/[&|^=<>!?:*/+-]+/gm, 'operator']
      ],
      'python': [
        [/#.*$/gm, 'comment'],
        [/'''[\s\S]*?'''|"""[\s\S]*?"""/gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)\b/gm, 'keyword'],
        [/\b[A-Za-z_][\w]*(?=\s*\()/gm, 'function'],
        [/\b[A-Za-z_][\w]*\b/gm, 'variable'],
        [/[{}[\]()]/gm, 'operator'],
        [/[=!<>+\-*/%&|^~]+/gm, 'operator']
      ],
      'cypher': [
        [/\/\/.*$/gm, 'comment'],
        [/\/\*[\s\S]*?\*\//gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(MATCH|WHERE|RETURN|WITH|UNWIND|OPTIONAL|MATCH|CREATE|MERGE|DELETE|REMOVE|SET|SKIP|LIMIT|ORDER|BY|DESC|ASC|CALL|YIELD|DISTINCT|AS|UNION|ALL|LOAD|CSV|FROM|USING|PERIODIC|COMMIT|FOREACH|ON|WHEN|CASE|THEN|ELSE|END|DETACH|EXISTS|CONTAINS|STARTS|ENDS|AND|OR|NOT|XOR|IN|IS|NULL|CONSTRAINT|ASSERT|INDEX|UNIQUE|DROP)\b/gi, 'keyword'],
        [/(?<=:)[A-Za-z_][\w]*/gm, 'property'],
        [/\b[A-Za-z_][\w]*\b/gm, 'variable'],
        [/[{}[\]()]/gm, 'operator'],
        [/[=!<>+\-*/%&|^~]+/gm, 'operator'],
        [/-\[.*?]->/gm, 'operator']
      ],
      'sparql': [
        [/#.*$/gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(PREFIX|SELECT|CONSTRUCT|DESCRIBE|ASK|FROM|WHERE|ORDER|BY|LIMIT|OFFSET|FILTER|OPTIONAL|GRAPH|SERVICE|BIND|AS|GROUP|HAVING|VALUES|UNION|MINUS|EXISTS|NOT|INSERT|DELETE|DATA|WITH|USING|NAMED|CLEAR|DROP|CREATE|ADD|MOVE|COPY|SILENT|DEFAULT|DISTINCT|REDUCED|INTO|TO|BASE)\b/gi, 'keyword'],
        [/\?[A-Za-z][\w]*/gm, 'variable'],
        [/<[^>]*>/gm, 'string'],
        [/[{}[\]()]/gm, 'operator'],
        [/[=!<>+\-*/%&|^~]+/gm, 'operator']
      ],
      'sql': [
        [/--.*$/gm, 'comment'],
        [/\/\*[\s\S]*?\*\//gm, 'comment'],
        [/("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')/gm, 'string'],
        [/\b(\d+(?:\.\d+)?)\b/gm, 'number'],
        [/\b(SELECT|FROM|WHERE|AND|OR|NOT|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|AS|JOIN|INNER|OUTER|LEFT|RIGHT|FULL|ON|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|TABLE|VIEW|INDEX|CONSTRAINT|PRIMARY|KEY|FOREIGN|REFERENCES|CASCADE|CHECK|DEFAULT|NULL|IS|IN|BETWEEN|LIKE|ASC|DESC|CASE|WHEN|THEN|ELSE|END)\b/gi, 'keyword'],
        [/\b[A-Za-z_][\w]*(?=\s*\()/gm, 'function'],
        [/\b[A-Za-z_][\w]*\b/gm, 'variable'],
        [/[{}[\]()]/gm, 'operator'],
        [/[=!<>+\-*/%&|^~]+/gm, 'operator']
      ]
    };
    
    // Use the language-specific patterns or fall back to default
    const languagePatterns = patterns[language] || patterns['default'];
    
    // Process each line
    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      
      // If line is empty, add a placeholder token
      if (line.trim() === '') {
        tokens.push({
          type: 'text',
          content: '',
          line: lineNumber
        });
        return;
      }
      
      // Start with the entire line as a single text token
      let remainingText = line;
      let currentTokens: Token[] = [{
        type: 'text',
        content: remainingText,
        line: lineNumber
      }];
      
      // Apply each pattern to split and categorize the tokens
      languagePatterns.forEach(([pattern, tokenType]) => {
        const newTokens: Token[] = [];
        
        // Process each existing token
        currentTokens.forEach(token => {
          // Only process text tokens
          if (token.type !== 'text') {
            newTokens.push(token);
            return;
          }
          
          // Reset the pattern's lastIndex
          pattern.lastIndex = 0;
          let lastIndex = 0;
          let match;
          
          // Find all matches in this token
          while ((match = pattern.exec(token.content)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
              newTokens.push({
                type: 'text',
                content: token.content.substring(lastIndex, match.index),
                line: lineNumber
              });
            }
            
            // Add the matched token
            newTokens.push({
              type: tokenType,
              content: match[0],
              line: lineNumber
            });
            
            lastIndex = pattern.lastIndex;
          }
          
          // Add remaining text
          if (lastIndex < token.content.length) {
            newTokens.push({
              type: 'text',
              content: token.content.substring(lastIndex),
              line: lineNumber
            });
          }
        });
        
        // Update current tokens
        currentTokens = newTokens;
      });
      
      // Add processed tokens for this line
      tokens.push(...currentTokens);
    });
    
    return tokens;
  }
  
  /**
   * Highlights code and returns HTML as a string
   * @param code Code to highlight
   * @param options Highlighting options
   * @returns HTML string with highlighted code
   */
  export function highlightCodeToHtml(code: string, options: Partial<SyntaxHighlightOptions> = {}): string {
    const element = highlightCode(code, options);
    return element.outerHTML;
  }
  
  /**
   * Creates an SVG element with syntax highlighted code
   * @param code Code to highlight
   * @param options Highlighting options
   * @returns SVG element containing the highlighted code
   */
  export function highlightCodeToSvg(code: string, options: Partial<SyntaxHighlightOptions> = {}): SVGElement {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const language = normalizeLanguage(mergedOptions.language);
    const theme = THEMES[mergedOptions.theme || 'dark'];
    
    // Tokenize the code
    const tokens = tokenize(code, language);
    
    // Split the code into lines
    const lines = code.split('\n');
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    // Calculate dimensions
    const fontSize = (mergedOptions.fontSize ?? DEFAULT_OPTIONS.fontSize) as number;
    const lineHeight = fontSize * 1.5;
    const padding = 16;
    const width = calculateTextWidth(code, fontSize) + (padding * 2);
    const height = lines.length * lineHeight + (padding * 2);
    
    // Set SVG attributes
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Create background rectangle
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', String(width));
    background.setAttribute('height', String(height));
    background.setAttribute('fill', theme.background);
    background.setAttribute('rx', '4');
    background.setAttribute('ry', '4');
    svg.appendChild(background);
    
    // Create a group for the code
    const codeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    codeGroup.setAttribute('font-family', '"Fira Code", Consolas, Monaco, "Andale Mono", monospace');
    codeGroup.setAttribute('font-size', String(fontSize));
    codeGroup.setAttribute('fill', theme.text);
    
    // Group tokens by line
    const tokensByLine: Record<number, Token[]> = {};
    
    tokens.forEach(token => {
      if (!tokensByLine[token.line]) {
        tokensByLine[token.line] = [];
      }
      tokensByLine[token.line].push(token);
    });
    
    // Calculate line number width if needed
    let lineNumberWidth = 0;
    
    if (mergedOptions.lineNumbers) {
      lineNumberWidth = String(lines.length).length * fontSize * 0.6 + 16;
    }
    
    // Create line number background if needed
    if (mergedOptions.lineNumbers) {
      const lineNumberBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      lineNumberBg.setAttribute('x', String(padding));
      lineNumberBg.setAttribute('y', String(padding));
      lineNumberBg.setAttribute('width', String(lineNumberWidth));
      lineNumberBg.setAttribute('height', String(height - (padding * 2)));
      lineNumberBg.setAttribute('fill', theme.background);
      svg.appendChild(lineNumberBg);
      
      // Create line number divider
      const divider = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      divider.setAttribute('x1', String(padding + lineNumberWidth));
      divider.setAttribute('y1', String(padding));
      divider.setAttribute('x2', String(padding + lineNumberWidth));
      divider.setAttribute('y2', String(height - padding));
      divider.setAttribute('stroke', theme.lineNumber);
      divider.setAttribute('stroke-width', '1');
      svg.appendChild(divider);
    }
    
    // Create line background highlights if needed
    if (mergedOptions.highlightLines && mergedOptions.highlightLines.length > 0) {
      mergedOptions.highlightLines.forEach(lineNumber => {
        if (lineNumber > 0 && lineNumber <= lines.length) {
          const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          highlight.setAttribute('x', String(padding + lineNumberWidth));
          highlight.setAttribute('y', String(padding + (lineNumber - 1) * lineHeight));
          highlight.setAttribute('width', String(width - (padding * 2) - lineNumberWidth));
          highlight.setAttribute('height', String(lineHeight));
          highlight.setAttribute('fill', theme.highlightBackground);
          svg.appendChild(highlight);
        }
      });
    }
    
    // Add line numbers if needed
    if (mergedOptions.lineNumbers) {
      for (let i = 1; i <= lines.length; i++) {
        const lineNumber = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        lineNumber.setAttribute('x', String(padding + lineNumberWidth - 8));
        lineNumber.setAttribute('y', String(padding + (i - 0.3) * lineHeight));
        lineNumber.setAttribute('fill', theme.lineNumber);
        lineNumber.setAttribute('text-anchor', 'end');
        lineNumber.textContent = String(i);
        svg.appendChild(lineNumber);
      }
    }
    
    // Add code tokens
    let xPos = padding + lineNumberWidth + 8;
    let yPos = padding;
    
    for (let lineNumber = 1; lineNumber <= lines.length; lineNumber++) {
      // Reset x position for each line
      xPos = padding + lineNumberWidth + 8;
      yPos = padding + (lineNumber - 0.3) * lineHeight;
      
      // Add tokens for this line
      const lineTokens = tokensByLine[lineNumber] || [];
      
      lineTokens.forEach(token => {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', String(xPos));
        textElement.setAttribute('y', String(yPos));
        
        // Apply styling based on token type
        switch (token.type) {
          case 'comment':
            textElement.setAttribute('fill', theme.comment);
            break;
          case 'keyword':
            textElement.setAttribute('fill', theme.keyword);
            textElement.setAttribute('font-weight', 'bold');
            break;
          case 'string':
            textElement.setAttribute('fill', theme.string);
            break;
          case 'number':
            textElement.setAttribute('fill', theme.number);
            break;
          case 'function':
            textElement.setAttribute('fill', theme.function);
            break;
          case 'operator':
            textElement.setAttribute('fill', theme.operator);
            break;
          case 'variable':
            textElement.setAttribute('fill', theme.variable);
            break;
          case 'property':
            textElement.setAttribute('fill', theme.property);
            break;
          default:
            // Use default text color
            break;
        }
        
        // Add the text content
        textElement.textContent = token.content;
        svg.appendChild(textElement);
        
        // Update x position
        xPos += calculateTextWidth(token.content, fontSize);
      });
    }
    
    svg.appendChild(codeGroup);
    return svg;
  }
  
  /**
   * Calculates approximate width of text
   * @param text Text to measure
   * @param fontSize Font size in pixels
   * @returns Approximate width of text in pixels
   */
  function calculateTextWidth(text: string, fontSize: number): number {
    // Simple approximation - in a real implementation, this would use canvas measurement
    const averageCharWidth = fontSize * 0.6;
    
    // Calculate max line width
    const lines = text.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length));
    
    return maxLineLength * averageCharWidth;
  }
  
  /**
   * Initializes syntax highlighting for all code blocks in a container
   * @param container Container element
   * @param options Default options for all code blocks
   */
  export function initializeCodeHighlighting(container: HTMLElement, options: Partial<SyntaxHighlightOptions> = {}): void {
    // Find all pre > code elements
    const codeBlocks = container.querySelectorAll('pre > code');
    
    codeBlocks.forEach(codeBlock => {
      // Get language from class name
      const classNames = Array.from(codeBlock.classList);
      const languageClass = classNames.find(cls => cls.startsWith('language-'));
      const language = languageClass ? languageClass.replace('language-', '') : '';
      
      // Get code content
      const code = codeBlock.textContent || '';
      
      // Create options for this block
      const blockOptions: Partial<SyntaxHighlightOptions> = {
        ...options,
        language
      };
      
      // Create highlighted element
      const highlightedElement = highlightCode(code, blockOptions);
      
      // Replace the original element
      const preElement = codeBlock.parentElement;
      if (preElement && preElement.parentElement) {
        preElement.parentElement.replaceChild(highlightedElement, preElement);
      }
    });
  }