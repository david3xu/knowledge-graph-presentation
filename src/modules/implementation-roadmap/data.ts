// src/modules/implementation-roadmap/data.ts
import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class ImplementationRoadmapDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Determine content type and delegate to specific transformer
    if (rawContent.phases || rawContent.implementationPhases) {
      return this.transformPhasesData(rawContent, options);
    } else if (rawContent.timeline || rawContent.roadmapTimeline) {
      return this.transformTimelineData(rawContent, options);
    } else if (rawContent.steps || rawContent.implementationSteps) {
      return this.transformStepsData(rawContent, options);
    } else if (rawContent.maturityLevels || rawContent.maturityModel) {
      return this.transformMaturityModelData(rawContent, options);
    }
    
    // Default transformation for general roadmap content
    return this.transformGeneralRoadmapData(rawContent, options);
  }
  
  private transformPhasesData(rawContent: any, options?: any): any {
    const phases = rawContent.phases || rawContent.implementationPhases || [];
    
    return {
      phases: phases.map((phase: any) => ({
        id: phase.id || `phase-${phase.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: phase.name,
        description: phase.description,
        duration: phase.duration,
        keyActivities: phase.activities || phase.keyActivities || [],
        deliverables: phase.deliverables || [],
        dependencies: phase.dependencies || [],
        risks: phase.risks || [],
        teamMembers: phase.teamMembers || []
      })),
      totalDuration: phases.reduce((sum: number, phase: any) => sum + (phase.duration || 0), 0),
      startDate: options?.startDate || rawContent.startDate || "Q1 2024",
      phaseConnections: rawContent.phaseConnections || this.inferPhaseConnections(phases),
      showDependencies: options?.showDependencies ?? true,
      showRisks: options?.showRisks ?? true
    };
  }
  
  private transformTimelineData(rawContent: any, options?: any): any {
    const timeline = rawContent.timeline || rawContent.roadmapTimeline || [];
    
    return {
      milestones: timeline.map((item: any) => ({
        id: item.id || `milestone-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: item.name,
        description: item.description,
        date: item.date,
        phaseId: item.phase || null,
        type: item.type || 'milestone',
        deliverables: item.deliverables || [],
        dependencies: item.dependencies || []
      })),
      startDate: options?.startDate || rawContent.startDate || timeline[0]?.date || "2024-01",
      endDate: options?.endDate || rawContent.endDate || timeline[timeline.length - 1]?.date || "2024-12",
      phases: rawContent.timelinePhases || [],
      showDependencies: options?.showDependencies ?? true,
      showDeliverables: options?.showDeliverables ?? true
    };
  }
  
  private transformStepsData(rawContent: any, options?: any): any {
    const steps = rawContent.steps || rawContent.implementationSteps || [];
    
    return {
      steps: steps.map((step: any, index: number) => ({
        id: step.id || `step-${index + 1}`,
        name: step.name,
        description: step.description,
        order: step.order || index + 1,
        duration: step.duration,
        prerequisites: step.prerequisites || [],
        activities: step.activities || [],
        tools: step.tools || [],
        outputs: step.outputs || []
      })),
      connections: rawContent.stepConnections || this.inferStepConnections(steps),
      flowDirection: options?.flowDirection || rawContent.flowDirection || 'TB', // Top to Bottom
      showDependencies: options?.showDependencies ?? true,
      highlightCriticalPath: options?.highlightCriticalPath ?? false
    };
  }
  
  private transformMaturityModelData(rawContent: any, options?: any): any {
    const levels = rawContent.maturityLevels || rawContent.maturityModel || [];
    
    return {
      levels: levels.map((level: any) => ({
        id: level.id || `level-${level.level}`,
        level: level.level,
        name: level.name,
        description: level.description,
        characteristics: level.characteristics || [],
        capabilities: level.capabilities || [],
        challenges: level.challenges || [],
        examples: level.examples || []
      })),
      dimensions: rawContent.dimensions || [],
      organization: rawContent.organization || null,
      currentLevel: options?.currentLevel || rawContent.currentLevel || 1,
      targetLevel: options?.targetLevel || rawContent.targetLevel || levels.length,
      showGaps: options?.showGaps ?? true,
      highlightCurrentLevel: options?.highlightCurrentLevel ?? true
    };
  }
  
  private transformGeneralRoadmapData(rawContent: any, options?: any): any {
    // Default transformation for roadmap content
    return {
      title: options?.title || rawContent.title || "Knowledge Graph Implementation Roadmap",
      description: options?.description || rawContent.description || "",
      overview: options?.overview || rawContent.overview || "",
      sections: rawContent.sections || [],
      recommendations: rawContent.recommendations || [],
      considerations: rawContent.considerations || [],
      critical_success_factors: rawContent.criticalSuccessFactors || rawContent.critical_success_factors || [],
      resources: rawContent.resources || [],
      showTimeline: options?.showTimeline ?? true,
      showMilestones: options?.showMilestones ?? true
    };
  }
  
  private inferPhaseConnections(phases: any[]): any[] {
    // Infer connections between phases (typically sequential)
    interface Connection {
      from: string;
      to: string;
      label: string;
    }
    
    const connections: Connection[] = [];
    
    for (let i = 0; i < phases.length - 1; i++) {
      connections.push({
        from: phases[i].id || `phase-${phases[i].name.toLowerCase().replace(/\s+/g, '-')}`,
        to: phases[i + 1].id || `phase-${phases[i + 1].name.toLowerCase().replace(/\s+/g, '-')}`,
        label: "follows"
      });
    }
    
    return connections;
  }
  
  private inferStepConnections(steps: any[]): any[] {
    // Infer connections between steps
    interface Connection {
      from: string;
      to: string;
      label: string;
    }
    
    const connections: Connection[] = [];
    const stepsById = new Map();
    
    // Create map of steps by id
    steps.forEach((step, index) => {
      const id = step.id || `step-${index + 1}`;
      stepsById.set(id, step);
    });
    
    // Create connections based on prerequisites
    steps.forEach((step, index) => {
      const stepId = step.id || `step-${index + 1}`;
      
      if (step.prerequisites && step.prerequisites.length > 0) {
        step.prerequisites.forEach((prereqId: string) => {
          if (stepsById.has(prereqId)) {
            connections.push({
              from: prereqId,
              to: stepId,
              label: "requires"
            });
          }
        });
      } else if (index > 0) {
        // If no prerequisites specified, assume sequential connection to previous step
        const prevStepId = steps[index - 1].id || `step-${index}`;
        connections.push({
          from: prevStepId,
          to: stepId,
          label: "followed by"
        });
      }
    });
    
    return connections;
  }
}