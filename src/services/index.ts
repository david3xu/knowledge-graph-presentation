/**
 * Services module exports
 * Provides centralized access to all service components
 */

import PresentationBuilder from './presentation-builder';
import PresentationManager from './presentation-manager';
import SlideManager from './slide-manager';
import { markdownContentRegistry } from '../parser/markdown-loader';

// Core services
export { default as PresentationBuilder } from './presentation-builder';
export { default as PresentationManager } from './presentation-manager';
export { default as SlideManager } from './slide-manager';
export { ExportService } from './export-service';
export { InteractionService } from './interaction-service';
export { ThemeService } from './theme-service';
export { markdownContentRegistry } from '../parser/markdown-loader';

/**
 * Initialize all required services and return them as a bundle
 * @param container DOM container for the presentation
 * @returns Object containing initialized services
 */
export function initializeServices(container: HTMLElement) {
  // Create SlideManager
  const slideManager = new SlideManager({ 
    container,
    initializeImmediately: true 
  });
  
  // Create PresentationManager and connect to SlideManager
  const presentationManager = new PresentationManager();
  presentationManager.setSlideManager(slideManager);
  
  // Create PresentationBuilder
  const presentationBuilder = new PresentationBuilder();
  
  return {
    slideManager,
    presentationManager,
    presentationBuilder,
    contentRegistry: markdownContentRegistry
  };
}