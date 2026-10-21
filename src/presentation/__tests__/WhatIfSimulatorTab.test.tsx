import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WhatIfSimulatorTab } from '../components/WhatIfSimulatorTab';
import { EventPlan } from '../../domain/types';

describe('WhatIfSimulatorTab Signature Replanner Component', () => {
  const mockPlan: EventPlan = {
    id: 'test-event-wedding',
    schemaVersion: 1,
    title: 'Aditi & Kabir Wedding',
    eventType: 'wedding',
    location: 'Goa',
    eventDate: '2026-12-25',
    currency: 'INR',
    budgetLimitPaise: 150000000, // ₹15 Lakhs
    guestCount: 150,
    priorities: ['Catering', 'Music'],
    preferences: '',
    expenses: [
      {
        id: 'e1',
        category: 'venue',
        name: 'Beach Resort Lawn',
        estimatedCostPaise: 80000000,
        actualCostPaise: 75000000,
        priority: 'essential',
      },
      {
        id: 'e2',
        category: 'catering',
        name: 'Coastal Seafood & Vegetarian Buffet',
        estimatedCostPaise: 70000000,
        actualCostPaise: null,
        priority: 'essential',
      },
    ],
    tasks: [
      {
        id: 't1',
        title: 'Sign Beach Lawn Contract',
        description: '',
        dueDate: '2026-10-15',
        status: 'completed',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 't2',
        title: 'Tasting & Beverage Lockin',
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

  it('renders simulator controls and performs live deterministic consequence math', () => {
    const handleApplyPlanRevision = vi.fn();

    render(
      <WhatIfSimulatorTab
        plan={mockPlan}
        onApplyPlanRevision={handleApplyPlanRevision}
      />
    );

    expect(screen.getByText(/Constraint-Aware What-If Replanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 1: Deterministic Consequence Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget Constraint/i)).toBeInTheDocument();
    expect(screen.getByText(/Guest Count/i)).toBeInTheDocument();
  });

  it('calculates deterministic warnings when budget is cut', () => {
    const handleApplyPlanRevision = vi.fn();

    render(
      <WhatIfSimulatorTab
        plan={mockPlan}
        onApplyPlanRevision={handleApplyPlanRevision}
      />
    );

    // Click -25% Cut button
    const cutBtn = screen.getByRole('button', { name: /-25% Cut/i });
    fireEvent.click(cutBtn);

    // The live consequence calculation should reflect budget overrun warning
    expect(screen.getByText(/Calculated Planning Flags:/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget Overrun:/i)).toBeInTheDocument();
  });

  it('consults AI replanning engine and displays trade-off review card', async () => {
    const handleApplyPlanRevision = vi.fn();

    render(
      <WhatIfSimulatorTab
        plan={mockPlan}
        onApplyPlanRevision={handleApplyPlanRevision}
      />
    );

    // Apply budget cut
    fireEvent.click(screen.getByRole('button', { name: /-10% Cut/i }));

    const consultBtn = screen.getByRole('button', { name: /Step 2: Consult AI for Trade-Off Proposal/i });
    fireEvent.click(consultBtn);

    // Wait for AI proposal card to render
    expect(
      await screen.findByText(/Step 3 & 4: Before vs After & Trade-Off Breakdown/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Key Trade-Offs & Compensations:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply Approved Changes/i })).toBeInTheDocument();

    // Click Apply Approved Changes
    const applyBtn = screen.getByRole('button', { name: /Apply Approved Changes/i });
    fireEvent.click(applyBtn);

    expect(handleApplyPlanRevision).toHaveBeenCalledTimes(1);
  });
});
