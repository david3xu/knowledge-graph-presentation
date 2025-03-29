/**
 * Type definitions for slide configuration and management
 */
import { GraphData, GraphLayoutOptions, GraphFilter } from './graph-data';

/**
 * Available visualization types that can be used in slides
 */
export type VisualizationType = 
  | 'none'           // No visualization
  | 'graph'          // Knowledge graph visualization
  | 'timeline'       // Timeline visualization
  | 'table'          // Comparison table
  | 'flowDiagram'    // Process flow diagram
  | 'barChart'       // Bar chart
  | 'pieChart'       // Pie chart
  | 'codeBlock'      // Code syntax highlighting
  | 'ascii';         // ASCII to SVG conversion

/**
 * Base configuration for all slide types
 */
export interface SlideConfig {
  /** Unique identifier for this slide */
  id: string;
  
  /** Slide title */
  title: string;
  
  /** Optional CSS classes to apply to this slide */
  classes?: string[];
  
  /** Content for the slide */
  content: SlideContent | null;
  
  /** Type of visualization to display */
  visualizationType: VisualizationType;
  
  /** Configuration for the visualization */
  visualizationConfig?: any;
  
  /** Transition effect when entering this slide */
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  
  /** Background configuration */
  background?: {
    /** Background color */
    color?: string;
    
    /** Background image URL */
    image?: string;
    
    /** Background image opacity (0-1) */
    opacity?: number;
    
    /** Background image size */
    size?: 'cover' | 'contain' | 'auto';
  };
  
  /** Optional notes for the presenter */
  notes?: string;
}

/**
 * Content structure for slides
 */
export interface SlideContent {
  /** Main textual definition or description */
  definition?: string;
  
  /** Key points to highlight */
  keyPoints?: string[];
  
  /** Quote to display */
  quote?: {
    text: string;
    author?: string;
    source?: string;
  };
  
  /** Code snippets to display */
  codeSnippets?: {
    language: string;
    code: string;
    caption?: string;
  }[];
  
  /** Structured list items */
  listItems?: {
    title?: string;
    items: string[];
    type?: 'bullet' | 'numbered';
  }[];
  
  /** Citations and references */
  references?: {
    text: string;
    url?: string;
  }[];
  
  /** Any additional custom content */
  [key: string]: any;
}

/**
 * Configuration for graph visualization slides
 */
export interface GraphSlideConfig extends SlideConfig {
  visualizationType: 'graph';
  visualizationConfig: {
    data: GraphData;
    layout?: GraphLayoutOptions;
    filter?: GraphFilter;
    highlightNodes?: string[];
    highlightEdges?: string[];
    initialZoom?: number;
    interactive?: boolean;
    legend?: boolean;
    nodeTooltips?: boolean;
    edgeTooltips?: boolean;
  };
}

/**
 * Configuration for timeline visualization slides
 */
export interface TimelineSlideConfig extends SlideConfig {
  visualizationType: 'timeline';
  visualizationConfig: {
    data: {
      period: string;
      label: string;
      items: string[];
    }[];
    orientation?: 'horizontal' | 'vertical';
    showLabels?: boolean;
    colorScheme?: string[];
  };
}

/**
 * Configuration for comparison table slides
 */
export interface TableSlideConfig extends SlideConfig {
  visualizationType: 'table';
  visualizationConfig: {
    headers: string[];
    rows: {
      [key: string]: string | number | boolean;
    }[];
    highlightCells?: {
      row: number;
      col: number;
    }[];
    caption?: string;
    sortable?: boolean;
    filterable?: boolean;
  };
}

/**
 * Configuration for flow diagram slides
 */
export interface FlowDiagramSlideConfig extends SlideConfig {
  visualizationType: 'flowDiagram';
  visualizationConfig: {
    nodes: {
      id: string;
      label: string;
      type: 'process' | 'decision' | 'start' | 'end' | 'io';
      position?: { x: number; y: number };
    }[];
    edges: {
      from: string;
      to: string;
      label?: string;
    }[];
    direction?: 'TB' | 'LR' | 'RL' | 'BT';
    autoLayout?: boolean;
  };
}

/**
 * Configuration for ASCII to SVG conversion slides
 */
export interface AsciiSlideConfig extends SlideConfig {
  visualizationType: 'ascii';
  visualizationConfig: {
    text: string;
    boxWidth?: number;
    boxHeight?: number;
    lineColor?: string;
    textColor?: string;
    boxColor?: string;
  };
}

/**
 * Configuration for code block slides
 */
export interface CodeBlockSlideConfig extends SlideConfig {
  visualizationType: 'codeBlock';
  visualizationConfig: {
    language: string;
    code: string;
    lineNumbers?: boolean;
    highlightLines?: number[];
    theme?: 'dark' | 'light';
  };
}

/**
 * Group of slides that form a section in the presentation
 */
export interface SlideGroup {
  /** Title of this section */
  title: string;
  
  /** Unique identifier for this group */
  id: string;
  
  /** Slides in this group */
  slides: SlideConfig[];
  
  /** Optional CSS classes to apply to all slides in this group */
  classes?: string[];
  
  /** Whether to create a section slide automatically */
  includeSectionSlide?: boolean;
}

/**
 * Configuration for a complete presentation
 */
export interface PresentationConfig {
  /** Title of the presentation */
  title: string;
  
  /** Presenter information */
  presenter?: {
    name: string;
    title?: string;
    organization?: string;
    email?: string;
  };
  
  /** Organized slide groups */
  slideGroups: SlideGroup[];
  
  /** Global presentation settings */
  settings: {
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
    theme?: 'black' | 'white' | 'league' | 'beige' | 'sky' | 'night' | 'serif' | 'simple';
  };
}