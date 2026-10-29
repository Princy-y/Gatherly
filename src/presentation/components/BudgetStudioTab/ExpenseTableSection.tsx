import React from 'react';
import { EventPlan, Expense, ExpensePriority } from '../../../domain/types';
import { ExpenseTableRow } from './ExpenseTableRow';

interface ExpenseTableSectionProps {
  plan: EventPlan;
  filteredExpenses: Expense[];
  selectedPriorityFilter: 'all' | ExpensePriority;
  setSelectedPriorityFilter: (val: 'all' | ExpensePriority) => void;
  editingExpenseId: string | null;
  setEditingExpenseId: (val: string | null) => void;
  editingActualRupees: string;
  setEditingActualRupees: (val: string) => void;
  onSaveActualCost: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseTableSection: React.FC<ExpenseTableSectionProps> = ({
  plan,
  filteredExpenses,
  selectedPriorityFilter,
  setSelectedPriorityFilter,
  editingExpenseId,
  setEditingExpenseId,
  editingActualRupees,
  setEditingActualRupees,
  onSaveActualCost,
  onDeleteExpense,
}) => {
  return (
    <div className="scrapbook-card p-6 bg-white space-y-4">
      {/* Table Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-plum">
          <span>Filter Priority:</span>
          {(['all', 'essential', 'preferred', 'optional'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-full border text-xs capitalize font-semibold transition-all ${
                selectedPriorityFilter === p
                  ? 'bg-plum text-white border-plum shadow-xs'
                  : 'bg-white text-plum border-plum/30 hover:bg-lavender-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="text-xs text-plum-light font-medium">
          Showing {filteredExpenses.length} of {plan.expenses.length} expenses
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-plum bg-cream-100 text-plum font-bold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Item Name & Notes</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3 text-right">Estimated</th>
              <th className="py-2.5 px-3 text-right">Actual Invoiced</th>
              <th className="py-2.5 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-plum/15">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-plum-light italic">
                  No expenses match the current filter.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <ExpenseTableRow
                  key={exp.id}
                  exp={exp}
                  isEditing={editingExpenseId === exp.id}
                  editingActualRupees={editingActualRupees}
                  setEditingExpenseId={setEditingExpenseId}
                  setEditingActualRupees={setEditingActualRupees}
                  onSaveActualCost={onSaveActualCost}
                  onDeleteExpense={onDeleteExpense}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
