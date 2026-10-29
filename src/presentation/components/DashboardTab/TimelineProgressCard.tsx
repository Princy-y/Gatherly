import React from 'react';
import { Task } from '../../../domain/types';
import { KawaiiBow } from '../KawaiiDecorations';
import { ArrowRight } from 'lucide-react';

interface TimelineProgressCardProps {
  completedTasks: number;
  totalTasks: number;
  taskPercent: number;
  upcomingTasks: Task[];
  onNavigateTimeline: () => void;
  onCelebrate: () => void;
}

export const TimelineProgressCard: React.FC<TimelineProgressCardProps> = ({
  completedTasks,
  totalTasks,
  taskPercent,
  upcomingTasks,
  onNavigateTimeline,
  onCelebrate,
}) => {
  return (
    <div className="scrapbook-card p-6 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KawaiiBow size={20} />
            <h2 className="font-heading font-bold text-lg text-plum">Timeline Progress</h2>
          </div>
          <button
            onClick={onNavigateTimeline}
            className="text-xs font-bold text-plum hover:underline flex items-center gap-1"
          >
            <span>View All ({totalTasks})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-plum mb-1.5">
            <span>
              {completedTasks} of {totalTasks} Tasks Completed
            </span>
            <span>{taskPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Task completion progress"
            aria-valuenow={taskPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-3.5 bg-cream-200 border-2 border-plum rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-mint-300 transition-all duration-500 rounded-full"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-plum-light uppercase tracking-wider mb-1">
            Immediate Upcoming Tasks:
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-xs text-plum-light italic p-3 bg-cream-50 rounded-xl border border-plum/20">
              🎉 All tasks are up to date! Great job!
            </div>
          ) : (
            upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="p-2.5 rounded-xl border border-plum/30 bg-cream-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="font-bold text-plum truncate">{task.title}</div>
                <span className="shrink-0 kawaii-badge bg-butter-100 text-plum text-[10px]">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-plum/20 flex justify-between items-center">
        <span className="text-xs text-plum-light font-medium">
          Celebration sticker unlocked on completion!
        </span>
        <button
          onClick={onCelebrate}
          className="text-xs font-bold text-plum px-2.5 py-1 bg-lavender-100 hover:bg-lavender-200 border border-plum rounded-lg"
        >
          ✨ Celebrate
        </button>
      </div>
    </div>
  );
};
