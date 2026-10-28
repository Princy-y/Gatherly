import React from 'react';
import { EventPlan } from '../../domain/types';
import { useDashboard } from './DashboardTab/useDashboard';
import { DashboardHeroCard } from './DashboardTab/DashboardHeroCard';
import { DashboardMetricCards } from './DashboardTab/DashboardMetricCards';
import { DashboardProgressSection } from './DashboardTab/DashboardProgressSection';

interface DashboardTabProps {
  plan: EventPlan;
  onNavigateTab: (tab: 'budget' | 'timeline' | 'vendors' | 'inspiration' | 'whatif') => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ plan, onNavigateTab }) => {
  const {
    budgetSummary,
    daysUntilEvent,
    completedTasks,
    totalTasks,
    taskPercent,
    bookedVendors,
    totalVendors,
    upcomingTasks,
    handleConfetti,
  } = useDashboard(plan);

  return (
    <div className="space-y-6">
      <DashboardHeroCard plan={plan} daysUntilEvent={daysUntilEvent} />

      <DashboardMetricCards
        budgetLimitPaise={plan.budgetLimitPaise}
        expenseCount={plan.expenses.length}
        budgetSummary={budgetSummary}
        onNavigateWhatIf={() => onNavigateTab('whatif')}
      />

      <DashboardProgressSection
        tasks={plan.tasks}
        vendors={plan.vendors}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        taskPercent={taskPercent}
        bookedVendors={bookedVendors}
        totalVendors={totalVendors}
        upcomingTasks={upcomingTasks}
        onNavigateTab={onNavigateTab}
        onCelebrate={handleConfetti}
      />
    </div>
  );
};
