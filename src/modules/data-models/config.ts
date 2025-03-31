import { BaseConfigFactory } from '../../utils/templates/config-factory';

export class DataModelsConfigFactory extends BaseConfigFactory {
  protected createDomainSpecificConfig(
    visualizationType: string, 
    data: any, 
    options?: any
  ): any {
    switch (visualizationType) {
      case 'rdf-triple':
        return this.createRdfTripleConfig(data, options);
      case 'property-graph':
        return this.createPropertyGraphConfig(data, options);
      case 'comparison-table':
        return this.createComparisonTableConfig(data, options);
      case 'code-block':
        return this.createCodeBlockConfig(data, options);
      default:
        return {};
    }
  }
  
  private createRdfTripleConfig(_data: any, options?: any): any {
    // Configure RDF triple visualization
    return {
      nodeStyle: {
        subject: {
          shape: 'circle',
          color: '#4C9AFF',
          size: 40,
          labelColor: '#172B4D'
        },
        predicate: {
          shape: 'diamond',
          color: '#FF8F73',
          size: 30,
          labelColor: '#172B4D'
        },
        object: {
          shape: 'rectangle',
          color: '#36B37E',
          size: 40,
          labelColor: '#172B4D'
        }
      },
      edgeStyle: {
        width: 2,
        color: '#6B778C',
        arrow: true,
        labelPosition: 'center',
        labelColor: '#172B4D',
        labelBackgroundColor: '#F4F5F7'
      },
      layout: 'horizontal',
      showTriplePattern: options?.showTriplePattern !== false,
      highlightPattern: options?.highlightPattern || false
    };
  }
  
  private createPropertyGraphConfig(_data: any, options?: any): any {
    // Configure property graph visualization
    return {
      nodeStyle: {
        shape: 'circle',
        color: '#4C9AFF',
        borderColor: '#0747A6',
        size: 50,
        labelColor: '#172B4D',
        propertyDisplay: options?.showProperties !== false
      },
      edgeStyle: {
        width: 2,
        color: '#6B778C',
        arrow: true,
        labelPosition: 'center',
        labelColor: '#172B4D',
        labelBackgroundColor: '#F4F5F7',
        propertyDisplay: options?.showEdgeProperties !== false
      },
      layout: 'force',
      expandProperties: options?.expandProperties || false,
      nodeLabelProperty: options?.nodeLabelProperty || 'name',
      edgeLabelProperty: options?.edgeLabelProperty || 'type'
    };
  }
  
  private createComparisonTableConfig(_data: any, options?: any): any {
    // Configure comparison table visualization
    return {
      headers: _data.comparisonTable?.headers || [],
      headerStyle: {
        backgroundColor: '#172B4D',
        color: '#FFFFFF',
        fontWeight: 'bold',
        align: 'center'
      },
      rowStyle: {
        evenRowColor: '#F4F5F7',
        oddRowColor: '#FFFFFF',
        hoverColor: '#E6EFFC'
      },
      highlightCells: _data.highlightedDifferences?.map((diff: any) => ({
        row: diff.row,
        col: diff.col,
        color: '#FFBDAD'
      })) || [],
      sortable: options?.sortable !== false,
      filterable: options?.filterable || false,
      pagination: options?.pagination || false,
      responsive: true
    };
  }
  
  private createCodeBlockConfig(_data: any, options?: any): any {
    // Configure code block visualization
    return {
      language: options?.language || 'text',
      theme: options?.theme || 'dark',
      showLineNumbers: options?.showLineNumbers !== false,
      highlightLines: options?.highlightLines || [],
      fontSize: options?.fontSize || 14,
      fontFamily: '"Fira Code", Consolas, Monaco, "Andale Mono", monospace',
      maxHeight: options?.maxHeight || 400,
      wrap: options?.wrap || false
    };
  }
}