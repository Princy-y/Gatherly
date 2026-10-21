import React, { useState } from 'react';
import {
  EventType,
  EventPlan,
} from '../../domain/types';
import { rupeesToPaise } from '../../domain/currency';
import { getAIProvider } from '../../infrastructure/ai/aiFactory';
import {
  KawaiiBow,
  KawaiiSparkle,
  KawaiiBunnyMascot,
} from './KawaiiDecorations';
import { Sparkles, Calendar, MapPin, Users, AlertCircle, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: EventPlan) => void;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  onSavePlan,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budgetRupees, setBudgetRupees] = useState<string>('500000'); // ₹5,00,000
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Catering Quality',
    'Photography & Film',
  ]);
  const [preferences, setPreferences] = useState('');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('');

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const priorityOptions = [
    'Venue Atmosphere',
    'Catering Quality',
    'Photography & Film',
    'Floral Decor',
    'Live Entertainment',
    'Guest Comfort',
    'Sustainable / Eco-Friendly',
    'Cultural Rituals',
  ];

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter(item => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const loadSampleTemplate = (type: EventType) => {
    setEventType(type);
    if (type === 'wedding') {
      setTitle('Rohan & Meera’s Whimsical Pastel Wedding');
      setLocation('Jaipur & Udaipur');
      setGuestCount(150);
      setBudgetRupees('1500000');
      setSelectedPriorities(['Venue Atmosphere', 'Catering Quality', 'Photography & Film', 'Floral Decor']);
      setPreferences('Pastel mandap with lavender & blush florals, candid photography, fusion live counters.');
      setAccessibilityRequirements('Wheelchair ramp for lawn area and elderly seating.');
    } else if (type === 'birthday') {
      setTitle('Zoya’s Kawaii Sugar Wonderland 7th Birthday');
      setLocation('Mumbai');
      setGuestCount(40);
      setBudgetRupees('75000');
      setSelectedPriorities(['Floral Decor', 'Live Entertainment', 'Guest Comfort']);
      setPreferences('Kawaii pastel balloon arch, DIY cupcake decor station, polaroid memories.');
      setAccessibilityRequirements('Nut-free catering for children with allergies.');
    } else {
      setTitle('Oakridge Green Community Spring Mela');
      setLocation('Bengaluru');
      setGuestCount(250);
      setBudgetRupees('150000');
      setSelectedPriorities(['Sustainable / Eco-Friendly', 'Live Entertainment', 'Guest Comfort']);
      setPreferences('Zero single-use plastics, local artisan food kiosks, acoustic neighborhood open-mic.');
      setAccessibilityRequirements('Signage in English & Kannada, accessible parking near community hall.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedRupees = parseFloat(budgetRupees.replace(/,/g, ''));
    if (!title.trim()) {
      setErrorMsg('Please enter an event title.');
      return;
    }
    if (isNaN(parsedRupees) || parsedRupees <= 0) {
      setErrorMsg('Please enter a valid budget amount.');
      return;
    }
    if (guestCount < 1) {
      setErrorMsg('Guest count must be at least 1.');
      return;
    }

    const budgetLimitPaise = rupeesToPaise(parsedRupees);
    setIsLoadingAi(true);

    try {
      const aiProvider = getAIProvider();
      const { data: aiPlan } = await aiProvider.generatePlan({
        title,
        eventType,
        location,
        eventDate,
        budgetLimitPaise,
        guestCount,
        priorities: selectedPriorities,
        preferences,
        accessibilityRequirements,
      });

      // Construct rich domain EventPlan
      const eventId = `event-${Date.now()}`;
      const now = new Date().toISOString();

      // Convert recommended expenses to domain Expense
      const expenses = aiPlan.recommendedExpenses.map((exp, idx) => ({
        id: `exp-${Date.now()}-${idx}`,
        category: exp.category,
        name: exp.name,
        estimatedCostPaise: exp.estimatedCostPaise,
        actualCostPaise: null,
        priority: exp.priority,
        notes: exp.notes,
      }));

      // Calculate task due dates based on daysBeforeEvent
      const targetDate = new Date(eventDate + 'T00:00:00Z');
      const tasks = aiPlan.recommendedTasks.map((t, idx) => {
        const taskDue = new Date(targetDate);
        taskDue.setDate(taskDue.getDate() - t.daysBeforeEvent);
        // Ensure due date isn't in past
        const today = new Date();
        const finalDue = taskDue < today ? today : taskDue;

        return {
          id: `task-${Date.now()}-${idx}`,
          title: t.title,
          description: t.description,
          dueDate: finalDue.toISOString().split('T')[0],
          status: 'todo' as const,
          priority: t.priority,
          dependencies: [] as string[],
          vendorCategory: t.vendorCategory,
        };
      });

      // Link sample dependencies logically (e.g. task 1 -> task 0)
      if (tasks.length > 2) {
        tasks[1].dependencies = [tasks[0].id];
      }

      // Convert recommended vendors
      const vendors = aiPlan.recommendedVendors.map((v, idx) => ({
        id: `vendor-${Date.now()}-${idx}`,
        category: v.category,
        title: v.title,
        requirements: v.requirements,
        bookingStatus: 'not_started' as const,
        estimatedCostPaise: v.estimatedCostPaise,
      }));

      const newPlan: EventPlan = {
        id: eventId,
        schemaVersion: 1,
        title,
        eventType,
        location,
        eventDate,
        currency: 'INR',
        budgetLimitPaise,
        guestCount,
        priorities: selectedPriorities,
        preferences,
        accessibilityRequirements: accessibilityRequirements || undefined,
        expenses,
        tasks,
        vendors,
        createdAt: now,
        updatedAt: now,
      };

      // Confetti celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DCCEFF', '#FFD9E8', '#FFF0B8', '#D5F3DF'],
        });
      } catch {
        // Safe if canvas unavailable
      }

      onSavePlan(newPlan);
      onClose();
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMsg(`Generation failed: ${err.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-2xl bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 sm:p-8 shadow-kawaii-lg text-plum my-8">
        {/* Header Ribbon */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-lavender-200 border-2 border-plum rounded-2xl flex items-center justify-center shadow-kawaii-sm">
              <KawaiiBunnyMascot size={34} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="wizard-title" className="font-heading font-bold text-2xl text-plum">
                  Design Your Dream Event
                </h2>
                <KawaiiSparkle />
              </div>
              <p className="text-xs sm:text-sm text-plum-light font-medium">
                Our constraint-aware AI will craft your budget, timeline & vendor roadmap.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-kawaii bg-blush-200 p-2 rounded-xl border border-plum text-plum hover:bg-blush-300"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Starters */}
        <div className="mb-6 p-3 bg-lavender-50 border-2 border-lavender-border rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-plum flex items-center gap-1.5">
              <KawaiiBow size={16} /> Quick Sample Templates:
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => loadSampleTemplate('wedding')}
              className="text-left text-xs p-2 rounded-lg border border-plum/30 bg-white hover:bg-blush-100 transition-colors"
            >
              <div className="font-bold text-plum">💒 Pastel Wedding</div>
              <div className="text-[11px] text-plum-light">₹15 Lakhs • 150 Guests</div>
            </button>
            <button
              type="button"
              onClick={() => loadSampleTemplate('birthday')}
              className="text-left text-xs p-2 rounded-lg border border-plum/30 bg-white hover:bg-butter-100 transition-colors"
            >
              <div className="font-bold text-plum">🎂 Kawaii Birthday</div>
              <div className="text-[11px] text-plum-light">₹75,000 • 40 Guests</div>
            </button>
            <button
              type="button"
              onClick={() => loadSampleTemplate('community')}
              className="text-left text-xs p-2 rounded-lg border border-plum/30 bg-white hover:bg-mint-100 transition-colors"
            >
              <div className="font-bold text-plum">🎈 Community Mela</div>
              <div className="text-[11px] text-plum-light">₹1.5 Lakhs • 250 Guests</div>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-blush-200 border-2 border-plum text-xs sm:text-sm font-semibold flex items-center gap-2 text-plum"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Type */}
          <div>
            <label className="block text-xs font-bold text-plum uppercase tracking-wider mb-1.5">
              Event Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'wedding', label: '💒 Wedding', color: 'bg-blush-100' },
                { type: 'birthday', label: '🎂 Birthday', color: 'bg-butter-100' },
                { type: 'community', label: '🎈 Community', color: 'bg-mint-100' },
              ].map(item => (
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

          {/* Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="event-title" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Event Name *
              </label>
              <input
                id="event-title"
                type="text"
                required
                placeholder="e.g. Diya & Kabir's Reception"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
              />
            </div>
            <div>
              <label htmlFor="event-location" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Location *
              </label>
              <div className="relative">
                <input
                  id="event-location"
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
                />
                <MapPin className="w-4 h-4 text-plum-light absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Date, Guests, Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="event-date" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Target Date *
              </label>
              <div className="relative">
                <input
                  id="event-date"
                  type="date"
                  required
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
                />
                <Calendar className="w-4 h-4 text-plum-light absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="guest-count" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Guest Count *
              </label>
              <div className="relative">
                <input
                  id="guest-count"
                  type="number"
                  min="1"
                  required
                  value={guestCount}
                  onChange={e => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-8 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
                />
                <Users className="w-4 h-4 text-plum-light absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="budget-rupees" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Total Budget (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-plum">₹</span>
                <input
                  id="budget-rupees"
                  type="text"
                  required
                  value={budgetRupees}
                  onChange={e => setBudgetRupees(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum font-bold"
                />
              </div>
            </div>
          </div>

          {/* Priorities */}
          <div>
            <label className="block text-xs font-bold text-plum uppercase tracking-wider mb-1.5">
              Key Priorities (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {priorityOptions.map(p => {
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
              <label htmlFor="event-pref" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Theme / Personal Preferences
              </label>
              <textarea
                id="event-pref"
                rows={2}
                placeholder="e.g. Lavender & blush aesthetic, acoustic music, traditional welcome"
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border-2 border-plum rounded-xl text-xs sm:text-sm text-plum focus:ring-0 focus:border-plum"
              />
            </div>
            <div>
              <label htmlFor="event-access" className="block text-xs font-bold text-plum uppercase tracking-wider mb-1">
                Accessibility Requirements
              </label>
              <textarea
                id="event-access"
                rows={2}
                placeholder="e.g. Wheelchair ramp, elderly seating, dietary allergen signage"
                value={accessibilityRequirements}
                onChange={e => setAccessibilityRequirements(e.target.value)}
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
      </div>
    </div>
  );
};
