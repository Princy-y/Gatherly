import { useState } from 'react';
import confetti from 'canvas-confetti';
import { EventPlan, ConstraintChanges, DeterministicSimulationResult } from '../../../domain/types';
import { simulateConstraintImpact } from '../../../domain/constraints';
import { shiftTaskDates } from '../../../domain/timeline';
import { paiseToRupees, parseRupeesInput } from '../../../domain/currency';
import { getAIProvider } from '../../../infrastructure/ai/aiFactory';
import { AIPlanRevisionProposal } from '../../../infrastructure/ai/aiInterface';

export function useWhatIfSimulator(
  plan: EventPlan,
  onApplyPlanRevision: (updatedPlan: EventPlan) => void
) {
  const [simBudgetRupees, setSimBudgetRupees] = useState<string>(
    paiseToRupees(plan.budgetLimitPaise).toString()
  );
  const [simGuestCount, setSimGuestCount] = useState<number>(plan.guestCount);
  const [simEventDate, setSimEventDate] = useState<string>(plan.eventDate);

  const [aiProposal, setAiProposal] = useState<AIPlanRevisionProposal | null>(null);
  const [isConsultingAi, setIsConsultingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isSuccessApplied, setIsSuccessApplied] = useState(false);

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

  const applyBudgetPercent = (percentDelta: number) => {
    const currentRupees = paiseToRupees(plan.budgetLimitPaise);
    const adjusted = Math.round(currentRupees * (1 + percentDelta / 100));
    setSimBudgetRupees(adjusted.toString());
  };

  const applyGuestDelta = (delta: number) => {
    setSimGuestCount((prev) => Math.max(1, prev + delta));
  };

  const resetToCurrent = () => {
    setSimBudgetRupees(paiseToRupees(plan.budgetLimitPaise).toString());
    setSimGuestCount(plan.guestCount);
    setSimEventDate(plan.eventDate);
    setAiProposal(null);
    setIsSuccessApplied(false);
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
    let updatedTasks = plan.tasks;
    if (simEventDate !== plan.eventDate) {
      updatedTasks = shiftTaskDates(plan.tasks, plan.eventDate, simEventDate);
    }

    if (aiProposal?.proposedTimelineAdjustments) {
      for (const adj of aiProposal.proposedTimelineAdjustments) {
        if (adj.taskId) {
          updatedTasks = updatedTasks.map((t) =>
            t.id === adj.taskId ? { ...t, dueDate: adj.newDueDate } : t
          );
        }
      }
    }

    let updatedExpenses = [...plan.expenses];
    if (aiProposal?.proposedExpenseAdjustments) {
      for (const adj of aiProposal.proposedExpenseAdjustments) {
        if (adj.expenseId) {
          updatedExpenses = updatedExpenses.map((e) =>
            e.id === adj.expenseId
              ? { ...e, estimatedCostPaise: adj.newEstimatedCostPaise, priority: adj.priority }
              : e
          );
        } else {
          const existing = updatedExpenses.find(
            (e) =>
              e.category === adj.category || e.name.toLowerCase().includes(adj.name.toLowerCase())
          );
          if (existing && existing.actualCostPaise === null) {
            updatedExpenses = updatedExpenses.map((e) =>
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

  return {
    simBudgetRupees,
    setSimBudgetRupees,
    simGuestCount,
    setSimGuestCount,
    simEventDate,
    setSimEventDate,
    aiProposal,
    isConsultingAi,
    aiError,
    isSuccessApplied,
    simBudgetPaise,
    deterministicResult,
    hasChanges,
    applyBudgetPercent,
    applyGuestDelta,
    resetToCurrent,
    handleConsultAi,
    handleApplyChanges,
  };
}
