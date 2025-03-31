/**
 * Animation Utilities
 * Provides reusable animation functions for visualizations and slide transitions
 */

/**
 * Easing functions for animation effects
 */
export const Easing = {
    /**
     * Linear easing (no acceleration or deceleration)
     */
    linear: (t: number): number => t,
    
    /**
     * Quadratic ease-in (accelerating from zero velocity)
     */
    easeInQuad: (t: number): number => t * t,
    
    /**
     * Quadratic ease-out (decelerating to zero velocity)
     */
    easeOutQuad: (t: number): number => t * (2 - t),
    
    /**
     * Quadratic ease-in-out (acceleration until halfway, then deceleration)
     */
    easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    
    /**
     * Cubic ease-in (accelerating from zero velocity)
     */
    easeInCubic: (t: number): number => t * t * t,
    
    /**
     * Cubic ease-out (decelerating to zero velocity)
     */
    easeOutCubic: (t: number): number => (--t) * t * t + 1,
    
    /**
     * Cubic ease-in-out (acceleration until halfway, then deceleration)
     */
    easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    
    /**
     * Elastic ease-out (exponentially decaying sine wave)
     */
    easeOutElastic: (t: number): number => {
      let p = 0.3;
      return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    },
    
    /**
     * Bounce ease-out (decelerating with bounce effect)
     */
    easeOutBounce: (t: number): number => {
      if (t < (1 / 2.75)) {
        return 7.5625 * t * t;
      } else if (t < (2 / 2.75)) {
        return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
      } else if (t < (2.5 / 2.75)) {
        return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
      } else {
        return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
      }
    }
  };
  
  /**
   * Animation timing parameters
   */
  export interface AnimationTiming {
    /** Duration of the animation in milliseconds */
    duration: number;
    
    /** Easing function to use */
    easing?: (t: number) => number;
    
    /** Delay before starting the animation in milliseconds */
    delay?: number;
  }
  
  /**
   * Callback type for animation frames
   */
  export type AnimationFrameCallback = (progress: number) => void;
  
  /**
   * Options for sequential animations
   */
  export interface SequenceOptions {
    /** Animation steps with their timing parameters */
    steps: {
      callback: AnimationFrameCallback;
      timing: AnimationTiming;
    }[];
    
    /** Gap between steps in milliseconds */
    gap?: number;
    
    /** Callback to execute when the entire sequence completes */
    onComplete?: () => void;
  }
  
  /**
   * Creates an animation that interpolates between two values
   * @param from Starting value
   * @param to Ending value
   * @param timing Animation timing parameters
   * @param callback Function to call with interpolated value on each frame
   * @returns A function that cancels the animation when called
   */
  export function animate<T extends number | number[]>(
    from: T,
    to: T,
    timing: AnimationTiming,
    callback: (value: T) => void
  ): () => void {
    // Apply default easing if not specified
    const easing = timing.easing || Easing.linear;
    
    // Create interpolation function based on type
    const interpolate = (progress: number): T => {
      if (typeof from === 'number' && typeof to === 'number') {
        return (from + (to - from) * progress) as T;
      } else if (Array.isArray(from) && Array.isArray(to)) {
        return from.map((value, i) => value + (to[i] - value) * progress) as T;
      }
      throw new Error('Unsupported type for animation');
    };
    
    // Track animation state
    let startTime: number | null = null;
    let animationFrame: number | null = null;
    let cancelled = false;
    
    // Animation frame function
    const animateFrame = (timestamp: number) => {
      if (cancelled) return;
      
      // Initialize start time on first frame
      if (!startTime) {
        startTime = timestamp;
      }
      
      // Calculate progress
      const elapsed = timestamp - startTime - (timing.delay || 0);
      
      if (elapsed < 0) {
        // Still in delay period
        animationFrame = requestAnimationFrame(animateFrame);
        return;
      }
      
      const rawProgress = Math.min(elapsed / timing.duration, 1);
      const easedProgress = easing(rawProgress);
      
      // Apply the interpolated value
      callback(interpolate(easedProgress));
      
      // Continue or end animation
      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(animateFrame);
      }
    };
    
    // Start the animation after specified delay
    animationFrame = requestAnimationFrame(animateFrame);
    
    // Return a function to cancel the animation
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      cancelled = true;
    };
  }
  
  /**
   * Runs a sequence of animations in order
   * @param options Sequence configuration options
   * @returns A function that cancels the sequence when called
   */
  export function sequence(options: SequenceOptions): () => void {
    const { steps, gap = 0, onComplete } = options;
    
    // If there are no steps, simply call onComplete and return a no-op
    if (steps.length === 0) {
      if (onComplete) onComplete();
      return () => {};
    }
    
    // let currentStepIndex = 0;
    let currentCancelFn: (() => void) | null = null;
    let timeoutId: number | null = null;
    let cancelled = false;
    
    // Function to start a specific step
    const startStep = (index: number) => {
      if (cancelled || index >= steps.length) {
        if (!cancelled && onComplete) onComplete();
        return;
      }
      
      const step = steps[index];
      
      // Create a wrapper callback to advance to the next step
      const stepCallback = (progress: number) => {
        step.callback(progress);
        
        // If this is the final frame of this step, schedule the next step
        if (progress === 1) {
          if (gap > 0 && index < steps.length - 1) {
            timeoutId = window.setTimeout(() => startStep(index + 1), gap);
          } else {
            startStep(index + 1);
          }
        }
      };
      
      // Special case for custom timing animations
      if (!('from' in step) && !('to' in step)) {
        // Standard callback animation
        currentCancelFn = animate(0, 1, step.timing, stepCallback);
      }
    };
    
    // Start the sequence
    startStep(0);
    
    // Return a function to cancel the sequence
    return () => {
      cancelled = true;
      
      if (currentCancelFn) {
        currentCancelFn();
        currentCancelFn = null;
      }
      
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }
  
  /**
   * Creates a staggered animation effect for a collection of elements
   * @param count Number of elements
   * @param timing Base timing for each element's animation
   * @param staggerDelay Delay between each element's animation start
   * @param callback Function to call for each element's animation
   * @returns A function that cancels all animations when called
   */
  export function stagger(
    count: number,
    timing: AnimationTiming,
    staggerDelay: number,
    callback: (index: number, progress: number) => void
  ): () => void {
    // Create an animation sequence with staggered starts
    const steps = Array.from({ length: count }, (_, i) => ({
      callback: (progress: number) => callback(i, progress),
      timing: {
        ...timing,
        delay: (timing.delay || 0) + i * staggerDelay
      }
    }));
    
    // Run all animations in parallel
    const cancelFunctions: (() => void)[] = steps.map(step => 
      animate(0, 1, step.timing, step.callback)
    );
    
    // Return a function that cancels all animations
    return () => {
      cancelFunctions.forEach(cancel => cancel());
    };
  }
  
  /**
   * Creates a transition between two DOM element states
   * @param element DOM element to animate
   * @param properties CSS properties to animate
   * @param timing Animation timing parameters
   * @returns A function that cancels the transition when called
   */
  export function transition(
    element: HTMLElement,
    properties: Record<string, { from: string | number, to: string | number }>,
    timing: AnimationTiming
  ): () => void {
    // Get computed style for string values
    // const computedStyle = window.getComputedStyle(element);
    
    // Create interpolation functions for each property
    const interpolations = Object.entries(properties).map(([prop, { from, to }]) => {
      // Handle numeric values with units
      if (typeof from === 'number' && typeof to === 'number') {
        return {
          property: prop,
          interpolate: (progress: number) => from + (to - from) * progress
        };
      }
      
      // Handle string values by extracting numeric components
      const fromStr = from.toString();
      const toStr = to.toString();
      
      // Check if values are colors
      if (fromStr.startsWith('#') && toStr.startsWith('#')) {
        // Convert hex colors to RGB
        const fromRgb = hexToRgb(fromStr);
        const toRgb = hexToRgb(toStr);
        
        if (fromRgb && toRgb) {
          return {
            property: prop,
            interpolate: (progress: number) => {
              const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * progress);
              const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * progress);
              const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * progress);
              return `rgb(${r}, ${g}, ${b})`;
            }
          };
        }
      }
      
      // Extract numbers with units (px, em, %, etc.)
      const fromMatch = fromStr.match(/^([\d.-]+)(.*)$/);
      const toMatch = toStr.match(/^([\d.-]+)(.*)$/);
      
      if (fromMatch && toMatch && fromMatch[2] === toMatch[2]) {
        // Same unit, interpolate the numeric value
        const fromValue = parseFloat(fromMatch[1]);
        const toValue = parseFloat(toMatch[1]);
        const unit = fromMatch[2];
        
        return {
          property: prop,
          interpolate: (progress: number) => `${fromValue + (toValue - fromValue) * progress}${unit}`
        };
      }
      
      // Fallback for incompatible values - just switch at the midpoint
      return {
        property: prop,
        interpolate: (progress: number) => progress < 0.5 ? fromStr : toStr
      };
    });
    
    // Animation frame callback
    const callback = (progress: number) => {
      interpolations.forEach(({ property, interpolate }) => {
        element.style[property as any] = String(interpolate(progress));
      });
    };
    
    // Run the animation
    return animate(0, 1, timing, callback);
  }
  
  /**
   * Helper to convert hex color to RGB
   * @param hex Hex color string (#RRGGBB or #RGB)
   * @returns RGB object or null if invalid
   */
  function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    // Expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  /**
   * Animates an element's entrance with various effects
   * @param element Element to animate
   * @param effect Type of entrance effect
   * @param timing Animation timing parameters
   * @returns A function that cancels the animation when called
   */
  export function animateEntrance(
    element: HTMLElement,
    effect: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out',
    timing: AnimationTiming
  ): () => void {
    // Store original styles
    // const originalStyles: Partial<CSSStyleDeclaration> = {
    //   opacity: element.style.opacity,
    //   transform: element.style.transform,
    //   visibility: element.style.visibility
    // };
    
    // Set initial styles
    element.style.visibility = 'visible';
    
    // Configure animation based on effect
    switch (effect) {
      case 'fade':
        element.style.opacity = '0';
        return transition(element, { opacity: { from: 0, to: 1 } }, timing);
        
      case 'slide-up':
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        return transition(element, {
          opacity: { from: 0, to: 1 },
          transform: { from: 'translateY(50px)', to: 'translateY(0)' }
        }, timing);
        
      case 'slide-down':
        element.style.opacity = '0';
        element.style.transform = 'translateY(-50px)';
        return transition(element, {
          opacity: { from: 0, to: 1 },
          transform: { from: 'translateY(-50px)', to: 'translateY(0)' }
        }, timing);
        
      case 'slide-left':
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        return transition(element, {
          opacity: { from: 0, to: 1 },
          transform: { from: 'translateX(50px)', to: 'translateX(0)' }
        }, timing);
        
      case 'slide-right':
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        return transition(element, {
          opacity: { from: 0, to: 1 },
          transform: { from: 'translateX(-50px)', to: 'translateX(0)' }
        }, timing);
        
      case 'zoom-in':
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        return transition(element, {
          opacity: { from: 0, to: 1 },
          transform: { from: 'scale(0.5)', to: 'scale(1)' }
        }, timing);
        
      case 'zoom-out':
        element.style.opacity = '0';
        element.style.transform = 'scale(1.5)';
        return transition(element, {
          opacity: { from: 0, to: 1 },
          transform: { from: 'scale(1.5)', to: 'scale(1)' }
        }, timing);
        
      default:
        return () => {}; // No-op for unknown effects
    }
  }
  
  /**
   * Animates an element's exit with various effects
   * @param element Element to animate
   * @param effect Type of exit effect
   * @param timing Animation timing parameters
   * @param removeOnComplete Whether to remove the element from DOM when animation completes
   * @returns A function that cancels the animation when called
   */
  export function animateExit(
    element: HTMLElement,
    effect: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out',
    timing: AnimationTiming,
    removeOnComplete: boolean = false
  ): () => void {
    // Configure animation based on effect
    let cancelFn: () => void;
    
    switch (effect) {
      case 'fade':
        cancelFn = transition(element, { opacity: { from: 1, to: 0 } }, timing);
        break;
        
      case 'slide-up':
        cancelFn = transition(element, {
          opacity: { from: 1, to: 0 },
          transform: { from: 'translateY(0)', to: 'translateY(-50px)' }
        }, timing);
        break;
        
      case 'slide-down':
        cancelFn = transition(element, {
          opacity: { from: 1, to: 0 },
          transform: { from: 'translateY(0)', to: 'translateY(50px)' }
        }, timing);
        break;
        
      case 'slide-left':
        cancelFn = transition(element, {
          opacity: { from: 1, to: 0 },
          transform: { from: 'translateX(0)', to: 'translateX(-50px)' }
        }, timing);
        break;
        
      case 'slide-right':
        cancelFn = transition(element, {
          opacity: { from: 1, to: 0 },
          transform: { from: 'translateX(0)', to: 'translateX(50px)' }
        }, timing);
        break;
        
      case 'zoom-in':
        cancelFn = transition(element, {
          opacity: { from: 1, to: 0 },
          transform: { from: 'scale(1)', to: 'scale(0.5)' }
        }, timing);
        break;
        
      case 'zoom-out':
        cancelFn = transition(element, {
          opacity: { from: 1, to: 0 },
          transform: { from: 'scale(1)', to: 'scale(1.5)' }
        }, timing);
        break;
        
      default:
        return () => {}; // No-op for unknown effects
    }
    
    // Handle removal after animation completes
    if (removeOnComplete) {
      setTimeout(() => {
        // Only remove if the animation wasn't cancelled
        if (element.style.opacity === '0') {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        }
      }, timing.duration + (timing.delay || 0));
    }
    
    return cancelFn;
  }
  
  /**
   * Highlights specific elements in a visualization with a pulsing effect
   * @param elements Array of elements to highlight
   * @param timing Animation timing parameters
   * @param color Highlight color
   * @returns A function that cancels the animation when called
   */
  export function highlightElements(
    elements: HTMLElement[],
    timing: AnimationTiming = { duration: 1000, easing: Easing.easeInOutQuad },
    color: string = 'rgba(255, 215, 0, 0.5)'
  ): () => void {
    // Store original styles
    const originalStyles = elements.map(el => ({
      boxShadow: el.style.boxShadow,
      transition: el.style.transition,
      outline: el.style.outline
    }));
    
    // Set highlight styles
    elements.forEach(el => {
      el.style.transition = `box-shadow ${timing.duration}ms ${timing.easing ? timing.easing.toString() : 'ease-in-out'}`;
      el.style.boxShadow = `0 0 0 2px ${color}`;
      el.style.outline = 'none';
    });
    
    // Create pulsing animation
    const pulseAnimation = () => {
      elements.forEach(el => {
        el.style.boxShadow = `0 0 10px 4px ${color}`;
        
        setTimeout(() => {
          el.style.boxShadow = `0 0 0 2px ${color}`;
        }, timing.duration / 2);
      });
    };
    
    // Start pulsing
    pulseAnimation();
    const intervalId = setInterval(pulseAnimation, timing.duration);
    
    // Return a function to stop and reset the highlight
    return () => {
      clearInterval(intervalId);
      
      elements.forEach((el, i) => {
        el.style.boxShadow = originalStyles[i].boxShadow;
        el.style.transition = originalStyles[i].transition;
        el.style.outline = originalStyles[i].outline;
      });
    };
  }
  
  /**
   * Creates a typing animation effect for text
   * @param element Element to display the typing animation in
   * @param text Text to type
   * @param speed Characters per second
   * @param cursor Whether to show a blinking cursor
   * @returns A function that completes the animation immediately when called
   */
  export function typeText(
    element: HTMLElement,
    text: string,
    speed: number = 10,
    cursor: boolean = true
  ): () => void {
    // Clear existing content
    element.textContent = '';
    
    // Add cursor element if enabled
    let cursorElement: HTMLSpanElement | null = null;
    if (cursor) {
      cursorElement = document.createElement('span');
      cursorElement.className = 'typing-cursor';
      cursorElement.textContent = '|';
      cursorElement.style.animation = 'typing-cursor-blink 1s step-end infinite';
      element.appendChild(cursorElement);
      
      // Add cursor blink animation if not already present
      if (!document.getElementById('typing-cursor-style')) {
        const style = document.createElement('style');
        style.id = 'typing-cursor-style';
        style.textContent = `
          @keyframes typing-cursor-blink {
            from, to { opacity: 1; }
            50% { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Calculate delay between characters
    const charDelay = 1000 / speed;
    
    // Type text character by character
    let charIndex = 0;
    const textNode = document.createTextNode('');
    element.insertBefore(textNode, cursorElement);
    
    const intervalId = setInterval(() => {
      if (charIndex < text.length) {
        textNode.nodeValue += text[charIndex++];
      } else {
        clearInterval(intervalId);
      }
    }, charDelay);
    
    // Return a function to complete the animation immediately
    return () => {
      clearInterval(intervalId);
      textNode.nodeValue = text;
    };
  }