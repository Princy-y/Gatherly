import { describe, it, expect } from 'vitest';
import {
  calculateBudgetSummary,
  calculateCategoryBreakdown,
  calculatePriorityBreakdown,
  generateDeterministicSavings,
} from '../budget';
import { Expense } from '../types';

describe('Deterministic Budget Engine', () => {
  const sampleExpenses: Expense[] = [
    {
      id: 'e1',
      category: 'venue',
      name: 'Garden Hall',
      estimatedCostPaise: 5000000, // ₹50,000
      actualCostPaise: 4800000, // ₹48,000
      priority: 'essential',
    },
    {
      id: 'e2',
      category: 'catering',
      name: 'Buffet Catering',
      estimatedCostPaise: 3000000, // ₹30,000
      actualCostPaise: null,
      priority: 'essential',
    },
    {
      id: 'e3',
      category: 'photography',
      name: 'Drone & Candid Photo',
      estimatedCostPaise: 2000000, // ₹20,000
      actualCostPaise: null,
      priority: 'preferred',
    },
    {
      id: 'e4',
      category: 'decoration',
      name: 'Custom Floral Arch',
      estimatedCostPaise: 1500000, // ₹15,000
      actualCostPaise: null,
      priority: 'optional',
    },
  ];

  it('calculates total estimated, actual, committed and remaining budget correctly', () => {
    const budgetLimitPaise = 10000000; // ₹1,00,000
    const summary = calculateBudgetSummary(budgetLimitPaise, sampleExpenses);

    // Total estimated: 50k + 30k + 20k + 15k = 115k
    expect(summary.totalEstimatedPaise).toBe(11500000);

    // Total actual: 48k
    expect(summary.totalActualPaise).toBe(4800000);

    // Effective committed: 48k (actual for e1) + 30k + 20k + 15k = 113k
    expect(summary.effectiveCommittedPaise).toBe(11300000);

    // Remaining: 100k - 113k = -13k (Overrun!)
    expect(summary.remainingBudgetPaise).toBe(-1300000);
    expect(summary.isOverrun).toBe(true);
    expect(summary.overrunPaise).toBe(1300000);
  });

  it('reports no overrun when budget limit is sufficient', () => {
    const budgetLimitPaise = 15000000; // ₹1,50,000
    const summary = calculateBudgetSummary(budgetLimitPaise, sampleExpenses);

    expect(summary.isOverrun).toBe(false);
    expect(summary.overrunPaise).toBe(0);
    expect(summary.remainingBudgetPaise).toBe(3700000); // ₹37,000 surplus
  });

  it('calculates category breakdown accurately and sorts descending', () => {
    const breakdown = calculateCategoryBreakdown(10000000, sampleExpenses);
    expect(breakdown.length).toBe(4);
    // Highest committed is venue (48k), then catering (30k)
    expect(breakdown[0].category).toBe('venue');
    expect(breakdown[0].effectivePaise).toBe(4800000);
    expect(breakdown[1].category).toBe('catering');
    expect(breakdown[1].effectivePaise).toBe(3000000);
  });

  it('calculates priority breakdown with item counts and percentage', () => {
    const breakdown = calculatePriorityBreakdown(10000000, sampleExpenses);
    const essential = breakdown.find(b => b.priority === 'essential');
    const optional = breakdown.find(b => b.priority === 'optional');

    expect(essential?.itemCount).toBe(2);
    expect(essential?.totalPaise).toBe(7800000); // 48k + 30k
    expect(optional?.itemCount).toBe(1);
    expect(optional?.totalPaise).toBe(1500000); // 15k
  });

  it('generates deterministic savings recommendations targeting optional items first', () => {
    const budgetLimitPaise = 10000000; // ₹1,00,000 (overrun scenario)
    const savings = generateDeterministicSavings(budgetLimitPaise, sampleExpenses);

    expect(savings.length).toBeGreaterThan(0);
    // First should be optional item: custom floral arch
    expect(savings[0].strategy).toBe('eliminate_optional');
    expect(savings[0].name).toBe('Custom Floral Arch');
    expect(savings[0].potentialSavingPaise).toBe(1500000);

    // Preferred item should offer renegotiation/trim
    const preferredTrim = savings.find(s => s.strategy === 'reduce_preferred');
    expect(preferredTrim).toBeDefined();
    expect(preferredTrim?.name).toBe('Drone & Candid Photo');
    expect(preferredTrim?.potentialSavingPaise).toBe(500000); // 25% of 20,000 = 5,000
  });
});
