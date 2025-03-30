# Knowledge Graph Presentation System: Architectural Overview and Implementation

## 1. Introduction

This document provides a comprehensive overview of the Knowledge Graph Presentation System's architecture, focusing on its transformation-oriented approach and template-based design pattern. The system implements a sophisticated pipeline that converts declarative markdown content into interactive visualizations through domain-specific transformation modules, enforcing clear separation between content definition and presentation logic.

## 2. Architectural Principles

### 2.1 Transformation-Oriented Architecture

The Knowledge Graph Presentation System employs a transformation-oriented architecture rather than a traditional model-view-controller pattern. In this approach:

- **Content sources** (markdown files) serve as the canonical representation of knowledge
- **Transformation logic** converts content into visualization data structures
- **Visualization components** render the transformed data without knowledge of the source

This architectural pattern enables:

1. **Content-Code Separation**: Content is defined in markdown files, completely separate from the transformation and presentation logic
2. **Specialized Transformations**: Each domain implements its own transformation logic specific to its visualization requirements
3. **Content Reusability**: The same content can be transformed differently based on context

### 2.2 Template Design Pattern

The system implements a hierarchical template design pattern that abstracts common functionality while preserving domain specificity:

```
ModuleTemplate (Orchestrator)
├── DataTransformerTemplate (Data extraction & transformation)
├── ConfigFactoryTemplate (Visualization configuration)
└── SlideFactoryTemplate (Presentation layer)
```

This pattern:

- Reduces code duplication by centralizing common patterns
- Enforces consistent structure across modules
- Maintains domain-specific logic in specialized implementation classes
- Enables flexible composition through dependency injection

## 3. Directory Structure and Architectural Mapping

The system's directory structure directly reflects its architectural patterns:

```
knowledge-graph-presentation/
├── src/
│   ├── modules/                     # Domain-specific modules
│   │   ├── intro/                   # Introduction module
│   │   │   ├── data.ts              # Data transformer implementation
│   │   │   ├── config.ts            # Config factory implementation
│   │   │   ├── slides.ts            # Slide factory implementation
│   │   │   └── index.ts             # Module orchestration
│   │   ├── core-components/         # Core components module
│   │   │   └── ...                  # Similar structure
│   │   └── ...                      # Additional domain modules
│   │
│   ├── utils/
│   │   ├── templates/               # Template system
│   │   │   ├── base-types.ts        # Core interfaces and contracts
│   │   │   ├── data-transformer.ts  # Base data transformer template
│   │   │   ├── config-factory.ts    # Base config factory template
│   │   │   ├── slide-factory.ts     # Base slide factory template
│   │   │   └── module-template.ts   # Module orchestration template
│   │   └── ...                      # Additional utilities
│   │
│   ├── services/                    # Application services
│   │   ├── markdown-loader.ts       # Content loading service
│   │   ├── markdown-content-registry.ts  # Content registry service
│   │   ├── presentation-builder.ts  # Composition service
│   │   └── ...                      # Additional services
│   │
│   ├── types/                       # Type definitions
│   │   ├── slide-data.ts            # Slide and presentation types
│   │   ├── graph-data.ts            # Graph visualization types
│   │   └── ...                      # Additional type definitions
│   │
│   └── visualizations/              # Visualization components
│       ├── graph.ts                 # Graph visualization component
│       ├── timeline.ts              # Timeline visualization component
│       └── ...                      # Additional visualizations
│
└── docs/
    └── presentation-content/        # Source markdown content
        └── enhanced-knowledge-graph.md  # Presentation content file
```

### 3.1 Module Architecture

Each domain module implements three core concerns, each mapped to a specific file:

1. **Data Transformation** (`data.ts`): Implements the `DataTransformer` interface to convert content to visualization data
2. **Configuration Generation** (`config.ts`): Implements the `ConfigFactory` interface for visualization parameters
3. **Slide Creation** (`slides.ts`): Implements the `SlideFactory` interface for presentation structure

The module's `index.ts` file orchestrates these components and provides factory functions for external consumers.

## 4. Content Transformation Pipeline

The complete transformation pipeline follows these stages:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐    
│ Markdown     │────>│ Loading &    │────>│ Content      │    
│ Content File │     │ Parsing      │     │ Registry     │    
└──────────────┘     └──────────────┘     └──────┬───────┘    
                                                 │            
                                                 ▼            
┌──────────────┐     ┌──────────────┐     ┌──────────────┐    
│ Presentation │<────│ Slide        │<────│ Domain-      │    
│ Rendering    │     │ Assembly     │     │ Specific     │    
└──────────────┘     └──────────────┘     │ Transformers │    
                                          └──────────────┘    
```

### 4.1 Content Loading and Parsing

The transformation process begins with loading and parsing the markdown content:

```typescript
// src/services/markdown-loader.ts
export class MarkdownLoader {
  async loadMarkdown(filepath: string): Promise<string> {
    const response = await fetch(filepath);
    if (!response.ok) {
      throw new Error(`Failed to load markdown: ${response.statusText}`);
    }
    return await response.text();
  }
}

// src/services/enhanced-markdown-parser.ts
export class EnhancedMarkdownParser {
  parseContent(markdown: string): ParsedContent {
    // Split content into slide sections
    const sections = markdown.split(/\n---\n/)
      .map(section => this.parseSection(section.trim()));
    
    return {
      title: this.extractTitle(sections[0]),
      sections: sections.map(section => ({
        id: this.generateId(section.title),
        title: section.title,
        visualDirectives: this.extractVisualDirectives(section),
        content: this.extractStructuredContent(section)
      }))
    };
  }
  
  private parseSection(section: string): SectionContent {
    // Parse section title, content, and directives
    const titleMatch = section.match(/^##\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Section';
    
    return {
      title,
      content: section,
      directives: this.extractDirectives(section)
    };
  }
  
  private extractVisualDirectives(section: SectionContent): VisualDirective[] {
    const directives: VisualDirective[] = [];
    
    // Extract visual directives from special syntax
    // Example: *[Visual: graph of entities and relationships]*
    const visualMatches = section.content.match(/\*\[Visual:([^\]]+)\]\*/g);
    if (visualMatches) {
      visualMatches.forEach(match => {
        const content = match.replace(/\*\[Visual:|\]\*/g, '').trim();
        directives.push({
          type: this.inferDirectiveType(content),
          content: content
        });
      });
    }
    
    // Extract code blocks that represent visualizations
    const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(section.content)) !== null) {
      const language = match[1] || '';
      const code = match[2];
      
      // Determine if this is a visualization
      const visType = this.inferVisualizationType(language, code);
      if (visType) {
        directives.push({
          type: visType,
          content: code,
          language: language
        });
      }
    }
    
    return directives;
  }
  
  private inferVisualizationType(language: string, code: string): string | null {
    if (['graph', 'diagram', 'flow', 'ascii'].includes(language)) {
      return language;
    }
    
    // Infer from content patterns
    if (code.includes('┌') && code.includes('┐')) {
      return 'ascii';
    } else if (code.includes('->') || code.includes('→')) {
      return 'diagram';
    }
    
    return null;
  }
  
  private extractStructuredContent(section: SectionContent): StructuredContent {
    // Extract different content components based on markdown structure
    return {
      text: this.extractMainText(section.content),
      lists: this.extractLists(section.content),
      tables: this.extractTables(section.content),
      codeBlocks: this.extractCodeBlocks(section.content)
    };
  }
}
```

### 4.2 Content Registry

The parsed content is stored in a registry that provides access to content fragments:

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
```

### 4.3 Domain-Specific Transformation

Each domain module implements its own transformation logic to convert content into visualization data:

