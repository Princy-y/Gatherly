import React from 'react';
import { EventPlan, BudgetSummary } from '../../../domain/types';
import { formatINR } from '../../../domain/currency';
import { KawaiiBow, KawaiiSparkle } from '../KawaiiDecorations';
import { Check, Edit2, Lightbulb, Plus } from 'lucide-react';

interface BudgetOverviewCardProps {
  plan: EventPlan;
  summary: BudgetSummary;
  isEditingLimit: boolean;
  setIsEditingLimit: (val: boolean) => void;
  limitInput: string;
  setLimitInput: (val: string) => void;
  onSaveBudgetLimit: () => void;
  onOpenSavingsRecommender: () => void;
  onOpenAddModal: () => void;
}

export const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  plan,
  summary,
  isEditingLimit,
  setIsEditingLimit,
  limitInput,
  setLimitInput,
  onSaveBudgetLimit,
  onOpenSavingsRecommender,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
        <div>
          <div className="flex items-center gap-2">
            <KawaiiBow size={20} />
            <h1 className="font-heading font-bold text-2xl text-plum">Pastel Budget Studio</h1>
            <KawaiiSparkle size={16} />
          </div>
          <p className="text-xs text-plum-light font-medium mt-0.5">
            Deterministic, zero-rounding-error accounting in integer minor units (paise).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSavingsRecommender}
            className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-plum" />
            <span>Savings Recommender</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-plum" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Stat Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="p-3.5 rounded-xl bg-cream-50 border-2 border-plum/30">
          <div className="flex justify-between items-center text-xs font-bold text-plum-light uppercase">
            <span>Budget Cap</span>
            {!isEditingLimit ? (
              <button
                onClick={() => setIsEditingLimit(true)}
                className="text-plum hover:underline flex items-center gap-0.5 text-[11px]"
                title="Edit Total Budget"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            ) : (
              <button
                onClick={onSaveBudgetLimit}
                className="text-green-700 font-bold text-[11px] flex items-center gap-0.5"
              >
                <Check className="w-3 h-3" /> Save
              </button>
            )}
          </div>
          {!isEditingLimit ? (
            <div className="font-heading font-bold text-xl text-plum mt-1">
              {formatINR(plan.budgetLimitPaise)}
            </div>
          ) : (
            <input
              type="text"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSaveBudgetLimit()}
              className="w-full mt-1 px-2 py-0.5 text-sm font-bold border border-plum rounded bg-white text-plum"
              autoFocus
            />
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-iceBlue-50 border-2 border-plum/30">
          <div className="text-xs font-bold text-plum-light uppercase">Estimated Total</div>
          <div className="font-heading font-bold text-xl text-plum mt-1">
            {formatINR(summary.totalEstimatedPaise)}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-mint-50 border-2 border-plum/30">
          <div className="text-xs font-bold text-plum-light uppercase">Actual Invoiced</div>
          <div className="font-heading font-bold text-xl text-plum mt-1">
            {formatINR(summary.totalActualPaise)}
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border-2 ${
            summary.isOverrun ? 'bg-blush-100 border-red-500' : 'bg-butter-50 border-plum/30'
          }`}
        >
          <div className="text-xs font-bold text-plum-light uppercase">
            {summary.isOverrun ? 'Overrun Deficit' : 'Net Surplus'}
          </div>
          <div
            className={`font-heading font-bold text-xl mt-1 ${
              summary.isOverrun ? 'text-red-700' : 'text-plum'
            }`}
          >
            {summary.isOverrun
              ? `-${formatINR(summary.overrunPaise)}`
              : formatINR(summary.remainingBudgetPaise)}
          </div>
        </div>
      </div>
    </div>
  );
};
