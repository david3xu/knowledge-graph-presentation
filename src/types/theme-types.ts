/**
 * Type definitions for theming and styling configurations
 * Provides interfaces for color schemes, typography, spacing, and responsive design
 */

/**
 * Base color palette definition
 */
export interface ColorPalette {
    /** Primary brand color */
    primary: string;
    
    /** Secondary brand color */
    secondary: string;
    
    /** Accent color for highlights and emphasis */
    accent: string;
    
    /** Background color */
    background: string;
    
    /** Surface color for cards, modals, etc. */
    surface: string;
    
    /** Text color */
    text: string;
    
    /** Muted or secondary text color */
    textMuted: string;
    
    /** Border color */
    border: string;
    
    /** Success color for positive feedback */
    success: string;
    
    /** Warning color for cautionary feedback */
    warning: string;
    
    /** Error color for negative feedback */
    error: string;
    
    /** Info color for informational feedback */
    info: string;
  }
  
  /**
   * Extended color palette with variations
   */
  export interface ExtendedColorPalette extends ColorPalette {
    /** Primary color variations */
    primaryVariants: {
      /** Lighter variation of primary color */
      light: string;
      
      /** Darker variation of primary color */
      dark: string;
      
      /** Very light tint of primary color */
      extraLight?: string;
      
      /** Very dark shade of primary color */
      extraDark?: string;
    };
    
    /** Secondary color variations */
    secondaryVariants: {
      /** Lighter variation of secondary color */
      light: string;
      
      /** Darker variation of secondary color */
      dark: string;
      
      /** Very light tint of secondary color */
      extraLight?: string;
      
      /** Very dark shade of secondary color */
      extraDark?: string;
    };
    
    /** Accent color variations */
    accentVariants: {
      /** Lighter variation of accent color */
      light: string;
      
      /** Darker variation of accent color */
      dark: string;
      
      /** Very light tint of accent color */
      extraLight?: string;
      
      /** Very dark shade of accent color */
      extraDark?: string;
    };
    
    /** Background color variations */
    backgroundVariants: {
      /** Darker variation of background color */
      dark: string;
      
      /** Lighter variation of background color */
      light: string;
      
      /** Alternative background color */
      alt: string;
    };
    
    /** Surface color variations */
    surfaceVariants: {
      /** Elevated surface color */
      elevated: string;
      
      /** Sunken surface color */
      sunken: string;
      
      /** Alternative surface color */
      alt: string;
    };
    
    /** Gray scale palette */
    gray: {
      /** 100 (very light gray) */
      100: string;
      
      /** 200 (light gray) */
      200: string;
      
      /** 300 (gray) */
      300: string;
      
      /** 400 (medium gray) */
      400: string;
      
      /** 500 (dark gray) */
      500: string;
      
      /** 600 (darker gray) */
      600: string;
      
      /** 700 (very dark gray) */
      700: string;
      
      /** 800 (nearly black) */
      800: string;
      
      /** 900 (black) */
      900: string;
    };
    
    /** Semantic color mappings */
    semantic: {
      /** Knowledge entity color */
      entity: string;
      
      /** Relationship color */
      relationship: string;
      
      /** Property color */
      property: string;
      
      /** Process color */
      process: string;
      
      /** Input/output color */
      io: string;
      
      /** Decision color */
      decision: string;
      
      /** Concept color */
      concept: string;
      
      /** Start node color */
      start: string;
      
      /** End node color */
      end: string;
    };
  }
  
  /**
   * Font configuration
   */
  export interface FontConfiguration {
    /** Primary font family */
    primary: string;
    
    /** Secondary font family */
    secondary?: string;
    
    /** Monospace font family for code */
    mono: string;
    
    /** Base font size in pixels */
    baseSize: number;
    
    /** Line height ratio (unitless) */
    lineHeight: number;
    
    /** Font weights */
    weights: {
      /** Light font weight */
      light: number;
      
      /** Regular font weight */
      regular: number;
      
      /** Medium font weight */
      medium: number;
      
      /** Semi-bold font weight */
      semiBold: number;
      
      /** Bold font weight */
      bold: number;
      
      /** Extra-bold font weight */
      extraBold?: number;
    };
    
    /** Letter spacing in pixels or ems */
    letterSpacing?: string;
  }
  
  /**
   * Typography scale configuration
   */
  export interface TypographyScale {
    /** Heading level 1 */
    h1: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Heading level 2 */
    h2: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Heading level 3 */
    h3: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Heading level 4 */
    h4: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Body text (normal) */
    body: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Body text (small) */
    bodySmall: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Body text (large) */
    bodyLarge: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Caption text */
    caption: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Margin bottom */
      marginBottom?: string;
    };
    
    /** Button text */
    button: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
      
      /** Text transform */
      textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    };
    
    /** Code text */
    code: {
      /** Font size */
      fontSize: string;
      
      /** Line height */
      lineHeight: number;
      
      /** Font weight */
      fontWeight: number;
      
      /** Letter spacing */
      letterSpacing?: string;
    };
  }
  
  /**
   * Spacing scale configuration
   */
  export interface SpacingScale {
    /** Base unit in pixels */
    baseUnit: number;
    
    /** Extra small spacing (1x base) */
    xs: string;
    
    /** Small spacing (2x base) */
    sm: string;
    
    /** Medium spacing (3x base) */
    md: string;
    
    /** Large spacing (4x base) */
    lg: string;
    
    /** Extra large spacing (6x base) */
    xl: string;
    
    /** Extra extra large spacing (8x base) */
    xxl: string;
    
    /** Multiplier function to generate custom spacing values */
    getSpacing?: (multiplier: number) => string;
  }
  
  /**
   * Border and radius configuration
   */
  export interface BorderConfig {
    /** Border radius scale */
    radius: {
      /** No border radius */
      none: string;
      
      /** Small border radius */
      sm: string;
      
      /** Medium border radius */
      md: string;
      
      /** Large border radius */
      lg: string;
      
      /** Full radius (circular) */
      full: string;
    };
    
    /** Border width scale */
    width: {
      /** No border */
      none: string;
      
      /** Thin border */
      thin: string;
      
      /** Medium border */
      medium: string;
      
      /** Thick border */
      thick: string;
    };
  }
  
  /**
   * Shadow configuration
   */
  export interface ShadowConfig {
    /** No shadow */
    none: string;
    
    /** Small shadow */
    sm: string;
    
    /** Medium shadow */
    md: string;
    
    /** Large shadow */
    lg: string;
    
    /** Extra large shadow */
    xl: string;
    
    /** Inner shadow */
    inner: string;
  }
  
  /**
   * Breakpoint configuration for responsive design
   */
  export interface BreakpointConfig {
    /** Extra small screens (phones) */
    xs: number;
    
    /** Small screens (tablets) */
    sm: number;
    
    /** Medium screens (laptops) */
    md: number;
    
    /** Large screens (desktops) */
    lg: number;
    
    /** Extra large screens (large desktops) */
    xl: number;
  }
  
  /**
   * Animation timings configuration
   */
  export interface AnimationTimingConfig {
    /** Very fast animation */
    veryFast: number;
    
    /** Fast animation */
    fast: number;
    
    /** Normal animation */
    normal: number;
    
    /** Slow animation */
    slow: number;
    
    /** Very slow animation */
    verySlow: number;
  }
  
  /**
   * Z-index configuration for stacking elements
   */
  export interface ZIndexConfig {
    /** Base z-index level */
    base: number;
    
    /** Dropdown level */
    dropdown: number;
    
    /** Sticky element level */
    sticky: number;
    
    /** Fixed element level */
    fixed: number;
    
    /** Modal backdrop level */
    modalBackdrop: number;
    
    /** Modal level */
    modal: number;
    
    /** Tooltip level */
    tooltip: number;
  }
  
  /**
   * SVG icon configuration
   */
  export interface IconConfig {
    /** Base icon size in pixels */
    baseSize: number;
    
    /** Small icon size */
    small: number;
    
    /** Medium icon size */
    medium: number;
    
    /** Large icon size */
    large: number;
    
    /** Default icon color */
    defaultColor: string;
  }
  
  /**
   * Chart and visualization style configuration
   */
  export interface ChartStyleConfig {
    /** Default chart colors */
    colors: string[];
    
    /** Chart background color */
    backgroundColor: string;
    
    /** Axis line color */
    axisColor: string;
    
    /** Grid line color */
    gridColor: string;
    
    /** Label text color */
    labelColor: string;
    
    /** Tooltip background color */
    tooltipBackground: string;
    
    /** Tooltip text color */
    tooltipTextColor: string;
    
    /** Legend text color */
    legendTextColor: string;
    
    /** Areas to maintain padding in charts */
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }
  
  /**
   * Component-specific styling
   */
  export interface ComponentStyles {
    /** Button styles */
    button: {
      /** Border radius */
      borderRadius: string;
      
      /** Padding */
      padding: string;
      
      /** Font weight */
      fontWeight: number;
      
      /** Transition duration */
      transition: string;
      
      /** Button variants */
      variants: {
        /** Primary button style */
        primary: {
          backgroundColor: string;
          textColor: string;
          hoverBackgroundColor: string;
          activeBackgroundColor: string;
        };
        
        /** Secondary button style */
        secondary: {
          backgroundColor: string;
          textColor: string;
          hoverBackgroundColor: string;
          activeBackgroundColor: string;
        };
        
        /** Outline button style */
        outline: {
          backgroundColor: string;
          textColor: string;
          borderColor: string;
          hoverBackgroundColor: string;
          activeBackgroundColor: string;
        };
      };
    };
    
    /** Card styles */
    card: {
      /** Background color */
      backgroundColor: string;
      
      /** Border radius */
      borderRadius: string;
      
      /** Shadow */
      shadow: string;
      
      /** Padding */
      padding: string;
    };
    
    /** Form input styles */
    input: {
      /** Height */
      height: string;
      
      /** Border radius */
      borderRadius: string;
      
      /** Border color */
      borderColor: string;
      
      /** Focus border color */
      focusBorderColor: string;
      
      /** Background color */
      backgroundColor: string;
      
      /** Padding */
      padding: string;
    };
    
    /** Table styles */
    table: {
      /** Border color */
      borderColor: string;
      
      /** Header background color */
      headerBackgroundColor: string;
      
      /** Header text color */
      headerTextColor: string;
      
      /** Row hover background color */
      rowHoverColor: string;
      
      /** Striped row background color */
      stripedRowColor: string;
    };
    
    /** Additional component styles */
    [key: string]: any;
  }
  
  /**
   * Complete theme configuration
   */
  export interface ThemeConfig {
    /** Theme name */
    name: string;
    
    /** Theme mode */
    mode: 'light' | 'dark' | 'auto';
    
    /** Color palette */
    colors: ExtendedColorPalette;
    
    /** Typography configuration */
    typography: {
      /** Font configuration */
      fonts: FontConfiguration;
      
      /** Typography scale */
      scale: TypographyScale;
    };
    
    /** Spacing configuration */
    spacing: SpacingScale;
    
    /** Border configuration */
    borders: BorderConfig;
    
    /** Shadow configuration */
    shadows: ShadowConfig;
    
    /** Breakpoints for responsive design */
    breakpoints: BreakpointConfig;
    
    /** Animation timings */
    animations: AnimationTimingConfig;
    
    /** Z-index levels */
    zIndex: ZIndexConfig;
    
    /** Icon configuration */
    icons: IconConfig;
    
    /** Chart and visualization styling */
    charts: ChartStyleConfig;
    
    /** Component-specific styling */
    components: ComponentStyles;
    
    /** Custom theme properties */
    [key: string]: any;
  }
  
  /**
   * Theme overrides for specific slides or components
   */
  export interface ThemeOverrides {
    /** Slide-specific overrides by slide ID */
    slides?: Record<string, Partial<ThemeConfig>>;
    
    /** Component-specific overrides by component type */
    components?: Record<string, any>;
    
    /** Visualization-specific overrides */
    visualizations?: Record<string, any>;
  }
  
  /**
   * Global theme management configuration
   */
  export interface ThemeManagerConfig {
    /** Default theme */
    defaultTheme: ThemeConfig;
    
    /** Additional available themes */
    alternativeThemes?: Record<string, ThemeConfig>;
    
    /** Theme overrides */
    overrides?: ThemeOverrides;
    
    /** Whether to enable automatic dark mode switching */
    enableAutoDarkMode?: boolean;
    
    /** Custom CSS variables to inject */
    customVariables?: Record<string, string>;
  }