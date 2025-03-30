/**
 * Type definitions for interactive elements and user interaction handling
 * Provides interfaces for interactive components, event handling, and state management
 */

/**
 * Available interaction event types
 */
export enum InteractionEvent {
    /** Mouse click event */
    Click = 'click',
    
    /** Double click event */
    DoubleClick = 'dblclick',
    
    /** Mouse hover enter event */
    MouseEnter = 'mouseenter',
    
    /** Mouse hover leave event */
    MouseLeave = 'mouseleave',
    
    /** Mouse move event */
    MouseMove = 'mousemove',
    
    /** Mouse down event */
    MouseDown = 'mousedown',
    
    /** Mouse up event */
    MouseUp = 'mouseup',
    
    /** Touch start event (mobile) */
    TouchStart = 'touchstart',
    
    /** Touch end event (mobile) */
    TouchEnd = 'touchend',
    
    /** Touch move event (mobile) */
    TouchMove = 'touchmove',
    
    /** Drag start event */
    DragStart = 'dragstart',
    
    /** Drag over event */
    DragOver = 'dragover',
    
    /** Drag end event */
    DragEnd = 'dragend',
    
    /** Drop event */
    Drop = 'drop',
    
    /** Key down event */
    KeyDown = 'keydown',
    
    /** Key up event */
    KeyUp = 'keyup',
    
    /** Focus event */
    Focus = 'focus',
    
    /** Blur event */
    Blur = 'blur',
    
    /** Scroll event */
    Scroll = 'scroll',
    
    /** Resize event */
    Resize = 'resize',
    
