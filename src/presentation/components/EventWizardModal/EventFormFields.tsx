import React from 'react';
import { EventType } from '../../../domain/types';
import { PRIORITY_OPTIONS } from './useEventWizard';
import { EventCategorySelector } from './EventCategorySelector';
import { EventDetailsInputs } from './EventDetailsInputs';
import { KawaiiSparkle } from '../KawaiiDecorations';
import { Check, Sparkles } from 'lucide-react';

interface EventFormFieldsProps {
  eventType: EventType;
  setEventType: (val: EventType) => void;
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
  selectedPriorities: string[];
  togglePriority: (p: string) => void;
  preferences: string;
  setPreferences: (val: string) => void;
  accessibilityRequirements: string;
  setAccessibilityRequirements: (val: string) => void;
  isLoadingAi: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EventFormFields: React.FC<EventFormFieldsProps> = ({
  eventType,
  setEventType,
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
  selectedPriorities,
  togglePriority,
  preferences,
  setPreferences,
  accessibilityRequirements,
  setAccessibilityRequirements,
  isLoadingAi,
  onClose,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <EventCategorySelector eventType={eventType} setEventType={setEventType} />

      <EventDetailsInputs
        title={title}
        setTitle={setTitle}
        location={location}
        setLocation={setLocation}
        eventDate={eventDate}
        setEventDate={setEventDate}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        budgetRupees={budgetRupees}
        setBudgetRupees={setBudgetRupees}
      />

      {/* Priorities */}
      <div>
        <label className="block text-xs font-bold text-plum uppercase tracking-wider mb-1.5">
          Key Priorities (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRIORITY_OPTIONS.map((p) => {
            const isSelected = selectedPriorities.includes(p);
            return (
              <button
                type="button"
                key={p}
                onClick={() => togglePriority(p)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 font-semibold ${
                  isSelected
                    ? 'bg-plum text-white border-plum shadow-xs'
                    : 'bg-white text-plum border-plum/30 hover:bg-lavender-100'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-butter-200" />}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferences & Accessibility */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="event-pref"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Theme / Personal Preferences
          </label>
          <textarea
            id="event-pref"
            rows={2}
            placeholder="e.g. Lavender & blush aesthetic, acoustic music, traditional welcome"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
          />
        </div>
        <div>
          <label
            htmlFor="event-access"
            className="block text-xs font-bold text-plum uppercase tracking-wider mb-1"
          >
            Accessibility Requirements
          </label>
          <textarea
            id="event-access"
            rows={2}
            placeholder="e.g. Wheelchair ramp, elderly seating, dietary allergen signage"
            value={accessibilityRequirements}
            onChange={(e) => setAccessibilityRequirements(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
          />
        </div>
      </div>

      {/* Submission button */}
      <div className="pt-3 flex items-center justify-end gap-3 border-t border-plum/20">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoadingAi}
          className="btn-kawaii bg-white hover:bg-cream-200 text-plum font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-plum"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoadingAi}
          className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl border-2 border-plum flex items-center gap-2"
        >
          {isLoadingAi ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-plum" />
              <span>Synthesizing Plan...</span>
            </>
          ) : (
            <>
              <KawaiiSparkle size={18} />
              <span>Generate Event Plan ✨</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
