import React from 'react';
import { KawaiiBow } from '../KawaiiDecorations';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

interface SimulatorTopBannerProps {
  onReset: () => void;
  isSuccessApplied: boolean;
  aiError: string | null;
}

export const SimulatorTopBanner: React.FC<SimulatorTopBannerProps> = ({
  onReset,
  isSuccessApplied,
  aiError,
}) => {
  return (
    <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
        <div>
          <div className="flex items-center gap-2">
            <KawaiiBow size={20} />
            <h1 className="font-heading font-bold text-2xl text-plum">
              Constraint-Aware What-If Replanner
            </h1>
            <span className="kawaii-badge bg-blush-200 text-plum text-xs">✨ Signature Engine</span>
          </div>
          <p className="text-xs text-plum-light font-medium mt-0.5">
            Simulate budget cuts, guest surges, or date changes with deterministic consequence
            analysis & AI trade-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="btn-kawaii bg-white hover:bg-cream-100 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-plum" />
            <span>Reset to Current</span>
          </button>
        </div>
      </div>

      {isSuccessApplied && (
        <div
          role="status"
          className="mt-4 p-3.5 rounded-xl bg-mint-100 border-2 border-green-600 text-xs text-plum font-bold flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
          <span>
            🎉 Approved changes have been successfully applied to your active event plan and saved
            to storage!
          </span>
        </div>
      )}

      {aiError && (
        <div
          role="alert"
          className="mt-4 p-3.5 rounded-xl bg-blush-200 border-2 border-plum text-xs text-plum font-semibold flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{aiError}</span>
        </div>
      )}
    </div>
  );
};
