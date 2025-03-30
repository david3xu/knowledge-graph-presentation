// src/modules/resources/data.ts
import { BaseDataTransformer } from '../../utils/templates/data-transformer';

export class ResourcesDataTransformer extends BaseDataTransformer {
  protected transformContentImpl(rawContent: any, options?: any): any {
    // Determine content type and delegate to specific transformer
    if (rawContent.references || rawContent.academicReferences) {
      return this.transformReferencesData(rawContent, options);
    } else if (rawContent.tools || rawContent.softwareTools) {
      return this.transformToolsData(rawContent, options);
    } else if (rawContent.learningResources || rawContent.courses) {
      return this.transformLearningResourcesData(rawContent, options);
    } else if (rawContent.communities || rawContent.communities) {
      return this.transformCommunitiesData(rawContent, options);
    }
    
    // Default transformation for general resources content
    return this.transformGeneralResourcesData(rawContent, options);
  }
  
  private transformReferencesData(rawContent: any, options?: any): any {
    const references = rawContent.references || rawContent.academicReferences || [];
    
    return {
      references: references.map((ref: any) => ({
        id: ref.id || `ref-${this.generateId(ref.title)}`,
        title: ref.title,
        authors: ref.authors,
        year: ref.year,
        venue: ref.venue || ref.journal || ref.conference,
        url: ref.url || ref.doi || ref.link,
        description: ref.description || ref.abstract,
        type: ref.type || this.inferReferenceType(ref),
        tags: ref.tags || ref.keywords || []
      })),
      categories: rawContent.categories || this.extractReferenceCategories(references),
      recommendedReferences: rawContent.recommendedReferences || this.getRecommendedReferences(references)
    };
  }
  
  private transformToolsData(rawContent: any, options?: any): any {
    const tools = rawContent.tools || rawContent.softwareTools || [];
    
    return {
      tools: tools.map((tool: any) => ({
        id: tool.id || `tool-${this.generateId(tool.name)}`,
        name: tool.name,
        description: tool.description,
        url: tool.url || tool.website,
        category: tool.category,
        license: tool.license,
        languages: tool.languages || tool.programmingLanguages || [],
        frameworks: tool.frameworks || [],
        features: tool.features || [],
        useCases: tool.useCases || tool.use_cases || [],
        complexity: tool.complexity || 'medium',
        maturity: tool.maturity || 'stable',
        organization: tool.organization || tool.company || tool.maintainer
      })),
      categories: rawContent.toolCategories || this.extractToolCategories(tools),
      maturityLevels: [
        { level: 'experimental', description: 'Early-stage, may have limited features or stability' },
        { level: 'beta', description: 'Feature-complete but may have bugs or limitations' },
        { level: 'stable', description: 'Reliable for production use' },
        { level: 'mature', description: 'Well-established with extensive adoption' }
      ],
      complexityLevels: [
        { level: 'beginner', description: 'Suitable for newcomers to knowledge graphs' },
        { level: 'intermediate', description: 'Requires some familiarity with knowledge graph concepts' },
        { level: 'advanced', description: 'Designed for specialists with extensive experience' }
      ]
    };
  }
  
  private transformLearningResourcesData(rawContent: any, options?: any): any {
    const resources = rawContent.learningResources || rawContent.courses || [];
    
    return {
      learningResources: resources.map((resource: any) => ({
        id: resource.id || `resource-${this.generateId(resource.title)}`,
        title: resource.title,
        description: resource.description,
        url: resource.url || resource.link,
        type: resource.type || this.inferResourceType(resource),
        provider: resource.provider || resource.author || resource.organization,
        level: resource.level || 'intermediate',
        duration: resource.duration,
        cost: resource.cost || resource.price,
        topics: resource.topics || resource.subjects || [],
        prerequisites: resource.prerequisites || [],
        format: resource.format || 'online'
      })),
      resourceTypes: rawContent.resourceTypes || [
        'course', 'tutorial', 'book', 'video', 'article', 'documentation', 'workshop'
      ],
      levels: rawContent.levels || [
        { level: 'beginner', description: 'No prior knowledge required' },
        { level: 'intermediate', description: 'Basic understanding of knowledge graphs needed' },
        { level: 'advanced', description: 'In-depth coverage for experienced practitioners' }
      ],
      topics: rawContent.topics || this.extractResourceTopics(resources)
    };
  }
  
