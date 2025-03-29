# Knowledge Graph Presentation Markdown Format Guide

This guide outlines the standard markdown formatting conventions to use when creating content for the Knowledge Graph Presentation system. Following these guidelines ensures your markdown content is properly parsed and displayed in the presentation.

## Basic Structure

Your markdown document should follow this general structure:

```
# Main Title

## First Section Title
Content for the first section...

### Sub-section Title
Content for the sub-section...

## Second Section Title
Content for the second section...
```

## Header Levels

- `#` (Level 1): Main presentation title
- `##` (Level 2): Major sections/slide groups
- `###` (Level 3): Individual slides within sections
- `####` (Level 4+): Sub-headings within a slide (won't create new slides)

## Content Blocks

### Text Content

Regular paragraphs and text formatting work as expected:

```markdown
Regular paragraph text.

**Bold text** and *italic text*.

> Blockquote for important points or citations.
```

### Lists

Bulleted and numbered lists are supported:

```markdown
* First bullet point
* Second bullet point
  * Nested bullet point

1. First numbered item
2. Second numbered item
```

### Tables

Tables are automatically detected and rendered as table visualizations:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

### Code Blocks

Code blocks with specific language hints are rendered appropriately:

````markdown
```javascript
function example() {
  return "This is code";
}
```
````

## Visualizations

### Graph Visualizations

Use the `graph` or `diagram` language hint for graph visualizations:

````markdown
```graph
[Node1]-->[Node2]
[Node2]-->[Node3]
[Node1]-->[Node3]
```
````

### Flow Diagrams

Use the `flow` language hint for flow diagrams:

````markdown
```flow
Step1=>Step2=>Step3
Step2=>Step4
```
````

### ASCII Diagrams

Use the `ascii` language hint for ASCII art diagrams that will be converted to SVG:

````markdown
```ascii
+-------------------+     +---------------------+
| Box 1             |     | Box 2               |
|                   |---->|                     |
| Content           |     | More Content        |
+-------------------+     +---------------------+
```
````

### Timeline Visualizations

Include the word "timeline" or "evolution" in your content along with an ASCII representation:

````markdown
### Knowledge Graph Evolution Timeline

```ascii
+-------------------+     +---------------------+     +--------------------------------+
| 1960s-1980s       |     | 1990s-2012          |     | 2013-Present                   |
| Early Knowledge   |     | Semantic Web &      |     | Modern Knowledge Graph Era     |
| Representation    |     | First KGs           |     |                                |
+-------------------+     +---------------------+     +--------------------------------+
```
````

## Citations

Use blockquotes with a specific format for citations:

```markdown
> Citation: Author et al. (2021), "Quote from the citation in quotation marks"
```

## Special Sections

### Definition Blocks

Use this format for key definitions:

```markdown
**Definition**: A structured representation of knowledge as a network of entities and relationships
```

### Key Points

Use bullet points immediately after a definition for key points:

```markdown
**Key Concept**: Focus on connections and context

* First key point
* Second key point
* Third key point
```

## Example Section

Here's a complete example of a well-formatted section:

```markdown
## What is a Knowledge Graph?

**Definition**: A structured representation of knowledge as a network of entities and relationships

**Key Concept**: Focus on connections and context rather than isolated data points

* Entities represent real-world objects, concepts, or events
* Relationships connect entities and provide context
* Properties add additional attributes to entities and relationships

### Knowledge Graph Evolution Timeline

```ascii
+-------------------+     +---------------------+     +----------------+
| 1960s-1980s       |     | 1990s-2012          |     | 2013-Present   |
| Early Knowledge   |     | Semantic Web &      |     | Modern KG Era  |
| Representation    |     | First KGs           |     |                |
+-------------------+     +---------------------+     +----------------+
```

> Citation: Hogan et al. (2021), "Knowledge graphs represent real-world entities and illustrate relationships between them through nodes, edges, and labels"
```

## Best Practices

1. **Keep slides focused**: Each level 3 heading (`###`) becomes a separate slide
2. **Use visualizations**: Include relevant diagrams, tables, and flow charts
3. **Be consistent**: Follow the same formatting patterns throughout your document
4. **Include citations**: Add citations for important statements and definitions
5. **Use headers hierarchically**: Don't skip levels (e.g., don't go from `##` to `####`)

Following these guidelines will ensure your markdown content renders correctly in the presentation system and maintains a consistent look and feel across different topics. 