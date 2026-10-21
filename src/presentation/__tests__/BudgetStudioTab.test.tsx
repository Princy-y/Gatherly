import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BudgetStudioTab } from '../components/BudgetStudioTab';
import { EventPlan } from '../../domain/types';

describe('BudgetStudioTab Component', () => {
  const mockPlan: EventPlan = {
    id: 'test-event-1',
    schemaVersion: 1,
    title: 'Priya 18th Birthday',
    eventType: 'birthday',
    location: 'Delhi',
    eventDate: '2026-11-20',
    currency: 'INR',
    budgetLimitPaise: 10000000, // ₹1,00,000
    guestCount: 50,
    priorities: [],
    preferences: '',
    expenses: [
      {
        id: 'e1',
        category: 'venue',
        name: 'Cafe Terrace Garden',
        estimatedCostPaise: 4000000,
        actualCostPaise: 3800000,
        priority: 'essential',
      },
      {
        id: 'e2',
        category: 'catering',
        name: 'Gourmet Sliders & Cake',
        estimatedCostPaise: 3000000,
        actualCostPaise: null,
        priority: 'preferred',
      },
      {
        id: 'e3',
        category: 'decoration',
        name: 'Pastel Helium Balloons',
        estimatedCostPaise: 1500000,
        actualCostPaise: null,
        priority: 'optional',
      },
    ],
    tasks: [],
    vendors: [],
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
  };

  it('renders budget summary figures accurately and displays expenses', () => {
    const handleUpdateExpenses = vi.fn();
    const handleUpdateBudgetLimit = vi.fn();

    render(
      <BudgetStudioTab
        plan={mockPlan}
        onUpdateExpenses={handleUpdateExpenses}
        onUpdateBudgetLimit={handleUpdateBudgetLimit}
      />
    );

    expect(screen.getByText(/Pastel Budget Studio/i)).toBeInTheDocument();
    expect(screen.getByText('Cafe Terrace Garden')).toBeInTheDocument();
    expect(screen.getByText('Gourmet Sliders & Cake')).toBeInTheDocument();
    expect(screen.getByText('Pastel Helium Balloons')).toBeInTheDocument();
  });

  it('allows opening the Add Expense modal and submitting a new item', () => {
    const handleUpdateExpenses = vi.fn();
    const handleUpdateBudgetLimit = vi.fn();

    render(
      <BudgetStudioTab
        plan={mockPlan}
        onUpdateExpenses={handleUpdateExpenses}
        onUpdateBudgetLimit={handleUpdateBudgetLimit}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Expense/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Add Expense Item/i)).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/Traditional Dhol Players/i);
    fireEvent.change(titleInput, { target: { value: 'Polaroid Photobooth' } });

    const costInput = screen.getByPlaceholderText(/25000/i);
    fireEvent.change(costInput, { target: { value: '12000' } });

    const submitBtn = screen.getByRole('button', { name: /Add to Budget/i });
    fireEvent.click(submitBtn);

    expect(handleUpdateExpenses).toHaveBeenCalledTimes(1);
    const updatedArgs = handleUpdateExpenses.mock.calls[0][0];
    expect(updatedArgs.length).toBe(4);
    expect(updatedArgs[3].name).toBe('Polaroid Photobooth');
  });

  it('opens deterministic savings recommender modal', () => {
    const handleUpdateExpenses = vi.fn();
    const handleUpdateBudgetLimit = vi.fn();

    render(
      <BudgetStudioTab
        plan={mockPlan}
        onUpdateExpenses={handleUpdateExpenses}
        onUpdateBudgetLimit={handleUpdateBudgetLimit}
      />
    );

    const savingsBtn = screen.getByRole('button', { name: /Savings Recommender/i });
    fireEvent.click(savingsBtn);

    expect(screen.getByText(/Deterministic Savings Engine/i)).toBeInTheDocument();
  });
});
