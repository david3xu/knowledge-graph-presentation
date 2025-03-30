# Knowledge Graph Presentation System: Dynamic Content Architecture

## 1. Introduction

This document outlines the dynamic content architecture of the Knowledge Graph Presentation System, emphasizing the separation between content definition and presentation logic. The system employs a sophisticated transformation pipeline that converts markdown content into interactive visualizations through domain-specific transformation modules.

## 2. Directory Structure

The directory structure implements a modular architecture with clear separation of concerns:

```
knowledge-graph-presentation/
├── src/                             # Source code
│   ├── modules/                     # Domain-specific modules
│   │   ├── intro/                   # Introduction module
│   │   │   ├── data.ts              # Content transformation adapters (NOT static data)
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── core-components/         # Core components module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
...
│   │
│   ├── services/                    # Application services
│   │   ├── presentation-builder.ts  # Composition service
│   │   ├── presentation-manager.ts  # Lifecycle management
│   │   ├── slide-manager.ts         # Slide DOM management
│   │   ├── export-service.ts        # Presentation export utilities
│   │   ├── markdown-content-registry.ts  # Dynamic content registry
│   │   └── index.ts                 # Services module exports
...
```

## 3. Workflow Architecture

The following diagram illustrates the dynamic content flow within the Knowledge Graph Presentation System:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Type System (src/types/)                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ Provides type constraints
                                    ▼
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│ Markdown Files  │────▶│ MarkdownLoader      │────▶│ EnhancedMarkdown│
│ (.md)           │     │ (file I/O handling) │     │ Parser          │
└─────────────────┘     └─────────────────────┘     └────────┬────────┘
                                                             │
                                                             ▼
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│ Reusable MD     │────▶│ Markdown Content    │────▶│ Data Transformers│
│ Components      │     │ Registry            │     │ (utils/data-)    │
└─────────────────┘     └─────────────────────┘     └────────┬────────┘
                                 ▲                           │
                                 │                           ▼
┌─────────────────┐     ┌───────┴───────────┐     ┌─────────────────┐
│ Domain Modules  │────▶│ Module Factory    │◀────│ Visualization   │
│ (data.ts)       │     │ Functions (index.ts)    │ Configurations  │
└─────────────────┘     └────────┬────────────┘     └─────────────────┘
                                 │
                                 ▼
┌───────────────────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│ Markdown Translator           │◀────│ SlideConfig &       │◀────│ PresentationBuilder
│ (bidirectional conversion)    │     │ SlideGroups         │     │ (Composition)   │
└───────────────┬───────────────┘     └─────────────────────┘     └────────┬────────┘
                │                                                          │
                ▼                                                          │
┌─────────────────┐                   ┌─────────────────────┐              │
│ Serialized      │                   │ PresentationManager │◀─────────────┘
│ Content         │                   │ (Lifecycle)         │
└─────────────────┘                   └────────┬────────────┘
                                               │ Event propagation
                                               ▼
┌─────────────────────────┐          ┌─────────────────────┐     ┌─────────────────┐
│ Export Service         │◀─────────│ SlideManager        │────▶│ Reveal.js       │
│ (PDF/HTML generation)  │          │ (DOM Management)    │     │ Presentation    │
└───────────┬─────────────┘          └────────┬────────────┘     └────────┬────────┘
            │                                  │                          │
            ▼                                  ▼                          ▼
┌─────────────────┐          ┌─────────────────────────────────┐     ┌─────────────────┐
│ Static Assets   │          │ Visualization Components         │     │ DOM Elements    │
│ (PDF/HTML)      │          │ (graph, timeline, table, flow)   │     │ (HTML/CSS/SVG)  │
└─────────────────┘          └────────────────┬────────────────┘     └─────────────────┘
                                              │
                             ┌────────────────┼────────────────┐
                             │                │                │
                     ┌───────┴───────┐ ┌──────┴───────┐ ┌──────┴───────┐
                     │ Visualization │ │ ASCII-to-SVG │ │ Animation    │
                     │ Common Utils  │ │ Converter    │ │ Utilities    │
                     └───────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                 Responsive Utilities (utils/responsive.ts)                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    Testing Infrastructure (tests/)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4. Markdown Content Registry

At the heart of the dynamic content architecture is the `markdown-content-registry.ts` service, which implements a registry pattern for parsed markdown content:

