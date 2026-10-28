import { z } from 'zod';

export const EventTypeSchema = z.enum(['wedding', 'birthday', 'community']);
export type EventType = z.infer<typeof EventTypeSchema>;

export const ExpensePrioritySchema = z.enum(['essential', 'preferred', 'optional']);
export type ExpensePriority = z.infer<typeof ExpensePrioritySchema>;

export const ExpenseCategorySchema = z.enum([
  'venue',
  'catering',
  'photography',
  'decoration',
  'entertainment',
  'invitations',
  'transportation',
  'permits',
  'attire',
  'miscellaneous',
]);
export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;

export const ExpenseSchema = z.object({
  id: z.string().min(1),
  category: ExpenseCategorySchema,
  name: z.string().min(1, 'Expense name is required'),
  estimatedCostPaise: z.number().int().nonnegative('Estimated cost cannot be negative'),
  actualCostPaise: z
    .number()
    .int()
    .nonnegative('Actual cost cannot be negative')
    .nullable()
    .optional(),
  priority: ExpensePrioritySchema,
  notes: z.string().optional(),
});
export type Expense = z.infer<typeof ExpenseSchema>;

export const TaskPrioritySchema = z.enum(['high', 'medium', 'low']);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Task title is required'),
  description: z.string().default(''),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dependencies: z.array(z.string()).default([]),
  vendorCategory: ExpenseCategorySchema.optional(),
});
export type Task = z.infer<typeof TaskSchema>;

export const VendorBookingStatusSchema = z.enum([
  'not_started',
  'contacted',
  'shortlisted',
  'booked',
  'declined',
]);
export type VendorBookingStatus = z.infer<typeof VendorBookingStatusSchema>;

export const VendorChecklistItemSchema = z.object({
  id: z.string().min(1),
  category: ExpenseCategorySchema,
  title: z.string().min(1, 'Vendor title is required'),
  requirements: z.string().default(''),
  bookingStatus: VendorBookingStatusSchema,
  estimatedCostPaise: z.number().int().nonnegative().optional(),
  contactInfo: z.string().optional(),
  notes: z.string().optional(),
});
export type VendorChecklistItem = z.infer<typeof VendorChecklistItemSchema>;

export const EventPlanSchema = z.object({
  id: z.string().min(1),
  schemaVersion: z.number().int().positive().default(1),
  title: z.string().min(1, 'Event title is required'),
  eventType: EventTypeSchema,
  location: z.string().min(1, 'Location is required'),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Event date must be in YYYY-MM-DD format'),
  currency: z.literal('INR').default('INR'),
  budgetLimitPaise: z.number().int().nonnegative('Budget cannot be negative'),
  guestCount: z.number().int().min(1, 'Guest count must be at least 1'),
  priorities: z.array(z.string()).default([]),
  preferences: z.string().default(''),
  accessibilityRequirements: z.string().optional(),
  expenses: z.array(ExpenseSchema).default([]),
  tasks: z.array(TaskSchema).default([]),
  vendors: z.array(VendorChecklistItemSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type EventPlan = z.infer<typeof EventPlanSchema>;

export interface BudgetSummary {
  budgetLimitPaise: number;
  totalEstimatedPaise: number;
  totalActualPaise: number;
  effectiveCommittedPaise: number;
  remainingBudgetPaise: number;
  isOverrun: boolean;
  overrunPaise: number;
  variancePercentage: number;
}

export interface ConstraintChanges {
  newBudgetLimitPaise?: number;
  newGuestCount?: number;
  newEventDate?: string;
  removedExpenseIds?: string[];
  priorityAdjustments?: { expenseId: string; newPriority: ExpensePriority }[];
}

export interface DeterministicSimulationResult {
  originalBudgetLimitPaise: number;
  newBudgetLimitPaise: number;
  budgetDeltaPaise: number;
  originalGuestCount: number;
  newGuestCount: number;
  guestCountDelta: number;
  originalEventDate: string;
  newEventDate: string;
  daysShifted: number;
  budgetOverrunPaise: number;
  conflictingTaskIds: string[];
  affectedExpenseIds: string[];
  deterministicWarnings: string[];
}

export interface AIPlanRevisionProposal {
  rationale: string;
  tradeOffs: string[];
  proposedExpenseAdjustments: {
    expenseId?: string;
    category: ExpenseCategory;
    name: string;
    newEstimatedCostPaise: number;
    priority: ExpensePriority;
    reason: string;
  }[];
  proposedTimelineAdjustments: {
    taskId?: string;
    title: string;
    newDueDate: string;
    reason: string;
  }[];
}
