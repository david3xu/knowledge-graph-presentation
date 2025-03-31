/**
 * Registry for storing and retrieving parsed markdown content
 * This service acts as a central repository for all content used in the presentation
 */
export class MarkdownContentRegistry {
  private contentMap: Map<string, any> = new Map();
  
  /**
   * Registers parsed markdown content with an identifier
   * @param id Unique identifier for the content
   * @param content Parsed content object
   */
  registerContent(id: string, content: any): void {
    this.contentMap.set(id, content);
  }
  
  /**
   * Batch registers multiple content items
   * @param contentEntries Array of id-content pairs
   */
  registerBatch(contentEntries: Array<[string, any]>): void {
    contentEntries.forEach(([id, content]) => {
      this.registerContent(id, content);
    });
  }
  
  /**
   * Retrieves content by identifier
   * @param id Content identifier
   * @returns The stored content
   * @throws Error if content is not found
   */
  getContent(id: string): any {
    const content = this.contentMap.get(id);
    if (!content) {
      throw new Error(`Content with id "${id}" not found in registry`);
    }
    return content;
  }
  
  /**
   * Safely retrieves content by identifier with optional fallback
   * @param id Content identifier
   * @param fallback Optional fallback value if content not found
   * @returns The stored content or fallback
   */
  safeGetContent(id: string, fallback: any = null): any {
    try {
      return this.getContent(id);
    } catch (error) {
      return fallback;
    }
  }
  
  /**
   * Checks if content exists in the registry
   * @param id Content identifier
   * @returns Boolean indicating whether content exists
   */
  hasContent(id: string): boolean {
    return this.contentMap.has(id);
  }
  
  /**
   * Lists all available content identifiers
   * @returns Array of content identifiers
   */
  listContentIds(): string[] {
    return Array.from(this.contentMap.keys());
  }
  
  /**
   * Removes content from the registry
   * @param id Content identifier
   * @returns Boolean indicating whether content was removed
   */
  removeContent(id: string): boolean {
    return this.contentMap.delete(id);
  }
  
  /**
   * Clears all content from the registry
   */
  clearAll(): void {
    this.contentMap.clear();
  }
}

// Create a singleton instance for global use
export const markdownContentRegistry = new MarkdownContentRegistry();