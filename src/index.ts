/**
 * Knowledge Graph Presentation Application
 * Main entry point that initializes the presentation framework and manages slides
 */
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { PresentationConfig, SlideConfig, SlideGroup } from './types/slide-data';
import { GraphVisualization } from './visualizations/graph';
import { TimelineVisualization } from './visualizations/timeline';
import { TableVisualization } from './visualizations/table';
import { FlowDiagramVisualization } from './visualizations/flow-diagram';
import { globalResponsiveHandler, ScreenSize } from './utils/responsive';
import { animateEntrance, AnimationTiming, Easing } from './utils/animation';
import { AsciiToSvg } from './utils/ascii-to-svg';

// Import services
import { PresentationManager } from './services/presentation-manager';
import { PresentationBuilder } from './services/presentation-builder';
import { markdownLoader } from './services/markdown-loader';
import { markdownContentRegistry } from './services';

// Import modules - these will replace the imported slide groups
// Note: Import dynamically for code splitting when needed
import { getIntroductionSlides } from './modules/intro';

// Import slide modules - these will be progressively migrated to the modular architecture
// Comment these out as they are replaced by modules
import { getCoreComponentsSlides } from './modules/core-components';
import { getDataModelsSlides } from './modules/data-models';
import { getConstructionSlides } from './modules/construction';
import { getIndustryApplicationsSlides } from './modules/industry-applications';
import { getQueryMechanismsSlides } from './modules/query-mechanisms';
import { getRCASlides } from './modules/root-cause-analysis';
import { getImplementationRoadmapSlides } from './modules/implementation-roadmap';
import { getFutureDirectionsSlides } from './modules/future-directions';

/**
 * Slide Manager handles the creation and orchestration of presentation slides
 */
class SlideManager {
  private container: HTMLElement;
  private slidesContainer: HTMLElement;
  private config: PresentationConfig | null = null;
  private revealInstance: Reveal.Api | null = null;
  private visualizations: Map<string, any> = new Map();
  private currentSlide: string | null = null;
  private resizeObserver: ResizeObserver | null = null;
  
  /**
   * Creates a new SlideManager instance
   * @param container The main container element for the presentation
   */
  constructor(container: HTMLElement) {
    this.container = container;
    
    // Find or create the slides container
    let slidesContainer = container.querySelector('.slides');
    if (!slidesContainer) {
      slidesContainer = document.createElement('div');
      slidesContainer.className = 'slides';
      container.appendChild(slidesContainer);
    }
    
    this.slidesContainer = slidesContainer as HTMLElement;
    
    // Set up resize observer for responsive handling
    this.setupResizeObserver();
  }
  
  /**
   * Sets up a resize observer to handle container size changes
   */
  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        // Update reveal size on container resize
        if (this.revealInstance) {
          this.revealInstance.layout();
        }
        
