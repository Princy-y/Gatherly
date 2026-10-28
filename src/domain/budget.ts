import { Expense, BudgetSummary, ExpenseCategory, ExpensePriority } from './types';

/** Ratio of budget that must remain for the plan to be considered healthy (10 %). */
const BUDGET_HEALTHY_BUFFER_RATIO = 0.1;

/** Maximum fraction of a preferred expense that can be trimmed via negotiation. */
const PREFERRED_TRIM_RATIO = 0.25;

/**
 * Returns the effective cost of an expense: actual cost when known, otherwise estimated cost.
 * All values are integer paise.
 */
function getEffectiveCost(expense: Expense): number {
  return expense.actualCostPaise != null ? expense.actualCostPaise : expense.estimatedCostPaise;
}

/**
 * Calculates a deterministic budget summary using integer paise arithmetic.
 * Effective committed expenditure prefers actual cost when available; falls back
 * to estimated cost. Never delegates arithmetic to the AI layer.
 *
 * @param budgetLimitPaise - Allocated budget ceiling in paise.
 * @param expenses - List of event expenses.
 * @returns A fully-computed {@link BudgetSummary} with remaining / overrun fields.
 */
export function calculateBudgetSummary(
  budgetLimitPaise: number,
  expenses: Expense[]
): BudgetSummary {
  const totalEstimatedPaise = expenses.reduce((sum, e) => sum + (e.estimatedCostPaise || 0), 0);

  const totalActualPaise = expenses.reduce((sum, e) => sum + (e.actualCostPaise ?? 0), 0);

  // Effective committed is actual cost if entered, otherwise estimated cost
  const effectiveCommittedPaise = expenses.reduce((sum, e) => sum + getEffectiveCost(e), 0);

  const remainingBudgetPaise = budgetLimitPaise - effectiveCommittedPaise;
  const isOverrun = remainingBudgetPaise < 0;
  const overrunPaise = isOverrun ? Math.abs(remainingBudgetPaise) : 0;

  const variancePercentage =
    budgetLimitPaise > 0
      ? Math.round(((effectiveCommittedPaise - budgetLimitPaise) / budgetLimitPaise) * 100)
      : 0;

  return {
    budgetLimitPaise,
    totalEstimatedPaise,
    totalActualPaise,
    effectiveCommittedPaise,
    remainingBudgetPaise,
    isOverrun,
    overrunPaise,
    variancePercentage,
  };
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  estimatedPaise: number;
  actualPaise: number;
  effectivePaise: number;
  percentageOfTotal: number;
  itemCount: number;
}

/**
 * Groups expenses by category and computes estimated, actual, and effective totals
 * per category. Results are sorted descending by effective expenditure.
 *
 * @param _budgetLimitPaise - Budget ceiling (unused; reserved for future normalisation).
 * @param expenses - Current expense list.
 * @returns Array of {@link CategoryBreakdown} sorted by effective spend (highest first).
 */
export function calculateCategoryBreakdown(
  _budgetLimitPaise: number,
  expenses: Expense[]
): CategoryBreakdown[] {
  const map = new Map<
    ExpenseCategory,
    { estimated: number; actual: number; effective: number; count: number }
  >();

  for (const exp of expenses) {
    const curr = map.get(exp.category) ?? { estimated: 0, actual: 0, effective: 0, count: 0 };
    curr.estimated += exp.estimatedCostPaise || 0;
    curr.actual += exp.actualCostPaise ?? 0;
    curr.effective += getEffectiveCost(exp);
    curr.count += 1;
    map.set(exp.category, curr);
  }

  const totalEffective = expenses.reduce((sum, e) => sum + getEffectiveCost(e), 0);

  const result: CategoryBreakdown[] = [];
  for (const [category, data] of map.entries()) {
    result.push({
      category,
      estimatedPaise: data.estimated,
      actualPaise: data.actual,
      effectivePaise: data.effective,
      percentageOfTotal:
        totalEffective > 0 ? Math.round((data.effective / totalEffective) * 100) : 0,
      itemCount: data.count,
    });
  }

  // Sort descending by effective expenditure
  return result.sort((a, b) => b.effectivePaise - a.effectivePaise);
}

