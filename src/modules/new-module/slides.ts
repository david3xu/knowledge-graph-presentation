// src/modules/new-module/slides.ts
import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class NewModuleSlideFactory extends BaseSlideFactory {
  protected createDomainSlide(type: string, content: any, options?: any): SlideConfig {
    // Implement domain-specific slide creation logic
    return this.createSlide(
      type,
      content.title || 'New Slide',
      content,
      options?.visualizationConfig,
      options
    );
  }
  
  // Additional domain-specific slide creation methods
}