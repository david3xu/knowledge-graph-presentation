/**
 * Enhanced Markdown Parser
 * Extends basic markdown parsing with structured data extraction for visualizations
 */
import { marked } from 'marked';
import yaml from 'js-yaml';

/**
 * Parser for enhanced markdown with structured data extraction
 */
export class EnhancedMarkdownParser {
  /**
   * Parses markdown content and extracts structured data
   * @param content Raw markdown content
   * @returns Parsed content with structured data
   */
  parse(content: string): any {
    const result: any = {
      rawContent: content,
      html: this.parseToHtml(content),
      metadata: this.extractFrontMatter(content),
      title: this.extractTitle(content),
      sections: this.extractSections(content),
    };
    
    // Extract specific visualization data if present
    if (this.hasGraphData(content)) {
      result.entities = this.extractEntities(content);
      result.relationships = this.extractRelationships(content);
    }
    
    if (this.hasTimelineData(content)) {
      result.timelineSections = this.extractTimelineSections(content);
    }
    
    if (this.hasTableData(content)) {
      result.tableData = this.extractTableData(content);
    }
    
    // Extract presentation-specific data
    result.mainDefinition = this.extractDefinition(content);
    result.keyPoints = this.extractKeyPoints(content);
    result.presenterNotes = this.extractPresenterNotes(content);
    result.focusEntities = this.extractFocusEntities(content);
    
    return result;
  }
  
  /**
   * Parses markdown to HTML using marked
   * @param content Raw markdown content
   * @returns HTML string
   */
  private parseToHtml(content: string): string {
    // Use marked.parse with explicit options to ensure synchronous behavior
    return marked.parse(this.removeFrontMatter(content), { async: false }) as string;
  }
  
  /**
   * Extracts front matter YAML from markdown
   * @param content Raw markdown content with front matter
   * @returns Parsed front matter object or empty object if none
   */
  private extractFrontMatter(content: string): any {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontMatterMatch) {
      return {};
    }
    
