/**
 * Interactive Element Utilities
 * Provides utilities for managing interactive elements in presentations
 */

/**
 * Interaction event types
 */
export type InteractionEventType = 
  | 'click'     // User clicks or taps
  | 'hover'     // User hovers over an element
  | 'drag'      // User drags an element
  | 'zoom'      // User zooms in or out
  | 'pan'       // User pans the view
  | 'select'    // User selects an element
  | 'filter'    // User applies a filter
  | 'expand'    // User expands a node or section
  | 'collapse'  // User collapses a node or section
  | 'search'    // User performs a search
  | 'reset';    // User resets the view or filter

/**
 * Interaction event data
 */
export interface InteractionEvent<T = any> {
  /** Type of interaction */
  type: InteractionEventType;
  
  /** Target element ID */
  targetId?: string;
  
  /** Target element type */
  targetType?: string;
  
  /** Original DOM event */
  originalEvent?: Event;
  
  /** Source of the interaction */
  source: 'user' | 'api' | 'system';
  
  /** Additional payload */
  payload?: T;
  
  /** Timestamp when the event occurred */
  timestamp: number;
}

/**
 * Interaction handler function
 */
export type InteractionHandler<T = any> = (event: InteractionEvent<T>) => void;

/**
 * Options for interaction behaviors
 */
export interface InteractionOptions {
  /** Whether interactions are enabled */
  enabled?: boolean;
  
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
  
  /** Whether to stop event propagation */
  stopPropagation?: boolean;
  
  /** Threshold for considering a touch as a drag (in pixels) */
  dragThreshold?: number;
  
  /** Minimum time for a touch to be considered a long press (in ms) */
  longPressDelay?: number;
  
  /** Maximum time between taps for a double tap (in ms) */
  doubleTapDelay?: number;
  
  /** Debounce delay for continuous events (in ms) */
  debounceDelay?: number;
}

/**
 * Default interaction options
 */
const DEFAULT_INTERACTION_OPTIONS: InteractionOptions = {
  enabled: true,
  preventDefault: false,
  stopPropagation: false,
  dragThreshold: 10,
  longPressDelay: 500,
  doubleTapDelay: 300,
  debounceDelay: 100
};

/**
 * Touch interaction state
 */
interface TouchState {
  /** Active touch */
  active: boolean;
  
  /** Start coordinates */
  startX: number;
  startY: number;
  
  /** Current coordinates */
  currentX: number;
  currentY: number;
  
  /** Start time */
  startTime: number;
  
  /** Last tap time (for double tap detection) */
  lastTapTime: number;
  
  /** Is this a long press */
  isLongPress: boolean;
  
  /** Is this a drag operation */
  isDragging: boolean;
  
  /** Distance dragged */
  dragDistance: number;
}

/**
 * Pan/zoom state
 */
interface PanZoomState {
  /** Is pan/zoom active */
  active: boolean;
  
  /** Initial scale */
  initialScale: number;
  
  /** Current scale */
  currentScale: number;
  
  /** Initial pan position */
  initialPanX: number;
  initialPanY: number;
  
  /** Current pan position */
  currentPanX: number;
  currentPanY: number;
}

/**
 * Manager for interactive element behaviors
 */
export class InteractionManager {
  private element: HTMLElement;
  private options: InteractionOptions;
  private handlers: Map<InteractionEventType, Set<InteractionHandler>> = new Map();
  private touchState: TouchState;
  private panZoomState: PanZoomState;
  private targetElements: Map<string, HTMLElement> = new Map();
  private longPressTimeoutId: number | null = null;
  private debouncedHandlers: Map<string, (...args: any[]) => void> = new Map();
  
  /**
   * Creates a new interaction manager
   * @param element Element to attach interactions to
   * @param options Interaction options
   */
  constructor(element: HTMLElement, options: InteractionOptions = {}) {
    this.element = element;
    this.options = { ...DEFAULT_INTERACTION_OPTIONS, ...options };
    
    // Initialize touch state
    this.touchState = {
      active: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      startTime: 0,
      lastTapTime: 0,
      isLongPress: false,
      isDragging: false,
      dragDistance: 0
    };
    
    // Initialize pan/zoom state
    this.panZoomState = {
      active: false,
      initialScale: 1,
      currentScale: 1,
      initialPanX: 0,
      initialPanY: 0,
      currentPanX: 0,
      currentPanY: 0
    };
    
    // Initialize event handlers
    this.initEventHandlers();
  }
  
  /**
   * Initializes event handlers
   * @private
   */
  private initEventHandlers(): void {
    if (!this.options.enabled) {
      return;
    }
    
    // Mouse events
    this.element.addEventListener('click', this.handleClick);
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.element.addEventListener('mousemove', this.handleMouseMove);
    this.element.addEventListener('mouseup', this.handleMouseUp);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
    
    // Touch events
    this.element.addEventListener('touchstart', this.handleTouchStart);
    this.element.addEventListener('touchmove', this.handleTouchMove);
    this.element.addEventListener('touchend', this.handleTouchEnd);
    this.element.addEventListener('touchcancel', this.handleTouchCancel);
    
    // Wheel event for zoom
    this.element.addEventListener('wheel', this.handleWheel);
  }
  
