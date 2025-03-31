/**
 * Responsive Utilities
 * Provides functions for responsive layout handling and device adaptation
 */

/**
 * Represents the screen size categories
 */
export enum ScreenSize {
    XS = 'xs',   // Extra Small (mobile phones)
    SM = 'sm',   // Small (mobile phones - landscape)
    MD = 'md',   // Medium (tablets)
    LG = 'lg',   // Large (desktops)
    XL = 'xl',   // Extra Large (large desktops)
    XXL = 'xxl'  // Extra Extra Large (ultra-wide)
  }
  
  /**
   * Breakpoint configuration
   */
  export interface BreakpointConfig {
    /** Minimum width for this breakpoint (inclusive) */
    min: number;
    
    /** Maximum width for this breakpoint (exclusive) */
    max: number;
  }
  
  /**
   * Default responsive breakpoints (in pixels)
   */
  export const DEFAULT_BREAKPOINTS: Record<ScreenSize, BreakpointConfig> = {
    [ScreenSize.XS]: { min: 0, max: 576 },
    [ScreenSize.SM]: { min: 576, max: 768 },
    [ScreenSize.MD]: { min: 768, max: 992 },
    [ScreenSize.LG]: { min: 992, max: 1200 },
    [ScreenSize.XL]: { min: 1200, max: 1600 },
    [ScreenSize.XXL]: { min: 1600, max: Infinity }
  };
  
  /**
   * Type for breakpoint-specific values
   */
  export type ResponsiveValue<T> = {
    [key in ScreenSize]?: T;
  } & {
    base: T; // Default value for all screen sizes
  };
  
  /**
   * Responsive handler configuration
   */
  export interface ResponsiveHandlerConfig {
    /** Custom breakpoints configuration */
    breakpoints?: Record<ScreenSize, BreakpointConfig>;
    
    /** Initial screen size detection delay in milliseconds */
    initialDelay?: number;
    
    /** Debounce time for resize events in milliseconds */
    debounceTime?: number;
  }
  
  /**
   * Type for screen size change callback
   */
  export type ScreenSizeChangeCallback = (
    newSize: ScreenSize,
    previousSize: ScreenSize | null
  ) => void;
  
  /**
   * Class for handling responsive layouts and device adaptation
   */
  export class ResponsiveHandler {
    private breakpoints: Record<ScreenSize, BreakpointConfig>;
    private currentScreenSize: ScreenSize | null = null;
    private subscribers: Set<ScreenSizeChangeCallback> = new Set();
    private resizeTimeout: number | null = null;
    private debounceTime: number;
    private resizeObserver: ResizeObserver | null = null;
    
    /**
     * Creates a new responsive handler
     * @param config Configuration options
     */
    constructor(config?: ResponsiveHandlerConfig) {
      this.breakpoints = config?.breakpoints || DEFAULT_BREAKPOINTS;
      this.debounceTime = config?.debounceTime || 250;
      
      // Detect initial screen size after a small delay
      setTimeout(() => {
        this.detectScreenSize();
        this.setupEventListeners();
      }, config?.initialDelay || 0);
    }
    
    /**
     * Sets up event listeners for screen size changes
     */
    private setupEventListeners(): void {
      // Listen for window resize events
      window.addEventListener('resize', this.handleResize);
      
      // Use ResizeObserver for more reliable detection
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(document.documentElement);
      }
      
      // Listen for orientation change on mobile devices
      window.addEventListener('orientationchange', this.handleResize);
    }
    
    /**
     * Handles resize events with debouncing
     */
    private handleResize = (): void => {
      if (this.resizeTimeout) {
        window.clearTimeout(this.resizeTimeout);
      }
      
      this.resizeTimeout = window.setTimeout(() => {
        this.detectScreenSize();
      }, this.debounceTime);
    };
    
    /**
     * Detects the current screen size based on viewport width
     */
    private detectScreenSize(): void {
      const width = window.innerWidth;
      let newSize: ScreenSize | null = null;
      
      // Find matching breakpoint
      for (const [size, { min, max }] of Object.entries(this.breakpoints)) {
        if (width >= min && width < max) {
          newSize = size as ScreenSize;
          break;
        }
      }
      
      // If no matching breakpoint found, use XS as default
      if (!newSize) {
        newSize = ScreenSize.XS;
      }
      
      // Notify subscribers if screen size changed
      if (newSize !== this.currentScreenSize) {
        const previousSize = this.currentScreenSize;
        this.currentScreenSize = newSize;
        
        this.notifySubscribers(newSize, previousSize);
      }
    }
    
    /**
     * Notifies all subscribers of a screen size change
     * @param newSize New screen size
     * @param previousSize Previous screen size
     */
    private notifySubscribers(newSize: ScreenSize, previousSize: ScreenSize | null): void {
      this.subscribers.forEach(callback => {
        try {
          callback(newSize, previousSize);
        } catch (error) {
          console.error('Error in screen size change callback:', error);
        }
      });
    }
    
    /**
     * Gets the current screen size
     * @returns Current screen size or null if not yet detected
     */
    public getCurrentScreenSize(): ScreenSize | null {
      return this.currentScreenSize;
    }
    
    /**
     * Subscribes to screen size changes
     * @param callback Function to call when screen size changes
     * @returns Unsubscribe function
     */
    public subscribe(callback: ScreenSizeChangeCallback): () => void {
      this.subscribers.add(callback);
      
      // Immediately notify with current size if available
      if (this.currentScreenSize !== null) {
        callback(this.currentScreenSize, null);
      }
      
      // Return unsubscribe function
      return () => {
        this.subscribers.delete(callback);
      };
    }
    
    /**
     * Gets a value based on the current screen size
     * @param values Responsive values object
     * @returns The appropriate value for the current screen size
     */
    public getValue<T>(values: ResponsiveValue<T>): T {
      if (!this.currentScreenSize) {
        return values.base;
      }
      
      // Get the closest applicable value
      // If the exact size doesn't exist, fall back to smaller sizes
      const sizeOrder: ScreenSize[] = [
        ScreenSize.XS,
        ScreenSize.SM,
        ScreenSize.MD,
        ScreenSize.LG,
        ScreenSize.XL,
        ScreenSize.XXL
      ];
      
      const currentSizeIndex = sizeOrder.indexOf(this.currentScreenSize);
      
      // Check current size and fall back to progressively smaller sizes
      for (let i = currentSizeIndex; i >= 0; i--) {
        const size = sizeOrder[i];
        if (values[size] !== undefined) {
          return values[size] as T;
        }
      }
      
      // If no match found, use base value
      return values.base;
    }
    
    /**
     * Checks if the current screen size matches a specific size
     * @param size Screen size to check
     * @returns True if current screen size matches
     */
    public isScreenSize(size: ScreenSize): boolean {
      return this.currentScreenSize === size;
    }
    
    /**
     * Checks if the current screen size is at least the specified size
     * @param size Minimum screen size
     * @returns True if current screen size is at least the specified size
     */
    public isMinScreenSize(size: ScreenSize): boolean {
      if (!this.currentScreenSize) return false;
      
      const sizeOrder: ScreenSize[] = [
        ScreenSize.XS,
        ScreenSize.SM,
        ScreenSize.MD,
        ScreenSize.LG,
        ScreenSize.XL,
        ScreenSize.XXL
      ];
      
      const currentSizeIndex = sizeOrder.indexOf(this.currentScreenSize);
      const minSizeIndex = sizeOrder.indexOf(size);
      
      return currentSizeIndex >= minSizeIndex;
    }
    
    /**
     * Checks if the current screen size is at most the specified size
     * @param size Maximum screen size
     * @returns True if current screen size is at most the specified size
     */
    public isMaxScreenSize(size: ScreenSize): boolean {
      if (!this.currentScreenSize) return false;
      
      const sizeOrder: ScreenSize[] = [
        ScreenSize.XS,
        ScreenSize.SM,
        ScreenSize.MD,
        ScreenSize.LG,
        ScreenSize.XL,
        ScreenSize.XXL
      ];
      
      const currentSizeIndex = sizeOrder.indexOf(this.currentScreenSize);
      const maxSizeIndex = sizeOrder.indexOf(size);
      
      return currentSizeIndex <= maxSizeIndex;
    }
    
    /**
     * Cleans up event listeners when the handler is no longer needed
     */
    public destroy(): void {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('orientationchange', this.handleResize);
      
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      
      if (this.resizeTimeout) {
        window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = null;
      }
      
      this.subscribers.clear();
    }
  }
  
  /**
   * A singleton instance of the responsive handler for global use
   */
  export const globalResponsiveHandler = new ResponsiveHandler();
  
  /**
   * Gets a responsive value based on the current screen size using the global handler
   * @param values Responsive values object
   * @returns The appropriate value for the current screen size
   */
  export function getResponsiveValue<T>(values: ResponsiveValue<T>): T {
    return globalResponsiveHandler.getValue(values);
  }
  
  /**
   * Makes a container element adapt to screen size changes
   * @param element The container element
   * @param sizeMap Map of screen sizes to CSS classes
   * @returns Cleanup function to remove listeners
   */
  export function makeElementResponsive(
    element: HTMLElement,
    sizeMap: Partial<Record<ScreenSize, string>>
  ): () => void {
    // Store original classes
    const originalClasses = element.className;
    
    // Handle screen size changes
    const handleSizeChange = (newSize: ScreenSize) => {
      // Remove all responsive classes
      Object.values(sizeMap).forEach(className => {
        element.classList.remove(className);
      });
      
      // Add class for current size if it exists
      const newClass = sizeMap[newSize];
      if (newClass) {
        element.classList.add(newClass);
      }
    };
    
    // Subscribe to size changes
    const unsubscribe = globalResponsiveHandler.subscribe(handleSizeChange);
    
    // Return cleanup function
    return () => {
      unsubscribe();
      element.className = originalClasses;
    };
  }
  
  /**
   * Creates a responsive grid layout
   * @param container The container element
   * @param itemSelector Selector for grid items
   * @param columnConfig Column count for different screen sizes
   * @returns Cleanup function
   */
  export function createResponsiveGrid(
    container: HTMLElement,
    itemSelector: string,
    columnConfig: ResponsiveValue<number>
  ): () => void {
    const items = container.querySelectorAll(itemSelector);
    let lastColumns = 0;
    
    // Set up container style
    container.style.display = 'grid';
    container.style.gridGap = '1rem';
    
    // Style grid items
    items.forEach(item => {
      (item as HTMLElement).style.width = '100%';
      (item as HTMLElement).style.height = '100%';
    });
    
    // Update grid on screen size change
    const handleSizeChange = () => {
      const columns = globalResponsiveHandler.getValue(columnConfig);
      
      // Only update if column count changed
      if (columns !== lastColumns) {
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        lastColumns = columns;
      }
    };
    
    // Subscribe to size changes
    const unsubscribe = globalResponsiveHandler.subscribe(() => handleSizeChange());
    
    // Initial setup
    handleSizeChange();
    
    // Return cleanup function
    return () => {
      unsubscribe();
      container.style.display = '';
      container.style.gridTemplateColumns = '';
      container.style.gridGap = '';
    };
  }
  
  /**
   * Applies responsive typography to an element
   * @param element Element to apply responsive typography to
   * @param fontSizeConfig Font size configuration for different screen sizes
   * @returns Cleanup function
   */
  export function responsiveTypography(
    element: HTMLElement,
    fontSizeConfig: ResponsiveValue<string>
  ): () => void {
    const originalFontSize = element.style.fontSize;
    
    // Update font size on screen size change
    const handleSizeChange = () => {
      const fontSize = globalResponsiveHandler.getValue(fontSizeConfig);
      element.style.fontSize = fontSize;
    };
    
    // Subscribe to size changes
    const unsubscribe = globalResponsiveHandler.subscribe(() => handleSizeChange());
    
    // Initial setup
    handleSizeChange();
    
    // Return cleanup function
    return () => {
      unsubscribe();
      element.style.fontSize = originalFontSize;
    };
  }
  
  /**
   * Creates responsive spacing for a container
   * @param element Element to apply spacing to
   * @param property CSS property to modify (margin, padding)
   * @param valueConfig Values for different screen sizes
   * @returns Cleanup function
   */
  export function responsiveSpacing(
    element: HTMLElement,
    property: 'margin' | 'padding',
    valueConfig: ResponsiveValue<string>
  ): () => void {
    const originalValue = element.style[property];
    
    // Update spacing on screen size change
    const handleSizeChange = () => {
      const value = globalResponsiveHandler.getValue(valueConfig);
      element.style[property] = value;
    };
    
    // Subscribe to size changes
    const unsubscribe = globalResponsiveHandler.subscribe(() => handleSizeChange());
    
    // Initial setup
    handleSizeChange();
    
    // Return cleanup function
    return () => {
      unsubscribe();
      element.style[property] = originalValue;
    };
  }
  
  /**
   * Detects if the current device is touch-capable
   * @returns True if touch is supported
   */
  export function isTouchDevice(): boolean {
    return (
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }
  
  /**
   * Detects if the device is in portrait or landscape orientation
   * @returns 'portrait' or 'landscape'
   */
  export function getDeviceOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }
  
  /**
   * Optimizes element for touch interaction
   * @param element Element to optimize
   * @returns Cleanup function
   */
  export function optimizeForTouch(element: HTMLElement): () => void {
    const originalStyles = {
      cursor: element.style.cursor,
      touchAction: element.style.touchAction,
      userSelect: element.style.userSelect,
      webkitTapHighlightColor: (element.style as any).webkitTapHighlightColor
    };
    
    if (isTouchDevice()) {
      element.style.cursor = 'pointer';
      element.style.touchAction = 'manipulation';
      element.style.userSelect = 'none';
      (element.style as any).webkitTapHighlightColor = 'transparent';
      
      // Increase hit target size for small elements
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        const padding = `${Math.max(0, (44 - rect.height) / 2)}px ${Math.max(0, (44 - rect.width) / 2)}px`;
        element.style.padding = padding;
      }
    }
    
    // Return cleanup function
    return () => {
      element.style.cursor = originalStyles.cursor;
      element.style.touchAction = originalStyles.touchAction;
      element.style.userSelect = originalStyles.userSelect;
      (element.style as any).webkitTapHighlightColor = originalStyles.webkitTapHighlightColor;
      
      // Reset padding if it was modified
      const rect = element.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        element.style.padding = '';
      }
    };
  }
  
  /**
   * Enables responsive behavior for visualization components
   * @param container Container element
   * @param resizeCallback Function to call when container resizes
   * @returns Cleanup function
   */
  export function enableResponsiveVisualization(
    container: HTMLElement,
    resizeCallback: (width: number, height: number) => void
  ): () => void {
    let observer: ResizeObserver | null = null;
    
    // Use ResizeObserver if available
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          resizeCallback(width, height);
        }
      });
      
      observer.observe(container);
    } else {
      // Fallback to window resize event
      const handleResize = () => {
        const { width, height } = container.getBoundingClientRect();
        resizeCallback(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Initial call
      handleResize();
      
      // Return cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    
    // Return cleanup function for ResizeObserver
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }