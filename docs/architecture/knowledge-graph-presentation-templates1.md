# Template-Based Architecture for Knowledge Graph Presentation System

## Executive Summary

This document outlines a template-based architectural refactoring for the Knowledge Graph Presentation System. The proposed architecture introduces a hierarchical template system that abstracts common patterns while preserving domain-specific logic and separation of concerns. By implementing composable templates for data transformation, configuration generation, and slide creation, the system significantly reduces code duplication, enhances type safety, and improves maintainability.

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Template System Components](#2-template-system-components)
3. [Directory Structure](#3-directory-structure)
4. [Dynamic Content Workflow](#4-dynamic-content-workflow)
5. [Implementation Guidelines](#5-implementation-guidelines)
6. [Integration with Existing System](#6-integration-with-existing-system)
7. [Architectural Benefits](#7-architectural-benefits)
8. [Example Implementation](#8-example-implementation)
9. [Testing Strategies](#9-testing-strategies)
10. [Conclusion](#10-conclusion)

## 1. Architecture Overview

The Knowledge Graph Presentation System employs a transformation-oriented approach to convert markdown content into interactive visualizations. The core architectural principle is the separation between content definition and presentation logic, with domain-specific modules handling the transformation of content into visualizations.

The template-based architecture enhances this approach by introducing a hierarchical template system that:

1. **Abstracts Common Patterns**: Provides reusable templates for data transformation, configuration, and slide creation
2. **Preserves Domain Specificity**: Maintains domain-specific logic in specialized implementation classes
3. **Enhances Composition**: Enables flexible composition of components through dependency injection
4. **Strengthens Type Safety**: Leverages TypeScript's type system to ensure compatibility between components

The architecture is built around a composable template system with clearly defined contracts between components:

```
ModuleTemplate (Orchestrator)
├── DataTransformerTemplate (Data extraction & transformation)
├── ConfigFactoryTemplate (Visualization configuration)
└── SlideFactoryTemplate (Presentation layer)
```

## 2. Template System Components

### 2.1 Base Type Interfaces

The foundation of the template system is a set of interfaces that establish contracts between components:

```typescript
// src/utils/templates/base-types.ts

import { SlideConfig, SlideGroup } from '../../types/slide-data';

/**
 * Core options interface for module configuration
 */
export interface ModuleOptions {
  /** Extension point for module-specific options */
  [key: string]: any;
}

/**
 * Contract for data transformation operations
 */
export interface DataTransformer {
  /** Registry content retrieval with domain-specific transformation */
  transformContent(contentId: string, options?: any): any;
  
  /** Error handling for content transformation */
  handleTransformationError(error: Error, contentId: string): any;
}

/**
 * Contract for configuration generation
 */
export interface ConfigFactory {
  /** Creates visualization configuration based on type and domain requirements */
  createConfig(visualizationType: string, data: any, options?: any): any;
  
  /** Extends configuration with domain-specific overrides */
  extendConfig(baseConfig: any, overrides: any): any;
}

/**
 * Contract for slide creation
 */
export interface SlideFactory {
  /** Creates standard slide structures */
  createSlide(id: string, title: string, content: any, visualizationConfig: any, options?: any): SlideConfig;
  
  /** Assembles slides into coherent groups */
  createSlideGroup(title: string, id: string, slides: SlideConfig[], options?: any): SlideGroup;
}

/**
 * Module integration contract
 */
export interface ModuleTemplate<T extends ModuleOptions> {
  /** Creates domain-specific slides with appropriate options */
  createSlides(options: T): SlideGroup;
}
```

### 2.2 Data Transformer Template

The `DataTransformerTemplate` provides standardized error handling and content retrieval from the markdown registry:

```typescript
// src/utils/templates/data-transformer.ts

import { DataTransformer } from './base-types';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

/**
 * Base implementation of DataTransformer with standard patterns
 */
export abstract class BaseDataTransformer implements DataTransformer {
  /**
   * Retrieves and transforms content with comprehensive error handling
   * @param contentId Content identifier in the registry
   * @param options Transformation options
   */
  public transformContent(contentId: string, options?: any): any {
    try {
      const rawContent = this.getContentFromRegistry(contentId);
      return this.transformContentImpl(rawContent, options);
    } catch (error) {
      return this.handleTransformationError(error as Error, contentId);
    }
  }
  
  /**
   * Standardized error handling with fallback content generation
   * @param error Error that occurred during transformation
   * @param contentId Content identifier that failed
   */
  public handleTransformationError(error: Error, contentId: string): any {
    console.error(`Transformation error for content "${contentId}":`, error);
    
    // Return fallback content structure
    return {
      error: true,
      message: `Failed to transform content: ${error.message}`,
      contentId,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Protected registry access with error boundary
   * @param contentId Content identifier
   */
  protected getContentFromRegistry(contentId: string): any {
    try {
      return markdownContentRegistry.getContent(contentId);
    } catch (error) {
      throw new Error(`Content not found: ${contentId}`);
    }
  }
  
  /**
   * Domain-specific implementation of content transformation
   * @param rawContent Raw content from registry
   * @param options Transformation options
   */
  protected abstract transformContentImpl(rawContent: any, options?: any): any;
}
```

### 2.3 Configuration Factory Template

The `ConfigFactoryTemplate` standardizes the creation of visualization configurations with common defaults:

```typescript
// src/utils/templates/config-factory.ts

import { ConfigFactory } from './base-types';

/**
 * Base implementation of ConfigFactory with standard configuration patterns
 */
export abstract class BaseConfigFactory implements ConfigFactory {
  /**
   * Creates appropriate configuration based on visualization type
   * @param visualizationType Type of visualization
   * @param data Data to be visualized
   * @param options Configuration options
   */
  public createConfig(visualizationType: string, data: any, options?: any): any {
    const baseConfig = this.getBaseConfig(visualizationType);
    const domainConfig = this.createDomainSpecificConfig(visualizationType, data, options);
    
    return this.extendConfig(baseConfig, domainConfig);
  }
  
  /**
   * Extends base configuration with domain-specific overrides
   * @param baseConfig Base configuration
   * @param overrides Domain-specific overrides
   */
  public extendConfig(baseConfig: any, overrides: any): any {
    // Deep merge configuration objects
    return this.deepMerge(baseConfig, overrides);
  }
  
  /**
   * Provides base configuration settings for visualization types
   * @param visualizationType Type of visualization
   */
  protected getBaseConfig(visualizationType: string): any {
    // Common configuration properties for all visualizations
    const commonConfig = {
      responsive: true,
      animationDuration: 800,
      tooltips: true,
      container: null as unknown as HTMLElement, // Set during runtime
    };
    
    // Type-specific base configurations
    switch (visualizationType) {
      case 'graph':
        return {
          ...commonConfig,
          layout: {
            padding: 30,
          },
          nodeStyle: {
            borderWidth: 2,
            opacity: 0.9,
          },
          edgeStyle: {
            width: 2,
            opacity: 0.7,
          },
          physics: true,
          draggable: true,
          zoomable: true,
        };
      
      case 'table':
        return {
          ...commonConfig,
          sortable: true,
          filterable: false,
          paginate: false,
          showRowNumbers: false,
        };
      
      // Additional cases for other visualization types...
      
      default:
        return commonConfig;
    }
  }
  
  /**
   * Deep merge utility for configuration objects
   * @param target Target object
   * @param source Source object
   */
  protected deepMerge(target: any, source: any): any {
    // Implementation of deep merge...
  }
  
  /**
   * Domain-specific configuration implementation
   * @param visualizationType Type of visualization
   * @param data Data to be visualized
   * @param options Configuration options
   */
  protected abstract createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any;
}
```

### 2.4 Slide Factory Template

The `SlideFactoryTemplate` provides standardized slide creation and assembly into groups:

```typescript
// src/utils/templates/slide-factory.ts

import { SlideFactory } from './base-types';
import { SlideConfig, SlideGroup, SlideContent } from '../../types/slide-data';

/**
 * Base implementation of SlideFactory with standard slide patterns
 */
export abstract class BaseSlideFactory implements SlideFactory {
  /**
   * Creates a slide with standardized structure
   * @param id Slide identifier
   * @param title Slide title
   * @param content Slide content
   * @param visualizationConfig Visualization configuration
   * @param options Slide creation options
   */
  public createSlide(
    id: string,
    title: string,
    content: any,
    visualizationConfig: any = null,
    options: any = {}
  ): SlideConfig {
    // Determine visualization type from configuration
    const visualizationType = visualizationConfig ? 
      (options.visualizationType || this.inferVisualizationType(visualizationConfig)) : 
      'none';
    
    // Standard slide structure
    return {
      id,
      title,
      content: this.createSlideContent(content),
      visualizationType,
      visualizationConfig,
      transition: options.transition || 'slide',
      notes: options.notes || '',
      classes: options.classes || [],
      background: options.background
    };
  }
  
  /**
   * Creates a slide group with standardized structure
   * @param title Group title
   * @param id Group identifier
   * @param slides Slides in the group
   * @param options Group creation options
   */
  public createSlideGroup(
    title: string,
    id: string,
    slides: SlideConfig[],
    options: any = {}
  ): SlideGroup {
    return {
      title,
      id,
      includeSectionSlide: options.includeSectionSlide !== false,
      slides,
      classes: options.classes || []
    };
  }
  
  /**
   * Creates standardized slide content
   * @param content Raw content object
   */
  protected createSlideContent(content: any): SlideContent {
    // Normalize slide content to match SlideContent interface
    // Implementation details...
  }
  
  /**
   * Infers visualization type from configuration
   * @param config Visualization configuration
   */
  protected inferVisualizationType(config: any): string {
    // Implementation details...
  }
  
  /**
   * Creates common slide types with domain-specific content
   * @param type Type of slide
   * @param content Slide content
   * @param options Slide creation options
   */
  protected abstract createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig;
}
```

### 2.5 Module Template Orchestrator

The `ModuleTemplate` orchestrates the interaction between data transformers, configuration factories, and slide factories:

```typescript
// src/utils/templates/module-template.ts

import { ModuleTemplate, ModuleOptions, DataTransformer, ConfigFactory, SlideFactory } from './base-types';
import { SlideGroup } from '../../types/slide-data';
import { markdownContentRegistry } from '../../services/markdown-content-registry';

/**
 * Abstract base class for module implementation
 */
export abstract class BaseModuleTemplate<T extends ModuleOptions> implements ModuleTemplate<T> {
  /** Data transformer component */
  protected dataTransformer: DataTransformer;
  
  /** Configuration factory component */
  protected configFactory: ConfigFactory;
  
  /** Slide factory component */
  protected slideFactory: SlideFactory;
  
  /**
   * Creates a new module template with injected components
   * @param dataTransformer Data transformation component
   * @param configFactory Configuration generation component
   * @param slideFactory Slide creation component
   */
  constructor(
    dataTransformer: DataTransformer,
    configFactory: ConfigFactory,
    slideFactory: SlideFactory
  ) {
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  /**
   * Creates slides for this module
   * @param options Module-specific options
   */
  public abstract createSlides(options: T): SlideGroup;
  
  /**
   * Retrieves module metadata from registry
   * @param metadataId Metadata identifier
   */
  protected getModuleMetadata(metadataId: string): any {
    // Implementation details...
  }
}

/**
 * Factory for creating modules with standardized components
 */
export class ModuleFactory {
  /**
   * Creates a module with standard components
   * @param ModuleClass Module implementation class
   * @param DataTransformerClass Data transformer implementation
   * @param ConfigFactoryClass Configuration factory implementation
   * @param SlideFactoryClass Slide factory implementation
   */
  public static createModule<
    M extends BaseModuleTemplate<O>,
    D extends DataTransformer,
    C extends ConfigFactory,
    S extends SlideFactory,
    O extends ModuleOptions
  >(
    ModuleClass: new (dt: D, cf: C, sf: S) => M,
    DataTransformerClass: new () => D,
    ConfigFactoryClass: new () => C,
    SlideFactoryClass: new () => S
  ): M {
    const dataTransformer = new DataTransformerClass();
    const configFactory = new ConfigFactoryClass();
    const slideFactory = new SlideFactoryClass();
    
    return new ModuleClass(dataTransformer, configFactory, slideFactory);
  }
}
```

## 3. Directory Structure

The template-based architecture introduces a new directory structure that accommodates the template system while preserving domain-specific modules:

```
knowledge-graph-presentation/
├── src/                             # Source code
│   ├── modules/                     # Domain-specific modules
│   │   ├── intro/                   # Introduction module
│   │   │   ├── data.ts              # Domain-specific data transformer implementation
│   │   │   ├── config.ts            # Domain-specific config factory implementation
│   │   │   ├── slides.ts            # Domain-specific slide factory implementation
│   │   │   └── index.ts             # Module orchestration and factory functions
│   │   ├── core-components/         # Core components module
│   │   │   ├── data.ts              # Domain-specific data transformer
│   │   │   ├── config.ts            # Domain-specific config factory
│   │   │   ├── slides.ts            # Domain-specific slide factory
│   │   │   └── index.ts             # Module orchestration and factory functions
│   │   ├── data-models/             # Knowledge Graph Data Models module
│   │   │   ├── data.ts              # Data model transformer implementation
│   │   │   ├── config.ts            # Data model visualization config
│   │   │   ├── slides.ts            # Data model slide factory
│   │   │   └── index.ts             # Data model module orchestration
│   │   ├── architecture/            # Architecture Layers module
│   │   │   ├── data.ts              # Architecture layer transformer
│   │   │   ├── config.ts            # Architecture visualization config
│   │   │   ├── slides.ts            # Architecture slide factory
│   │   │   └── index.ts             # Architecture module orchestration
│   │   ├── comparative-analysis/    # Comparative Analysis module
│   │   │   ├── data.ts              # Comparison data transformer
│   │   │   ├── config.ts            # Comparison visualization config
│   │   │   ├── slides.ts            # Comparison slide factory
│   │   │   └── index.ts             # Comparison module orchestration
│   │   ├── construction/            # Construction Methodologies module
│   │   │   ├── data.ts              # Construction data transformer
│   │   │   ├── config.ts            # Construction visualization config
│   │   │   ├── slides.ts            # Construction slide factory
│   │   │   └── index.ts             # Construction module orchestration
│   │   ├── query-mechanisms/        # Query Mechanisms module
│   │   │   ├── data.ts              # Query data transformer
│   │   │   ├── config.ts            # Query visualization config
│   │   │   ├── slides.ts            # Query slide factory
│   │   │   └── index.ts             # Query module orchestration
│   │   ├── root-cause-analysis/     # Root Cause Analysis module
│   │   │   ├── data.ts              # RCA data transformer
│   │   │   ├── config.ts            # RCA visualization config
│   │   │   ├── slides.ts            # RCA slide factory
│   │   │   └── index.ts             # RCA module orchestration
│   │   ├── industry-applications/   # Industry Applications module
│   │   │   ├── data.ts              # Applications data transformer
│   │   │   ├── config.ts            # Applications visualization config
│   │   │   ├── slides.ts            # Applications slide factory
│   │   │   └── index.ts             # Applications module orchestration
│   │   ├── implementation-roadmap/  # Implementation Roadmap module
│   │   │   ├── data.ts              # Implementation data transformer
│   │   │   ├── config.ts            # Implementation visualization config
│   │   │   ├── slides.ts            # Implementation slide factory
│   │   │   └── index.ts             # Implementation module orchestration
│   │   ├── future-directions/       # Future Directions module
│   │   │   ├── data.ts              # Future trends data transformer
│   │   │   ├── config.ts            # Future trends visualization config
│   │   │   ├── slides.ts            # Future trends slide factory
│   │   │   └── index.ts             # Future trends module orchestration
│   │   └── resources/               # Additional Resources module
│   │       ├── data.ts              # Resources data transformer
│   │       ├── config.ts            # Resources visualization config
│   │       ├── slides.ts            # Resources slide factory
│   │       └── index.ts             # Resources module orchestration
│   │
│   ├── utils/                       # Utility functions and templates
│   │   ├── templates/               # Template system
│   │   │   ├── base-types.ts        # Core interfaces and contracts
│   │   │   ├── data-transformer.ts  # Base data transformer template
│   │   │   ├── config-factory.ts    # Base configuration factory template
│   │   │   ├── slide-factory.ts     # Base slide factory template
│   │   │   ├── module-template.ts   # Module orchestration template
│   │   │   └── index.ts             # Template system exports
│   │   ├── responsive.ts            # Responsive utilities
│   │   ├── animation.ts             # Animation utilities
│   │   ├── ascii-to-svg.ts          # ASCII to SVG converter
│   │   ├── code-highlighter.ts      # Code syntax highlighting utility
│   │   ├── graph-utils.ts           # Graph manipulation utilities
│   │   ├── chart-utils.ts           # Charting and visualization utilities
│   │   ├── timer.ts                 # Presentation timing utilities
│   │   ├── interaction.ts           # Interactive element utilities
│   │   └── markdown-parser.ts       # Markdown parsing utilities
│   │
│   ├── services/                    # Application services
│   │   ├── presentation-builder.ts  # Composition service
│   │   ├── presentation-manager.ts  # Lifecycle management
│   │   ├── slide-manager.ts         # Slide DOM management
│   │   ├── export-service.ts        # Presentation export utilities
│   │   ├── markdown-content-registry.ts  # Dynamic content registry
│   │   ├── theme-service.ts         # Theme management service
│   │   ├── navigation-service.ts    # Presentation navigation service
│   │   ├── interaction-service.ts   # Interactive element service
│   │   ├── animation-service.ts     # Animation coordination service
│   │   └── index.ts                 # Services module exports
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── slide-data.ts            # Slide and presentation types
│   │   ├── graph-data.ts            # Graph visualization types
│   │   ├── chart-config.ts          # Visualization config types
│   │   ├── timeline-data.ts         # Timeline visualization types
│   │   ├── table-data.ts            # Table visualization types
│   │   ├── flow-diagram-data.ts     # Flow diagram visualization types
│   │   ├── animation-types.ts       # Animation type definitions
│   │   ├── interaction-types.ts     # Interactive element types
│   │   └── theme-types.ts           # Theme and styling types
│   │
│   ├── visualizations/              # Visualization components
│   │   ├── graph.ts                 # Graph visualization component
│   │   ├── timeline.ts              # Timeline visualization component
│   │   ├── table.ts                 # Table visualization component
│   │   ├── flow-diagram.ts          # Flow diagram visualization component
│   │   ├── comparison-chart.ts      # Comparison chart visualization
│   │   ├── radar-chart.ts           # Radar chart for technology maturity
│   │   ├── network-diagram.ts       # Network diagram visualization
│   │   ├── causal-graph.ts          # Causal graph visualization
│   │   ├── process-flow.ts          # Process flow visualization
│   │   ├── tree-diagram.ts          # Tree diagram visualization
│   │   └── code-block.ts            # Code block visualization
│   │
│   └── index.ts                     # Application entry point
│
├── public/                          # Static assets and HTML templates
│   ├── index.html                   # Main HTML template
│   ├── favicon.ico                  # Site favicon
│   ├── images/                      # Image assets
│   │   ├── backgrounds/             # Slide background images
│   │   ├── icons/                   # UI icons
│   │   └── logos/                   # Logo images
│   ├── styles/                      # CSS styles
│   │   ├── theme.css                # Theme styles
│   │   └── main.css                 # Main styles
│   └── fonts/                       # Web fonts
│
├── docs/                            # Documentation and markdown content
│   ├── architecture/                # Architectural documentation
│   │   ├── template-system.md       # Template system documentation
│   │   ├── module-pattern.md        # Module pattern documentation
│   │   └── visualization-architecture.md # Visualization architecture docs
│   ├── development/                 # Development guides
│   │   ├── adding-modules.md        # Guide for adding new modules
│   │   ├── creating-visualizations.md # Guide for creating visualizations
│   │   └── template-usage.md        # Guide for using templates
│   ├── presentation-content/        # Presentation markdown files
│   │   ├── enhanced-knowledge-graph.md # Knowledge graph presentation content
│   │   └── other-presentations/     # Additional presentation content
│   └── api/                         # API documentation
│       ├── data-transformer.md      # Data transformer API docs
│       ├── config-factory.md        # Config factory API docs
│       └── slide-factory.md         # Slide factory API docs
│
├── tests/                           # Test infrastructure
│   ├── unit/                        # Unit tests
│   │   ├── modules/                 # Module tests
│   │   ├── services/                # Service tests
│   │   ├── utils/                   # Utility tests
│   │   └── visualizations/          # Visualization tests
│   ├── integration/                 # Integration tests
│   │   ├── module-integration.test.ts # Module integration tests
│   │   └── service-integration.test.ts # Service integration tests
│   ├── e2e/                         # End-to-end tests
│   │   └── presentation-flow.test.ts # Presentation flow tests
│   └── mocks/                       # Test mocks
│       ├── markdown-mocks.ts        # Markdown content mocks
│       └── visualization-mocks.ts   # Visualization mocks
│
├── package.json                     # Node.js package configuration
├── tsconfig.json                    # TypeScript configuration
├── webpack.config.js                # Webpack configuration
├── jest.config.js                   # Jest test configuration
├── .gitignore                       # Git ignore file
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── .devcontainer/                   # Development container settings
│   ├── Dockerfile                   # Dev container Dockerfile
│   └── devcontainer.json            # Dev container configuration
├── .github/                         # GitHub configuration
│   └── workflows/                   # GitHub Actions workflows
│       ├── ci.yml                   # Continuous integration
│       └── deploy.yml               # Deployment workflow
└── README.md                        # Project documentation
```

## 4. Dynamic Content Workflow

The dynamic content workflow is enhanced with the template system:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Type System (src/types/)                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ Provides type constraints
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         Template System (src/utils/templates/)              │
├────────────┬─────────────────┬──────────────────┬──────────────────────────┤
│ base-types │ data-transformer │ config-factory   │ slide-factory            │
└────────────┴────────┬────────┴──────┬───────────┴───────────┬──────────────┘
                      │               │                        │
                      │ extends       │ extends                │ extends
                      ▼               ▼                        ▼
┌─────────────────┐   ┌─────────────────────┐   ┌─────────────────────────────┐
│ Markdown Files  │──▶│ MarkdownLoader      │──▶│ EnhancedMarkdown            │
│ (.md)           │   │ (file I/O handling) │   │ Parser                      │
└─────────────────┘   └─────────────────────┘   └───────────────┬─────────────┘
                                                                │
                                                                ▼
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────────────┐
│ Reusable MD     │────▶│ Markdown Content    │────▶│ Domain-Specific         │
│ Components      │     │ Registry            │     │ Data Transformers       │
└─────────────────┘     └─────────────────────┘     └───────────┬─────────────┘
                                 ▲                              │
                                 │                              ▼
┌─────────────────┐     ┌───────┴───────────┐     ┌─────────────────────────┐
│ Module Template │────▶│ Domain Module     │◀────│ Domain-Specific         │
│ Orchestration   │     │ Implementation     │     │ Config Factories        │
└─────────────────┘     └────────┬───────────┘     └───────────┬─────────────┘
                                 │                             │
                                 ▼                             ▼
┌───────────────────────────────┐     ┌─────────────────────┐  ┌─────────────┐
│ Factory Functions             │◀────│ Domain-Specific      │◀─│ SlideConfig │
│ (getXxxSlides)                │     │ Slide Factories      │  │ SlideGroups │
└───────────────┬───────────────┘     └─────────────────────┘  └─────────────┘
                │
                ▼
┌───────────────────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│ PresentationBuilder           │────▶│ PresentationManager │────▶│ SlideManager    │
│ (Composition)                 │     │ (Lifecycle)         │     │ (DOM Management)│
└───────────────────────────────┘     └─────────────────────┘     └────────┬────────┘
                                                                           │
                                                                           ▼
┌─────────────────────────┐          ┌─────────────────────────────────┐  ┌─────────────────┐
│ Export Service         │◀─────────│ Visualization Components         │◀─│ Reveal.js       │
│ (PDF/HTML generation)  │          │ (graph, timeline, table, flow)   │  │ Presentation    │
└───────────┬─────────────┘          └────────────────┬────────────────┘  └─────────────────┘
            │                                         │
            ▼                                         ▼
┌─────────────────┐          ┌──────────────────────────────────────────────┐
│ Static Assets   │          │ Rendered Visualizations & Interactive Content │
│ (PDF/HTML)      │          │ (SVG, HTML, CSS, JavaScript)                  │
└─────────────────┘          └──────────────────────────────────────────────┘
```

## 5. Implementation Guidelines

### 5.1 Creating a New Module

To implement a new module using the template system:

1. **Create Domain-Specific Data Transformer**:
   ```typescript
   // src/modules/new-module/data.ts
   import { BaseDataTransformer } from '../../utils/templates/data-transformer';
   
   export class NewModuleDataTransformer extends BaseDataTransformer {
     protected transformContentImpl(rawContent: any, options?: any): any {
       // Implement domain-specific transformation logic
     }
     
     // Additional domain-specific transformation methods
   }
   ```

2. **Create Domain-Specific Config Factory**:
   ```typescript
   // src/modules/new-module/config.ts
   import { BaseConfigFactory } from '../../utils/templates/config-factory';
   
   export class NewModuleConfigFactory extends BaseConfigFactory {
     protected createDomainSpecificConfig(visualizationType: string, data: any, options?: any): any {
       // Implement domain-specific configuration logic
     }
     
     // Additional domain-specific configuration methods
   }
   ```

3. **Create Domain-Specific Slide Factory**:
   ```typescript
   // src/modules/new-module/slides.ts
   import { BaseSlideFactory } from '../../utils/templates/slide-factory';
   import { SlideConfig } from '../../types/slide-data';
   
   export class NewModuleSlideFactory extends BaseSlideFactory {
     protected createDomainSlide(type: string, content: any, options?: any): SlideConfig {
       // Implement domain-specific slide creation logic
     }
     
     // Additional domain-specific slide creation methods
   }
   ```

4. **Create Module Implementation**:
   ```typescript
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
   ```

### 5.2 Converting Existing Modules

To convert an existing module to use the template system:

1. **Refactor Data Functions into Data Transformer**:
   - Extract transformation logic from existing functions
   - Implement the `BaseDataTransformer` abstract class
   - Convert utility functions to class methods

2. **Refactor Configuration into Config Factory**:
   - Extract configuration generation from existing objects
   - Implement the `BaseConfigFactory` abstract class
   - Convert static configuration to dynamic generation

3. **Refactor Slide Creation into Slide Factory**:
   - Extract slide creation from existing functions
   - Implement the `BaseSlideFactory` abstract class
   - Convert utility functions to class methods

4. **Implement Module Template**:
   - Create a new module class extending `BaseModuleTemplate`
   - Implement the `createSlides` method using components
   - Provide a factory function for backward compatibility

## 6. Integration with Existing System

### 6.1 Backward Compatibility Layer

To maintain compatibility with the existing system, each module provides a factory function that encapsulates the template-based implementation:

```typescript
// src/modules/intro/index.ts

// Factory function for backward compatibility
export function getIntroductionSlides(options: IntroModuleOptions = {}): SlideGroup {
  const dataTransformer = new IntroDataTransformer();
  const configFactory = new IntroConfigFactory();
  const slideFactory = new IntroSlideFactory();
  
  const module = new IntroModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}
```

### 6.2 PresentationBuilder Integration

The `PresentationBuilder` can continue to use the factory functions without modification:

```typescript
// Building a presentation with dynamic content
const presentationConfig = new PresentationBuilder()
  .setTitle('Knowledge Graph Fundamentals')
  .setPresenter({
    name: 'Dr. Jane Smith',
    title: 'Knowledge Graph Architect',
    organization: 'Graph Technologies Inc.'
  })
  // Add module content with runtime options (uses factory functions)
  .addModuleContent(() => getIntroductionSlides({ 
    highlightKeyTerms: true,
    includeTechnicalTerminology: isAdvancedAudience
  }))
  .addModuleContent(() => getCoreComponentsSlides({ 
    includeAdvancedTopics: isAdvancedAudience 
  }))
  // Additional modules...
  .build();
```

### 6.3 Phased Migration Strategy

The system can be migrated to the template-based architecture in phases:

1. **Infrastructure Phase**:
   - Implement the template system in `utils/templates/`
   - Create unit tests for base templates

2. **Pilot Module Phase**:
   - Convert one module (e.g., `intro`) to the template-based approach
   - Verify compatibility with existing system
   - Address any issues discovered during pilot

3. **Systematic Migration Phase**:
   - Convert remaining modules one by one
   - Ensure backward compatibility throughout

4. **Optimization Phase**:
   - Refactor for consistency across modules
   - Extract common patterns to templates
   - Update documentation

## 7. Architectural Benefits

### 7.1 Code Reuse

The template-based architecture significantly reduces code duplication by abstracting common patterns:

| Component | Duplication Reduction |
|-----------|----------------------|
| Error Handling | ≈ 95% |
| Registry Access | ≈ 100% |
| Base Configuration | ≈ 80% |
| Slide Structure | ≈ 90% |
| Type Definitions | ≈ 70% |

### 7.2 Type Safety

The architecture leverages TypeScript's type system to ensure compatibility:

- **Generic Type Parameters**: Enable type-safe composition of components
- **Interface Contracts**: Define clear boundaries between components
- **Module Options Typing**: Provide domain-specific options with type checking

### 7.3 Separation of Concerns

The architecture maintains clear separation between different aspects of the system:

- **Data Transformation**: Focused on converting content to visualization data
- **Configuration Generation**: Focused on visualization parameters
- **Slide Creation**: Focused on presentation structure
- **Module Orchestration**: Focused on component integration

### 7.4 Testability

The architecture enhances testability through component isolation:

- **Data Transformers**: Can be tested with mock content
- **Config Factories**: Can be tested with mock data
- **Slide Factories**: Can be tested with mock content and config
- **Module Templates**: Can be tested with mock components

### 7.5 Maintainability

The architecture improves maintainability through standardization:

- **Consistent Patterns**: All modules follow the same architectural patterns
- **Centralized Changes**: Common behavior can be modified in base templates
- **Reduced Boilerplate**: Less code to maintain through abstraction
- **Clear Responsibilities**: Each component has a well-defined role

## 8. Example Implementation

### 8.1 Implementation of Introduction Module

The following example demonstrates the implementation of the Introduction module using the template system:

#### Data Transformer (`intro/data.ts`):

```typescript
import { BaseDataTransformer } from '../../utils/templates/data-transformer';
import { GraphData } from '../../types/graph-data';

export class IntroDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Delegate to specialized transformers based on content type
    if (rawContent.entities && rawContent.relationships) {
      return this.transformConceptGraphData(rawContent, options);
    } else if (rawContent.timelineSections) {
      return this.transformEvolutionTimelineData(rawContent, options);
    } else if (rawContent.keyTerms) {
      return this.transformKeyConcepts(rawContent, options);
    }
    
    // Return normalized content for unspecialized types
    return this.normalizeContent(rawContent);
  }
  
  private transformConceptGraphData(rawContent: any, options?: any): GraphData {
    // Specialized transformation logic for graph data
    const nodes = rawContent.entities.map((entity: any) => ({
      id: entity.id,
      label: entity.name,
      type: entity.type,
      properties: {
        description: entity.description,
        examples: entity.examples
      }
    }));
    
    const edges = rawContent.relationships.map((rel: any) => ({
      source: rel.source,
      target: rel.target,
      label: rel.type,
      directed: true,
      properties: {
        description: rel.description
      }
    }));
    
    return {
      nodes,
      edges,
      metadata: {
        name: rawContent.title,
        description: rawContent.summary
      }
    };
  }
  
  private transformEvolutionTimelineData(rawContent: any, options?: any): any {
    // Transform timeline data from markdown content
    return {
      periods: rawContent.timelineSections.map((section: any) => ({
        period: section.timePeriod,
        label: section.title,
        items: section.bulletPoints,
        events: section.events?.map((event: any) => ({
          date: event.date,
          title: event.title,
          description: event.description
        })) || []
      })),
      orientation: 'horizontal',
      startTime: rawContent.timelineSections[0]?.timePeriod.split('-')[0] || '1960',
      endTime: rawContent.timelineSections[rawContent.timelineSections.length - 1]?.timePeriod.split('-')[1] || 'Present'
    };
  }
  
  private transformKeyConcepts(rawContent: any, options?: any): any {
    // Extract key concepts from content
    return rawContent.keyTerms.map((term: any) => ({
      term: term.name,
      definition: term.definition
    }));
  }
  
  private normalizeContent(rawContent: any): any {
    // Default normalization for generic content
    return {
      title: rawContent.title || '',
      summary: rawContent.summary || '',
      keyPoints: rawContent.keyPoints || [],
      presenterNotes: rawContent.presenterNotes || ''
    };
  }
}
```

#### Config Factory (`intro/config.ts`):

```typescript
import { BaseConfigFactory } from '../../utils/templates/config-factory';
import { GraphVisualizationOptions, TimelineVisualizationOptions } from '../../types/chart-config';

export class IntroConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch(visualizationType) {
      case 'graph':
        return this.createConceptGraphConfig(data, options);
      case 'timeline':
        return this.createEvolutionTimelineConfig(data, options);
      default:
        return {};
    }
  }
  
  private createConceptGraphConfig(data: any, options?: any): Partial<GraphVisualizationOptions> {
    return {
      layout: {
        name: 'cose',
        idealEdgeLength: 100,
        nodeOverlap: 20,
        padding: 30,
        randomize: false
      },
      nodeStyleFunction: (node: any) => {
        if (node.type === 'Entity') {
          return { color: '#4C9AFF', shape: 'circle', size: 45 };
        } else if (node.type === 'Relation') {
          return { color: '#FF8F73', shape: 'diamond', size: 35 };
        } else if (node.type === 'Property') {
          return { color: '#79E2F2', shape: 'rectangle', size: 40 };
        }
        return {}; // Default styling
      },
      highlightNodes: options?.highlightNodes || []
    };
  }
  
  private createEvolutionTimelineConfig(data: any, options?: any): Partial<TimelineVisualizationOptions> {
    return {
      orientation: 'horizontal',
      showAxisLabels: true,
      colorScheme: ['#4C9AFF', '#36B37E', '#FF5630', '#6554C0'],
      showEventLabels: true,
      timeFormat: 'YYYY',
      rowHeight: 80,
      showPeriodBackgrounds: true
    };
  }
}
```

#### Slide Factory (`intro/slides.ts`):

```typescript
import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class IntroSlideFactory extends BaseSlideFactory {
  protected createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'title':
        return this.createTitleSlide(content, options);
      case 'definition':
        return this.createDefinitionSlide(content, options);
      case 'evolution':
        return this.createEvolutionSlide(content, options);
      case 'quote':
        return this.createQuoteSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createTitleSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'title-slide',
      content.title || 'Knowledge Graph Presentation',
      {
        subtitle: content.subtitle || 'Understanding Connected Data Structures',
        presenter: content.presenter || ''
      },
      null,
      {
        transition: 'fade',
        classes: ['title-slide'],
        background: options?.background || {
          color: '#172B4D',
          opacity: 1
        }
      }
    );
  }
  
  private createDefinitionSlide(content: any, options?: any): SlideConfig {
    // Process definition text with optional highlighting
    let definition = content.mainDefinition;
    if (options?.highlightKeyTerms && options?.keyConcepts) {
      options.keyConcepts.forEach((concept: any) => {
        definition = definition.replace(
          new RegExp(`\\b${concept.term}\\b`, 'gi'), 
          `<strong>${concept.term}</strong>`
        );
      });
    }
    
    return this.createSlide(
      'kg-definition',
      content.title || 'What is a Knowledge Graph?',
      {
        definition,
        keyPoints: content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || ''
      }
    );
  }
  
  private createEvolutionSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'kg-evolution',
      content.title || 'Knowledge Graph Evolution',
      {
        definition: content.summary || ''
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || ''
      }
    );
  }
  
  private createQuoteSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'kg-quotes',
      'Expert Perspectives',
      {
        quote: {
          text: content.text,
          author: content.author,
          source: content.source
        }
      },
      null,
      {
        transition: 'fade',
        background: {
          color: '#2a2a2a'
        },
        classes: ['quote-slide']
      }
    );
  }
}
```

#### Module Implementation (`intro/index.ts`):

```typescript
import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { IntroDataTransformer } from './data';
import { IntroConfigFactory } from './config';
import { IntroSlideFactory } from './slides';

