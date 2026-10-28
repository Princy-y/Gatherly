import React, { useState } from 'react';
import {
  EventPlan,
  ConstraintChanges,
  DeterministicSimulationResult,
} from '../../domain/types';
import { simulateConstraintImpact } from '../../domain/constraints';
import { shiftTaskDates } from '../../domain/timeline';
import { formatINR, paiseToRupees, parseRupeesInput } from '../../domain/currency';
import { getAIProvider } from '../../infrastructure/ai/aiFactory';
import { AIPlanRevisionProposal } from '../../infrastructure/ai/aiInterface';
import {
  KawaiiBow,
  KawaiiSparkle,
} from './KawaiiDecorations';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Users,
  Wallet,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatIfSimulatorTabProps {
  plan: EventPlan;
  onApplyPlanRevision: (updatedPlan: EventPlan) => void;
}

export const WhatIfSimulatorTab: React.FC<WhatIfSimulatorTabProps> = ({
  plan,
  onApplyPlanRevision,
}) => {
  // Simulator inputs
  const [simBudgetRupees, setSimBudgetRupees] = useState<string>(
    paiseToRupees(plan.budgetLimitPaise).toString()
  );
  const [simGuestCount, setSimGuestCount] = useState<number>(plan.guestCount);
  const [simEventDate, setSimEventDate] = useState<string>(plan.eventDate);

  // Simulation state
  const [aiProposal, setAiProposal] = useState<AIPlanRevisionProposal | null>(null);
  const [isConsultingAi, setIsConsultingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isSuccessApplied, setIsSuccessApplied] = useState(false);

  // Compute live deterministic simulation
  const simBudgetPaise = parseRupeesInput(simBudgetRupees);
  const constraintChanges: ConstraintChanges = {
    newBudgetLimitPaise: simBudgetPaise,
    newGuestCount: simGuestCount,
    newEventDate: simEventDate !== plan.eventDate ? simEventDate : undefined,
  };

  const deterministicResult: DeterministicSimulationResult = simulateConstraintImpact(
    plan,
    constraintChanges
  );

  const hasChanges =
    simBudgetPaise !== plan.budgetLimitPaise ||
    simGuestCount !== plan.guestCount ||
    simEventDate !== plan.eventDate;

  // Preset quick adjustments
  const applyBudgetPercent = (percentDelta: number) => {
    const currentRupees = paiseToRupees(plan.budgetLimitPaise);
    const adjusted = Math.round(currentRupees * (1 + percentDelta / 100));
    setSimBudgetRupees(adjusted.toString());
  };

  const applyGuestDelta = (delta: number) => {
    setSimGuestCount(prev => Math.max(1, prev + delta));
  };

  const handleConsultAi = async () => {
    setIsConsultingAi(true);
    setAiError(null);
    setIsSuccessApplied(false);

    try {
      const provider = getAIProvider();
      const { data } = await provider.revisePlan({
        currentPlanSummary: {
          title: plan.title,
          eventType: plan.eventType,
          eventDate: plan.eventDate,
          budgetLimitPaise: plan.budgetLimitPaise,
          guestCount: plan.guestCount,
        },
        changes: {
          newBudgetLimitPaise: simBudgetPaise,
          newGuestCount: simGuestCount,
          newEventDate: simEventDate,
        },
        deterministicWarnings: deterministicResult.deterministicWarnings,
      });

      setAiProposal(data);
    } catch (err: unknown) {
      console.error('Failed to get AI replanning proposal:', err);
      setAiError(err instanceof Error ? err.message : 'Could not consult replanning engine.');
    } finally {
      setIsConsultingAi(false);
    }
  };

  const handleApplyChanges = () => {
    // 1. Shift task dates if event date shifted
    let updatedTasks = plan.tasks;
    if (simEventDate !== plan.eventDate) {
      updatedTasks = shiftTaskDates(plan.tasks, plan.eventDate, simEventDate);
    }

    // Apply any AI timeline adjustments if provided
    if (aiProposal?.proposedTimelineAdjustments) {
      for (const adj of aiProposal.proposedTimelineAdjustments) {
        if (adj.taskId) {
          updatedTasks = updatedTasks.map(t =>
            t.id === adj.taskId ? { ...t, dueDate: adj.newDueDate } : t
          );
        }
      }
    }

    // 2. Adjust expenses: preserve actual invoiced costs!
    let updatedExpenses = [...plan.expenses];
    if (aiProposal?.proposedExpenseAdjustments) {
      for (const adj of aiProposal.proposedExpenseAdjustments) {
        if (adj.expenseId) {
          updatedExpenses = updatedExpenses.map(e =>
            e.id === adj.expenseId
              ? { ...e, estimatedCostPaise: adj.newEstimatedCostPaise, priority: adj.priority }
              : e
          );
        } else {
          // Check if an expense with similar name exists
          const existing = updatedExpenses.find(
            e => e.category === adj.category || e.name.toLowerCase().includes(adj.name.toLowerCase())
          );
          if (existing && existing.actualCostPaise === null) {
            updatedExpenses = updatedExpenses.map(e =>
              e.id === existing.id
                ? {
                    ...e,
                    name: adj.name,
                    estimatedCostPaise: adj.newEstimatedCostPaise,
                    priority: adj.priority,
                  }
                : e
            );
          }
        }
      }
    }

    const updatedPlan: EventPlan = {
      ...plan,
      budgetLimitPaise: simBudgetPaise,
      guestCount: simGuestCount,
      eventDate: simEventDate,
      expenses: updatedExpenses,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    };

    onApplyPlanRevision(updatedPlan);
    setIsSuccessApplied(true);

    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#DCCEFF', '#FFD9E8', '#FFF0B8', '#D5F3DF'],
      });
    } catch {
      // Ignored if confetti is blocked or not available in environment
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
          <div>
            <div className="flex items-center gap-2">
              <KawaiiBow size={20} />
              <h1 className="font-heading font-bold text-2xl text-plum">
                Constraint-Aware What-If Replanner
              </h1>
              <span className="kawaii-badge bg-blush-200 text-plum text-xs">
                ✨ Signature Engine
              </span>
            </div>
            <p className="text-xs text-plum-light font-medium mt-0.5">
              Simulate budget cuts, guest surges, or date changes with deterministic consequence analysis & AI trade-offs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSimBudgetRupees(paiseToRupees(plan.budgetLimitPaise).toString());
                setSimGuestCount(plan.guestCount);
                setSimEventDate(plan.eventDate);
                setAiProposal(null);
                setIsSuccessApplied(false);
              }}
              className="btn-kawaii bg-white hover:bg-cream-100 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-plum" />
              <span>Reset to Current</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {isSuccessApplied && (
          <div
            role="status"
            className="mt-4 p-3.5 rounded-xl bg-mint-100 border-2 border-green-600 text-xs text-plum font-bold flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-green-700 shrink-0" />
            <span>
              🎉 Approved changes have been successfully applied to your active event plan and saved to storage!
            </span>
          </div>
        )}

        {/* AI Error Alert */}
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

      {/* Simulator Inputs & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Constraint Slider */}
        <div className="scrapbook-card p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-plum">
              <Wallet className="w-4 h-4 text-plum" />
              <span>Budget Constraint</span>
            </div>
            <span className="text-[11px] text-plum-light">
              Current: {formatINR(plan.budgetLimitPaise)}
            </span>
          </div>

          <div className="relative mb-3">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-plum">₹</span>
            <input
              type="text"
              value={simBudgetRupees}
              onChange={e => setSimBudgetRupees(e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-cream-50 border-2 border-plum rounded-xl font-heading font-bold text-base text-plum"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
            <button
              onClick={() => applyBudgetPercent(-25)}
              className="px-2 py-1 rounded-lg bg-blush-100 border border-plum/30 hover:bg-blush-200 text-plum"
            >
              -25% Cut
            </button>
            <button
              onClick={() => applyBudgetPercent(-10)}
              className="px-2 py-1 rounded-lg bg-blush-50 border border-plum/30 hover:bg-blush-100 text-plum"
            >
              -10% Cut
            </button>
            <button
              onClick={() => applyBudgetPercent(+15)}
              className="px-2 py-1 rounded-lg bg-mint-50 border border-plum/30 hover:bg-mint-100 text-plum"
            >
              +15% Boost
            </button>
            <button
              onClick={() => applyBudgetPercent(+30)}
              className="px-2 py-1 rounded-lg bg-mint-100 border border-plum/30 hover:bg-mint-200 text-plum"
            >
              +30% Boost
            </button>
          </div>
        </div>

        {/* Guest Count Slider */}
        <div className="scrapbook-card p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-plum">
              <Users className="w-4 h-4 text-plum" />
              <span>Guest Count</span>
            </div>
            <span className="text-[11px] text-plum-light">
              Current: {plan.guestCount} guests
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={simGuestCount}
              onChange={e => setSimGuestCount(parseInt(e.target.value))}
              className="w-full accent-plum"
            />
            <span className="font-heading font-bold text-lg text-plum w-14 text-right">
              {simGuestCount}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
            <button
              onClick={() => applyGuestDelta(-25)}
              className="px-2 py-1 rounded-lg bg-cream-100 border border-plum/30 hover:bg-cream-200 text-plum"
            >
              -25 Guests
            </button>
            <button
              onClick={() => applyGuestDelta(+25)}
              className="px-2 py-1 rounded-lg bg-cream-100 border border-plum/30 hover:bg-cream-200 text-plum"
            >
              +25 Guests
            </button>
            <button
              onClick={() => applyGuestDelta(+50)}
              className="px-2 py-1 rounded-lg bg-lavender-100 border border-plum/30 hover:bg-lavender-200 text-plum"
            >
              +50 Guests
            </button>
          </div>
        </div>

        {/* Event Date Shift */}
        <div className="scrapbook-card p-5 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-plum">
              <Calendar className="w-4 h-4 text-plum" />
              <span>Event Date Shift</span>
            </div>
            <span className="text-[11px] text-plum-light">
              Current: {new Date(plan.eventDate).toLocaleDateString()}
            </span>
          </div>

          <input
            type="date"
            value={simEventDate}
            onChange={e => setSimEventDate(e.target.value)}
            className="w-full px-3 py-2 bg-cream-50 border-2 border-plum rounded-xl font-heading font-bold text-sm text-plum mb-3"
          />

          <div className="text-[11px] text-plum-light font-semibold">
            {deterministicResult.daysShifted === 0
              ? '✨ Same date (No timeline shift)'
              : deterministicResult.daysShifted < 0
              ? `⚡ Date accelerated by ${Math.abs(deterministicResult.daysShifted)} days!`
              : `⏳ Date postponed by ${deterministicResult.daysShifted} days.`}
          </div>
        </div>
      </div>

      {/* Step 1: Live Deterministic Impact Analysis */}
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
            onClick={handleConsultAi}
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

      {/* Step 2 & 3: Before-and-After Comparison & Trade-off Proposal */}
      {aiProposal && (
        <div className="scrapbook-card p-6 bg-white space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-plum/20">
            <div className="flex items-center gap-2">
              <KawaiiSparkle size={18} />
              <h2 className="font-heading font-bold text-lg text-plum">
                Step 3 & 4: Before vs After & Trade-Off Breakdown
              </h2>
            </div>
            <span className="kawaii-badge bg-butter-200 text-plum text-xs">
              AI Proposal Ready
            </span>
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
              <p className="text-xs text-plum font-medium leading-relaxed">
                {aiProposal.rationale}
              </p>
            </div>

            <div>
              <div className="font-bold text-xs uppercase text-plum mb-1.5">
                Key Trade-Offs & Compensations:
              </div>
              <ul className="space-y-1.5 text-xs text-plum font-medium">
                {aiProposal.tradeOffs.map((tradeoff, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-plum/15">
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
                Applying these changes will update your budget limit, guest count, and timeline while safely preserving your historical invoiced expenses and completed tasks.
              </p>
            </div>

            <button
              onClick={handleApplyChanges}
              className="btn-kawaii bg-mint-200 hover:bg-mint-300 text-plum font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl border-2 border-plum shrink-0 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-plum" />
              <span>Apply Approved Changes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
