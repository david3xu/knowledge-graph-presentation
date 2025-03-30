/**
 * Presentation Timing Utilities
 * Provides functionality for managing presentation timing, slide durations, and timing-related features
 */

declare global {
  interface Window {
    slideManager?: {
      nextSlide: () => void;
    };
  }
}

/**
 * Timer event types
 */
export type TimerEventType = 
  | 'start'      // Timer started
  | 'pause'      // Timer paused
  | 'resume'     // Timer resumed
  | 'stop'       // Timer stopped
  | 'reset'      // Timer reset
  | 'update'     // Timer update (occurs at each tick)
  | 'complete';  // Timer completed

/**
 * Timer event listener
 */
export type TimerEventListener = (event: TimerEvent) => void;

/**
 * Timer event object
 */
export interface TimerEvent {
  /** Type of timer event */
  type: TimerEventType;
  
  /** Current elapsed time in milliseconds */
  elapsed: number;
  
  /** Total duration in milliseconds */
  duration: number;
  
  /** Remaining time in milliseconds */
  remaining: number;
  
  /** Progress as a percentage (0-100) */
  progress: number;
  
  /** Whether the timer has completed */
  completed: boolean;
  
  /** Timestamp when the event occurred */
  timestamp: number;
}

/**
 * Timer options
 */
export interface TimerOptions {
  /** Duration in milliseconds */
  duration?: number;
  
  /** Update interval in milliseconds */
  interval?: number;
  
  /** Whether to start automatically */
  autoStart?: boolean;
  
  /** Whether to loop when completed */
  loop?: boolean;
  
  /** Callback when timer completes */
  onComplete?: TimerEventListener;
  
  /** Callback for timer updates */
  onUpdate?: TimerEventListener;
  
  /** Countdown direction (true = countdown, false = count up) */
  countdown?: boolean;
}

/**
 * Default timer options
 */
const DEFAULT_TIMER_OPTIONS: TimerOptions = {
  duration: 0,        // Infinite duration by default
  interval: 1000,     // Update every second
  autoStart: false,   // Don't start automatically
  loop: false,        // Don't loop by default
  countdown: false    // Count up by default
};

/**
 * Timer status
 */
export enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

/**
 * Timer class for managing timing operations
 */
export class Timer {
  private options: Required<TimerOptions>;
  private status: TimerStatus = TimerStatus.IDLE;
  private startTime: number = 0;
  private pausedAt: number = 0;
  private pauseDuration: number = 0;
  private intervalId: number | null = null;
  private listeners: Map<TimerEventType, Set<TimerEventListener>> = new Map();
  
  /**
   * Creates a new timer instance
   * @param options Timer configuration options
   */
  constructor(options: TimerOptions = {}) {
    this.options = {
      ...DEFAULT_TIMER_OPTIONS,
      ...options
    } as Required<TimerOptions>;
    
    // Add provided listeners
    if (this.options.onComplete) {
      this.on('complete', this.options.onComplete);
    }
    
    if (this.options.onUpdate) {
      this.on('update', this.options.onUpdate);
    }
    
    // Start timer if autoStart is enabled
    if (this.options.autoStart) {
      this.start();
    }
  }
  
  /**
   * Starts the timer
   * @returns This timer instance for chaining
   */
  public start(): Timer {
    if (this.status === TimerStatus.RUNNING) {
      return this;
    }
    
    // Set start time and status
    this.startTime = Date.now();
    this.pauseDuration = 0;
    this.status = TimerStatus.RUNNING;
    
    // Start interval for updates
    this.startInterval();
    
    // Emit start event
    this.emit('start', this.createEvent('start'));
    
    return this;
  }
  
  /**
   * Pauses the timer
   * @returns This timer instance for chaining
   */
  public pause(): Timer {
    if (this.status !== TimerStatus.RUNNING) {
      return this;
    }
    
    // Update status and record pause time
    this.pausedAt = Date.now();
    this.status = TimerStatus.PAUSED;
    
    // Clear interval
    this.clearInterval();
    
    // Emit pause event
    this.emit('pause', this.createEvent('pause'));
    
    return this;
  }
  
  /**
   * Resumes the timer from a paused state
   * @returns This timer instance for chaining
   */
  public resume(): Timer {
    if (this.status !== TimerStatus.PAUSED) {
      return this;
    }
    
    // Update pause duration
    this.pauseDuration += Date.now() - this.pausedAt;
    this.status = TimerStatus.RUNNING;
    
    // Start interval for updates
    this.startInterval();
    
    // Emit resume event
    this.emit('resume', this.createEvent('resume'));
    
    return this;
  }
  
