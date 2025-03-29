# Enhanced Markdown Format Guide

This guide explains how to create structured markdown presentations that recreate the rich slide configurations from the original TypeScript code. The enhanced format preserves all the visualization capabilities, content structure, and presentation features while making content creation more accessible.

## Basic Structure

Enhanced markdown presentations use slide separators and special directives to define slides and their features:

```markdown
# Main Presentation Title
## Subtitle or Description

*[Visual: Description of title slide visualization]*

<!-- Speaker Notes: Notes for the presenter -->

---

## Slide 2: Section Title

### Slide Subtitle

*[Visual: Description of visualization]*

Content goes here...

<!-- Speaker Notes: More presenter notes -->

---

## Slide 3: Another Section
...
```

## Slide Components

### Headers and Titles

- **Level 1 heading (#)**: Main presentation title
- **Level 2 heading (##)**: Slide or section title
- **Level 3 heading (###)**: Slide subtitle

### Visual Directives

Visual directives tell the presentation system what type of visualization to display:

```markdown
*[Visual: Network diagram showing interconnected nodes]*
```

Other directive types:
- `*[Animation: Description of animation sequence]*`
- `*[Interactive element: Description of interactive component]*`

### Content Blocks

#### Definitions

```markdown
**Definition:**
> "A graph of data intended to accumulate and convey knowledge..."
```

#### Key Points Lists

```markdown
**Key Differentiators:**
- **Entity-centric** rather than record-centric
- **Explicit relationships** as first-class objects
- **Contextual understanding** through connection patterns
```

#### Code Blocks

Code blocks can be used for both code examples and visualizations:

```markdown
**Code Example (Cypher):**
```cypher
MATCH (marie:Scientist {name: "Marie Curie"})
      -[:AUTHORED]->(paper:Publication)
RETURN marie, paper
```
```

#### Tables

Standard markdown tables are supported and will be rendered as interactive tables:

```markdown
| Feature | RDF Triple Store | Property Graph |
|---------|-----------------|----------------|
| Basic Unit | Subject-Predicate-Object | Directed Edge |
| Node Properties | ✓ | ✓ |
```

#### ASCII Diagrams

ASCII art within code blocks is automatically detected and converted to visualizations:

```markdown
```
┌─────────────┐                    ┌─────────────────────────┐
│ Symptom     │                    │ Symptom: Vibration      │
│ Detection   │                    │     ↑      ↖︎           │
└──────┬──────┘                    │     │       ╲          │
```
```

### Speaker Notes

Add notes for the presenter using HTML comments:

```markdown
<!-- Speaker Notes: This is only visible to the presenter -->
```

## Visualization Types

The enhanced parser automatically detects these visualization types:

1. **Graph Visualizations**
   - Detected by keywords: graph, nodes, edges, network
   - Code blocks with Cypher or RDF syntax

2. **Timeline Visualizations**
   - Detected by keywords: timeline, evolution, history
   - ASCII art with dates or time periods

3. **Diagram Visualizations**
   - Detected by keywords: diagram, architecture, layers
   - ASCII art with boxes and arrows

4. **Table Visualizations**
   - Standard markdown tables
   - Performance comparison matrices

5. **Flow Diagrams**
   - Detected by keywords: flow, process
   - ASCII art with connected boxes/steps

## Example: Recreating a TypeScript Slide

### Original TypeScript Code:

```typescript
const evolutionSlide: SlideConfig = {
  id: 'kg-evolution',
  title: 'Evolution of Knowledge Graphs',
  content: {
    definition: 'Knowledge graphs have evolved from early semantic networks...',
    keyPoints: [
      'Emerged from semantic networks, frames, and expert systems',
      'Standardized through Semantic Web technologies (RDF, OWL)',
      'Popularized by Google\'s Knowledge Graph in 2012',
      'Expanded to enterprise and domain-specific applications',
      'Now integrating with machine learning and neural approaches'
    ]
  },
  visualizationType: 'timeline',
  visualizationConfig: {
    data: evolutionTimelineData,
    orientation: 'horizontal',
    showLabels: true
  },
  transition: 'fade',
  notes: 'Emphasize how knowledge graphs have transitioned from academic research...'
};
```

### Equivalent Enhanced Markdown:

```markdown
## Evolution of Knowledge Graphs

### From Semantic Networks to Modern Applications

*[Visual: Interactive timeline with expanding detail on hover]*

**Definition:**
> Knowledge graphs have evolved from early semantic networks into sophisticated knowledge management systems integrated with AI capabilities.

**Key Developments:**
- Emerged from semantic networks, frames, and expert systems
- Standardized through Semantic Web technologies (RDF, OWL)
- Popularized by Google's Knowledge Graph in 2012
- Expanded to enterprise and domain-specific applications
- Now integrating with machine learning and neural approaches

```
┌─Early Foundations─┐   ┌─Semantic Web Era─┐   ┌─Modern KG Era──────┐
│ 1960s-1980s       │→→→│ 1990s-2012       │→→→│ 2013-Present        │
│                   │   │                  │   │                     │
│ ▸ Semantic Networks│   │ ▸ RDF Standards   │   │ ▸ Enterprise Adoption│
│ ▸ Frames, Scripts  │   │ ▸ Linked Data     │   │ ▸ ML Integration     │
│ ▸ Expert Systems   │   │ ▸ Google KG (2012)│   │ ▸ LLM+KG Systems     │
└───────────────────┘   └──────────────────┘   └─────────────────────┘
```

*[Interactive element: Timeline with clickable nodes revealing details of each era's key technologies]*

<!-- Speaker Notes: Emphasize how knowledge graphs have transitioned from academic research to mainstream commercial applications, and now represent a key component in modern AI systems. -->
```

## Automatic Features

The enhanced markdown parser automatically:

1. **Detects visualization types** based on content and context
2. **Organizes slides into groups** based on heading structure
3. **Extracts speaker notes** from HTML comments
4. **Identifies section slides** based on content patterns
5. **Processes special syntax** for visualizations and interactions

## Best Practices

1. **Use slide separators** (`---`) consistently to mark slide boundaries
2. **Include visualization directives** to describe what should be displayed
3. **Use consistent heading levels** for proper slide organization
4. **Add speaker notes** for presentation guidance
5. **Use ASCII diagrams** for structural visualizations
6. **Prefer structured content** (definitions, key points, lists) over plain text
7. **Make visualization intents clear** through keywords (graph, timeline, etc.)

By following this enhanced markdown format, you can create sophisticated presentations with the same rich features as the original TypeScript code while making content creation and editing much more accessible. 