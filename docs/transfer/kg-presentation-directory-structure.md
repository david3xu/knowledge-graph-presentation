```
knowledge-graph-presentation/
├── src/                             # Source code
│   ├── modules/                     # Domain-specific modules
│   │   ├── intro/                   # Introduction module
│   │   │   ├── data.ts              # Content transformation adapters (NOT static data)
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── core-components/         # Core components module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── data-models/             # Data models module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── construction/            # Construction module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── applications/            # Applications module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── query-languages/         # Query languages module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── rca/                     # Root cause analysis module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── getting-started/         # Implementation roadmap module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   ├── technologies/            # Technology stack module
│   │   │   ├── data.ts              # Content transformation adapters
│   │   │   ├── config.ts            # Visualization configurations
│   │   │   └── index.ts             # Factory functions for slide generation
│   │   └── future/                  # Future directions module
│   │       ├── data.ts              # Content transformation adapters
│   │       ├── config.ts            # Visualization configurations
│   │       └── index.ts             # Factory functions for slide generation
│   │
│   ├── visualizations/              # Visualization components
│   │   ├── graph.ts                 # Graph visualization component
│   │   ├── timeline.ts              # Timeline visualization component
│   │   ├── table.ts                 # Table visualization component 
│   │   ├── flow-diagram.ts          # Flow diagram visualization
│   │   └── common/                  # Shared visualization utilities
│   │       ├── colors.ts            # Color schemes and utilities
│   │       ├── legends.ts           # Legend generation utilities
│   │       ├── tooltips.ts          # Tooltip components
│   │       └── index.ts             # Common utilities exports
│   │
│   ├── parser/                      # Markdown parsing logic
│   │   ├── enhanced-markdown-parser.ts   # Enhanced parser with visualization
│   │   ├── markdown-loader.ts            # Loads markdown files
│   │   ├── markdown-translator.ts        # MD <-> slide config translation
│   │   └── index.ts                      # Parser module exports
│   │
│   ├── services/                    # Application services
│   │   ├── presentation-builder.ts  # Composition service
│   │   ├── presentation-manager.ts  # Lifecycle management
│   │   ├── slide-manager.ts         # Slide DOM management
│   │   ├── export-service.ts        # Presentation export utilities
│   │   ├── markdown-content-registry.ts  # Dynamic content registry
│   │   └── index.ts                 # Services module exports
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── graph-data.ts            # Node/edge interfaces
│   │   ├── slide-data.ts            # Slide configuration interfaces
│   │   ├── chart-config.ts          # Visualization config interfaces
│   │   ├── markdown-types.ts        # Markdown parsing interfaces
│   │   └── index.ts                 # Type definition exports
│   │
│   ├── utils/                       # Utility functions
│   │   ├── responsive.ts            # Responsive design utilities
│   │   ├── animation.ts             # Animation utilities
│   │   ├── ascii-to-svg.ts          # ASCII diagram converter
│   │   ├── dom-helpers.ts           # DOM manipulation helpers
│   │   ├── data-transformers.ts     # Data transformation utilities
│   │   └── index.ts                 # Utilities exports
│   │
│   └── index.ts                     # Application entry point
│
├── docs/                            # Documentation and content files
│   ├── modular-architecture-doc.md  # Architecture documentation
│   ├── workflow-documentation.md    # Workflow documentation
│   ├── markdown-format-guide.md     # Guide for markdown formatting
│   ├── visualization-guide.md       # Guide for creating visualizations
│   ├── component-api-reference.md   # API reference documentation
│   ├── theming-guide.md             # Presentation theming guide
│   └── presentation-content/        # Markdown presentation files
│       ├── knowledge-graph-introduction.md  # Main presentation
│       ├── enhanced-knowledge-graph.md      # Enhanced presentation
│       ├── specialized-topics/      # Specialized presentation topics
│       │   ├── kg-for-healthcare.md         # Healthcare industry KGs
│       │   ├── kg-for-finance.md            # Finance industry KGs
│       │   └── kg-for-research.md           # Research-oriented KGs
│       └── components/              # Reusable markdown snippets
│           ├── graph-examples.md            # Reusable graph examples
│           ├── comparison-tables.md         # Reusable comparison tables
│           └── code-samples.md              # Reusable code samples
│
├── public/                          # Static assets
│   ├── index.html                   # Main HTML entry point
│   ├── styles/                      # CSS styles
│   │   ├── main.css                 # Main stylesheet
│   │   ├── theme.css                # Presentation theme
│   │   ├── visualizations.css       # Visualization-specific styles
│   │   └── print.css                # Print-specific styles
│   └── assets/                      # Static assets
│       ├── images/                  # Image resources
│       │   ├── logos/               # Company and project logos
│       │   ├── icons/               # UI and diagram icons
│       │   └── backgrounds/         # Slide backgrounds
│       ├── data/                    # JSON data files
│       │   ├── graph-samples/       # Sample graph datasets
│       │   ├── timelines/           # Timeline datasets
│       │   └── comparisons/         # Comparison datasets
│       └── fonts/                   # Custom fonts
│
├── tests/                           # Test files
│   ├── unit/                        # Unit tests
│   │   ├── modules/                 # Module tests
│   │   │   ├── intro.test.ts        # Intro module tests
│   │   │   ├── core-components.test.ts # Core components tests
│   │   │   └── ...                  # Tests for other modules
│   │   ├── visualizations/          # Visualization tests
│   │   │   ├── graph.test.ts        # Graph visualization tests
│   │   │   ├── timeline.test.ts     # Timeline visualization tests
│   │   │   └── ...                  # Tests for other visualizations
│   │   ├── parser/                  # Parser tests
│   │   │   ├── enhanced-markdown-parser.test.ts # Parser tests
│   │   │   └── ...                  # Tests for other parser components
│   │   ├── services/                # Service tests
│   │   │   ├── markdown-content-registry.test.ts  # Registry tests
│   │   │   ├── presentation-builder.test.ts       # Builder tests
│   │   │   └── ...                  # Tests for other services
│   │   └── utils/                   # Utility tests
│   ├── integration/                 # Integration tests
│   │   ├── parser-visualization.test.ts  # Parser + visualization integration
│   │   ├── services-modules.test.ts      # Services + modules integration
│   │   ├── content-registry-modules.test.ts  # Content registry + modules integration
│   │   └── ...                      # Other integration tests
│   ├── e2e/                         # End-to-end tests
│   │   ├── presentation-loading.test.ts  # Presentation loading tests
│   │   ├── slide-navigation.test.ts      # Slide navigation tests
│   │   └── export-functionality.test.ts  # Export functionality tests
│   ├── mocks/                       # Mock implementations
│   │   ├── styleMock.js             # CSS import mock
│   │   ├── fileMock.js              # File import mock
│   │   ├── cytoscape-mock.js        # Cytoscape library mock
│   │   ├── reveal-mock.js           # Reveal.js library mock
│   │   └── markdown-content-mock.ts # Content registry mock
│   └── setup.ts                     # Jest setup file
│
├── .github/                         # GitHub configuration
│   ├── workflows/                   # GitHub Actions workflows
│   │   ├── ci.yml                   # Continuous Integration workflow
│   │   ├── release.yml              # Release automation workflow
│   │   └── documentation.yml        # Documentation build workflow
│   └── ISSUE_TEMPLATE/              # Issue templates
│       ├── bug_report.md            # Bug report template
│       └── feature_request.md       # Feature request template
│
├── .devcontainer/                   # Development container config
│   ├── Dockerfile                   # Container definition
│   └── devcontainer.json            # VS Code container config
│
├── static/                          # Static files copied by Parcel
│   └── docs/                        # Static docs folder
│       └── presentation-content/    # Presentation markdown copies
│           ├── knowledge-graph-introduction.md  # Copy of main presentation
│           ├── enhanced-knowledge-graph.md      # Copy of enhanced presentation
│           └── specialized-topics/  # Specialized topic copies
│
├── dist/                            # Build output (generated)
├── node_modules/                    # Dependencies (generated)
│
├── package.json                     # Project metadata and dependencies
├── tsconfig.json                    # TypeScript configuration
├── .parcelrc                        # Parcel configuration
├── jest.config.js                   # Jest test configuration
├── webpack.config.js                # Webpack configuration
├── .gitignore                       # Git ignore rules
├── .prettierrc                      # Prettier code formatter config
├── .eslintrc.js                     # ESLint configuration
├── CHANGELOG.md                     # Project change log
├── LICENSE                          # Project license
└── README.md                        # Project documentation
```