```typescript
// src/modules/architecture/data.ts
export class ArchitectureDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Extract architecture diagram content
    const architectureDiagram = this.extractArchitectureDiagram(rawContent);
    
    // Transform into structured layer data
    return {
      layers: this.parseLayers(architectureDiagram),
      components: this.extractComponents(rawContent),
      connections: this.inferLayerConnections(architectureDiagram)
    };
  }
  
  private extractArchitectureDiagram(content: any): string {
    // Extract the architecture diagram from content
    const diagramMatch = content.match(/```[\s\S]*?(┌─+┐[\s\S]*?└─+┘)[\s\S]*?```/);
    return diagramMatch ? diagramMatch[1] : '';
  }
  
  private parseLayers(diagram: string): any[] {
    // Parse the ASCII diagram into structured layer data
    return diagram.split('\n')
      .filter(line => line.includes('│'))
      .map(line => {
        const layerMatch = line.match(/│\s+(.*?)\s+│/);
        return layerMatch ? { name: layerMatch[1].trim() } : null;
      })
      .filter(Boolean);
  }
  
  private extractComponents(content: any): any[] {
    // Extract component details from content
    const components = [];
    const componentMatches = content.match(/(?:^|\n)- \*\*(.*?)\*\*: (.*?)(?:\n|$)/g);
    
    if (componentMatches) {
      componentMatches.forEach(match => {
        const [, name, description] = match.match(/- \*\*(.*?)\*\*: (.*?)(?:\n|$)/) || [];
        if (name && description) {
          components.push({ name, description });
        }
      });
    }
    
    return components;
  }
}
```

### 4.4 Configuration Generation

Domain-specific configuration factories generate visualization parameters:

```typescript
// src/modules/architecture/config.ts
export class ArchitectureConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'architecture-layers':
        return this.createLayersConfig(data, options);
      default:
        return {};
    }
  }
  
  private createLayersConfig(data: any, options?: any): any {
    return {
      layout: {
        direction: 'TB',
        layerSpacing: 50,
        nodeSpacing: 20
      },
      nodeStyle: {
        width: 300,
        height: 60,
        fillColor: '#4C9AFF',
        strokeColor: '#0747A6',
        textColor: '#FFFFFF',
        cornerRadius: 5
      },
      edgeStyle: {
        strokeWidth: 2,
        strokeColor: '#6B778C',
        arrowSize: 8
      },
      animation: {
        sequential: true,
        duration: 800,
        delay: 200
      }
    };
  }
}
```

### 4.5 Slide Creation

Slide factories create presentation slides with appropriate visualizations:

```typescript
// src/modules/architecture/slides.ts
export class ArchitectureSlideFactory extends BaseSlideFactory {
  protected createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'architecture-overview':
        return this.createArchitectureOverviewSlide(content, options);
      case 'layer-details':
        return this.createLayerDetailsSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createArchitectureOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'architecture-overview',
      content.title || 'Knowledge Graph Architecture',
      {
        definition: content.description || 'The Knowledge Graph technology stack consists of multiple layers.',
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || 'This slide shows the architectural layers of a knowledge graph system.'
      }
    );
  }
  
  private createLayerDetailsSlide(content: any, options?: any): SlideConfig {
    // Create layer details slide
    return this.createSlide(
      `layer-${content.layer.name.toLowerCase().replace(/\s+/g, '-')}`,
      `${content.layer.name} Layer`,
      {
        definition: content.layer.description,
        listItems: [{
          title: 'Components',
          items: content.layer.components.map(comp => comp.name),
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || `This slide details the ${content.layer.name} layer.`
      }
    );
  }
}
```

### 4.6 Module Orchestration

The module's `index.ts` file orchestrates these components:

```typescript
// src/modules/architecture/index.ts
export class ArchitectureModule extends BaseModuleTemplate<ArchitectureOptions> {
  private dataTransformer: ArchitectureDataTransformer;
  private configFactory: ArchitectureConfigFactory;
  private slideFactory: ArchitectureSlideFactory;
  
  constructor(
    dataTransformer: ArchitectureDataTransformer,
    configFactory: ArchitectureConfigFactory,
    slideFactory: ArchitectureSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: ArchitectureOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('architecture-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create architecture overview slide
    const architectureContent = this.dataTransformer.transformContent('kg-architecture');
    
    // Create visualization configuration
    const architectureConfig = this.configFactory.createConfig(
      'architecture-layers', 
      architectureContent
    );
    
    // Create the overview slide
    slides.push(this.slideFactory.createDomainSlide(
      'architecture-overview', 
      architectureContent, 
      { visualizationConfig: architectureConfig }
    ));
    
    // Conditionally add layer detail slides
    if (options.includeLayerDetails) {
      architectureContent.layers.forEach(layer => {
        const layerContent = {
          layer,
          presenterNotes: `Details for the ${layer.name} layer of the knowledge graph architecture.`
        };
        
        slides.push(this.slideFactory.createDomainSlide(
          'layer-details',
          layerContent
        ));
      });
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Architecture',
      groupMetadata.id || 'architecture',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['architecture-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getArchitectureSlides(options: ArchitectureOptions = {}): SlideGroup {
  const dataTransformer = new ArchitectureDataTransformer();
  const configFactory = new ArchitectureConfigFactory();
  const slideFactory = new ArchitectureSlideFactory();
  
  const module = new ArchitectureModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}
```

