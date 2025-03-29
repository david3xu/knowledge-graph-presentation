/**
 * EnhancedMarkdownParser
 * Converts structured markdown into slide configurations with advanced visualization options
 */
import * as marked from 'marked';
import { SlideConfig, SlideGroup, VisualizationType } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

interface VisualizationDirective {
  type: string;
  config: any;
  description?: string;
}

interface ParsedSlide {
  id: string;
  title: string;
  subtitle?: string;
  content: any;
  visualizationDirectives: VisualizationDirective[];
  background?: any;
  transition?: string;
  notes?: string;
}

export class EnhancedMarkdownParser {
  /**
   * Parse markdown into slide groups and slides with rich visualization directives
   * @param markdown The markdown content to parse
   * @returns Array of slide groups ready for the presentation
   */
  parseToSlideGroups(markdown: string): SlideGroup[] {
    const slides = this.parseSlides(markdown);
    const slideGroups = this.organizeIntoGroups(slides);
    return slideGroups;
  }
  
  /**
   * Parse markdown into individual slides
   * @param markdown The markdown content to parse
   * @returns Array of parsed slides
   */
  private parseSlides(markdown: string): ParsedSlide[] {
    // Split content into slide sections using the markdown separator
    const slideSections = markdown.split(/\n---\n/).map(section => section.trim());
    
    // Process each slide section
    return slideSections.map((slideContent, index) => {
      // Extract slide ID, title, and content
      const slideId = `slide-${index + 1}`;
      const slideTitle = this.extractTitle(slideContent);
      const slideSubtitle = this.extractSubtitle(slideContent);
      
      // Extract visual directives
      const visualDirectives = this.extractVisualDirectives(slideContent);
      
      // Extract definitions, key points, code blocks, etc.
      const content = this.extractStructuredContent(slideContent);
      
      // Extract presentation notes
      const notes = this.extractNotes(slideContent);
      
      return {
        id: slideId,
        title: slideTitle,
        subtitle: slideSubtitle,
        content: content,
        visualizationDirectives: visualDirectives,
        notes: notes
      };
    });
  }
  
  /**
   * Extract the main title from slide content
   * @param slideContent Slide markdown content
   * @returns Extracted title
   */
  private extractTitle(slideContent: string): string {
    // Look for level 2 or 3 headings for slide titles
    const titleMatch = slideContent.match(/^## (.+?)(\n|$)|### (.+?)(\n|$)/m);
    if (titleMatch) {
      return titleMatch[1] || titleMatch[3] || 'Untitled Slide';
    }
    return 'Untitled Slide';
  }
  
  /**
   * Extract the subtitle from slide content
   * @param slideContent Slide markdown content
   * @returns Extracted subtitle
   */
  private extractSubtitle(slideContent: string): string | undefined {
    // If we found a level 2 heading, look for a level 3 heading as subtitle
    const level2Match = slideContent.match(/^## (.+?)(\n|$)/m);
    if (level2Match) {
      const subtitleMatch = slideContent.match(/^### (.+?)(\n|$)/m);
      if (subtitleMatch) {
        return subtitleMatch[1];
      }
    }
    return undefined;
  }
  
  /**
   * Extract visual directives from comments in the markdown
   * @param slideContent Slide markdown content
   * @returns Array of visual directives
   */
  private extractVisualDirectives(slideContent: string): VisualizationDirective[] {
    const directives: VisualizationDirective[] = [];
    
    // Look for visual directives in markdown comments
    const visualMatches = slideContent.match(/\*\[Visual:([^\]]+)\]\*/g);
    if (visualMatches) {
      visualMatches.forEach(match => {
        const content = match.replace(/\*\[Visual:|\]\*/g, '').trim();
        directives.push(this.parseVisualDirective(content));
      });
    }
    
    // Look for animation directives
    const animationMatches = slideContent.match(/\*\[Animation:([^\]]+)\]\*/g);
    if (animationMatches) {
      animationMatches.forEach(match => {
        const content = match.replace(/\*\[Animation:|\]\*/g, '').trim();
        directives.push({
          type: 'animation',
          config: { description: content }
        });
      });
    }
    
    // Look for interactive element directives
    const interactiveMatches = slideContent.match(/\*\[Interactive element:([^\]]+)\]\*/g);
    if (interactiveMatches) {
      interactiveMatches.forEach(match => {
        const content = match.replace(/\*\[Interactive element:|\]\*/g, '').trim();
        directives.push({
          type: 'interactive',
          config: { description: content }
        });
      });
    }
    
    // Extract code blocks as potential visualizations
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
    let codeMatch;
    while ((codeMatch = codeBlockRegex.exec(slideContent)) !== null) {
      const language = codeMatch[1] || '';
      const code = codeMatch[2];
      
      // Determine visualization type based on code content and context
      let visType = this.determineVisualizationType(language, code, slideContent);
      if (visType) {
        directives.push({
          type: visType,
          config: { code, language }
        });
      }
    }
    
    return directives;
  }
  