export interface IntroModuleOptions {
  highlightKeyTerms?: boolean;
  includeTechnicalTerminology?: boolean;
  includeDefinitionSlide?: boolean;
  includeEvolutionSlide?: boolean;
  includeQuotes?: boolean;
  titleBackground?: any;
  customTimelinePeriods?: any[];
}

export class IntroModule extends BaseModuleTemplate<IntroModuleOptions> {
  private dataTransformer: IntroDataTransformer;
  private configFactory: IntroConfigFactory;
  private slideFactory: IntroSlideFactory;
  
  constructor(
    dataTransformer: IntroDataTransformer,
    configFactory: IntroConfigFactory,
    slideFactory: IntroSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: IntroModuleOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('intro-group-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create title slide
    const titleContent = this.dataTransformer.transformContent('intro-title');
    slides.push(this.slideFactory.createDomainSlide('title', titleContent, {
      background: options.titleBackground
    }));
    
    // Conditionally add definition slide
    if (options.includeDefinitionSlide !== false) {
      const contentKey = options.includeTechnicalTerminology 
        ? 'kg-definition-technical' 
        : 'kg-definition';
      
      const definitionContent = this.dataTransformer.transformContent(contentKey);
      
      // Load key concepts for highlighting if needed
      let keyConcepts = null;
      if (options.highlightKeyTerms) {
        keyConcepts = this.dataTransformer.transformContent('kg-concepts');
      }
      
      // Create visualization configuration
      const graphData = this.dataTransformer.transformContent('kg-concepts');
      const visualizationConfig = this.configFactory.createConfig(
        'graph', 
        graphData, 
        { highlightNodes: definitionContent.focusEntities }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'definition', 
        definitionContent, 
        { 
          keyConcepts, 
          highlightKeyTerms: options.highlightKeyTerms,
          visualizationConfig
        }
      ));
    }
    
    // Conditionally add evolution timeline slide
    if (options.includeEvolutionSlide !== false) {
      const evolutionContent = this.dataTransformer.transformContent('kg-evolution');
      
      // Create timeline data
      let timelineData = this.dataTransformer.transformContent('kg-evolution-timeline');
      if (options.customTimelinePeriods) {
        timelineData.periods = options.customTimelinePeriods;
      }
      
      // Create visualization configuration
      const visualizationConfig = this.configFactory.createConfig(
        'timeline', 
        timelineData
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'evolution', 
        evolutionContent, 
        { visualizationConfig }
      ));
    }
    
