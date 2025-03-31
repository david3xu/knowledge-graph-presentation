// src/visualizations/index.ts

import { CausalGraphVisualization } from './causal-graph';
import { ComparisonChartVisualization } from './comparison-chart';
import { FlowDiagramVisualization } from './flow-diagram';
import { GraphVisualization } from './graph';
import { NetworkDiagramVisualization } from './network-diagram';
import { ProcessFlowVisualization } from './process-flow';
import { RadarChartVisualization } from './radar-chart';
import { TableVisualization } from './table';
import { TimelineVisualization } from './timeline';
import { TreeDiagramVisualization } from './tree-diagram';
import { CodeBlockVisualization } from './code-block';
// Export visualization classes
export { GraphVisualization } from './graph';
export { TimelineVisualization } from './timeline';
export { TableVisualization } from './table';
export { FlowDiagramVisualization } from './flow-diagram';
export { ComparisonChartVisualization } from './comparison-chart';
export { RadarChartVisualization } from './radar-chart';
export { NetworkDiagramVisualization } from './network-diagram';
export { CausalGraphVisualization } from './causal-graph';
export { ProcessFlowVisualization } from './process-flow';
export { TreeDiagramVisualization } from './tree-diagram';
export { CodeBlockVisualization } from './code-block';

// Re-export common interfaces and types that might be used by consumers
// This provides a cleaner API for visualization consumers
export type {
  GraphData,
  GraphNode,
  GraphEdge,
  NodeStyle,
  EdgeStyle
} from '../types/graph-data';

export type {
  GraphVisualizationOptions,
  TableVisualizationOptions,
  TimelineVisualizationOptions,
  FlowDiagramVisualizationOptions,
  BaseVisualizationConfig
} from '../types/chart-config';

// You might also want to export factory functions for creating visualizations
export const createVisualization = (
  type: string,
  container: HTMLElement,
  data: any,
  options?: any
): any => {
  switch (type) {
    case 'graph':
      return new GraphVisualization({ container, data, ...options });
    case 'timeline':
      return new TimelineVisualization({ container, data, ...options });
    case 'table':
      return new TableVisualization({ container, data, ...options });
    case 'flow-diagram':
      return new FlowDiagramVisualization({ container, data, ...options });
    case 'comparison-chart':
      return new ComparisonChartVisualization({ container, data, ...options });
    case 'radar-chart':
      return new RadarChartVisualization({ container, data, ...options });
    case 'network-diagram':
      return new NetworkDiagramVisualization({ container, data, ...options });
    case 'causal-graph':
      return new CausalGraphVisualization({ container, data, ...options });
    case 'process-flow':
      return new ProcessFlowVisualization({ container, data, ...options });
    case 'tree-diagram':
      return new TreeDiagramVisualization({ container, data, ...options });
    case 'code-block':
      return new CodeBlockVisualization({ container, data, ...options });
    default:
      throw new Error(`Unsupported visualization type: ${type}`);
  }
};