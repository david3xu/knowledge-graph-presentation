/**
 * Unit tests for responsive utility
 */
import { ScreenSize, ResponsiveHandler } from '../../src/utils/responsive';

describe('Responsive Utility', () => {
  // Save original window.innerWidth
  const originalInnerWidth = window.innerWidth;
  
  // Mock resize events
  const mockResizeEvent = new Event('resize');
  
  afterEach(() => {
    // Reset to original width after each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
  });
  
  test('ResponsiveHandler detects screen size correctly', () => {
    // Create responsive handler
    const handler = new ResponsiveHandler();
    
    // Test different screen sizes
    
    // XS size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480
    });
    
    // Force detect screen size
    (handler as any).detectScreenSize();
    expect(handler.getCurrentScreenSize()).toBe(ScreenSize.XS);
    
    // SM size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600
    });
    
    // Force detect screen size
    (handler as any).detectScreenSize();
    expect(handler.getCurrentScreenSize()).toBe(ScreenSize.SM);
    
    // MD size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800
    });
    
    // Force detect screen size
    (handler as any).detectScreenSize();
    expect(handler.getCurrentScreenSize()).toBe(ScreenSize.MD);
    
    // Clean up
    handler.destroy();
  });
  
  test('ResponsiveHandler subscribers get notified of changes', () => {
    // Create responsive handler
    const handler = new ResponsiveHandler();
    
    // Create a test callback
    const callback = jest.fn();
    
    // Subscribe to changes
    const unsubscribe = handler.subscribe(callback);
    
    // Change screen size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1100
    });
    
    // Force detect screen size
    (handler as any).detectScreenSize();
    
    // Verify callback was called
    expect(callback).toHaveBeenCalled();
    
    // Unsubscribe
    unsubscribe();
    
    // Reset callback
    callback.mockReset();
    
    // Change screen size again
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1300
    });
    
    // Force detect screen size
    (handler as any).detectScreenSize();
    
    // Verify callback was NOT called after unsubscribe
    expect(callback).not.toHaveBeenCalled();
    
    // Clean up
    handler.destroy();
  });
}); 