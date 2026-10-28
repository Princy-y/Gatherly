import { IAIProvider } from './aiInterface';
import { DemoAdapter } from './demoAdapter';
import { OllamaAdapter } from './ollamaAdapter';

let currentProviderType: 'demo' | 'local' =
  (import.meta.env?.VITE_AI_PROVIDER as 'demo' | 'local') || 'demo';

const demoInstance = new DemoAdapter();
const ollamaInstance = new OllamaAdapter(
  import.meta.env?.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
  import.meta.env?.VITE_OLLAMA_MODEL || 'qwen2.5:3b'
);

/**
 * Returns the active {@link IAIProvider} instance.
 * Defaults to {@link DemoAdapter} (production-safe, no network calls).
 * Switch to `'local'` via {@link setAIProviderType} or the `VITE_AI_PROVIDER` env var.
 */
export function getAIProvider(): IAIProvider {
  return currentProviderType === 'local' ? ollamaInstance : demoInstance;
}

/**
 * Switches the active AI provider at runtime.
 * `'demo'` is the production-safe offline adapter; `'local'` requires a running Ollama instance.
 *
 * @param type - `'demo'` for the offline deterministic adapter or `'local'` for Ollama.
 */
export function setAIProviderType(type: 'demo' | 'local'): void {
  currentProviderType = type;
}

/**
 * Returns the currently active AI provider type string.
 * Useful for rendering the engine status badge in the UI.
 */
export function getCurrentAIProviderType(): 'demo' | 'local' {
  return currentProviderType;
}
