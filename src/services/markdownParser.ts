/**
 * MarkdownParser service
 * Converts markdown content into slide data structures
 */
import * as marked from 'marked';
import { SlideConfig, SlideGroup } from '../types/slide-data';

export interface SlideSection {
  title: string;
  content: string;
  level: number;
  id?: string;
  children?: SlideSection[];
}

export class MarkdownParser {
  /**
   * Parses markdown content into slide sections based on headers
   * @param markdown Markdown content to parse
   * @returns Array of slide sections
   */
  parseToSections(markdown: string): SlideSection[] {
    const sections: SlideSection[] = [];
    let currentSection: SlideSection | null = null;
    
    // Split the markdown by lines
    const lines = markdown.split('\n');
    let contentBuffer = '';
    
    for (const line of lines) {
      // Check if line is a heading
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headingMatch) {
        // If we have a current section, save its content
        if (currentSection) {
          currentSection.content = contentBuffer.trim();
          contentBuffer = '';
          
          // Add to the appropriate place in hierarchy
          if (currentSection.level === 1) {
            sections.push(currentSection);
          } else {
            let parent = this.findParentSection(sections, currentSection.level);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(currentSection);
            } else {
              // Fallback if parent not found
              sections.push(currentSection);
            }
          }
        }
        
        // Create a new section
        const level = headingMatch[1].length;
        const title = headingMatch[2];
        const id = this.generateId(title);
        currentSection = { title, content: '', level, id };
      } else if (currentSection) {
        // Add line to current section's content
        contentBuffer += line + '\n';
      }
    }
    
    // Don't forget the last section
    if (currentSection) {
      currentSection.content = contentBuffer.trim();
      if (currentSection.level === 1) {
        sections.push(currentSection);
      } else {
        let parent = this.findParentSection(sections, currentSection.level);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(currentSection);
        } else {
          sections.push(currentSection);
        }
      }
    }
    
    return sections;
  }
  
  /**
   * Converts markdown sections to slide configurations
   * @param sections Parsed markdown sections
   * @returns Array of slide groups for the presentation
   */
  convertToSlideGroups(sections: SlideSection[]): SlideGroup[] {
    return sections.map(section => this.createSlideGroup(section));
  }
  
  /**
   * Creates a slide group from a section
   * @param section Section to convert
   * @returns SlideGroup configuration
   */
  private createSlideGroup(section: SlideSection): SlideGroup {
    // Create slides from children, or create a single slide if no children
    const slides: SlideConfig[] = section.children && section.children.length > 0 ? 
      section.children.map(child => this.createSlide(child)) :
      [this.createSlide(section)];
    
    return {
      title: section.title,
      id: section.id || this.generateId(section.title),
      includeSectionSlide: section.children && section.children.length > 0,
      slides
    };
  }
  
  /**
   * Creates a slide configuration from a section
   * @param section Section to convert
   * @returns SlideConfig object
   */
  private createSlide(section: SlideSection): SlideConfig {
    // Parse the content to extract special blocks like diagrams, code, etc.
    const { content, visualizationType, visualizationConfig } = this.parseContent(section.content);
    
    return {
      id: section.id || this.generateId(section.title),
      title: section.title,
      content: {
        // Convert markdown to HTML for content
        mainContent: this.parseMarkdownToHTML(content)
      },
      visualizationType: visualizationType as 'none' | 'graph' | 'timeline' | 'table' | 'flowDiagram' | 'ascii',
      visualizationConfig: visualizationConfig || {}
    };
  }
  
  /**
   * Parses section content to extract special blocks like code, tables, etc.
   * @param content Raw markdown content
   * @returns Parsed content and any visualization config
   */
  private parseContent(content: string): { 
    content: string, 
    visualizationType?: string, 
    visualizationConfig?: any 
  } {
    // Check for code blocks that might represent diagrams
    const diagramMatch = content.match(/```(?:diagram|ascii|graph|flow)\s*\n([\s\S]*?)```/);
    
    if (diagramMatch) {
      // Extract diagram content
      const diagramContent = diagramMatch[1];
      
      // Determine visualization type based on context
      let visualizationType = 'ascii';
      
      if (content.includes('graph') || content.includes('node') || content.includes('edge')) {
        visualizationType = 'graph';
      } else if (content.includes('timeline') || content.includes('evolution')) {
        visualizationType = 'timeline';
      } else if (content.includes('flow') || content.includes('process')) {
        visualizationType = 'flowDiagram';
      }
      
      // Remove the diagram block from content
      const cleanContent = content.replace(/```(?:diagram|ascii|graph|flow)\s*\n[\s\S]*?```/, '');
      
      return {
        content: cleanContent,
        visualizationType,
        visualizationConfig: {
          text: diagramContent
        }
      };
    }
    
    // Check for tables
    if (content.includes('|')) {
      const tableLines = content.split('\n').filter(line => line.includes('|'));
      
      if (tableLines.length >= 2) {
        // Simple heuristic to detect tables
        const isTable = tableLines[1].includes('---') || tableLines[1].includes('===');
        
        if (isTable) {
          // Keep the table in content but also configure table visualization
          return {
            content,
            visualizationType: 'table',
            visualizationConfig: {
              markdown: content
            }
          };
        }
      }
    }
    
    // No special content found
    return { content };
  }
  
  /**
   * Converts markdown content to HTML
   * @param markdown Markdown content
   * @returns HTML string
   */
  parseMarkdownToHTML(markdown: string): string {
    return marked.parse(markdown) as string;
  }
  
  /**
   * Finds the parent section for a given section level
   * @param sections Array of sections to search
   * @param currentLevel Level of the current section
   * @returns Parent section or null if not found
   */
  private findParentSection(sections: SlideSection[], currentLevel: number): SlideSection | null {
    // Simple implementation - find the most recent section with level less than current
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].level < currentLevel) {
        return sections[i];
      }
      
      // Check children recursively
      const children = sections[i].children;
      if (children && children.length > 0) {
        const parent = this.findParentSection(children, currentLevel);
        if (parent) return parent;
      }
    }
    
    return null;
  }
  
  /**
   * Generates a unique ID from a title
   * @param title Title to convert to ID
   * @returns Sanitized ID string
   */
  private generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
} 