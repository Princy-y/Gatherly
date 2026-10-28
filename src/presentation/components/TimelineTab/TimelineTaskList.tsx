import React from 'react';
import { Task } from '../../../domain/types';
import { calculateDaysBetween } from '../../../domain/timeline';
import { KawaiiFlower } from '../KawaiiDecorations';
import { Calendar, CheckCircle2, Clock, Link, Trash2 } from 'lucide-react';

interface TimelineTaskListProps {
  tasks: Task[];
  allTasks: Task[];
  todayStr: string;
  onToggleStatus: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TimelineTaskList: React.FC<TimelineTaskListProps> = ({
  tasks,
  allTasks,
  todayStr,
  onToggleStatus,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="scrapbook-card p-8 text-center text-plum-light bg-white">
        <KawaiiFlower size={32} className="mx-auto mb-2" />
        <p className="font-bold text-sm">No tasks found matching this filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
        const daysLeft = calculateDaysBetween(todayStr, task.dueDate);
        const depTasks = allTasks.filter((t) => task.dependencies.includes(t.id));

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
                  onClick={() => onToggleStatus(task)}
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
                      {depTasks.map((dep) => (
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
                    onClick={() => onToggleStatus(task)}
                    className="text-[11px] font-bold text-plum hover:underline"
                  >
                    Status: <span className="capitalize">{task.status.replace('_', ' ')}</span>
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
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
      })}
    </div>
  );
};
