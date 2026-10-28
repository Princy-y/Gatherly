import React from 'react';
import { EventType } from '../../../domain/types';
import { KawaiiBow } from '../KawaiiDecorations';

interface TemplateStartersProps {
  onSelectTemplate: (type: EventType) => void;
}

export const TemplateStarters: React.FC<TemplateStartersProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-6 p-3 bg-lavender-50 border-2 border-lavender-border rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-plum flex items-center gap-1.5">
          <KawaiiBow size={16} /> Quick Sample Templates:
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onSelectTemplate('wedding')}
          className="text-left text-xs p-2 rounded-lg border border-plum/30 bg-white hover:bg-blush-100 transition-colors"
        >
          <div className="font-bold text-plum">💒 Pastel Wedding</div>
          <div className="text-[11px] text-plum-light">₹15 Lakhs • 150 Guests</div>
        </button>
        <button
          type="button"
          onClick={() => onSelectTemplate('birthday')}
          className="text-left text-xs p-2 rounded-lg border border-plum/30 bg-white hover:bg-butter-100 transition-colors"
        >
          <div className="font-bold text-plum">🎂 Kawaii Birthday</div>
          <div className="text-[11px] text-plum-light">₹75,000 • 40 Guests</div>
        </button>
        <button
          type="button"
          onClick={() => onSelectTemplate('community')}
          className="text-left text-xs p-2 rounded-lg border border-plum/30 bg-white hover:bg-mint-100 transition-colors"
        >
          <div className="font-bold text-plum">🎈 Community Mela</div>
          <div className="text-[11px] text-plum-light">₹1.5 Lakhs • 250 Guests</div>
        </button>
      </div>
    </div>
  );
};
