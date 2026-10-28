import React from 'react';
import { DeterministicSavingOption } from '../../../domain/budget';
import { formatINR } from '../../../domain/currency';
import { Check, Lightbulb, X } from 'lucide-react';

interface SavingsRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  savingsList: DeterministicSavingOption[];
  onApplySaving: (saving: DeterministicSavingOption) => void;
}

export const SavingsRecommenderModal: React.FC<SavingsRecommenderModalProps> = ({
  isOpen,
  onClose,
  savingsList,
  onApplySaving,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg text-plum">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-butter-300" />
            <h3 className="font-heading font-bold text-lg text-plum">
              Deterministic Savings Engine
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-plum-light mb-4">
          The engine prioritizes cuts that preserve essential pillars. Optional items are eliminated
          first, followed by preferred scope negotiation.
        </p>

        {savingsList.length === 0 ? (
          <div className="p-4 rounded-xl bg-mint-100 border border-plum/30 text-xs font-bold text-center">
            ✨ No urgent budget cuts needed! Your budget is healthy and balanced.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {savingsList.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border-2 border-plum bg-white shadow-kawaii-sm flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-plum">{rec.name}</span>
                    <span className="kawaii-badge bg-mint-200 text-plum text-[10px]">
                      Save {formatINR(rec.potentialSavingPaise)}
                    </span>
                  </div>
                  <p className="text-xs text-plum-light mt-1">{rec.suggestion}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onApplySaving(rec)}
                    className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum font-bold text-xs px-3 py-1.5 rounded-lg border border-plum flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Apply Recommendation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-plum/20 flex justify-end">
          <button
            onClick={onClose}
            className="btn-kawaii bg-white px-4 py-2 rounded-xl border border-plum text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
