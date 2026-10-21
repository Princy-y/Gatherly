import { Expense, BudgetSummary, ExpenseCategory, ExpensePriority } from './types';

/**
 * Calculates deterministic budget summary using integer paise.
 * Effective committed expenditure considers actual cost when known, else estimated cost.
 */
export function calculateBudgetSummary(
  budgetLimitPaise: number,
  expenses: Expense[]
): BudgetSummary {
  const totalEstimatedPaise = expenses.reduce((sum, e) => sum + (e.estimatedCostPaise || 0), 0);
  
  const totalActualPaise = expenses.reduce(
    (sum, e) => sum + (e.actualCostPaise !== null && e.actualCostPaise !== undefined ? e.actualCostPaise : 0),
    0
  );

  // Effective committed is actual cost if entered, otherwise estimated cost
  const effectiveCommittedPaise = expenses.reduce((sum, e) => {
    const cost = (e.actualCostPaise !== null && e.actualCostPaise !== undefined)
      ? e.actualCostPaise
      : e.estimatedCostPaise;
    return sum + cost;
  }, 0);

  const remainingBudgetPaise = budgetLimitPaise - effectiveCommittedPaise;
  const isOverrun = remainingBudgetPaise < 0;
  const overrunPaise = isOverrun ? Math.abs(remainingBudgetPaise) : 0;
  
  const variancePercentage = budgetLimitPaise > 0 
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

export function calculateCategoryBreakdown(
  _budgetLimitPaise: number,
  expenses: Expense[]
): CategoryBreakdown[] {
  const map = new Map<ExpenseCategory, { estimated: number; actual: number; effective: number; count: number }>();

  for (const exp of expenses) {
    const curr = map.get(exp.category) || { estimated: 0, actual: 0, effective: 0, count: 0 };
    curr.estimated += exp.estimatedCostPaise || 0;
    const actual = (exp.actualCostPaise !== null && exp.actualCostPaise !== undefined) ? exp.actualCostPaise : 0;
    curr.actual += actual;
    curr.effective += (exp.actualCostPaise !== null && exp.actualCostPaise !== undefined) ? exp.actualCostPaise : exp.estimatedCostPaise;
    curr.count += 1;
    map.set(exp.category, curr);
  }

  const result: CategoryBreakdown[] = [];
  const totalEffective = expenses.reduce((sum, e) => {
    return sum + (e.actualCostPaise !== null && e.actualCostPaise !== undefined ? e.actualCostPaise : e.estimatedCostPaise);
  }, 0);

  for (const [category, data] of map.entries()) {
    result.push({
      category,
      estimatedPaise: data.estimated,
      actualPaise: data.actual,
      effectivePaise: data.effective,
      percentageOfTotal: totalEffective > 0 ? Math.round((data.effective / totalEffective) * 100) : 0,
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

export function calculatePriorityBreakdown(
  budgetLimitPaise: number,
  expenses: Expense[]
): PriorityBreakdown[] {
  const priorities: ExpensePriority[] = ['essential', 'preferred', 'optional'];
  return priorities.map(priority => {
    const items = expenses.filter(e => e.priority === priority);
    const totalPaise = items.reduce((sum, e) => {
      return sum + (e.actualCostPaise !== null && e.actualCostPaise !== undefined ? e.actualCostPaise : e.estimatedCostPaise);
    }, 0);
    return {
      priority,
      totalPaise,
      itemCount: items.length,
      percentageOfBudget: budgetLimitPaise > 0 ? Math.round((totalPaise / budgetLimitPaise) * 100) : 0,
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
 * Never cuts essential items before optional/preferred items.
 */
export function generateDeterministicSavings(
  budgetLimitPaise: number,
  expenses: Expense[]
): DeterministicSavingOption[] {
  const summary = calculateBudgetSummary(budgetLimitPaise, expenses);
  if (!summary.isOverrun && summary.remainingBudgetPaise > (budgetLimitPaise * 0.1)) {
    return []; // Healthy budget buffer
  }

  const recommendations: DeterministicSavingOption[] = [];

  // 1. Identify Optional expenses that can be eliminated
  const optionalExpenses = expenses.filter(e => e.priority === 'optional' && (e.actualCostPaise === null || e.actualCostPaise === undefined));
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

  // 2. Identify Preferred expenses where a 25% trim can be negotiated
  const preferredExpenses = expenses.filter(e => e.priority === 'preferred' && (e.actualCostPaise === null || e.actualCostPaise === undefined));
  for (const exp of preferredExpenses) {
    const trim = Math.round(exp.estimatedCostPaise * 0.25);
    recommendations.push({
      expenseId: exp.id,
      name: exp.name,
      category: exp.category,
      priority: exp.priority,
      potentialSavingPaise: trim,
      strategy: 'reduce_preferred',
      suggestion: `Negotiate tier or package size for "${exp.name}" to trim ~25% (${trim / 100} INR).`,
    });
  }

  return recommendations;
}
