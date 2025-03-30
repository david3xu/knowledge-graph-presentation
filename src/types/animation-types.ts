/**
 * Type definitions for animation configurations and effects
 * Provides interfaces for animation timing, transitions, sequences, and effects
 */

/**
 * Easing functions for animations
 */
export enum EasingFunction {
    /** Linear easing (constant speed) */
    Linear = 'linear',
    
    /** Ease-in (start slow, end fast) */
    EaseIn = 'easeIn',
    
    /** Ease-out (start fast, end slow) */
    EaseOut = 'easeOut',
    
    /** Ease-in-out (start slow, middle fast, end slow) */
    EaseInOut = 'easeInOut',
    
    /** Cubic ease-in */
    EaseInCubic = 'easeInCubic',
    
    /** Cubic ease-out */
    EaseOutCubic = 'easeOutCubic',
    
    /** Cubic ease-in-out */
    EaseInOutCubic = 'easeInOutCubic',
    
    /** Quadratic ease-in */
    EaseInQuad = 'easeInQuad',
    
    /** Quadratic ease-out */
    EaseOutQuad = 'easeOutQuad',
    
    /** Quadratic ease-in-out */
    EaseInOutQuad = 'easeInOutQuad',
    
    /** Bouncing effect at the end */
    Bounce = 'bounce',
    
    /** Elastic effect (like a spring) */
    Elastic = 'elastic',
    
