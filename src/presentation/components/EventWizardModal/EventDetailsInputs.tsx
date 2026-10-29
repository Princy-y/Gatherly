import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventDetailsInputsProps {
  title: string;
  setTitle: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  eventDate: string;
  setEventDate: (val: string) => void;
  guestCount: number;
  setGuestCount: (val: number) => void;
  budgetRupees: string;
  setBudgetRupees: (val: string) => void;
}

export const EventDetailsInputs: React.FC<EventDetailsInputsProps> = ({
  title,
  setTitle,
  location,
  setLocation,
  eventDate,
  setEventDate,
  guestCount,
  setGuestCount,
  budgetRupees,
  setBudgetRupees,
}) => {
  return (
    <>
      {/* Title & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="event-title"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Event Name *
          </label>
          <input
            id="event-title"
            type="text"
            required
            placeholder="e.g. Diya & Kabir's Reception"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
          />
        </div>
        <div>
          <label
            htmlFor="event-location"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Location *
          </label>
          <div className="relative">
            <input
              id="event-location"
              type="text"
              required
              placeholder="e.g. Bengaluru, Karnataka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
            />
            <MapPin className="w-4 h-4 text-plum-light absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Date, Guests, Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="event-date"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Target Date *
          </label>
          <div className="relative">
            <input
              id="event-date"
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
            />
            <Calendar className="w-4 h-4 text-plum-light absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="guest-count"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Guest Count *
          </label>
          <div className="relative">
            <input
              id="guest-count"
              type="number"
              min="1"
              required
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full pl-8 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
            />
            <Users className="w-4 h-4 text-plum-light absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label
            htmlFor="budget-rupees"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Total Budget (₹ INR) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs font-bold text-plum">₹</span>
            <input
              id="budget-rupees"
              type="text"
              required
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum font-bold"
            />
          </div>
        </div>
      </div>
    </>
  );
};
