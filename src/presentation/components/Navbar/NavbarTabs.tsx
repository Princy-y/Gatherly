import React from 'react';
import { ActiveTab } from '../Navbar';
import { KawaiiSparkle } from '../KawaiiDecorations';
import { Calendar, Compass, SlidersHorizontal, Sparkles, Users, Wallet } from 'lucide-react';

interface NavbarTabsProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
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

export const NavbarTabs: React.FC<NavbarTabsProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6">
      <ul className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {NAV_ITEMS.map((item) => {
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
  );
};