```typescript
// src/services/markdown-content-registry.ts
export class MarkdownContentRegistry {
  private contentMap: Map<string, any> = new Map();
  
  /**
   * Registers parsed markdown content with an identifier
   */
  registerContent(id: string, content: any): void {
    this.contentMap.set(id, content);
  }
  
  /**
   * Retrieves content by identifier
   */
  getContent(id: string): any {
    const content = this.contentMap.get(id);
    if (!content) {
      throw new Error(`Content with id "${id}" not found in registry`);
    }
    return content;
  }
  
  /**
   * Checks if content exists
   */
  hasContent(id: string): boolean {
    return this.contentMap.has(id);
  }
}

export const markdownContentRegistry = new MarkdownContentRegistry();
```

## 5. Module Pattern Implementation

The module pattern demonstrates the transformation-oriented approach rather than hardcoded content. The following examples from the `intro` module illustrate this pattern:

### 5.1 Content Transformation Adapter (`data.ts`)

```typescript
// src/modules/intro/data.ts
import { GraphData } from '../../types/graph-data';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

/**
 * Transforms Markdown content into graph data structure
 */
export function getKgConceptGraphData(): GraphData {
  // Retrieve content from the markdown registry
  const conceptDefinitions = markdownContentRegistry.getContent('kg-concepts');
  
  // Transform markdown content into graph data structure
  return {
    nodes: conceptDefinitions.entities.map(entity => ({
      id: entity.id,
      label: entity.name,
      type: entity.type
    })),
    edges: conceptDefinitions.relationships.map(rel => ({
      source: rel.source,
      target: rel.target,
      label: rel.type
    })),
    metadata: {
      name: conceptDefinitions.title,
      description: conceptDefinitions.summary
    }
  };
}

/**
 * Extracts timeline data from markdown content
 */
export function getKgEvolutionTimelineData() {
  const evolutionContent = markdownContentRegistry.getContent('kg-evolution');
  
  // Parse markdown timeline entries and convert to structured format
  return {
    periods: evolutionContent.timelineSections.map(section => ({
      period: section.timePeriod,
      label: section.title,
      items: section.bulletPoints
    })),
    orientation: 'horizontal'
  };
}
```

### 5.2 Visualization Configuration (`config.ts`)

```typescript
// src/modules/intro/config.ts
import { GraphVisualizationOptions, TimelineVisualizationOptions } from '../../types/chart-config';

/**
 * Configuration for the concept graph visualization
 */
export const kgConceptGraphConfig: GraphVisualizationOptions = {
  layout: {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    padding: 30
  },
  nodeStyle: {
    color: {
      'Entity': '#4C9AFF',
      'Relation': '#FF8F73',
      'default': '#79E2F2'
    },
    size: {
      'Entity': 40,
      'Relation': 30,
      'default': 35
    },
    shape: {
      'Entity': 'circle',
      'Relation': 'diamond',
      'default': 'rectangle'
    }
  },
  edgeStyle: {
    color: '#6B778C',
    width: 2,
    arrowShape: 'triangle'
  },
  highlightNodes: [],  // Populated dynamically
  nodeTooltips: true,
  edgeTooltips: true,
  physics: true,
  draggable: true,
  zoomable: true
};

/**
 * Configuration for the KG evolution timeline visualization
 */
export const kgEvolutionTimelineConfig: TimelineVisualizationOptions = {
  orientation: 'horizontal',
  showAxisLabels: true,
  colorScheme: ['#4C9AFF', '#36B37E', '#FF5630', '#6554C0'],
  showEventLabels: true,
  timeFormat: 'YYYY',
  rowHeight: 80,
  showPeriodBackgrounds: true,
  animationDuration: 800
};
```

### 5.3 Factory Functions (`index.ts`)