export interface PriorityBreakdown {
  priority: ExpensePriority;
  totalPaise: number;
  itemCount: number;
  percentageOfBudget: number;
}

/**
 * Computes effective spend and item count grouped by expense priority tier.
 * Uses effective cost (actual if known, else estimated) for each item.
 *
 * @param budgetLimitPaise - Budget ceiling in integer paise (used for percentage calculation).
 * @param expenses - Current expense list.
 * @returns One {@link PriorityBreakdown} record per tier (essential → preferred → optional).
 */
export function calculatePriorityBreakdown(
  budgetLimitPaise: number,
  expenses: Expense[]
): PriorityBreakdown[] {
  const priorities: ExpensePriority[] = ['essential', 'preferred', 'optional'];
  return priorities.map((priority) => {
    const items = expenses.filter((e) => e.priority === priority);
    const totalPaise = items.reduce((sum, e) => sum + getEffectiveCost(e), 0);
    return {
      priority,
      totalPaise,
      itemCount: items.length,
      percentageOfBudget:
        budgetLimitPaise > 0 ? Math.round((totalPaise / budgetLimitPaise) * 100) : 0,
    };
  });
}

export interface DeterministicSavingOption {
  expenseId: string;
  name: string;
  category: ExpenseCategory;
  priority: ExpensePriority;
  potentialSavingPaise: number;
  strategy: 'eliminate_optional' | 'reduce_preferred' | 'renegotiate';
  suggestion: string;
}

/**
 * Deterministically generates savings recommendations when a budget overrun exists or budget is tight.
 * Targets optional items first, then preferred items — never cuts essential expenses.
 * Returns an empty array when the budget is healthy (remaining > 10 %).
 *
 * @param budgetLimitPaise - Budget ceiling in integer paise.
 * @param expenses - Current expense list.
 * @returns Ordered list of {@link DeterministicSavingOption} suggestions.
 */
export function generateDeterministicSavings(
  budgetLimitPaise: number,
  expenses: Expense[]
): DeterministicSavingOption[] {
  const summary = calculateBudgetSummary(budgetLimitPaise, expenses);
  if (
    !summary.isOverrun &&
    summary.remainingBudgetPaise > budgetLimitPaise * BUDGET_HEALTHY_BUFFER_RATIO
  ) {
    return []; // Healthy budget buffer — no action needed
  }

  const recommendations: DeterministicSavingOption[] = [];

  // 1. Identify Optional expenses that can be eliminated (unconfirmed only)
  const optionalExpenses = expenses.filter(
    (e) => e.priority === 'optional' && e.actualCostPaise == null
  );
  for (const exp of optionalExpenses) {
    recommendations.push({
      expenseId: exp.id,
      name: exp.name,
      category: exp.category,
      priority: exp.priority,
      potentialSavingPaise: exp.estimatedCostPaise,
      strategy: 'eliminate_optional',
      suggestion: `Remove optional item "${exp.name}" to instantly recover ${exp.estimatedCostPaise / 100} INR.`,
    });
  }

  // 2. Identify Preferred expenses where a trim can be negotiated (unconfirmed only)
  const preferredExpenses = expenses.filter(
    (e) => e.priority === 'preferred' && e.actualCostPaise == null
  );
  for (const exp of preferredExpenses) {
    const trim = Math.round(exp.estimatedCostPaise * PREFERRED_TRIM_RATIO);
    recommendations.push({
      expenseId: exp.id,
      name: exp.name,
      category: exp.category,
      priority: exp.priority,
      potentialSavingPaise: trim,
      strategy: 'reduce_preferred',
      suggestion: `Negotiate tier or package size for "${exp.name}" to trim ~${Math.round(PREFERRED_TRIM_RATIO * 100)}% (${trim / 100} INR).`,
    });
  }

  return recommendations;
}
