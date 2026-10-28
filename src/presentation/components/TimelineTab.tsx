import React from 'react';
import { EventPlan, Task } from '../../domain/types';
import { useTimeline } from './TimelineTab/useTimeline';
import { TimelineHeader } from './TimelineTab/TimelineHeader';
import { TimelineTaskList } from './TimelineTab/TimelineTaskList';
import { AddTaskModal } from './TimelineTab/AddTaskModal';

interface TimelineTabProps {
  plan: EventPlan;
  onUpdateTasks: (updatedTasks: Task[]) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ plan, onUpdateTasks }) => {
  const {
    statusFilter,
    setStatusFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    newTitle,
    setNewTitle,
    newDescription,
    setNewDescription,
    newDueDate,
    setNewDueDate,
    newPriority,
    setNewPriority,
    newDependencies,
    newVendorCategory,
    setNewVendorCategory,
    todayStr,
    dependencyValidation,
    filteredTasks,
    handleToggleTaskStatus,
    handleDeleteTask,
    handleAddTask,
    toggleDependency,
  } = useTimeline(plan, onUpdateTasks);

  return (
    <div className="space-y-6">
      <TimelineHeader
        eventDate={plan.eventDate}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        dependencyValidation={dependencyValidation}
      />

      <TimelineTaskList
        tasks={filteredTasks}
        allTasks={plan.tasks}
        todayStr={todayStr}
        onToggleStatus={handleToggleTaskStatus}
        onDeleteTask={handleDeleteTask}
      />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
        title={newTitle}
        onTitleChange={setNewTitle}
        description={newDescription}
        onDescriptionChange={setNewDescription}
        dueDate={newDueDate}
        onDueDateChange={setNewDueDate}
        priority={newPriority}
        onPriorityChange={setNewPriority}
        vendorCategory={newVendorCategory}
        onVendorCategoryChange={setNewVendorCategory}
        tasks={plan.tasks}
        dependencies={newDependencies}
        onToggleDependency={toggleDependency}
      />
    </div>
  );
};
