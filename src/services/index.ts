/**
 * Services module exports
 * Provides centralized access to all service components
 */

import PresentationBuilder from './presentation-builder';
import PresentationManager from './presentation-manager';
import SlideManager from './slide-manager';
import { ExportService } from './export-service';
import { InteractionService } from './interaction-service';
import { ThemeService } from './theme-service';

// Core services
export { default as PresentationBuilder } from './presentation-builder';
export { default as PresentationManager } from './presentation-manager';
export { default as SlideManager } from './slide-manager';
export { ExportService } from './export-service';
export { InteractionService } from './interaction-service';
export { ThemeService } from './theme-service';

export class MarkdownContentRegistry {
  private contentMap: Map<string, any> = new Map();
  
  /**
   * Registers content with an identifier
   * @param id Content identifier
   * @param content Content to register
   */
  public registerContent(id: string, content: any): void {
    this.contentMap.set(id, content);
  }
  
  /**
   * Retrieves content by identifier
   * @param id Content identifier
   * @returns Registered content or throws if not found
   */
  public getContent(id: string): any {
    const content = this.contentMap.get(id);
    if (!content) {
      throw new Error(`Content with id "${id}" not found in registry`);
    }
    return content;
  }
  
  /**
   * Checks if content exists
   * @param id Content identifier
   * @returns True if content exists, false otherwise
   */
  public hasContent(id: string): boolean {
    return this.contentMap.has(id);
  }
  
  /**
   * Removes content by identifier
   * @param id Content identifier
   * @returns True if content was removed, false if not found
   */
  public removeContent(id: string): boolean {
    return this.contentMap.delete(id);
  }
  
  /**
   * Gets all content identifiers
   * @returns Array of content identifiers
   */
  public getContentIds(): string[] {
    return Array.from(this.contentMap.keys());
  }
  
  /**
   * Clears all registered content
   */
  public clear(): void {
    this.contentMap.clear();
  }
}

// Export a singleton instance of the content registry
export const markdownContentRegistry = new MarkdownContentRegistry();

/**
 * Initialize all required services and return them as a bundle
 * @param container DOM container for the presentation
 * @returns Object containing initialized services
 */
export function initializeServices(container: HTMLElement) {
  // Create SlideManager
  const slideManager = new SlideManager({ 
    container,
    initializeImmediately: true 
  });
  
  // Create PresentationManager and connect to SlideManager
  const presentationManager = new PresentationManager();
  presentationManager.setSlideManager(slideManager);
  
  // Create PresentationBuilder
  const presentationBuilder = new PresentationBuilder();
  
  return {
    slideManager,
    presentationManager,
    presentationBuilder,
    contentRegistry: markdownContentRegistry
  };
}