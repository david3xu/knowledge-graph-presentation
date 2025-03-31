/**
 * Knowledge Graph Presentation System
 * 
 * Entry point for the application that initializes all components,
 * loads content, and renders the presentation.
 */

// Import core services
import { MarkdownLoader } from './parser/markdown-loader';
import { EnhancedMarkdownParser } from './parser/enhanced-markdown-parser';
import { markdownContentRegistry } from './services/markdown-content-registry';
import { PresentationBuilder } from './services/presentation-builder';
import { PresentationManager } from './services/presentation-manager';
import { SlideManager } from './services/slide-manager';
import { exportService } from './services/export-service';

// Import modules (factory functions)
import { getIntroductionSlides } from './modules/intro';
import { getCoreComponentsSlides } from './modules/core-components';
import { getDataModelsSlides } from './modules/data-models';
import { getArchitectureSlides } from './modules/architecture';
import { getComparativeAnalysisSlides } from './modules/comparative-analysis';
import { getConstructionSlides } from './modules/construction';
import { getQueryMechanismsSlides } from './modules/query-mechanisms';
import { getRCASlides } from './modules/root-cause-analysis';
import { getIndustryApplicationsSlides } from './modules/industry-applications';
import { getImplementationRoadmapSlides } from './modules/implementation-roadmap';
import { getFutureDirectionsSlides } from './modules/future-directions';
import { getResourcesSlides } from './modules/resources';

// Import types
import { PresentationConfig } from './types/slide-data';
import { PresenterInfo } from './services/presentation-builder';

// Import configuration
import { DEFAULT_THEME, DEFAULT_TRANSITION } from './config/presentation-defaults';

/**
 * Initialize the Knowledge Graph Presentation System
 * @param contentPath Path to the markdown content file
 * @param container DOM element to contain the presentation
 * @param options Additional configuration options
 */
export async function initKnowledgeGraphPresentation(
  contentPath: string,
  container: HTMLElement,
  options: {
    isAdvancedAudience?: boolean;
    customTheme?: string;
    presenter?: PresenterInfo;
    title?: string;
  } = {}
): Promise<PresentationManager> {
  // Initialize services
  const markdownLoader = new MarkdownLoader();
  const markdownParser = new EnhancedMarkdownParser();
  
  // Load and parse markdown content
  try {
    console.log(`Loading content from ${contentPath}...`);
    const markdownContent = await markdownLoader.loadMarkdown(contentPath);
    console.log(`Content loaded successfully (${markdownContent.length} characters)`);
    
    const parsedContent = markdownParser.parse(markdownContent);
    console.log('Content parsed successfully');
    
    // Register content fragments
    console.log('Registering content fragments...');
    registerContentFragments(parsedContent);
    
    // Build presentation configuration
    console.log('Building presentation configuration...');
    const presentationConfig = buildPresentationConfig(options);
    
    // Initialize presentation manager
    console.log('Initializing presentation manager...');
    const slideManager = new SlideManager({ container });
    const presentationManager = new PresentationManager();
    presentationManager.setSlideManager(slideManager);
    presentationManager.loadPresentationFromConfig(presentationConfig);
    
    return presentationManager;
  } catch (error) {
    console.error('Failed to initialize presentation:', error);
    throw error;
  }
}

/**
 * Register content fragments in the registry
 * @param parsedContent Parsed markdown content
 */
