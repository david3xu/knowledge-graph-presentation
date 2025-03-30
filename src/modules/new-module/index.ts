// src/modules/new-module/index.ts
import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideGroup } from '../../types/slide-data';
import { NewModuleDataTransformer } from './data';
import { NewModuleConfigFactory } from './config';
import { NewModuleSlideFactory } from './slides';

export interface NewModuleOptions {
  // Domain-specific options
}

export class NewModule extends BaseModuleTemplate<NewModuleOptions> {
  public createSlides(options: NewModuleOptions = {}): SlideGroup {
    // Implement slide creation logic
    return this.slideFactory.createSlideGroup(
      'New Module',
      'new-module',
      []
    );
  }
}

// Factory function for backward compatibility
export function getNewModuleSlides(options: NewModuleOptions = {}): SlideGroup {
  const dataTransformer = new NewModuleDataTransformer();
  const configFactory = new NewModuleConfigFactory();
  const slideFactory = new NewModuleSlideFactory();
  
  const module = new NewModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}