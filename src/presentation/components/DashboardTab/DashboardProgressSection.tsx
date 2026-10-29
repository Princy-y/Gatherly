import React from 'react';
import { Task, VendorChecklistItem } from '../../../domain/types';
import { TimelineProgressCard } from './TimelineProgressCard';
import { VendorCheckpointsCard } from './VendorCheckpointsCard';

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
      <TimelineProgressCard
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        taskPercent={taskPercent}
        upcomingTasks={upcomingTasks}
        onNavigateTimeline={() => onNavigateTab('timeline')}
        onCelebrate={onCelebrate}
      />

      <VendorCheckpointsCard
        vendors={vendors}
        bookedVendors={bookedVendors}
        totalVendors={totalVendors}
        onNavigateVendors={() => onNavigateTab('vendors')}
        onNavigateWhatIf={() => onNavigateTab('whatif')}
      />
    </div>
  );
};
