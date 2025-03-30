/**
 * Type definitions for timeline visualization data structures
 * Provides interfaces for timeline events, periods, and related configurations
 */

/**
 * Represents a single event in a timeline
 */
export interface TimelineEvent {
    /** Unique identifier for the event */
    id: string;
    
    /** Display title for the event */
    title: string;
    
    /** When the event occurred (date, time, or formatted string) */
    date: Date | string | number;
    
    /** Detailed description of the event */
    description?: string;
    
    /** URL to an image representing the event */
    imageUrl?: string;
    
    /** URL to additional information about the event */
    linkUrl?: string;
    
    /** Category or type of the event (e.g., "Publication", "Release", "Discovery") */
    category?: string;
    
    /** Importance or significance level (can be used for visual emphasis) */
    importance?: 'low' | 'medium' | 'high' | number;
    
    /** Additional properties for the event */
    properties?: Record<string, any>;
    
    /** Visual styling overrides for this specific event */
    style?: TimelineEventStyle;
  }
  
  /**
   * Styling options for timeline events
   */
  export interface TimelineEventStyle {
    /** Color of the event marker */
    color?: string;
    
    /** Border color for the event marker */
    borderColor?: string;
    
    /** Size of the event marker */
    size?: number;
    
    /** Shape of the event marker */
    shape?: 'circle' | 'square' | 'diamond' | 'star' | 'triangle';
    
    /** Text color for event title and description */
    textColor?: string;
    
    /** Background color for event details panel */
    backgroundColor?: string;
    
    /** Font size for event title */
    titleFontSize?: number;
    
    /** Font size for event description */
    descriptionFontSize?: number;
    
    /** Whether to highlight this event initially */
    highlight?: boolean;
  }
  
  /**
   * Represents a time period in a timeline
   */
  export interface TimelinePeriod {
    /** Unique identifier for the period */
    id: string;
    
    /** Display label for the period */
    label: string;
    
    /** Start date/time of the period */
    startDate: Date | string | number;
    
    /** End date/time of the period */
    endDate: Date | string | number;
    
    /** Detailed description of the period */
    description?: string;
    
    /** Events within this period */
    events?: TimelineEvent[];
    
    /** Key innovations or developments in this period */
    keyDevelopments?: string[];
    
    /** Additional properties for the period */
    properties?: Record<string, any>;
    
    /** Visual styling overrides for this specific period */
    style?: TimelinePeriodStyle;
  }
  
  /**
   * Styling options for timeline periods
   */
  export interface TimelinePeriodStyle {
    /** Background color for the period */
    backgroundColor?: string;
    
    /** Border color for the period */
    borderColor?: string;
    
    /** Text color for period label and description */
    textColor?: string;
    
    /** Border width in pixels */
    borderWidth?: number;
    
    /** Background opacity (0-1) */
    opacity?: number;
    
    /** Label position relative to period */
    labelPosition?: 'top' | 'bottom' | 'inside';
    
    /** Font size for period label */
    labelFontSize?: number;
  }
  
  /**
   * Complete timeline data structure
   */
  export interface TimelineData {
    /** Title of the timeline */
    title?: string;
    
    /** Periods in the timeline */
    periods: TimelinePeriod[];
    
    /** Events that span multiple periods or don't belong to a specific period */
    globalEvents?: TimelineEvent[];
    
    /** Visual styling defaults for all events */
    defaultEventStyle?: TimelineEventStyle;
    
    /** Visual styling defaults for all periods */
    defaultPeriodStyle?: TimelinePeriodStyle;
    
    /** Metadata about the timeline */
    metadata?: {
      /** Description of what the timeline represents */
      description?: string;
      
      /** Source of the timeline data */
      source?: string;
      
      /** When the timeline was last updated */
      lastUpdated?: string;
      
      /** Any additional properties */
      [key: string]: any;
    };
  }
  
  /**
   * Configuration options for timeline visualization
   */
  export interface TimelineConfiguration {
    /** Timeline data to display */
    data: TimelineData;
    
    /** Orientation of the timeline */
    orientation?: 'horizontal' | 'vertical';
    
    /** Time unit to use for scale */
    timeUnit?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'custom';
    
    /** Whether to scale time periods to their actual duration */
    scaleToRealTime?: boolean;
    
    /** Whether to show events */
    showEvents?: boolean;
    
    /** Whether to show period backgrounds */
    showPeriodBackgrounds?: boolean;
    
    /** Whether to show the timeline axis */
    showAxis?: boolean;
    
    /** Format for displaying dates */
    dateFormat?: string;
    
    /** Whether to enable zooming and panning */
    interactive?: boolean;
    
    /** Initial zoom level (1 = 100%) */
    initialZoom?: number;
    
    /** Color scheme for periods and events */
    colorScheme?: string[];
    
    /** Whether to show tooltips on hover */
    showTooltips?: boolean;
    
    /** Whether to animate timeline on initial display */
    animate?: boolean;
    
    /** Duration of animations in milliseconds */
    animationDuration?: number;
    
    /** Events to highlight initially */
    highlightEvents?: string[];
  }