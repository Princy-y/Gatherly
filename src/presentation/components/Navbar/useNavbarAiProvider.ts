import { useState, useEffect } from 'react';
import {
  getCurrentAIProviderType,
  setAIProviderType,
  getAIProvider,
} from '../../../infrastructure/ai/aiFactory';
import { AIProviderStatus } from '../../../infrastructure/ai/aiInterface';

export function useNavbarAiProvider() {
  const [providerType, setProviderState] = useState<'demo' | 'local'>(getCurrentAIProviderType());
  const [aiStatus, setAiStatus] = useState<AIProviderStatus | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const status = await getAIProvider().getStatus();
        if (isMounted) setAiStatus(status);
      } catch {
        if (isMounted) {
          setAiStatus({
            name: providerType === 'local' ? 'Local Ollama' : 'Demo Engine',
            type: providerType,
            isAvailable: false,
            modelName: 'qwen2.5:3b',
            statusMessage: 'Offline',
          });
        }
      }
    };
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [providerType]);

  const toggleProvider = () => {
    const next = providerType === 'demo' ? 'local' : 'demo';
    setAIProviderType(next);
    setProviderState(next);
  };

  return {
    providerType,
    aiStatus,
    toggleProvider,
  };
}
