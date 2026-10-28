import React from 'react';
import { EventPlan } from '../../../domain/types';
import { Calendar, MapPin, Users } from 'lucide-react';

interface DashboardHeroCardProps {
  plan: EventPlan;
  daysUntilEvent: number;
}

export const DashboardHeroCard: React.FC<DashboardHeroCardProps> = ({ plan, daysUntilEvent }) => {
  return (
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
  );
};
