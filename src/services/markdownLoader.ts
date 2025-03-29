/**
 * MarkdownLoader service
 * Loads and processes markdown files for use in the presentation
 */

export class MarkdownLoader {
  /**
   * Loads a markdown file from the given path
   * @param filePath Path to the markdown file
   * @returns Promise resolving to the markdown content
   */
  async loadMarkdown(filePath: string): Promise<string> {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${filePath} (${response.status})`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error loading markdown:`, error);
      throw error;
    }
  }
} 