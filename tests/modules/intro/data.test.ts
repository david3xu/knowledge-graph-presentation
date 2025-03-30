// tests/modules/intro/data.test.ts
import { IntroDataTransformer } from '../../../src/modules/intro/data';
import { markdownContentRegistry } from '../../../src/services/markdown-content-registry';

describe('IntroDataTransformer', () => {
  const mockConceptData = {
    entities: [
      { id: 'entity1', name: 'Entity 1', type: 'Entity', description: 'Test entity' }
    ],
    relationships: [
      { source: 'entity1', target: 'entity2', type: 'relates_to', description: 'Test relationship' }
    ],
    title: 'Test Concepts',
    summary: 'Test summary'
  };
  
  beforeEach(() => {
    // Mock the markdown content registry
    jest.spyOn(markdownContentRegistry, 'getContent').mockImplementation(
      (id: string) => {
        if (id === 'kg-concepts') return mockConceptData;
        return { id, content: 'mock content' };
      }
    );
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('transformContentImpl handles concept graph data', () => {
    const transformer = new IntroDataTransformer();
    const result = transformer.transformContent('kg-concepts');
    
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.edges.length).toBe(1);
    expect(result.nodes[0].id).toBe('entity1');
    expect(result.edges[0].source).toBe('entity1');
  });
  
  // Additional tests for other transformation methods
});