import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia if not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock canvas-confetti in JSDOM to prevent canvas animation errors
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
  __esModule: true,
}));
