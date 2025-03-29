/**
 * Slide Template Utilities
 * Provides functions to generate common slide templates
 */
import { SlideConfig, SlideContent } from '../types/slide-data';
import { GraphData } from '../types/graph-data';

/**
 * Interface for title slide template
 */
export interface TitleSlideParams {
  /** Unique identifier for the slide */
  id: string;
  
  /** Title of the presentation */
  title: string;
  
  /** Subtitle or additional information */
  subtitle?: string;
  
  /** Presenter information */
  presenter?: {
    name: string;
    title?: string;
    organization?: string;
  };
  
  /** Background configuration */
  background?: {
    color?: string;
    image?: string;
    opacity?: number;
  };
}

/**
 * Interface for section slide template
 */
export interface SectionSlideParams {
  /** Unique identifier for the slide */
  id: string;
  
  /** Section title */
  title: string;
  
  /** Brief description of the section */
  description?: string;
  
  /** Background configuration */
  background?: {
    color?: string;
    image?: string;
    opacity?: number;
  };
  
  /** Transition effect */
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
}

/**
 * Interface for concept slide template
 */
export interface ConceptSlideParams {
  /** Unique identifier for the slide */
  id: string;
  
  /** Concept title */
  title: string;
  
  /** Concept definition */
  definition: string;
  
  /** Key points about the concept */
  keyPoints?: string[];
  
  /** Example or illustration */
  example?: string;
  
  /** Graph data for visualization */
  graphData?: GraphData;
  
  /** Transition effect */
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  
  /** Presenter notes */
  notes?: string;
}

/**
 * Interface for comparison slide template
 */
export interface ComparisonSlideParams {
  /** Unique identifier for the slide */
  id: string;
  
  /** Comparison title */
  title: string;
  
  /** Brief description of the comparison */
  description?: string;
  
  /** Table headers */
  headers: string[];
  
  /** Table rows data */
  rows: Array<Record<string, any>>;
  
  /** Table caption */
  caption?: string;
  
  /** Cells to highlight */
  highlightCells?: Array<{ row: number; col: number }>;
  
  /** Transition effect */
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  
  /** Presenter notes */
  notes?: string;
}

/**
 * Interface for process flow slide template
 */
export interface ProcessFlowSlideParams {
  /** Unique identifier for the slide */
  id: string;
  
  /** Process title */
  title: string;
  
  /** Brief description of the process */
  description?: string;
  
  /** Process steps data */
  steps: Array<{
    id: string;
    label: string;
    type?: 'process' | 'decision' | 'start' | 'end' | 'io';
  }>;
  
  /** Connections between steps */
  connections: Array<{
    from: string;
    to: string;
    label?: string;
  }>;
  
  /** Flow direction */
  direction?: 'TB' | 'LR' | 'RL' | 'BT';
  
  /** Transition effect */
  transition?: 'none' | 'fade' | 'slide' | 'convex' | 'concave' | 'zoom';
  
  /** Presenter notes */
  notes?: string;
}

/**
 * Creates a title slide
 * @param params Title slide parameters
 * @returns Slide configuration object
 */
export function createTitleSlide(params: TitleSlideParams): SlideConfig {
  const content: SlideContent = {};
  
  if (params.subtitle) {
    content.subtitle = params.subtitle;
  }
  
  if (params.presenter) {
    content.presenter = `${params.presenter.name}${params.presenter.title ? `, ${params.presenter.title}` : ''}${params.presenter.organization ? ` | ${params.presenter.organization}` : ''}`;
  }
  
  return {
    id: params.id,
    title: params.title,
    content,
    visualizationType: 'none',
    background: params.background,
    transition: 'fade',
    classes: ['title-slide']
  };
}

/**
 * Creates a section title slide
 * @param params Section slide parameters
 * @returns Slide configuration object
 */
export function createSectionSlide(params: SectionSlideParams): SlideConfig {
  const content: SlideContent = {};
  
  if (params.description) {
    content.definition = params.description;
  }
  
  return {
    id: params.id,
    title: params.title,
    content,
    visualizationType: 'none',
    background: params.background,
    transition: params.transition || 'fade',
    classes: ['section-slide']
  };
}

