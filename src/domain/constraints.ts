import { EventPlan, ConstraintChanges, DeterministicSimulationResult } from './types';
import { calculateBudgetSummary } from './budget';
import { calculateDaysBetween, identifyConflictingTasks } from './timeline';
import { paiseToRupees } from './currency';

/**
 * Deterministically simulates the impact of proposed constraint changes
 * prior to any AI suggestions. Computes budget overruns, guest scaling effects,
 * date compression warnings, and task conflicts — all without calling the AI layer.
 *
 * @param currentPlan - The current event plan state.
 * @param changes - The user's proposed constraint modifications.
 * @returns A complete {@link DeterministicSimulationResult} with warnings and affected IDs.
 */
export function simulateConstraintImpact(
  currentPlan: EventPlan,
  changes: ConstraintChanges
): DeterministicSimulationResult {
  const warnings: string[] = [];
  const affectedExpenseIds: string[] = [];

  // 1. Budget changes
  const newBudgetLimitPaise =
    changes.newBudgetLimitPaise !== undefined
      ? changes.newBudgetLimitPaise
      : currentPlan.budgetLimitPaise;

  const budgetDeltaPaise = newBudgetLimitPaise - currentPlan.budgetLimitPaise;

  // Filter out removed expenses if any
  const simulatedExpenses = currentPlan.expenses.filter(
    (exp) => !changes.removedExpenseIds?.includes(exp.id)
  );

  const budgetSummary = calculateBudgetSummary(newBudgetLimitPaise, simulatedExpenses);
  if (budgetSummary.isOverrun) {
    const overrunINR = paiseToRupees(budgetSummary.overrunPaise);
    warnings.push(
      `Budget Overrun: Proposed budget limit leaves an overrun of ₹${overrunINR.toLocaleString('en-IN')}.`
    );
  }

  // 2. Guest count changes
  const newGuestCount =
    changes.newGuestCount !== undefined ? changes.newGuestCount : currentPlan.guestCount;

  const guestCountDelta = newGuestCount - currentPlan.guestCount;
  if (guestCountDelta > 0) {
    const cateringExpenses = simulatedExpenses.filter(
      (e) => e.category === 'catering' || e.category === 'venue'
    );
    cateringExpenses.forEach((e) => affectedExpenseIds.push(e.id));

    warnings.push(
      `Guest Increase (+${guestCountDelta} guests): Catering and venue capacity will require per-head scaling or vendor renegotiation.`
    );
  } else if (guestCountDelta < 0) {
    warnings.push(
      `Guest Reduction (${guestCountDelta} guests): Opportunity to downscale catering packages and invitations to reclaim budget.`
    );
  }

  // 3. Date changes
  const newEventDate = changes.newEventDate || currentPlan.eventDate;
  const daysShifted = calculateDaysBetween(currentPlan.eventDate, newEventDate);

  let conflictingTaskIds: string[] = [];
  if (daysShifted !== 0) {
    if (daysShifted < 0) {
      warnings.push(
        `Date Moved Earlier by ${Math.abs(daysShifted)} days: Timeline compression will require accelerating vendor bookings and task deadlines.`
      );
    } else {
      warnings.push(
        `Date Extended by ${daysShifted} days: Extra planning runway allows more flexibility for vendor bookings.`
      );
    }
    // Check conflicts against new date
    conflictingTaskIds = identifyConflictingTasks(currentPlan.tasks, newEventDate);
    if (conflictingTaskIds.length > 0) {
      warnings.push(
        `${conflictingTaskIds.length} task(s) have due dates falling after or conflicting with the new event date.`
      );
    }
  }

  // 4. Priority adjustments
  if (changes.priorityAdjustments && changes.priorityAdjustments.length > 0) {
    for (const adj of changes.priorityAdjustments) {
      affectedExpenseIds.push(adj.expenseId);
      const exp = currentPlan.expenses.find((e) => e.id === adj.expenseId);
      if (exp) {
        warnings.push(`Priority of "${exp.name}" shifted to "${adj.newPriority}".`);
      }
    }
  }

  return {
    originalBudgetLimitPaise: currentPlan.budgetLimitPaise,
    newBudgetLimitPaise,
    budgetDeltaPaise,
    originalGuestCount: currentPlan.guestCount,
    newGuestCount,
    guestCountDelta,
    originalEventDate: currentPlan.eventDate,
    newEventDate,
    daysShifted,
    budgetOverrunPaise: budgetSummary.overrunPaise,
    conflictingTaskIds,
    affectedExpenseIds: Array.from(new Set(affectedExpenseIds)),
    deterministicWarnings: warnings,
  };
}
