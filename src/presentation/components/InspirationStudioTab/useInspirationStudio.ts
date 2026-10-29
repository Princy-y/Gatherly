import { useState, useEffect, useCallback } from 'react';
import { EventPlan } from '../../../domain/types';
import { getAIProvider } from '../../../infrastructure/ai/aiFactory';
import { InspirationStudioOutput } from '../../../infrastructure/ai/aiInterface';

export function useInspirationStudio(plan: EventPlan) {
  const [inspiration, setInspiration] = useState<InspirationStudioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const fetchInspiration = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const provider = getAIProvider();
      const { data } = await provider.generateInspiration({
        eventType: plan.eventType,
        title: plan.title,
        preferences: plan.preferences || 'Dreamy pastel aesthetic',
        guestCount: plan.guestCount,
        budgetLimitPaise: plan.budgetLimitPaise,
      });
      setInspiration(data);
    } catch (err: unknown) {
      console.error('Failed to generate inspiration:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Could not fetch creative inspiration.');
    } finally {
      setIsLoading(false);
    }
  }, [plan.eventType, plan.title, plan.preferences, plan.guestCount, plan.budgetLimitPaise]);

  useEffect(() => {
    void fetchInspiration();
  }, [fetchInspiration]);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return {
    inspiration,
    isLoading,
    errorMsg,
    copiedHex,
    fetchInspiration,
    copyToClipboard,
  };
}
