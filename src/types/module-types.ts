/**
 * Type definitions for module system architecture
 */
import { SlideGroup } from './slide-data';

/**
 * Options interface that all module options should extend
 */
export interface BaseModuleOptions {
  /** Whether to highlight key terms in content */
  highlightKeyTerms?: boolean;
  
  /** Whether to include section slides */
  includeSectionSlide?: boolean;
  
  /** Whether to include advanced/detailed content */
  includeAdvancedContent?: boolean;
  
  /** Custom classes to apply to slides */
  customClasses?: string[];
}

/**
 * Function signature for slide group factory functions
 */
export type SlideGroupFactory<T extends BaseModuleOptions = BaseModuleOptions> = (options?: T) => SlideGroup;

/**
 * Module API interface that defines what each domain module must export
 */
export interface ModuleApi<T extends BaseModuleOptions = BaseModuleOptions> {
  /** Main function to get all slides for this module */
  getSlides: SlideGroupFactory<T>;
  
  /** Optional function to get only a specific subset of slides */
  getCustomSlides?: (slideIds: string[], options?: T) => SlideGroup;
  
  /** Metadata about this module */
  metadata: {
    /** Module name/title */
    title: string;
    
    /** Module description */
    description: string;
    
    /** List of slide IDs available in this module */
    availableSlides: string[];
    
    /** Last modified timestamp */
    lastModified: string;
  };
} 