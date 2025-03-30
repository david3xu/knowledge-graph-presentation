/**
 * PresentationBuilder service
 * Provides a fluent API for composing presentation configurations from modules
 */
import { PresentationConfig, SlideGroup } from '../types/slide-data';

/**
 * Presenter information interface
 */
export interface PresenterInfo {
  /** Presenter's name */
  name: string;
  
  /** Presenter's title/role (optional) */
  title?: string;
  
  /** Presenter's organization (optional) */
  organization?: string;
  
  /** Presenter's email (optional) */
  email?: string;
}

/**
 * Presentation settings interface
 */
export interface PresentationSettings {
  /** Default transition for all slides */
  defaultTransition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  
  /** Show slide numbers */
  showSlideNumber?: 'all' | 'print' | 'speaker' | false;
  
  /** Enable keyboard navigation */
  keyboard?: boolean;
  
  /** Show navigation controls */
  controls?: boolean;
  
  /** Show progress bar */
  progress?: boolean;
  
  /** Center slide content vertically */
  center?: boolean;
  
  /** Theme to use */
  theme?: 'black' | 'white' | 'league' | 'beige' | 'sky' | 'night' | 'serif' | 'simple' | 'custom';
  
  /** Custom theme path (if theme is 'custom') */
  customThemePath?: string;
}

/**
 * PresentationBuilder service for composing presentation configurations
 * Provides a fluent API for building presentations from modular components
 */
export class PresentationBuilder {
  private title: string = '';
  private presenter: PresenterInfo | null = null;
  private slideGroups: SlideGroup[] = [];
  private settings: PresentationSettings = {
    theme: 'black',
    defaultTransition: 'slide',
    showSlideNumber: 'all',
    controls: true,
    progress: true,
    center: true,
    keyboard: true
  };
  
  /**
   * Sets the presentation title
   * @param title Presentation title
   * @returns Builder instance for method chaining
   */
  public setTitle(title: string): PresentationBuilder {
    this.title = title;
    return this;
  }
  
  /**
   * Sets the presenter information
   * @param presenter Presenter information object
   * @returns Builder instance for method chaining
   */
  public setPresenter(presenter: PresenterInfo): PresentationBuilder {
    this.presenter = presenter;
    return this;
  }
  
  /**
   * Adds a slide group to the presentation
   * @param slideGroup Slide group to add
   * @returns Builder instance for method chaining
   */
  public addSlideGroup(slideGroup: SlideGroup): PresentationBuilder {
    this.slideGroups.push(slideGroup);
    return this;
  }
  
  /**
   * Adds multiple slide groups to the presentation
   * @param slideGroups Array of slide groups to add
   * @returns Builder instance for method chaining
   */
  public addSlideGroups(slideGroups: SlideGroup[]): PresentationBuilder {
    this.slideGroups = [...this.slideGroups, ...slideGroups];
    return this;
  }
  
  /**
   * Adds a module's slides to the presentation with runtime options
   * This allows for dynamic content generation based on context
   * @param moduleFactory Factory function that produces a slide group
   * @returns Builder instance for method chaining
   */
  public addModuleContent(moduleFactory: () => SlideGroup): PresentationBuilder {
    const slideGroup = moduleFactory();
    this.slideGroups.push(slideGroup);
    return this;
  }
  
  /**
   * Updates presentation settings
   * @param settings Partial settings object to merge with current settings
   * @returns Builder instance for method chaining
   */
  public updateSettings(settings: Partial<PresentationSettings>): PresentationBuilder {
    this.settings = { ...this.settings, ...settings };
    return this;
  }
  
  /**
   * Sets presentation theme
   * @param theme Theme name
   * @param customPath Optional custom theme path
   * @returns Builder instance for method chaining
   */
  public setTheme(theme: PresentationSettings['theme'], customPath?: string): PresentationBuilder {
    this.settings.theme = theme;
    if (theme === 'custom' && customPath) {
      this.settings.customThemePath = customPath;
    }
    return this;
  }
  
  /**
   * Sets default transition for all slides
   * @param transition Transition type
   * @returns Builder instance for method chaining
   */
  public setDefaultTransition(transition: PresentationSettings['defaultTransition']): PresentationBuilder {
    this.settings.defaultTransition = transition;
    return this;
  }
  
  /**
   * Clears all current slide groups
   * @returns Builder instance for method chaining
   */
  public clearContent(): PresentationBuilder {
    this.slideGroups = [];
    return this;
  }
  
  /**
   * Reorders slide groups by moving a group to a specific position
   * @param fromIndex Current index of the slide group
   * @param toIndex Target index for the slide group
   * @returns Builder instance for method chaining
   */
  public reorderSlideGroup(fromIndex: number, toIndex: number): PresentationBuilder {
    if (fromIndex < 0 || fromIndex >= this.slideGroups.length ||
        toIndex < 0 || toIndex >= this.slideGroups.length || fromIndex === toIndex) {
      return this;
    }
    
    const [removed] = this.slideGroups.splice(fromIndex, 1);
    this.slideGroups.splice(toIndex, 0, removed);
    return this;
  }
  
  /**
   * Builds the complete presentation configuration
   * @returns Fully constructed presentation configuration object
   */
  public build(): PresentationConfig {
    return {
      title: this.title,
      presenter: this.presenter ? { ...this.presenter } : undefined,
      slideGroups: this.slideGroups,
      settings: this.settings
    };
  }
  
  /**
   * Creates a copy of an existing presentation configuration for modification
   * @param config Existing presentation configuration
   * @returns Builder instance initialized with the provided configuration
   */
  public static fromExisting(config: PresentationConfig): PresentationBuilder {
    const builder = new PresentationBuilder();
    builder.title = config.title;
    builder.presenter = config.presenter || null;
    builder.slideGroups = [...config.slideGroups];
    builder.settings = { ...config.settings };
    return builder;
  }
  
  /**
   * Creates a minimal presentation configuration with essential slides
   * @param title Presentation title
   * @param presenterName Presenter name
   * @returns Builder instance with basic configuration
   */
  public static createBasicPresentation(title: string, presenterName: string): PresentationBuilder {
    const builder = new PresentationBuilder();
    builder.title = title;
    builder.presenter = { name: presenterName };
    
    // This would ideally use the basic slide templates, but this is a minimal implementation
    // In a real implementation, you would import and use the appropriate slide generators
    
    return builder;
  }
}

export default PresentationBuilder;