  /**
   * Handles click events
   * @param event Mouse event
   * @private
   */
  private handleClick = (event: MouseEvent): void => {
    // Skip if interactions are disabled
    if (!this.options.enabled) {
      return;
    }
    
    // Find target element
    const targetElement = this.findTargetElement(event.target as HTMLElement);
    if (!targetElement) {
      return;
    }
    
    // Handle event options
    if (this.options.preventDefault) {
      event.preventDefault();
    }
    
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    
    // Create interaction event
    const interactionEvent: InteractionEvent = {
      type: 'click',
      targetId: targetElement.id,
      targetType: targetElement.dataset.type || 'element',
      originalEvent: event,
      source: 'user',
      timestamp: Date.now(),
      payload: {
        x: event.clientX,
        y: event.clientY,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey
      }
    };
    
    // Dispatch event
    this.dispatchEvent(interactionEvent);
  };
  
  /**
   * Handles mouse down events
   * @param event Mouse event
   * @private
   */
  private handleMouseDown = (event: MouseEvent): void => {
    // Skip if interactions are disabled
    if (!this.options.enabled) {
      return;
    }
    
    // Find target element
    const targetElement = this.findTargetElement(event.target as HTMLElement);
    if (!targetElement) {
      return;
    }
    
    // Update state
    this.touchState.active = true;
    this.touchState.startX = event.clientX;
    this.touchState.startY = event.clientY;
    this.touchState.currentX = event.clientX;
    this.touchState.currentY = event.clientY;
    this.touchState.startTime = Date.now();
    this.touchState.isLongPress = false;
    this.touchState.isDragging = false;
    this.touchState.dragDistance = 0;
  };
  
  /**
   * Handles mouse move events
   * @param event Mouse event
   * @private
   */
  private handleMouseMove = (event: MouseEvent): void => {
    // Skip if interactions are disabled or no active touch
    if (!this.options.enabled || !this.touchState.active) {
      return;
    }
    
    // Update current position
    this.touchState.currentX = event.clientX;
    this.touchState.currentY = event.clientY;
    
    // Calculate drag distance
    const dx = this.touchState.currentX - this.touchState.startX;
    const dy = this.touchState.currentY - this.touchState.startY;
    this.touchState.dragDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if dragging
    if (!this.touchState.isDragging && 
        this.touchState.dragDistance > (this.options.dragThreshold || 10)) {
      this.touchState.isDragging = true;
      
      // Create drag start event
      this.createAndDispatchDragEvent('drag', event, {
        state: 'start',
        dx: 0,
        dy: 0,
        distance: 0
      });
    }
    
    // If dragging, create drag event
    if (this.touchState.isDragging) {
      this.createAndDispatchDragEvent('drag', event, {
        state: 'move',
        dx,
        dy,
        distance: this.touchState.dragDistance
      });
    }
  };
  
  /**
   * Handles mouse up events
   * @param event Mouse event
   * @private
   */
  private handleMouseUp = (event: MouseEvent): void => {
    // Skip if interactions are disabled or no active touch
    if (!this.options.enabled || !this.touchState.active) {
      return;
    }
    
    // If dragging, create drag end event
    if (this.touchState.isDragging) {
      const dx = this.touchState.currentX - this.touchState.startX;
      const dy = this.touchState.currentY - this.touchState.startY;
      
      this.createAndDispatchDragEvent('drag', event, {
        state: 'end',
        dx,
        dy,
        distance: this.touchState.dragDistance
      });
    }
    
    // Reset touch state
    this.touchState.active = false;
    this.touchState.isDragging = false;
  };
  
  /**
   * Handles mouse leave events
   * @param event Mouse event
   * @private
   */
  private handleMouseLeave = (event: MouseEvent): void => {
    // Skip if interactions are disabled or no active touch
    if (!this.options.enabled || !this.touchState.active) {
      return;
    }
    
    // If dragging, create drag end event
    if (this.touchState.isDragging) {
      const dx = this.touchState.currentX - this.touchState.startX;
      const dy = this.touchState.currentY - this.touchState.startY;
      
      this.createAndDispatchDragEvent('drag', event, {
        state: 'end',
        dx,
        dy,
        distance: this.touchState.dragDistance
      });
    }
    
    // Reset touch state
    this.touchState.active = false;
    this.touchState.isDragging = false;
  };
  