function registerContentFragments(parsedContent: any): void {
  if (!parsedContent) {
    throw new Error('Parsed content is undefined');
  }

  // Register title and metadata
  if (parsedContent.title) {
    markdownContentRegistry.registerContent('presentation-title', parsedContent.title);
  } else {
    markdownContentRegistry.registerContent('presentation-title', 'Knowledge Graph Presentation');
  }
  
  // Create module metadata objects
  const introMetadata = { id: 'intro', title: 'Introduction to Knowledge Graphs', classes: ['intro-section'] };
  const coreComponentsMetadata = { id: 'core-components', title: 'Core Components', classes: ['components-section'] };
  const dataModelsMetadata = { id: 'data-models', title: 'Data Models', classes: ['models-section'] };
  
  // Register module metadata
  markdownContentRegistry.registerContent('intro-group-metadata', introMetadata);
  markdownContentRegistry.registerContent('core-components-metadata', coreComponentsMetadata);
  markdownContentRegistry.registerContent('data-models-metadata', dataModelsMetadata);
  
  // Default intro content if not found
  markdownContentRegistry.registerContent('intro-title', 'Introduction to Knowledge Graphs');
  markdownContentRegistry.registerContent('intro-definition', 'A knowledge graph is a structured representation of information that models real-world entities and their relationships in a graph format.');
  markdownContentRegistry.registerContent('concept-graph-data', { 
    nodes: [
      { id: 'entities', label: 'Entities' },
      { id: 'relationships', label: 'Relationships' },
      { id: 'properties', label: 'Properties' }
    ]
  });
  markdownContentRegistry.registerContent('kg-evolution', 'Evolution of knowledge graph technology');
  markdownContentRegistry.registerContent('evolution-timeline-data', { 
    events: [
      { year: 2012, event: 'Google Knowledge Graph introduced' },
      { year: 2015, event: 'Schema.org adoption increases' },
      { year: 2018, event: 'Enterprise knowledge graphs emerge' }
    ]
  });
  
  // Default core components content
  markdownContentRegistry.registerContent('kg-components-overview', 'Knowledge graphs consist of three fundamental elements');
  markdownContentRegistry.registerContent('kg-components-graph', {
    nodes: [
      { id: 'entity', label: 'Entity' },
      { id: 'relationship', label: 'Relationship' },
      { id: 'property', label: 'Property' }
    ],
    edges: [
      { source: 'entity', target: 'relationship', label: 'connects through' },
      { source: 'entity', target: 'property', label: 'has' },
      { source: 'relationship', target: 'property', label: 'has' }
    ]
  });
  markdownContentRegistry.registerContent('kg-entity-types', 'Objects, concepts, or events with unique identities');
  markdownContentRegistry.registerContent('kg-entity-hierarchy', {
    root: { id: 'thing', label: 'Thing' },
    children: [
      { id: 'person', label: 'Person' },
      { id: 'place', label: 'Place' },
      { id: 'organization', label: 'Organization' }
    ]
  });
  markdownContentRegistry.registerContent('kg-relationship-types', 'Directed, typed connections between entities');
  markdownContentRegistry.registerContent('kg-relationship-examples', {
    examples: [
      { source: 'Person', relationship: 'WORKS_FOR', target: 'Organization' },
      { source: 'Person', relationship: 'KNOWS', target: 'Person' },
      { source: 'Organization', relationship: 'LOCATED_IN', target: 'Place' }
    ]
  });
  markdownContentRegistry.registerContent('kg-properties', 'Key-value pairs that describe characteristics of entities and relationships');
  markdownContentRegistry.registerContent('kg-property-examples', {
    examples: [
      { entity: 'Person', properties: ['name', 'age', 'email'] },
      { entity: 'Organization', properties: ['name', 'founded', 'industry'] }
    ]
  });
  
  // Default data models content
  markdownContentRegistry.registerContent('kg-data-models-overview', 'Knowledge graphs can be implemented using different data models');
  markdownContentRegistry.registerContent('kg-rdf-model', 'The RDF model represents data as triples (subject, predicate, object)');
  markdownContentRegistry.registerContent('kg-rdf-example', {
    triples: [
      { subject: 'Person1', predicate: 'name', object: 'John Doe' },
      { subject: 'Person1', predicate: 'worksFor', object: 'Company1' },
      { subject: 'Company1', predicate: 'name', object: 'ACME Inc' }
    ]
  });
  markdownContentRegistry.registerContent('kg-property-graph-model', 'Property graphs use labeled nodes and edges with properties');
  markdownContentRegistry.registerContent('kg-property-graph-example', {
    nodes: [
      { id: 'p1', label: 'Person', properties: { name: 'John Doe' } },
      { id: 'c1', label: 'Company', properties: { name: 'ACME Inc' } }
    ],
    edges: [
      { source: 'p1', target: 'c1', label: 'WORKS_FOR', properties: { since: '2020' } }
    ]
  });
  markdownContentRegistry.registerContent('kg-model-comparison', 'Comparison between RDF and Property Graph models');
  markdownContentRegistry.registerContent('kg-model-examples', {
    examples: [
      {
        title: 'RDF Example',
        language: 'turtle',
        code: '@prefix ex: <http://example.org/> .\nex:Person1 ex:name "John Doe" .\nex:Person1 ex:worksFor ex:Company1 .\nex:Company1 ex:name "ACME Inc" .',
        highlights: [2, 3]
      },
      {
        title: 'Property Graph Example',
        language: 'cypher',
        code: 'CREATE (p:Person {name: "John Doe"})-[:WORKS_FOR {since: 2020}]->(c:Company {name: "ACME Inc"})',
        highlights: [1]
      }
    ]
  });
  
  // Register section content by ID
  if (parsedContent.sections && Array.isArray(parsedContent.sections)) {
    parsedContent.sections.forEach((section: any) => {
      // Map section titles to content IDs, removing "Slide X:" prefix
      const sectionId = section.title
        .replace(/^Slide \d+:\s*/, '')
        .toLowerCase()
        .replace(/\s+/g, '-');
      
      // Register main section content
      markdownContentRegistry.registerContent(sectionId, section.content);
      
      // Extract and register content by type
      extractAndRegisterContentByType(sectionId, section.content);
      
      // Special handling for introduction section
      if (sectionId === 'introduction-to-knowledge-graphs') {
        // Extract definition from bold text
        const definitionMatch = section.content.match(/\*\*Definition\*\*: (.*?)(?:\n|$)/);
        if (definitionMatch) {
          markdownContentRegistry.registerContent('intro-definition', definitionMatch[1]);
        }
        
        // Extract key points for concept graph
        const keyPoints = section.content.match(/Key differentiators:([\s\S]*?)(?=\n\n|$)/);
        if (keyPoints) {
          markdownContentRegistry.registerContent('concept-graph-data', {
            nodes: keyPoints[1].split('\n').map((point: string) => point.trim()).filter((point: string) => point.startsWith('-'))
              .map((point: string) => ({ id: point.slice(2), label: point.slice(2) }))
          });
        }
      }
      
      // Special handling for core components section
      if (sectionId === 'core-components') {
        markdownContentRegistry.registerContent('kg-components-overview', section.content);
        
        // Extract entity types
        const entityTypesMatch = section.content.match(/1\. \*\*Entities \(Nodes\)\*\*: (.*?)(?=\n|$)/);
        if (entityTypesMatch) {
          markdownContentRegistry.registerContent('kg-entity-types', entityTypesMatch[1]);
        }
        
        // Extract relationship types
        const relationshipTypesMatch = section.content.match(/2\. \*\*Relationships \(Edges\)\*\*: (.*?)(?=\n|$)/);
        if (relationshipTypesMatch) {
          markdownContentRegistry.registerContent('kg-relationship-types', relationshipTypesMatch[1]);
        }
        
        // Extract properties
        const propertiesMatch = section.content.match(/3\. \*\*Properties \(Attributes\)\*\*: (.*?)(?=\n|$)/);
        if (propertiesMatch) {
          markdownContentRegistry.registerContent('kg-properties', propertiesMatch[1]);
        }
      }
      
      // Special handling for data models section
      if (sectionId === 'data-models-comparison') {
        markdownContentRegistry.registerContent('kg-data-models-overview', section.content);
        
        // Extract RDF model content
        const rdfMatch = section.content.match(/\*\*RDF Model\*\*:([\s\S]*?)(?=\n\n|$)/);
        if (rdfMatch) {
          markdownContentRegistry.registerContent('kg-rdf-model', rdfMatch[1]);
        }
        
        // Extract property graph model content
        const propertyGraphMatch = section.content.match(/\*\*Property Graph Model\*\*:([\s\S]*?)(?=\n\n|$)/);
        if (propertyGraphMatch) {
          markdownContentRegistry.registerContent('kg-property-graph-model', propertyGraphMatch[1]);
        }
      }
    });
  }
}

