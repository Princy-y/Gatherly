import React from 'react';
import { AIProviderStatus } from '../../../infrastructure/ai/aiInterface';
import { Download, PlusCircle, Upload } from 'lucide-react';

interface NavbarActionsProps {
  providerType: 'demo' | 'local';
  aiStatus: AIProviderStatus | null;
  onToggleProvider: () => void;
  onNewEvent: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({
  providerType,
  aiStatus,
  onToggleProvider,
  onNewEvent,
  onExport,
  onImport,
}) => {
  const badgeColorClass = aiStatus?.isAvailable
    ? providerType === 'local'
      ? 'bg-mint-200 text-plum'
      : 'bg-butter-200 text-plum'
    : 'bg-blush-200 text-plum';

  return (
    <div className="flex items-center flex-wrap gap-2 text-xs">
      {/* AI Provider Switcher */}
      <button
        onClick={onToggleProvider}
        title="Click to switch between Demo Mode and Local Ollama (qwen2.5:3b)"
        className={`kawaii-badge transition-all cursor-pointer ${badgeColorClass}`}
      >
        <span
          className={`w-2 h-2 rounded-full inline-block ${
            aiStatus?.isAvailable ? 'bg-green-600 animate-pulse' : 'bg-red-500'
          }`}
        />
        <span className="font-semibold">
          {providerType === 'local' ? 'Local Ollama (qwen2.5:3b)' : 'Demo Engine (Offline Safe)'}
        </span>
        <span className="text-[10px] bg-white/70 px-1 rounded border border-plum/30">Switch</span>
      </button>

      {/* Quick Actions */}
      <button
        onClick={onNewEvent}
        className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 border border-plum"
        aria-label="New Event"
      >
        <PlusCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">New Event</span>
      </button>

      <button
        onClick={onExport}
        className="btn-kawaii bg-iceBlue-200 hover:bg-iceBlue-300 text-plum p-1.5 rounded-xl border border-plum"
        title="Export Event JSON"
        aria-label="Export Event"
      >
        <Download className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={onImport}
        className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum p-1.5 rounded-xl border border-plum"
        title="Import Event JSON"
        aria-label="Import Event"
      >
        <Upload className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