  /**
   * Parse a visual directive string into a structured directive object
   * @param directiveContent Content of the visual directive
   * @returns Structured visualization directive
   */
  private parseVisualDirective(directiveContent: string): VisualizationDirective {
    // Look for specific visual types in the directive
    if (directiveContent.includes('diagram') || directiveContent.includes('architecture')) {
      return {
        type: 'diagram',
        config: { description: directiveContent },
        description: directiveContent
      };
    } else if (directiveContent.includes('graph') || directiveContent.includes('network')) {
      return {
        type: 'graph',
        config: { description: directiveContent },
        description: directiveContent
      };
    } else if (directiveContent.includes('timeline')) {
      return {
        type: 'timeline',
        config: { description: directiveContent },
        description: directiveContent
      };
    } else if (directiveContent.includes('comparison') || directiveContent.includes('vs')) {
      return {
        type: 'comparison',
        config: { description: directiveContent },
        description: directiveContent
      };
    } else {
      // Default to a generic visualization
      return {
        type: 'custom',
        config: { description: directiveContent },
        description: directiveContent
      };
    }
  }
  
  /**
   * Determine the type of visualization based on code block language and content
   * @param language Code block language
   * @param code Code content
   * @param context Surrounding slide content
   * @returns Visualization type or null if not a visualization
   */
  private determineVisualizationType(language: string, code: string, context: string): string | null {
    // If explicit visualization language, use that
    if (['graph', 'diagram', 'flow', 'ascii', 'timeline'].includes(language)) {
      return language;
    }
    
    // Check code content for table-like structure
    if (code.includes('┌') && code.includes('┐') && code.includes('│')) {
      return 'ascii';
    }
    
    // Look for markdown tables in the code
    if (code.includes('|') && code.includes('-|-')) {
      return 'table';
    }
    
    // Cypher code is likely a graph visualization
    if (language === 'cypher' || code.includes('MATCH') && code.includes('RETURN')) {
      return 'graph';
    }
    
    // SPARQL code is also typically for graphs
    if (language === 'sparql' || code.includes('SELECT') && code.includes('WHERE {')) {
      return 'graph';
    }
    
    // If we're looking at architecture or layers 
    if (context.toLowerCase().includes('architecture') || context.toLowerCase().includes('layer')) {
      return 'diagram';
    }
    
    // If we're looking at evolution or history sections
    if (context.toLowerCase().includes('evolution') || context.toLowerCase().includes('historical')) {
      return 'timeline';
    }
    
    // If there are arrows/connections in the ASCII art, it's likely a diagram
    if (code.includes('->') || code.includes('→') || code.includes('--')) {
      return 'diagram';
    }
    
    // If not a visualization, return null
    return null;
  }
  