/**
 * Creates a concept explanation slide
 * @param params Concept slide parameters
 * @returns Slide configuration object
 */
export function createConceptSlide(params: ConceptSlideParams): SlideConfig {
  const content: SlideContent = {
    definition: params.definition
  };
  
  if (params.keyPoints && params.keyPoints.length > 0) {
    content.keyPoints = params.keyPoints;
  }
  
  if (params.example) {
    content.example = params.example;
  }
  
  // Determine visualization type based on provided data
  const visualizationType = params.graphData ? 'graph' : 'none';
  
  // Create visualization config if graph data is provided
  const visualizationConfig = params.graphData ? {
    data: params.graphData,
    layout: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      padding: 30
    },
    nodeTooltips: true,
    edgeTooltips: true
  } : undefined;
  
  return {
    id: params.id,
    title: params.title,
    content,
    visualizationType,
    visualizationConfig,
    transition: params.transition || 'slide',
    notes: params.notes,
    classes: ['concept-slide']
  };
}

/**
 * Creates a comparison slide with a table
 * @param params Comparison slide parameters
 * @returns Slide configuration object
 */
export function createComparisonSlide(params: ComparisonSlideParams): SlideConfig {
  const content: SlideContent = {};
  
  if (params.description) {
    content.definition = params.description;
  }
  
  return {
    id: params.id,
    title: params.title,
    content,
    visualizationType: 'table',
    visualizationConfig: {
      headers: params.headers,
      rows: params.rows,
      caption: params.caption,
      highlightCells: params.highlightCells,
      sortable: true
    },
    transition: params.transition || 'slide',
    notes: params.notes,
    classes: ['comparison-slide']
  };
}

/**
 * Creates a process flow slide
 * @param params Process flow slide parameters
 * @returns Slide configuration object
 */
export function createProcessFlowSlide(params: ProcessFlowSlideParams): SlideConfig {
  const content: SlideContent = {};
  
  if (params.description) {
    content.definition = params.description;
  }
  
  // Map step data to node format expected by flow diagram
  const nodes = params.steps.map(step => ({
    id: step.id,
    label: step.label,
    type: step.type || 'process'
  }));
  
  // Map connections to edges format expected by flow diagram
  const edges = params.connections.map(conn => ({
    from: conn.from,
    to: conn.to,
    label: conn.label
  }));
  
  return {
    id: params.id,
    title: params.title,
    content,
    visualizationType: 'flowDiagram',
    visualizationConfig: {
      nodes,
      edges,
      direction: params.direction || 'TB',
      autoLayout: true
    },
    transition: params.transition || 'slide',
    notes: params.notes,
    classes: ['process-flow-slide']
  };
}

/**
 * Creates a code example slide
 * @param id Slide identifier
 * @param title Slide title
 * @param description Optional description
 * @param language Programming language
 * @param code Code snippet
 * @param notes Optional presenter notes
 * @returns Slide configuration object
 */
export function createCodeSlide(
  id: string,
  title: string,
  description: string | undefined,
  language: string,
  code: string,
  notes?: string
): SlideConfig {
  const content: SlideContent = {};
  
  if (description) {
    content.definition = description;
  }
  
  content.codeSnippets = [
    {
      language,
      code,
      caption: `${language.charAt(0).toUpperCase() + language.slice(1)} Example`
    }
  ];
  
  return {
    id,
    title,
    content,
    visualizationType: 'none',
    transition: 'fade',
    notes,
    classes: ['code-slide']
  };
}

/**
 * Creates a quote slide
 * @param id Slide identifier
 * @param quote Quote text
 * @param author Quote author
 * @param source Quote source
 * @param background Optional background configuration
 * @returns Slide configuration object
 */
export function createQuoteSlide(
  id: string,
  quote: string,
  author: string,
  source?: string,
  background?: { color?: string; image?: string; opacity?: number }
): SlideConfig {
  return {
    id,
    title: '',
    content: {
      quote: {
        text: quote,
        author,
        source
      }
    },
    visualizationType: 'none',
    background: background || { color: '#2a2a2a' },
    transition: 'fade',
    classes: ['quote-slide']
  };
}