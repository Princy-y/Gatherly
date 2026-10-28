import React from 'react';
import { Task, TaskPriority, ExpenseCategory } from '../../../domain/types';
import { Plus, X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onTitleChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  dueDate: string;
  onDueDateChange: (val: string) => void;
  priority: TaskPriority;
  onPriorityChange: (val: TaskPriority) => void;
  vendorCategory: ExpenseCategory | '';
  onVendorCategoryChange: (val: ExpenseCategory | '') => void;
  tasks: Task[];
  dependencies: string[];
  onToggleDependency: (id: string) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  dueDate,
  onDueDateChange,
  priority,
  onPriorityChange,
  vendorCategory,
  onVendorCategoryChange,
  tasks,
  dependencies,
  onToggleDependency,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Taste & Select Cake Flavors"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Description / Brief</label>
            <textarea
              rows={2}
              placeholder="Action items, contact person, or specifications"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border-2 border-plum rounded-xl text-xs text-plum"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => onDueDateChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
                className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Associated Vendor Category
            </label>
            <select
              value={vendorCategory}
              onChange={(e) => onVendorCategoryChange(e.target.value as ExpenseCategory | '')}
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
          {tasks.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Prerequisite Dependencies
              </label>
              <div className="max-h-28 overflow-y-auto border border-plum/30 rounded-xl p-2 bg-white space-y-1">
                {tasks.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 text-xs text-plum cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={dependencies.includes(t.id)}
                      onChange={() => onToggleDependency(t.id)}
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
              onClick={onClose}
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
  );
};
