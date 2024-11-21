declare module 'particles.js' {
  export function particlesJS(tagId: string, options: Record<string, unknown>): void;
}

interface Window {
  particlesJS: (tagId: string, options: Record<string, unknown>) => void;
}