    /** Custom event */
    Custom = 'custom'
  }
  
  /**
   * Event handler function type
   */
  export type EventHandlerFn = (event: Event, data?: any) => void;
  
  /**
   * Event handler configuration
   */
  export interface EventHandler {
    /** Event type to listen for */
    event: InteractionEvent | string;
    
    /** Handler function to execute when the event occurs */
    handler: EventHandlerFn;
    
    /** Additional options for the event listener */
    options?: {
      /** Whether to trigger the handler only once */
      once?: boolean;
      
      /** Whether to use capture phase */
      capture?: boolean;
      
      /** Whether to prevent the event's default action */
      preventDefault?: boolean;
      
      /** Whether to stop event propagation */
      stopPropagation?: boolean;
    };
  }
  
  /**
   * Interactive element types
   */
  export enum InteractiveElementType {
    /** Button element */
    Button = 'button',
    
    /** Toggle switch or checkbox */
    Toggle = 'toggle',
    
    /** Radio button or option selector */
    Radio = 'radio',
    
    /** Dropdown or select menu */
    Dropdown = 'dropdown',
    
    /** Slider for numeric input */
    Slider = 'slider',
    
    /** Text input field */
    TextInput = 'textInput',
    
    /** Interactive visualization element */
    Visualization = 'visualization',
    
    /** Tab panel for content organization */
    Tabs = 'tabs',
    
    /** Accordion or collapsible section */
    Accordion = 'accordion',
    
    /** Tooltip or information popup */
    Tooltip = 'tooltip',
    
    /** Modal or dialog */
    Modal = 'modal',
    
    /** Interactive list or menu */
    List = 'list',
    
    /** Draggable element */
    Draggable = 'draggable',
    
    /** Droppable target area */
    Droppable = 'droppable',
    
    /** Custom interactive element */
    Custom = 'custom'
  }
  
  /**
   * Base interface for all interactive elements
   */
  export interface InteractiveElement {
    /** Unique identifier for the element */
    id: string;
    
    /** Type of interactive element */
    type: InteractiveElementType | string;
    
    /** Element label or title */
    label?: string;
    
    /** Whether the element is currently enabled */
    enabled?: boolean;
    
    /** Whether the element is currently visible */
    visible?: boolean;
    
    /** Event handlers for this element */
    eventHandlers?: EventHandler[];
    
    /** ARIA attributes for accessibility */
    aria?: Record<string, string>;
    
    /** CSS classes to apply to the element */
    classes?: string[];
    
    /** Inline styles to apply to the element */
    styles?: Record<string, string>;
    
    /** Additional attributes to apply to the element */
    attributes?: Record<string, string>;
  }
  
  /**
   * Button interactive element
   */
  export interface ButtonElement extends InteractiveElement {
    /** Button type */
    type: InteractiveElementType.Button;
    
    /** Button variant or style */
    variant?: 'primary' | 'secondary' | 'text' | 'outline' | 'icon';
    
    /** Button size */
    size?: 'small' | 'medium' | 'large';
    
    /** Icon to display (icon name or URL) */
    icon?: string;
    
    /** Icon position relative to label */
    iconPosition?: 'left' | 'right';
    
    /** Whether the button is in a loading state */
    loading?: boolean;
    
    /** Custom tooltip text */
    tooltip?: string;
  }
  
  /**
   * Toggle (switch/checkbox) interactive element
   */
  export interface ToggleElement extends InteractiveElement {
    /** Toggle type */
    type: InteractiveElementType.Toggle;
    
    /** Whether the toggle is currently checked/on */
    checked?: boolean;
    
    /** Whether the toggle is in an indeterminate state */
    indeterminate?: boolean;
    
    /** Toggle appearance */
    appearance?: 'checkbox' | 'switch' | 'toggle';
    
    /** Label position relative to the toggle */
    labelPosition?: 'left' | 'right';
  }
  
  /**
   * Radio interactive element
   */
  export interface RadioElement extends InteractiveElement {
    /** Radio type */
    type: InteractiveElementType.Radio;
    
    /** Available options for the radio group */
    options: Array<{
      /** Option value */
      value: string;
      
      /** Option display label */
      label: string;
      
      /** Whether this option is disabled */
      disabled?: boolean;
    }>;
    
    /** Currently selected value */
    selectedValue?: string;
    
    /** Whether to display horizontally or vertically */
    layout?: 'horizontal' | 'vertical';
  }
  
  /**
   * Dropdown interactive element
   */
  export interface DropdownElement extends InteractiveElement {
    /** Dropdown type */
    type: InteractiveElementType.Dropdown;
    
    /** Available options for the dropdown */
    options: Array<{
      /** Option value */
      value: string;
      
      /** Option display label */
      label: string;
      
      /** Option group (for grouped dropdowns) */
      group?: string;
      
      /** Whether this option is disabled */
      disabled?: boolean;
      
      /** Icon to display with this option */
      icon?: string;
    }>;
    
    /** Currently selected value(s) */
    selectedValues?: string[];
    
    /** Whether multiple selections are allowed */
    multiple?: boolean;
    
    /** Placeholder text when no option is selected */
    placeholder?: string;
    
    /** Whether the dropdown is searchable */
    searchable?: boolean;
    
    /** Maximum height of the dropdown menu */
    maxHeight?: number;
  }
  
  /**
   * Slider interactive element
   */
  export interface SliderElement extends InteractiveElement {
    /** Slider type */
    type: InteractiveElementType.Slider;
    
    /** Minimum value */
    min: number;
    
    /** Maximum value */
    max: number;
    
    /** Step increment */
    step?: number;
    
    /** Current value */
    value?: number;
    
    /** For range sliders, the second value */
    value2?: number;
    
    /** Whether this is a range slider */
    isRange?: boolean;
    
    /** Whether to show markers for steps */
    showMarkers?: boolean;
    
    /** Whether to show the current value */
    showValue?: boolean;
    
    /** Format function for displayed values */
    valueFormatter?: (value: number) => string;
    
    /** Whether the slider is vertical */
    vertical?: boolean;
  }
  
  /**
   * Text input interactive element
   */
  export interface TextInputElement extends InteractiveElement {
    /** Text input type */
    type: InteractiveElementType.TextInput;
    
    /** Input type attribute */
    inputType?: 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'url';
    
    /** Current value */
    value?: string;
    
    /** Placeholder text */
    placeholder?: string;
    
    /** Maximum length */
    maxLength?: number;
    
    /** Validation pattern (regex) */
    pattern?: string;
    
    /** Whether the input is required */
    required?: boolean;
    
    /** Whether the input is read-only */
    readOnly?: boolean;
    
    /** Whether to show a clear button */
    clearable?: boolean;
    
    /** Icon to display with the input */
    icon?: string;
    
    /** Icon position */
    iconPosition?: 'left' | 'right';
  }
  
  /**
   * Tabs interactive element
   */
  export interface TabsElement extends InteractiveElement {
    /** Tabs type */
    type: InteractiveElementType.Tabs;
    
    /** Tab panels */
    tabs: Array<{
      /** Tab identifier */
      id: string;
      
      /** Tab label */
      label: string;
      
      /** Icon to display with the tab */
      icon?: string;
      
      /** Whether this tab is disabled */
      disabled?: boolean;
      
      /** Content for this tab panel */
      content?: any;
    }>;
    
    /** Currently active tab ID */
    activeTab?: string;
    
    /** Tab position */
    position?: 'top' | 'bottom' | 'left' | 'right';
    
    /** Whether tabs can be closed */
    closable?: boolean;
    
    /** Whether tabs can be reordered */
    reorderable?: boolean;
  }
  
  /**
   * Accordion interactive element
   */
  export interface AccordionElement extends InteractiveElement {
    /** Accordion type */
    type: InteractiveElementType.Accordion;
    
    /** Accordion sections */
    sections: Array<{
      /** Section identifier */
      id: string;
      
      /** Section title */
      title: string;
      
      /** Icon to display with the section */
      icon?: string;
      
      /** Whether this section is expanded */
      expanded?: boolean;
      
      /** Whether this section is disabled */
      disabled?: boolean;
      
      /** Content for this section */
      content?: any;
    }>;
    
    /** Whether multiple sections can be expanded simultaneously */
    allowMultiple?: boolean;
    
    /** Default expanded section ID(s) */
    defaultExpanded?: string[];
  }
  
  /**
   * Interactive visualization specific configuration
   */
  export interface InteractiveVisualizationConfig {
    /** Type of visualization */
    visualizationType: string;
    
    /** Whether to enable zooming */
    zoomable?: boolean;
    
    /** Whether to enable panning */
    pannable?: boolean;
    
    /** Whether to enable selection of elements */
    selectable?: boolean;
    
    /** Whether to enable dragging of elements */
    draggable?: boolean;
    
    /** Whether to show tooltips on hover */
    tooltips?: boolean;
    
    /** Whether to highlight related elements */
    highlightRelated?: boolean;
    
    /** Whether to enable filtering controls */
    filterable?: boolean;
    
    /** Whether to enable context menu */
    contextMenu?: boolean;
    
    /** Whether to enable keyboard navigation */
    keyboardNavigable?: boolean;
    
    /** Initial elements to highlight */
    initialHighlight?: string[];
    
    /** Custom interaction handlers specific to the visualization */
    interactionHandlers?: Record<string, EventHandlerFn>;
  }
  
  /**
   * Modal or dialog configuration
   */
  export interface ModalConfig {
    /** Unique identifier for the modal */
    id: string;
    
    /** Modal title */
    title?: string;
    
    /** Modal content */
    content: any;
    
    /** Whether the modal is currently open */
    isOpen?: boolean;
    
    /** Size of the modal */
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    
    /** Whether the modal can be closed by clicking outside */
    closeOnClickOutside?: boolean;
    
    /** Whether the modal can be closed by pressing Escape */
    closeOnEscape?: boolean;
    
    /** Whether to show a close button */
    showCloseButton?: boolean;
    
    /** Modal placement */
    placement?: 'center' | 'top' | 'right' | 'bottom' | 'left';
    
    /** Whether to use a backdrop/overlay */
    hasBackdrop?: boolean;
    
    /** Z-index for the modal */
    zIndex?: number;
    
    /** Animation for opening and closing */
    animation?: {
      /** Animation for opening */
      open?: string;
      
      /** Animation for closing */
      close?: string;
      
      /** Animation duration in milliseconds */
      duration?: number;
    };
  }
  
  /**
   * Global interactive configuration for a presentation
   */
  export interface InteractionConfig {
    /** Whether interactivity is enabled globally */
    enabled: boolean;
    
    /** Interactive elements in the presentation */
    elements: Record<string, InteractiveElement>;
    
    /** Global event handlers */
    globalEventHandlers?: EventHandler[];
    
    /** Default configuration for interactive visualizations */
    visualizationDefaults?: Partial<InteractiveVisualizationConfig>;
    
    /** Modal configurations */
    modals?: Record<string, ModalConfig>;
    
    /** State management configuration */
    state?: {
      /** Initial state values */
      initial: Record<string, any>;
      
      /** State change handlers */
      handlers?: Record<string, (state: Record<string, any>, payload: any) => void>;
    };
    
    /** Synchronization between different interactive elements */
    synchronization?: Array<{
      /** Source element ID */
      sourceId: string;
      
      /** Target element ID */
      targetId: string;
      
      /** Source event to watch */
      sourceEvent: string;
      
      /** Target property to update */
      targetProperty: string;
      
      /** Optional transformation function */
      transform?: (value: any) => any;
    }>;
  }