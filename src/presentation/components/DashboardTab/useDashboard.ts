import confetti from 'canvas-confetti';
import { EventPlan } from '../../../domain/types';
import { calculateBudgetSummary } from '../../../domain/budget';
import { calculateDaysBetween } from '../../../domain/timeline';

export function useDashboard(plan: EventPlan) {
  const budgetSummary = calculateBudgetSummary(plan.budgetLimitPaise, plan.expenses);

  const todayStr = new Date().toISOString().split('T')[0];
  const daysUntilEvent = calculateDaysBetween(todayStr, plan.eventDate);

  const completedTasks = plan.tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = plan.tasks.length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const bookedVendors = plan.vendors.filter((v) => v.bookingStatus === 'booked').length;
  const totalVendors = plan.vendors.length;

  const upcomingTasks = [...plan.tasks]
    .filter((t) => t.status !== 'completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const handleConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#DCCEFF', '#FFD9E8', '#FFF0B8', '#D5F3DF'],
      });
    } catch {
      // Ignored if unavailable
    }
  };

  return {
    budgetSummary,
    daysUntilEvent,
    completedTasks,
    totalTasks,
    taskPercent,
    bookedVendors,
    totalVendors,
    upcomingTasks,
    handleConfetti,
  };
}
