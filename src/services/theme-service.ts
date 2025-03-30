/**
 * Interface for theme settings
 */
export interface ThemeSettings {
    id: string;
    name: string;
    cssFile: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      [key: string]: string;
    };
    fonts: {
      heading: string;
      body: string;
      code: string;
    };
    transitionDefault?: string;
  }
  
  /**
   * Service for managing presentation themes
   */
  export class ThemeService {
    private themes: Map<string, ThemeSettings> = new Map();
    private activeTheme: string | null = null;
    private themeLinkElement: HTMLLinkElement | null = null;
    
    /**
     * Initializes the theme service
     */
    constructor() {
      this.registerDefaultThemes();
    }
    
    /**
     * Registers a new theme
     * @param theme Theme settings
     * @returns The theme service instance for chaining
     */
    registerTheme(theme: ThemeSettings): ThemeService {
      this.themes.set(theme.id, theme);
      return this;
    }
    
    /**
     * Activates a theme by ID
     * @param themeId Theme identifier
     * @returns The theme service instance for chaining
     */
    activateTheme(themeId: string): ThemeService {
      if (!this.themes.has(themeId)) {
        console.warn(`Theme '${themeId}' not found. Using default theme.`);
        themeId = 'black';
      }
      
      const theme = this.themes.get(themeId)!;
      this.activeTheme = themeId;
      
      // Apply theme CSS
      this.applyThemeCSS(theme.cssFile);
      
      // Apply theme colors to CSS variables
      this.applyThemeColors(theme.colors);
      
      // Apply theme fonts
      this.applyThemeFonts(theme.fonts);
      
      return this;
    }
    
    /**
     * Gets the active theme settings
     * @returns Active theme settings or null if no theme is active
     */
    getActiveTheme(): ThemeSettings | null {
      return this.activeTheme ? this.themes.get(this.activeTheme) || null : null;
    }
    
    /**
     * Gets all registered themes
     * @returns Array of theme settings
     */
    getAllThemes(): ThemeSettings[] {
      return Array.from(this.themes.values());
    }
    
    /**
     * Applies theme CSS by loading the CSS file
     * @param cssFile Path to the CSS file
     */
    private applyThemeCSS(cssFile: string): void {
      // Create or update link element for theme CSS
      if (!this.themeLinkElement) {
        this.themeLinkElement = document.createElement('link');
        this.themeLinkElement.rel = 'stylesheet';
        document.head.appendChild(this.themeLinkElement);
      }
      
      this.themeLinkElement.href = cssFile;
    }
    
    /**
     * Applies theme colors by setting CSS variables
     * @param colors Theme color object
     */
    private applyThemeColors(colors: ThemeSettings['colors']): void {
      // Set CSS variables for colors
      const root = document.documentElement;
      Object.entries(colors).forEach(([key, value]) => {
        root.style.setProperty(`--kg-${key}`, value);
      });
    }
    
    /**
     * Applies theme fonts by setting CSS variables
     * @param fonts Theme font object
     */
    private applyThemeFonts(fonts: ThemeSettings['fonts']): void {
      // Set CSS variables for fonts
      const root = document.documentElement;
      root.style.setProperty('--heading-font', fonts.heading);
      root.style.setProperty('--body-font', fonts.body);
      root.style.setProperty('--code-font', fonts.code);
    }
    
    /**
     * Registers the default built-in themes
     */
    private registerDefaultThemes(): void {
      // Register Reveal.js built-in themes
      const defaultThemes = [
        {
          id: 'black',
          name: 'Black',
          cssFile: 'node_modules/reveal.js/dist/theme/black.css',
          colors: {
            primary: '#2a76dd',
            secondary: '#61dafb',
            background: '#191919',
            text: '#fff'
          },
          fonts: {
            heading: "'Source Sans Pro', Helvetica, sans-serif",
            body: "'Source Sans Pro', Helvetica, sans-serif",
            code: "'Source Code Pro', monospace"
          }
        },
        {
          id: 'white',
          name: 'White',
          cssFile: 'node_modules/reveal.js/dist/theme/white.css',
          colors: {
            primary: '#2a76dd',
            secondary: '#61dafb',
            background: '#fff',
            text: '#222'
          },
          fonts: {
            heading: "'Source Sans Pro', Helvetica, sans-serif",
            body: "'Source Sans Pro', Helvetica, sans-serif",
            code: "'Source Code Pro', monospace"
          }
        },
        {
          id: 'league',
          name: 'League',
          cssFile: 'node_modules/reveal.js/dist/theme/league.css',
          colors: {
            primary: '#13DAEC',
            secondary: '#FF4081',
            background: '#2b2b2b',
            text: '#eee'
          },
          fonts: {
            heading: "'League Gothic', Impact, sans-serif",
            body: "'Lato', sans-serif",
            code: "'Source Code Pro', monospace"
          }
        },
        {
          id: 'kg-modern',
          name: 'Knowledge Graph Modern',
          cssFile: 'public/styles/theme.css',
          colors: {
            primary: '#2458B3',
            secondary: '#36B37E',
            accent: '#FF5630',
            dark: '#172B4D',
            light: '#F4F5F7',
            gray: '#6B778C',
            'node-entity': '#4C9AFF',
            'node-relationship': '#FF8F73',
            'node-property': '#79E2F2',
            'node-concept': '#C0B6F2',
            'node-process': '#FFC400',
            'node-io': '#57D9A3'
          },
          fonts: {
            heading: "'Roboto', 'Segoe UI', -apple-system, sans-serif",
            body: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            code: "'Fira Code', 'Consolas', monospace"
          },
          transitionDefault: 'fade'
        }
      ];
      
      defaultThemes.forEach(theme => {
        this.registerTheme(theme as ThemeSettings);
      });
    }
  }
  
  // Create a singleton instance
  export const themeService = new ThemeService();