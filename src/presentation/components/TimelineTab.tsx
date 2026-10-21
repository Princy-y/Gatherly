import React, { useState } from 'react';
import { EventPlan, Task, TaskPriority, TaskStatus, ExpenseCategory } from '../../domain/types';
import {
  getTopologicalOrder,
  validateDependencies,
  calculateDaysBetween,
} from '../../domain/timeline';
import {
  KawaiiBow,
  KawaiiSparkle,
  KawaiiFlower,
} from './KawaiiDecorations';
import {
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Link,
  X,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimelineTabProps {
  plan: EventPlan;
  onUpdateTasks: (updatedTasks: Task[]) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ plan, onUpdateTasks }) => {
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

  const filteredTasks = statusFilter === 'all'
    ? topologicallyOrderedTasks
    : topologicallyOrderedTasks.filter(t => t.status === statusFilter);

  const handleToggleTaskStatus = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'todo'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'todo';

    if (nextStatus === 'completed') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#DCCEFF', '#FFD9E8', '#FFF0B8', '#D5F3DF'],
        });
      } catch {}
    }

    const updated = plan.tasks.map(t =>
      t.id === task.id ? { ...t, status: nextStatus } : t
    );
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    // Also remove this task ID from any dependencies of other tasks
    const updated = plan.tasks
      .filter(t => t.id !== id)
      .map(t => ({
        ...t,
        dependencies: t.dependencies.filter(depId => depId !== id),
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
      setNewDependencies(newDependencies.filter(id => id !== depId));
    } else {
      setNewDependencies([...newDependencies, depId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Planner Bar */}
      <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
          <div>
            <div className="flex items-center gap-2">
              <KawaiiBow size={20} />
              <h1 className="font-heading font-bold text-2xl text-plum">
                Timeline & Milestone Planner
              </h1>
              <KawaiiSparkle size={16} />
            </div>
            <p className="text-xs text-plum-light font-medium mt-0.5">
              Deterministic task scheduling with dependency graph validation and automated cycle detection.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-4 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-plum" />
            <span>Add Preparation Task</span>
          </button>
        </div>

        {/* Circular Dependency Warning Banner */}
        {!dependencyValidation.valid && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-xl bg-blush-100 border-2 border-red-500 text-xs text-plum font-semibold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <div className="font-bold text-red-700">Timeline Dependency Conflict:</div>
              <ul className="list-disc pl-4 mt-0.5">
                {dependencyValidation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-plum">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
            {(['all', 'todo', 'in_progress', 'completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-full border text-xs capitalize font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-plum text-white border-plum shadow-xs'
                    : 'bg-white text-plum border-plum/30 hover:bg-lavender-100'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs text-plum-light font-medium">
            Event Date: {new Date(plan.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </div>
        </div>
      </div>

      {/* Task Cards Roadmap */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="scrapbook-card p-8 text-center text-plum-light bg-white">
            <KawaiiFlower size={32} className="mx-auto mb-2" />
            <p className="font-bold text-sm">No tasks found matching this filter.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
            const daysLeft = calculateDaysBetween(todayStr, task.dueDate);
            const depTasks = plan.tasks.filter(t => task.dependencies.includes(t.id));

            return (
              <div
                key={task.id}
                className={`scrapbook-card p-4 sm:p-5 bg-white transition-all ${
                  task.status === 'completed' ? 'opacity-85 bg-mint-50/50' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Left: Checkbox + Title + Description */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task)}
                      title={`Current: ${task.status}. Click to progress.`}
                      aria-label={`Toggle status for ${task.title}`}
                      className={`mt-0.5 w-6 h-6 rounded-lg border-2 border-plum flex items-center justify-center shrink-0 transition-colors ${
                        task.status === 'completed'
                          ? 'bg-mint-300'
                          : task.status === 'in_progress'
                          ? 'bg-butter-200'
                          : 'bg-white hover:bg-lavender-100'
                      }`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-plum font-bold" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="w-3.5 h-3.5 text-plum animate-pulse" />
                      ) : null}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-plum-light/70">#{index + 1}</span>
                        <h3
                          className={`font-bold text-sm sm:text-base text-plum ${
                            task.status === 'completed' ? 'line-through text-plum-light' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Priority Badge */}
                        <span
                          className={`kawaii-badge text-[10px] capitalize ${
                            task.priority === 'high'
                              ? 'bg-blush-200 text-plum'
                              : task.priority === 'medium'
                              ? 'bg-butter-200 text-plum'
                              : 'bg-iceBlue-200 text-plum'
                          }`}
                        >
                          {task.priority} Priority
                        </span>

                        {/* Vendor Tag */}
                        {task.vendorCategory && (
                          <span className="text-[10px] font-semibold bg-lavender-100 text-plum px-2 py-0.5 rounded-full border border-plum/20">
                            🏷️ {task.vendorCategory}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-plum-light mt-1 max-w-xl">{task.description}</p>
                      )}

                      {/* Dependencies */}
                      {depTasks.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] font-medium text-plum">
                          <Link className="w-3 h-3 text-plum-light" />
                          <span className="text-plum-light">Prerequisites:</span>
                          {depTasks.map(dep => (
                            <span
                              key={dep.id}
                              className={`px-1.5 py-0.5 rounded border text-[10px] ${
                                dep.status === 'completed'
                                  ? 'bg-mint-100 border-green-600 text-green-800'
                                  : 'bg-butter-100 border-amber-600 text-amber-900'
                              }`}
                            >
                              {dep.status === 'completed' ? '✓ ' : '⏳ '}
                              {dep.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Due Date & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                    <div
                      className={`kawaii-badge text-xs font-bold ${
                        task.status === 'completed'
                          ? 'bg-mint-200 text-plum'
                          : isOverdue
                          ? 'bg-blush-200 text-red-800 animate-bounce'
                          : 'bg-butter-100 text-plum'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.status !== 'completed' && (
                        <span className="text-[10px]">
                          ({isOverdue ? 'Overdue!' : `${daysLeft}d left`})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className="text-[11px] font-bold text-plum hover:underline"
                      >
                        Status: <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-plum-light hover:text-red-700 hover:bg-blush-100 rounded"
                        title="Delete Task"
                        aria-label={`Delete task ${task.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg text-plum">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Preparation Task
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taste & Select Cake Flavors"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description / Brief</label>
                <textarea
                  rows={2}
                  placeholder="Action items, contact person, or specifications"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border-2 border-plum rounded-xl text-xs text-plum"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Associated Vendor Category</label>
                <select
                  value={newVendorCategory}
                  onChange={e => setNewVendorCategory(e.target.value as ExpenseCategory | '')}
                  className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
                >
                  <option value="">None (Independent task)</option>
                  <option value="venue">Venue</option>
                  <option value="catering">Catering</option>
                  <option value="photography">Photography</option>
                  <option value="decoration">Decoration</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="invitations">Invitations</option>
                  <option value="transportation">Transportation</option>
                  <option value="permits">Permits</option>
                </select>
              </div>

              {/* Dependency picker */}
              {plan.tasks.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Prerequisite Dependencies</label>
                  <div className="max-h-28 overflow-y-auto border border-plum/30 rounded-xl p-2 bg-white space-y-1">
                    {plan.tasks.map(t => (
                      <label key={t.id} className="flex items-center gap-2 text-xs text-plum cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newDependencies.includes(t.id)}
                          onChange={() => toggleDependency(t.id)}
                          className="rounded text-plum"
                        />
                        <span className="truncate">{t.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