## 5. Automated Content to Module Mapping

The system implements intelligent mapping between markdown content and specialized modules through pattern recognition and content identification:

### 5.1 Content-Module Association Map

Each module is designed to automatically extract content relevant to its domain:

| Markdown Section | Module | Content Extraction |
|------------------|--------|-------------------|
| Slides 1-2 | `intro` | Title, agenda, definition |
| Slide 3-4 | `core-components` | Definitions, historical context |
| Slide 5 | `core-components` | Entity types, relationships, properties |
| Slide 6 | `data-models` | RDF vs. Property Graph comparison |
| Slide 7 | `architecture` | Technology stack architecture |
| Slide 8 | `comparative-analysis` | Knowledge Graph vs. traditional databases |
| Slide 9 | `construction` | Building methodologies |
| Slide 10 | `query-mechanisms` | Query patterns and examples |
| Slide 11 | `root-cause-analysis` | Causal analysis approach |
| Slide 12 | `industry-applications` | Sector-specific applications |
| Slide 13 | `implementation-roadmap` | Implementation methodology |
| Slide 14 | `future-directions` | Evolutionary trends |
| Slide 15 | `resources` | Key takeaways and resources |

### 5.2 Content Transformation Class Diagram

The relationship between content elements and transformation components is illustrated in the following class diagram:

```
┌────────────────────┐       ┌────────────────────┐
│ MarkdownContent    │       │ BaseDataTransformer│
│ Registry           │<──────│                    │
└────────────────────┘       └─────────┬──────────┘
                                       │
                                       │
                                       ▼
┌────────────────────┐       ┌────────────────────┐
│ ContentIdentifier  │<──────│ DomainTransformer  │
└────────────────────┘       └─────────┬──────────┘
                                       │
                                       │
                                       ▼
┌────────────────────┐       ┌────────────────────┐
│ PatternMatcher     │<──────│ ContentExtractor   │
└────────────────────┘       └────────────────────┘
```

### 5.3 Pattern Recognition Implementation

The system uses pattern recognition to identify content types:

```typescript
// src/utils/content-recognition.ts
export enum ContentType {
  Definition,
  CodeExample,
  Table,
  Diagram,
  List,
  Quote,
  PlainText
}

export class ContentRecognizer {
  /**
   * Identifies the content type based on pattern analysis
   */
  identifyContentType(content: string): ContentType {
    if (content.match(/```\w+[\s\S]*?```/)) {
      return ContentType.CodeExample;
    } else if (content.match(/\|\s*-+\s*\|/)) {
      return ContentType.Table;
    } else if (content.match(/┌─+┐[\s\S]*?└─+┘/)) {
      return ContentType.Diagram;
    } else if (content.match(/^>\s/m)) {
      return ContentType.Quote;
    } else if (content.match(/^\s*[*-]\s/m)) {
      return ContentType.List;
    } else if (content.match(/^Definition:/mi)) {
      return ContentType.Definition;
    }
    return ContentType.PlainText;
  }
  
  /**
   * Extracts content sections based on recognized patterns
   */
  extractContentSections(content: string): Map<ContentType, string[]> {
    const sections = new Map<ContentType, string[]>();
    
    // Extract code examples
    sections.set(ContentType.CodeExample, this.extractCodeBlocks(content));
    
    // Extract tables
    sections.set(ContentType.Table, this.extractTables(content));
    
    // Extract diagrams
    sections.set(ContentType.Diagram, this.extractDiagrams(content));
    
    // Extract other content types...
    
    return sections;
  }
  
  private extractCodeBlocks(content: string): string[] {
    const blocks: string[] = [];
    const regex = /```(\w+)?\s*\n([\s\S]*?)```/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      blocks.push(match[0]);
    }
    
    return blocks;
  }
  
  private extractTables(content: string): string[] {
    // Implementation details...
    return [];
  }
  
  private extractDiagrams(content: string): string[] {
    // Implementation details...
    return [];
  }
}
```

