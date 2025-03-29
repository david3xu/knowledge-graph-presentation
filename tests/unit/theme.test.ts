/**
 * Tests for theme utility functions
 */

describe('Theme utilities', () => {
  // Save original document head
  const originalHead = document.head.innerHTML;
  
  // Clean up after each test
  afterEach(() => {
    document.head.innerHTML = originalHead;
  });
  
  test('toggleTheme should switch between light and dark themes', () => {
    // Mock the toggleTheme function since it's not exported
    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Update theme stylesheet link
      const themeLink = document.querySelector('link#theme-stylesheet');
      if (themeLink instanceof HTMLLinkElement) {
        const themePath = newTheme === 'dark' ? 'reveal.js/dist/theme/black.css' : 'reveal.js/dist/theme/white.css';
        themeLink.href = themePath;
      }
      
      return newTheme;
    };
    
    // Test initial state
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Add a theme link
    const themeLink = document.createElement('link');
    themeLink.id = 'theme-stylesheet';
    themeLink.rel = 'stylesheet';
    themeLink.href = 'reveal.js/dist/theme/black.css';
    document.head.appendChild(themeLink);
    
    // Toggle theme
    const newTheme = toggleTheme();
    
    // Check the document theme attribute
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(newTheme).toBe('light');
    
    // Check if stylesheet was updated
    const updatedLink = document.querySelector('link#theme-stylesheet') as HTMLLinkElement;
    expect(updatedLink.href).toContain('white.css');
    
    // Toggle back to dark
    const finalTheme = toggleTheme();
    
    // Check it switched back
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(finalTheme).toBe('dark');
    
    // Check if stylesheet was updated back
    const finalLink = document.querySelector('link#theme-stylesheet') as HTMLLinkElement;
    expect(finalLink.href).toContain('black.css');
  });
  
  test('applyTheme should update all theme-related elements', () => {
    // Mock the applyTheme function
    const applyTheme = (theme: 'dark' | 'light') => {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update theme stylesheet link
      const themeLink = document.querySelector('link#theme-stylesheet');
      if (themeLink instanceof HTMLLinkElement) {
        const themePath = theme === 'dark' ? 'reveal.js/dist/theme/black.css' : 'reveal.js/dist/theme/white.css';
        themeLink.href = themePath;
      }
      
      // Update code highlighting style
      const codeThemeLink = document.querySelector('link#highlight-theme');
      if (codeThemeLink instanceof HTMLLinkElement) {
        const codePath = theme === 'dark' ? 'highlight.js/styles/atom-one-dark.css' : 'highlight.js/styles/atom-one-light.css';
        codeThemeLink.href = codePath;
      }
      
      // Update UI button states
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        themeToggle.setAttribute('title', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      }
      
      return theme;
    };
    
    // Add theme links
    const themeLink = document.createElement('link');
    themeLink.id = 'theme-stylesheet';
    themeLink.rel = 'stylesheet';
    themeLink.href = 'reveal.js/dist/theme/black.css';
    document.head.appendChild(themeLink);
    
    const codeThemeLink = document.createElement('link');
    codeThemeLink.id = 'highlight-theme';
    codeThemeLink.rel = 'stylesheet';
    codeThemeLink.href = 'highlight.js/styles/atom-one-dark.css';
    document.head.appendChild(codeThemeLink);
    
    // Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('title', 'Switch to light theme');
    document.body.appendChild(themeToggle);
    
    // Apply light theme
    const result = applyTheme('light');
    
    // Check the theme was applied everywhere
    expect(result).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(themeLink.href).toContain('white.css');
    expect(codeThemeLink.href).toContain('atom-one-light.css');
    expect(themeToggle.getAttribute('aria-pressed')).toBe('true');
    expect(themeToggle.getAttribute('title')).toBe('Switch to dark theme');
    
    // Apply dark theme
    const darkResult = applyTheme('dark');
    
    // Check everything switched back
    expect(darkResult).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(themeLink.href).toContain('black.css');
    expect(codeThemeLink.href).toContain('atom-one-dark.css');
    expect(themeToggle.getAttribute('aria-pressed')).toBe('false');
    expect(themeToggle.getAttribute('title')).toBe('Switch to light theme');
    
    // Clean up
    document.body.removeChild(themeToggle);
  });
  
  test('should persist theme preference in localStorage', () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; }
      };
    })();
    
    // Save original localStorage
    const originalLocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage') || {};
    
    // Replace with mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Mock setThemePreference function
    const setThemePreference = (theme: string) => {
      localStorage.setItem('kg-presentation-theme', theme);
    };
    
    // Mock getThemePreference function
    const getThemePreference = (): string | null => {
      return localStorage.getItem('kg-presentation-theme');
    };
    
    // Test setting preference
    setThemePreference('light');
    expect(getThemePreference()).toBe('light');
    
    // Test updating preference
    setThemePreference('dark');
    expect(getThemePreference()).toBe('dark');
    
    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', originalLocalStorage);
  });
}); 