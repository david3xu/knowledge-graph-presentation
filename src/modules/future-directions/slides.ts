// src/modules/future-directions/slides.ts
import { BaseSlideFactory } from '../../utils/templates/slide-factory';
import { SlideConfig } from '../../types/slide-data';

export class FutureDirectionsSlideFactory extends BaseSlideFactory {
  public createDomainSlide(
    type: string, 
    content: any, 
    options?: any
  ): SlideConfig {
    switch(type) {
      case 'future-overview':
        return this.createFutureOverviewSlide(content, options);
      case 'emerging-trends':
        return this.createEmergingTrendsSlide(content, options);
      case 'technology-radar':
        return this.createTechnologyRadarSlide(content, options);
      case 'research-frontiers':
        return this.createResearchFrontiersSlide(content, options);
      case 'future-predictions':
        return this.createFuturePredictionsSlide(content, options);
      case 'impact-assessment':
        return this.createImpactAssessmentSlide(content, options);
      case 'strategic-recommendations':
        return this.createStrategicRecommendationsSlide(content, options);
      default:
        throw new Error(`Unknown slide type: ${type}`);
    }
  }
  
  private createFutureOverviewSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'future-overview',
      content.title || "Future Directions in Knowledge Graphs",
      {
        definition: content.description || content.summary || "Exploring emerging trends, technologies, and developments shaping the future of knowledge graphs.",
        keyPoints: content.keyTakeaways || content.keyPoints || []
      },
      options?.visualizationConfig,
      {
        transition: 'fade',
        notes: content.presenterNotes || "Presenter: This slide introduces the emerging trends and future directions in knowledge graph technology."
      }
    );
  }
  
  private createEmergingTrendsSlide(content: any, options?: any): SlideConfig {
    const trendItems = content.trends.map((trend: any) => {
      return `<strong>${trend.name}</strong>: ${trend.description}${trend.impact ? ` (Impact: ${trend.impact})` : ''}`;
    });
    
    return this.createSlide(
      'emerging-trends',
      "Emerging Trends in Knowledge Graphs",
      {
        definition: "Key trends that are shaping the evolution of knowledge graph technologies and applications.",
        listItems: [{
          title: "Key Trends",
          items: trendItems,
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide highlights the emerging trends in knowledge graph technology and their potential impact."
      }
    );
  }
  
  private createTechnologyRadarSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'technology-radar',
      "Knowledge Graph Technology Radar",
      {
        definition: "A visual representation of emerging technologies in the knowledge graph space, organized by adoption readiness and domain.",
      },
      options?.visualizationConfig,
      {
        transition: 'zoom',
        notes: content.presenterNotes || "Presenter: This radar chart shows emerging technologies in the knowledge graph ecosystem, arranged by maturity and domain."
      }
    );
  }
  
  private createResearchFrontiersSlide(content: any, options?: any): SlideConfig {
    const researchItems = content.researchAreas.map((area: any) => {
      return `<strong>${area.name}</strong>: ${area.description}`;
    });
    
    return this.createSlide(
      'research-frontiers',
      "Research Frontiers",
      {
        definition: "Leading-edge research areas that are expanding the capabilities and applications of knowledge graphs.",
        listItems: [{
          title: "Key Research Areas",
          items: researchItems,
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide covers the key research areas that are pushing the boundaries of knowledge graph technology."
      }
    );
  }
  
  private createFuturePredictionsSlide(content: any, options?: any): SlideConfig {
    const predictionItems = content.predictions.map((prediction: any) => {
      return `<strong>${prediction.title}</strong>: ${prediction.description} (Timeframe: ${prediction.timeframe})`;
    });
    
    return this.createSlide(
      'future-predictions',
      "Future Predictions",
      {
        definition: "Forecasts for how knowledge graph technology will evolve and impact organizations in the coming years.",
        listItems: [{
          title: "Key Predictions",
          items: predictionItems,
          type: 'bullet'
        }]
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide presents predictions for how knowledge graph technology will evolve in the future."
      }
    );
  }
  
  private createImpactAssessmentSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'impact-assessment',
      "Impact Assessment",
      {
        definition: "Evaluating the potential impact of emerging knowledge graph technologies across different time horizons.",
      },
      options?.visualizationConfig,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This matrix shows the potential impact of different technologies and trends over time."
      }
    );
  }
  
  private createStrategicRecommendationsSlide(content: any, options?: any): SlideConfig {
    return this.createSlide(
      'strategic-recommendations',
      "Strategic Recommendations",
      {
        definition: "Recommendations for organizations to prepare for and leverage future developments in knowledge graph technology.",
        listItems: [{
          title: "Key Recommendations",
          items: content.recommendations || content.strategies || [],
          type: 'numbered'
        }]
      },
      null,
      {
        transition: 'slide',
        notes: content.presenterNotes || "Presenter: This slide provides strategic recommendations for organizations to prepare for future developments in knowledge graph technology."
      }
    );
  }
}