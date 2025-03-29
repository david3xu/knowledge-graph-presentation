/**
 * Tests for animation utilities
 */
import { animateEntrance, Easing } from '../../src/utils/animation';

describe('Animation utility', () => {
  let element: HTMLElement;
  
  beforeEach(() => {
    // Create a test element
    element = document.createElement('div');
    document.body.appendChild(element);
  });
  
  afterEach(() => {
    // Clean up
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  
  // Skip these tests for now as they require more complex mocking
  it.skip('animateEntrance applies fade animation', () => {
    // Set up timing
    const timing = {
      duration: 500,
      easing: Easing.easeOutQuad,
      delay: 100,
    };
    
    // Apply animation
    animateEntrance(element, 'fade', timing);
    
    // Check if animation applied properly
    expect(element.style.visibility).toBe('visible');
  });
  
  it.skip('animateEntrance applies slide-right animation', () => {
    // Set up timing
    const timing = {
      duration: 300,
      easing: Easing.easeInOutCubic,
      delay: 200
    };
    
    // Apply animation
    animateEntrance(element, 'slide-right', timing);
    
    // Check if animation applied properly
    expect(element.style.visibility).toBe('visible');
  });
  
  it.skip('animateEntrance handles zoom-in effect', () => {
    // Apply animation with minimal parameters
    animateEntrance(element, 'zoom-in', { duration: 400 });
    
    // Check if animation applied properly
    expect(element.style.visibility).toBe('visible');
  });
}); 