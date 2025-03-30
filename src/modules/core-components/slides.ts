import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class CoreComponentsSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch (type) {
      case 'overview':
        return this.createOverviewSlide(content, options);
      case 'entity-types':
        return this.createEntityTypesSlide(content, options);
      case 'relationship-types':
        return this.createRelationshipTypesSlide(content, options);
      case 'properties':
        return this.createPropertiesSlide(content, options);
      case 'component-detail':
        return this.createComponentDetailSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'components-overview',
      content.title || 'Knowledge Graph Components',
      {
        definition: content.description || 'Knowledge graphs consist of three primary components: entities, relationships, and properties.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.notes || 'This slide provides an overview of the core components of a knowledge graph.'
      }
    );
  }
  
  private createEntityTypesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'entity-types',
      content.title || 'Entity Types',
      {
        definition: content.description || 'Entities represent objects, concepts, or events in the real world.',
        listItems: [{
          title: 'Common Entity Types',
          items: content.examples || [
            'People (e.g., employees, customers)',
            'Organizations (e.g., companies, departments)',
            'Products (e.g., offerings, services)',
            'Locations (e.g., offices, regions)',
            'Events (e.g., meetings, transactions)'
          ],
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide explains different entity types in knowledge graphs.'
      }
    );
  }
  
  private createRelationshipTypesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'relationship-types',
      content.title || 'Relationship Types',
      {
        definition: content.description || 'Relationships connect entities and provide semantic meaning to their associations.',
        listItems: [{
          title: 'Common Relationship Categories',
          items: content.categories || [
            'Hierarchical (isA, partOf, contains)',
            'Action (created, developed, sold)',
            'Association (relatedTo, similarTo)',
            'Temporal (before, after, during)',
            'Spatial (locatedIn, adjacentTo)'
          ],
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide covers different types of relationships in knowledge graphs.'
      }
    );
  }
  
  private createPropertiesSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'properties',
      content.title || 'Properties',
      {
        definition: content.description || 'Properties add attributes to entities and relationships, providing detailed information.',
        listItems: [{
          title: 'Property Characteristics',
          items: content.characteristics || [
            'Key-value pairs (name: "John", age: 42)',
            'Primitive data types (string, number, date)',
            'Can be single-valued or multi-valued',
            'May have constraints (required, unique, range)'
          ],
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || 'This slide explains properties in knowledge graphs.'
      }
    );
  }
  
  private createComponentDetailSlide(content: any, options?: any): SlideConfig {
    // Extract component details
    const component = content.component || {};
    
    return this.createSlide(
      `component-detail-${component.name ? component.name.toLowerCase().replace(/\s+/g, '-') : 'unknown'}`,
      `${component.name || 'Component'} Details`,
      {
        definition: component.description || '',
        keyPoints: component.properties || [],
        codeSnippets: component.examples ? [{
          language: 'json',
          code: JSON.stringify(component.examples[0], null, 2),
          caption: 'Example'
        }] : undefined,
        listItems: [{
          title: 'Best Practices',
          items: component.bestPractices || [],
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.notes || `This slide provides details about the ${component.name || 'selected'} component.`
      }
    );
  }
}