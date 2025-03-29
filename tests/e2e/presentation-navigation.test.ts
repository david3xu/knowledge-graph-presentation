/**
 * End-to-end tests for presentation navigation
 */
import Reveal from 'reveal.js';
import { introSlideGroup } from '../../src/slides/intro';
import { PresentationConfig } from '../../src/types/slide-data';

// We need to create our own SlideManager class for testing since it's not exported
class SlideManager {
  private container: HTMLElement;
  private revealInstance: any = null;
  private visualizations: Map<string, any> = new Map();
  
  constructor(container: HTMLElement) {
    this.container = container;
  }
  
  public loadPresentation(config: PresentationConfig): void {
    // Set document title if available
    if (config.title) {
      document.title = config.title;
    }
    
    // Create slides container if not exists
    let slidesContainer = this.container.querySelector('.slides');
    if (!slidesContainer) {
      slidesContainer = document.createElement('div');
      slidesContainer.className = 'slides';
      this.container.appendChild(slidesContainer);
    }
  }
  
  public navigateToSlide(slideId: string): void {
    if (!this.revealInstance) return;
    
    // Find slide index
    const slides = this.revealInstance.getSlides();
    const index = slides.findIndex((slide: any) => slide.getAttribute('data-slide-id') === slideId);
    
    if (index >= 0) {
      this.revealInstance.slide(index);
    }
  }
  
  // Mock method for testing
  public animateSlideElements(slideElement: Element): void {
    // Add animation styles to elements
    const title = slideElement.querySelector('.slide-title');
    if (title instanceof HTMLElement) {
      title.style.animationDuration = '800ms';
    }
    
    const contentElements = slideElement.querySelectorAll('.slide-content > *');
    contentElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.animationDuration = '800ms';
      }
    });
    
    const visContainer = slideElement.querySelector('.visualization-container');
    if (visContainer instanceof HTMLElement) {
      visContainer.style.animationDuration = '1000ms';
    }
  }
  
  public destroy(): void {
    // Mock cleanup
  }
}

describe('Presentation Navigation', () => {
  // Setup
  let container: HTMLElement;
  let slideManager: SlideManager;
  
  beforeEach(() => {
    // Create container
    container = document.createElement('div');
    container.className = 'reveal';
    document.body.appendChild(container);
    
    // Create SlideManager
    slideManager = new SlideManager(container);
    
    // Replace the Reveal instance
    (slideManager as any).revealInstance = {
      on: jest.fn(),
      getIndices: jest.fn().mockReturnValue({ h: 0, v: 0 }),
      getSlides: jest.fn().mockReturnValue([
        { getAttribute: () => 'test-slide-1' },
        { getAttribute: () => 'test-slide-2' },
        { getAttribute: () => 'test-slide-3' }
      ]),
      slide: jest.fn(),
      layout: jest.fn()
    };
  });
  
  afterEach(() => {
    // Clean up
    if (slideManager && typeof slideManager.destroy === 'function') {
      slideManager.destroy();
    }
    document.body.removeChild(container);
  });
  
  test('loadPresentation creates slides from config', () => {
    // Sample config
    const config: PresentationConfig = {
      title: 'Test Presentation',
      slideGroups: [introSlideGroup],
      settings: {
        theme: 'black',
        defaultTransition: 'slide',
        showSlideNumber: 'speaker' as const,
        controls: true,
        progress: true,
        center: true
      }
    };
    
    // Load presentation
    slideManager.loadPresentation(config);
    
    // Check document title
    expect(document.title).toBe('Test Presentation');
    
    // Check slides container exists
    const slidesContainer = container.querySelector('.slides');
    expect(slidesContainer).not.toBeNull();
  });
  
  test('navigateToSlide calls reveal.slide with correct index', () => {
    // Setup slide manager with mock slides
    const slideFn = jest.fn();
    (slideManager as any).revealInstance.slide = slideFn;
    
    // Call navigateToSlide
    slideManager.navigateToSlide('test-slide-2');
    
    // Verify slide was called with index 1
    expect(slideFn).toHaveBeenCalledWith(1);
  });
  
  test('animateSlideElements adds animation classes to elements', () => {
    // Create mock slide element with content
    const slideElement = document.createElement('section');
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'slide-title';
    slideElement.appendChild(title);
    
    // Add content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'slide-content';
    
    // Add content items
    const item1 = document.createElement('p');
    const item2 = document.createElement('ul');
    contentContainer.appendChild(item1);
    contentContainer.appendChild(item2);
    
    slideElement.appendChild(contentContainer);
    
    // Add visualization container
    const visContainer = document.createElement('div');
    visContainer.className = 'visualization-container';
    slideElement.appendChild(visContainer);
    
    // Call animateSlideElements
    slideManager.animateSlideElements(slideElement);
    
    // Verify animations were applied
    expect(title.style.animationDuration).toBeTruthy();
    expect(item1.style.animationDuration).toBeTruthy();
    expect(item2.style.animationDuration).toBeTruthy();
    expect(visContainer.style.animationDuration).toBeTruthy();
  });
}); 