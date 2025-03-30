# Knowledge Graph Concepts

## Definition
A knowledge graph is a structured representation of knowledge as a network of entities and relationships, enriched with domain semantics, context, and systems for acquisition, integration, and inference.

## Key Points
- Represents real-world entities and their interrelationships
- Integrates data from multiple sources into a unified view
- Encodes semantic meaning through ontologies and taxonomies
- Enables contextual connections across domains
- Supports reasoning and inference capabilities

## Entities
- id: concept
  name: Knowledge Graph
  type: Concept
- id: entity
  name: Entity
  type: Component
- id: relationship
  name: Relationship
  type: Component
- id: property
  name: Property
  type: Component
- id: semantic
  name: Semantic Model
  type: Component
- id: query
  name: Query Interface
  type: Component
- id: inference
  name: Inference Engine
  type: Component

## Relationships
- source: concept
  target: entity
  type: CONSISTS_OF
- source: concept
  target: relationship
  type: CONSISTS_OF
- source: concept
  target: property
  type: USES
- source: concept
  target: semantic
  type: DEFINED_BY
- source: concept
  target: query
  type: ACCESSED_VIA
- source: concept
  target: inference
  type: ENHANCED_BY
- source: entity
  target: property
  type: HAS
- source: entity
  target: relationship
  type: CONNECTED_BY
- source: semantic
  target: inference
  type: ENABLES

## Focus Entities
- concept
- entity
- relationship

## Presenter Notes
Knowledge graphs represent a powerful paradigm for knowledge representation and reasoning, combining graph structures with semantic technologies. Emphasize how they differ from traditional databases by focusing on relationships and semantics. 