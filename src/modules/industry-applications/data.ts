import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class IndustryApplicationsDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Route to specific transformation methods based on content
    if (rawContent.industryMatrix) {
      return this.transformIndustryMatrixData(rawContent, options);
    } else if (rawContent.useCases) {
      return this.transformUseCasesData(rawContent, options);
    } else if (rawContent.industryDetails) {
      return this.transformIndustryDetailsData(rawContent, options);
    } else if (rawContent.caseStudy) {
      return this.transformCaseStudyData(rawContent, options);
    } else if (rawContent.metrics) {
      return this.transformMetricsData(rawContent, options);
    }
    
    // Return normalized content for standard slides
    return this.normalizeIndustryContent(rawContent);
  }
  
  /**
   * Transforms industry matrix data for comparison visualization
   */
  private transformIndustryMatrixData(rawContent: any, options?: any): any {
    const industries = rawContent.industryMatrix.industries;
    const capabilities = rawContent.industryMatrix.capabilities;
    
    // Prepare matrix data for heatmap/table visualization
    const headers = ['Capability', ...industries.map((i: any) => i.name)];
    const rows = capabilities.map((capability: any) => {
      const row: Record<string, any> = {
        'Capability': capability.name
      };
      
      // Add value for each industry
      industries.forEach((industry: any) => {
        const match = capability.industryRelevance.find((rel: any) => 
          rel.industry === industry.name);
        
        row[industry.name] = match ? match.value : 0;
      });
      
      return row;
    });
    
    return {
      title: rawContent.title || 'Industry Applications Matrix',
      description: rawContent.description || 'Knowledge graph capabilities across industries',
      headers,
      rows,
      industries: industries.map((i: any) => ({
        name: i.name,
        color: i.color,
        icon: i.icon
      })),
      capabilities: capabilities.map((c: any) => ({
        name: c.name,
        description: c.description
      }))
    };
  }
  
  /**
   * Transforms use cases data by industry
   */
  private transformUseCasesData(rawContent: any, options?: any): any {
    // Group use cases by industry
    const useCasesByIndustry = rawContent.useCases.reduce((acc: any, useCase: any) => {
      if (!acc[useCase.industry]) {
        acc[useCase.industry] = [];
      }
      acc[useCase.industry].push(useCase);
      return acc;
    }, {});
    
    // Format for tree or bubble visualization
    const industryData = Object.entries(useCasesByIndustry).map(([industry, cases]) => ({
      name: industry,
      children: (cases as any[]).map((c: any) => ({
        name: c.name,
        value: c.impact || 1,
        description: c.description,
        benefits: c.benefits,
        challenges: c.challenges
      }))
    }));
    
    return {
      title: rawContent.title || 'Knowledge Graph Use Cases by Industry',
      description: rawContent.description || 'Common applications of knowledge graphs across sectors',
      industryData,
      selectedIndustry: options?.industry
    };
  }
  
  /**
   * Transforms industry-specific details
   */
  private transformIndustryDetailsData(rawContent: any, options?: any): any {
    // Filter for specific industry if requested
    const industry = options?.industry ? 
      rawContent.industryDetails.find((ind: any) => ind.name === options.industry) : 
      rawContent.industryDetails[0];
    
    if (!industry) {
      return this.handleTransformationError(
        new Error(`Industry '${options?.industry}' not found`),
        'industry-details'
      );
    }
    
    // Extract key metrics for visualization
    const metrics = industry.metrics ? industry.metrics.map((metric: any) => ({
      name: metric.name,
      value: metric.value,
      unit: metric.unit,
      description: metric.description
    })) : [];
    
    return {
      title: `Knowledge Graphs in ${industry.name}`,
      description: industry.description,
      challenges: industry.challenges || [],
      opportunities: industry.opportunities || [],
      keyApplications: industry.keyApplications || [],
      beneficiaries: industry.beneficiaries || [],
      dataIntegration: industry.dataIntegration || [],
      metrics,
      architecture: industry.architecture
    };
  }
  
  /**
   * Transforms case study data
   */
  private transformCaseStudyData(rawContent: any, options?: any): any {
    const caseStudy = rawContent.caseStudy;
    
    return {
      title: caseStudy.title || 'Knowledge Graph Case Study',
      industry: caseStudy.industry,
      organization: caseStudy.organization,
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      implementation: caseStudy.implementation,
      results: caseStudy.results,
      keyMetrics: caseStudy.keyMetrics || [],
      lessons: caseStudy.lessons || [],
      timeline: caseStudy.timeline
    };
  }
  
  /**
   * Transforms metrics data for visualization
   */
  private transformMetricsData(rawContent: any, options?: any): any {
    // Extract metrics for visualization
    const metrics = rawContent.metrics.map((metric: any) => ({
      industry: metric.industry,
      metrics: {
        roi: metric.roi,
        timeToValue: metric.timeToValue,
        dataQualityImprovement: metric.dataQualityImprovement,
        costReduction: metric.costReduction,
        productivityGain: metric.productivityGain
      }
    }));
    
    return {
      title: rawContent.title || 'Knowledge Graph ROI by Industry',
      description: rawContent.description || 'Comparative metrics across industries',
      metrics,
      selectedMetric: options?.metric || 'roi'
    };
  }
  
  /**
   * Normalizes industry content
   */
  private normalizeIndustryContent(rawContent: any): any {
    return {
      title: rawContent.title || 'Industry Applications of Knowledge Graphs',
      subtitle: rawContent.subtitle,
      description: rawContent.description || '',
      keyPoints: rawContent.keyPoints || [],
      industries: rawContent.industries || [],
      presenterNotes: rawContent.presenterNotes || ''
    };
  }
}