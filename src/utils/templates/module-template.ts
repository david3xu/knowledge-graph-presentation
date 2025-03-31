// src/utils/templates/module-template.ts

import { ModuleTemplate, ModuleOptions, DataTransformer, ConfigFactory, SlideFactory } from './base-types';
import { SlideGroup } from '../../types/slide-data';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

/**
 * Abstract base class for module implementation
 */
export abstract class BaseModuleTemplate<T extends ModuleOptions> implements ModuleTemplate<T> {
  /** Data transformer component */
  protected dataTransformer: DataTransformer;
  
  /** Configuration factory component */
  protected configFactory: ConfigFactory;
  
  /** Slide factory component */
  protected slideFactory: SlideFactory;
  
  /**
   * Creates a new module template with injected components
   * @param dataTransformer Data transformation component
   * @param configFactory Configuration generation component
   * @param slideFactory Slide creation component
   */
  constructor(
    dataTransformer: DataTransformer,
    configFactory: ConfigFactory,
    slideFactory: SlideFactory
  ) {
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  /**
   * Creates slides for this module
   * @param options Module-specific options
   */
  public abstract createSlides(options: T): SlideGroup;
  
  /**
   * Retrieves module metadata from registry
   * @param metadataId Metadata identifier
   */
  protected getModuleMetadata(metadataId: string): any {
    try {
      // Try to use safeGetContent if available, fall back to normal getContent if not
      if (typeof markdownContentRegistry.safeGetContent === 'function') {
        return markdownContentRegistry.safeGetContent(metadataId, {}) || {};
      } else {
        return markdownContentRegistry.getContent(metadataId) || {};
      }
    } catch (error) {
      console.warn(`Module metadata not found: ${metadataId}`);
      
      // Default metadata for common modules
      const defaultMetadata: Record<string, any> = {
        'intro-group-metadata': { id: 'intro', title: 'Introduction to Knowledge Graphs', classes: ['intro-section'] },
        'core-components-metadata': { id: 'core-components', title: 'Core Components', classes: ['components-section'] },
        'data-models-metadata': { id: 'data-models', title: 'Data Models', classes: ['models-section'] },
      };
      
      return defaultMetadata[metadataId] || {};
    }
  }
}

/**
 * Factory for creating modules with standardized components
 */
export class ModuleFactory {
  /**
   * Creates a module with standard components
   * @param ModuleClass Module implementation class
   * @param DataTransformerClass Data transformer implementation
   * @param ConfigFactoryClass Configuration factory implementation
   * @param SlideFactoryClass Slide factory implementation
   */
  public static createModule<
    M extends BaseModuleTemplate<O>,
    D extends DataTransformer,
    C extends ConfigFactory,
    S extends SlideFactory,
    O extends ModuleOptions
  >(
    ModuleClass: new (dt: D, cf: C, sf: S) => M,
    DataTransformerClass: new () => D,
    ConfigFactoryClass: new () => C,
    SlideFactoryClass: new () => S
  ): M {
    const dataTransformer = new DataTransformerClass();
    const configFactory = new ConfigFactoryClass();
    const slideFactory = new SlideFactoryClass();
    
    return new ModuleClass(dataTransformer, configFactory, slideFactory);
  }
}