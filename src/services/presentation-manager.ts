/**
 * PresentationManager service
 * Manages the lifecycle of presentations including loading, rendering, and exporting
 */
import html2pdf from 'html2pdf.js';
import { PresentationConfig, SlideGroup } from '../types/slide-data';
import { MarkdownLoader } from '../parser/markdown-loader';
import { MarkdownParser, markdownToSlideContent } from '../utils/markdown-parser';
import { EnhancedMarkdownParser } from '../parser/enhanced-markdown-parser';
import { MarkdownContentRegistry } from './markdown-content-registry';

/**
 * Options for loading a presentation
 */
export interface PresentationLoadOptions {
  /** Optional title override */
  title?: string;
  
  /** Optional presenter information */
  presenter?: {
    name: string;
    title?: string;
    organization?: string;
    email?: string;
  };
  
  /** Optional presentation settings */
  settings?: any;
  
  /** Whether to use the enhanced markdown parser */
  useEnhancedParser?: boolean;
  
  /** Optional content transformation options */
  transformOptions?: Record<string, any>;
}

/**
 * Export format options
 */
export enum ExportFormat {
  PDF = 'pdf',
  HTML = 'html',
  PNG = 'png'
}

/**
 * Export options
 */
export interface ExportOptions {
  /** Filename for the exported file (without extension) */
  filename?: string;
  
  /** Whether to include speaker notes in the export */
  includeNotes?: boolean;
  
  /** Whether to use print styles */
  usePrintStyles?: boolean;
  
  /** Page margin in inches (for PDF) */
  margin?: number | [number, number, number, number];
  
  /** Page orientation (for PDF) */
  orientation?: 'portrait' | 'landscape';
  
  /** PDF page size */
  pageSize?: 'letter' | 'legal' | 'tabloid' | 'a4' | 'a3';
}

/**
 * PresentationManager service
 * Manages the lifecycle of presentations including loading, rendering, and exporting
 */
export class PresentationManager {
  private loader: MarkdownLoader;
  private parser: MarkdownParser;
  private enhancedParser: EnhancedMarkdownParser;
  private contentRegistry: MarkdownContentRegistry;
  private slideGroups: SlideGroup[] = [];
  private presentationTitle: string = '';
  private presentationConfig: PresentationConfig | null = null;
  private slideManager: any; // Will be set by external code
  private isExporting: boolean = false;
  private exportCallback: ((success: boolean, error?: Error) => void) | null = null;
  
  /**
   * Creates a new PresentationManager instance
   */
  constructor() {
    this.loader = new MarkdownLoader();
    this.parser = new MarkdownParser();
    this.enhancedParser = new EnhancedMarkdownParser();
    this.contentRegistry = new MarkdownContentRegistry();
  }
  
  /**
   * Sets the SlideManager instance for rendering slides
   * @param slideManager The slide manager instance
   */
  public setSlideManager(slideManager: any): void {
    this.slideManager = slideManager;
  }
  
  /**
   * Gets the content registry
   * @returns The content registry instance
   */
  public getContentRegistry(): MarkdownContentRegistry {
    return this.contentRegistry;
  }
  
  /**
   * Loads a presentation from a markdown file
   * @param markdownPath Path to the markdown file to load
   * @param options Optional loading configuration
   * @returns Promise that resolves when presentation is loaded
   */
  public async loadPresentation(
    markdownPath: string, 
    options: PresentationLoadOptions = {}
  ): Promise<void> {
    try {
      // Load markdown content
      const markdown = await this.loader.loadMarkdown(markdownPath);
      
      // Process the markdown and create a content registry
      await this.processMarkdownContent(markdown, markdownPath, options);
      
      // Create presentation configuration
      const config: PresentationConfig = {
        title: this.presentationTitle,
        presenter: options.presenter || {
          name: '',
          title: '',
          organization: ''
        },
        slideGroups: this.slideGroups,
        settings: options.settings || {
          theme: 'black',
          defaultTransition: 'slide',
          showSlideNumber: 'all',
          controls: true,
          progress: true,
          center: true
        }
      };
      
      this.presentationConfig = config;
      
      // Load into slide manager if available
      if (this.slideManager && typeof this.slideManager.loadPresentation === 'function') {
        this.slideManager.loadPresentation(config);
      } else {
        console.warn('SlideManager not available, presentation loaded but not rendered');
      }
    } catch (error) {
      console.error('Failed to load presentation:', error);
      throw error;
    }
  }
  
