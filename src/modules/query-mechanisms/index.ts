import { BaseModuleTemplate } from '../../utils/templates/module-template';
import { SlideConfig, SlideGroup } from '../../types/slide-data';
import { QueryMechanismsDataTransformer } from './data';
import { QueryMechanismsConfigFactory } from './config';
import { QueryMechanismsSlideFactory } from './slides';

export interface QueryMechanismsOptions {
  includeLanguageComparison?: boolean;
  includeQueryPatterns?: boolean;
  includeQueryExamples?: boolean;
  includePerformance?: boolean;
  highlightLanguage?: string;
  focusOnPatterns?: string[];
  exampleLanguages?: string[];
}

export class QueryMechanismsModule extends BaseModuleTemplate<QueryMechanismsOptions> {
  protected dataTransformer: QueryMechanismsDataTransformer;
  protected configFactory: QueryMechanismsConfigFactory;
  protected slideFactory: QueryMechanismsSlideFactory;
  
  constructor(
    dataTransformer: QueryMechanismsDataTransformer,
    configFactory: QueryMechanismsConfigFactory,
    slideFactory: QueryMechanismsSlideFactory
  ) {
    super(dataTransformer, configFactory, slideFactory);
    this.dataTransformer = dataTransformer;
    this.configFactory = configFactory;
    this.slideFactory = slideFactory;
  }
  
  public createSlides(options: QueryMechanismsOptions = {}): SlideGroup {
    // Get module metadata
    const groupMetadata = this.getModuleMetadata('query-mechanisms-metadata');
    
    // Initialize slides array
    const slides: SlideConfig[] = [];
    
    // Create query overview slide
    const overviewContent = this.dataTransformer.transformContent('query-overview');
    slides.push(this.slideFactory.createDomainSlide(
      'query-overview', 
      overviewContent,
      {
        notes: 'Introduce the importance of query mechanisms for accessing and extracting knowledge from knowledge graphs.'
      }
    ));
    
    // Conditionally add query languages comparison slide
    if (options.includeLanguageComparison !== false) {
      const languagesContent = this.dataTransformer.transformContent('query-languages-comparison');
      
      const comparisonConfig = this.configFactory.createConfig(
        'query-languages-comparison',
        languagesContent,
        { highlightLanguage: options.highlightLanguage }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'query-languages', 
        languagesContent, 
        { 
          visualizationConfig: comparisonConfig,
          notes: 'Compare the syntax, capabilities, and use cases of different query languages.'
        }
      ));
    }
    
    // Conditionally add query patterns slides
    if (options.includeQueryPatterns) {
      const patternsContent = this.dataTransformer.transformContent('query-patterns');
      
      // Filter patterns based on options
      const patterns = options.focusOnPatterns?.length ? 
        patternsContent.patterns.filter((p: any) => options.focusOnPatterns!.includes(p.name)) :
        patternsContent.patterns;
      
      // Create slides for each pattern or a single overview slide
      if (patterns.length <= 1 || !options.focusOnPatterns) {
        // Create a single patterns overview slide
        const patternDiagramConfig = this.configFactory.createConfig(
          'query-pattern-diagram',
          patternsContent
        );
        
        slides.push(this.slideFactory.createDomainSlide(
          'query-patterns', 
          { description: 'Common query patterns for knowledge graphs' }, 
          { 
            visualizationConfig: patternDiagramConfig,
            notes: 'Explain common query patterns used with knowledge graphs.'
          }
        ));
      } else {
        // Create individual slides for each selected pattern
        patterns.forEach((pattern: any) => {
          const patternDiagramConfig = this.configFactory.createConfig(
            'query-pattern-diagram',
            { pattern }
          );
          
          slides.push(this.slideFactory.createDomainSlide(
            'query-patterns', 
            { pattern }, 
            { 
              visualizationConfig: patternDiagramConfig,
              notes: `Explain the ${pattern.name} query pattern and its applications.`
            }
          ));
        });
      }
    }
    
    // Conditionally add query examples slides
    if (options.includeQueryExamples) {
      const examplesContent = this.dataTransformer.transformContent('query-examples');
      
      // Filter examples based on options
      const examples = options.exampleLanguages?.length ? 
        examplesContent.examples.filter((e: any) => options.exampleLanguages!.includes(e.language)) :
        examplesContent.examples;
      
      examples.forEach((example: any) => {
        // Create result graph visualization if available
        const resultGraphConfig = example.graphData ? 
          this.configFactory.createConfig(
            'query-result-graph',
            { graphData: example.graphData },
            { focusOnResults: true }
          ) : null;
        
        slides.push(this.slideFactory.createDomainSlide(
          'query-examples', 
          { example }, 
          { 
            visualizationConfig: resultGraphConfig,
            notes: `Walk through this ${example.language} query example and explain its result.`
          }
        ));
      });
    }
    
    // Conditionally add query performance slide
    if (options.includePerformance) {
      const performanceContent = this.dataTransformer.transformContent('query-performance');
      
      const performanceChartConfig = this.configFactory.createConfig(
        'performance-chart',
        performanceContent.chartData,
        { 
          chartType: 'bar',
          xAxisLabel: 'Query Type',
          yAxisLabel: 'Execution Time (ms)'
        }
      );
      
      slides.push(this.slideFactory.createDomainSlide(
        'query-performance', 
        performanceContent, 
        { 
          visualizationConfig: performanceChartConfig,
          notes: 'Discuss performance considerations and optimization techniques for knowledge graph queries.'
        }
      ));
    }
    
    // Create and return slide group
    return this.slideFactory.createSlideGroup(
      groupMetadata.title || 'Knowledge Graph Query Mechanisms',
      groupMetadata.id || 'query-mechanisms',
      slides,
      {
        includeSectionSlide: true,
        classes: groupMetadata.classes || ['query-mechanisms-section']
      }
    );
  }
}

// Factory function for backward compatibility
export function getQueryMechanismsSlides(options: QueryMechanismsOptions = {}): SlideGroup {
  const dataTransformer = new QueryMechanismsDataTransformer();
  const configFactory = new QueryMechanismsConfigFactory();
  const slideFactory = new QueryMechanismsSlideFactory();
  
  const module = new QueryMechanismsModule(dataTransformer, configFactory, slideFactory);
  return module.createSlides(options);
}