    try {
      return yaml.load(frontMatterMatch[1]) || {};
    } catch (error) {
      console.error('Error parsing front matter:', error);
      return {};
    }
  }
  
  /**
   * Removes front matter from markdown content
   * @param content Raw markdown content with front matter
   * @returns Content without front matter
   */
  private removeFrontMatter(content: string): string {
    return content.replace(/^---\n[\s\S]*?\n---\n/, '');
  }
  
  /**
   * Extracts title from markdown content
   * @param content Markdown content
   * @returns Title string or undefined
   */
  private extractTitle(content: string): string | undefined {
    const titleMatch = content.match(/^# (.*?)$/m);
    return titleMatch ? titleMatch[1] : undefined;
  }
  
  /**
   * Extracts main sections from markdown content
   * @param content Markdown content
   * @returns Array of section objects with title and content
   */
  private extractSections(content: string): Array<{title: string, content: string}> {
    const cleanContent = this.removeFrontMatter(content);
    const sectionMatches = Array.from(cleanContent.matchAll(/^## (.*?)$([\s\S]*?)(?=^## |\n$)/gm));
    const sections: Array<{title: string, content: string}> = [];
    
    for (const match of sectionMatches) {
      sections.push({
        title: match[1],
        content: match[2].trim()
      });
    }
    
    return sections;
  }
  
  /**
   * Checks if content has graph data (entities and relationships)
   */
  private hasGraphData(content: string): boolean {
    return content.includes('## Entities') && content.includes('## Relationships');
  }
  
  /**
   * Extracts entity definitions from markdown
   * Format: - id: entityId
   *           name: Entity Name
   *           type: Entity Type
   */
  private extractEntities(content: string): Array<{id: string, name: string, type: string}> {
    const entitiesMatch = content.match(/## Entities\s+([\s\S]*?)(?=^##|$)/m);
    if (!entitiesMatch) {
      return [];
    }
    
    const entitiesBlock = entitiesMatch[1];
    const entityMatches = Array.from(entitiesBlock.matchAll(/- id: (.*?)(?:\n\s+|\r\n\s+)name: (.*?)(?:\n\s+|\r\n\s+)type: (.*?)(?:\n|$)/g));
    const entities: Array<{id: string, name: string, type: string}> = [];
    
    for (const match of entityMatches) {
      entities.push({
        id: match[1].trim(),
        name: match[2].trim(),
        type: match[3].trim()
      });
    }
    
    return entities;
  }
  
  /**
   * Extracts relationship definitions from markdown
   * Format: - source: sourceId
   *           target: targetId
   *           type: RelationType
   */
  private extractRelationships(content: string): Array<{source: string, target: string, type: string}> {
    const relationshipsMatch = content.match(/## Relationships\s+([\s\S]*?)(?=^##|$)/m);
    if (!relationshipsMatch) {
      return [];
    }
    
    const relationshipsBlock = relationshipsMatch[1];
    const relationshipMatches = Array.from(relationshipsBlock.matchAll(/- source: (.*?)(?:\n\s+|\r\n\s+)target: (.*?)(?:\n\s+|\r\n\s+)type: (.*?)(?:\n|$)/g));
    const relationships: Array<{source: string, target: string, type: string}> = [];
    
    for (const match of relationshipMatches) {
      relationships.push({
        source: match[1].trim(),
        target: match[2].trim(),
        type: match[3].trim()
      });
    }
    
    return relationships;
  }
  
  /**
   * Checks if content has timeline data
   */
  private hasTimelineData(content: string): boolean {
    return content.includes('## Timeline Sections');
  }
  
  /**
   * Extracts timeline sections from markdown
   * Format: - timePeriod: period
   *           title: Title
   *           bulletPoints:
   *             - Point 1
   *             - Point 2
   */
  private extractTimelineSections(content: string): Array<{timePeriod: string, title: string, bulletPoints: string[]}> {
    const timelineMatch = content.match(/## Timeline Sections\s+([\s\S]*?)(?=^##|$)/m);
    if (!timelineMatch) {
      return [];
    }
    
    const timelineBlock = timelineMatch[1];
    const sectionMatches = timelineBlock.split(/- timePeriod:/g).slice(1);
    const sections: Array<{timePeriod: string, title: string, bulletPoints: string[]}> = [];
    
    for (const section of sectionMatches) {
      const periodMatch = section.match(/^\s*(.*?)(?:\n\s+|\r\n\s+)title:/);
      const titleMatch = section.match(/title:\s*(.*?)(?:\n\s+|\r\n\s+)bulletPoints:/);
      const pointsMatch = section.match(/bulletPoints:(?:\s*(?:\n\s+|\r\n\s+)- (.*?))+(?:\n|$)/g);
      
      if (periodMatch && titleMatch) {
        const bulletPoints: string[] = [];
        if (pointsMatch) {
          const pointsText = pointsMatch[0];
          const pointMatches = Array.from(pointsText.matchAll(/- (.*?)(?:\n|$)/g));
          for (const match of pointMatches) {
            bulletPoints.push(match[1].trim());
          }
        }
        
        sections.push({
          timePeriod: periodMatch[1].trim(),
          title: titleMatch[1].trim(),
          bulletPoints
        });
      }
    }
    
    return sections;
  }
  
  /**
   * Checks if content has table data
   */
  private hasTableData(content: string): boolean {
    return content.includes('## Table Data');
  }
  
  /**
   * Extracts table data from markdown
   * Uses standard markdown table format
   */
  private extractTableData(content: string): any {
    const tableMatch = content.match(/## Table Data\s+([\s\S]*?)(?=^##|$)/m);
    if (!tableMatch) {
      return null;
    }
    
    const tableBlock = tableMatch[1];
    const rows = tableBlock.trim().split('\n');
    
    if (rows.length < 3) {
      return null; // Need header row, separator row, and at least one data row
    }
    
    // Extract headers
    const headerRow = rows[0].trim();
    const headers = headerRow
      .replace(/^\||\|$/g, '') // Remove outer pipes
      .split('|')
      .map(header => header.trim());
    
    // Skip the separator row (index 1)
    
    // Extract data rows
    const dataRows: any[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row || !row.includes('|')) continue;
      
      const cells = row
        .replace(/^\||\|$/g, '') // Remove outer pipes
        .split('|')
        .map(cell => cell.trim());
      
      // Create object mapping headers to cell values
      const rowObject: any = {};
      headers.forEach((header, index) => {
        rowObject[header] = cells[index] || '';
      });
      
      dataRows.push(rowObject);
    }
    
    return {
      headers,
      rows: dataRows
    };
  }
  
  /**
   * Extracts the main definition from markdown
   * Format: ## Definition
   *         Text of definition
   */
  private extractDefinition(content: string): string | undefined {
    const definitionMatch = content.match(/## Definition\s+([\s\S]*?)(?=^##|$)/m);
    return definitionMatch ? definitionMatch[1].trim() : undefined;
  }
  
  /**
   * Extracts key points from markdown
   * Format: ## Key Points
   *         - Point 1
   *         - Point 2
   */
  private extractKeyPoints(content: string): string[] {
    const keyPointsMatch = content.match(/## Key Points\s+([\s\S]*?)(?=^##|$)/m);
    if (!keyPointsMatch) {
      return [];
    }
    
    const keyPointsBlock = keyPointsMatch[1];
    const pointMatches = Array.from(keyPointsBlock.matchAll(/- (.*?)(?:\n|$)/g));
    const points: string[] = [];
    
    for (const match of pointMatches) {
      points.push(match[1].trim());
    }
    
    return points;
  }
  
  /**
   * Extracts presenter notes from markdown
   * Format: ## Presenter Notes
   *         Text of notes
   */
  private extractPresenterNotes(content: string): string | undefined {
    const notesMatch = content.match(/## Presenter Notes\s+([\s\S]*?)(?=^##|$)/m);
    return notesMatch ? notesMatch[1].trim() : undefined;
  }
  
  /**
   * Extracts focus entities from markdown
   * Format: ## Focus Entities
   *         - entity1
   *         - entity2
   */
  private extractFocusEntities(content: string): string[] {
    const focusMatch = content.match(/## Focus Entities\s+([\s\S]*?)(?=^##|$)/m);
    if (!focusMatch) {
      return [];
    }
    
    const focusBlock = focusMatch[1];
    const entityMatches = Array.from(focusBlock.matchAll(/- (.*?)(?:\n|$)/g));
    const entities: string[] = [];
    
    for (const match of entityMatches) {
      entities.push(match[1].trim());
    }
    
    return entities;
  }

  parseToSlideGroups(markdown: string): any[] {
    const sections = this.extractSections(markdown);
    return sections.map(section => ({
      title: section.title,
      slides: [{
        title: section.title,
        content: {
          text: section.content
        }
      }]
    }));
  }
} 