## 6. Building a Presentation

The complete presentation is assembled using the `PresentationBuilder` service:

```typescript
// src/services/presentation-builder.ts
export class PresentationBuilder {
  private title: string = '';
  private presenter: PresenterInfo | null = null;
  private slideGroups: SlideGroup[] = [];
  private settings: PresentationSettings = {
    theme: 'black',
    defaultTransition: 'slide',
    showSlideNumber: 'all',
    controls: true,
    progress: true,
    center: true
  };
  
  /**
   * Sets the presentation title
   */
  setTitle(title: string): PresentationBuilder {
    this.title = title;
    return this;
  }
  
  /**
   * Sets the presenter information
   */
  setPresenter(presenter: PresenterInfo): PresentationBuilder {
    this.presenter = presenter;
    return this;
  }
  
  /**
   * Adds a slide group to the presentation
   */
  addSlideGroup(slideGroup: SlideGroup): PresentationBuilder {
    this.slideGroups.push(slideGroup);
    return this;
  }
  
  /**
   * Adds a module's slides to the presentation with dynamic options
   */
  addModuleContent(moduleFactory: () => SlideGroup): PresentationBuilder {
    const slideGroup = moduleFactory();
    this.slideGroups.push(slideGroup);
    return this;
  }
  
  /**
   * Updates presentation settings
   */
  updateSettings(settings: Partial<PresentationSettings>): PresentationBuilder {
    this.settings = { ...this.settings, ...settings };
    return this;
  }
  
  /**
   * Builds the complete presentation configuration
   */
  build(): PresentationConfig {
    return {
      title: this.title,
      presenter: this.presenter,
      slideGroups: this.slideGroups,
      settings: this.settings
    };
  }
}
```

Example usage:

```typescript
// Building a presentation from the enhanced knowledge graph content
const presentationConfig = new PresentationBuilder()
  .setTitle('Knowledge Graphs: Connecting Data for Intelligent Analysis')
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
  .addModuleContent(() => getCoreComponentsSlides({ 
    includeAdvancedTopics: isAdvancedAudience 
  }))
  .addModuleContent(() => getDataModelsSlides({
    includeRdfModel: true,
    includePropertyGraph: true,
    includeComparison: true
  }))
  .addModuleContent(() => getArchitectureSlides({
    includeLayerDetails: true
  }))
  // Additional modules...
  .updateSettings({
    theme: 'custom',
    defaultTransition: 'fade'
  })
  .build();
```

## 7. Benefits of the Architecture

The Knowledge Graph Presentation System's architecture provides several key advantages:

### 7.1 Content-Code Separation

Content definition is completely separated from transformation and presentation logic:

- **Content** is stored in markdown files
- **Transformation logic** is defined in `data.ts` files
- **Visualization parameters** are defined in `config.ts` files
- **Presentation structure** is defined in `slides.ts` files

This separation enables content authors to modify presentations without changing code, and developers to enhance transformation logic without affecting content.

### 7.2 Reusable Transformation Patterns

The template-based design pattern centralizes common transformation logic:

- **Error handling** is standardized in the base transformer
- **Configuration defaults** are provided by the base configuration factory
- **Slide structure** is standardized in the base slide factory

This reduces duplication and ensures consistent behavior across modules.

### 7.3 Dynamic Content Composition

The architecture enables dynamic content composition based on context:

- **Conditional inclusion** of content based on audience expertise
- **Content adaptation** for different presentation contexts
- **Runtime configuration** of visualization parameters

This flexibility allows the same content to be presented differently for different audiences.

### 7.4 Scalable Module System

New presentation modules can be added without modifying existing code:

