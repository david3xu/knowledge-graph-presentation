// src/modules/future-directions/data.ts
import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class FutureDirectionsDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Determine content type and delegate to specific transformer
    if (rawContent.trends || rawContent.emergingTrends) {
      return this.transformTrendsData(rawContent, options);
    } else if (rawContent.researchAreas || rawContent.research) {
      return this.transformResearchData(rawContent, options);
    } else if (rawContent.technologies || rawContent.emergingTechnologies) {
      return this.transformTechnologiesData(rawContent, options);
    } else if (rawContent.predictions || rawContent.futurePredictions) {
      return this.transformPredictionsData(rawContent, options);
    }
    
    // Default transformation for general future directions content
    return this.transformGeneralFutureData(rawContent, options);
  }
  
  private transformTrendsData(rawContent: any, options?: any): any {
    const trends = rawContent.trends || rawContent.emergingTrends || [];
    
    return {
      trends: trends.map((trend: any) => ({
        id: trend.id || `trend-${trend.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: trend.name,
        description: trend.description,
        impact: trend.impact,
        timeframe: trend.timeframe || trend.timeline,
        maturity: trend.maturity,
        examples: trend.examples || [],
        stakeholders: trend.stakeholders || [],
        opportunities: trend.opportunities || [],
        challenges: trend.challenges || []
      })),
      categories: rawContent.categories || this.extractCategories(trends),
      trendConnections: rawContent.trendConnections || this.inferTrendConnections(trends)
    };
  }
  
  private transformResearchData(rawContent: any, options?: any): any {
    const areas = rawContent.researchAreas || rawContent.research || [];
    
    return {
      researchAreas: areas.map((area: any) => ({
        id: area.id || `research-${area.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: area.name,
        description: area.description,
        significance: area.significance,
        currentState: area.currentState,
        keyPlayers: area.keyPlayers || [],
        publications: area.publications || [],
        technologies: area.technologies || [],
        potentialImpact: area.potentialImpact || area.impact || ''
      })),
      domains: rawContent.domains || this.extractDomains(areas),
      connections: rawContent.connections || this.inferResearchConnections(areas)
    };
  }
  
  private transformTechnologiesData(rawContent: any, options?: any): any {
    const technologies = rawContent.technologies || rawContent.emergingTechnologies || [];
    
    return {
      technologies: technologies.map((tech: any) => ({
        id: tech.id || `tech-${tech.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: tech.name,
        description: tech.description,
        maturity: tech.maturity || {
          trl: tech.trl || 0,
          description: tech.maturityDescription || ''
        },
        advantages: tech.advantages || [],
        limitations: tech.limitations || [],
        use_cases: tech.use_cases || tech.useCases || [],
        providers: tech.providers || [],
        relevant_trends: tech.relevant_trends || tech.relevantTrends || []
      })),
      categories: rawContent.categories || this.extractTechCategories(technologies),
      maturityLevels: rawContent.maturityLevels || [
        { level: 1, name: "Basic Research" },
        { level: 2, name: "Applied Research" },
        { level: 3, name: "Proof of Concept" },
        { level: 4, name: "Prototype" },
        { level: 5, name: "Early Adoption" },
        { level: 6, name: "Growing Adoption" },
        { level: 7, name: "Mainstream" },
        { level: 8, name: "Widespread Use" },
        { level: 9, name: "Industry Standard" }
      ]
    };
  }
  
  private transformPredictionsData(rawContent: any, options?: any): any {
    const predictions = rawContent.predictions || rawContent.futurePredictions || [];
    
    return {
      predictions: predictions.map((prediction: any) => ({
        id: prediction.id || `prediction-${prediction.title.toLowerCase().replace(/\s+/g, '-')}`,
        title: prediction.title,
        description: prediction.description,
        timeframe: prediction.timeframe,
        probability: prediction.probability,
        impact: prediction.impact,
        assumptions: prediction.assumptions || [],
        signals: prediction.signals || [],
        implications: prediction.implications || []
      })),
      timeHorizons: rawContent.timeHorizons || this.extractTimeHorizons(predictions),
      scenarioElements: rawContent.scenarioElements || []
    };
  }
  
  private transformGeneralFutureData(rawContent: any, options?: any): any {
    // Default transformation for future directions content
    return {
      title: rawContent.title || "Future Directions in Knowledge Graphs",
      description: rawContent.description || "",
      summary: rawContent.summary || "",
      keyTakeaways: rawContent.keyTakeaways || [],
      sections: rawContent.sections || [],
      trends: rawContent.trends || [],
      challenges: rawContent.challenges || [],
      opportunities: rawContent.opportunities || []
    };
  }
  
  private extractCategories(trends: any[]): string[] {
    // Extract unique categories from trends
    const categoriesSet = new Set<string>();
    
    trends.forEach(trend => {
      if (trend.category) {
        categoriesSet.add(trend.category);
      } else if (trend.categories && Array.isArray(trend.categories)) {
        trend.categories.forEach((cat: string) => categoriesSet.add(cat));
      }
    });
    
    return Array.from(categoriesSet);
  }
  
  private inferTrendConnections(trends: any[]): any[] {
    // Infer connections between related trends
    interface Connection {
      from: string;
      to: string;
      label: string;
    }
    
    const connections: Connection[] = [];
    const trendsById = new Map();
    
    // Create map of trends by id
    trends.forEach(trend => {
      const id = trend.id || `trend-${trend.name.toLowerCase().replace(/\s+/g, '-')}`;
      trendsById.set(id, trend);
      trendsById.set(trend.name, trend); // Also map by name for flexibility
    });
    
    // Look for related trends
    trends.forEach(trend => {
      const trendId = trend.id || `trend-${trend.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Check for explicitly related trends
      if (trend.relatedTrends && Array.isArray(trend.relatedTrends)) {
        trend.relatedTrends.forEach((relatedTrendId: string) => {
          // Try to find the related trend by id or name
          const relatedTrend = trendsById.get(relatedTrendId);
          
          if (relatedTrend) {
            const relatedId = relatedTrend.id || `trend-${relatedTrend.name.toLowerCase().replace(/\s+/g, '-')}`;
            connections.push({
              from: trendId,
              to: relatedId,
              label: "related to"
            });
          }
        });
      }
      
      // Check for trends with same category
      trends.forEach(otherTrend => {
        if (trend === otherTrend) return; // Skip self
        
        const otherId = otherTrend.id || `trend-${otherTrend.name.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Connect trends in same category
        if (trend.category && trend.category === otherTrend.category) {
          connections.push({
            from: trendId,
            to: otherId,
            label: "same category"
          });
        }
      });
    });
    
    return connections;
  }
  
  private extractDomains(areas: any[]): string[] {
    // Extract unique domains from research areas
    const domainsSet = new Set<string>();
    
    areas.forEach(area => {
      if (area.domain) {
        domainsSet.add(area.domain);
      } else if (area.domains && Array.isArray(area.domains)) {
        area.domains.forEach((dom: string) => domainsSet.add(dom));
      }
    });
    
    return Array.from(domainsSet);
  }
  
  private inferResearchConnections(areas: any[]): any[] {
    // Infer connections between related research areas
    const connections = [];
    
    // Implementation similar to inferTrendConnections
    // This would analyze research areas for connections based on shared technologies,
    // domains, key players, etc.
    
    return connections;
  }
  
  private extractTechCategories(technologies: any[]): string[] {
    // Extract unique technology categories
    const categoriesSet = new Set<string>();
    
    technologies.forEach(tech => {
      if (tech.category) {
        categoriesSet.add(tech.category);
      } else if (tech.categories && Array.isArray(tech.categories)) {
        tech.categories.forEach((cat: string) => categoriesSet.add(cat));
      }
    });
    
    return Array.from(categoriesSet);
  }
  
  private extractTimeHorizons(predictions: any[]): any[] {
    // Extract and organize time horizons from predictions
    const horizons = new Set<string>();
    
    predictions.forEach(prediction => {
      if (prediction.timeframe) {
        horizons.add(prediction.timeframe);
      }
    });
    
    return Array.from(horizons)
      .sort() // Sort chronologically if possible
      .map(horizon => ({
        name: horizon,
        predictions: predictions.filter(p => p.timeframe === horizon).length
      }));
  }
}