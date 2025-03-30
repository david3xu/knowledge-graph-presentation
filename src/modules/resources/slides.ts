// src/modules/resources/slides.ts
import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class ResourcesSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'resources-overview':
        return this.createResourcesOverviewSlide(content, options);
      case 'academic-references':
        return this.createAcademicReferencesSlide(content, options);
      case 'software-tools':
        return this.createSoftwareToolsSlide(content, options);
      case 'tool-comparison':
        return this.createToolComparisonSlide(content, options);
      case 'learning-resources':
        return this.createLearningResourcesSlide(content, options);
      case 'learning-path':
        return this.createLearningPathSlide(content, options);
      case 'communities':
        return this.createCommunitiesSlide(content, options);
      case 'next-steps':
        return this.createNextStepsSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createResourcesOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'resources-overview',
      content.title || "Knowledge Graph Resources",
      {
        definition: content.description || content.summary || "A curated collection of resources to help you learn about and implement knowledge graphs.",
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || "Presenter: This slide introduces key resources for learning about knowledge graphs."
      }
    );
  }
  
  private createAcademicReferencesSlide(content: any, options?: any): SlideConfig {
    // Create a list of formatted references
    const referenceItems = content.references
      .slice(0, options?.limit || 10) // Limit the number of references
      .map((ref: any) => {
        return `<strong>${ref.title}</strong> (${ref.year})${ref.authors ? ` - ${ref.authors}` : ''}${ref.venue ? ` - ${ref.venue}` : ''}`;
      });
    
    return this.createSlide(
      'academic-references',
      "Academic References",
      {
        definition: "Key academic publications and resources for understanding knowledge graph concepts and research.",
        listItems: [{
          title: "Recommended Reading",
          items: referenceItems,
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide provides a list of key academic references on knowledge graphs."
      }
    );
  }
  
  private createSoftwareToolsSlide(content: any, options?: any): SlideConfig {
    // Create a list of tools with descriptions
    const toolItems = content.tools
      .slice(0, options?.limit || 10) // Limit the number of tools
      .map((tool: any) => {
        return `<strong>${tool.name}</strong>: ${tool.description}${tool.url ? ` - <em>${tool.url}</em>` : ''}`;
      });
    
    return this.createSlide(
      'software-tools',
      "Knowledge Graph Software Tools",
      {
        definition: "Software tools and frameworks for building and working with knowledge graphs.",
        listItems: [{
          title: "Recommended Tools",
          items: toolItems,
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide showcases software tools for working with knowledge graphs."
      }
    );
  }
  
  private createToolComparisonSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'tool-comparison',
      "Tool Comparison",
      {
        definition: "Comparative analysis of popular knowledge graph tools and frameworks.",
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide compares key features and capabilities of knowledge graph tools."
      }
    );
  }
  
  private createLearningResourcesSlide(content: any, options?: any): SlideConfig {
    // Create a list of learning resources
    const resourceItems = content.learningResources
      .slice(0, options?.limit || 8) // Limit the number of resources
      .map((resource: any) => {
        return `<strong>${resource.title}</strong> (${resource.type})${resource.provider ? ` - ${resource.provider}` : ''}${resource.level ? ` - Level: ${resource.level}` : ''}`;
      });
    
    return this.createSlide(
      'learning-resources',
      "Learning Resources",
      {
        definition: "Tutorials, courses, and educational materials for learning about knowledge graphs.",
        listItems: [{
          title: "Recommended Learning Resources",
          items: resourceItems,
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide provides learning resources for knowledge graphs, from beginner to advanced."
      }
    );
  }
  
  private createLearningPathSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'learning-path',
      "Knowledge Graph Learning Path",
      {
        definition: "A structured learning path for developing knowledge graph expertise from beginner to advanced.",
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide outlines a recommended learning path for mastering knowledge graph concepts."
      }
    );
  }
  
  private createCommunitiesSlide(content: any, options?: any): SlideConfig {
    // Create a list of communities
    const communityItems = content.communities
      .slice(0, options?.limit || 6) // Limit the number of communities
      .map((community: any) => {
        return `<strong>${community.name}</strong> (${community.type})${community.description ? `: ${community.description}` : ''}${community.url ? ` - <em>${community.url}</em>` : ''}`;
      });
    
    return this.createSlide(
      'communities',
      "Knowledge Graph Communities",
      {
        definition: "Forums, groups, and communities for knowledge graph practitioners and enthusiasts.",
        listItems: [{
          title: "Communities & Forums",
          items: communityItems,
          type: 'bullet'
        }]
      },
      null,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide highlights communities where you can connect with other knowledge graph practitioners."
      }
    );
  }
  
  private createNextStepsSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'next-steps',
      "Next Steps",
      {
        definition: "Recommended next steps for continuing your knowledge graph journey.",
        listItems: [{
          title: "Getting Started",
          items: content.nextSteps || content.recommendations || [],
          type: 'numbered'
        }]
      },
      null,
      {
        transition: 'fade',
        notes: content.presenterNotes || "Presenter: This slide provides guidance on next steps for implementing knowledge graphs."
      }
    );
  }
}