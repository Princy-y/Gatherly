import { describe, it, expect } from 'vitest';
import { simulateConstraintImpact } from '../constraints';
import { EventPlan } from '../types';

describe('Constraint-Aware Re-planning Engine', () => {
  const basePlan: EventPlan = {
    id: 'test-event-1',
    schemaVersion: 1,
    title: 'Aarav & Maya Wedding',
    eventType: 'wedding',
    location: 'Bengaluru',
    eventDate: '2026-12-20',
    currency: 'INR',
    budgetLimitPaise: 10000000, // ₹1,00,000
    guestCount: 100,
    priorities: ['Photography', 'Catering quality'],
    preferences: 'Warm pastel aesthetic, eco-friendly floral decor',
    expenses: [
      {
        id: 'e1',
        category: 'venue',
        name: 'Heritage Hall',
        estimatedCostPaise: 4000000,
        actualCostPaise: null,
        priority: 'essential',
      },
      {
        id: 'e2',
        category: 'catering',
        name: 'Royal Feast',
        estimatedCostPaise: 5000000,
        actualCostPaise: null,
        priority: 'essential',
      },
      {
        id: 'e3',
        category: 'decoration',
        name: 'Floral Chandelier',
        estimatedCostPaise: 1500000,
        actualCostPaise: null,
        priority: 'optional',
      },
    ],
    tasks: [
      {
        id: 't1',
        title: 'Book Venue',
        description: '',
        dueDate: '2026-11-01',
        status: 'completed',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 't2',
        title: 'Final Menu Tasting',
        description: '',
        dueDate: '2026-12-10',
        status: 'todo',
        priority: 'medium',
        dependencies: ['t1'],
      },
    ],
    vendors: [],
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  };

  it('detects budget overrun when budget is reduced below committed costs', () => {
    // Current total is 40k + 50k + 15k = 105k
    // Slash budget to 80k (8,000,000 paise)
    const result = simulateConstraintImpact(basePlan, {
      newBudgetLimitPaise: 8000000,
    });

    expect(result.budgetDeltaPaise).toBe(-2000000);
    expect(result.budgetOverrunPaise).toBe(2500000); // 105k - 80k = 25k
    expect(result.deterministicWarnings.some((w) => w.includes('Budget Overrun'))).toBe(true);
  });

  it('flags catering and venue expenses when guest count increases', () => {
    const result = simulateConstraintImpact(basePlan, {
      newGuestCount: 150,
    });

    expect(result.guestCountDelta).toBe(50);
    expect(result.affectedExpenseIds).toContain('e1');
    expect(result.affectedExpenseIds).toContain('e2');
    expect(result.deterministicWarnings.some((w) => w.includes('Guest Increase'))).toBe(true);
  });

  it('flags date compression and timeline conflicts when event date is moved up', () => {
    // Move event date to 2026-12-05 (which is earlier than task t2's due date 2026-12-10)
    const result = simulateConstraintImpact(basePlan, {
      newEventDate: '2026-12-05',
    });

    expect(result.daysShifted).toBe(-15);
    expect(result.conflictingTaskIds).toContain('t2');
    expect(
      result.deterministicWarnings.some(
        (w) => w.includes('Timeline compression') || w.includes('Date Moved Earlier')
      )
    ).toBe(true);
  });
});
