import { useState, useEffect } from 'react';
import { EventPlan } from '../../domain/types';
import { storage } from '../../infrastructure/storage/localStorageAdapter';
import { ActiveTab } from '../components/Navbar';

export function useAppEvents(initialPlan: EventPlan) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentPlan, setCurrentPlan] = useState<EventPlan>(initialPlan);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; isError: boolean } | null>(
    null
  );

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const events = await storage.listEvents();
        if (events.length > 0) {
          const loaded = await storage.loadEvent(events[0].id);
          if (loaded) {
            setCurrentPlan(loaded);
            return;
          }
        }
        await storage.saveEvent(initialPlan);
      } catch (err) {
        console.error('Storage initialization notice:', err);
      }
    };
    initialize();
  }, [initialPlan]);

  const handleSavePlan = async (updated: EventPlan) => {
    setCurrentPlan(updated);
    try {
      await storage.saveEvent(updated);
    } catch (err) {
      console.error('Failed to persist plan:', err);
    }
  };

  const handleSelectEvent = async (id: string) => {
    const loaded = await storage.loadEvent(id);
    if (loaded) {
      setCurrentPlan(loaded);
      setActiveTab('dashboard');
    }
  };

  const handleExportJson = async () => {
    try {
      const jsonStr = await storage.exportEventJson(currentPlan.id);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gatherly-event-${currentPlan.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Export failed.';
      showNotification(message, true);
    }
  };

  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const content = ev.target?.result as string;
          const imported = await storage.importEventJson(content);
          setCurrentPlan(imported);
          setActiveTab('dashboard');
          showNotification(`Successfully imported: "${imported.title}"! ✅`);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Import failed.';
          showNotification(message, true);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return {
    activeTab,
    setActiveTab,
    currentPlan,
    isWizardOpen,
    setIsWizardOpen,
    isSwitchModalOpen,
    setIsSwitchModalOpen,
    notification,
    handleSavePlan,
    handleSelectEvent,
    handleExportJson,
    handleImportJson,
  };
}
