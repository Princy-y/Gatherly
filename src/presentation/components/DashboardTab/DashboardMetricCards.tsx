import React from 'react';
import { BudgetSummary } from '../../../domain/types';
import { formatINR } from '../../../domain/currency';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';

interface DashboardMetricCardsProps {
  budgetLimitPaise: number;
  expenseCount: number;
  budgetSummary: BudgetSummary;
  onNavigateWhatIf: () => void;
}

export const DashboardMetricCards: React.FC<DashboardMetricCardsProps> = ({
  budgetLimitPaise,
  expenseCount,
  budgetSummary,
  onNavigateWhatIf,
}) => {
  return (
    <>
      {/* Overrun Warning Banner (if applicable) */}
      {budgetSummary.isOverrun && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-blush-100 border-2 border-plum shadow-kawaii-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-plum"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-200 border-2 border-plum flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Budget Overrun Detected ({formatINR(budgetSummary.overrunPaise)} over limit)
              </div>
              <p className="text-xs text-plum-light">
                Committed expenses exceed your allocated ₹{formatINR(budgetLimitPaise)} budget. Use
                the What-If Simulator or Budget Studio to rebalance.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateWhatIf}
            className="btn-kawaii bg-blush-200 hover:bg-blush-300 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum shrink-0 flex items-center gap-1.5"
          >
            <span>Resolve with What-If</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Financial & Planning Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="scrapbook-card p-4 sm:p-5 bg-lavender-50">
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>Total Budget</span>
            <Wallet className="w-4 h-4 text-plum" />
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-plum">
            {formatINR(budgetLimitPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1 flex items-center gap-1">
            <span>Locked allocation in INR</span>
          </div>
        </div>

        {/* Estimated Spend */}
        <div className="scrapbook-card p-4 sm:p-5 bg-iceBlue-50">
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>Estimated Spend</span>
            <TrendingUp className="w-4 h-4 text-plum" />
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-plum">
            {formatINR(budgetSummary.totalEstimatedPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1">{expenseCount} categorized items</div>
        </div>

        {/* Actual Spend */}
        <div className="scrapbook-card p-4 sm:p-5 bg-mint-50">
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>Actual Spend</span>
            <CheckCircle2 className="w-4 h-4 text-plum" />
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-plum">
            {formatINR(budgetSummary.totalActualPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1">Confirmed invoiced costs</div>
        </div>

        {/* Remaining or Overrun */}
        <div
          className={`scrapbook-card p-4 sm:p-5 ${
            budgetSummary.isOverrun ? 'bg-blush-50' : 'bg-butter-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>{budgetSummary.isOverrun ? 'Deficit Overrun' : 'Remaining Budget'}</span>
            <Sparkles className="w-4 h-4 text-plum" />
          </div>
          <div
            className={`font-heading font-bold text-xl sm:text-2xl ${
              budgetSummary.isOverrun ? 'text-red-700' : 'text-plum'
            }`}
          >
            {budgetSummary.isOverrun
              ? `-${formatINR(budgetSummary.overrunPaise)}`
              : formatINR(budgetSummary.remainingBudgetPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1 font-semibold">
            {budgetSummary.isOverrun ? 'Exceeds budget limit' : 'Safe buffer available'}
          </div>
        </div>
      </div>
    </>
  );
};
