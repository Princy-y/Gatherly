import { z } from 'zod';
import {
  EventType,
  ExpenseCategorySchema,
  ExpensePrioritySchema,
  TaskPrioritySchema,
} from '../../domain/types';

export interface AIProviderStatus {
  name: string;
  type: 'local' | 'demo' | 'remote';
  isAvailable: boolean;
  modelName: string;
  latencyMs?: number;
  lastChecked?: string;
  statusMessage?: string;
}

export const AIGeneratedExpenseSchema = z.object({
  category: ExpenseCategorySchema,
  name: z.string().min(1),
  estimatedCostPaise: z.number().int().positive(),
  priority: ExpensePrioritySchema,
  notes: z.string().optional(),
});
export type AIGeneratedExpense = z.infer<typeof AIGeneratedExpenseSchema>;

export const AIGeneratedTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  daysBeforeEvent: z.number().int().nonnegative(),
  priority: TaskPrioritySchema,
  vendorCategory: ExpenseCategorySchema.optional(),
});
export type AIGeneratedTask = z.infer<typeof AIGeneratedTaskSchema>;

export const AIGeneratedVendorSchema = z.object({
  category: ExpenseCategorySchema,
  title: z.string().min(1),
  requirements: z.string(),
  estimatedCostPaise: z.number().int().nonnegative().optional(),
});
export type AIGeneratedVendor = z.infer<typeof AIGeneratedVendorSchema>;

export const AIGeneratedPlanOutputSchema = z.object({
  themeTitle: z.string().min(1),
  conceptDescription: z.string().min(1),
  colorPalette: z.array(z.string()).min(2),
  recommendedExpenses: z.array(AIGeneratedExpenseSchema).min(3),
  recommendedTasks: z.array(AIGeneratedTaskSchema).min(3),
  recommendedVendors: z.array(AIGeneratedVendorSchema).min(2),
});
export type AIGeneratedPlanOutput = z.infer<typeof AIGeneratedPlanOutputSchema>;

export const AIPlanRevisionProposalSchema = z.object({
  rationale: z.string().min(1),
  tradeOffs: z.array(z.string()).min(1),
  proposedExpenseAdjustments: z.array(
    z.object({
      expenseId: z.string().optional(),
      category: ExpenseCategorySchema,
      name: z.string(),
      newEstimatedCostPaise: z.number().int().nonnegative(),
      priority: ExpensePrioritySchema,
      reason: z.string(),
    })
  ),
  proposedTimelineAdjustments: z.array(
    z.object({
      taskId: z.string().optional(),
      title: z.string(),
      newDueDate: z.string(),
      reason: z.string(),
    })
  ),
});
export type AIPlanRevisionProposal = z.infer<typeof AIPlanRevisionProposalSchema>;

export const InspirationStudioOutputSchema = z.object({
  themeName: z.string(),
  decorConcept: z.string(),
  colorPalette: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
    })
  ),
  activities: z.array(z.string()),
  menuIdeas: z.array(z.string()),
  budgetSavingAlternatives: z.array(z.string()),
});
export type InspirationStudioOutput = z.infer<typeof InspirationStudioOutputSchema>;

export interface PlanGenerationParams {
  title: string;
  eventType: EventType;
  location: string;
  eventDate: string;
  budgetLimitPaise: number;
  guestCount: number;
  priorities: string[];
  preferences: string;
  accessibilityRequirements?: string;
}

export interface PlanRevisionParams {
  currentPlanSummary: {
    title: string;
    eventType: EventType;
    eventDate: string;
    budgetLimitPaise: number;
    guestCount: number;
  };
  changes: {
    newBudgetLimitPaise?: number;
    newGuestCount?: number;
    newEventDate?: string;
    removedExpenseIds?: string[];
  };
  deterministicWarnings: string[];
}

export interface InspirationParams {
  eventType: EventType;
  title: string;
  preferences: string;
  guestCount: number;
  budgetLimitPaise: number;
}

export interface IAIProvider {
  getStatus(): Promise<AIProviderStatus>;
  generatePlan(
    params: PlanGenerationParams,
    signal?: AbortSignal
  ): Promise<{ data: AIGeneratedPlanOutput; latencyMs: number }>;
  revisePlan(
    params: PlanRevisionParams,
    signal?: AbortSignal
  ): Promise<{ data: AIPlanRevisionProposal; latencyMs: number }>;
  generateInspiration(
    params: InspirationParams,
    signal?: AbortSignal
  ): Promise<{ data: InspirationStudioOutput; latencyMs: number }>;
}