  /**
   * Extract structured content from the slide markdown
   * @param slideContent Slide markdown content
   * @returns Structured content object
   */
  private extractStructuredContent(slideContent: string): any {
    const content: any = {};
    
    // Extract definition blocks
    const definitionMatch = slideContent.match(/\*\*Definition:?\*\*\s*\n?>(.*?)(\n\n|\n(?=\*\*|$))/s);
    if (definitionMatch) {
      content.definition = definitionMatch[1].trim();
    }
    
    // Extract key points
    const keyPointsMatch = slideContent.match(/\*\*Key .*?:?\*\*\s*\n([\s\S]*?)(?=\n\n|\n\*\*|$)/);
    if (keyPointsMatch) {
      // Extract bullet points
      const bulletPoints = keyPointsMatch[1].match(/- (.*?)(\n|$)/g);
      if (bulletPoints) {
        content.keyPoints = bulletPoints.map(point => point.replace(/- /, '').trim());
      }
    }
    
    // Extract lists
    const listMatches = slideContent.match(/(\d+\.\s+.*\n)+|\n(- .*\n)+/g);
    if (listMatches) {
      content.lists = listMatches.map(list => {
        const items = list.match(/(?:\d+\.|-).*\n?/g);
        if (items) {
          const type = items[0].startsWith('-') ? 'bullet' : 'numbered';
          return {
            type,
            items: items.map(item => item.replace(/^\d+\.\s+|-\s+/, '').trim())
          };
        }
        return null;
      }).filter(Boolean);
    }
    
    // Extract tables outside of code blocks
    const tablePattern = /\n\|.*\|\n\|[:\-\|]+\|\n(\|.*\|\n)+/g;
    const tableMatches = slideContent.replace(/```[\s\S]*?```/g, '').match(tablePattern);
    if (tableMatches) {
      content.tables = tableMatches.map(tableMarkdown => {
        const rows = tableMarkdown.trim().split('\n');
        const headers = rows[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        const tableData: Record<string, string>[] = [];
        
        for (let i = 2; i < rows.length; i++) {
          const cells = rows[i].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
          const rowData: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            if (cells[index]) {
              rowData[header] = cells[index];
            }
          });
          
          tableData.push(rowData);
        }
        
        return {
          headers,
          data: tableData,
          markdown: tableMarkdown
        };
      });
    }
    
    // Extract code snippets (excluding those used for visualizations)
    const codeSnippets: Array<{code: string, language: string, caption?: string}> = [];
    const codeRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
    let codeMatch;
    
    while ((codeMatch = codeRegex.exec(slideContent)) !== null) {
      const language = codeMatch[1] || '';
      const code = codeMatch[2];
      
      // If this isn't a visualization code block, add it as a code snippet
      if (!this.determineVisualizationType(language, code, slideContent)) {
        const previousText = slideContent.substring(0, codeMatch.index).trim();
        const captionMatch = previousText.match(/\*\*Code Example( \((.*?)\))?:\*\*/);
        
        codeSnippets.push({
          code,
          language,
          caption: captionMatch ? (captionMatch[2] || 'Code Example') : undefined
        });
      }
    }
    
    if (codeSnippets.length > 0) {
      content.codeSnippets = codeSnippets;
    }
    
