import { describe, it, expect } from 'vitest';
import { DemoAdapter } from '../demoAdapter';
import {
  AIGeneratedPlanOutputSchema,
  AIPlanRevisionProposalSchema,
  InspirationStudioOutputSchema,
} from '../aiInterface';

describe('AI Provider Abstraction & Schema Validation', () => {
  const demoAdapter = new DemoAdapter();

  it('generates a valid wedding plan output that conforms to Zod schema', async () => {
    const result = await demoAdapter.generatePlan({
      title: 'Rohan & Ananya Wedding',
      eventType: 'wedding',
      location: 'Udaipur',
      eventDate: '2026-12-15',
      budgetLimitPaise: 20000000,
      guestCount: 150,
      priorities: ['Photography', 'Catering'],
      preferences: 'Pastel botanical theme',
    });

    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    const parsed = AIGeneratedPlanOutputSchema.safeParse(result.data);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.themeTitle).toBeTruthy();
      expect(parsed.data.recommendedExpenses.length).toBeGreaterThanOrEqual(3);
      expect(parsed.data.recommendedTasks.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('generates valid plan revision proposal conforming to schema', async () => {
    const result = await demoAdapter.revisePlan({
      currentPlanSummary: {
        title: 'Maya 10th Birthday',
        eventType: 'birthday',
        eventDate: '2026-11-20',
        budgetLimitPaise: 5000000,
        guestCount: 30,
      },
      changes: {
        newBudgetLimitPaise: 4000000, // Budget cut
      },
      deterministicWarnings: ['Budget reduced by 20%'],
    });

    const parsed = AIPlanRevisionProposalSchema.safeParse(result.data);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.tradeOffs.length).toBeGreaterThanOrEqual(1);
      expect(parsed.data.proposedExpenseAdjustments.length).toBeGreaterThan(0);
    }
  });

  it('generates valid inspiration studio output conforming to schema', async () => {
    const result = await demoAdapter.generateInspiration({
      eventType: 'community',
      title: 'Green Earth Festival',
      preferences: 'Zero-waste eco celebration',
      guestCount: 200,
      budgetLimitPaise: 15000000,
    });

    const parsed = InspirationStudioOutputSchema.safeParse(result.data);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.colorPalette.length).toBeGreaterThanOrEqual(3);
      expect(parsed.data.menuIdeas.length).toBeGreaterThanOrEqual(2);
      expect(parsed.data.budgetSavingAlternatives.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('rejects invalid or corrupted AI payload missing required fields', () => {
    const invalidPayload = {
      themeTitle: 'Broken Theme',
      // Missing conceptDescription, colorPalette, recommendedExpenses, etc.
    };

    const parsed = AIGeneratedPlanOutputSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });

  it('rejects AI payloads containing negative costs or invalid categories', () => {
    const negativeCostPayload = {
      themeTitle: 'Negative Budget',
      conceptDescription: 'A test event',
      colorPalette: ['#ffffff', '#000000'],
      recommendedExpenses: [
        { category: 'venue', name: 'Hall', estimatedCostPaise: -5000, priority: 'essential' },
        { category: 'catering', name: 'Food', estimatedCostPaise: 1000, priority: 'essential' },
        { category: 'decoration', name: 'Decor', estimatedCostPaise: 1000, priority: 'preferred' },
      ],
      recommendedTasks: [
        { title: 'T1', daysBeforeEvent: 10, priority: 'high' },
        { title: 'T2', daysBeforeEvent: 5, priority: 'medium' },
        { title: 'T3', daysBeforeEvent: 1, priority: 'low' },
      ],
      recommendedVendors: [
        { category: 'venue', title: 'V1', requirements: 'R1' },
        { category: 'catering', title: 'V2', requirements: 'R2' },
      ],
    };

    const parsed = AIGeneratedPlanOutputSchema.safeParse(negativeCostPayload);
    expect(parsed.success).toBe(false);
  });
});
