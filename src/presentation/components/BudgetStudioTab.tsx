import React from 'react';
import { EventPlan, Expense } from '../../domain/types';
import { useBudgetStudio } from './BudgetStudioTab/useBudgetStudio';
import { BudgetOverviewCard } from './BudgetStudioTab/BudgetOverviewCard';
import { CategoryBreakdownSection } from './BudgetStudioTab/CategoryBreakdownSection';
import { ExpenseTableSection } from './BudgetStudioTab/ExpenseTableSection';
import { AddExpenseModal } from './BudgetStudioTab/AddExpenseModal';
import { SavingsRecommenderModal } from './BudgetStudioTab/SavingsRecommenderModal';

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
  const {
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
  } = useBudgetStudio(plan, onUpdateExpenses, onUpdateBudgetLimit);

  return (
    <div className="space-y-6">
      <BudgetOverviewCard
        plan={plan}
        summary={summary}
        isEditingLimit={isEditingLimit}
        setIsEditingLimit={setIsEditingLimit}
        limitInput={limitInput}
        setLimitInput={setLimitInput}
        onSaveBudgetLimit={handleSaveBudgetLimit}
        onOpenSavingsRecommender={handleOpenSavingsRecommender}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <CategoryBreakdownSection categoryBreakdowns={categoryBreakdowns} />

      <ExpenseTableSection
        plan={plan}
        filteredExpenses={filteredExpenses}
        selectedPriorityFilter={selectedPriorityFilter}
        setSelectedPriorityFilter={setSelectedPriorityFilter}
        editingExpenseId={editingExpenseId}
        setEditingExpenseId={setEditingExpenseId}
        editingActualRupees={editingActualRupees}
        setEditingActualRupees={setEditingActualRupees}
        onSaveActualCost={handleSaveActualCost}
        onDeleteExpense={handleDeleteExpense}
      />

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExpense}
        newName={newName}
        setNewName={setNewName}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newPriority={newPriority}
        setNewPriority={setNewPriority}
        newEstimateRupees={newEstimateRupees}
        setNewEstimateRupees={setNewEstimateRupees}
        newNotes={newNotes}
        setNewNotes={setNewNotes}
      />

      <SavingsRecommenderModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        savingsList={savingsList}
        onApplySaving={handleApplySaving}
      />
    </div>
  );
};
