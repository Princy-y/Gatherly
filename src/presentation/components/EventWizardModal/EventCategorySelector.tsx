import React from 'react';
import { EventType } from '../../../domain/types';

interface EventCategorySelectorProps {
  eventType: EventType;
  setEventType: (val: EventType) => void;
}

export const EventCategorySelector: React.FC<EventCategorySelectorProps> = ({
  eventType,
  setEventType,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-plum uppercase tracking-wider mb-1.5">
        Event Category
      </label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { type: 'wedding', label: '💒 Wedding', color: 'bg-blush-100' },
          { type: 'birthday', label: '🎂 Birthday', color: 'bg-butter-100' },
          { type: 'community', label: '🎈 Community', color: 'bg-mint-100' },
        ].map((item) => (
          <button
            type="button"
            key={item.type}
            onClick={() => setEventType(item.type as EventType)}
            className={`p-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm transition-all text-center ${
              eventType === item.type
                ? 'border-plum bg-lavender-200 shadow-kawaii-sm scale-[1.02]'
                : 'border-plum/30 bg-white hover:bg-cream-100 text-plum-light'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
