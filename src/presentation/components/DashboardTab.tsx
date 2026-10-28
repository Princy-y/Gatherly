import React from 'react';
import { EventPlan } from '../../domain/types';
import { calculateBudgetSummary } from '../../domain/budget';
import { calculateDaysBetween } from '../../domain/timeline';
import { formatINR } from '../../domain/currency';
import {
  KawaiiBow,
  KawaiiFlower,
} from './KawaiiDecorations';
import {
  Calendar,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardTabProps {
  plan: EventPlan;
  onNavigateTab: (tab: 'budget' | 'timeline' | 'vendors' | 'inspiration' | 'whatif') => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ plan, onNavigateTab }) => {
  const budgetSummary = calculateBudgetSummary(plan.budgetLimitPaise, plan.expenses);

  const todayStr = new Date().toISOString().split('T')[0];
  const daysUntilEvent = calculateDaysBetween(todayStr, plan.eventDate);

  const completedTasks = plan.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = plan.tasks.length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const bookedVendors = plan.vendors.filter(v => v.bookingStatus === 'booked').length;
  const totalVendors = plan.vendors.length;

  const upcomingTasks = [...plan.tasks]
    .filter(t => t.status !== 'completed')
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

  return (
    <div className="space-y-6">
      {/* Hero Welcome Scrapbook Card */}
      <div className="relative bg-white border-3 border-plum rounded-kawaii-xl p-6 sm:p-8 shadow-kawaii-lg overflow-hidden">
        {/* Washi Tape Motifs */}
        <div className="absolute -top-3 left-10 washi-tape-pink w-28 h-6 flex items-center justify-center text-[10px] font-bold text-plum">
          GATHERLY AI ✨
        </div>
        <div className="absolute -top-3 right-14 washi-tape-mint w-24 h-6 flex items-center justify-center text-[10px] font-bold text-plum">
          CONFIRMED 🌸
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="kawaii-badge bg-lavender-200 text-plum uppercase font-bold text-xs">
                {plan.eventType} Edition
              </span>
              <span className="text-xs text-plum-light font-semibold">
                Updated {new Date(plan.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-plum flex items-center gap-2">
              {plan.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-plum font-semibold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-plum" />
                {plan.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-plum" />
                {new Date(plan.eventDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-plum" />
                {plan.guestCount} Guests
              </span>
            </div>
          </div>

          {/* Countdown Badge */}
          <div className="shrink-0 bg-butter-100 border-2 border-plum rounded-2xl p-4 text-center shadow-kawaii-sm min-w-[140px]">
            <div className="text-xs font-bold text-plum uppercase tracking-wider mb-0.5">
              Countdown
            </div>
            <div className="font-heading font-extrabold text-3xl text-plum">
              {daysUntilEvent > 0 ? daysUntilEvent : 0}
            </div>
            <div className="text-xs font-bold text-plum-light">
              {daysUntilEvent > 0 ? 'Days to Go! ⏳' : 'Today is the Day! 🎉'}
            </div>
          </div>
        </div>
      </div>

      {/* Overrun Warning Banner (if applicable) */}
      {budgetSummary.isOverrun && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-blush-100 border-2 border-plum shadow-kawaii-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-plum"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blush-200 border-2 border-plum flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Budget Overrun Detected ({formatINR(budgetSummary.overrunPaise)} over limit)
              </div>
              <p className="text-xs text-plum-light">
                Committed expenses exceed your allocated ₹{formatINR(plan.budgetLimitPaise)} budget. Use the What-If Simulator or Budget Studio to rebalance.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('whatif')}
            className="btn-kawaii bg-blush-200 hover:bg-blush-300 text-plum font-bold text-xs px-3.5 py-2 rounded-xl border border-plum shrink-0 flex items-center gap-1.5"
          >
            <span>Resolve with What-If</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Financial & Planning Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="scrapbook-card p-4 sm:p-5 bg-lavender-50">
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>Total Budget</span>
            <Wallet className="w-4 h-4 text-plum" />
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-plum">
            {formatINR(plan.budgetLimitPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1 flex items-center gap-1">
            <span>Locked allocation in INR</span>
          </div>
        </div>

        {/* Estimated Spend */}
        <div className="scrapbook-card p-4 sm:p-5 bg-iceBlue-50">
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>Estimated Spend</span>
            <TrendingUp className="w-4 h-4 text-plum" />
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-plum">
            {formatINR(budgetSummary.totalEstimatedPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1">
            {plan.expenses.length} categorized items
          </div>
        </div>

        {/* Actual Spend */}
        <div className="scrapbook-card p-4 sm:p-5 bg-mint-50">
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>Actual Spend</span>
            <CheckCircle2 className="w-4 h-4 text-plum" />
          </div>
          <div className="font-heading font-bold text-xl sm:text-2xl text-plum">
            {formatINR(budgetSummary.totalActualPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1">
            Confirmed invoiced costs
          </div>
        </div>

        {/* Remaining or Overrun */}
        <div
          className={`scrapbook-card p-4 sm:p-5 ${
            budgetSummary.isOverrun ? 'bg-blush-50' : 'bg-butter-50'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-plum-light uppercase mb-1">
            <span>{budgetSummary.isOverrun ? 'Deficit Overrun' : 'Remaining Budget'}</span>
            <Sparkles className="w-4 h-4 text-plum" />
          </div>
          <div
            className={`font-heading font-bold text-xl sm:text-2xl ${
              budgetSummary.isOverrun ? 'text-red-700' : 'text-plum'
            }`}
          >
            {budgetSummary.isOverrun
              ? `-${formatINR(budgetSummary.overrunPaise)}`
              : formatINR(budgetSummary.remainingBudgetPaise)}
          </div>
          <div className="text-[11px] text-plum-light mt-1 font-semibold">
            {budgetSummary.isOverrun ? 'Exceeds budget limit' : 'Safe buffer available'}
          </div>
        </div>
      </div>

      {/* Two Column Section: Tasks vs Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Planner Snapshot */}
        <div className="scrapbook-card p-6 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KawaiiBow size={20} />
                <h2 className="font-heading font-bold text-lg text-plum">
                  Timeline Progress
                </h2>
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
                <span>{completedTasks} of {totalTasks} Tasks Completed</span>
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
                upcomingTasks.map(task => (
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
              onClick={handleConfetti}
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
                <h2 className="font-heading font-bold text-lg text-plum">
                  Vendor Checkpoints
                </h2>
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
                <span>{bookedVendors} of {totalVendors} Vendors Booked</span>
                <span>{totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0}%</span>
              </div>
              <div
                role="progressbar"
                aria-label="Vendor booking progress"
                aria-valuenow={totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-3.5 bg-cream-200 border-2 border-plum rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-lavender-300 transition-all duration-500 rounded-full"
                  style={{ width: `${totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Vendor List Items */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-plum-light uppercase tracking-wider mb-1">
                Active Vendor Tracks:
              </div>
              {plan.vendors.slice(0, 4).map(v => (
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
    </div>
  );
};