  /**
   * Handles touch start events
   * @param event Touch event
   * @private
   */
  private handleTouchStart = (event: TouchEvent): void => {
    // Skip if interactions are disabled
    if (!this.options.enabled) {
      return;
    }
    
    // Handle event options
    if (this.options.preventDefault) {
      event.preventDefault();
    }
    
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    
    // Get the primary touch
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    
    // Find target element
    const targetElement = this.findTargetElement(event.target as HTMLElement);
    if (!targetElement) {
      return;
    }
    
    // Update touch state
    this.touchState.active = true;
    this.touchState.startX = touch.clientX;
    this.touchState.startY = touch.clientY;
    this.touchState.currentX = touch.clientX;
    this.touchState.currentY = touch.clientY;
    this.touchState.startTime = Date.now();
    this.touchState.isLongPress = false;
    this.touchState.isDragging = false;
    this.touchState.dragDistance = 0;
    
    // Start long press timer
    this.longPressTimeoutId = window.setTimeout(() => {
      if (this.touchState.active && !this.touchState.isDragging) {
        this.touchState.isLongPress = true;
        
        // Create long press event (as select)
        const interactionEvent: InteractionEvent = {
          type: 'select',
          targetId: targetElement.id,
          targetType: targetElement.dataset.type || 'element',
          originalEvent: event,
          source: 'user',
          timestamp: Date.now(),
          payload: {
            x: touch.clientX,
            y: touch.clientY,
            longPress: true
          }
        };
        
        this.dispatchEvent(interactionEvent);
      }
    }, this.options.longPressDelay || 500);
    
    // Handle multi-touch for pinch zoom
    if (event.touches.length === 2) {
      // Initialize pan/zoom state
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      // Calculate center point
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      // Calculate initial distance for pinch
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const initialDistance = Math.sqrt(dx * dx + dy * dy);
      
      this.panZoomState.active = true;
      this.panZoomState.initialScale = this.panZoomState.currentScale;
      this.panZoomState.initialPanX = centerX;
      this.panZoomState.initialPanY = centerY;
    }
  };
  
