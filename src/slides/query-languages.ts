/**
 * Query Languages Slides Module
 * Defines slides covering query languages for knowledge graphs
 */
import { SlideConfig, SlideGroup } from '../types/slide-data';

/**
 * SPARQL introduction slide
 */
const sparqlIntroSlide: SlideConfig = {
  id: 'sparql-introduction',
  title: 'SPARQL: RDF Query Language',
  content: {
    definition: 'SPARQL (SPARQL Protocol and RDF Query Language) is the W3C standard query language for RDF graph databases, using pattern matching to express complex queries against knowledge graphs.',
    keyPoints: [
      'Standardized by W3C, currently at version 1.1',
      'SQL-like syntax adapted for triple patterns',
      'Supports queries, updates, and federation',
      'Core component of the Semantic Web technology stack',
      'Enables graph pattern matching with variables',
      'Supports aggregation, filtering, and complex path expressions',
      'Can query across distributed RDF datasets'
    ],
    codeSnippets: [
      {
        language: 'sparql',
        caption: 'Basic SPARQL query example',
        code: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX ex: <http://example.org/>

SELECT ?person ?name
WHERE {
  ?person rdf:type ex:Person .
  ?person ex:name ?name .
  ?person ex:worksFor ?company .
  ?company ex:industry "Technology" .
}`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that SPARQL is to RDF what SQL is to relational databases - the standard query language that is supported by all RDF databases. Unlike SQL, SPARQL is specifically designed for graph pattern matching against triples.'
};

/**
 * SPARQL query structure slide
 */
const sparqlStructureSlide: SlideConfig = {
  id: 'sparql-structure',
  title: 'SPARQL Query Structure',
  content: {
    definition: 'SPARQL queries follow a structured format that enables precise graph pattern matching and result manipulation.',
    keyPoints: [
      'PREFIX declarations: Define shorthand prefixes for URIs',
      'Query form: SELECT, ASK, CONSTRUCT, or DESCRIBE',
      'Dataset specification: FROM clauses to specify graph sources',
      'WHERE clause: Graph patterns to match using triple patterns',
      'Solution modifiers: ORDER BY, LIMIT, OFFSET, GROUP BY, HAVING',
      'Variables: Identified by ? or $ prefix (e.g., ?person)',
      'Triple patterns: subject predicate object patterns with variables'
    ],
    codeSnippets: [
      {
        language: 'sparql',
        caption: 'Example showing SPARQL query components',
        code: `# Prefix declarations
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX ex: <http://example.org/>

# Query form
SELECT ?company (COUNT(?person) AS ?employeeCount)

# Dataset specification
FROM <http://example.org/companies-graph>

# Graph pattern matching
WHERE {
  ?company rdf:type ex:Company .
  ?company rdfs:label ?name .
  ?person ex:worksFor ?company .
  ?person rdf:type ex:Person .
  
  # Optional pattern
  OPTIONAL {
    ?company ex:foundedYear ?year .
  }
  
  # Filter expression
  FILTER (?year > 2000)
}

# Solution modifiers
GROUP BY ?company
HAVING (COUNT(?person) > 10)
ORDER BY DESC(?employeeCount)
LIMIT 5`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Explain how SPARQL queries combine triple patterns to form increasingly complex graph patterns. The power of SPARQL comes from its ability to express sophisticated graph matching with relatively simple syntax.'
};

/**
 * SPARQL advanced features slide
 */
const sparqlAdvancedSlide: SlideConfig = {
  id: 'sparql-advanced',
  title: 'Advanced SPARQL Features',
  content: {
    definition: 'SPARQL 1.1 introduced several advanced features that enhance its expressive power for complex knowledge graph queries.',
    keyPoints: [
      'Property Paths: Navigate complex paths through the graph',
      'Subqueries: Nested query patterns for complex filtering and aggregation',
      'Aggregation: COUNT, SUM, AVG, MIN, MAX with GROUP BY',
      'Graph Updates: INSERT, DELETE, and LOAD operations',
      'Federation: SPARQL queries across multiple endpoints with SERVICE',
      'Negation: NOT EXISTS and MINUS for negation patterns',
      'Assignment: BIND and expression assignment'
    ],
    codeSnippets: [
      {
        language: 'sparql',
        caption: 'Advanced SPARQL features example',
        code: `PREFIX ex: <http://example.org/>

# Using property paths
SELECT ?person ?colleague
WHERE {
  ?person ex:worksFor/ex:locatedIn/ex:country "Germany" .
  ?person ^ex:reportsTo* ?manager .
  ?colleague ex:reportsTo ?manager ;
            ex:skill "Knowledge Graphs" .
}

# Using subqueries and aggregation
SELECT ?department ?avgSalary
WHERE {
  ?department a ex:Department .
  {
    SELECT ?department (AVG(?salary) AS ?avgSalary)
    WHERE {
      ?person ex:worksIn ?department ;
              ex:salary ?salary .
    }
    GROUP BY ?department
  }
  FILTER (?avgSalary > 75000)
}

# Using federation
SELECT ?person ?externalProfile
WHERE {
  ?person ex:name ?name .
  SERVICE <http://dbpedia.org/sparql> {
    ?externalProfile foaf:name ?name ;
                     dbo:occupation dbr:Computer_scientist .
  }
}`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that these advanced features make SPARQL particularly powerful for knowledge graph applications. Property paths are especially important for traversing complex relationships, while federation enables queries across organizational boundaries.'
};

/**
 * Cypher introduction slide
 */
const cypherIntroSlide: SlideConfig = {
  id: 'cypher-introduction',
  title: 'Cypher: Property Graph Query Language',
  content: {
    definition: 'Cypher is a declarative graph query language originally developed for Neo4j, designed for querying property graphs using visual ASCII-art syntax for pattern matching.',
    keyPoints: [
      'Visual pattern matching with nodes () and relationships []',
      'Pattern-based querying with intuitive ASCII-art syntax',
      'Declarative approach: specify what to find, not how',
      'Support for rich property access and filtering',
      'Originally developed for Neo4j, now evolving into an open standard (GQL)',
      'Widely adopted in the property graph ecosystem',
      'Inspired by SQL and SPARQL but optimized for property graphs'
    ],
    codeSnippets: [
      {
        language: 'cypher',
        caption: 'Basic Cypher query example',
        code: `// Find people who work for technology companies
MATCH (person:Person)-[:WORKS_FOR]->(company:Company)
WHERE company.industry = "Technology"
RETURN person.name, company.name`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that Cypher\'s visual syntax is one of its key advantages, making it more intuitive for developers to write and understand graph queries. The ASCII-art pattern matching (e.g., (node1)-[relationship]->(node2)) visually represents the graph patterns being queried.'
};

/**
 * Cypher query structure slide
 */
const cypherStructureSlide: SlideConfig = {
  id: 'cypher-structure',
  title: 'Cypher Query Structure',
  content: {
    definition: 'Cypher queries follow a structure inspired by SQL, with clauses that define patterns to match, filter conditions, and result processing.',
    keyPoints: [
      'MATCH: Specify graph patterns to find',
      'WHERE: Filter based on properties and conditions',
      'RETURN: Define the query output',
      'ORDER BY, SKIP, LIMIT: Control result ordering and pagination',
      'WITH: Chain query parts and define intermediate results',
      'CREATE, MERGE, SET, DELETE: Modify the graph',
      'Node patterns: (variable:Label {property: value})',
      'Relationship patterns: -[variable:TYPE {property: value}]->'
    ],
    codeSnippets: [
      {
        language: 'cypher',
        caption: 'Example showing Cypher query components',
        code: `// Node and relationship patterns with variables
MATCH (company:Company {name: "TechCorp"})<-[:WORKS_FOR]-(employee:Person)

// Property access and filtering
WHERE employee.startDate > date("2020-01-01")
  AND employee.department = "Engineering"

// Intermediate results with aggregation
WITH company, count(employee) AS employeeCount, collect(employee) AS team

// Multiple patterns and relationships
MATCH (company)-[:BASED_IN]->(city:City)
WHERE city.country = "Germany"

// Result selection with expressions
RETURN company.name AS companyName, 
       city.name AS location,
       employeeCount,
       [member IN team WHERE member.role = "Manager" | member.name] AS managers

// Results ordering and pagination
ORDER BY employeeCount DESC
LIMIT 5`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Explain how Cypher\'s structure allows for progressive building of complex queries by chaining pattern matching and aggregation. The WITH clause is particularly powerful for breaking complex queries into manageable steps.'
};

/**
 * Cypher advanced features slide
 */
const cypherAdvancedSlide: SlideConfig = {
  id: 'cypher-advanced',
  title: 'Advanced Cypher Features',
  content: {
    definition: 'Cypher provides advanced capabilities for complex graph operations, including pattern expressions, path handling, and graph algorithms.',
    keyPoints: [
      'Variable-length paths: Flexible path traversal with varying depths',
      'Pattern comprehensions: Create collections from pattern matches',
      'List operations: Filtering, mapping, and reduction',
      'Path functions: Extracting nodes, relationships, lengths from paths',
      'Procedure calls: Extend Cypher with custom procedures',
      'Subqueries: Complex nested pattern matching',
      'Union operations: Combining results from multiple queries'
    ],
    codeSnippets: [
      {
        language: 'cypher',
        caption: 'Advanced Cypher features example',
        code: `// Variable-length path finding colleagues up to 3 steps away
MATCH (person:Person {name: "Alice"})-[:KNOWS*1..3]->(colleague:Person)
RETURN colleague.name, colleague.department

// Pattern comprehension for nested data
MATCH (company:Company)
RETURN company.name,
       [(company)<-[:WORKS_FOR]-(employee) WHERE employee.role = "Engineer" | employee.name] AS engineers,
       size([(company)<-[:INVESTED_IN]-(investor) | investor.name]) AS investorCount

// Subqueries and aggregation
MATCH (department:Department {name: "Research"})
WITH department,
     [(department)<-[:WORKS_IN]-(employee) | employee.salary] AS salaries
RETURN department.name, 
       reduce(total = 0, salary IN salaries | total + salary) AS totalSalary,
       avg(salaries) AS averageSalary

// Path functions
MATCH p = shortestPath((alice:Person {name: "Alice"})-[:KNOWS*]-(bob:Person {name: "Bob"}))
RETURN length(p) AS degrees,
       [node IN nodes(p) | node.name] AS peopleInPath,
       [rel IN relationships(p) | type(rel)] AS connectionTypes

// Procedure call
CALL db.labels() YIELD label
RETURN label, count(*) AS usage
ORDER BY usage DESC LIMIT 10`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that these advanced features make Cypher particularly powerful for complex traversal operations and analytical queries on property graphs. The combination of declarative pattern matching with procedural extensions provides a flexible querying framework.'
};

/**
 * Gremlin introduction slide
 */
const gremlinIntroSlide: SlideConfig = {
  id: 'gremlin-introduction',
  title: 'Gremlin: Graph Traversal Language',
  content: {
    definition: 'Gremlin is a graph traversal language from the Apache TinkerPop project, using a functional, fluent approach to express complex graph operations as a sequence of steps.',
    keyPoints: [
      'Part of Apache TinkerPop, a graph computing framework',
      'Functional, composable approach using traversal steps',
      'Available for multiple programming languages (Java, JavaScript, Python, etc.)',
      'Works across different graph databases that implement TinkerPop',
      'Combines pattern matching with imperative traversal logic',
      'Focuses on graph traversal operations through step composition',
      'Offers both OLTP (transactional) and OLAP (analytical) capabilities'
    ],
    codeSnippets: [
      {
        language: 'java',
        caption: 'Basic Gremlin traversal example',
        code: `// Find people who work for technology companies
g.V().hasLabel("Person")
     .out("WORKS_FOR")
     .hasLabel("Company")
     .has("industry", "Technology")
     .as("company")
     .in("WORKS_FOR")
     .as("person")
     .select("person", "company")
     .by("name")
     .by("name")`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that Gremlin takes a fundamentally different approach compared to SPARQL and Cypher, focusing on imperative traversal steps rather than declarative pattern matching. This makes it more familiar to programmers used to functional programming styles.'
};

/**
 * Gremlin traversal basics slide
 */
const gremlinBasicsSlide: SlideConfig = {
  id: 'gremlin-basics',
  title: 'Gremlin Traversal Basics',
  content: {
    definition: 'Gremlin traversals are built using a sequence of steps that filter, transform, and navigate through the graph.',
    keyPoints: [
      'Graph: The starting point (g) of all traversals',
      'Traversal source: Begins with V() (vertices) or E() (edges)',
      'Step functions: Operations that process the traversal elements',
      'Modulators: Parameters that modify step behavior',
      'Terminal steps: Execute the traversal and return results',
      'Side effects: Accumulate information during traversal',
      'Lambda expressions: Custom filtering and transformation logic'
    ],
    codeSnippets: [
      {
        language: 'java',
        caption: 'Gremlin traversal composition example',
        code: `// Starting with vertices
g.V()

  // Filtering by label and properties
  .hasLabel("Person")
  .has("age", gt(30))
  
  // Traversing outgoing edges with specific label
  .out("KNOWS")
  
  // Property extraction
  .values("name")
  
  // Result manipulation
  .dedup()
  .order()
  .limit(5)

  // Terminal step to execute traversal
  .toList()`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Explain how Gremlin traversals are built up like a pipeline, with each step taking input from the previous step and producing output for the next step. This composition model makes it highly flexible for expressing complex traversal logic.'
};

/**
 * Gremlin advanced features slide
 */
const gremlinAdvancedSlide: SlideConfig = {
  id: 'gremlin-advanced',
  title: 'Advanced Gremlin Features',
  content: {
    definition: 'Gremlin provides powerful features for complex traversals, graph algorithms, and analytical operations across large graphs.',
    keyPoints: [
      'Path manipulation: Working with traversal history and paths',
      'Branching: Conditional traversals with choose(), branch(), union()',
      'Recursion: Repeat steps with until() termination conditions',
      'Subtraversals: Nested traversals for complex filtering and matching',
      'Graph algorithms: Integrated operations for common algorithms',
      'OLAP: Large-scale analytical processing across the entire graph',
      'Custom DSL: Extending Gremlin with domain-specific languages'
    ],
    codeSnippets: [
      {
        language: 'java',
        caption: 'Advanced Gremlin features example',
        code: `// Path operations - find shortest path
g.V().has("name", "Alice")
     .repeat(out().simplePath())
     .until(has("name", "Bob"))
     .path()
     .limit(1)

// Branching with choose() - classify people by age
g.V().hasLabel("Person")
     .choose(values("age"))
       .option(lte(18), constant("youth"))
       .option(between(19, 65), constant("adult"))
       .option(gt(65), constant("senior"))
     .group()
       .by()
       .by(count())

// Subtraversals with where()
g.V().hasLabel("Person")
     .where(out("CREATED").count().is(gt(1)))
     .values("name")

// Graph algorithm with pageRank
g.V().hasLabel("Page")
     .pageRank()
     .with(PageRank.edges, __.outE("LINKS"))
     .with(PageRank.times, 20)
     .order().by(values("gremlin.pageRankVertexProgram.pageRank"), desc)
     .limit(10)
     .project("page", "rank")
       .by("url")
       .by("gremlin.pageRankVertexProgram.pageRank")

// OLAP traversal
g.V().hasLabel("Person").count() // OLTP count
g.V().hasLabel("Person").count(Scope.global) // OLAP count`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that these advanced features make Gremlin especially powerful for complex analytical tasks and algorithm implementation. The ability to combine traversal logic with built-in graph algorithms provides a versatile toolkit for graph processing.'
};

/**
 * GraphQL for graphs slide
 */
const graphqlForGraphsSlide: SlideConfig = {
  id: 'graphql-for-graphs',
  title: 'GraphQL for Knowledge Graphs',
  content: {
    definition: 'GraphQL, while not specifically designed for graph databases, provides a flexible query language and runtime that can be effectively adapted for knowledge graph access.',
    keyPoints: [
      'Schema-defined queries specify exactly what data to retrieve',
      'Hierarchical response structure matches the query structure',
      'Type system provides clear interface definition',
      'Resolvers can connect to underlying graph databases',
      'Reduces over-fetching through precise field selection',
      'Enables multiple resource fetching in a single request',
      'Strong developer ecosystem and tooling'
    ],
    codeSnippets: [
      {
        language: 'graphql',
        caption: 'GraphQL query for knowledge graph data',
        code: `# GraphQL schema for knowledge graph
type Person {
  id: ID!
  name: String!
  email: String
  worksFor: Company
  colleagues: [Person!]
  skills: [Skill!]
}

type Company {
  id: ID!
  name: String!
  industry: String
  employees: [Person!]
}

type Skill {
  id: ID!
  name: String!
  category: String
  practitioners: [Person!]
}

# GraphQL query
query {
  person(id: "p123") {
    name
    worksFor {
      name
      industry
    }
    colleagues {
      name
      skills {
        name
        category
      }
    }
  }
}`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Explain that while GraphQL isn\'t specifically a graph database query language, it provides a natural way to expose knowledge graphs through APIs. The hierarchical nature of GraphQL queries maps well to traversing relationships in knowledge graphs.'
};

/**
 * SPARQL vs Cypher comparison slide
 */
const sparqlCypherComparisonSlide: SlideConfig = {
  id: 'sparql-cypher-comparison',
  title: 'SPARQL vs Cypher: Comparative Analysis',
  content: {
    definition: 'SPARQL and Cypher represent different approaches to graph querying, with distinct syntax and capabilities reflecting their underlying data models.',
    keyPoints: [
      'SPARQL uses triple patterns (S-P-O), Cypher uses node-relationship patterns',
      'SPARQL has standardized semantics, Cypher has more intuitive syntax',
      'SPARQL designed for open-world model, Cypher for closed-world model',
      'SPARQL focuses on dataset integration, Cypher on pattern expressivity',
      'SPARQL has native inference capabilities, Cypher focuses on traversal',
      'Both support property filtering, aggregation, and complex queries'
    ],
    codeSnippets: [
      {
        language: 'text',
        caption: 'Same query expressed in SPARQL and Cypher',
        code: `# SPARQL: Find people who know someone who works for a technology company
PREFIX ex: <http://example.org/>
SELECT ?person ?friend ?company
WHERE {
  ?person ex:knows ?friend .
  ?friend ex:worksFor ?company .
  ?company ex:industry "Technology" .
}

// Cypher: Find people who know someone who works for a technology company
MATCH (person:Person)-[:KNOWS]->(friend:Person)-[:WORKS_FOR]->(company:Company)
WHERE company.industry = "Technology"
RETURN person.name, friend.name, company.name`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that SPARQL and Cypher are optimized for different data models and use cases. SPARQL excels at querying across heterogeneous, distributed datasets with formal semantics, while Cypher provides an intuitive syntax for expressive pattern matching in property graphs.'
};

/**
 * SHACL and ShEx slide
 */
const shaclShexSlide: SlideConfig = {
  id: 'shacl-shex',
  title: 'SHACL and ShEx: Validating Knowledge Graphs',
  content: {
    definition: 'SHACL (Shapes Constraint Language) and ShEx (Shape Expressions) provide mechanisms to validate RDF graphs against sets of constraints, ensuring data quality and consistency.',
    keyPoints: [
      'Define expected structure and constraints for graph data',
      'Validate instances against schemas or "shapes"',
      'Support cardinality, value type, and pattern constraints',
      'Enable closed/open validation contexts',
      'Provide detailed validation reports for debugging',
      'SHACL is a W3C recommendation, ShEx is a community standard',
      'Both support RDF data validation with different syntax styles'
    ],
    codeSnippets: [
      {
        language: 'turtle',
        caption: 'SHACL constraint example',
        code: `@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# Shape for validating Person entities
ex:PersonShape
  a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:name ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
  ] ;
  sh:property [
    sh:path ex:email ;
    sh:datatype xsd:string ;
    sh:pattern "^[^@]+@[^@]+\\.[^@]+$" ;
  ] ;
  sh:property [
    sh:path ex:age ;
    sh:datatype xsd:integer ;
    sh:minInclusive 0 ;
    sh:maxInclusive 150 ;
  ] ;
  sh:property [
    sh:path ex:worksFor ;
    sh:nodeKind sh:IRI ;
    sh:class ex:Company ;
  ] .`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Emphasize that validation languages like SHACL and ShEx fill an important gap in knowledge graph ecosystems by providing a way to ensure data quality and conformance to expected patterns. While not query languages themselves, they complement query languages by ensuring the graph structure meets expectations.'
};

/**
 * GQL emerging standard slide
 */
const gqlStandardSlide: SlideConfig = {
  id: 'gql-standard',
  title: 'GQL: Emerging Graph Query Language Standard',
  content: {
    definition: 'GQL (Graph Query Language) is an emerging ISO standard for property graph querying, combining concepts from existing languages like Cypher, PGQL, and G-CORE.',
    keyPoints: [
      'Under development as ISO/IEC 39075 international standard',
      'Aims to be the "SQL for graphs" - a unified standard',
      'Builds on Cypher\'s pattern matching syntax',
      'Incorporates features from multiple graph query languages',
      'Supports property graphs with complex data types',
      'Includes both pattern matching and traversal semantics',
      'Designed for compatibility with SQL environments'
    ],
    listItems: [
      {
        title: 'Key Design Goals',
        items: [
          'Declarative query language for property graphs',
          'Support both transactional and analytical workloads',
          'Enable complex pattern matching and path finding',
          'Provide clear semantics for graph operations',
          'Offer composable query capabilities',
          'Support integration with existing database systems',
          'Allow for vendor-specific extensions'
        ],
        type: 'bullet'
      },
      {
        title: 'Current Status',
        items: [
          'Under active development by ISO committee',
          'Syntax and semantics being finalized',
          'Initial implementations in development',
          'Adoption commitments from major graph database vendors',
          'Expected to become the dominant property graph language',
          'Timeline for final standardization: 2023-2024'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Highlight that GQL represents an important development in the graph database ecosystem, potentially bringing standardization to property graph querying similar to what SQL did for relational databases. This could significantly impact technology selection and interoperability in the future.'
};

/**
 * Query performance optimization slide
 */
const queryOptimizationSlide: SlideConfig = {
  id: 'query-optimization',
  title: 'Knowledge Graph Query Optimization',
  content: {
    definition: 'Knowledge graph query optimization requires specific techniques to handle the complex pattern matching and traversal operations common in graph queries.',
    keyPoints: [
      'Query planning: Determining optimal execution strategies',
      'Join order optimization: Critical for multi-pattern queries',
      'Indexing strategies: Property, full-text, and structural indices',
      'Traversal optimizations: Early pruning and path reduction',
      'Statistics-based optimization: Using graph statistics for planning',
      'Caching: Result and traversal caching for repeated patterns',
      'Query rewriting: Transforming queries for better performance'
    ],
    listItems: [
      {
        title: 'Common Optimization Techniques',
        items: [
          'Triple/edge indexing: Multiple indexing schemes (PSO, POS, SPO)',
          'Cardinality estimation: Using statistics to guide join ordering',
          'Filter pushing: Applying filters as early as possible',
          'Bind joins: Using partial results to constrain subsequent joins',
          'Path planning: Optimizing multi-hop traversals',
          'Materialized views: Precomputing common query patterns',
          'Query decomposition: Breaking complex queries into optimizable parts'
        ],
        type: 'bullet'
      },
      {
        title: 'Performance Pitfalls',
        items: [
          'Unbounded variable-length paths: Can lead to explosive traversals',
          'Cartesian products: Missing join conditions causing cross products',
          'Poor selectivity ordering: Joining on low-selectivity patterns first',
          'Over-constrained patterns: Preventing index usage with complex filters',
          'Suboptimal pattern structure: Failing to leverage database strengths',
          'Redundant traversals: Repeating pattern elements unnecessarily',
          'Lack of proper indexing: Missing indices for common access patterns'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that query optimization for knowledge graphs involves unique challenges due to the graph structure and traversal operations. Understanding these optimization techniques is critical for writing efficient queries, especially as graph sizes and query complexity increase.'
};

/**
 * Knowledge graph constraints slide
 */
const constraintsSlide: SlideConfig = {
  id: 'knowledge-graph-constraints',
  title: 'Knowledge Graph Constraints & Rules',
  content: {
    definition: 'Knowledge graphs can be enhanced with constraints and rules that enforce data integrity, enable inference, and capture domain semantics.',
    keyPoints: [
      'Schema constraints: Define valid entity and relationship types',
      'Property constraints: Enforce property types, cardinalities, and patterns',
      'Structural constraints: Control graph topology and connectivity',
      'Business rules: Capture domain-specific knowledge and policies',
      'Integrity constraints: Ensure consistency across related entities',
      'Inference rules: Define logical implications for knowledge expansion',
      'Constraint languages: SHACL, ShEx, OWL restrictions, custom rules'
    ],
    codeSnippets: [
      {
        language: 'turtle',
        caption: 'Example constraints in different languages',
        code: `# OWL Restriction (functional property - person has exactly one age)
ex:Person rdf:type owl:Class .
ex:age rdf:type owl:DatatypeProperty ;
      rdf:type owl:FunctionalProperty ;
      rdfs:domain ex:Person ;
      rdfs:range xsd:integer .

# SHACL Constraint (person's manager must be in same department)
ex:ManagerInSameDeptShape a sh:NodeShape ;
  sh:targetClass ex:Employee ;
  sh:property [
    sh:path ex:department ;
    sh:equals [
      sh:path [ sh:inversePath ex:manages ] / ex:department ;
    ] ;
  ] .

# Property Graph Constraint (Neo4j)
CREATE CONSTRAINT ON (p:Person) ASSERT p.email IS UNIQUE;

# Custom Rule (Prolog-style)
grandfather(X, Z) :- father(X, Y), parent(Y, Z).`
      }
    ]
  },
  visualizationType: 'none',
  transition: 'fade',
  notes: 'Highlight that constraints and rules turn knowledge graphs from passive data structures into active knowledge models that can enforce business rules and derive new insights. These capabilities are a key differentiator for knowledge graphs compared to simpler graph structures.'
};

/**
 * Query languages best practices slide
 */
const bestPracticesSlide: SlideConfig = {
  id: 'query-languages-best-practices',
  title: 'Knowledge Graph Query Best Practices',
  content: {
    definition: 'Following best practices for knowledge graph queries ensures maintainability, performance, and correctness across different implementations.',
    keyPoints: [
      'Understand the query execution model of your database',
      'Use appropriate indices for your query patterns',
      'Start with specific, selective patterns',
      'Use named graph patterns for clarity and reuse',
      'Optimize variable-length path traversals carefully',
      'Leverage query parameterization for security and caching',
      'Test with representative data volumes'
    ],
    listItems: [
      {
        title: 'SPARQL Best Practices',
        items: [
          'Use FILTER sparingly and as late as possible',
          'Prefer blank nodes in queries only when necessary',
          'Prefer property paths for multi-hop traversals',
          'Enable query result caching when possible',
          'Understand how OPTIONAL patterns affect performance',
          'Use BIND to compute values once rather than repeating expressions',
          'Consider federating queries for large, distributed datasets'
        ],
        type: 'bullet'
      },
      {
        title: 'Cypher Best Practices',
        items: [
          'Use parameters instead of literals in queries',
          'Start with specific patterns and labels',
          'Use WHERE clauses to filter after matching',
          'Break complex queries into multiple WITH clauses',
          'Prefer MERGE for conditional creation/update patterns',
          'Understand the difference between MERGE and CREATE',
          'Use EXPLAIN and PROFILE for query tuning'
        ],
        type: 'bullet'
      },
      {
        title: 'Gremlin Best Practices',
        items: [
          'Prefer .hasLabel() early in traversals',
          'Use .by() modulators consistently for property access',
          'Avoid excessive .iterate() calls that exhaust the traversal',
          'Leverage .path() carefully as it can be memory-intensive',
          'Use profile() step to analyze traversal performance',
          'Consider byte-code compilation for production traversals',
          'Reuse traversal templates for similar query patterns'
        ],
        type: 'bullet'
      }
    ]
  },
  visualizationType: 'none',
  transition: 'slide',
  notes: 'Emphasize that query best practices differ somewhat across query languages due to their different execution models and optimization strategies. Understanding these nuances is important for writing efficient queries in any particular system.'
};

/**
 * Query languages slide group configuration
 */
export const queryLanguagesSlideGroup: SlideGroup = {
  title: 'Knowledge Graph Query Languages',
  id: 'query-languages',
  includeSectionSlide: true,
  slides: [
    sparqlIntroSlide,
    sparqlStructureSlide,
    sparqlAdvancedSlide,
    cypherIntroSlide,
    cypherStructureSlide,
    cypherAdvancedSlide,
    gremlinIntroSlide,
    gremlinBasicsSlide,
    gremlinAdvancedSlide,
    graphqlForGraphsSlide,
    sparqlCypherComparisonSlide,
    shaclShexSlide,
    gqlStandardSlide,
    queryOptimizationSlide,
    constraintsSlide,
    bestPracticesSlide
  ]
};

/**
 * Query languages slides module
 */
export const queryLanguagesSlides = queryLanguagesSlideGroup.slides;