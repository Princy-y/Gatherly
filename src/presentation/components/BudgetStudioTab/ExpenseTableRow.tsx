import React from 'react';
import { Expense } from '../../../domain/types';
import { formatINR, paiseToRupees } from '../../../domain/currency';
import { Check, Trash2 } from 'lucide-react';

interface ExpenseTableRowProps {
  exp: Expense;
  isEditing: boolean;
  editingActualRupees: string;
  setEditingExpenseId: (val: string | null) => void;
  setEditingActualRupees: (val: string) => void;
  onSaveActualCost: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseTableRow: React.FC<ExpenseTableRowProps> = ({
  exp,
  isEditing,
  editingActualRupees,
  setEditingExpenseId,
  setEditingActualRupees,
  onSaveActualCost,
  onDeleteExpense,
}) => {
  const priorityBadgeClass =
    exp.priority === 'essential'
      ? 'bg-blush-200 text-plum'
      : exp.priority === 'preferred'
        ? 'bg-butter-200 text-plum'
        : 'bg-mint-200 text-plum';

  return (
    <tr className="hover:bg-cream-50 transition-colors">
      <td className="py-3 px-3">
        <div className="font-bold text-plum">{exp.name}</div>
        {exp.notes && <div className="text-[11px] text-plum-light italic">{exp.notes}</div>}
      </td>
      <td className="py-3 px-3">
        <span className="capitalize text-xs font-semibold text-plum bg-lavender-50 px-2 py-0.5 rounded-md border border-plum/20">
          {exp.category}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className={`kawaii-badge text-[10px] capitalize ${priorityBadgeClass}`}>
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
};
