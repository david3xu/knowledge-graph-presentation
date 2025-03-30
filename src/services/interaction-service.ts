import { EventEmitter } from 'events';

/**
 * Interface for interactive element
 */
export interface InteractiveElement {
  id: string;
  element: HTMLElement;
  type: string;
  state: any;
  handlers: {
    [eventName: string]: (event: Event) => void;
  };
}

/**
 * Service for managing interactive elements in the presentation
 */
export class InteractionService extends EventEmitter {
  private interactiveElements: Map<string, InteractiveElement> = new Map();
  private interactionHistory: Array<{
    elementId: string;
    action: string;
    timestamp: number;
    state?: any;
  }> = [];
  
  /**
   * Registers an interactive element
   * @param element Element to register
   * @param type Type of interactive element
   * @param handlers Event handlers for the element
   * @param initialState Initial state for the element
   * @returns Element ID
   */
  registerElement(
    element: HTMLElement,
    type: string,
    handlers: { [eventName: string]: (event: Event) => void } = {},
    initialState: any = {}
  ): string {
    // Generate a unique ID if not already present
    const id = element.id || `interactive-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Set ID on element if not already present
    if (!element.id) {
      element.id = id;
    }
    
    // Add interactive class and data attribute
    element.classList.add('interactive-element');
    element.dataset.interactiveType = type;
    
    // Create interactive element object
    const interactiveElement: InteractiveElement = {
      id,
      element,
      type,
      state: { ...initialState },
      handlers: { ...handlers }
    };
    
    // Attach event handlers
    this.attachEventHandlers(interactiveElement);
    
    // Store in map
    this.interactiveElements.set(id, interactiveElement);
    
    // Emit register event
    this.emit('element-registered', { id, type });
    
    return id;
  }
  
  /**
   * Unregisters an interactive element
   * @param id Element ID
   * @returns Boolean indicating whether the element was removed
   */
  unregisterElement(id: string): boolean {
    const interactiveElement = this.interactiveElements.get(id);
    if (!interactiveElement) return false;
    
    // Remove event handlers
    this.detachEventHandlers(interactiveElement);
    
    // Remove interactive classes and attributes
    interactiveElement.element.classList.remove('interactive-element');
    delete interactiveElement.element.dataset.interactiveType;
    
    // Remove from map
    this.interactiveElements.delete(id);
    
    // Emit unregister event
    this.emit('element-unregistered', { id, type: interactiveElement.type });
    
    return true;
  }
  
  /**
   * Updates the state of an interactive element
   * @param id Element ID
   * @param newState New state object
   * @param merge Whether to merge with existing state
   * @returns Boolean indicating whether the state was updated
   */
  updateElementState(id: string, newState: any, merge: boolean = true): boolean {
    const interactiveElement = this.interactiveElements.get(id);
    if (!interactiveElement) return false;
    
    // Update state
    const oldState = { ...interactiveElement.state };
    
    if (merge) {
      interactiveElement.state = { ...interactiveElement.state, ...newState };
    } else {
      interactiveElement.state = { ...newState };
    }
    
    // Emit state change event
    this.emit('state-changed', {
      id,
      oldState,
      newState: interactiveElement.state
    });
    
    // Add to interaction history
    this.interactionHistory.push({
      elementId: id,
      action: 'state-update',
      timestamp: Date.now(),
      state: { ...interactiveElement.state }
    });
    
    return true;
  }
  
  /**
   * Gets an interactive element by ID
   * @param id Element ID
   * @returns Interactive element or null if not found
   */
  getElement(id: string): InteractiveElement | null {
    return this.interactiveElements.get(id) || null;
  }
  
  /**
   * Gets all interactive elements of a specific type
   * @param type Element type
   * @returns Array of interactive elements
   */
  getElementsByType(type: string): InteractiveElement[] {
    return Array.from(this.interactiveElements.values())
      .filter(element => element.type === type);
  }
  
  /**
   * Gets all interactive elements
   * @returns Map of interactive elements
   */
  getAllElements(): Map<string, InteractiveElement> {
    return new Map(this.interactiveElements);
  }
  
  /**
   * Gets the interaction history
   * @param limit Maximum number of entries to return
   * @returns Array of interaction history entries
   */
  getInteractionHistory(limit?: number): Array<{
    elementId: string;
    action: string;
    timestamp: number;
    state?: any;
  }> {
    const history = [...this.interactionHistory];
    if (limit && limit > 0) {
      return history.slice(-limit);
    }
    return history;
  }
  
  /**
   * Clears the interaction history
   */
  clearInteractionHistory(): void {
    this.interactionHistory = [];
  }
  
  /**
   * Simulates interaction with an element
   * @param id Element ID
   * @param action Action to simulate
   * @param options Additional options
   * @returns Boolean indicating whether the interaction was simulated
   */
  simulateInteraction(id: string, action: string, options: any = {}): boolean {
    const interactiveElement = this.interactiveElements.get(id);
    if (!interactiveElement) return false;
    
    // Create a custom event
    const event = new CustomEvent(action, {
      bubbles: true,
      cancelable: true,
      detail: options
    });
    
    // Dispatch the event
    interactiveElement.element.dispatchEvent(event as any);
    
    // Add to interaction history
    this.interactionHistory.push({
      elementId: id,
      action: `simulated-${action}`,
      timestamp: Date.now(),
      state: { ...interactiveElement.state }
    });
    
    return true;
  }
  
  /**
   * Disables all interactive elements
   */
  disableAllElements(): void {
    for (const [id, element] of this.interactiveElements.entries()) {
      this.disableElement(id);
    }
  }
  
  /**
   * Enables all interactive elements
   */
  enableAllElements(): void {
    for (const [id, element] of this.interactiveElements.entries()) {
      this.enableElement(id);
    }
  }
  
  /**
   * Disables an interactive element
   * @param id Element ID
   * @returns Boolean indicating whether the element was disabled
   */
  disableElement(id: string): boolean {
    const interactiveElement = this.interactiveElements.get(id);
    if (!interactiveElement) return false;
    
    // Add disabled class
    interactiveElement.element.classList.add('interactive-disabled');
    
    // Set disabled attribute if applicable
    if (interactiveElement.element instanceof HTMLButtonElement ||
        interactiveElement.element instanceof HTMLInputElement ||
        interactiveElement.element instanceof HTMLSelectElement ||
        interactiveElement.element instanceof HTMLTextAreaElement) {
      interactiveElement.element.disabled = true;
    }
    
    // Emit disable event
    this.emit('element-disabled', { id });
    
    return true;
  }
  
  /**
   * Enables an interactive element
   * @param id Element ID
   * @returns Boolean indicating whether the element was enabled
   */
  enableElement(id: string): boolean {
    const interactiveElement = this.interactiveElements.get(id);
    if (!interactiveElement) return false;
    
    // Remove disabled class
    interactiveElement.element.classList.remove('interactive-disabled');
    
    // Remove disabled attribute if applicable
    if (interactiveElement.element instanceof HTMLButtonElement ||
        interactiveElement.element instanceof HTMLInputElement ||
        interactiveElement.element instanceof HTMLSelectElement ||
        interactiveElement.element instanceof HTMLTextAreaElement) {
      interactiveElement.element.disabled = false;
    }
    
    // Emit enable event
    this.emit('element-enabled', { id });
    
    return true;
  }
  
  /**
   * Highlights an interactive element
   * @param id Element ID
   * @param duration Highlight duration in milliseconds
   * @returns Boolean indicating whether the element was highlighted
   */
  highlightElement(id: string, duration: number = 2000): boolean {
    const interactiveElement = this.interactiveElements.get(id);
    if (!interactiveElement) return false;
    
    // Add highlight class
    interactiveElement.element.classList.add('interactive-highlight');
    
    // Remove after duration
    setTimeout(() => {
      if (interactiveElement.element) {
        interactiveElement.element.classList.remove('interactive-highlight');
      }
    }, duration);
    
    // Emit highlight event
    this.emit('element-highlighted', { id, duration });
    
    return true;
  }
  
  /**
   * Attaches event handlers to an interactive element
   * @param interactiveElement Interactive element
   */
  private attachEventHandlers(interactiveElement: InteractiveElement): void {
    // Attach custom handlers
    Object.entries(interactiveElement.handlers).forEach(([eventName, handler]) => {
      interactiveElement.element.addEventListener(eventName, event => {
        // Call the handler
        handler(event);
        
        // Record the interaction
        this.recordInteraction(interactiveElement.id, eventName);
      });
    });
    
    // Attach common handlers for all interactive elements
    interactiveElement.element.addEventListener('click', event => {
      this.recordInteraction(interactiveElement.id, 'click');
      this.emit('element-clicked', {
        id: interactiveElement.id,
        type: interactiveElement.type,
        state: interactiveElement.state,
        originalEvent: event
      });
    });
    
    interactiveElement.element.addEventListener('mouseenter', () => {
      this.emit('element-hover', {
        id: interactiveElement.id,
        type: interactiveElement.type,
        state: interactiveElement.state
      });
    });
  }
  
  /**
   * Detaches event handlers from an interactive element
   * @param interactiveElement Interactive element
   */
  private detachEventHandlers(interactiveElement: InteractiveElement): void {
    // Remove all event handlers
    // Since we can't easily remove specific handlers, we clone the element
    const newElement = interactiveElement.element.cloneNode(true) as HTMLElement;
    if (interactiveElement.element.parentNode) {
      interactiveElement.element.parentNode.replaceChild(newElement, interactiveElement.element);
      interactiveElement.element = newElement;
    }
  }
  
  /**
   * Records an interaction in the history
   * @param elementId Element ID
   * @param action Action performed
   */
  private recordInteraction(elementId: string, action: string): void {
    const interactiveElement = this.interactiveElements.get(elementId);
    if (!interactiveElement) return;
    
    this.interactionHistory.push({
      elementId,
      action,
      timestamp: Date.now(),
      state: { ...interactiveElement.state }
    });
    
    // Limit history length
    if (this.interactionHistory.length > 1000) {
      this.interactionHistory = this.interactionHistory.slice(-1000);
    }
  }
}

// Create a singleton instance
export const interactionService = new InteractionService();