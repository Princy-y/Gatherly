import { useState } from 'react';
import { EventPlan, Expense, ExpenseCategory, ExpensePriority } from '../../../domain/types';
import {
  calculateBudgetSummary,
  calculateCategoryBreakdown,
  generateDeterministicSavings,
  DeterministicSavingOption,
} from '../../../domain/budget';
import { parseRupeesInput, paiseToRupees } from '../../../domain/currency';

export function useBudgetStudio(
  plan: EventPlan,
  onUpdateExpenses: (updatedExpenses: Expense[]) => void,
  onUpdateBudgetLimit: (newLimitPaise: number) => void
) {
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | ExpensePriority>(
    'all'
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [savingsList, setSavingsList] = useState<DeterministicSavingOption[]>([]);

  // Editing budget limit
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState(paiseToRupees(plan.budgetLimitPaise).toString());

  // New expense form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('catering');
  const [newEstimateRupees, setNewEstimateRupees] = useState('');
  const [newPriority, setNewPriority] = useState<ExpensePriority>('essential');
  const [newNotes, setNewNotes] = useState('');

  // Editing actual cost inline
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingActualRupees, setEditingActualRupees] = useState<string>('');

  const summary = calculateBudgetSummary(plan.budgetLimitPaise, plan.expenses);
  const categoryBreakdowns = calculateCategoryBreakdown(plan.budgetLimitPaise, plan.expenses);

  const filteredExpenses =
    selectedPriorityFilter === 'all'
      ? plan.expenses
      : plan.expenses.filter((e) => e.priority === selectedPriorityFilter);

  const handleSaveBudgetLimit = () => {
    const paise = parseRupeesInput(limitInput);
    if (paise >= 0) {
      onUpdateBudgetLimit(paise);
    }
    setIsEditingLimit(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const estPaise = parseRupeesInput(newEstimateRupees);
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      estimatedCostPaise: estPaise,
      actualCostPaise: null,
      priority: newPriority,
      notes: newNotes.trim() || undefined,
    };

    onUpdateExpenses([...plan.expenses, newExpense]);
    setNewName('');
    setNewEstimateRupees('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateExpenses(plan.expenses.filter((e) => e.id !== id));
  };

  const handleSaveActualCost = (expense: Expense) => {
    const actualPaise = editingActualRupees === '' ? null : parseRupeesInput(editingActualRupees);
    const updated = plan.expenses.map((e) =>
      e.id === expense.id ? { ...e, actualCostPaise: actualPaise } : e
    );
    onUpdateExpenses(updated);
    setEditingExpenseId(null);
  };

  const handleOpenSavingsRecommender = () => {
    const recs = generateDeterministicSavings(plan.budgetLimitPaise, plan.expenses);
    setSavingsList(recs);
    setIsSavingsModalOpen(true);
  };

  const handleApplySaving = (saving: DeterministicSavingOption) => {
    if (saving.strategy === 'eliminate_optional') {
      onUpdateExpenses(plan.expenses.filter((e) => e.id !== saving.expenseId));
    } else if (saving.strategy === 'reduce_preferred') {
      const updated = plan.expenses.map((e) => {
        if (e.id === saving.expenseId) {
          return {
            ...e,
            estimatedCostPaise: Math.max(0, e.estimatedCostPaise - saving.potentialSavingPaise),
          };
        }
        return e;
      });
      onUpdateExpenses(updated);
    }
    const remaining = savingsList.filter((s) => s.expenseId !== saving.expenseId);
    setSavingsList(remaining);
  };

  return {
    selectedPriorityFilter,
    setSelectedPriorityFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    isSavingsModalOpen,
    setIsSavingsModalOpen,
    savingsList,
    isEditingLimit,
    setIsEditingLimit,
    limitInput,
    setLimitInput,
    newName,
    setNewName,
    newCategory,
    setNewCategory,
    newEstimateRupees,
    setNewEstimateRupees,
    newPriority,
    setNewPriority,
    newNotes,
    setNewNotes,
    editingExpenseId,
    setEditingExpenseId,
    editingActualRupees,
    setEditingActualRupees,
    summary,
    categoryBreakdowns,
    filteredExpenses,
    handleSaveBudgetLimit,
    handleAddExpense,
    handleDeleteExpense,
    handleSaveActualCost,
    handleOpenSavingsRecommender,
    handleApplySaving,
  };
}
