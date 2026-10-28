import React from 'react';
import { EventPlan } from '../../../domain/types';
import { AIPlanRevisionProposal } from '../../../infrastructure/ai/aiInterface';
import { formatINR } from '../../../domain/currency';
import { KawaiiSparkle } from '../KawaiiDecorations';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface ProposalReviewSectionProps {
  plan: EventPlan;
  simBudgetPaise: number;
  simGuestCount: number;
  simEventDate: string;
  aiProposal: AIPlanRevisionProposal;
  onApplyChanges: () => void;
}

export const ProposalReviewSection: React.FC<ProposalReviewSectionProps> = ({
  plan,
  simBudgetPaise,
  simGuestCount,
  simEventDate,
  aiProposal,
  onApplyChanges,
}) => {
  return (
    <div className="scrapbook-card p-6 bg-white space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-plum/20">
        <div className="flex items-center gap-2">
          <KawaiiSparkle size={18} />
          <h2 className="font-heading font-bold text-lg text-plum">
            Step 3 & 4: Before vs After & Trade-Off Breakdown
          </h2>
        </div>
        <span className="kawaii-badge bg-butter-200 text-plum text-xs">AI Proposal Ready</span>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before (Original Plan) */}
        <div className="p-4 rounded-xl border-2 border-plum/30 bg-cream-50">
          <div className="text-xs font-bold text-plum-light uppercase tracking-wider mb-2">
            Current Plan (Before)
          </div>
          <div className="space-y-2 text-xs text-plum">
            <div className="flex justify-between py-1 border-b border-plum/10">
              <span className="font-semibold">Budget Limit:</span>
              <span className="font-bold">{formatINR(plan.budgetLimitPaise)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-plum/10">
              <span className="font-semibold">Guest Count:</span>
              <span className="font-bold">{plan.guestCount} guests</span>
            </div>
            <div className="flex justify-between py-1 border-b border-plum/10">
              <span className="font-semibold">Event Date:</span>
              <span className="font-bold">{new Date(plan.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold">Active Expenses:</span>
              <span className="font-bold">{plan.expenses.length} items</span>
            </div>
          </div>
        </div>

        {/* After (Proposed Plan) */}
        <div className="p-4 rounded-xl border-2 border-plum bg-mint-50 shadow-kawaii-sm">
          <div className="text-xs font-bold text-plum uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Simulated Plan (Proposed)</span>
            <span className="kawaii-badge bg-mint-200 text-plum text-[10px]">
              Target Rebalanced
            </span>
          </div>
          <div className="space-y-2 text-xs text-plum">
            <div className="flex justify-between py-1 border-b border-plum/10">
              <span className="font-semibold">Proposed Budget:</span>
              <span className="font-bold text-green-800">{formatINR(simBudgetPaise)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-plum/10">
              <span className="font-semibold">Proposed Guests:</span>
              <span className="font-bold">{simGuestCount} guests</span>
            </div>
            <div className="flex justify-between py-1 border-b border-plum/10">
              <span className="font-semibold">Proposed Date:</span>
              <span className="font-bold">{new Date(simEventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-semibold">Overrun Risk:</span>
              <span className="font-bold text-green-800">Controlled (₹0)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Rationale & Trade-offs */}
      <div className="p-4 rounded-xl bg-lavender-50 border border-plum/20 space-y-3">
        <div>
          <div className="font-bold text-xs uppercase text-plum mb-1">
            Strategic Adaptation Rationale:
          </div>
          <p className="text-xs text-plum font-medium leading-relaxed">{aiProposal.rationale}</p>
        </div>

        <div>
          <div className="font-bold text-xs uppercase text-plum mb-1.5">
            Key Trade-Offs & Compensations:
          </div>
          <ul className="space-y-1.5 text-xs text-plum font-medium">
            {aiProposal.tradeOffs.map((tradeoff, i) => (
              <li
                key={i}
                className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-plum/15"
              >
                <span className="shrink-0">⚖️</span>
                <span>{tradeoff}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Proposed Expense Adjustments */}
        {aiProposal.proposedExpenseAdjustments.length > 0 && (
          <div>
            <div className="font-bold text-xs uppercase text-plum mb-1.5">
              Proposed Item Adjustments:
            </div>
            <div className="space-y-2">
              {aiProposal.proposedExpenseAdjustments.map((adj, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-white border border-plum/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-plum">{adj.name}</div>
                    <div className="text-[11px] text-plum-light">{adj.reason}</div>
                  </div>
                  <div className="shrink-0 font-bold text-plum">
                    {formatINR(adj.newEstimatedCostPaise)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step 5: Explicit User Approval */}
      <div className="pt-4 border-t border-plum/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-cream-50 p-4 rounded-xl border-2 border-plum">
        <div>
          <div className="font-bold text-xs sm:text-sm text-plum flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-700" />
            <span>Explicit Review & Approval Required</span>
          </div>
          <p className="text-[11px] text-plum-light mt-0.5">
            Applying these changes will update your budget limit, guest count, and timeline while
            safely preserving your historical invoiced expenses and completed tasks.
          </p>
        </div>

        <button
          onClick={onApplyChanges}
          className="btn-kawaii bg-mint-200 hover:bg-mint-300 text-plum font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl border-2 border-plum shrink-0 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-plum" />
          <span>Apply Approved Changes</span>
        </button>
      </div>
    </div>
  );
};