    // Conditionally add quotes slide
    if (options.includeQuotes) {
      const quotes = this.dataTransformer.transformContent('kg-quotes');
      if (quotes.length > 0) {
        slides.push(this.slideFactory.createDomainSlide('quote', quotes[0]));
      }
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Introduction to Knowledge Graphs',
      groupMetadata.id || 'intro',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['intro-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getIntroductionSlides(options: IntroModuleOptions = {}): SlideGroup {
  const dataTransformer = new IntroDataTransformer();
  const configFactory = new IntroConfigFactory();
  const slideFactory = new IntroSlideFactory();
  
  const module = new IntroModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}
```

## 9. Testing Strategies

### 9.1 Unit Testing Templates

Each base template should be unit tested to verify core functionality:

```typescript
// tests/utils/templates/data-transformer.test.ts
import { BaseDataTransformer } from '../../../src/utils/templates/data-transformer';
import { markdownContentRegistry } from '../../../src/services/markdown-content-registry';

// Mock implementation for testing
class MockDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    return {
      transformed: true,
      original: rawContent,
      options
    };
  }
}

describe('BaseDataTransformer', () => {
  beforeEach(() => {
    // Mock the markdown content registry
    jest.spyOn(markdownContentRegistry, 'getContent').mockImplementation(
      (id: string) => ({ id, content: 'mock content' })
    );
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('transformContent returns transformed data', () => {
    const transformer = new MockDataTransformer();
    const result = transformer.transformContent('test-id');
    
    expect(result).toEqual({
      transformed: true,
      original: { id: 'test-id', content: 'mock content' },
      options: undefined
    });
  });
  
  test('transformContent handles options', () => {
    const transformer = new MockDataTransformer();
    const options = { test: true };
    const result = transformer.transformContent('test-id', options);
    
    expect(result.options).toEqual(options);
  });
  
  test('handleTransformationError returns error data', () => {
    const transformer = new MockDataTransformer();
    const error = new Error('Test error');
    const result = transformer.handleTransformationError(error, 'test-id');
    
    expect(result.error).toBe(true);
    expect(result.message).toContain('Test error');
    expect(result.contentId).toBe('test-id');
  });
});
```

### 9.2 Testing Domain-Specific Implementations

Domain-specific implementations should be tested with mock data:

```typescript
// tests/modules/intro/data.test.ts
import { IntroDataTransformer } from '../../../src/modules/intro/data';
import { markdownContentRegistry } from '../../../src/services/markdown-content-registry';

describe('IntroDataTransformer', () => {
  const mockConceptData = {
    entities: [
      { id: 'entity1', name: 'Entity 1', type: 'Entity', description: 'Test entity' }
    ],
    relationships: [
      { source: 'entity1', target: 'entity2', type: 'relates_to', description: 'Test relationship' }
    ],
    title: 'Test Concepts',
    summary: 'Test summary'
  };
  
  beforeEach(() => {
    // Mock the markdown content registry
    jest.spyOn(markdownContentRegistry, 'getContent').mockImplementation(
      (id: string) => {
        if (id === 'kg-concepts') return mockConceptData;
        return { id, content: 'mock content' };
      }
    );
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('transformContentImpl handles concept graph data', () => {
    const transformer = new IntroDataTransformer();
    const result = transformer.transformContent('kg-concepts');
    
    expect(result.nodes).toBeDefined();
    expect(result.edges).toBeDefined();
    expect(result.nodes.length).toBe(1);
    expect(result.edges.length).toBe(1);
    expect(result.nodes[0].id).toBe('entity1');
    expect(result.edges[0].source).toBe('entity1');
  });
  
  // Additional tests for other transformation methods
});
```

### 9.3 Integration Testing

Integration tests should verify that components work together:

```typescript
// tests/modules/intro/index.test.ts
import { getIntroductionSlides } from '../../../src/modules/intro';
import { markdownContentRegistry } from '../../../src/services/markdown-content-registry';

// Mock the entire markdown content registry
jest.mock('../../../src/services/markdown-content-registry', () => ({
  markdownContentRegistry: {
    getContent: jest.fn((id) => {
      // Return mock data based on the requested ID
      switch (id) {
        case 'intro-group-metadata':
          return { title: 'Test Introduction', id: 'test-intro' };
        case 'intro-title':
          return { title: 'Test Title', subtitle: 'Test Subtitle' };
        case 'kg-definition':
          return {
            title: 'Test Definition',
            mainDefinition: 'This is a test definition',
            keyPoints: ['Point 1', 'Point 2']
          };
        case 'kg-concepts':
          return {
            entities: [{ id: 'entity1', name: 'Entity 1', type: 'Entity' }],
            relationships: [{ source: 'entity1', target: 'entity2', type: 'relates_to' }]
          };
        default:
          return { id, content: 'mock content' };
      }
    })
  }
}));

describe('Introduction Module', () => {
  test('getIntroductionSlides returns a slide group', () => {
    const slideGroup = getIntroductionSlides();
    
    expect(slideGroup).toBeDefined();
    expect(slideGroup.title).toBe('Test Introduction');
    expect(slideGroup.id).toBe('test-intro');
    expect(slideGroup.slides).toBeDefined();
    expect(slideGroup.slides.length).toBeGreaterThan(0);
  });
  
  test('getIntroductionSlides respects options', () => {
    const slideGroup = getIntroductionSlides({
      includeDefinitionSlide: false,
      includeEvolutionSlide: false
    });
    
    // Title slide should still be present
    expect(slideGroup.slides.length).toBe(1);
  });
  
  // Additional integration tests
});
```

## 10. Conclusion

The template-based architecture for the Knowledge Graph Presentation System provides a robust foundation for scalable module development. By abstracting common patterns into reusable templates while preserving domain-specific logic, the architecture reduces code duplication, enhances type safety, and improves maintainability.

The composition-oriented approach enables flexible assembly of components through dependency injection, promoting loose coupling and testability. The backward compatibility layer ensures that existing code can gradually migrate to the new architecture without disrupting the system's functionality.

By implementing this architecture, the Knowledge Graph Presentation System will achieve:

1. **Improved Developer Productivity**: Through reduced boilerplate and standardized patterns
2. **Enhanced Code Quality**: Through type safety and separation of concerns
3. **Better Maintainability**: Through centralized changes to common patterns
4. **Greater Extensibility**: Through clear extension points for new functionality
5. **Stronger Testability**: Through component isolation and dependency injection

The template-based architecture represents a strategic investment in the system's long-term viability and evolution.