  /**
   * Processes markdown content and populates the content registry
   * @param markdown Markdown content
   * @param sourcePath Source path for the markdown
   * @param options Processing options
   */
  private async processMarkdownContent(
    markdown: string,
    sourcePath: string,
    options: PresentationLoadOptions
  ): Promise<void> {
    // Determine whether to use the enhanced parser based on content format
    const useEnhanced = options.useEnhancedParser ?? this.detectEnhancedFormat(markdown);
    
    if (useEnhanced) {
      // Use enhanced parser for more structured markdown
      this.slideGroups = this.enhancedParser.parseToSlideGroups(markdown);
      
      // Set presentation title
      this.presentationTitle = options.title || this.extractTitle(markdown) || 'Presentation';
      
      // Register parsed content in the registry
      this.registerEnhancedContent(markdown, sourcePath);
    } else {
      // Use standard parser for simpler markdown
      const slideContent = markdownToSlideContent(markdown);
      this.slideGroups = [{
        id: 'group-1',
        title: slideContent.title || 'Untitled',
        slides: [{
          title: slideContent.title || 'Untitled',
          content: {
            text: slideContent.content
          },
          id: 'slide-1',
          visualizationType: 'none'
        }]
      }];
      
      // Set presentation title from content or options
      this.presentationTitle = options.title || slideContent.title || 'Presentation';
      
      // Register parsed content in the registry
      this.registerStandardContent([{
        title: slideContent.title || 'Untitled',
        content: slideContent.content,
        level: 1
      }], sourcePath);
    }
  }
  
  /**
   * Registers content from enhanced parser in the content registry
   * @param markdown Original markdown content
   * @param sourcePath Source path for identification
   */
  private registerEnhancedContent(markdown: string, sourcePath: string): void {
    // Extract sections from markdown
    const sections = markdown.split(/\n---\n/)
      .map(section => section.trim());
    
    // Register the full markdown content
    this.contentRegistry.registerContent('full-content', {
      sourcePath,
      content: markdown
    });
    
    // Register title slide content
    if (sections.length > 0) {
      const titleContent = sections[0];
      const title = this.extractTitle(titleContent);
      const subtitle = this.extractSubtitle(titleContent);
      
      this.contentRegistry.registerContent('intro-title', {
        title,
        subtitle,
        sourcePath
      });
    }
    
    // Register each section with an ID
    sections.forEach((section, index) => {
      const sectionTitle = this.extractSectionTitle(section);
      const sectionId = this.generateContentId(sectionTitle, index);
      
      // Register different content types in the registry
      this.contentRegistry.registerContent(sectionId, {
        title: sectionTitle,
        content: section,
        index,
        sourcePath
      });
      
      // Attempt to classify content to create specialized content entries
      this.classifyAndRegisterContent(section, sectionId, index);
    });
  }
  
  /**
   * Classifies content and registers specialized entries in the registry
   * @param content Section content
   * @param baseId Base content ID
   * @param index Section index
   */
  private classifyAndRegisterContent(content: string, baseId: string, index: number): void {
    // Check for definition content
    if (content.includes('**Definition:**') || content.toLowerCase().includes('what is a')) {
      this.contentRegistry.registerContent(`kg-definition${index > 1 ? '-' + index : ''}`, {
        mainDefinition: this.extractDefinition(content),
        title: this.extractSectionTitle(content),
        keyPoints: this.extractKeyPoints(content)
      });
    }
    
    // Check for architecture content
    if (content.toLowerCase().includes('architecture') || 
        content.toLowerCase().includes('layer') || 
        content.includes('┌─') && content.includes('─┐')) {
      this.contentRegistry.registerContent(`kg-architecture${index > 1 ? '-' + index : ''}`, {
        title: this.extractSectionTitle(content),
        description: this.extractFirstParagraph(content),
        layers: this.extractLayers(content)
      });
    }
    
    // Check for evolution/timeline content
    if (content.toLowerCase().includes('evolution') || 
        content.toLowerCase().includes('timeline') || 
        content.toLowerCase().includes('history')) {
      this.contentRegistry.registerContent(`kg-evolution${index > 1 ? '-' + index : ''}`, {
        title: this.extractSectionTitle(content),
        summary: this.extractFirstParagraph(content),
        timelineSections: this.extractTimelineSections(content)
      });
    }
    
    // Add more specialized content classification as needed
  }
  
