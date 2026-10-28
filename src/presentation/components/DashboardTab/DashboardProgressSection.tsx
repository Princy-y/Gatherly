import React from 'react';
import { Task, VendorChecklistItem } from '../../../domain/types';
import { KawaiiBow, KawaiiFlower } from '../KawaiiDecorations';
import { ArrowRight, Sparkles } from 'lucide-react';

interface DashboardProgressSectionProps {
  tasks: Task[];
  vendors: VendorChecklistItem[];
  completedTasks: number;
  totalTasks: number;
  taskPercent: number;
  bookedVendors: number;
  totalVendors: number;
  upcomingTasks: Task[];
  onNavigateTab: (tab: 'budget' | 'timeline' | 'vendors' | 'inspiration' | 'whatif') => void;
  onCelebrate: () => void;
}

export const DashboardProgressSection: React.FC<DashboardProgressSectionProps> = ({
  vendors,
  completedTasks,
  totalTasks,
  taskPercent,
  bookedVendors,
  totalVendors,
  upcomingTasks,
  onNavigateTab,
  onCelebrate,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Planner Snapshot */}
      <div className="scrapbook-card p-6 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <KawaiiBow size={20} />
              <h2 className="font-heading font-bold text-lg text-plum">Timeline Progress</h2>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
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

      {/* Vendor Checklist Snapshot */}
      <div className="scrapbook-card p-6 bg-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <KawaiiFlower size={20} />
              <h2 className="font-heading font-bold text-lg text-plum">Vendor Checkpoints</h2>
            </div>
            <button
              onClick={() => onNavigateTab('vendors')}
              className="text-xs font-bold text-plum hover:underline flex items-center gap-1"
            >
              <span>Checklist ({totalVendors})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-plum mb-1.5">
              <span>
                {bookedVendors} of {totalVendors} Vendors Booked
              </span>
              <span>
                {totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Vendor booking progress"
              aria-valuenow={
                totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0
              }
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-3.5 bg-cream-200 border-2 border-plum rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-lavender-300 transition-all duration-500 rounded-full"
                style={{
                  width: `${totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Vendor List Items */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-plum-light uppercase tracking-wider mb-1">
              Active Vendor Tracks:
            </div>
            {vendors.slice(0, 4).map((v) => (
              <div
                key={v.id}
                className="p-2.5 rounded-xl border border-plum/30 bg-cream-50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-plum">{v.title}</span>
                  <span className="text-[11px] text-plum-light ml-2">({v.category})</span>
                </div>
                <span
                  className={`shrink-0 kawaii-badge text-[10px] uppercase ${
                    v.bookingStatus === 'booked'
                      ? 'bg-mint-200 text-plum'
                      : v.bookingStatus === 'shortlisted'
                        ? 'bg-butter-200 text-plum'
                        : 'bg-cream-200 text-plum-light'
                  }`}
                >
                  {v.bookingStatus.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-plum/20">
          <button
            onClick={() => onNavigateTab('whatif')}
            className="w-full btn-kawaii bg-iceBlue-200 hover:bg-iceBlue-300 text-plum font-bold text-xs py-2 rounded-xl border border-plum flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Constraint Changes with What-If Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
