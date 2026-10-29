import React from 'react';
import { KawaiiBow, KawaiiBunnyMascot } from './KawaiiDecorations';
import { useNavbarAiProvider } from './Navbar/useNavbarAiProvider';
import { NavbarActions } from './Navbar/NavbarActions';
import { NavbarTabs } from './Navbar/NavbarTabs';

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
  const { providerType, aiStatus, toggleProvider } = useNavbarAiProvider();

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
        <NavbarActions
          providerType={providerType}
          aiStatus={aiStatus}
          onToggleProvider={toggleProvider}
          onNewEvent={onNewEvent}
          onExport={onExport}
          onImport={onImport}
        />
      </div>

      {/* Navigation Tabs */}
      <NavbarTabs activeTab={activeTab} onSelectTab={onSelectTab} />
    </header>
  );
};
