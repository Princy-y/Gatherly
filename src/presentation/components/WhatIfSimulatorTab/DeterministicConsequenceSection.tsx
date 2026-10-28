import React from 'react';
import { DeterministicSimulationResult } from '../../../domain/types';
import { formatINR } from '../../../domain/currency';
import { Scale, ShieldAlert, Sparkles } from 'lucide-react';

interface DeterministicConsequenceSectionProps {
  deterministicResult: DeterministicSimulationResult;
  hasChanges: boolean;
  isConsultingAi: boolean;
  onConsultAi: () => void;
}

export const DeterministicConsequenceSection: React.FC<DeterministicConsequenceSectionProps> = ({
  deterministicResult,
  hasChanges,
  isConsultingAi,
  onConsultAi,
}) => {
  return (
    <div className="scrapbook-card p-6 bg-lavender-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-plum" />
          <h2 className="font-heading font-bold text-base sm:text-lg text-plum">
            Step 1: Deterministic Consequence Analysis
          </h2>
        </div>
        <span className="kawaii-badge bg-white text-plum text-[11px] font-bold">
          Zero-Hallucination Math
        </span>
      </div>

      {/* Consequence Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-white rounded-xl border border-plum/20">
          <div className="text-[11px] font-bold text-plum-light uppercase">Budget Delta</div>
          <div
            className={`font-heading font-bold text-lg ${
              deterministicResult.budgetDeltaPaise < 0 ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {deterministicResult.budgetDeltaPaise === 0
              ? '₹0'
              : `${deterministicResult.budgetDeltaPaise > 0 ? '+' : ''}${formatINR(
                  deterministicResult.budgetDeltaPaise
                )}`}
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-plum/20">
          <div className="text-[11px] font-bold text-plum-light uppercase">Guest Delta</div>
          <div className="font-heading font-bold text-lg text-plum">
            {deterministicResult.guestCountDelta === 0
              ? '0'
              : `${deterministicResult.guestCountDelta > 0 ? '+' : ''}${
                  deterministicResult.guestCountDelta
                } attendees`}
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-plum/20">
          <div className="text-[11px] font-bold text-plum-light uppercase">Timeline Impact</div>
          <div className="font-heading font-bold text-lg text-plum">
            {deterministicResult.conflictingTaskIds.length > 0
              ? `⚠️ ${deterministicResult.conflictingTaskIds.length} Task Conflicts`
              : '✅ In Sync'}
          </div>
        </div>
      </div>

      {/* Warnings List */}
      {deterministicResult.deterministicWarnings.length > 0 && (
        <div className="p-3.5 bg-white/90 rounded-xl border-2 border-plum/30 space-y-1.5 mb-4">
          <div className="text-xs font-bold text-plum flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Calculated Planning Flags:</span>
          </div>
          <ul className="list-disc pl-5 text-xs text-plum font-medium space-y-1">
            {deterministicResult.deterministicWarnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Consult AI Button */}
      <div className="flex justify-end">
        <button
          onClick={onConsultAi}
          disabled={!hasChanges || isConsultingAi}
          className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border-2 border-plum flex items-center gap-2"
        >
          {isConsultingAi ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-plum" />
              <span>Formulating Trade-Off Proposal...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-plum" />
              <span>Step 2: Consult AI for Trade-Off Proposal ✨</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
