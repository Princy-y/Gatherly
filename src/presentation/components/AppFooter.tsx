import React from 'react';
import { KawaiiBunnyMascot } from './KawaiiDecorations';

export const AppFooter: React.FC = () => {
  return (
    <footer className="bg-cream-200 border-t-2 border-plum py-6 px-4 text-center text-xs text-plum-light">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-plum">
          <KawaiiBunnyMascot size={22} />
          <span>Gatherly AI • Kawaii Event Planning Assistant</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span>✨ Zero-Hallucination Math</span>
          <span>🎀 Constraint-Aware Replanning</span>
          <span>🔒 Safe Browser Storage</span>
          <span>📦 &lt; 10 MB Verified Repo</span>
        </div>
      </div>
    </footer>
  );
};
