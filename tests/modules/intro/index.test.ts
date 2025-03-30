// tests/modules/intro/index.test.ts
import { getIntroductionSlides } from '../../../src/modules/intro';
import { markdownContentRegistry } from '../../../src/services/markdown-content-registry';

// Mock the entire markdown content registry
jest.mock('../../../src/services/markdown-content-registry', () => ({
  markdownContentRegistry: {
    getContent: jest.fn((id) => {
      // Return mock data based on the requested ID
      switch (id) {
        case 'intro-group-metadata':
          return { title: 'Test Introduction', id: 'test-intro' };
        case 'intro-title':
          return { title: 'Test Title', subtitle: 'Test Subtitle' };
        case 'kg-definition':
          return {
            title: 'Test Definition',
            mainDefinition: 'This is a test definition',
            keyPoints: ['Point 1', 'Point 2']
          };
        case 'kg-concepts':
          return {
            entities: [{ id: 'entity1', name: 'Entity 1', type: 'Entity' }],
            relationships: [{ source: 'entity1', target: 'entity2', type: 'relates_to' }]
          };
        default:
          return { id, content: 'mock content' };
      }
    })
  }
}));

describe('Introduction Module', () => {
  test('getIntroductionSlides returns a slide group', () => {
    const slideGroup = getIntroductionSlides();
    
    expect(slideGroup).toBeDefined();
    expect(slideGroup.title).toBe('Test Introduction');
    expect(slideGroup.id).toBe('test-intro');
    expect(slideGroup.slides).toBeDefined();
    expect(slideGroup.slides.length).toBeGreaterThan(0);
  });
  
  test('getIntroductionSlides respects options', () => {
    const slideGroup = getIntroductionSlides({
      includeDefinitionSlide: false,
      includeEvolutionSlide: false
    });
    
    // Title slide should still be present
    expect(slideGroup.slides.length).toBe(1);
  });
  
  // Additional integration tests
});