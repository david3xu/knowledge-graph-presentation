/**
 * This file runs before each test file
 */

// Mock ResizeObserver
class MockResizeObserver {
  observe() { /* do nothing */ }
  unobserve() { /* do nothing */ }
  disconnect() { /* do nothing */ }
}

// Assign to global object
(global as any).ResizeObserver = MockResizeObserver;

// Mock Reveal.js
class MockReveal {
  constructor(container: any, options: any) {}
  
  static instances = [];
  
  on(event: string, callback: Function) {
    return this;
  }
  
  initialize() {
    return Promise.resolve(this);
  }
  
  getIndices() {
    return { h: 0, v: 0, f: 0 };
  }
  
  getSlides() {
    return [
      { getAttribute: () => 'test-slide-1' }
    ];
  }
  
  slide(index: number) {
    return this;
  }
  
  layout() {
    return this;
  }
  
  destroy() {
    return this;
  }
}

// Mock D3.js
jest.mock('d3', () => ({
  select: jest.fn().mockReturnValue({
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    exit: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    node: jest.fn().mockReturnValue({
      getBoundingClientRect: () => ({ width: 800, height: 600 })
    }),
  }),
  selectAll: jest.fn().mockReturnValue({
    data: jest.fn().mockReturnThis(),
    enter: jest.fn().mockReturnThis(),
    append: jest.fn().mockReturnThis(),
    attr: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    exit: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
  }),
  scaleLinear: jest.fn().mockReturnValue({
    domain: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  }),
  axisBottom: jest.fn().mockReturnValue({}),
  axisLeft: jest.fn().mockReturnValue({}),
  zoom: jest.fn().mockReturnValue({
    scaleExtent: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
  }),
  drag: jest.fn().mockReturnValue({
    on: jest.fn().mockReturnThis(),
  }),
}));

// Mock Cytoscape.js
jest.mock('cytoscape', () => {
  const mockCytoscape = jest.fn().mockReturnValue({
    on: jest.fn().mockReturnThis(),
    style: jest.fn().mockReturnThis(),
    layout: jest.fn().mockReturnValue({
      run: jest.fn(),
    }),
    add: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    getElementById: jest.fn().mockReturnValue({
      addClass: jest.fn(),
      removeClass: jest.fn(),
    }),
    nodes: jest.fn().mockReturnValue({
      addClass: jest.fn(),
      removeClass: jest.fn(),
    }),
    edges: jest.fn().mockReturnValue({
      addClass: jest.fn(),
      removeClass: jest.fn(),
    }),
    fit: jest.fn(),
    center: jest.fn(),
    resize: jest.fn(),
    destroy: jest.fn(),
  });
  
  return mockCytoscape;
}); 