  private transformCommunitiesData(rawContent: any, options?: any): any {
    const communities = rawContent.communities || [];
    
    return {
      communities: communities.map((community: any) => ({
        id: community.id || `community-${this.generateId(community.name)}`,
        name: community.name,
        description: community.description,
        url: community.url || community.website,
        type: community.type || 'forum',
        platform: community.platform,
        size: community.size,
        focus: community.focus || community.specialization,
        events: community.events || [],
        resources: community.resources || []
      })),
      communityTypes: rawContent.communityTypes || [
        'forum', 'mailing list', 'social media group', 'professional organization',
        'open source community', 'conference', 'meetup group'
      ],
      relevantEvents: rawContent.relevantEvents || []
    };
  }
  
  private transformGeneralResourcesData(rawContent: any, options?: any): any {
    // Default transformation for resources content
    return {
      title: rawContent.title || "Knowledge Graph Resources",
      description: rawContent.description || "",
      summary: rawContent.summary || "",
      sections: rawContent.sections || [],
      keyResources: rawContent.keyResources || [],
      recommendedStartingPoints: rawContent.recommendedStartingPoints || []
    };
  }
  
  private generateId(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  
  private inferReferenceType(ref: any): string {
    if (ref.journal) return 'journal';
    if (ref.conference) return 'conference';
    if (ref.booktitle) return 'book';
    if (ref.chapter) return 'book chapter';
    if (ref.website) return 'website';
    if (ref.report) return 'report';
    return 'article';
  }
  
  private extractReferenceCategories(references: any[]): string[] {
    // Extract unique categories from references
    const categoriesSet = new Set<string>();
    
    references.forEach(ref => {
      if (ref.category) {
        categoriesSet.add(ref.category);
      } else if (ref.categories && Array.isArray(ref.categories)) {
        ref.categories.forEach((cat: string) => categoriesSet.add(cat));
      } else if (ref.tags && Array.isArray(ref.tags)) {
        ref.tags.forEach((tag: string) => categoriesSet.add(tag));
      }
    });
    
    return Array.from(categoriesSet);
  }
  
  private getRecommendedReferences(references: any[]): any[] {
    // Get references marked as recommended or highly relevant
    return references.filter(ref => {
      return ref.recommended || ref.highlighted || ref.important || (ref.relevance && ref.relevance > 4);
    });
  }
  
  private extractToolCategories(tools: any[]): string[] {
    // Extract unique tool categories
    const categoriesSet = new Set<string>();
    
    tools.forEach(tool => {
      if (tool.category) {
        categoriesSet.add(tool.category);
      }
    });
    
    return Array.from(categoriesSet);
  }
  
  private inferResourceType(resource: any): string {
    if (resource.courseProvider || resource.lessons || resource.modules) return 'course';
    if (resource.publisher || resource.isbn) return 'book';
    if (resource.videoLength || resource.videos) return 'video';
    if (resource.blog || resource.magazine) return 'article';
    if (resource.repository) return 'code';
    if (resource.manual) return 'documentation';
    return 'tutorial';
  }
  
  private extractResourceTopics(resources: any[]): string[] {
    // Extract unique topics from learning resources
    const topicsSet = new Set<string>();
    
    resources.forEach(resource => {
      if (resource.topics && Array.isArray(resource.topics)) {
        resource.topics.forEach((topic: string) => topicsSet.add(topic));
      } else if (resource.subjects && Array.isArray(resource.subjects)) {
        resource.subjects.forEach((subject: string) => topicsSet.add(subject));
      }
    });
    
    return Array.from(topicsSet);
  }
}