// src/utils/templates/data-transformer.ts

import { DataTransformer } from './base-types';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

/**
 * Base implementation of DataTransformer with standard patterns
 */
export abstract class BaseDataTransformer implements DataTransformer {
  /**
   * Retrieves and transforms content with comprehensive error handling
   * @param contentId Content identifier in the registry
   * @param options Transformation options
   */
  public transformContent(contentId: string, options?: any): any {
    try {
      const rawContent = this.getContentFromRegistry(contentId);
      return this.transformContentImpl(rawContent, options);
    } catch (error) {
      return this.handleTransformationError(error as Error, contentId);
    }
  }
  
  /**
   * Standardized error handling with fallback content generation
   * @param error Error that occurred during transformation
   * @param contentId Content identifier that failed
   */
  public handleTransformationError(error: Error, contentId: string): any {
    console.error(`Transformation error for content "${contentId}":`, error);
    
    // Return fallback content structure
    return {
      error: true,
      message: `Failed to transform content: ${error.message}`,
      contentId,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Protected registry access with error boundary
   * @param contentId Content identifier
   */
  protected getContentFromRegistry(contentId: string): any {
    try {
      return markdownContentRegistry.getContent(contentId);
    } catch (error) {
      throw new Error(`Content not found: ${contentId}`);
    }
  }
  
  /**
   * Domain-specific implementation of content transformation
   * @param rawContent Raw content from registry
   * @param options Transformation options
   */
  protected abstract transformContentImpl(rawContent: any, options?: any): any;
}