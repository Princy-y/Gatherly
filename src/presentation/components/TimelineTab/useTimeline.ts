import { useState } from 'react';
import confetti from 'canvas-confetti';
import { EventPlan, Task, TaskPriority, TaskStatus, ExpenseCategory } from '../../../domain/types';
import { getTopologicalOrder, validateDependencies } from '../../../domain/timeline';

export function useTimeline(plan: EventPlan, onUpdateTasks: (updatedTasks: Task[]) => void) {
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date(plan.eventDate + 'T00:00:00Z');
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  });
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDependencies, setNewDependencies] = useState<string[]>([]);
  const [newVendorCategory, setNewVendorCategory] = useState<ExpenseCategory | ''>('');

  const todayStr = new Date().toISOString().split('T')[0];
  const dependencyValidation = validateDependencies(plan.tasks);
  const topologicallyOrderedTasks = getTopologicalOrder(plan.tasks);

  const filteredTasks =
    statusFilter === 'all'
      ? topologicallyOrderedTasks
      : topologicallyOrderedTasks.filter((t) => t.status === statusFilter);

  const handleToggleTaskStatus = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'todo';

    if (nextStatus === 'completed') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#DCCEFF', '#FFD9E8', '#FFF0B8', '#D5F3DF'],
        });
      } catch {
        // Ignored if confetti is blocked or not available in environment
      }
    }

    const updated = plan.tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t));
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = plan.tasks
      .filter((t) => t.id !== id)
      .map((t) => ({
        ...t,
        dependencies: t.dependencies.filter((depId) => depId !== id),
      }));
    onUpdateTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      dueDate: newDueDate,
      status: 'todo',
      priority: newPriority,
      dependencies: newDependencies,
      vendorCategory: newVendorCategory ? (newVendorCategory as ExpenseCategory) : undefined,
    };

    onUpdateTasks([...plan.tasks, newTask]);
    setNewTitle('');
    setNewDescription('');
    setNewDependencies([]);
    setIsAddModalOpen(false);
  };

  const toggleDependency = (depId: string) => {
    if (newDependencies.includes(depId)) {
      setNewDependencies(newDependencies.filter((id) => id !== depId));
    } else {
      setNewDependencies([...newDependencies, depId]);
    }
  };

  return {
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
  };
}
