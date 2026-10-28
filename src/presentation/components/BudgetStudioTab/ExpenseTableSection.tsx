import React from 'react';
import { EventPlan, Expense, ExpensePriority } from '../../../domain/types';
import { formatINR, paiseToRupees } from '../../../domain/currency';
import { Check, Trash2 } from 'lucide-react';

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
              filteredExpenses.map((exp) => {
                const isEditing = editingExpenseId === exp.id;
                return (
                  <tr key={exp.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-plum">{exp.name}</div>
                      {exp.notes && (
                        <div className="text-[11px] text-plum-light italic">{exp.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-xs font-semibold text-plum bg-lavender-50 px-2 py-0.5 rounded-md border border-plum/20">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`kawaii-badge text-[10px] capitalize ${
                          exp.priority === 'essential'
                            ? 'bg-blush-200 text-plum'
                            : exp.priority === 'preferred'
                              ? 'bg-butter-200 text-plum'
                              : 'bg-mint-200 text-plum'
                        }`}
                      >
                        {exp.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-plum">
                      {formatINR(exp.estimatedCostPaise)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold">
                      {!isEditing ? (
                        <span
                          onClick={() => {
                            setEditingExpenseId(exp.id);
                            setEditingActualRupees(
                              exp.actualCostPaise !== null && exp.actualCostPaise !== undefined
                                ? paiseToRupees(exp.actualCostPaise).toString()
                                : ''
                            );
                          }}
                          className={`cursor-pointer hover:underline ${
                            exp.actualCostPaise !== null && exp.actualCostPaise !== undefined
                              ? 'text-plum'
                              : 'text-plum-light/70 italic text-xs'
                          }`}
                          title="Click to enter actual invoiced cost"
                        >
                          {exp.actualCostPaise !== null && exp.actualCostPaise !== undefined
                            ? formatINR(exp.actualCostPaise)
                            : '+ Enter actual'}
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-xs">₹</span>
                          <input
                            type="text"
                            value={editingActualRupees}
                            onChange={(e) => setEditingActualRupees(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSaveActualCost(exp)}
                            placeholder="0"
                            className="w-20 px-1.5 py-0.5 text-xs border border-plum rounded bg-white text-plum text-right font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => onSaveActualCost(exp)}
                            className="p-1 text-green-700 hover:bg-green-100 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1.5 text-plum hover:text-red-700 hover:bg-blush-100 rounded-lg transition-colors"
                        title="Delete Expense"
                        aria-label={`Delete ${exp.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