    /** Back effect (slight overshoot) */
    Back = 'back'
  }
  
  /**
   * Animation timing parameters
   */
  export interface AnimationTiming {
    /** Duration of the animation in milliseconds */
    duration: number;
    
    /** Delay before the animation starts in milliseconds */
    delay?: number;
    
    /** Easing function to use */
    easing?: EasingFunction | string;
    
    /** Number of times to repeat the animation (0 = no repeat, -1 = infinite) */
    repeat?: number;
    
    /** Whether to alternate direction on repeat */
    alternate?: boolean;
    
    /** Whether to fill the target element's state after animation completes */
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  }
  
  /**
   * Transition effect types
   */
  export enum TransitionType {
    /** Fade in/out effect */
    Fade = 'fade',
    
    /** Slide from direction */
    Slide = 'slide',
    
    /** Zoom in/out effect */
    Zoom = 'zoom',
    
    /** Rotating effect */
    Rotate = 'rotate',
    
    /** Flip effect */
    Flip = 'flip',
    
    /** Scale effect */
    Scale = 'scale',
    
    /** Blur effect */
    Blur = 'blur',
    
    /** Reveal effect */
    Reveal = 'reveal',
    
    /** No transition */
    None = 'none'
  }
  
  /**
   * Direction for transitions
   */
  export enum TransitionDirection {
    /** From top to bottom */
    Top = 'top',
    
    /** From right to left */
    Right = 'right',
    
    /** From bottom to top */
    Bottom = 'bottom',
    
    /** From left to right */
    Left = 'left',
    
    /** From top-left */
    TopLeft = 'topLeft',
    
    /** From top-right */
    TopRight = 'topRight',
    
    /** From bottom-left */
    BottomLeft = 'bottomLeft',
    
    /** From bottom-right */
    BottomRight = 'bottomRight'
  }
  
  /**
   * Configuration for a transition effect
   */
  export interface TransitionConfig {
    /** Type of transition effect */
    type: TransitionType | string;
    
    /** Direction for directional transitions */
    direction?: TransitionDirection | string;
    
    /** Timing parameters for the transition */
    timing: AnimationTiming;
    
    /** Distance to travel for slide transitions (in pixels or percent) */
    distance?: string | number;
    
    /** Scale factor for zoom/scale transitions (1 = 100%) */
    scale?: number;
    
    /** Rotation angle for rotate transitions (in degrees) */
    angle?: number;
    
    /** Perspective depth for 3D transitions */
    perspective?: number;
    
    /** Blur amount for blur transitions (in pixels) */
    blurAmount?: number;
    
    /** Whether to use GPU acceleration when available */
    useGpu?: boolean;
  }
  
  /**
   * Animation trigger types
   */
  export enum AnimationTrigger {
    /** Triggered on element creation/mount */
    Mount = 'mount',
    
    /** Triggered on element removal/unmount */
    Unmount = 'unmount',
    
    /** Triggered when element enters the viewport */
    InView = 'inView',
    
    /** Triggered on user interaction (click, hover, etc.) */
    Interaction = 'interaction',
    
    /** Triggered by another element or event */
    External = 'external',
    
    /** Triggered after a specified time delay */
    Timed = 'timed',
    
    /** Triggered at a specific scroll position */
    Scroll = 'scroll',
    
    /** Manually triggered through code */
    Manual = 'manual'
  }
  
  /**
   * Animation sequence configuration
   */
  export interface AnimationSequence {
    /** Unique identifier for the sequence */
    id: string;
    
    /** Steps in the animation sequence */
    steps: Array<{
      /** Target element selector or reference */
      target: string | HTMLElement;
      
      /** Animation configuration for this step */
      animation: AnimationStep;
      
      /** Delay after the previous step in milliseconds */
      stepDelay?: number;
      
      /** Whether other steps can run in parallel with this one */
      parallel?: boolean;
    }>;
    
    /** Delay before starting the entire sequence */
    initialDelay?: number;
    
    /** Whether steps should run in parallel by default */
    parallelByDefault?: boolean;
    
    /** Callback function when the sequence starts */
    onStart?: () => void;
    
    /** Callback function when the sequence completes */
    onComplete?: () => void;
  }
  
  /**
   * Individual animation step configuration
   */
  export interface AnimationStep {
    /** Properties to animate and their target values */
    properties: Record<string, any>;
    
    /** Timing configuration for this animation step */
    timing: AnimationTiming;
    
    /** Whether to apply this animation relative to current values */
    relative?: boolean;
    
    /** Callback function when this step starts */
    onStart?: () => void;
    
    /** Callback function when this step completes */
    onComplete?: () => void;
    
    /** Callback function for each animation frame */
    onUpdate?: (progress: number) => void;
  }
  
  /**
   * Staggered animation configuration
   */
  export interface StaggerConfig {
    /** Base animation configuration for each element */
    animation: AnimationStep;
    
    /** Delay between each element's animation in milliseconds */
    staggerDelay: number;
    
    /** Direction of the stagger effect */
    direction?: 'forward' | 'reverse' | 'center' | 'edges';
    
    /** Easing function for the stagger delay (not the animations themselves) */
    staggerEasing?: EasingFunction;
    
    /** Whether to randomize the stagger order */
    randomize?: boolean;
  }
  
  /**
   * Animation preset configurations
   */
  export interface AnimationPresets {
    /** Fade in effect */
    fadeIn: TransitionConfig;
    
    /** Fade out effect */
    fadeOut: TransitionConfig;
    
    /** Slide in from the right */
    slideInRight: TransitionConfig;
    
    /** Slide in from the left */
    slideInLeft: TransitionConfig;
    
    /** Slide in from the top */
    slideInTop: TransitionConfig;
    
    /** Slide in from the bottom */
    slideInBottom: TransitionConfig;
    
    /** Zoom in effect */
    zoomIn: TransitionConfig;
    
    /** Zoom out effect */
    zoomOut: TransitionConfig;
    
    /** Fade and slide combo from the bottom */
    fadeInUp: TransitionConfig;
    
    /** Bounce effect */
    bounce: AnimationStep;
    
    /** Pulse effect */
    pulse: AnimationStep;
    
    /** Shake effect */
    shake: AnimationStep;
    
    /** Emphasis attention effect */
    attention: AnimationStep;
    
    /** Typing text effect */
    typewriter: AnimationStep;
    
    /** Additional custom presets */
    [key: string]: TransitionConfig | AnimationStep;
  }
  
  /**
   * Global animation configuration for the presentation
   */
  export interface AnimationConfig {
    /** Whether animations are enabled globally */
    enabled: boolean;
    
    /** Default timing parameters */
    defaultTiming: AnimationTiming;
    
    /** Default transition type */
    defaultTransition: TransitionType;
    
    /** Whether to reduce animations for users with reduced motion preference */
    respectReducedMotion: boolean;
    
    /** Animation presets available in the presentation */
    presets: AnimationPresets;
    
    /** Default animation triggers for different elements */
    defaultTriggers: {
      /** Animation trigger for slide transitions */
      slides: AnimationTrigger;
      
      /** Animation trigger for content elements */
      content: AnimationTrigger;
      
      /** Animation trigger for visualization elements */
      visualizations: AnimationTrigger;
    };
    
    /** Element selector to animation mapping */
    elementAnimations?: Record<string, AnimationStep | TransitionConfig>;
  }