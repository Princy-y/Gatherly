import React, { useState, useEffect } from 'react';
import { KawaiiBow, KawaiiSparkle, KawaiiBunnyMascot } from './KawaiiDecorations';
import {
  getCurrentAIProviderType,
  setAIProviderType,
  getAIProvider,
} from '../../infrastructure/ai/aiFactory';
import { AIProviderStatus } from '../../infrastructure/ai/aiInterface';
import {
  Sparkles,
  Calendar,
  Wallet,
  Users,
  Compass,
  SlidersHorizontal,
  PlusCircle,
  Download,
  Upload,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'budget' | 'timeline' | 'vendors' | 'inspiration' | 'whatif';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  eventTitle: string;
  eventType: string;
  onNewEvent: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  eventTitle,
  eventType,
  onNewEvent,
  onExport,
  onImport,
}) => {
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

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Sparkles className="w-4 h-4 text-plum" /> },
    { id: 'budget', label: 'Budget Studio', icon: <Wallet className="w-4 h-4 text-plum" /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4 text-plum" /> },
    { id: 'vendors', label: 'Vendors', icon: <Users className="w-4 h-4 text-plum" /> },
    { id: 'inspiration', label: 'Inspiration', icon: <Compass className="w-4 h-4 text-plum" /> },
    {
      id: 'whatif',
      label: 'What-If Replanner',
      icon: <SlidersHorizontal className="w-4 h-4 text-plum" />,
      badge: 'Signature',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b-2 border-plum shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="relative group cursor-pointer"
            onClick={onNewEvent}
            title="Create or Switch Event"
          >
            <div className="w-11 h-11 bg-blush-200 border-2 border-plum rounded-2xl flex items-center justify-center shadow-kawaii-sm group-hover:rotate-6 transition-transform">
              <KawaiiBunnyMascot size={32} />
            </div>
            <div className="absolute -top-1 -right-1">
              <KawaiiBow size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xl tracking-tight text-plum">
                Gatherly<span className="text-lavender-300 font-extrabold">AI</span>
              </span>
              <span className="kawaii-badge bg-blush-100 text-plum text-xs">✨ Kawaii Studio</span>
            </div>
            <p className="text-xs text-plum-light font-medium truncate max-w-[220px] sm:max-w-xs">
              {eventTitle ? `🌸 ${eventTitle} (${eventType})` : 'Constraint-Aware Event Planning'}
            </p>
          </div>
        </div>

        {/* Action Controls & AI Status */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* AI Provider Switcher */}
          <button
            onClick={toggleProvider}
            title={`Click to switch between Demo Mode and Local Ollama (qwen2.5:3b)`}
            className={`kawaii-badge transition-all cursor-pointer ${
              aiStatus?.isAvailable
                ? providerType === 'local'
                  ? 'bg-mint-200 text-plum'
                  : 'bg-butter-200 text-plum'
                : 'bg-blush-200 text-plum'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                aiStatus?.isAvailable ? 'bg-green-600 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="font-semibold">
              {providerType === 'local'
                ? 'Local Ollama (qwen2.5:3b)'
                : 'Demo Engine (Offline Safe)'}
            </span>
            <span className="text-[10px] bg-white/70 px-1 rounded border border-plum/30">
              Switch
            </span>
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
      </div>

      {/* Navigation Tabs */}
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6">
        <ul className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl font-bold text-xs sm:text-sm border-t-2 border-x-2 transition-all relative ${
                    isActive
                      ? 'bg-white border-plum text-plum -mb-[2px] shadow-sm'
                      : 'bg-transparent border-transparent text-plum-light hover:text-plum hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-extrabold bg-blush-200 text-plum px-1.5 py-0.5 rounded-full border border-plum">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -top-1.5 right-1">
                      <KawaiiSparkle size={12} />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
