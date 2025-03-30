# Knowledge Graph Core Components

## Definition
Knowledge graphs consist of several core components that work together to represent, store, query, and reason over structured knowledge.

## Key Points
- Entities represent real-world objects or concepts
- Relationships connect entities and define their semantic associations
- Properties provide attributes and metadata for entities
- Ontologies define the vocabulary and rules for the knowledge domain
- Inference engines enable reasoning capabilities and new knowledge discovery

## Entities
- id: entity
  name: Entity
  type: CoreComponent
- id: relationship
  name: Relationship
  type: CoreComponent
- id: property
  name: Property
  type: CoreComponent
- id: ontology
  name: Ontology
  type: CoreComponent
- id: inference
  name: Inference Engine
  type: CoreComponent
- id: storage
  name: Storage Layer
  type: TechComponent
- id: query
  name: Query Interface
  type: TechComponent
- id: apis
  name: APIs
  type: TechComponent

## Relationships
- source: entity
  target: relationship
  type: PARTICIPATES_IN
- source: entity
  target: property
  type: HAS
- source: entity
  target: ontology
  type: DEFINED_BY
- source: relationship
  target: ontology
  type: DEFINED_BY
- source: relationship
  target: property
  type: HAS
- source: inference
  target: ontology
  type: USES
- source: inference
  target: relationship
  type: CREATES
- source: storage
  target: entity
  type: STORES
- source: storage
  target: relationship
  type: STORES
- source: query
  target: entity
  type: RETRIEVES
- source: query
  target: relationship
  type: TRAVERSES
- source: apis
  target: query
  type: EXPOSES

## Focus Entities
- entity
- relationship
- ontology

## Presenter Notes
The core components slide explains the fundamental building blocks of knowledge graphs. Emphasize how these components interact to create a coherent knowledge representation system. The entities and relationships form the graph structure, while ontologies provide semantic meaning and inference engines enable reasoning. 