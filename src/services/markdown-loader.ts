/**
 * Service for loading and parsing markdown content
 */
import { markdownContentRegistry } from './markdown-content-registry';

export class MarkdownLoader {
  /**
   * Initializes the content registry with markdown content
   * This should be called before using any markdown content
   */
  public async initializeContentRegistry(): Promise<void> {
    try {
      // TODO: Implement actual markdown loading logic
      // For now, we'll just clear any existing content
      markdownContentRegistry.clearAll();
      console.log('Content registry initialized');
    } catch (error) {
      console.error('Failed to initialize content registry:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const markdownLoader = new MarkdownLoader(); 