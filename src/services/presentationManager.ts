/**
 * PresentationManager service
 * Handles loading markdown content and managing presentation exports
 */
import html2pdf from 'html2pdf.js';
import { MarkdownLoader } from './markdownLoader';
import { MarkdownParser, SlideSection } from './markdownParser';
import { EnhancedMarkdownParser } from './enhancedMarkdownParser';
import { PresentationConfig, SlideGroup } from '../types/slide-data';

export class PresentationManager {
  private loader: MarkdownLoader;
  private parser: MarkdownParser;
  private enhancedParser: EnhancedMarkdownParser;
  private slideGroups: SlideGroup[] = [];
  private presentationTitle: string = '';
  private slideManager: any; // Will be set by external code
  
  /**
   * Creates a new PresentationManager instance
   */
  constructor() {
    this.loader = new MarkdownLoader();
    this.parser = new MarkdownParser();
    this.enhancedParser = new EnhancedMarkdownParser();
  }
  
  /**
   * Sets the SlideManager instance for rendering slides
   * @param slideManager The slide manager instance
   */
  setSlideManager(slideManager: any): void {
    this.slideManager = slideManager;
  }
  
  /**
   * Loads a presentation from a markdown file
   * @param markdownPath Path to the markdown file to load
   * @param options Optional loading configuration
   */
  async loadPresentation(markdownPath: string, options: { 
    title?: string,
    presenter?: { name: string, title: string, organization: string },
    settings?: any,
    useEnhancedParser?: boolean
  } = {}): Promise<void> {
    try {
      // Load markdown content
      const markdown = await this.loader.loadMarkdown(markdownPath);
      
      // Determine whether to use the enhanced parser based on content format
      const useEnhanced = options.useEnhancedParser ?? this.detectEnhancedFormat(markdown);
      
      if (useEnhanced) {
        // Use enhanced parser for more structured markdown
        this.slideGroups = this.enhancedParser.parseToSlideGroups(markdown);
        
        // Set presentation title
        this.presentationTitle = options.title || this.extractTitle(markdown) || 'Presentation';
      } else {
        // Use standard parser for simpler markdown
        const sections = this.parser.parseToSections(markdown);
        this.slideGroups = this.parser.convertToSlideGroups(sections);
        
        // Set presentation title from first section or options
        this.presentationTitle = options.title || (sections[0]?.title || 'Presentation');
      }
      
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
      return titleMatch[1];
    }
    return undefined;
  }
  
  /**
   * Exports the presentation as a PDF
   */
  async exportToPDF(): Promise<void> {
    if (!document.querySelector('.reveal')) {
      console.error('Presentation container not found');
      return;
    }
    
    const element = document.querySelector('.reveal') as HTMLElement;
    const filename = `${this.presentationTitle || 'presentation'}.pdf`;
    
    try {
      // Configure PDF options
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      
      // Show export message
      this.showExportMessage('Exporting to PDF...');
      
      // Export to PDF
      await html2pdf().set(options).from(element).save();
      
      // Hide export message
      this.hideExportMessage();
    } catch (error) {
      console.error('PDF export failed:', error);
      this.hideExportMessage();
      this.showExportError('PDF export failed');
    }
  }
  
  /**
   * Exports the presentation as a standalone HTML file
   */
  exportToHTML(): void {
    try {
      // Clone the document to modify it for export
      const docClone = document.cloneNode(true) as Document;
      
      // Remove any unwanted elements (like export buttons)
      const exportControls = docClone.querySelectorAll('.export-controls');
      exportControls.forEach(el => el.remove());
      
      // Get the HTML content
      const htmlContent = docClone.documentElement.outerHTML;
      
      // Create a blob and download link
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.presentationTitle || 'presentation'}.html`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('HTML export failed:', error);
      this.showExportError('HTML export failed');
    }
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