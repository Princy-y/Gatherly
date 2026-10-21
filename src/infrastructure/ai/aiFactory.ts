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

export function getAIProvider(): IAIProvider {
  return currentProviderType === 'local' ? ollamaInstance : demoInstance;
}

export function setAIProviderType(type: 'demo' | 'local'): void {
  currentProviderType = type;
}

export function getCurrentAIProviderType(): 'demo' | 'local' {
  return currentProviderType;
}
