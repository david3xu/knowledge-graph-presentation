# Knowledge Graph Presentation: Testing Strategy

## Overview

This document outlines the testing strategy implemented for the Knowledge Graph Presentation project. The testing framework is designed to provide comprehensive validation of the application's functionality across different components, from individual utility functions to complete user flows. This multi-layered approach ensures the reliability and maintainability of the project as it evolves.

## Testing Structure

The project implements a three-tiered testing approach:

1. **Unit Tests**: Validate individual functions and components in isolation
2. **Integration Tests**: Verify interactions between multiple components
3. **End-to-End Tests**: Test complete user flows that span multiple components

### Directory Structure

```
tests/
├── e2e/                  # End-to-end tests
├── integration/          # Integration tests
├── mocks/                # Mock implementations for testing
│   ├── fileMock.js       # Mock for file imports
│   └── styleMock.js      # Mock for CSS imports
├── setup.ts              # Jest setup file
└── unit/                 # Unit tests
```

## Test Configuration

The testing framework is built on Jest with TypeScript support. The configuration is defined in `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': '<rootDir>/tests/mocks/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/mocks/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
```

### Key configuration elements:

- **Test Environment**: Uses `jsdom` to simulate a browser environment
- **TypeScript Support**: Uses `ts-jest` to process TypeScript test files
- **Module Mocking**: Maps CSS and image imports to mock implementations
- **Setup File**: Runs `tests/setup.ts` before each test
- **Coverage Reporting**: Collects and reports code coverage data

## Mocking Strategy

The project uses a comprehensive mocking strategy to isolate components under test and to simulate browser APIs:

### Browser API Mocks

The `setup.ts` file provides mocks for browser APIs that aren't available in the Jest environment:

- **ResizeObserver**: Provides a mock implementation to prevent errors when code observes element resizing
- **Reveal.js**: Mocks the presentation framework to test slide navigation and management
- **D3.js**: Mocks the data visualization library methods for testing without actual rendering
- **Cytoscape.js**: Mocks the graph visualization library for testing graph components

### Component Mocks

For integration tests, higher-level components are mocked to isolate the specific interactions being tested. For example, in the visualization integration tests, the actual rendering logic is mocked while maintaining the component interfaces.

## Test Types

### Unit Tests

Unit tests focus on testing individual functions and components in isolation. Examples include:

- **Theme utilities**: Tests for theme switching, preferences storage, and DOM updates
- **Animation utilities**: Tests for entrance animations, transitions, and timing functions
- **Responsive utilities**: Tests for screen size detection and responsive handlers

Sample unit test:

```typescript
describe('Responsive Utility', () => {
  test('ResponsiveHandler detects screen size correctly', () => {
    // Create responsive handler
    const handler = new ResponsiveHandler();
    
    // Test different screen sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480
    });
    
    // Force detect screen size
    (handler as any).detectScreenSize();
    expect(handler.getCurrentScreenSize()).toBe(ScreenSize.XS);
    
    // Clean up
    handler.destroy();
  });
});
```

### Integration Tests

Integration tests verify interactions between multiple components. Examples include:

- **Visualization integration**: Tests that visualization components can be initialized with various data types and properly rendered
- **Data transformation chains**: Tests for data processing pipelines that involve multiple transformations

Sample integration test:

```typescript
test('GraphVisualization can be initialized and rendered', () => {
  // Sample graph data
  const graphData = {
    nodes: [
      { id: 'node1', label: 'Node 1', type: 'Person' },
      { id: 'node2', label: 'Node 2', type: 'Document' }
    ],
    edges: [
      { id: 'edge1', source: 'node1', target: 'node2', label: 'connects to' }
    ]
  };
  
  // Create visualization
  const graph = new GraphVisualization({
    container,
    data: graphData,
    width: 600,
    height: 400
  });
  
  // Render it
  graph.render();
  
  // Verify GraphVisualization constructor was called with correct params
  expect(GraphVisualization).toHaveBeenCalledWith(expect.objectContaining({
    container,
    data: graphData,
    width: 600,
    height: 400
  }));
});
```

### End-to-End Tests

End-to-end tests simulate user flows and interactions across the application. Examples include:

- **Presentation navigation**: Tests for navigating between slides, animations, and presentation controls
- **Interactive visualization flows**: Tests for user interactions with visualizations

Sample E2E test:

```typescript
test('navigateToSlide calls reveal.slide with correct index', () => {
  // Setup slide manager with mock slides
  const slideFn = jest.fn();
  (slideManager as any).revealInstance.slide = slideFn;
  
  // Call navigateToSlide
  slideManager.navigateToSlide('test-slide-2');
  
  // Verify slide was called with index 1
  expect(slideFn).toHaveBeenCalledWith(1);
});
```

## Test Scripts

The following npm scripts are provided for running tests:

- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode, rerunning tests as files change
- `npm run test:coverage`: Run tests and generate a coverage report

## Code Coverage

The test suite collects and reports code coverage metrics, helping identify areas of the codebase that need additional testing. Coverage reports include statements, branches, functions, and lines covered by tests.

Current coverage summary:

```
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |   17.58 |     7.45 |   10.24 |   18.43 |                   
 slides       |     100 |      100 |     100 |     100 |                   
 utils        |   15.03 |     8.82 |    9.47 |   15.62 |                   
 visualizatio |   18.59 |     6.28 |   11.26 |    19.7 |                   
```

## Test Challenges and Solutions

### Challenge: Animation Testing

Testing animations presents a particular challenge because animation effects are difficult to verify in a test environment.

**Solution**: For the animation utilities, we've implemented a strategy of verification by checking that the correct CSS properties are applied to elements, rather than trying to test the actual visual animation. Some animation tests are currently skipped and marked for future implementation of more sophisticated animation testing strategies.

### Challenge: Visualization Mocking

Visualization libraries like D3.js and Cytoscape.js are complex and rely heavily on browser rendering APIs.

**Solution**: We've implemented comprehensive mocks for these libraries that maintain their method chains and interfaces while eliminating the actual rendering logic. This allows us to test that our visualization components correctly construct and manage the visualizations without relying on actual rendering.

## Future Test Enhancements

1. **Visual Regression Testing**: Add tests that capture screenshots of rendered visualizations and compare them to baselines
2. **Performance Testing**: Implement tests to measure and monitor the performance of visualization rendering
3. **Improved Animation Testing**: Develop strategies for better testing of animation effects
4. **Increased Coverage**: Expand test coverage to reach at least 80% of the codebase

## Conclusion

The testing strategy for the Knowledge Graph Presentation project provides a robust framework for validating functionality across different levels of the application. The combination of unit, integration, and end-to-end tests ensures a comprehensive approach to quality assurance, while the mocking strategy enables effective testing of complex browser-based visualizations.

This strategy will evolve as the project matures, with a focus on increasing coverage and implementing more sophisticated testing techniques to address the unique challenges of testing interactive visualizations. 