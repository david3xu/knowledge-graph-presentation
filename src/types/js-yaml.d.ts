declare module 'js-yaml' {
  export function load(str: string, options?: any): any;
  export function loadAll(str: string, iterator: (doc: any) => void, options?: any): any;
  export function dump(obj: any, options?: any): string;
  export function safeDump(obj: any, options?: any): string;
} 