  /**
   * Stops the timer
   * @returns This timer instance for chaining
   */
  public stop(): Timer {
    if (this.status === TimerStatus.IDLE) {
      return this;
    }
    
    // Update status
    this.status = TimerStatus.IDLE;
    
    // Clear interval
    this.clearInterval();
    
    // Emit stop event
    this.emit('stop', this.createEvent('stop'));
    
    return this;
  }
  
  /**
   * Resets the timer
   * @param autoStart Whether to start the timer after reset
   * @returns This timer instance for chaining
   */
  public reset(autoStart: boolean = false): Timer {
    // Clear interval
    this.clearInterval();
    
    // Reset properties
    this.startTime = 0;
    this.pausedAt = 0;
    this.pauseDuration = 0;
    this.status = TimerStatus.IDLE;
    
    // Emit reset event
    this.emit('reset', this.createEvent('reset'));
    
    // Start if requested
    if (autoStart) {
      this.start();
    }
    
    return this;
  }
  
  /**
   * Gets the current elapsed time in milliseconds
   * @returns Elapsed time
   */
  public getElapsed(): number {
    if (this.status === TimerStatus.IDLE) {
      return 0;
    }
    
    if (this.status === TimerStatus.PAUSED) {
      return this.pausedAt - this.startTime - this.pauseDuration;
    }
    
    return Date.now() - this.startTime - this.pauseDuration;
  }
  
  /**
   * Gets the remaining time in milliseconds
   * @returns Remaining time
   */
  public getRemaining(): number {
    if (this.options.duration === 0) {
      return 0; // Infinite duration
    }
    
    const elapsed = this.getElapsed();
    return Math.max(0, this.options.duration - elapsed);
  }
  
  /**
   * Gets the current progress as a percentage (0-100)
   * @returns Progress percentage
   */
  public getProgress(): number {
    if (this.options.duration === 0) {
      return 0; // Infinite duration
    }
    
    const elapsed = this.getElapsed();
    return Math.min(100, (elapsed / this.options.duration) * 100);
  }
  
  /**
   * Gets the current timer status
   * @returns Timer status
   */
  public getStatus(): TimerStatus {
    return this.status;
  }
  
  /**
   * Checks if the timer is running
   * @returns True if the timer is running
   */
  public isRunning(): boolean {
    return this.status === TimerStatus.RUNNING;
  }
  
  /**
   * Checks if the timer is paused
   * @returns True if the timer is paused
   */
  public isPaused(): boolean {
    return this.status === TimerStatus.PAUSED;
  }
  
  /**
   * Checks if the timer is completed
   * @returns True if the timer is completed
   */
  public isCompleted(): boolean {
    return this.status === TimerStatus.COMPLETED;
  }
  
  /**
   * Sets the timer duration
   * @param duration New duration in milliseconds
   * @returns This timer instance for chaining
   */
  public setDuration(duration: number): Timer {
    this.options.duration = duration;
    return this;
  }
  
  /**
   * Sets the update interval
   * @param interval New interval in milliseconds
   * @returns This timer instance for chaining
   */
  public setInterval(interval: number): Timer {
    this.options.interval = interval;
    
    // Restart interval if running
    if (this.status === TimerStatus.RUNNING) {
      this.clearInterval();
      this.startInterval();
    }
    
    return this;
  }
  
  /**
   * Sets whether the timer should loop
   * @param loop Whether to loop the timer
   * @returns This timer instance for chaining
   */
  public setLoop(loop: boolean): Timer {
    this.options.loop = loop;
    return this;
  }
  