        // Update current visualization if any
        if (this.currentSlide) {
          const visualization = this.visualizations.get(this.currentSlide);
          if (visualization && typeof visualization.render === 'function') {
            visualization.render();
          }
        }
      });
      
      this.resizeObserver.observe(this.container);
    }
  }
  
  /**
   * Loads a presentation configuration
   * @param config Presentation configuration object
   */
  public loadPresentation(config: PresentationConfig): void {
    this.config = config;
    
    // Clear existing content
    this.slidesContainer.innerHTML = '';
    this.visualizations.clear();
    
    // Set document title if available
    if (config.title) {
      document.title = config.title;
    }
    
    // Create slides for each group
    config.slideGroups.forEach(group => {
      this.createSlideGroup(group);
    });
    
    // Initialize Reveal.js
    this.initializeReveal(config.settings);
  }
  
  /**
   * Creates slides for a slide group
   * @param group Slide group configuration
   */
  private createSlideGroup(group: SlideGroup): void {
    // Create section slide if enabled
    if (group.includeSectionSlide) {
      this.createSectionSlide(group);
    }
    
    // Create individual slides
    group.slides.forEach(slide => {
      this.createSlide(slide, group.classes || []);
    });
  }
  
  /**
   * Creates a section title slide
   * @param group Slide group configuration
   */
  private createSectionSlide(group: SlideGroup): void {
    const sectionSlide = document.createElement('section');
    sectionSlide.className = 'section-slide';
    
    if (group.classes) {
      group.classes.forEach(className => {
        sectionSlide.classList.add(className);
      });
    }
    
    // Add section title
    const title = document.createElement('h1');
    title.textContent = group.title;
    sectionSlide.appendChild(title);
    
    // Add to slides container
    this.slidesContainer.appendChild(sectionSlide);
  }
  
  /**
   * Creates a single slide from configuration
   * @param config Slide configuration
   * @param groupClasses Additional CSS classes from the parent group
   */
  private createSlide(config: SlideConfig, groupClasses: string[] = []): void {
    // Create slide element
    const slide = document.createElement('section');
    slide.id = config.id;
    slide.dataset.slideId = config.id;
    
    // Add transition attribute if specified
    if (config.transition) {
      slide.dataset.transition = config.transition;
    }
    
    // Add background if specified
    if (config.background) {
      if (config.background.color) {
        slide.dataset.backgroundColor = config.background.color;
      }
      
      if (config.background.image) {
        slide.dataset.backgroundImage = `url(${config.background.image})`;
        
        if (config.background.opacity !== undefined) {
          slide.dataset.backgroundOpacity = config.background.opacity.toString();
        }
        
        if (config.background.size) {
          slide.dataset.backgroundSize = config.background.size;
        }
      }
    }
    
    // Add classes
    if (config.classes) {
      config.classes.forEach(className => {
        slide.classList.add(className);
      });
    }
    
    groupClasses.forEach(className => {
      slide.classList.add(className);
    });
    
    // Add title
    if (config.title) {
      const titleElement = document.createElement('h2');
      titleElement.className = 'slide-title';
      titleElement.textContent = config.title;
      slide.appendChild(titleElement);
    }
    
    // Add content if available
    if (config.content) {
      this.createSlideContent(slide, config);
    }
    
    // Add visualization if specified
    if (config.visualizationType !== 'none') {
      this.createVisualizationContainer(slide, config);
    }
    
    // Add presenter notes if available
    if (config.notes) {
      const notesElement = document.createElement('aside');
      notesElement.className = 'notes';
      notesElement.innerHTML = config.notes;
      slide.appendChild(notesElement);
    }
    
    // Add to slides container
    this.slidesContainer.appendChild(slide);
  }
  
  /**
   * Creates slide content based on the configuration
   * @param slide Slide element
   * @param config Slide configuration
   */
  private createSlideContent(slide: HTMLElement, config: SlideConfig): void {
    const content = config.content;
    if (!content) return;
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'slide-content';
    
    // Add definition if available
    if (content.definition) {
      const definition = document.createElement('div');
      definition.className = 'definition';
      definition.innerHTML = content.definition;
      contentContainer.appendChild(definition);
    }
    
    // Add key points if available
    if (content.keyPoints && content.keyPoints.length > 0) {
      const keyPoints = document.createElement('ul');
      keyPoints.className = 'key-points';
      
      content.keyPoints.forEach(point => {
        const li = document.createElement('li');
        li.innerHTML = point;
        keyPoints.appendChild(li);
      });
      
      contentContainer.appendChild(keyPoints);
    }
    
    // Add quote if available
    if (content.quote) {
      const quoteContainer = document.createElement('blockquote');
      quoteContainer.className = 'quote';
      
      const quoteText = document.createElement('p');
      quoteText.innerHTML = content.quote.text;
      quoteContainer.appendChild(quoteText);
      
      if (content.quote.author || content.quote.source) {
        const citation = document.createElement('cite');
        citation.textContent = [
          content.quote.author,
          content.quote.source
        ].filter(Boolean).join(', ');
        quoteContainer.appendChild(citation);
      }
      
      contentContainer.appendChild(quoteContainer);
    }
    
    // Add code snippets if available
    if (content.codeSnippets && content.codeSnippets.length > 0) {
      content.codeSnippets.forEach(snippet => {
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-snippet';
        
        if (snippet.caption) {
          const caption = document.createElement('div');
          caption.className = 'code-caption';
          caption.textContent = snippet.caption;
          codeContainer.appendChild(caption);
        }
        
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.className = `language-${snippet.language}`;
        code.textContent = snippet.code;
        pre.appendChild(code);
        codeContainer.appendChild(pre);
        
        contentContainer.appendChild(codeContainer);
      });
    }
    
    // Add list items if available
    if (content.listItems && content.listItems.length > 0) {
      content.listItems.forEach(listItem => {
        if (listItem.title) {
          const listTitle = document.createElement('h3');
          listTitle.className = 'list-title';
          listTitle.textContent = listItem.title;
          contentContainer.appendChild(listTitle);
        }
        
        const list = document.createElement(listItem.type === 'numbered' ? 'ol' : 'ul');
        list.className = 'content-list';
        
        listItem.items.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = item;
          list.appendChild(li);
        });
        
        contentContainer.appendChild(list);
      });
    }
    
    // Add references if available
    if (content.references && content.references.length > 0) {
      const references = document.createElement('div');
      references.className = 'references';
      
      const title = document.createElement('h3');
      title.textContent = 'References';
      references.appendChild(title);
      
      const list = document.createElement('ul');
      
      content.references.forEach(ref => {
        const li = document.createElement('li');
        
        if (ref.url) {
          const link = document.createElement('a');
          link.href = ref.url;
          link.target = '_blank';
          link.textContent = ref.text;
          li.appendChild(link);
        } else {
          li.textContent = ref.text;
        }
        
        list.appendChild(li);
      });
      
      references.appendChild(list);
      contentContainer.appendChild(references);
    }
    
    // Add any custom properties
    Object.entries(content).forEach(([key, value]) => {
      // Skip already handled properties
      if ([
        'definition', 'keyPoints', 'quote',
        'codeSnippets', 'listItems', 'references'
      ].includes(key)) {
        return;
      }
      
      // Add custom content
      if (typeof value === 'string') {
        const customContainer = document.createElement('div');
        customContainer.className = `custom-content ${key}`;
        customContainer.innerHTML = value;
        contentContainer.appendChild(customContainer);
      }
    });
    
    // Add content container to slide
    slide.appendChild(contentContainer);
  }
  
  /**
   * Creates a visualization container and registers the visualization for later initialization
   * @param slide Slide element
   * @param config Slide configuration
   */
  private createVisualizationContainer(slide: HTMLElement, config: SlideConfig): void {
    // Create visualization container
    const visualizationContainer = document.createElement('div');
    visualizationContainer.className = `visualization-container ${config.visualizationType}-visualization`;
    slide.appendChild(visualizationContainer);
    
    // Register the visualization for later initialization
    // The actual visualization will be created when the slide becomes active
    this.registerVisualization(config.id, config.visualizationType, visualizationContainer, config.visualizationConfig);
  }
  
  /**
   * Registers a visualization for a slide
   * @param slideId Slide ID
   * @param type Type of visualization
   * @param container Container element
   * @param config Visualization configuration
   */
  private registerVisualization(
    slideId: string,
    type: string,
    container: HTMLElement,
    config: any
  ): void {
    // Store the visualization details for later initialization
    this.visualizations.set(slideId, {
      type,
      container,
      config,
      instance: null,
      initialized: false
    });
  }
  
  /**
   * Initializes a visualization for a slide
   * @param slideId Slide ID
   */
  private initializeVisualization(slideId: string): void {
    const visualization = this.visualizations.get(slideId);
    if (!visualization || visualization.initialized) return;
    
    // Create the visualization based on type
    switch (visualization.type) {
      case 'graph':
        this.initializeGraphVisualization(visualization);
        break;
        
      case 'timeline':
        this.initializeTimelineVisualization(visualization);
        break;
        
      case 'table':
        this.initializeTableVisualization(visualization);
        break;
        
      case 'flowDiagram':
        this.initializeFlowDiagramVisualization(visualization);
        break;
        
      case 'ascii':
        this.initializeAsciiVisualization(visualization);
        break;
        
      // Additional visualization types would be handled here
    }
    
    // Mark as initialized
    visualization.initialized = true;
  }
  
  /**
   * Initializes a graph visualization
   * @param visualization Visualization data
   */
  private initializeGraphVisualization(visualization: any): void {
    const { container, config } = visualization;
    
    // Create graph visualization with container and config
    const graph = new GraphVisualization({
      container,
      data: config.data,
      height: container.clientHeight || 400,
      width: container.clientWidth || 600,
      nodeColor: config.nodeColor,
      edgeColor: config.edgeColor,
      layout: config.layout,
      nodeStyleFunction: config.nodeStyleFunction,
      edgeStyleFunction: config.edgeStyleFunction,
      highlightNodes: config.highlightNodes,
      highlightEdges: config.highlightEdges,
      physics: config.physics !== false,
      draggable: config.draggable !== false,
      zoomable: config.zoomable !== false,
      initialZoom: config.initialZoom,
      onClick: config.onClick
    });
    
    // Store instance
    visualization.instance = graph;
  }
  
  /**
   * Initializes a timeline visualization
   * @param visualization Visualization data
   */
  private initializeTimelineVisualization(visualization: any): void {
    const { container, config } = visualization;
    
    // Create timeline visualization
    const timeline = new TimelineVisualization({
      container,
      data: config.data,
      height: container.clientHeight || 400,
      width: container.clientWidth || 600,
      orientation: config.orientation || 'horizontal',
      showAxisLabels: config.showLabels !== false,
      colorScheme: config.colorScheme
    });
    
    // Store instance
    visualization.instance = timeline;
  }
  
  /**
   * Initializes a table visualization
   * @param visualization Visualization data
   */
  private initializeTableVisualization(visualization: any): void {
    const { container, config } = visualization;
    
    // Create table visualization
    const table = new TableVisualization({
      container,
      headers: config.headers,
      rows: config.rows,
      highlightCells: config.highlightCells,
      caption: config.caption,
      sortable: config.sortable !== false,
      filterable: config.filterable || false
    });
    
    // Store instance
    visualization.instance = table;
  }
  
  /**
   * Initializes a flow diagram visualization
   * @param visualization Visualization data
   */
  private initializeFlowDiagramVisualization(visualization: any): void {
    const { container, config } = visualization;
    
    // Create flow diagram visualization
    const flowDiagram = new FlowDiagramVisualization({
      container,
      nodes: config.nodes,
      edges: config.edges,
      height: container.clientHeight || 400,
      width: container.clientWidth || 600,
      direction: config.direction || 'TB',
      autoLayout: config.autoLayout !== false,
      draggable: config.draggable !== false
    });
    
    // Store instance
    visualization.instance = flowDiagram;
  }
  
  /**
   * Initializes an ASCII to SVG visualization
   * @param visualization Visualization data
   */
  private initializeAsciiVisualization(visualization: any): void {
    const { container, config } = visualization;
    
    // Create ASCII to SVG converter
    const asciiToSvg = new AsciiToSvg({
      text: config.text,
      boxWidth: config.boxWidth || 10,
      boxHeight: config.boxHeight || 20,
      lineColor: config.lineColor || '#333',
      textColor: config.textColor || '#000',
      boxColor: config.boxColor || '#f5f5f5'
    });
    
    // Convert and add to container
    const svg = asciiToSvg.convert();
    container.appendChild(svg);
    
    // Store instance
    visualization.instance = asciiToSvg;
  }
  
  /**
   * Initializes the Reveal.js presentation framework
   * @param settings Presentation settings
   */
  private initializeReveal(settings: PresentationConfig['settings']): void {
    // Map slideNumber to valid Reveal.js values
    let slideNumberSetting: boolean | 'h.v' | 'h/v' | 'c' | 'c/t' = false;
    
    if (typeof settings.showSlideNumber === 'boolean') {
      slideNumberSetting = settings.showSlideNumber;
    } else if (settings.showSlideNumber === 'all') {
      slideNumberSetting = 'c/t';
    } else if (typeof settings.showSlideNumber === 'string' && 
               ['h.v', 'h/v', 'c', 'c/t'].includes(settings.showSlideNumber)) {
      slideNumberSetting = settings.showSlideNumber as 'h.v' | 'h/v' | 'c' | 'c/t';
    }

    // Apply default settings
    const revealSettings = {
      // Default settings
      hash: true,
      history: true,
      controls: settings.controls !== false,
      progress: settings.progress !== false,
      center: settings.center !== false,
      slideNumber: slideNumberSetting,
      transition: settings.defaultTransition || 'slide',
      // Allow keyboard navigation unless explicitly disabled
      keyboard: settings.keyboard !== false,
      // Add overview mode
      overview: true,
      // Auto-animate where possible
      autoAnimateDuration: 0.8,
      autoAnimateEasing: 'ease',
      // Additional settings
      touch: true,
      fragmentInURL: true,
      // Set up slide change event
      plugins: []
    };
    
    // Initialize Reveal
    const deck = new Reveal(this.container, revealSettings);
    
    // Register event listeners
    deck.on('ready', this.handleRevealReady.bind(this));
    deck.on('slidechanged', this.handleSlideChanged.bind(this));
    
    // Initialize the presentation
    deck.initialize().then(() => {
      this.revealInstance = deck;
    });
  }
  
  /**
   * Handles the Reveal ready event
   * @param event Ready event
   */
  private handleRevealReady(event: any): void {
    // Get the initial slide
    const indices = this.revealInstance?.getIndices();
    if (!indices) return;
    
    // Initialize the current slide
    const currentSlideElement = this.revealInstance?.getSlides()[indices.h];
    if (currentSlideElement) {
      const slideId = currentSlideElement.getAttribute('data-slide-id');
      if (slideId) {
        this.currentSlide = slideId;
        this.initializeVisualization(slideId);
        this.renderVisualization(slideId);
      }
    }
    
    // Apply animations to visible elements
    this.animateSlideElements(currentSlideElement as Element);
  }
  
  /**
   * Handles slide change events
   * @param event Slide change event
   */
  private handleSlideChanged(event: any): void {
    const slideElement = event.currentSlide;
    const slideId = slideElement.getAttribute('data-slide-id');
    
    if (!slideId) return;
    
    // Update current slide
    this.currentSlide = slideId;
    
    // Initialize visualization if not already done
    this.initializeVisualization(slideId);
    
    // Render the visualization
    this.renderVisualization(slideId);
    
    // Animate slide elements
    this.animateSlideElements(slideElement);
  }
  
  /**
   * Renders the visualization for a slide
   * @param slideId Slide ID
   */
  private renderVisualization(slideId: string): void {
    const visualization = this.visualizations.get(slideId);
    if (!visualization || !visualization.instance || !visualization.initialized) return;
    
    // Call the render method on the visualization instance
    if (typeof visualization.instance.render === 'function') {
      visualization.instance.render();
    }
  }
  
  /**
   * Animates elements within a slide
   * @param slideElement Slide element
   */
  private animateSlideElements(slideElement: Element): void {
    // Define animation timing
    const timing: AnimationTiming = {
      duration: 800,
      easing: Easing.easeOutQuad,
      delay: 300
    };
    
    // Animate title
    const title = slideElement.querySelector('.slide-title');
    if (title instanceof HTMLElement) {
      animateEntrance(title, 'fade', timing);
    }
    
    // Animate content with staggered timing
    const contentElements = slideElement.querySelectorAll('.slide-content > *');
    contentElements.forEach((element, index) => {
      if (element instanceof HTMLElement) {
        const elementTiming: AnimationTiming = {
          ...timing,
          delay: (timing.delay || 0) + index * 200
        };
        animateEntrance(element, 'slide-right', elementTiming);
      }
    });
    
    // Animate visualization container
    const visualizationContainer = slideElement.querySelector('.visualization-container');
    if (visualizationContainer instanceof HTMLElement) {
      const visualTiming: AnimationTiming = {
        duration: 1000,
        easing: Easing.easeOutCubic,
        delay: (timing.delay || 0) + contentElements.length * 200
      };
      animateEntrance(visualizationContainer, 'fade', visualTiming);
    }
  }
  
  /**
   * Navigates to a specific slide by ID
   * @param slideId Slide ID to navigate to
   */
  public navigateToSlide(slideId: string): void {
    if (!this.revealInstance) return;
    
    // Find slide index
    const slides = this.revealInstance.getSlides();
    const index = slides.findIndex(slide => slide.getAttribute('data-slide-id') === slideId);
    
    if (index >= 0) {
      this.revealInstance.slide(index);
    }
  }
  
  /**
   * Updates a visualization's data
   * @param slideId Slide ID
   * @param newData New data for the visualization
   */
  public updateVisualizationData(slideId: string, newData: any): void {
    const visualization = this.visualizations.get(slideId);
    if (!visualization || !visualization.instance) return;
    
    // Update data based on visualization type
    switch (visualization.type) {
      case 'graph':
        if (typeof visualization.instance.updateData === 'function') {
          visualization.instance.updateData(newData);
        }
        break;
        
      case 'timeline':
        if (typeof visualization.instance.updateData === 'function') {
          visualization.instance.updateData(newData);
        }
        break;
        
      case 'table':
        if (typeof visualization.instance.updateData === 'function') {
          visualization.instance.updateData(newData);
        }
        break;
        
      case 'flowDiagram':
        if (typeof visualization.instance.updateData === 'function') {
          visualization.instance.updateData(newData.nodes, newData.edges);
        }
        break;
        
      // Additional visualization types would be handled here
    }
  }
  
  /**
   * Updates a visualization's options
   * @param slideId Slide ID
   * @param newOptions New options for the visualization
   */
  public updateVisualizationOptions(slideId: string, newOptions: any): void {
    const visualization = this.visualizations.get(slideId);
    if (!visualization || !visualization.instance) return;
    
    // Update options if the visualization supports it
    if (typeof visualization.instance.updateOptions === 'function') {
      visualization.instance.updateOptions(newOptions);
    }
  }
  
  /**
   * Highlights elements in a visualization
   * @param slideId Slide ID
   * @param elementIds IDs of elements to highlight
   * @param type Type of elements to highlight ('nodes' or 'edges')
   */
  public highlightVisualizationElements(slideId: string, elementIds: string[], type: 'nodes' | 'edges' = 'nodes'): void {
    const visualization = this.visualizations.get(slideId);
    if (!visualization || !visualization.instance) return;
    
    // Call the appropriate highlight method based on visualization type
    if (visualization.type === 'graph') {
      if (type === 'nodes' && typeof visualization.instance.highlightNodes === 'function') {
        visualization.instance.highlightNodes(elementIds);
      } else if (type === 'edges' && typeof visualization.instance.highlightEdges === 'function') {
        visualization.instance.highlightEdges(elementIds);
      }
    } else if (visualization.type === 'flowDiagram' && typeof visualization.instance.highlightNode === 'function') {
      // For flow diagrams, we highlight one node at a time
      if (elementIds.length > 0) {
        visualization.instance.highlightNode(elementIds[0]);
      }
    }
  }
  
  /**
   * Cleans up resources when the manager is no longer needed
   */
  public destroy(): void {
    // Clean up Reveal.js
    if (this.revealInstance) {
      this.revealInstance.destroy();
      this.revealInstance = null;
    }
    
    // Clean up visualizations
    this.visualizations.forEach(visualization => {
      if (visualization.instance && typeof visualization.instance.destroy === 'function') {
        visualization.instance.destroy();
      }
    });
    
    this.visualizations.clear();
    
    // Clean up resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}

/**
 * Initializes the presentation content system
 * This function loads markdown content into the registry
 */
async function initializeContent() {
  try {
    // Initialize content registry from markdown files
    await markdownLoader.initializeContentRegistry();
    console.log('Content registry initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize content registry:', error);
    return false;
  }
}

/**
 * Main application initialization
 */
document.addEventListener('DOMContentLoaded', async () => {
  // First initialize the content registry
  await initializeContent();
  
  // Find the presentation container
  const container = document.querySelector('.reveal');
  
  if (!container) {
    console.error('Presentation container with class "reveal" not found.');
    return;
  }
  
  // Create slide manager
  const slideManager = new SlideManager(container as HTMLElement);
  
  // Make the slide manager available globally for API access
  (window as any).slideManager = slideManager;
  
  // Create presentation manager
  const presentationManager = new PresentationManager();
  presentationManager.setSlideManager(slideManager);
  
  // Make presentation manager available globally
  (window as any).presentationManager = presentationManager;
  
  // Add export controls
  createExportControls();
  
  // Detect audience type and content source from URL parameters
  const isProfessionalAudience = window.location.search.includes('audience=professional');
  const useMarkdown = window.location.search.includes('source=markdown');
  
  if (useMarkdown) {
    // Load directly from markdown file (legacy approach)
    presentationManager.loadPresentation('./docs/presentation-content/enhanced-knowledge-graph.md', {
      title: 'Knowledge Graph Presentation',
      presenter: {
        name: 'John Smith',
        title: 'Knowledge Graph Architect',
        organization: 'Graph Technologies Inc.'
      },
      settings: {
        theme: 'black',
        defaultTransition: 'slide',
        showSlideNumber: 'all',
        controls: true,
        progress: true,
        center: true
      },
      useEnhancedParser: true
    }).catch(error => {
      console.error('Failed to load presentation:', error);
    });
  } else {
    // Use new modular architecture approach
    const presentationConfig = new PresentationBuilder()
      .setTitle('Knowledge Graph Presentation')
      .setPresenter({
        name: 'John Smith',
        title: 'Knowledge Graph Architect',
        organization: 'Graph Technologies Inc.'
      })
      // Add module-based content
      .addModuleContent(() => getIntroductionSlides({
        highlightTerms: ['knowledge graph', 'semantic web', 'linked data'],
        includeEvolutionSlide: true
      }))
      // Add legacy slide groups that haven't been migrated to modules yet
      // These will be removed as they are converted to modules
      .addModuleContent(() => getCoreComponentsSlides())
      .addModuleContent(() => getDataModelsSlides())
      .addModuleContent(() => getConstructionSlides())
      .addModuleContent(() => getIndustryApplicationsSlides())
      .addModuleContent(() => getQueryMechanismsSlides())
      .addModuleContent(() => getRCASlides())
      .addModuleContent(() => getImplementationRoadmapSlides())
      .addModuleContent(() => getFutureDirectionsSlides())
      .updateSettings({
        theme: 'black',
        defaultTransition: 'slide',
        showSlideNumber: 'all',
        controls: true,
        progress: true,
        center: true,
        keyboard: true
      })
      .build();
    
    // Load the presentation
    presentationManager.loadPresentationFromConfig(presentationConfig);
  }
});

/**
 * Creates export control buttons
 */
function createExportControls(): void {
  // Create container for export controls
  const exportControls = document.createElement('div');
  exportControls.className = 'export-controls';
  exportControls.style.position = 'fixed';
  exportControls.style.bottom = '20px';
  exportControls.style.right = '20px';
  exportControls.style.zIndex = '100';
  
  // Create PDF export button
  const pdfButton = document.createElement('button');
  pdfButton.className = 'export-button pdf-button';
  pdfButton.textContent = 'Download PDF';
  pdfButton.style.marginRight = '10px';
  pdfButton.style.padding = '8px 12px';
  pdfButton.style.backgroundColor = '#4285f4';
  pdfButton.style.color = 'white';
  pdfButton.style.border = 'none';
  pdfButton.style.borderRadius = '4px';
  pdfButton.style.cursor = 'pointer';
  
  // Add click event for PDF export
  pdfButton.addEventListener('click', () => {
    if ((window as any).presentationManager) {
      (window as any).presentationManager.exportToPDF();
    }
  });
  
  // Create HTML export button
  const htmlButton = document.createElement('button');
  htmlButton.className = 'export-button html-button';
  htmlButton.textContent = 'Download HTML';
  htmlButton.style.padding = '8px 12px';
  htmlButton.style.backgroundColor = '#0f9d58';
  htmlButton.style.color = 'white';
  htmlButton.style.border = 'none';
  htmlButton.style.borderRadius = '4px';
  htmlButton.style.cursor = 'pointer';
  
  // Add click event for HTML export
  htmlButton.addEventListener('click', () => {
    if ((window as any).presentationManager) {
      (window as any).presentationManager.exportToHTML();
    }
  });
  
  // Add buttons to container
  exportControls.appendChild(pdfButton);
  exportControls.appendChild(htmlButton);
  
  // Add container to document
  document.body.appendChild(exportControls);
}

export {};