/**
 * Extract and register content by type pattern recognition
 * @param sectionId Section identifier
 * @param content Section content
 */
function extractAndRegisterContentByType(sectionId: string, content: any): void {
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  
  // Extract and register code blocks
  const codeBlocks = extractCodeBlocks(contentStr);
  if (codeBlocks.length > 0) {
    markdownContentRegistry.registerContent(`${sectionId}-code-blocks`, codeBlocks);
  }
  
  // Extract and register tables
  const tables = extractTables(contentStr);
  if (tables.length > 0) {
    markdownContentRegistry.registerContent(`${sectionId}-tables`, tables);
  }
  
  // Extract and register diagrams
  const diagrams = extractDiagrams(contentStr);
  if (diagrams.length > 0) {
    markdownContentRegistry.registerContent(`${sectionId}-diagrams`, diagrams);
  }
  
  // Extract and register knowledge graph specific content
  if (contentStr.includes('entities') && contentStr.includes('relationships')) {
    const graphData = extractGraphData(contentStr);
    markdownContentRegistry.registerContent(`${sectionId}-graph-data`, graphData);
  }
}

/**
 * Extract code blocks from content
 * @param content Content string
 * @returns Array of code blocks
 */
function extractCodeBlocks(content: string): any[] {
  const blocks: any[] = [];
  const regex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2]
    });
  }
  
  return blocks;
}

