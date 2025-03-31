// src/modules/resources/slides.ts
import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class ResourcesSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    _options?: any
  ): SlideConfig {
    switch(type) {
      case 'resources-overview':
        return this.createResourcesOverviewSlide(content);
      case 'academic-references':
        return this.createAcademicReferencesSlide(content);
      case 'software-tools':
        return this.createSoftwareToolsSlide(content);
      case 'tool-comparison':
        return this.createToolComparisonSlide(content);
      case 'learning-resources':
        return this.createLearningResourcesSlide(content);
      case 'learning-path':
        return this.createLearningPathSlide(content);
      case 'communities':
        return this.createCommunitiesSlide(content);
      case 'next-steps':
        return this.createNextStepsSlide(content);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createResourcesOverviewSlide(content: any): SlideConfig {
    return this.createSlide(
      'resources-overview',
      "Learning Resources Overview",
      content.overview || "This section provides an overview of available learning resources.",
      {
        transition: 'fade',
        notes: content.presenterNotes || "Presenter: This slide introduces the various learning resources available."
      }
    );
  }
  
  private createAcademicReferencesSlide(content: any): SlideConfig {
    return this.createSlide(
      'academic-references',
      "Academic References",
      content.references || [],
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide lists academic references for further reading."
      }
    );
  }
  
  private createSoftwareToolsSlide(content: any): SlideConfig {
    return this.createSlide(
      'software-tools',
      "Software Tools",
      content.tools || [],
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide showcases various software tools for knowledge graph development."
      }
    );
  }
  
  private createToolComparisonSlide(content: any): SlideConfig {
    return this.createSlide(
      'tool-comparison',
      "Tool Comparison",
      content.comparison || [],
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide compares different tools based on their features and use cases."
      }
    );
  }
  
  private createLearningResourcesSlide(content: any): SlideConfig {
    return this.createSlide(
      'learning-resources',
      "Learning Resources",
      content.resources || [],
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide presents various learning resources for knowledge graph development."
      }
    );
  }
  
  private createLearningPathSlide(content: any): SlideConfig {
    return this.createSlide(
      'learning-path',
      "Learning Path",
      content.path || [],
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide outlines a recommended learning path for knowledge graph development."
      }
    );
  }
  
  private createCommunitiesSlide(content: any): SlideConfig {
    return this.createSlide(
      'communities',
      "Communities",
      content.communities || [],
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide highlights communities where you can connect with other knowledge graph practitioners."
      }
    );
  }
  
  private createNextStepsSlide(content: any): SlideConfig {
    return this.createSlide(
      'next-steps',
      "Next Steps",
      content.nextSteps || [],
      {
        transition: 'fade',
        notes: content.presenterNotes || "Presenter: This slide provides guidance on next steps for learning and development."
      }
    );
  }
}