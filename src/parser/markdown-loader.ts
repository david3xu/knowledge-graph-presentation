/**
 * Markdown Loader
 * Handles loading markdown files from the file system
 */
import fs from 'fs';
import path from 'path';

/**
 * Loader for markdown content files
 */
export class MarkdownLoader {
  /**
   * Loads a markdown file from the file system
   * @param filePath Path to the markdown file
   * @returns Content of the markdown file
   */
  async loadMarkdown(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`Error loading markdown file ${filePath}:`, error);
      throw new Error(`Failed to load markdown file: ${filePath}`);
    }
  }
  
  /**
   * Loads all markdown files from a directory
   * @param dirPath Path to the directory
   * @returns Map of file paths to content
   */
  async loadMarkdownDirectory(dirPath: string): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    const files = await this.getMarkdownFilesInDirectory(dirPath);
    
    for (const file of files) {
      const content = await this.loadMarkdown(file);
      result.set(file, content);
    }
    
    return result;
  }
  
  /**
   * Gets all markdown files in a directory and its subdirectories
   * @param dirPath Path to the directory
   * @returns Array of file paths
   */
  private async getMarkdownFilesInDirectory(dirPath: string): Promise<string[]> {
    const result: string[] = [];
    
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const nestedFiles = await this.getMarkdownFilesInDirectory(fullPath);
        result.push(...nestedFiles);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
        result.push(fullPath);
      }
    }
    
    return result;
  }
}

/**
 * Returns a list of markdown files with their IDs
 * @returns Array of {id, path} objects
 */
export async function getMarkdownFilesList(): Promise<Array<{id: string, path: string}>> {
  const basePath = path.resolve('docs/presentation-content');
  const loader = new MarkdownLoader();
  
  // Use the public method to get files from the directory
  const files: string[] = [];
  const contentMap = await loader.loadMarkdownDirectory(basePath);
  contentMap.forEach((_, filePath) => {
    files.push(filePath);
  });
  
  return files.map(file => {
    // Generate ID from file path relative to base path
    const relativePath = path.relative(basePath, file);
    // Remove extension and replace path separators with dashes
    const id = relativePath
      .replace(/\.md$/i, '')
      .replace(/[\/\\]/g, '-');
    
    return { id, path: file };
  });
}

// Create singleton instance for global use
export const markdownLoader = new MarkdownLoader(); 