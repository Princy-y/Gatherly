import { useState } from 'react';
import confetti from 'canvas-confetti';
import { EventType, EventPlan } from '../../../domain/types';
import { rupeesToPaise } from '../../../domain/currency';
import { getAIProvider } from '../../../infrastructure/ai/aiFactory';
import { AIGeneratedPlanOutput } from '../../../infrastructure/ai/aiInterface';

export const PRIORITY_OPTIONS = [
  'Venue Atmosphere',
  'Catering Quality',
  'Photography & Film',
  'Floral Decor',
  'Live Entertainment',
  'Guest Comfort',
  'Sustainable / Eco-Friendly',
  'Cultural Rituals',
];

interface SampleTemplateData {
  title: string;
  location: string;
  guestCount: number;
  budgetRupees: string;
  priorities: string[];
  preferences: string;
  accessibilityRequirements: string;
}

const SAMPLE_TEMPLATES: Record<EventType, SampleTemplateData> = {
  wedding: {
    title: 'Rohan & Meera’s Whimsical Pastel Wedding',
    location: 'Jaipur & Udaipur',
    guestCount: 150,
    budgetRupees: '1500000',
    priorities: ['Venue Atmosphere', 'Catering Quality', 'Photography & Film', 'Floral Decor'],
    preferences:
      'Pastel mandap with lavender & blush florals, candid photography, fusion live counters.',
    accessibilityRequirements: 'Wheelchair ramp for lawn area and elderly seating.',
  },
  birthday: {
    title: 'Zoya’s Kawaii Sugar Wonderland 7th Birthday',
    location: 'Mumbai',
    guestCount: 40,
    budgetRupees: '75000',
    priorities: ['Floral Decor', 'Live Entertainment', 'Guest Comfort'],
    preferences: 'Kawaii pastel balloon arch, DIY cupcake decor station, polaroid memories.',
    accessibilityRequirements: 'Nut-free catering for children with allergies.',
  },
  community: {
    title: 'Oakridge Green Community Spring Mela',
    location: 'Bengaluru',
    guestCount: 250,
    budgetRupees: '150000',
    priorities: ['Sustainable / Eco-Friendly', 'Live Entertainment', 'Guest Comfort'],
    preferences:
      'Zero single-use plastics, local artisan food kiosks, acoustic neighborhood open-mic.',
    accessibilityRequirements:
      'Signage in English & Kannada, accessible parking near community hall.',
  },
};

interface BuildPlanArgs {
  title: string;
  eventType: EventType;
  location: string;
  eventDate: string;
  budgetLimitPaise: number;
  guestCount: number;
  selectedPriorities: string[];
  preferences: string;
  accessibilityRequirements: string;
  aiPlan: AIGeneratedPlanOutput;
}

function buildEventPlanFromAiOutput(args: BuildPlanArgs): EventPlan {
  const eventId = `event-${Date.now()}`;
  const now = new Date().toISOString();

  const expenses = args.aiPlan.recommendedExpenses.map((exp, idx) => ({
    id: `exp-${Date.now()}-${idx}`,
    category: exp.category,
    name: exp.name,
    estimatedCostPaise: exp.estimatedCostPaise,
    actualCostPaise: null,
    priority: exp.priority,
    notes: exp.notes,
  }));

  const targetDate = new Date(args.eventDate + 'T00:00:00Z');
  const tasks = args.aiPlan.recommendedTasks.map((t, idx) => {
    const taskDue = new Date(targetDate);
    taskDue.setDate(taskDue.getDate() - t.daysBeforeEvent);
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

  if (tasks.length > 2) {
    tasks[1].dependencies = [tasks[0].id];
  }

  const vendors = args.aiPlan.recommendedVendors.map((v, idx) => ({
    id: `vendor-${Date.now()}-${idx}`,
    category: v.category,
    title: v.title,
    requirements: v.requirements,
    bookingStatus: 'not_started' as const,
    estimatedCostPaise: v.estimatedCostPaise,
  }));

  return {
    id: eventId,
    schemaVersion: 1,
    title: args.title,
    eventType: args.eventType,
    location: args.location,
    eventDate: args.eventDate,
    currency: 'INR',
    budgetLimitPaise: args.budgetLimitPaise,
    guestCount: args.guestCount,
    priorities: args.selectedPriorities,
    preferences: args.preferences,
    accessibilityRequirements: args.accessibilityRequirements || undefined,
    expenses,
    tasks,
    vendors,
    createdAt: now,
    updatedAt: now,
  };
}

export function useEventWizard(onSavePlan: (plan: EventPlan) => void, onClose: () => void) {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState<number>(100);
  const [budgetRupees, setBudgetRupees] = useState<string>('500000');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Catering Quality',
    'Photography & Film',
  ]);
  const [preferences, setPreferences] = useState('');
  const [accessibilityRequirements, setAccessibilityRequirements] = useState('');

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const loadSampleTemplate = (type: EventType) => {
    setEventType(type);
    const tmpl = SAMPLE_TEMPLATES[type];
    setTitle(tmpl.title);
    setLocation(tmpl.location);
    setGuestCount(tmpl.guestCount);
    setBudgetRupees(tmpl.budgetRupees);
    setSelectedPriorities(tmpl.priorities);
    setPreferences(tmpl.preferences);
    setAccessibilityRequirements(tmpl.accessibilityRequirements);
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

      const newPlan = buildEventPlanFromAiOutput({
        title,
        eventType,
        location,
        eventDate,
        budgetLimitPaise,
        guestCount,
        selectedPriorities,
        preferences,
        accessibilityRequirements,
        aiPlan,
      });

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Plan generation failed:', err);
      setErrorMsg(`Generation failed: ${message}. Please try again.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return {
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
    preferences,
    setPreferences,
    accessibilityRequirements,
    setAccessibilityRequirements,
    isLoadingAi,
    errorMsg,
    togglePriority,
    loadSampleTemplate,
    handleSubmit,
  };
}