/**
 * Extract tables from content
 * @param content Content string
 * @returns Array of tables
 */
function extractTables(content: string): any[] {
  const tables: any[] = [];
  const tableRegex = /\|([^\n]*)\|\n\|([-:\s|]*)\|\n((?:\|[^\n]*\|\n)+)/g;
  let match;
  
  while ((match = tableRegex.exec(content)) !== null) {
    const headerRow = match[1].split('|').map(cell => cell.trim()).filter(cell => cell);
    const alignmentRow = match[2];
    const bodyRows = match[3].split('\n').filter(row => row.trim());
    
    const columns = headerRow.map((header, index) => {
      const alignMatch = alignmentRow.split('|')[index+1];
      let align = 'left';
      if (alignMatch) {
        if (alignMatch.startsWith(':') && alignMatch.endsWith(':')) align = 'center';
        else if (alignMatch.endsWith(':')) align = 'right';
      }
      return { header, align };
    });
    
    const rows = bodyRows.map(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      return cells;
    });
    
    tables.push({ columns, rows });
  }
  
  return tables;
}

/**
 * Extract diagrams from content
 * @param content Content string
 * @returns Array of diagrams
 */
function extractDiagrams(content: string): any[] {
  const diagrams: any[] = [];
  
  // ASCII diagrams
  const asciiRegex = /(┌─+┐[\s\S]*?└─+┘)/g;
  let asciiMatch;
  
  while ((asciiMatch = asciiRegex.exec(content)) !== null) {
    diagrams.push({
      type: 'ascii',
      content: asciiMatch[1]
    });
  }
  
  // Flow diagrams with arrows
  const flowRegex = /(?:^|\n)(.+?)\s*(-+>|→)\s*(.+?)(?:\n|$)/gm;
  let flowMatch;
  
  while ((flowMatch = flowRegex.exec(content)) !== null) {
    diagrams.push({
      type: 'flow',
      source: flowMatch[1].trim(),
      target: flowMatch[3].trim(),
      relationship: 'flow'
    });
  }
  
  return diagrams;
}

/**
 * Extract graph data from content
 * @param content Content string
 * @returns Structured graph data
 */
function extractGraphData(content: string): any {
  // This is a simplified implementation
  // In a real implementation, this would parse the content to extract
  // entities and relationships in a structured format
  
  try {
    // Try to find entities and relationships sections
    const entitiesMatch = content.match(/entities:\s*\[([^\]]*)\]/);
    const relationshipsMatch = content.match(/relationships:\s*\[([^\]]*)\]/);
    
    const entities = entitiesMatch ? JSON.parse(`[${entitiesMatch[1]}]`) : [];
    const relationships = relationshipsMatch ? JSON.parse(`[${relationshipsMatch[1]}]`) : [];
    
    return { entities, relationships };
  } catch (error) {
    console.warn('Failed to parse graph data:', error);
    return { entities: [], relationships: [] };
  }
}

/**
 * Build presentation configuration
 * @param options Configuration options
 * @returns Presentation configuration
 */
