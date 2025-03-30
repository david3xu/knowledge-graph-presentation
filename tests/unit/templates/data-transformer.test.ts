// tests/utils/templates/data-transformer.test.ts
import { BaseDataTransformer } from '../../../src/utils/templates/data-transformer';
import { markdownContentRegistry } from '../../../src/services/markdown-content-registry';

// Mock implementation for testing
class MockDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    return {
      transformed: true,
      original: rawContent,
      options
    };
  }
}

describe('BaseDataTransformer', () => {
  beforeEach(() => {
    // Mock the markdown content registry
    jest.spyOn(markdownContentRegistry, 'getContent').mockImplementation(
      (id: string) => ({ id, content: 'mock content' })
    );
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('transformContent returns transformed data', () => {
    const transformer = new MockDataTransformer();
    const result = transformer.transformContent('test-id');
    
    expect(result).toEqual({
      transformed: true,
      original: { id: 'test-id', content: 'mock content' },
      options: undefined
    });
  });
  
  test('transformContent handles options', () => {
    const transformer = new MockDataTransformer();
    const options = { test: true };
    const result = transformer.transformContent('test-id', options);
    
    expect(result.options).toEqual(options);
  });
  
  test('handleTransformationError returns error data', () => {
    const transformer = new MockDataTransformer();
    const error = new Error('Test error');
    const result = transformer.handleTransformationError(error, 'test-id');
    
    expect(result.error).toBe(true);
    expect(result.message).toContain('Test error');
    expect(result.contentId).toBe('test-id');
  });
});