    // Extract main content as markdown
    // Remove visual directives and notes to get clean content
    let cleanContent = slideContent
      .replace(/\*\[Visual:([^\]]+)\]\*/g, '')
      .replace(/\*\[Animation:([^\]]+)\]\*/g, '')
      .replace(/\*\[Interactive element:([^\]]+)\]\*/g, '')
      .replace(/\n<!-- Speaker Notes:[\s\S]*?-->/g, '');
      
    content.mainContent = cleanContent;
    
    return content;
  }
  
  /**
   * Extract presentation notes from the slide markdown
   * @param slideContent Slide markdown content
   * @returns Extracted notes
   */
  private extractNotes(slideContent: string): string | undefined {
    const notesMatch = slideContent.match(/<!-- Speaker Notes:([\s\S]*?)-->/);
    if (notesMatch) {
      return notesMatch[1].trim();
    }
    return undefined;
  }
  
  /**
   * Organize slides into slide groups based on headings
   * @param slides Array of parsed slides
   * @returns Array of slide groups
   */
  private organizeIntoGroups(slides: ParsedSlide[]): SlideGroup[] {
    const slideGroups: SlideGroup[] = [];
    let currentGroup: SlideGroup | null = null;
    
    slides.forEach((slide, index) => {
      const slideConfig = this.convertToSlideConfig(slide);
      
      // First slide is always a title slide
      if (index === 0) {
        currentGroup = {
          title: 'Introduction',
          id: 'intro',
          includeSectionSlide: false,
          slides: [slideConfig]
        };
        slideGroups.push(currentGroup);
        return;
      }
      
      // Check if this slide looks like a section slide
      const isSection = this.isSectionSlide(slide, slides, index);
      
      if (isSection) {
        // Create a new group for this section
        currentGroup = {
          title: slide.title,
          id: slide.id,
          includeSectionSlide: true,
          slides: [slideConfig]
        };
        slideGroups.push(currentGroup);
      } else if (currentGroup) {
        // Add to current group
        currentGroup.slides.push(slideConfig);
      } else {
        // Fallback - create a group if none exists
        currentGroup = {
          title: 'Content',
          id: 'content-' + index,
          includeSectionSlide: false,
          slides: [slideConfig]
        };
        slideGroups.push(currentGroup);
      }
    });
    
    return slideGroups;
  }
  
  /**
   * Convert a parsed slide to a SlideConfig object
   * @param slide Parsed slide
   * @returns SlideConfig object
   */
  private convertToSlideConfig(slide: ParsedSlide): SlideConfig {
    // Determine visualization type and config based on directives
    const { visualizationType, visualizationConfig } = this.processVisualizationDirectives(slide.visualizationDirectives);
    
    const slideConfig: SlideConfig = {
      id: slide.id,
      title: slide.title,
      content: {
        mainContent: this.parseMarkdownToHTML(slide.content.mainContent || '')
      },
      visualizationType,
      visualizationConfig,
      transition: 'slide' // Default transition
    };
    
    // Add subtitle if available
    if (slide.subtitle) {
      slideConfig.content!.subtitle = slide.subtitle;
    }
    
    // Add notes if available
    if (slide.notes) {
      slideConfig.notes = slide.notes;
    }
    
    // Add definition if available
    if (slide.content.definition) {
      slideConfig.content!.definition = slide.content.definition;
    }
    
    // Add key points if available
    if (slide.content.keyPoints) {
      slideConfig.content!.keyPoints = slide.content.keyPoints;
    }
    
    // Add lists if available
    if (slide.content.lists) {
      slideConfig.content!.listItems = slide.content.lists;
    }
    
    // Add code snippets if available
    if (slide.content.codeSnippets) {
      slideConfig.content!.codeSnippets = slide.content.codeSnippets;
    }
    
    // Add tables if available
    if (slide.content.tables) {
      slideConfig.content!.tables = slide.content.tables;
    }
    
    return slideConfig;
  }
  
  /**
   * Process visualization directives to determine type and configuration
   * @param directives Array of visualization directives
   * @returns Object with visualization type and configuration
   */
  private processVisualizationDirectives(directives: VisualizationDirective[]): { 
    visualizationType: VisualizationType, 
    visualizationConfig: any 
  } {
    if (directives.length === 0) {
      return { visualizationType: 'none', visualizationConfig: {} };
    }
    
    // Prioritize certain visualization types
    const priorityTypes = ['graph', 'timeline', 'table', 'flowDiagram', 'ascii'];
    
    // Find the first directive with a priority type
    for (const type of priorityTypes) {
      const directive = directives.find(d => d.type === type);
      if (directive) {
        return { 
          visualizationType: directive.type as VisualizationType, 
          visualizationConfig: directive.config 
        };
      }
    }
    
    // If no priority type found, use the first directive
    const firstDirective = directives[0];
    return { 
      visualizationType: (firstDirective.type as VisualizationType) || 'none', 
      visualizationConfig: firstDirective.config || {} 
    };
  }
  
  /**
   * Check if a slide appears to be a section slide
   * @param slide The slide to check
   * @param allSlides All slides in the presentation
   * @param index Index of the current slide
   * @returns True if the slide looks like a section slide
   */
  private isSectionSlide(slide: ParsedSlide, allSlides: ParsedSlide[], index: number): boolean {
    // Title slide is never a section slide
    if (index === 0) return false;
    
    // If the title includes words like "Agenda", it's likely a section slide
    if (slide.title.match(/agenda|overview|introduction|summary/i)) {
      return true;
    }
    
    // If it has very minimal content compared to other slides, it might be a section slide
    const contentLength = (slide.content.mainContent || '').length;
    const avgContentLength = allSlides.reduce((sum, s) => sum + (s.content.mainContent || '').length, 0) / allSlides.length;
    
    if (contentLength < avgContentLength * 0.5) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Convert markdown to HTML
   * @param markdown Markdown content
   * @returns HTML string
   */
  private parseMarkdownToHTML(markdown: string): string {
    return marked.parse(markdown) as string;
  }
} 