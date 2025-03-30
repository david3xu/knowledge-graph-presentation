/**
 * Markdown Translator Service
 * Provides bidirectional translation between Markdown content and slide configurations
 */
import { PresentationConfig, SlideConfig, SlideGroup } from '../types/slide-data';
import { EnhancedMarkdownParser } from './enhanced-markdown-parser';

/**
 * Service for translating between Markdown and slide configurations
 */
export class MarkdownTranslator {
  private parser: EnhancedMarkdownParser;
  
  constructor() {
    this.parser = new EnhancedMarkdownParser();
  }
  
  /**
   * Converts a slide configuration to Markdown
   * @param slide Slide configuration
   * @returns Markdown representation
   */
  slideToMarkdown(slide: SlideConfig): string {
    let markdown = `## ${slide.title}\n\n`;
    
    if (slide.content?.definition) {
      markdown += `**Definition**: ${slide.content.definition}\n\n`;
    }
    
    if (slide.content?.keyPoints?.length) {
      markdown += `**Key Points**:\n`;
      slide.content.keyPoints.forEach(point => {
        markdown += `- ${point}\n`;
      });
      markdown += '\n';
    }
    
    // Add visualization directive based on visualization type
    if (slide.visualizationType !== 'none') {
      markdown += `*[Visual:${slide.visualizationType}]*\n\n`;
    }
    
    // Handle code snippets if present
    if (slide.content?.codeSnippets?.length) {
      slide.content.codeSnippets.forEach(snippet => {
        markdown += `\`\`\`${snippet.language}\n${snippet.code}\n\`\`\`\n\n`;
        
        if (snippet.caption) {
          markdown += `*${snippet.caption}*\n\n`;
        }
      });
    }
    
    // Handle quotes if present
    if (slide.content?.quote) {
      markdown += `> ${slide.content.quote.text}\n`;
      if (slide.content.quote.author) {
        markdown += `> — ${slide.content.quote.author}`;
        if (slide.content.quote.source) {
          markdown += `, ${slide.content.quote.source}`;
        }
        markdown += '\n';
      }
      markdown += '\n';
    }
    
    // Add presenter notes
    if (slide.notes) {
      markdown += `<!-- Speaker Notes:\n${slide.notes}\n-->\n\n`;
    }
    
    return markdown;
  }
  
  /**
   * Converts a slide group to Markdown
   * @param group Slide group
   * @returns Markdown representation
   */
  slideGroupToMarkdown(group: SlideGroup): string {
    let markdown = `# ${group.title}\n\n`;
    
    group.slides.forEach(slide => {
      markdown += `${this.slideToMarkdown(slide)}\n---\n\n`;
    });
    
    return markdown;
  }
  
  /**
   * Converts a presentation configuration to Markdown
   * @param config Presentation configuration
   * @returns Markdown representation
   */
  configToMarkdown(config: PresentationConfig): string {
    let markdown = `# ${config.title}\n\n`;
    
    if (config.presenter) {
      markdown += `Presenter: ${config.presenter.name}`;
      if (config.presenter.title) {
        markdown += `, ${config.presenter.title}`;
      }
      if (config.presenter.organization) {
        markdown += `, ${config.presenter.organization}`;
      }
      markdown += '\n\n';
    }
    
    config.slideGroups.forEach(group => {
      markdown += `${this.slideGroupToMarkdown(group)}\n`;
    });
    
    return markdown;
  }
  
  /**
   * Extracts the title from Markdown content
   * @param markdown Markdown content
   * @returns Extracted title or undefined
   */
  private extractTitle(markdown: string): string | undefined {
    const titleMatch = markdown.match(/^# (.+?)(\n|$)/m);
    if (titleMatch) {
      return titleMatch[1];
    }
    return undefined;
  }
} 