  /**
   * Adds an event listener
   * @param event Event type
   * @param listener Event listener function
   * @returns This timer instance for chaining
   */
  public on(event: TimerEventType, listener: TimerEventListener): Timer {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)!.add(listener);
    return this;
  }
  
  /**
   * Removes an event listener
   * @param event Event type
   * @param listener Event listener function
   * @returns This timer instance for chaining
   */
  public off(event: TimerEventType, listener: TimerEventListener): Timer {
    const eventListeners = this.listeners.get(event);
    
    if (eventListeners) {
      eventListeners.delete(listener);
    }
    
    return this;
  }
  
  /**
   * Creates formatted time strings
   * @param format Format string
   * @returns Formatted time string
   */
  public format(format: string = 'mm:ss'): string {
    const time = this.options.countdown ? this.getRemaining() : this.getElapsed();
    return formatTime(time, format);
  }
  
  /**
   * Cleans up the timer
   */
  public destroy(): void {
    this.clearInterval();
    this.listeners.clear();
  }
  
  /**
   * Starts the update interval
   * @private
   */
  private startInterval(): void {
    this.clearInterval();
    
    this.intervalId = window.setInterval(() => {
      // Create update event
      const event = this.createEvent('update');
      
      // Emit update event
      this.emit('update', event);
      
      // Check if timer has completed
      if (this.options.duration > 0 && this.getElapsed() >= this.options.duration) {
        this.complete();
      }
    }, this.options.interval);
  }
  
  /**
   * Clears the update interval
   * @private
   */
  private clearInterval(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Handles timer completion
   * @private
   */
  private complete(): void {
    this.clearInterval();
    
    // Update status
    this.status = TimerStatus.COMPLETED;
    
    // Create complete event
    const event = this.createEvent('complete');
    
    // Emit complete event
    this.emit('complete', event);
    
    // Handle looping
    if (this.options.loop) {
      this.reset(true);
    }
  }
  
  /**
   * Creates a timer event object
   * @param type Event type
   * @returns Timer event object
   * @private
   */
  private createEvent(type: TimerEventType): TimerEvent {
    const elapsed = this.getElapsed();
    const remaining = this.getRemaining();
    const progress = this.getProgress();
    
    return {
      type,
      elapsed,
      duration: this.options.duration,
      remaining,
      progress,
      completed: this.status === TimerStatus.COMPLETED,
      timestamp: Date.now()
    };
  }
  
  /**
   * Emits an event to all listeners
   * @param event Event type
   * @param eventData Event data
   * @private
   */
  private emit(event: TimerEventType, eventData: TimerEvent): void {
    const eventListeners = this.listeners.get(event);
    
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(eventData);
        } catch (error) {
          console.error(`Error in timer event listener for ${event}:`, error);
        }
      });
    }
  }
}

/**
 * Slide timing configuration
 */
export interface SlideTiming {
  /** Duration in milliseconds */
  duration: number;
  
  /** Whether to advance automatically when duration elapses */
  autoAdvance: boolean;
  
  /** Time to show alert before advancing (milliseconds) */
  warningTime?: number;
  
  /** Callback when slide timer completes */
  onComplete?: () => void;
  
  /** Callback when warning time is reached */
  onWarning?: () => void;
}

/**
 * Manages timing for presentation slides
 */
export class SlideTimer {
  private timer: Timer;
  private currentSlideIndex: number = -1;
  private slideTimings: SlideTiming[] = [];
  private warningTimer: Timer | null = null;
  
  /**
   * Creates a new slide timer
   * @param slideTimings Array of slide timing configurations
   */
  constructor(slideTimings: SlideTiming[] = []) {
    this.slideTimings = slideTimings;
    
    this.timer = new Timer({
      interval: 100,
      onComplete: () => this.handleSlideComplete()
    });
  }
  
  /**
   * Starts timing for a specific slide
   * @param index Slide index
   * @returns This slide timer instance
   */
  public startSlide(index: number): SlideTimer {
    // Stop current timing
    this.stopCurrentSlide();
    
    // Set current slide
    this.currentSlideIndex = index;
    
    // Get timing for this slide
    const timing = this.slideTimings[index];
    
    if (!timing) {
      return this;
    }
    
    // Configure and start timer
    this.timer.setDuration(timing.duration);
    this.timer.reset(true);
    
    // Set up warning timer if needed
    if (timing.warningTime && timing.warningTime < timing.duration) {
      const warningDelay = timing.duration - timing.warningTime;
      
      this.warningTimer = new Timer({
        duration: warningDelay,
        onComplete: () => {
          if (timing.onWarning) {
            timing.onWarning();
          }
        }
      });
      
      this.warningTimer.start();
    }
    
    return this;
  }
  
  /**
   * Stops timing for the current slide
   * @returns This slide timer instance
   */
  public stopCurrentSlide(): SlideTimer {
    this.timer.stop();
    
    if (this.warningTimer) {
      this.warningTimer.stop();
      this.warningTimer = null;
    }
    
    return this;
  }
  
  /**
   * Pauses timing for the current slide
   * @returns This slide timer instance
   */
  public pauseCurrentSlide(): SlideTimer {
    this.timer.pause();
    
    if (this.warningTimer && this.warningTimer.isRunning()) {
      this.warningTimer.pause();
    }
    
    return this;
  }
  
  /**
   * Resumes timing for the current slide
   * @returns This slide timer instance
   */
  public resumeCurrentSlide(): SlideTimer {
    this.timer.resume();
    
    if (this.warningTimer && this.warningTimer.isPaused()) {
      this.warningTimer.resume();
    }
    
    return this;
  }
  
  /**
   * Resets timing for the current slide
   * @returns This slide timer instance
   */
  public resetCurrentSlide(): SlideTimer {
    this.timer.reset(true);
    
    if (this.warningTimer) {
      this.warningTimer.reset(true);
    }
    
    return this;
  }
  
  /**
   * Gets the elapsed time for the current slide
   * @returns Elapsed time in milliseconds
   */
  public getElapsedTime(): number {
    return this.timer.getElapsed();
  }
  
