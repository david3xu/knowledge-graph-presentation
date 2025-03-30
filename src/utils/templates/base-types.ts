// src/utils/templates/base-types.ts

import { SlideConfig, SlideGroup } from '../../types/slide-data';

/**
 * Core options interface for module configuration
 */
export interface ModuleOptions {
  /** Extension point for module-specific options */
  [key: string]: any;
}

/**
 * Contract for data transformation operations
 */
export interface DataTransformer {
  /** Registry content retrieval with domain-specific transformation */
  transformContent(contentId: string, options?: any): any;
  
  /** Error handling for content transformation */
  handleTransformationError(error: Error, contentId: string): any;
}

/**
 * Contract for configuration generation
 */
export interface ConfigFactory {
  /** Creates visualization configuration based on type and domain requirements */
  createConfig(visualizationType: string, data: any, options?: any): any;
  
  /** Extends configuration with domain-specific overrides */
  extendConfig(baseConfig: any, overrides: any): any;
}

/**
 * Contract for slide creation
 */
export interface SlideFactory {
  /** Creates standard slide structures */
  createSlide(id: string, title: string, content: any, visualizationConfig: any, options?: any): SlideConfig;
  
  /** Assembles slides into coherent groups */
  createSlideGroup(title: string, id: string, slides: SlideConfig[], options?: any): SlideGroup;
}

/**
 * Module integration contract
 */
export interface ModuleTemplate<T extends ModuleOptions> {
  /** Creates domain-specific slides with appropriate options */
  createSlides(options: T): SlideGroup;
}