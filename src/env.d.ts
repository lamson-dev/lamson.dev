/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Typewriter Effect - External library loaded via CDN
interface TypewriterConfig {
  cursor?: string;
  loop?: boolean;
  delay?: number;
  deleteSpeed?: number;
}

declare global {
  class Typewriter {
    constructor(element: HTMLElement | null, config?: TypewriterConfig);
    pauseFor(duration: number): Typewriter;
    typeString(text: string): Typewriter;
    deleteChars(count: number): Typewriter;
    start(): void;
  }
}

export {};
