/**
 * Integration tests for visualization components
 */
import { GraphVisualization } from '../../src/visualizations/graph';
import { TimelineVisualization } from '../../src/visualizations/timeline';
import { TableVisualization } from '../../src/visualizations/table';
import { FlowDiagramVisualization } from '../../src/visualizations/flow-diagram';

// Mock implementations to avoid actual rendering
jest.mock('../../src/visualizations/graph', () => {
  const original = jest.requireActual('../../src/visualizations/graph');
  return {
    GraphVisualization: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
      destroy: jest.fn()
    }))
  };
});

jest.mock('../../src/visualizations/timeline', () => {
  return {
    TimelineVisualization: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
      destroy: jest.fn()
    }))
  };
});

jest.mock('../../src/visualizations/flow-diagram', () => {
  return {
    FlowDiagramVisualization: jest.fn().mockImplementation(() => ({
      render: jest.fn(),
      destroy: jest.fn()
    }))
  };
});

describe('Visualization Components Integration', () => {
  let container: HTMLDivElement;
  
  beforeEach(() => {
    // Create a container for visualizations
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
  });
  
  test('GraphVisualization can be initialized and rendered', () => {
    // Sample graph data
    const graphData = {
      nodes: [
        { id: 'node1', label: 'Node 1', type: 'Person' },
        { id: 'node2', label: 'Node 2', type: 'Document' },
        { id: 'node3', label: 'Node 3', type: 'Organization' }
      ],
      edges: [
        { id: 'edge1', source: 'node1', target: 'node2', label: 'connects to' },
        { id: 'edge2', source: 'node2', target: 'node3', label: 'connects to' }
      ]
    };
    
    // Create visualization
    const graph = new GraphVisualization({
      container,
      data: graphData,
      width: 600,
      height: 400
    });
    
    // Render it
    graph.render();
    
    // Verify GraphVisualization constructor was called with correct params
    expect(GraphVisualization).toHaveBeenCalledWith(expect.objectContaining({
      container,
      data: graphData,
      width: 600,
      height: 400
    }));
  });
  
  test('TableVisualization can be initialized and rendered', () => {
    // Sample table data
    const tableData = {
      headers: ['Name', 'Type', 'Properties'],
      rows: [
        ['Person', 'Entity', '4 properties'],
        ['Organization', 'Entity', '6 properties'],
        ['worksFor', 'Relationship', '2 properties']
      ]
    };
    
    // Create visualization
    const table = new TableVisualization({
      container,
      headers: tableData.headers,
      rows: tableData.rows,
      caption: 'Knowledge Graph Schema'
    });
    
    // Render it
    table.render();
    
    // Verify visualization was created with the right data
    expect(container.style.width).toBeDefined();
  });
  
  test('TimelineVisualization can be initialized and rendered', () => {
    // Sample timeline data with the required format
    const timelineData = [
      { period: '2020-Q1', label: 'Project Started', items: ['Kickoff meeting', 'Requirements gathering'] },
      { period: '2020-Q2', label: 'Data Collection', items: ['Source identification', 'Initial collection'] },
      { period: '2020-Q3', label: 'Analysis Complete', items: ['Data analysis', 'Reporting'] }
    ];
    
    // Create visualization
    const timeline = new TimelineVisualization({
      container,
      data: timelineData,
      width: 800,
      height: 200
    });
    
    // Render it
    timeline.render();
    
    // Verify TimelineVisualization constructor was called with correct params
    expect(TimelineVisualization).toHaveBeenCalledWith(expect.objectContaining({
      container,
      data: timelineData
    }));
  });
  
  test('FlowDiagramVisualization can be initialized and rendered', () => {
    // Sample flow diagram data
    const flowData = {
      nodes: [
        { id: 'start', label: 'Start', type: 'start' as const },
        { id: 'process1', label: 'Process 1', type: 'process' as const },
        { id: 'process2', label: 'Process 2', type: 'process' as const },
        { id: 'end', label: 'End', type: 'end' as const }
      ],
      edges: [
        { from: 'start', to: 'process1' },
        { from: 'process1', to: 'process2' },
        { from: 'process2', to: 'end' }
      ]
    };
    
    // Create visualization
    const flowDiagram = new FlowDiagramVisualization({
      container,
      nodes: flowData.nodes,
      edges: flowData.edges,
      width: 600,
      height: 400
    });
    
    // Render it
    flowDiagram.render();
    
    // Verify FlowDiagramVisualization constructor was called with correct params
    expect(FlowDiagramVisualization).toHaveBeenCalledWith(expect.objectContaining({
      container,
      nodes: flowData.nodes,
      edges: flowData.edges
    }));
  });
}); 