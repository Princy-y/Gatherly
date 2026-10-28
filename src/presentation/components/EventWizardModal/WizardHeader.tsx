import React from 'react';
import { KawaiiBunnyMascot, KawaiiSparkle } from '../KawaiiDecorations';
import { X } from 'lucide-react';

interface WizardHeaderProps {
  onClose: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-lavender-200 border-2 border-plum rounded-2xl flex items-center justify-center shadow-kawaii-sm">
          <KawaiiBunnyMascot size={34} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 id="wizard-title" className="font-heading font-bold text-2xl text-plum">
              Design Your Dream Event
            </h2>
            <KawaiiSparkle />
          </div>
          <p className="text-xs sm:text-sm text-plum-light font-medium">
            Our constraint-aware AI will craft your budget, timeline & vendor roadmap.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="btn-kawaii bg-blush-200 p-2 rounded-xl border border-plum text-plum hover:bg-blush-300"
        aria-label="Close dialog"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