1. Create a new directory under `src/modules/`
2. Implement the three core components: `data.ts`, `config.ts`, and `slides.ts`
3. Add the module orchestration in `index.ts`
4. Use the module in the presentation builder

This scalable approach allows the system to grow with additional content domains.

### 7.5 Testable Components

The separation of concerns enables thorough testing of each component:

- **Data transformers** can be tested with mock content
- **Configuration factories** can be tested with mock data
- **Slide factories** can be tested with mock visualizations

This testability ensures reliable behavior as the system evolves.

## 8. Conclusion

The Knowledge Graph Presentation System demonstrates a sophisticated approach to separating content definition from presentation logic. By implementing a transformation-oriented architecture with a template-based design pattern, the system achieves a high degree of flexibility, maintainability, and scalability.

This architecture provides a robust foundation for creating dynamic, interactive presentations about knowledge graphs, while enabling content authors and developers to work independently in their respective domains.

## Appendix: Complete Example Flow

The following sequence diagram illustrates the complete flow from markdown content to rendered presentation:

```
┌─────────┐         ┌─────────────┐         ┌────────────┐         ┌──────────┐
│Markdown │         │MarkdownLoader│         │MarkdownParser│         │ContentRegistry│
└────┬────┘         └──────┬──────┘         └──────┬───────┘         └────┬─────┘
     │      load()         │                       │                      │
     │─────────────────────>                       │                      │
     │                     │                       │                      │
     │                     │      parse()          │                      │
     │                     │──────────────────────>│                      │
     │                     │                       │                      │
     │                     │                       │    register()        │
     │                     │                       │─────────────────────>│
     │                     │                       │                      │
┌────┴────┐         ┌──────┴──────┐         ┌──────┴───────┐         ┌────┴─────┐
│Markdown │         │MarkdownLoader│         │MarkdownParser│         │ContentRegistry│
└─────────┘         └─────────────┘         └──────────────┘         └────┬─────┘
                                                                          │
                                                                          │
┌──────────┐         ┌─────────────┐         ┌──────────────┐         ┌────┴─────┐
│DataTransformer│     │ConfigFactory │         │SlideFactory   │         │ContentRegistry│
└──────┬─────┘         └──────┬──────┘         └──────┬───────┘         └────┬─────┘
       │   transform()        │                       │                      │
       │<─────────────────────────────────────────────────────────────────────
       │                      │                       │                      │
       │   getContent()       │                       │                      │
       │─────────────────────────────────────────────────────────────────────>
       │                      │                       │                      │
       │     createConfig()   │                       │                      │
       │────────────────────>│                       │                      │
       │                      │                       │                      │
       │                      │     createSlide()     │                      │
       │                      │──────────────────────>│                      │
┌──────┴─────┐         ┌──────┴──────┐         ┌──────┴───────┐         ┌────┴─────┐
│DataTransformer│         │ConfigFactory │         │SlideFactory   │         │ContentRegistry│
└──────┬─────┘         └──────┬──────┘         └──────┬───────┘         └──────────┘
       │                      │                       │                     
       │                      │                       │                     
┌──────┴─────┐         ┌──────┴──────┐         ┌──────┴───────┐         ┌──────────┐
│Module      │         │PresentationBuilder│     │SlideManager  │         │Reveal.js │
└──────┬─────┘         └──────┬──────┘         └──────┬───────┘         └────┬─────┘
       │  createSlides()      │                       │                      │
       │<─────────────────────│                       │                      │
       │                      │                       │                      │
       │    addModuleContent()│                       │                      │
       │─────────────────────>│                       │                      │
       │                      │                       │                      │
       │                      │      build()          │                      │
       │                      │───────────────────────>                      │
       │                      │                       │                      │
       │                      │                       │     initialize()     │
       │                      │                       │─────────────────────>│
┌──────┴─────┐         ┌──────┴──────┐         ┌──────┴───────┐         ┌────┴─────┐
│Module      │         │PresentationBuilder│     │SlideManager  │         │Reveal.js │
└────────────┘         └─────────────┘         └──────────────┘         └──────────┘
```

This sequence diagram illustrates how the system's components interact to transform markdown content into an interactive presentation, demonstrating the clear separation of concerns and the role of each component in the transformation pipeline.