  /**
   * Gets the remaining time for the current slide
   * @returns Remaining time in milliseconds
   */
  public getRemainingTime(): number {
    return this.timer.getRemaining();
  }
  
  /**
   * Gets the current progress as a percentage
   * @returns Progress percentage (0-100)
   */
  public getProgress(): number {
    return this.timer.getProgress();
  }
  
  /**
   * Gets formatted time string for the current slide
   * @param format Format string
   * @returns Formatted time string
   */
  public getFormattedTime(format: string = 'mm:ss'): string {
    return this.timer.format(format);
  }
  
  /**
   * Sets timing for a specific slide
   * @param index Slide index
   * @param timing Slide timing configuration
   * @returns This slide timer instance
   */
  public setSlideTimings(index: number, timing: SlideTiming): SlideTimer {
    this.slideTimings[index] = timing;
    
    // Update current timer if this is the current slide
    if (index === this.currentSlideIndex) {
      this.timer.setDuration(timing.duration);
    }
    
    return this;
  }
  
  /**
   * Gets the current slide index
   * @returns Current slide index
   */
  public getCurrentSlideIndex(): number {
    return this.currentSlideIndex;
  }
  
  /**
   * Handles slide timer completion
   * @private
   */
  private handleSlideComplete(): void {
    const timing = this.slideTimings[this.currentSlideIndex];
    
    if (timing) {
      // Call completion callback if available
      if (timing.onComplete) {
        timing.onComplete();
      }
      
      // Auto-advance if enabled
      if (timing.autoAdvance && window.slideManager) {
        // Advance to next slide using the global slide manager
        try {
          window.slideManager.nextSlide();
        } catch (error) {
          console.error('Error auto-advancing slide:', error);
        }
      }
    }
  }
  
  /**
   * Cleans up timers
   */
  public destroy(): void {
    this.timer.destroy();
    
    if (this.warningTimer) {
      this.warningTimer.destroy();
    }
  }
}

/**
 * Creates a countdown timer with a DOM element display
 * @param element DOM element to update
 * @param duration Duration in milliseconds
 * @param options Additional options
 * @returns Timer instance
 */
export function createCountdown(
  element: HTMLElement,
  duration: number,
  options: {
    format?: string;
    autoStart?: boolean;
    onComplete?: () => void;
    warningThreshold?: number;
    warningClass?: string;
  } = {}
): Timer {
  const format = options.format || 'mm:ss';
  const warningThreshold = options.warningThreshold || 10000; // 10 seconds by default
  const warningClass = options.warningClass || 'countdown-warning';
  
  // Create timer
  const timer = new Timer({
    duration,
    interval: 100,
    autoStart: options.autoStart,
    countdown: true,
    onUpdate: () => {
      // Update element with formatted time
      updateElement();
    },
    onComplete: () => {
      // Update element one last time
      updateElement();
      
      // Call onComplete callback if provided
      if (options.onComplete) {
        options.onComplete();
      }
    }
  });
  
  // Function to update the element
  const updateElement = () => {
    element.textContent = timer.format(format);
    
    // Add warning class if within threshold
    if (timer.getRemaining() <= warningThreshold) {
      element.classList.add(warningClass);
    } else {
      element.classList.remove(warningClass);
    }
  };
  
  // Initial update
  updateElement();
  
  return timer;
}

/**
 * Debounces a function to prevent excessive calls
 * @param func Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Throttles a function to limit call frequency
 * @param func Function to throttle
 * @param limit Minimum time between calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | null = null;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= limit) {
      // If enough time has passed, call immediately
      lastCall = now;
      func(...args);
    } else {
      // Otherwise, schedule a call after the remaining time
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, limit - timeSinceLastCall);
    }
  };
}

/**
 * Formats a time value according to a format string
 * @param time Time in milliseconds
 * @param format Format string
 * @returns Formatted time string
 */
export function formatTime(time: number, format: string = 'mm:ss'): string {
  // Calculate time components
  const totalSeconds = Math.floor(time / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  
  const hours = totalHours;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  const milliseconds = time % 1000;
  
  // Replace format tokens
  return format
    .replace('hh', hours.toString().padStart(2, '0'))
    .replace('h', hours.toString())
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('m', minutes.toString())
    .replace('ss', seconds.toString().padStart(2, '0'))
    .replace('s', seconds.toString())
    .replace('SSS', milliseconds.toString().padStart(3, '0'))
    .replace('S', milliseconds.toString());
}

/**
 * Calculates the estimated reading time for a text
 * @param text Text content
 * @param wordsPerMinute Reading speed in words per minute
 * @returns Reading time in milliseconds
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  // Clean the text and count words
  const cleanText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  // Calculate time in minutes and convert to milliseconds
  const minutes = words.length / wordsPerMinute;
  return Math.round(minutes * 60 * 1000);
}