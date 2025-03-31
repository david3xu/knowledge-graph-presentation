/**
 * Markdown Loader
 * Uses browser's fetch API for loading markdown files in browser environments
 */

/**
 * Content registry for managing markdown content
 */
class MarkdownContentRegistry {
  public contentMap: Map<string, any> = new Map();
  
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
  public clearAll(): void {
    this.contentMap.clear();
  }
}

// Create singleton instance of the content registry
export const markdownContentRegistry = new MarkdownContentRegistry();

/**
 * Loader for markdown content files
 */
export class MarkdownLoader {
  /**
   * Initializes the content registry with markdown content
   * This should be called before using any markdown content
   */
  public async initializeContentRegistry(): Promise<void> {
    try {
      // Clear any existing content
      markdownContentRegistry.clearAll();
      console.log('Content registry initialized');
    } catch (error) {
      console.error('Failed to initialize content registry:', error);
      throw error;
    }
  }

  /**
   * Loads a markdown file using fetch
   * @param filePath Path to the markdown file
   * @returns Content of the markdown file
   */
  async loadMarkdown(filePath: string): Promise<string> {
    try {
      // Get the current URL path and remove any trailing slash
      const currentPath = window.location.pathname.replace(/\/$/, '');
      const basePath = currentPath || '/';
      
      // Debug logging for paths
      console.log('Path Debug:', {
        filePath,
        currentPath,
        basePath,
        location: window.location.href
      });

      // Validate file path
      if (!filePath) {
        throw new Error('File path is empty');
      }

      // Construct the full URL
      let url = filePath;
      if (!url.startsWith('http') && !url.startsWith('/')) {
        url = `${basePath}/${url}`;
      }

      // Clean up the URL (remove double slashes, etc)
      url = url.replace(/\/+/g, '/');
      
      // Debug logging for final URL
      console.log('URL Debug:', {
        originalUrl: url,
        cleanedUrl: url,
        isAbsolute: url.startsWith('http'),
        isRooted: url.startsWith('/')
      });
      
      console.log(`Fetching markdown from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Validate content
      if (!content || content.trim().length === 0) {
        throw new Error('Markdown content is empty');
      }
      
      console.log(`Successfully loaded markdown file: ${filePath} (${content.length} characters)`);
      return content;
    } catch (error) {
      console.error(`Error loading markdown file ${filePath}:`, error);
      throw new Error(`Failed to load markdown file: ${filePath}. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Loads all markdown files from a directory
   * @param dirPath Path to the directory
   * @returns Map of file paths to content
   */
  async loadMarkdownDirectory(dirPath: string): Promise<Map<string, string>> {
    // For browser environments, we need to know the files in advance
    // since browsers can't list directory contents
    const knownFiles = [
      `${dirPath}/knowledge-graph.md`
      // Add any other markdown files you know will be in the directory
    ];
    
    const result = new Map<string, string>();
    
    for (const file of knownFiles) {
      try {
        const content = await this.loadMarkdown(file);
        result.set(file, content);
      } catch (error) {
        console.error(`Error loading markdown file ${file}:`, error);
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
  // Get the current URL path and remove any trailing slash
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const basePath = currentPath || '/';

  // Debug logging for paths
  console.log('FilesList Debug:', {
    currentPath,
    basePath,
    location: window.location.href
  });

  // Validate base path
  if (!basePath) {
    console.warn('Base path is empty, using root path');
  }

  const knownFiles = [`${basePath}/content/knowledge-graph.md`];
  
  // Debug logging for file paths
  console.log('Known Files:', knownFiles);
  
  return knownFiles.map(file => {
    // Validate file path
    if (!file) {
      throw new Error('File path is empty');
    }

    // Clean up the path
    const cleanPath = file.replace(/\/+/g, '/');
    
    // Generate ID from file path (remove extension and replace path separators with dashes)
    const id = cleanPath
      .replace(/^\/content\//, '')
      .replace(/\.md$/i, '')
      .replace(/[\/\\]/g, '-');

    // Debug logging for each file
    console.log('File Debug:', {
      originalPath: file,
      cleanPath,
      id
    });
    
    return { id, path: cleanPath };
  });
}

// Create singleton instance for global use
export const markdownLoader = new MarkdownLoader();