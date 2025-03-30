// src/modules/implementation-roadmap/slides.ts
import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class ImplementationRoadmapSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'roadmap-overview':
        return this.createRoadmapOverviewSlide(content, options);
      case 'phases-detail':
        return this.createPhasesDetailSlide(content, options);
      case 'timeline-view':
        return this.createTimelineViewSlide(content, options);
      case 'maturity-model':
        return this.createMaturityModelSlide(content, options);
      case 'implementation-steps':
        return this.createImplementationStepsSlide(content, options);
      case 'critical-success-factors':
        return this.createCriticalSuccessFactorsSlide(content, options);
      case 'resources-needed':
        return this.createResourcesNeededSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createRoadmapOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'roadmap-overview',
      content.title || "Knowledge Graph Implementation Roadmap",
      {
        definition: content.description || content.overview || "A strategic approach to implementing knowledge graphs in your organization.",
        keyPoints: content.keyPoints || content.highlights || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide presents an overview of the implementation roadmap for knowledge graphs."
      }
    );
  }
  
  private createPhasesDetailSlide(content: any, options?: any): SlideConfig {
    const phaseListItems = content.phases.map((phase: any) => {
      return `<strong>${phase.name}</strong>: ${phase.description} (${phase.duration})`;
    });
    
    return this.createSlide(
      'implementation-phases',
      "Implementation Phases",
      {
        definition: "The knowledge graph implementation process is divided into distinct phases, each with specific goals and deliverables.",
        listItems: [{
          title: "Implementation Phases",
          items: phaseListItems,
          type: 'numbered'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide outlines the phases of knowledge graph implementation."
      }
    );
  }
  
  private createTimelineViewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'implementation-timeline',
      "Implementation Timeline",
      {
        definition: "The projected timeline for knowledge graph implementation, including key milestones and deliverables.",
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide shows the timeline for implementing a knowledge graph."
      }
    );
  }
  
  private createMaturityModelSlide(content: any, options?: any): SlideConfig {
    const levelListItems = content.levels.map((level: any) => {
      return `<strong>Level ${level.level} - ${level.name}</strong>: ${level.description}`;
    });
    
    return this.createSlide(
      'maturity-model',
      "Knowledge Graph Maturity Model",
      {
        definition: "A framework to assess and guide the evolution of knowledge graph capabilities in your organization.",
        listItems: [{
          title: "Maturity Levels",
          items: levelListItems,
          type: 'numbered'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide presents a maturity model for knowledge graph implementation."
      }
    );
  }
  
  private createImplementationStepsSlide(content: any, options?: any): SlideConfig {
    const stepListItems = content.steps.map((step: any) => {
      return `<strong>${step.name}</strong>: ${step.description}`;
    });
    
    return this.createSlide(
      'implementation-steps',
      "Implementation Steps",
      {
        definition: "A detailed breakdown of the activities required to implement a knowledge graph.",
        listItems: [{
          title: "Step-by-Step Implementation",
          items: stepListItems,
          type: 'numbered'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide details the step-by-step process for implementing a knowledge graph."
      }
    );
  }
  
  private createCriticalSuccessFactorsSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'critical-success-factors',
      "Critical Success Factors",
      {
        definition: "Key elements that must be addressed to ensure successful knowledge graph implementation.",
        listItems: [{
          title: "Success Factors",
          items: content.critical_success_factors || content.criticalSuccessFactors || [],
          type: 'bullet'
        }]
      },
      null,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide highlights the critical factors for successful knowledge graph implementation."
      }
    );
  }
  
  private createResourcesNeededSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'resources-needed',
      "Resources & Requirements",
      {
        definition: "The personnel, technological, and organizational resources required for effective implementation.",
        listItems: [
          {
            title: "Personnel",
            items: content.personnel || content.resources?.personnel || [],
            type: 'bullet'
          },
          {
            title: "Technology",
            items: content.technology || content.resources?.technology || [],
            type: 'bullet'
          },
          {
            title: "Organizational",
            items: content.organizational || content.resources?.organizational || [],
            type: 'bullet'
          }
        ]
      },
      null,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide outlines the resources needed for knowledge graph implementation."
      }
    );
  }
}