  /**
   * Registers content from standard parser in the content registry
   * @param sections Parsed markdown sections
   * @param sourcePath Source path for identification
   */
  private registerStandardContent(sections: Array<{title: string; content: string; level: number}>, sourcePath: string): void {
    // Register each section with an ID
    sections.forEach((section, index) => {
      const sectionId = this.generateContentId(section.title, index);
      
      this.contentRegistry.registerContent(sectionId, {
        title: section.title,
        content: section.content,
        level: section.level,
        index,
        sourcePath
      });
    });
  }
  
  /**
   * Detects if the markdown content uses the enhanced format
   * @param markdown Markdown content
   * @returns True if enhanced format is detected
   */
  private detectEnhancedFormat(markdown: string): boolean {
    // Look for indicators of the enhanced format:
    // 1. Slide separators
    const hasSlideSeparators = markdown.includes('\n---\n');
    
    // 2. Visual directives
    const hasVisualDirectives = !!markdown.match(/\*\[Visual:([^\]]+)\]\*/);
    
    // 3. Animation directives
    const hasAnimationDirectives = !!markdown.match(/\*\[Animation:([^\]]+)\]\*/);
    
    // 4. Slide numbering (e.g., "## Slide 1:")
    const hasSlideNumbering = !!markdown.match(/## Slide \d+:/);
    
    // If any of these are true, use the enhanced parser
    return hasSlideSeparators || hasVisualDirectives || hasAnimationDirectives || hasSlideNumbering;
  }
  
  /**
   * Extract title from markdown content
   * @param markdown Markdown content
   * @returns Extracted title or undefined
   */
  private extractTitle(markdown: string): string | undefined {
    // Look for first level 1 heading
    const titleMatch = markdown.match(/^# (.+?)(\n|$)/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // Look for first level 2 heading if no level 1
    const subtitleMatch = markdown.match(/^## (.+?)(\n|$)/m);
    if (subtitleMatch) {
      return subtitleMatch[1].trim();
    }
    
    return undefined;
  }
  
  /**
   * Extract subtitle from markdown content
   * @param markdown Markdown content
   * @returns Extracted subtitle or undefined
   */
  private extractSubtitle(markdown: string): string | undefined {
    // If we found a level 1 heading, look for a level 2 heading as subtitle
    const titleMatch = markdown.match(/^# (.+?)(\n|$)/m);
    if (titleMatch) {
      const subtitleMatch = markdown.match(/^## (.+?)(\n|$)/m);
      if (subtitleMatch) {
        return subtitleMatch[1].trim();
      }
    }
    return undefined;
  }
  
  /**
   * Extract section title from markdown content
   * @param markdown Markdown content
   * @returns Extracted section title
   */
  private extractSectionTitle(markdown: string): string {
    // Look for first level 2 or 3 heading
    const titleMatch = markdown.match(/^##\s+(.+?)(\n|$)/m) || 
                        markdown.match(/^###\s+(.+?)(\n|$)/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    return 'Untitled Section';
  }
  
  /**
   * Extract definition from markdown content
   * @param markdown Markdown content
   * @returns Extracted definition
   */
  private extractDefinition(markdown: string): string {
    // Look for definition block
    const definitionMatch = markdown.match(/\*\*Definition:?\*\*\s*\n?>(.*?)(\n\n|\n(?=\*\*|$))/s) ||
                            markdown.match(/\*\*Definition:?\*\*\s*(.*?)(\n\n|\n(?=\*\*|$))/s);
    if (definitionMatch) {
      return definitionMatch[1].trim();
    }
    return '';
  }
  
  /**
   * Extract key points from markdown content
   * @param markdown Markdown content
   * @returns Array of key points
   */
  private extractKeyPoints(markdown: string): string[] {
    const keyPoints: string[] = [];
    
    // Find key points section
    const keyPointsMatch = markdown.match(/\*\*Key Points:?\*\*\s*\n([\s\S]*?)(?=\n\n|\n\*\*|$)/);
    if (keyPointsMatch) {
      // Extract bullet points
      const bulletPoints = keyPointsMatch[1].match(/- (.*?)(\n|$)/g);
      if (bulletPoints) {
        bulletPoints.forEach(point => {
          keyPoints.push(point.replace(/- /, '').trim());
        });
      }
    }
    
    return keyPoints;
  }
  
  /**
   * Extract the first paragraph from markdown content
   * @param markdown Markdown content
   * @returns First paragraph text
   */
  private extractFirstParagraph(markdown: string): string {
    // Skip headings
    const content = markdown.replace(/^#.*$/mg, '').trim();
    
    // Find first paragraph
    const paragraphMatch = content.match(/^([^#\-\*].+?)(\n\n|\n(?=\*\*|$))/s);
    if (paragraphMatch) {
      return paragraphMatch[1].trim();
    }
    return '';
  }
  
  /**
   * Extract architecture layers from markdown content
   * @param markdown Markdown content
   * @returns Array of layers
   */
  private extractLayers(markdown: string): any[] {
    const layers: any[] = [];
    
    // Extract ASCII art diagram
    const diagramMatch = markdown.match(/```[\s\S]*?(┌─+┐[\s\S]*?└─+┘)[\s\S]*?```/) ||
                         markdown.match(/(┌─+┐[\s\S]*?└─+┘)/);
    
    if (diagramMatch) {
      const diagram = diagramMatch[1];
      
      // Parse layer names from diagram
      diagram.split('\n')
        .filter(line => line.includes('│'))
        .forEach(line => {
          const layerMatch = line.match(/│\s+(.*?)\s+│/);
          if (layerMatch) {
            layers.push({ name: layerMatch[1].trim() });
          }
        });
    }
    
    // Extract component details for each layer
    // This is a simplified implementation; a real one would match components to layers
    const components: any[] = [];
    const componentMatches = markdown.match(/(?:^|\n)- \*\*(.*?)\*\*: (.*?)(?:\n|$)/g);
    
    if (componentMatches) {
      componentMatches.forEach(match => {
        const [, name, description] = match.match(/- \*\*(.*?)\*\*: (.*?)(?:\n|$)/) || [];
        if (name && description) {
          components.push({ name, description });
        }
      });
    }
    
    // Assign components to layers (simple assignment for illustration)
    const componentsPerLayer = components.length > 0 ? Math.ceil(components.length / layers.length) : 0;
    layers.forEach((layer, index) => {
      const start = index * componentsPerLayer;
      const end = Math.min(start + componentsPerLayer, components.length);
      layer.components = components.slice(start, end);
    });
    
    return layers;
  }
  
  /**
   * Extract timeline sections from markdown content
   * @param markdown Markdown content
   * @returns Array of timeline sections
   */
  private extractTimelineSections(markdown: string): any[] {
    const timelineSections: any[] = [];
    
    // Find timeline headers (### or bullet points with dates)
    const timelineHeaderMatches = markdown.match(/###\s+(.*?)(?:\n|$)|(?:^|\n)- \*\*(.*?)\*\*:?\s+\((\d+s?-\d+s?|(?:\d+s?-[P|p]resent))\)/g);
    
    if (timelineHeaderMatches) {
      timelineHeaderMatches.forEach(headerMatch => {
        let title: string = '';
        let timePeriod: string = '';
        
        // Parse header format
        if (headerMatch.startsWith('###')) {
          const match = headerMatch.match(/###\s+(.*?)(?:\n|$)/);
          if (match) {
            title = match[1].trim();
            // Try to extract time period from title
            const periodMatch = title.match(/\((\d+s?-\d+s?|(?:\d+s?-[P|p]resent))\)/);
            if (periodMatch) {
              timePeriod = periodMatch[1];
              title = title.replace(/\s*\(.*?\)\s*/, '');
            }
          }
        } else {
          const match = headerMatch.match(/- \*\*(.*?)\*\*:?\s+\((\d+s?-\d+s?|(?:\d+s?-[P|p]resent))\)/);
          if (match) {
            title = match[1].trim();
            timePeriod = match[2];
          }
        }
        
        if (title && timePeriod) {
          // Find content associated with this timeline section
          const sectionStart = markdown.indexOf(headerMatch);
          const nextHeaderIndex = markdown.indexOf('###', sectionStart + headerMatch.length);
          const sectionEnd = nextHeaderIndex > -1 ? nextHeaderIndex : markdown.length;
          const sectionContent = markdown.substring(sectionStart + headerMatch.length, sectionEnd).trim();
          
          // Extract bullet points
          const bulletPoints: string[] = [];
          const bulletMatches = sectionContent.match(/(?:^|\n)- ([^*].*?)(?:\n|$)/g);
          if (bulletMatches) {
            bulletMatches.forEach(bullet => {
              const content = bullet.replace(/^-\s+/, '').trim();
              bulletPoints.push(content);
            });
          }
          
          timelineSections.push({
            title,
            timePeriod,
            bulletPoints
          });
        }
      });
    }
    
    return timelineSections;
  }
  
  /**
   * Generates a content ID from a title and index
   * @param title Title to use for ID generation
   * @param index Index for uniqueness
   * @returns Generated ID
   */
  private generateContentId(title: string, index: number): string {
    // Convert title to kebab case
    const baseId = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Append index for uniqueness if not the first item
    return index > 0 ? `${baseId}-${index}` : baseId;
  }
  
  /**
   * Loads a presentation directly from a configuration object
   * @param config Presentation configuration object
   */
  public loadPresentationFromConfig(config: PresentationConfig): void {
    this.presentationConfig = config;
    this.presentationTitle = config.title;
    this.slideGroups = config.slideGroups;
    
    // Load into slide manager if available
    if (this.slideManager && typeof this.slideManager.loadPresentation === 'function') {
      this.slideManager.loadPresentation(config);
    } else {
      console.warn('SlideManager not available, presentation loaded but not rendered');
    }
  }
  
  /**
   * Gets the current presentation configuration
   * @returns Current presentation configuration or null if none loaded
   */
  public getPresentationConfig(): PresentationConfig | null {
    return this.presentationConfig;
  }
  
  /**
   * Gets the current presentation title
   * @returns Current presentation title
   */
  public getPresentationTitle(): string {
    return this.presentationTitle;
  }
  
  /**
   * Exports the presentation as a PDF
   * @param options Export options
   * @returns Promise that resolves when export is complete
   */
  public async exportToPDF(options: ExportOptions = {}): Promise<void> {
    if (this.isExporting) {
      console.warn('Export already in progress');
      return;
    }
    
    if (!document.querySelector('.reveal')) {
      throw new Error('Presentation container not found');
    }
    
    const element = document.querySelector('.reveal') as HTMLElement;
    const filename = options.filename || `${this.presentationTitle || 'presentation'}.pdf`;
    
    this.isExporting = true;
    
    try {
      // Configure PDF options
      const pdfOptions = {
        margin: options.margin !== undefined ? options.margin : [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { 
          unit: 'in', 
          format: options.pageSize || 'letter', 
          orientation: options.orientation || 'landscape' 
        }
      };
      
      // Show export message
      this.showExportMessage('Exporting to PDF...');
      
      // Prepare presentation for export
      this.prepareForExport(options);
      
      // Export to PDF
      await html2pdf().set(pdfOptions).from(element).save();
      
      // Cleanup after export
      this.cleanupAfterExport();
      
      // Hide export message
      this.hideExportMessage();
      
      if (this.exportCallback) {
        this.exportCallback(true);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      this.hideExportMessage();
      this.cleanupAfterExport();
      this.showExportError('PDF export failed');
      
      if (this.exportCallback) {
        this.exportCallback(false, error as Error);
      }
    } finally {
      this.isExporting = false;
    }
  }
  
  /**
   * Exports the presentation as a standalone HTML file
   * @param options Export options
   */
  public exportToHTML(options: ExportOptions = {}): void {
    if (this.isExporting) {
      console.warn('Export already in progress');
      return;
    }
    
    this.isExporting = true;
    
    try {
      // Clone the document to modify it for export
      const docClone = document.cloneNode(true) as Document;
      
      // Remove any unwanted elements (like export buttons)
      const exportControls = docClone.querySelectorAll('.export-controls');
      exportControls.forEach(el => el.remove());
      
      // Apply export modifications if needed
      if (options.usePrintStyles) {
        const style = docClone.createElement('style');
        style.textContent = this.getPrintStyles();
        docClone.head.appendChild(style);
      }
      
      // Get the HTML content
      const htmlContent = docClone.documentElement.outerHTML;
      
      // Create a blob and download link
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename || `${this.presentationTitle || 'presentation'}.html`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (this.exportCallback) {
        this.exportCallback(true);
      }
    } catch (error) {
      console.error('HTML export failed:', error);
      this.showExportError('HTML export failed');
      
      if (this.exportCallback) {
        this.exportCallback(false, error as Error);
      }
    } finally {
      this.isExporting = false;
    }
  }
  
  /**
   * Sets a callback to be called when export is complete
   * @param callback Function to call when export completes
   */
  public setExportCallback(callback: (success: boolean, error?: Error) => void): void {
    this.exportCallback = callback;
  }
  
  /**
   * Prepares the presentation for export
   * @param options Export options
   */
  private prepareForExport(options: ExportOptions): void {
    // Add print-specific styles to improve export quality
    const style = document.createElement('style');
    style.id = 'print-export-styles';
    style.textContent = this.getPrintStyles();
    document.head.appendChild(style);
    
    // Add class to body for export-specific styling
    document.body.classList.add('exporting');
    
    // Show all fragments if exporting to PDF
    if (options.usePrintStyles) {
      const fragments = document.querySelectorAll('.fragment');
      fragments.forEach(fragment => {
        fragment.classList.add('visible');
      });
    }
    
    // Handle notes if requested
    if (options.includeNotes) {
      this.prepareNotesForExport();
    }
  }
  
  /**
   * Cleans up after export
   */
  private cleanupAfterExport(): void {
    // Remove export-specific styles
    const exportStyles = document.getElementById('print-export-styles');
    if (exportStyles) {
      exportStyles.remove();
    }
    
    // Remove export class from body
    document.body.classList.remove('exporting');
    
    // Reset fragments
    const fragments = document.querySelectorAll('.fragment.visible');
    fragments.forEach(fragment => {
      if (!fragment.classList.contains('visible-noexit')) {
        fragment.classList.remove('visible');
      }
    });
    
    // Clean up notes
    this.cleanupNotesAfterExport();
  }
  
  /**
   * Prepares presenter notes for export
   */
  private prepareNotesForExport(): void {
    const notes = document.querySelectorAll('.notes');
    notes.forEach((note, index) => {
      const noteContainer = document.createElement('div');
      noteContainer.className = 'exported-notes';
      noteContainer.innerHTML = `<h3>Speaker Notes</h3>${note.innerHTML}`;
      
      // Find the parent slide
      const slide = note.closest('.reveal .slides section');
      if (slide) {
        slide.appendChild(noteContainer);
      }
    });
  }
  
  /**
   * Cleans up notes after export
   */
  private cleanupNotesAfterExport(): void {
    const exportedNotes = document.querySelectorAll('.exported-notes');
    exportedNotes.forEach(note => note.remove());
  }
  
  /**
   * Gets print-specific CSS styles for export
   * @returns CSS styles as a string
   */
  private getPrintStyles(): string {
    return `
      @media print {
        body.exporting {
          background: white !important;
        }
        
        .reveal .slides section {
          height: 100vh !important;
          min-height: 100vh !important;
          padding: 20px !important;
          page-break-before: always !important;
          page-break-after: always !important;
        }
        
        .reveal .slides section .fragment {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        .exported-notes {
          border-top: 2px solid #ccc;
          margin-top: 2em;
          padding-top: 1em;
          font-size: 0.8em;
          page-break-inside: avoid;
        }
        
        .exported-notes h3 {
          color: #333 !important;
          margin-bottom: 0.5em;
        }
        
        .reveal .progress, .reveal .controls, .reveal .slide-number {
          display: none !important;
        }
      }
    `;
  }
  
  /**
   * Shows an export progress message
   * @param message Message to display
   */
  private showExportMessage(message: string): void {
    // Create or update message element
    let messageEl = document.getElementById('export-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'export-message';
      messageEl.style.position = 'fixed';
      messageEl.style.top = '20px';
      messageEl.style.left = '50%';
      messageEl.style.transform = 'translateX(-50%)';
      messageEl.style.background = 'rgba(0, 0, 0, 0.7)';
      messageEl.style.color = 'white';
      messageEl.style.padding = '10px 20px';
      messageEl.style.borderRadius = '5px';
      messageEl.style.zIndex = '9999';
      document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.style.display = 'block';
  }
  
  /**
   * Hides the export message
   */
  private hideExportMessage(): void {
    const messageEl = document.getElementById('export-message');
    if (messageEl) {
      messageEl.style.display = 'none';
    }
  }
  
  /**
   * Shows an export error message
   * @param error Error message to display
   */
  private showExportError(error: string): void {
    this.showExportMessage(`Error: ${error}`);
    setTimeout(() => this.hideExportMessage(), 3000);
  }
}

export default PresentationManager;