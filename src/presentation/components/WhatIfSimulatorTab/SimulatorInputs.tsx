import React from 'react';
import { EventPlan, DeterministicSimulationResult } from '../../../domain/types';
import { formatINR } from '../../../domain/currency';
import { Calendar, Users, Wallet } from 'lucide-react';

interface SimulatorInputsProps {
  plan: EventPlan;
  simBudgetRupees: string;
  setSimBudgetRupees: (val: string) => void;
  simGuestCount: number;
  setSimGuestCount: (val: number) => void;
  simEventDate: string;
  setSimEventDate: (val: string) => void;
  deterministicResult: DeterministicSimulationResult;
  applyBudgetPercent: (percentDelta: number) => void;
  applyGuestDelta: (delta: number) => void;
}

export const SimulatorInputs: React.FC<SimulatorInputsProps> = ({
  plan,
  simBudgetRupees,
  setSimBudgetRupees,
  simGuestCount,
  setSimGuestCount,
  simEventDate,
  setSimEventDate,
  deterministicResult,
  applyBudgetPercent,
  applyGuestDelta,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Budget Constraint Slider */}
      <div className="scrapbook-card p-5 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-plum">
            <Wallet className="w-4 h-4 text-plum" />
            <span>Budget Constraint</span>
          </div>
          <span className="text-[11px] text-plum-light">
            Current: {formatINR(plan.budgetLimitPaise)}
          </span>
        </div>

        <div className="relative mb-3">
          <span className="absolute left-3 top-2.5 text-xs font-bold text-plum">₹</span>
          <input
            type="text"
            value={simBudgetRupees}
            onChange={(e) => setSimBudgetRupees(e.target.value)}
            className="w-full pl-7 pr-3 py-2 bg-cream-50 border-2 border-plum rounded-xl font-heading font-bold text-base text-plum"
          />
        </div>

        {/* Quick preset chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
          <button
            onClick={() => applyBudgetPercent(-25)}
            className="px-2 py-1 rounded-lg bg-blush-100 border border-plum/30 hover:bg-blush-200 text-plum"
          >
            -25% Cut
          </button>
          <button
            onClick={() => applyBudgetPercent(-10)}
            className="px-2 py-1 rounded-lg bg-blush-50 border border-plum/30 hover:bg-blush-100 text-plum"
          >
            -10% Cut
          </button>
          <button
            onClick={() => applyBudgetPercent(+15)}
            className="px-2 py-1 rounded-lg bg-mint-50 border border-plum/30 hover:bg-mint-100 text-plum"
          >
            +15% Boost
          </button>
          <button
            onClick={() => applyBudgetPercent(+30)}
            className="px-2 py-1 rounded-lg bg-mint-100 border border-plum/30 hover:bg-mint-200 text-plum"
          >
            +30% Boost
          </button>
        </div>
      </div>

      {/* Guest Count Slider */}
      <div className="scrapbook-card p-5 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-plum">
            <Users className="w-4 h-4 text-plum" />
            <span>Guest Count</span>
          </div>
          <span className="text-[11px] text-plum-light">Current: {plan.guestCount} guests</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={simGuestCount}
            onChange={(e) => setSimGuestCount(parseInt(e.target.value, 10))}
            className="w-full accent-plum"
          />
          <span className="font-heading font-bold text-lg text-plum w-14 text-right">
            {simGuestCount}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
          <button
            onClick={() => applyGuestDelta(-25)}
            className="px-2 py-1 rounded-lg bg-cream-100 border border-plum/30 hover:bg-cream-200 text-plum"
          >
            -25 Guests
          </button>
          <button
            onClick={() => applyGuestDelta(+25)}
            className="px-2 py-1 rounded-lg bg-cream-100 border border-plum/30 hover:bg-cream-200 text-plum"
          >
            +25 Guests
          </button>
          <button
            onClick={() => applyGuestDelta(+50)}
            className="px-2 py-1 rounded-lg bg-lavender-100 border border-plum/30 hover:bg-lavender-200 text-plum"
          >
            +50 Guests
          </button>
        </div>
      </div>

      {/* Event Date Shift */}
      <div className="scrapbook-card p-5 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-plum">
            <Calendar className="w-4 h-4 text-plum" />
            <span>Event Date Shift</span>
          </div>
          <span className="text-[11px] text-plum-light">
            Current: {new Date(plan.eventDate).toLocaleDateString()}
          </span>
        </div>

        <input
          type="date"
          value={simEventDate}
          onChange={(e) => setSimEventDate(e.target.value)}
          className="w-full px-3 py-2 bg-cream-50 border-2 border-plum rounded-xl font-heading font-bold text-sm text-plum mb-3"
        />

        <div className="text-[11px] text-plum-light font-semibold">
          {deterministicResult.daysShifted === 0
            ? '✨ Same date (No timeline shift)'
            : deterministicResult.daysShifted < 0
              ? `⚡ Date accelerated by ${Math.abs(deterministicResult.daysShifted)} days!`
              : `⏳ Date postponed by ${deterministicResult.daysShifted} days.`}
        </div>
      </div>
    </div>
  );
};