  /**
   * Handles touch move events
   * @param event Touch event
   * @private
   */
  private handleTouchMove = (event: TouchEvent): void => {
    // Skip if interactions are disabled or no active touch
    if (!this.options.enabled || !this.touchState.active) {
      return;
    }
    
    // Handle event options
    if (this.options.preventDefault) {
      event.preventDefault();
    }
    
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    
    // Get the primary touch
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    
    // Update current position
    this.touchState.currentX = touch.clientX;
    this.touchState.currentY = touch.clientY;
    
    // Calculate drag distance
    const dx = this.touchState.currentX - this.touchState.startX;
    const dy = this.touchState.currentY - this.touchState.startY;
    this.touchState.dragDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Cancel long press if moving too much
    if (this.longPressTimeoutId !== null && 
        this.touchState.dragDistance > (this.options.dragThreshold || 10)) {
      window.clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = null;
    }
    
    // Check if dragging
    if (!this.touchState.isDragging && 
        this.touchState.dragDistance > (this.options.dragThreshold || 10)) {
      this.touchState.isDragging = true;
      
      // Create drag start event
      this.createAndDispatchDragEvent('drag', event, {
        state: 'start',
        dx: 0,
        dy: 0,
        distance: 0,
        touch: true
      });
    }
    
    // If dragging, create drag event
    if (this.touchState.isDragging) {
      this.createAndDispatchDragEvent('drag', event, {
        state: 'move',
        dx,
        dy,
        distance: this.touchState.dragDistance,
        touch: true
      });
    }
    
    // Handle pinch zoom with two fingers
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      // Calculate center point
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      // Calculate distance for pinch
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate scale change
      const initialDistance = Math.sqrt(
        Math.pow(this.panZoomState.initialPanX - this.panZoomState.initialPanY, 2)
      );
      const scaleChange = distance / initialDistance;
      
      // Calculate pan change
      const panChangeX = centerX - this.panZoomState.initialPanX;
      const panChangeY = centerY - this.panZoomState.initialPanY;
      
      // Update state
      this.panZoomState.currentScale = this.panZoomState.initialScale * scaleChange;
      this.panZoomState.currentPanX = panChangeX;
      this.panZoomState.currentPanY = panChangeY;
      
      // Create zoom event
      const zoomEvent: InteractionEvent = {
        type: 'zoom',
        targetId: this.element.id,
        targetType: 'container',
        originalEvent: event,
        source: 'user',
        timestamp: Date.now(),
        payload: {
          scale: this.panZoomState.currentScale,
          x: centerX,
          y: centerY,
          touch: true
        }
      };
      
      this.dispatchEvent(zoomEvent);
      
      // Create pan event
      const panEvent: InteractionEvent = {
        type: 'pan',
        targetId: this.element.id,
        targetType: 'container',
        originalEvent: event,
        source: 'user',
        timestamp: Date.now(),
        payload: {
          x: panChangeX,
          y: panChangeY,
          touch: true
        }
      };
      
      this.dispatchEvent(panEvent);
    }
  };
  
  /**
   * Handles touch end events
   * @param event Touch event
   * @private
   */
  private handleTouchEnd = (event: TouchEvent): void => {
    // Skip if interactions are disabled or no active touch
    if (!this.options.enabled || !this.touchState.active) {
      return;
    }
    
    // Handle event options
    if (this.options.preventDefault) {
      event.preventDefault();
    }
    
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    
    // Clear long press timeout
    if (this.longPressTimeoutId !== null) {
      window.clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = null;
    }
    
    // Find target element
    const targetElement = this.findTargetElement(event.target as HTMLElement);
    
    // If dragging, create drag end event
    if (this.touchState.isDragging) {
      const dx = this.touchState.currentX - this.touchState.startX;
      const dy = this.touchState.currentY - this.touchState.startY;
      
      this.createAndDispatchDragEvent('drag', event, {
        state: 'end',
        dx,
        dy,
        distance: this.touchState.dragDistance,
        touch: true
      });
    } 
    // If not dragging and not a long press, handle as tap/click
    else if (!this.touchState.isLongPress && targetElement) {
      // Get time since touch start
      const touchDuration = Date.now() - this.touchState.startTime;
      
      // Check for double tap
      const timeSinceLastTap = Date.now() - this.touchState.lastTapTime;
      const isDoubleTap = timeSinceLastTap < (this.options.doubleTapDelay || 300);
      
      // Create tap event (as click)
      const interactionEvent: InteractionEvent = {
        type: 'click',
        targetId: targetElement.id,
        targetType: targetElement.dataset.type || 'element',
        originalEvent: event,
        source: 'user',
        timestamp: Date.now(),
        payload: {
          x: this.touchState.currentX,
          y: this.touchState.currentY,
          duration: touchDuration,
          doubleTap: isDoubleTap,
          touch: true
        }
      };
      
      this.dispatchEvent(interactionEvent);
      
      // Update last tap time for double tap detection
      this.touchState.lastTapTime = Date.now();
    }
    
    // Reset touch state
    this.touchState.active = false;
    this.touchState.isDragging = false;
    this.touchState.isLongPress = false;
    
    // Reset pan/zoom state
    if (event.touches.length === 0) {
      this.panZoomState.active = false;
    }
  };
  
  /**
   * Handles touch cancel events
   * @param event Touch event
   * @private
   */
  private handleTouchCancel = (event: TouchEvent): void => {
    // Skip if interactions are disabled
    if (!this.options.enabled) {
      return;
    }
    
    // Clear long press timeout
    if (this.longPressTimeoutId !== null) {
      window.clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = null;
    }
    
    // Reset touch state
    this.touchState.active = false;
    this.touchState.isDragging = false;
    this.touchState.isLongPress = false;
    
    // Reset pan/zoom state
    this.panZoomState.active = false;
  };
  
  /**
   * Handles wheel events for zoom
   * @param event Wheel event
   * @private
   */
  private handleWheel = (event: WheelEvent): void => {
    // Skip if interactions are disabled
    if (!this.options.enabled) {
      return;
    }
    
    // Handle event options
    if (this.options.preventDefault) {
      event.preventDefault();
    }
    
    if (this.options.stopPropagation) {
      event.stopPropagation();
    }
    
    // Get the debounced handler
    const debouncedHandler = this.getDebouncedHandler('wheel', () => {
      // Determine zoom direction
      const delta = event.deltaY;
      const zoomIn = delta < 0;
      
      // Calculate new scale (1.1 = 10% zoom per step)
      const scaleFactor = zoomIn ? 1.1 : 0.9;
      this.panZoomState.currentScale *= scaleFactor;
      
      // Create zoom event
      const zoomEvent: InteractionEvent = {
        type: 'zoom',
        targetId: this.element.id,
        targetType: 'container',
        originalEvent: event,
        source: 'user',
        timestamp: Date.now(),
        payload: {
          scale: this.panZoomState.currentScale,
          x: event.clientX,
          y: event.clientY,
          delta,
          wheel: true
        }
      };
      
      this.dispatchEvent(zoomEvent);
    });
    
    // Call the debounced handler
    debouncedHandler();
  };
  
  /**
   * Creates and dispatches a drag event
   * @param type Event type
   * @param originalEvent Original DOM event
   * @param payload Event payload
   * @private
   */
  private createAndDispatchDragEvent(
    type: InteractionEventType,
    originalEvent: Event,
    payload: any
  ): void {
    // Find target element
    const targetElement = this.findTargetElement(originalEvent.target as HTMLElement);
    if (!targetElement) {
      return;
    }
    
    // Create event
    const interactionEvent: InteractionEvent = {
      type,
      targetId: targetElement.id,
      targetType: targetElement.dataset.type || 'element',
      originalEvent,
      source: 'user',
      timestamp: Date.now(),
      payload
    };
    
    // Dispatch event
    this.dispatchEvent(interactionEvent);
  }
  
  /**
   * Finds a targetable element from a DOM element
   * @param element DOM element
   * @returns Target element or null if not found
   * @private
   */
  private findTargetElement(element: HTMLElement | null): HTMLElement | null {
    if (!element) {
      return null;
    }
    
    // Check if the element is directly targetable
    if (element.hasAttribute('data-interactive')) {
      return element;
    }
    
    // Walk up the DOM tree to find a targetable element
    let current: HTMLElement | null = element;
    
    while (current && current !== this.element) {
      if (current.hasAttribute('data-interactive')) {
        return current;
      }
      current = current.parentElement;
    }
    
    // No targetable element found
    return null;
  }
  
  /**
   * Gets or creates a debounced handler for an event
   * @param key Unique key for the handler
   * @param handler Handler function
   * @returns Debounced handler
   * @private
   */
  private getDebouncedHandler(key: string, handler: () => void): () => void {
    if (!this.debouncedHandlers.has(key)) {
      const debounced = this.debounce(handler, this.options.debounceDelay || 100);
      this.debouncedHandlers.set(key, debounced);
    }
    
    return this.debouncedHandlers.get(key)!;
  }
  
  /**
   * Debounces a function
   * @param func Function to debounce
   * @param delay Delay in milliseconds
   * @returns Debounced function
   * @private
   */
  private debounce(func: () => void, delay: number): () => void {
    let timeoutId: number | null = null;
    
    return function() {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        func();
      }, delay);
    };
  }
  
  /**
   * Adds an event handler
   * @param type Event type
   * @param handler Event handler
   * @returns This interaction manager
   */
  public on<T = any>(type: InteractionEventType, handler: InteractionHandler<T>): InteractionManager {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    
    this.handlers.get(type)!.add(handler as InteractionHandler<any>);
    return this;
  }
  
  /**
   * Removes an event handler
   * @param type Event type
   * @param handler Event handler
   * @returns This interaction manager
   */
  public off<T = any>(type: InteractionEventType, handler: InteractionHandler<T>): InteractionManager {
    const handlers = this.handlers.get(type);
    
    if (handlers) {
      handlers.delete(handler as InteractionHandler<any>);
    }
    
    return this;
  }
  
  /**
   * Removes all event handlers for a type
   * @param type Event type
   * @returns This interaction manager
   */
  public offAll(type?: InteractionEventType): InteractionManager {
    if (type) {
      this.handlers.delete(type);
    } else {
      this.handlers.clear();
    }
    
    return this;
  }
  
  /**
   * Dispatches an interaction event
   * @param event Event to dispatch
   * @private
   */
  private dispatchEvent<T = any>(event: InteractionEvent<T>): void {
    const handlers = this.handlers.get(event.type);
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in interaction handler for ${event.type}:`, error);
        }
      });
    }
  }
  
  /**
   * Registers an interactive element
   * @param id Element ID
   * @param element DOM element
   * @returns This interaction manager
   */
  public registerElement(id: string, element: HTMLElement): InteractionManager {
    // Mark element as interactive
    element.setAttribute('data-interactive', 'true');
    
    // Store element
    this.targetElements.set(id, element);
    
    return this;
  }
  
  /**
   * Unregisters an interactive element
   * @param id Element ID
   * @returns This interaction manager
   */
  public unregisterElement(id: string): InteractionManager {
    const element = this.targetElements.get(id);
    
    if (element) {
      // Remove interactive marker
      element.removeAttribute('data-interactive');
      
      // Remove from storage
      this.targetElements.delete(id);
    }
    
    return this;
  }
  
  /**
   * Enables interactions
   * @returns This interaction manager
   */
  public enable(): InteractionManager {
    this.options.enabled = true;
    return this;
  }
  
  /**
   * Disables interactions
   * @returns This interaction manager
   */
  public disable(): InteractionManager {
    this.options.enabled = false;
    return this;
  }
  
  /**
   * Cleans up event listeners
   */
  public destroy(): void {
    // Remove event listeners
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('mousemove', this.handleMouseMove);
    this.element.removeEventListener('mouseup', this.handleMouseUp);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.element.removeEventListener('wheel', this.handleWheel);
    
    // Clear timeouts
    if (this.longPressTimeoutId !== null) {
      window.clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = null;
    }
    
    // Clear handlers
    this.handlers.clear();
    this.debouncedHandlers.clear();
    this.targetElements.clear();
  }
}

/**
 * Creates an interactive element with hover effects
 * @param element DOM element to make interactive
 * @param options Hover options
 * @returns Cleanup function
 */
export function createHoverEffect(
  element: HTMLElement,
  options: {
    hoverClass?: string;
    scaleAmount?: number;
    glowColor?: string;
    highlightColor?: string;
    fadeInDuration?: number;
    fadeOutDuration?: number;
  } = {}
): () => void {
  // Default options
  const hoverClass = options.hoverClass || 'hover-active';
  const scaleAmount = options.scaleAmount || 1.05;
  const glowColor = options.glowColor || 'rgba(0, 123, 255, 0.5)';
  const highlightColor = options.highlightColor;
  const fadeInDuration = options.fadeInDuration || 200;
  const fadeOutDuration = options.fadeOutDuration || 300;
  
  // Store original styles
  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;
  const originalBoxShadow = element.style.boxShadow;
  const originalZIndex = element.style.zIndex;
  const originalBackground = element.style.background;
  
  // Set initial styles
  element.style.transition = `transform ${fadeInDuration}ms ease, box-shadow ${fadeInDuration}ms ease, background-color ${fadeInDuration}ms ease`;
  
  // Add hover listeners
  const handleMouseEnter = (): void => {
    element.classList.add(hoverClass);
    element.style.transform = `${originalTransform} scale(${scaleAmount})`;
    element.style.boxShadow = `0 0 10px ${glowColor}`;
    element.style.zIndex = '1';
    
    if (highlightColor) {
      element.style.background = highlightColor;
    }
  };
  
  const handleMouseLeave = (): void => {
    element.classList.remove(hoverClass);
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    element.style.zIndex = originalZIndex;
    element.style.background = originalBackground;
  };
  
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Set element as interactive
  element.setAttribute('data-interactive', 'true');
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;
    element.style.boxShadow = originalBoxShadow;
    element.style.zIndex = originalZIndex;
    element.style.background = originalBackground;
    
    element.classList.remove(hoverClass);
    element.removeAttribute('data-interactive');
  };
}

/**
 * Creates a draggable element
 * @param element DOM element to make draggable
 * @param options Drag options
 * @returns Cleanup function
 */
export function createDraggable(
  element: HTMLElement,
  options: {
    container?: HTMLElement;
    handleSelector?: string;
    bounds?: 'parent' | 'window' | { top: number; right: number; bottom: number; left: number };
    axis?: 'x' | 'y' | 'both';
    onDragStart?: (position: { x: number; y: number }) => void;
    onDrag?: (position: { x: number; y: number }) => void;
    onDragEnd?: (position: { x: number; y: number }) => void;
  } = {}
): () => void {
  // Default options
  const container = options.container || document.body;
  const handle = options.handleSelector ? element.querySelector(options.handleSelector) : element;
  const axis = options.axis || 'both';
  
  if (!handle) {
    console.error('Drag handle not found');
    return () => {};
  }
  
  // Set element as draggable
  element.setAttribute('data-interactive', 'true');
  const handleElement = handle as HTMLElement;
  handleElement.style.cursor = 'move';
  
  // Store initial position
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  
  // Set initial position if not already positioned
  const computedStyle = window.getComputedStyle(element);
  
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }
  
  // Add event listeners
  const handleMouseDown = (event: MouseEvent): void => {
    // Only allow left mouse button
    if (event.button !== 0) {
      return;
    }
    
    event.preventDefault();
    
    // Get element's current position
    const rect = element.getBoundingClientRect();
    
    // Calculate start positions
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    
    // Mark as dragging
    isDragging = true;
    
    // Add temporary document-level event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Call drag start callback
    if (options.onDragStart) {
      options.onDragStart({ x: startLeft, y: startTop });
    }
  };
  
  const handleMouseMove = (event: MouseEvent): void => {
    if (!isDragging) {
      return;
    }
    
    event.preventDefault();
    
    // Calculate new position
    let dx = event.clientX - startX;
    let dy = event.clientY - startY;
    
    // Restrict to axis if specified
    if (axis === 'x') {
      dy = 0;
    } else if (axis === 'y') {
      dx = 0;
    }
    
    // Apply new position
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;
    
    // Apply bounds
    const bounds = getBounds(element, options.bounds);
    if (bounds) {
      newLeft = Math.max(bounds.left, Math.min(bounds.right - element.offsetWidth, newLeft));
      newTop = Math.max(bounds.top, Math.min(bounds.bottom - element.offsetHeight, newTop));
    }
    
    // Update position
    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
    
    // Call drag callback
    if (options.onDrag) {
      options.onDrag({ x: newLeft, y: newTop });
    }
  };
  
  const handleMouseUp = (event: MouseEvent): void => {
    if (!isDragging) {
      return;
    }
    
    event.preventDefault();
    
    // Mark as not dragging
    isDragging = false;
    
    // Remove document-level event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Call drag end callback
    if (options.onDragEnd) {
      const rect = element.getBoundingClientRect();
      options.onDragEnd({ x: rect.left, y: rect.top });
    }
  };
  
  // Add touch event handlers
  const handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      return;
    }
    
    event.preventDefault();
    
    const touch = event.touches[0];
    
    // Get element's current position
    const rect = element.getBoundingClientRect();
    
    // Calculate start positions
    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    
    // Mark as dragging
    isDragging = true;
    
    // Call drag start callback
    if (options.onDragStart) {
      options.onDragStart({ x: startLeft, y: startTop });
    }
  };
  
  const handleTouchMove = (event: TouchEvent): void => {
    if (!isDragging || event.touches.length !== 1) {
      return;
    }
    
    event.preventDefault();
    
    const touch = event.touches[0];
    
    // Calculate new position
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    
    // Restrict to axis if specified
    if (axis === 'x') {
      dy = 0;
    } else if (axis === 'y') {
      dx = 0;
    }
    
    // Apply new position
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;
    
    // Apply bounds
    const bounds = getBounds(element, options.bounds);
    if (bounds) {
      newLeft = Math.max(bounds.left, Math.min(bounds.right - element.offsetWidth, newLeft));
      newTop = Math.max(bounds.top, Math.min(bounds.bottom - element.offsetHeight, newTop));
    }
    
    // Update position
    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
    
    // Call drag callback
    if (options.onDrag) {
      options.onDrag({ x: newLeft, y: newTop });
    }
  };
  
  const handleTouchEnd = (event: TouchEvent): void => {
    if (!isDragging) {
      return;
    }
    
    event.preventDefault();
    
    // Mark as not dragging
    isDragging = false;
    
    // Call drag end callback
    if (options.onDragEnd) {
      const rect = element.getBoundingClientRect();
      options.onDragEnd({ x: rect.left, y: rect.top });
    }
  };
  
  // Attach event listeners
  handleElement.addEventListener('mousedown', handleMouseDown);
  handleElement.addEventListener('touchstart', handleTouchStart);
  handleElement.addEventListener('touchmove', handleTouchMove);
  handleElement.addEventListener('touchend', handleTouchEnd);
  
  // Return cleanup function
  return () => {
    handleElement.removeEventListener('mousedown', handleMouseDown);
    handleElement.removeEventListener('touchstart', handleTouchStart);
    handleElement.removeEventListener('touchmove', handleTouchMove);
    handleElement.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    element.removeAttribute('data-interactive');
    handleElement.style.cursor = '';
  };
}

/**
 * Gets bounds for an element
 * @param element Element to get bounds for
 * @param boundsOption Bounds specification
 * @returns Bounds object or null
 */
function getBounds(
  element: HTMLElement,
  boundsOption?: 'parent' | 'window' | { top: number; right: number; bottom: number; left: number }
): { top: number; right: number; bottom: number; left: number } | null {
  if (!boundsOption) {
    return null;
  }
  
  if (boundsOption === 'window') {
    return {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    };
  }
  
  if (boundsOption === 'parent') {
    const parent = element.parentElement;
    
    if (!parent) {
      return null;
    }
    
    const parentRect = parent.getBoundingClientRect();
    
    return {
      top: parentRect.top,
      right: parentRect.right,
      bottom: parentRect.bottom,
      left: parentRect.left
    };
  }
  
  // Custom bounds
  return boundsOption;
}

/**
 * Creates a tooltip for an element
 * @param element Element to attach tooltip to
 * @param content Tooltip content
 * @param options Tooltip options
 * @returns Cleanup function
 */
export function createTooltip(
  element: HTMLElement,
  content: string | HTMLElement,
  options: {
    position?: 'top' | 'right' | 'bottom' | 'left';
    offset?: number;
    theme?: 'light' | 'dark';
    hideDelay?: number;
    showDelay?: number;
    interactive?: boolean;
    maxWidth?: number;
  } = {}
): () => void {
  // Default options
  const position = options.position || 'top';
  const offset = options.offset || 10;
  const theme = options.theme || 'dark';
  const hideDelay = options.hideDelay || 200;
  const showDelay = options.showDelay || 200;
  const interactive = options.interactive || false;
  const maxWidth = options.maxWidth || 200;
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = `tooltip tooltip-${theme}`;
  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '9999';
  tooltip.style.opacity = '0';
  tooltip.style.transition = `opacity 0.2s ease-in-out`;
  tooltip.style.maxWidth = `${maxWidth}px`;
  tooltip.style.boxSizing = 'border-box';
  tooltip.style.pointerEvents = interactive ? 'auto' : 'none';
  
  // Set theme styles
  if (theme === 'dark') {
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
  } else {
    tooltip.style.backgroundColor = 'white';
    tooltip.style.color = 'black';
    tooltip.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  }
  
  // Add padding and border radius
  tooltip.style.padding = '6px 10px';
  tooltip.style.borderRadius = '4px';
  
  // Add arrow element
  const arrow = document.createElement('div');
  arrow.className = 'tooltip-arrow';
  arrow.style.position = 'absolute';
  arrow.style.width = '0';
  arrow.style.height = '0';
  arrow.style.borderStyle = 'solid';
  
  // Set arrow color based on theme
  if (theme === 'dark') {
    arrow.style.borderColor = 'rgba(0, 0, 0, 0)';
  } else {
    arrow.style.borderColor = 'rgba(255, 255, 255, 0)';
  }
  
  // Set arrow position based on tooltip position
  switch (position) {
    case 'top':
      arrow.style.borderWidth = '6px 6px 0 6px';
      arrow.style.borderTopColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'white';
      arrow.style.bottom = '-6px';
      arrow.style.left = '50%';
      arrow.style.marginLeft = '-6px';
      break;
    case 'right':
      arrow.style.borderWidth = '6px 6px 6px 0';
      arrow.style.borderRightColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'white';
      arrow.style.left = '-6px';
      arrow.style.top = '50%';
      arrow.style.marginTop = '-6px';
      break;
    case 'bottom':
      arrow.style.borderWidth = '0 6px 6px 6px';
      arrow.style.borderBottomColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'white';
      arrow.style.top = '-6px';
      arrow.style.left = '50%';
      arrow.style.marginLeft = '-6px';
      break;
    case 'left':
      arrow.style.borderWidth = '6px 0 6px 6px';
      arrow.style.borderLeftColor = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'white';
      arrow.style.right = '-6px';
      arrow.style.top = '50%';
      arrow.style.marginTop = '-6px';
      break;
  }
  
  // Add arrow to tooltip
  tooltip.appendChild(arrow);
  
  // Add content to tooltip
  if (typeof content === 'string') {
    tooltip.innerHTML += content;
  } else {
    tooltip.appendChild(content);
  }
  
  // Add tooltip to body
  document.body.appendChild(tooltip);
  
  // Variables for delay timers
  let showTimer: number | null = null;
  let hideTimer: number | null = null;
  
  // Position the tooltip
  const positionTooltip = (): void => {
    const elRect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = 0;
    let top = 0;
    
    switch (position) {
      case 'top':
        left = elRect.left + (elRect.width / 2) - (tooltipRect.width / 2);
        top = elRect.top - tooltipRect.height - offset;
        break;
      case 'right':
        left = elRect.right + offset;
        top = elRect.top + (elRect.height / 2) - (tooltipRect.height / 2);
        break;
      case 'bottom':
        left = elRect.left + (elRect.width / 2) - (tooltipRect.width / 2);
        top = elRect.bottom + offset;
        break;
      case 'left':
        left = elRect.left - tooltipRect.width - offset;
        top = elRect.top + (elRect.height / 2) - (tooltipRect.height / 2);
        break;
    }
    
    // Keep the tooltip within the viewport
    const rightEdge = left + tooltipRect.width;
    const bottomEdge = top + tooltipRect.height;
    
    if (rightEdge > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 5;
    }
    
    if (bottomEdge > window.innerHeight) {
      top = window.innerHeight - tooltipRect.height - 5;
    }
    
    if (left < 0) {
      left = 5;
    }
    
    if (top < 0) {
      top = 5;
    }
    
    // Apply position
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };
  
  // Show the tooltip
  const showTooltip = (): void => {
    // Clear any hide timer
    if (hideTimer !== null) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }
    
    // Set show timer
    if (showTimer === null) {
      showTimer = window.setTimeout(() => {
        positionTooltip();
        tooltip.style.opacity = '1';
        showTimer = null;
      }, showDelay);
    }
  };
  
  // Hide the tooltip
  const hideTooltip = (): void => {
    // Clear any show timer
    if (showTimer !== null) {
      window.clearTimeout(showTimer);
      showTimer = null;
    }
    
    // Set hide timer
    if (hideTimer === null) {
      hideTimer = window.setTimeout(() => {
        tooltip.style.opacity = '0';
        hideTimer = null;
      }, hideDelay);
    }
  };
  
  // Add event listeners to show/hide tooltip
  element.addEventListener('mouseenter', showTooltip);
  element.addEventListener('mouseleave', hideTooltip);
  element.addEventListener('focus', showTooltip);
  element.addEventListener('blur', hideTooltip);
  
  // Add event listeners to tooltip if interactive
  if (interactive) {
    tooltip.addEventListener('mouseenter', () => {
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      tooltip.style.opacity = '1';
    });
    
    tooltip.addEventListener('mouseleave', hideTooltip);
  }
  
  // Mark element as interactive
  element.setAttribute('data-interactive', 'true');
  
  // Return cleanup function
  return () => {
    // Remove event listeners
    element.removeEventListener('mouseenter', showTooltip);
    element.removeEventListener('mouseleave', hideTooltip);
    element.removeEventListener('focus', showTooltip);
    element.removeEventListener('blur', hideTooltip);
    
    // Clear timers
    if (showTimer !== null) {
      window.clearTimeout(showTimer);
    }
    
    if (hideTimer !== null) {
      window.clearTimeout(hideTimer);
    }
    
    // Remove tooltip element
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
    
    // Remove interactive attribute
    element.removeAttribute('data-interactive');
  };
}