function buildPresentationConfig(options: any): PresentationConfig {
  const isAdvancedAudience = options.isAdvancedAudience || false;
  const title = options.title || (markdownContentRegistry.hasContent('presentation-title') ? markdownContentRegistry.getContent('presentation-title') : 'Knowledge Graph Presentation');
  
  return new PresentationBuilder()
    .setTitle(title)
    .setPresenter(options.presenter || {
      name: 'Knowledge Graph Expert',
      title: 'Knowledge Graph Architect',
      organization: 'Graph Technologies Inc.'
    })
    // Add module content with runtime options
    .addModuleContent(() => getIntroductionSlides({ 
      highlightTerms: ['knowledge graph', 'semantic web', 'ontology']
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
      includeLayerDetails: isAdvancedAudience
    }))
    .addModuleContent(() => getComparativeAnalysisSlides({
      includeUseCaseComparison: isAdvancedAudience
    }))
    .addModuleContent(() => getConstructionSlides({
      includeExtractionMethods: true
    }))
    .addModuleContent(() => getQueryMechanismsSlides({
      includeQueryExamples: isAdvancedAudience
    }))
    .addModuleContent(() => getRCASlides({
      includeMethodology: isAdvancedAudience
    }))
    .addModuleContent(() => getIndustryApplicationsSlides({
      includeCaseStudies: isAdvancedAudience
    }))
    .addModuleContent(() => getImplementationRoadmapSlides({
      includeTimeline: true
    }))
    .addModuleContent(() => getFutureDirectionsSlides({
      includeTrends: isAdvancedAudience
    }))
    .addModuleContent(() => getResourcesSlides({
      includeLearningResources: isAdvancedAudience
    }))
    // Update settings
    .updateSettings({
      theme: options.customTheme || DEFAULT_THEME,
      defaultTransition: DEFAULT_TRANSITION,
      showSlideNumber: 'all',
      progress: true,
      controls: true,
      center: true
    })
    .build();
}

/**
 * Auto-initialize presentation if loaded in a browser environment
 */
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', async () => {
    const presentationContainer = document.getElementById('presentation-container');
    
    // Get content path from data attribute or use the content path
    const contentPath = presentationContainer?.getAttribute('data-content-path') || 'public/content/knowledge-graph.md';
    
    if (presentationContainer) {
      try {
        console.log(`Initializing presentation with content: ${contentPath}`);
        
        // Update the container to show loading status
        presentationContainer.innerHTML = `<div class="loading-container">Loading presentation content...</div>`;
        
        await initKnowledgeGraphPresentation(
          contentPath,
          presentationContainer,
          {
            isAdvancedAudience: presentationContainer.hasAttribute('data-advanced-audience'),
            customTheme: presentationContainer.getAttribute('data-theme') || undefined
          }
        );
        console.log('Knowledge Graph Presentation initialized successfully');
      } catch (error) {
        console.error('Failed to auto-initialize presentation:', error);
        
        // Show more detailed error and help information
        presentationContainer.innerHTML = `
          <div class="error-container">
            <h2>Failed to initialize presentation</h2>
            <p>${error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <div class="error-details">
              <p>Please check that the file exists at: <code>${contentPath}</code></p>
              <p>Browser is looking for this file at: <code>${window.location.origin}/${contentPath}</code></p>
              <p>Common solutions:</p>
              <ul>
                <li>Create the directory structure: <code>public/content/</code></li>
                <li>Add content to: <code>public/content/knowledge-graph.md</code></li>
                <li>Restart the development server</li>
              </ul>
            </div>
          </div>
        `;
      }
    } else {
      console.warn('No presentation container element found with id "presentation-container"');
    }
  });
}

// Export key components for external usage
export {
  PresentationBuilder,
  PresentationManager,
  SlideManager,
  exportService,
  markdownContentRegistry,
  MarkdownLoader,
  EnhancedMarkdownParser
};

// Export module factory functions
export {
  getIntroductionSlides,
  getCoreComponentsSlides,
  getDataModelsSlides,
  getArchitectureSlides,
  getComparativeAnalysisSlides,
  getConstructionSlides,
  getQueryMechanismsSlides,
  getRCASlides,
  getIndustryApplicationsSlides,
  getImplementationRoadmapSlides,
  getFutureDirectionsSlides,
  getResourcesSlides
};