```typescript
// src/modules/intro/index.ts
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { getKgConceptGraphData, getKgEvolutionTimelineData } from './data';
import { kgConceptGraphConfig, kgEvolutionTimelineConfig } from './config';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

export interface IntroModuleOptions {
  /* options as before */
  highlightKeyTerms?: boolean;
  includeTechnicalTerminology?: boolean;
  includeDefinitionSlide?: boolean;
  customTimelinePeriods?: any[];
}

/**
 * Creates a knowledge graph definition slide
 * @param highlightTerms Whether to highlight key terms
 * @param technicalTerminology Whether to use technical terminology
 */
function createDefinitionSlide(highlightTerms: boolean = false, technicalTerminology: boolean = false): SlideConfig {
  // Load content dynamically from markdown
  const definitionContent = markdownContentRegistry.getContent(
    technicalTerminology ? 'kg-definition-technical' : 'kg-definition'
  );
  
  return {
    id: 'kg-definition',
    title: definitionContent.title,
    content: {
      definition: highlightTerms 
        ? definitionContent.mainDefinition.replace(/knowledge graph/g, '<strong>knowledge graph</strong>')
        : definitionContent.mainDefinition,
      keyPoints: definitionContent.keyPoints
    },
    visualizationType: 'graph',
    visualizationConfig: {
      data: getKgConceptGraphData(),
      ...kgConceptGraphConfig,
      highlightNodes: definitionContent.focusEntities || []
    },
    transition: 'slide',
    notes: definitionContent.presenterNotes
  };
}

/**
 * Creates a timeline slide showing knowledge graph evolution
 * @param timelinePeriods Optional custom timeline periods
 */
function createEvolutionSlide(customPeriods?: any[]): SlideConfig {
  // Load content from markdown registry
  const evolutionContent = markdownContentRegistry.getContent('kg-evolution');
  const timelineData = getKgEvolutionTimelineData();
  
  if (customPeriods) {
    timelineData.periods = customPeriods;
  }
  
  return {
    id: 'kg-evolution',
    title: evolutionContent.title,
    content: {
      definition: evolutionContent.summary,
    },
    visualizationType: 'timeline',
    visualizationConfig: {
      data: timelineData,
      ...kgEvolutionTimelineConfig
    },
    transition: 'fade',
    notes: evolutionContent.presenterNotes
  };
}

/**
 * Returns the introduction slide group with configured visualizations
 * @param options Optional configuration parameters
 * @returns Fully configured slide group
 */
export function getIntroductionSlides(options: IntroModuleOptions = {}): SlideGroup {
  // Get metadata for group from markdown
  const groupMetadata = markdownContentRegistry.getContent('intro-group-metadata');
  
  const slides: SlideConfig[] = [];
  
  // Conditionally add slides based on options
  if (options.includeDefinitionSlide !== false) {
    slides.push(createDefinitionSlide(
      options.highlightKeyTerms, 
      options.includeTechnicalTerminology
    ));
  }
  
  slides.push(createEvolutionSlide(
    options.customTimelinePeriods
  ));
  
  // Additional slides would be added here
  
  return {
    title: groupMetadata.title || 'Introduction to Knowledge Graphs',
    id: groupMetadata.id || 'intro',
    includeSectionSlide: true,
    slides
  };
}
```

## 6. Content Loading Process

The dynamic content architecture is initialized during application startup:

```typescript
// During application initialization
async function loadContentFromMarkdown() {
  const markdownFiles = await getMarkdownFilesList();
  for (const file of markdownFiles) {
    const content = await markdownLoader.loadMarkdown(file.path);
    const parsedContent = enhancedMarkdownParser.parseContent(content);
    markdownContentRegistry.registerContent(file.id, parsedContent);
  }
}
```

## 7. Presentation Building Process

Once content is loaded and registered, the presentation is assembled by the `PresentationBuilder`:

```typescript
// Building a presentation with dynamic content
const presentationConfig = new PresentationBuilder()
  .setTitle('Knowledge Graph Fundamentals')
  .setPresenter({
    name: 'Dr. Jane Smith',
    title: 'Knowledge Graph Architect',
    organization: 'Graph Technologies Inc.'
  })
  // Add module content with runtime options
  .addModuleContent(() => getIntroductionSlides({ 
    highlightKeyTerms: true,
    includeTechnicalTerminology: isAdvancedAudience
  }))
  // Add core components with conditional content
  .addModuleContent(() => getCoreComponentsSlides({ 
    includeAdvancedTopics: isAdvancedAudience 
  }))
  // Additional modules...
  .build();
```

## 8. Architectural Benefits

This dynamic content architecture provides several key advantages:

1. **Content-Code Separation**
   - Content is defined in Markdown files, not hardcoded in TypeScript
   - Module components transform and organize content, not store it
   - Changes to content don't require code modifications

2. **Transformation-Oriented Modules**
   - Module `data.ts` files are adapters that transform content, not data repositories
   - Content structure is separated from visualization configuration
   - Transformation logic can be tested independently of content

3. **Dynamic Content Composition**
   - Content is assembled at runtime based on contextual parameters
   - Modules can conditionally include or exclude content based on audience
   - The same content can be presented differently for different contexts

4. **Content Reusability**
   - Markdown fragments can be reused across multiple presentations
   - The registry pattern facilitates efficient content access
   - Common content elements can be shared between different modules

5. **Maintainability**
   - Content authors work exclusively with Markdown
   - Developers enhance transformation logic and visualization capabilities
   - Clear separation of concerns simplifies testing and maintenance

## 9. Conclusion

The Knowledge Graph Presentation System implements a sophisticated dynamic content architecture that effectively separates content definition from presentation logic. By using a registry pattern with transformation-oriented modules, the system achieves flexibility, maintainability, and reusability while enabling powerful customization through runtime parameters.

The architecture supports multiple content sources, dynamic transformation, and contextual presentation, making it well-suited for complex knowledge graph visualization and educational content delivery.
