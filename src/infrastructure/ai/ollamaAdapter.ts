import {
  IAIProvider,
  AIProviderStatus,
  PlanGenerationParams,
  PlanRevisionParams,
  InspirationParams,
  AIGeneratedPlanOutput,
  AIGeneratedPlanOutputSchema,
  AIPlanRevisionProposal,
  AIPlanRevisionProposalSchema,
  InspirationStudioOutput,
  InspirationStudioOutputSchema,
} from './aiInterface';

export class OllamaAdapter implements IAIProvider {
  private baseUrl: string;
  private modelName: string;
  private timeoutMs: number;

  constructor(
    baseUrl = 'http://localhost:11434',
    modelName = 'qwen2.5:3b',
    timeoutMs = 45000
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.modelName = modelName;
    this.timeoutMs = timeoutMs;
  }

  async getStatus(): Promise<AIProviderStatus> {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return {
          name: 'Local Ollama',
          type: 'local',
          isAvailable: false,
          modelName: this.modelName,
          statusMessage: `Ollama returned HTTP status ${res.status}`,
        };
      }

      const data = await res.json();
      const models: { name: string }[] = data.models || [];
      const hasModel = models.some(m => m.name.includes(this.modelName) || this.modelName.includes(m.name));

      const latencyMs = Math.round(performance.now() - start);
      return {
        name: 'Local Ollama',
        type: 'local',
        isAvailable: hasModel,
        modelName: this.modelName,
        latencyMs,
        lastChecked: new Date().toISOString(),
        statusMessage: hasModel
          ? `Model ${this.modelName} loaded and ready.`
          : `Ollama active, but ${this.modelName} was not found in model tags.`,
      };
    } catch {
      return {
        name: 'Local Ollama',
        type: 'local',
        isAvailable: false,
        modelName: this.modelName,
        statusMessage: 'Local Ollama instance not reachable on localhost:11434.',
      };
    }
  }

  async generatePlan(
    params: PlanGenerationParams,
    externalSignal?: AbortSignal
  ): Promise<{ data: AIGeneratedPlanOutput; latencyMs: number }> {
    const prompt = `You are Gatherly AI, an expert event planner.
Generate a comprehensive, creative event plan in valid JSON format for the following event:
- Event: ${params.title}
- Type: ${params.eventType}
- Location: ${params.location}
- Date: ${params.eventDate}
- Total Budget: INR ${params.budgetLimitPaise / 100} (${params.budgetLimitPaise} paise)
- Guests: ${params.guestCount}
- Priorities: ${params.priorities.join(', ') || 'General celebration'}
- Preferences: ${params.preferences || 'Charming modern aesthetic'}

Respond with ONLY a raw JSON object matching this exact schema:
{
  "themeTitle": "Creative theme title",
  "conceptDescription": "Detailed overview of the event concept and atmosphere",
  "colorPalette": ["#Hex1", "#Hex2", "#Hex3", "#Hex4"],
  "recommendedExpenses": [
    {
      "category": "venue" | "catering" | "photography" | "decoration" | "entertainment" | "invitations" | "transportation" | "permits" | "attire" | "miscellaneous",
      "name": "Expense item name",
      "estimatedCostPaise": integer (in paise, 1 INR = 100 paise),
      "priority": "essential" | "preferred" | "optional",
      "notes": "Brief note"
    }
  ],
  "recommendedTasks": [
    {
      "title": "Task title",
      "description": "Short explanation",
      "daysBeforeEvent": integer (e.g. 30),
      "priority": "high" | "medium" | "low",
      "vendorCategory": "category" (optional)
    }
  ],
  "recommendedVendors": [
    {
      "category": "venue" | "catering" | "photography" | "decoration" | "entertainment" | "invitations" | "transportation" | "permits" | "attire" | "miscellaneous",
      "title": "Vendor service title",
      "requirements": "Key requirements",
      "estimatedCostPaise": integer
    }
  ]
}`;

    const { rawResponse, latencyMs } = await this.queryOllama(prompt, externalSignal);
    const parsedJson = this.extractAndParseJson(rawResponse);

    const validation = AIGeneratedPlanOutputSchema.safeParse(parsedJson);
    if (!validation.success) {
      throw new Error(`AI generated plan failed schema validation: ${validation.error.message}`);
    }

    return { data: validation.data, latencyMs };
  }

  async revisePlan(
    params: PlanRevisionParams,
    externalSignal?: AbortSignal
  ): Promise<{ data: AIPlanRevisionProposal; latencyMs: number }> {
    const prompt = `You are Gatherly AI. Revise an event plan based on user constraint changes.
Event: ${params.currentPlanSummary.title} (${params.currentPlanSummary.eventType})
Original Date: ${params.currentPlanSummary.eventDate}
Original Budget: INR ${params.currentPlanSummary.budgetLimitPaise / 100}
Original Guests: ${params.currentPlanSummary.guestCount}

User changes:
- New Budget: ${params.changes.newBudgetLimitPaise ? 'INR ' + params.changes.newBudgetLimitPaise / 100 : 'Unchanged'}
- New Guests: ${params.changes.newGuestCount ?? 'Unchanged'}
- New Date: ${params.changes.newEventDate ?? 'Unchanged'}

Warnings: ${params.deterministicWarnings.join('; ')}

Respond ONLY with a JSON object matching:
{
  "rationale": "High-level summary of adaptation strategy",
  "tradeOffs": ["Trade-off 1", "Trade-off 2"],
  "proposedExpenseAdjustments": [
    {
      "category": "venue" | "catering" | "photography" | "decoration" | "entertainment" | "invitations" | "transportation" | "permits" | "attire" | "miscellaneous",
      "name": "Adjusted expense name",
      "newEstimatedCostPaise": integer,
      "priority": "essential" | "preferred" | "optional",
      "reason": "Why this was adjusted"
    }
  ],
  "proposedTimelineAdjustments": [
    {
      "title": "Task title",
      "newDueDate": "YYYY-MM-DD",
      "reason": "Why date was shifted"
    }
  ]
}`;

    const { rawResponse, latencyMs } = await this.queryOllama(prompt, externalSignal);
    const parsedJson = this.extractAndParseJson(rawResponse);

    const validation = AIPlanRevisionProposalSchema.safeParse(parsedJson);
    if (!validation.success) {
      throw new Error(`AI revision output failed schema validation: ${validation.error.message}`);
    }

    return { data: validation.data, latencyMs };
  }

  async generateInspiration(
    params: InspirationParams,
    externalSignal?: AbortSignal
  ): Promise<{ data: InspirationStudioOutput; latencyMs: number }> {
    const prompt = `Generate theme, moodboard ideas, and activities for:
Event: ${params.title} (${params.eventType})
Preferences: ${params.preferences}
Guests: ${params.guestCount}
Budget: INR ${params.budgetLimitPaise / 100}

Respond ONLY with a JSON object matching:
{
  "themeName": "Theme name",
  "decorConcept": "Atmosphere description",
  "colorPalette": [
    { "name": "Color name", "hex": "#HEX" }
  ],
  "activities": ["Activity 1", "Activity 2", "Activity 3"],
  "menuIdeas": ["Menu idea 1", "Menu idea 2", "Menu idea 3"],
  "budgetSavingAlternatives": ["Saving tip 1", "Saving tip 2", "Saving tip 3"]
}`;

    const { rawResponse, latencyMs } = await this.queryOllama(prompt, externalSignal);
    const parsedJson = this.extractAndParseJson(rawResponse);

    const validation = InspirationStudioOutputSchema.safeParse(parsedJson);
    if (!validation.success) {
      throw new Error(`Inspiration output failed validation: ${validation.error.message}`);
    }

    return { data: validation.data, latencyMs };
  }

  private async queryOllama(
    prompt: string,
    externalSignal?: AbortSignal
  ): Promise<{ rawResponse: string; latencyMs: number }> {
    const start = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          prompt,
          format: 'json',
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama request failed with HTTP ${response.status}: ${response.statusText}`);
      }

      const body = await response.json();
      const latencyMs = Math.round(performance.now() - start);
      return { rawResponse: body.response || '', latencyMs };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Ollama inference timed out after ${this.timeoutMs}ms or was cancelled.`);
      }
      throw err;
    }
  }

  private extractAndParseJson(raw: string): unknown {
    try {
      return JSON.parse(raw);
    } catch {
      // If surrounded by markdown fences ```json ... ```
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        try {
          return JSON.parse(match[1]);
        } catch {
          // Continue below
        }
      }
      // Try finding first { to last }
      const firstBrace = raw.indexOf('{');
      const lastBrace = raw.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const sliced = raw.slice(firstBrace, lastBrace + 1);
        return JSON.parse(sliced);
      }
      throw new Error('No valid JSON could be parsed from AI response.');
    }
  }
}
