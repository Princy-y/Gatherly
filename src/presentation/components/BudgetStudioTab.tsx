import React, { useState } from 'react';
import { EventPlan, Expense, ExpenseCategory, ExpensePriority } from '../../domain/types';
import {
  calculateBudgetSummary,
  calculateCategoryBreakdown,
  generateDeterministicSavings,
  DeterministicSavingOption,
} from '../../domain/budget';
import { formatINR, parseRupeesInput, paiseToRupees } from '../../domain/currency';
import { KawaiiBow, KawaiiSparkle } from './KawaiiDecorations';
import { Plus, Trash2, Lightbulb, Check, Edit2, X } from 'lucide-react';

interface BudgetStudioTabProps {
  plan: EventPlan;
  onUpdateExpenses: (updatedExpenses: Expense[]) => void;
  onUpdateBudgetLimit: (newLimitPaise: number) => void;
}

export const BudgetStudioTab: React.FC<BudgetStudioTabProps> = ({
  plan,
  onUpdateExpenses,
  onUpdateBudgetLimit,
}) => {
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
    // Refresh recommendations list
    const remaining = savingsList.filter((s) => s.expenseId !== saving.expenseId);
    setSavingsList(remaining);
  };

  return (
    <div className="space-y-6">
      {/* Top Financial Dashboard Card */}
      <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
          <div>
            <div className="flex items-center gap-2">
              <KawaiiBow size={20} />
              <h1 className="font-heading font-bold text-2xl text-plum">Pastel Budget Studio</h1>
              <KawaiiSparkle size={16} />
            </div>
            <p className="text-xs text-plum-light font-medium mt-0.5">
              Deterministic, zero-rounding-error accounting in integer minor units (paise).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenSavingsRecommender}
              className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-plum" />
              <span>Savings Recommender</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-plum" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Financial Stat Ribbons */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-cream-50 border-2 border-plum/30">
            <div className="flex justify-between items-center text-xs font-bold text-plum-light uppercase">
              <span>Budget Cap</span>
              {!isEditingLimit ? (
                <button
                  onClick={() => setIsEditingLimit(true)}
                  className="text-plum hover:underline flex items-center gap-0.5 text-[11px]"
                  title="Edit Total Budget"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveBudgetLimit}
                  className="text-green-700 font-bold text-[11px] flex items-center gap-0.5"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
              )}
            </div>
            {!isEditingLimit ? (
              <div className="font-heading font-bold text-xl text-plum mt-1">
                {formatINR(plan.budgetLimitPaise)}
              </div>
            ) : (
              <input
                type="text"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveBudgetLimit()}
                className="w-full mt-1 px-2 py-0.5 text-sm font-bold border border-plum rounded bg-white text-plum"
                autoFocus
              />
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-iceBlue-50 border-2 border-plum/30">
            <div className="text-xs font-bold text-plum-light uppercase">Estimated Total</div>
            <div className="font-heading font-bold text-xl text-plum mt-1">
              {formatINR(summary.totalEstimatedPaise)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-mint-50 border-2 border-plum/30">
            <div className="text-xs font-bold text-plum-light uppercase">Actual Invoiced</div>
            <div className="font-heading font-bold text-xl text-plum mt-1">
              {formatINR(summary.totalActualPaise)}
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border-2 ${
              summary.isOverrun ? 'bg-blush-100 border-red-500' : 'bg-butter-50 border-plum/30'
            }`}
          >
            <div className="text-xs font-bold text-plum-light uppercase">
              {summary.isOverrun ? 'Overrun Deficit' : 'Net Surplus'}
            </div>
            <div
              className={`font-heading font-bold text-xl mt-1 ${
                summary.isOverrun ? 'text-red-700' : 'text-plum'
              }`}
            >
              {summary.isOverrun
                ? `-${formatINR(summary.overrunPaise)}`
                : formatINR(summary.remainingBudgetPaise)}
            </div>
          </div>
        </div>
      </div>

      {/* Category Spend Distribution */}
      <div className="scrapbook-card p-6 bg-white">
        <h2 className="font-heading font-bold text-sm text-plum uppercase tracking-wider mb-3">
          Category Distribution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryBreakdowns.map((cat) => (
            <div key={cat.category} className="p-3 rounded-xl bg-cream-50 border border-plum/20">
              <div className="flex justify-between items-center text-xs font-bold text-plum mb-1">
                <span className="capitalize">{cat.category}</span>
                <span>{formatINR(cat.effectivePaise)}</span>
              </div>
              <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lavender-300 rounded-full"
                  style={{ width: `${Math.min(100, cat.percentageOfTotal)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-plum-light mt-1">
                <span>{cat.itemCount} items</span>
                <span>{cat.percentageOfTotal}% of total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Table Section */}
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
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveActualCost(exp)}
                              placeholder="0"
                              className="w-20 px-1.5 py-0.5 text-xs border border-plum rounded bg-white text-plum text-right font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveActualCost(exp)}
                              className="p-1 text-green-700 hover:bg-green-100 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
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

      {/* Add Expense Modal */}
      {isAddModalOpen && (
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
                onClick={() => setIsAddModalOpen(false)}
                className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
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
                  onClick={() => setIsAddModalOpen(false)}
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
      )}

      {/* Savings Recommender Drawer / Modal */}
      {isSavingsModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg text-plum">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-butter-300" />
                <h3 className="font-heading font-bold text-lg text-plum">
                  Deterministic Savings Engine
                </h3>
              </div>
              <button
                onClick={() => setIsSavingsModalOpen(false)}
                className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-plum-light mb-4">
              The engine prioritizes cuts that preserve essential pillars. Optional items are
              eliminated first, followed by preferred scope negotiation.
            </p>

            {savingsList.length === 0 ? (
              <div className="p-4 rounded-xl bg-mint-100 border border-plum/30 text-xs font-bold text-center">
                ✨ No urgent budget cuts needed! Your budget is healthy and balanced.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {savingsList.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border-2 border-plum bg-white shadow-kawaii-sm flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-plum">{rec.name}</span>
                        <span className="kawaii-badge bg-mint-200 text-plum text-[10px]">
                          Save {formatINR(rec.potentialSavingPaise)}
                        </span>
                      </div>
                      <p className="text-xs text-plum-light mt-1">{rec.suggestion}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleApplySaving(rec)}
                        className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum font-bold text-xs px-3 py-1.5 rounded-lg border border-plum flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Apply Recommendation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-plum/20 flex justify-end">
              <button
                onClick={() => setIsSavingsModalOpen(false)}
                className="btn-kawaii bg-white px-4 py-2 rounded-xl border border-plum text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
