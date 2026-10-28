import React from 'react';
import { ExpenseCategory, ExpensePriority } from '../../../domain/types';
import { Plus, X } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newName: string;
  setNewName: (val: string) => void;
  newCategory: ExpenseCategory;
  setNewCategory: (val: ExpenseCategory) => void;
  newPriority: ExpensePriority;
  setNewPriority: (val: ExpensePriority) => void;
  newEstimateRupees: string;
  setNewEstimateRupees: (val: string) => void;
  newNotes: string;
  setNewNotes: (val: string) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newName,
  setNewName,
  newCategory,
  setNewCategory,
  newPriority,
  setNewPriority,
  newEstimateRupees,
  setNewEstimateRupees,
  newNotes,
  setNewNotes,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg text-plum">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-lg flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Expense Item
          </h3>
          <button
            onClick={onClose}
            className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Traditional Dhol Players"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
              >
                <option value="venue">Venue</option>
                <option value="catering">Catering</option>
                <option value="photography">Photography</option>
                <option value="decoration">Decoration</option>
                <option value="entertainment">Entertainment</option>
                <option value="invitations">Invitations</option>
                <option value="transportation">Transportation</option>
                <option value="permits">Permits</option>
                <option value="attire">Attire</option>
                <option value="miscellaneous">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as ExpensePriority)}
                className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
              >
                <option value="essential">Essential (Must-have)</option>
                <option value="preferred">Preferred</option>
                <option value="optional">Optional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Estimated Cost (₹ INR) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 25000"
              value={newEstimateRupees}
              onChange={(e) => setNewEstimateRupees(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Notes / Inclusions</label>
            <input
              type="text"
              placeholder="e.g. 2 hours performance"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-kawaii bg-white px-3 py-2 rounded-xl border border-plum text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 px-4 py-2 rounded-xl border border-plum text-xs font-bold"
            >
              Add to Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
