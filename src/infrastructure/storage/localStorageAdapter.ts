import { EventPlan, EventPlanSchema } from '../../domain/types';
import { IEventStorage, EventSummaryRecord } from './storageInterface';

const STORAGE_PREFIX = 'gatherly_plan_';
const INDEX_KEY = 'gatherly_plans_index';
const CURRENT_SCHEMA_VERSION = 1;

export class LocalStorageAdapter implements IEventStorage {
  private getStorage(): Storage {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    // In-memory fallback for SSR or environments without localStorage
    return this.memoryStorage;
  }

  private memoryMap = new Map<string, string>();
  private memoryStorage: Storage = {
    length: 0,
    clear: () => this.memoryMap.clear(),
    getItem: (k: string) => this.memoryMap.get(k) || null,
    key: (index: number) => Array.from(this.memoryMap.keys())[index] || null,
    removeItem: (k: string) => this.memoryMap.delete(k),
    setItem: (k: string, v: string) => this.memoryMap.set(k, v),
  };

  async saveEvent(event: EventPlan): Promise<void> {
    const storage = this.getStorage();
    const updatedPlan: EventPlan = {
      ...event,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
    };

    // Validate before persisting
    const parseResult = EventPlanSchema.safeParse(updatedPlan);
    if (!parseResult.success) {
      throw new Error(`Data validation failed before save: ${parseResult.error.message}`);
    }

    const key = `${STORAGE_PREFIX}${event.id}`;
    storage.setItem(key, JSON.stringify(updatedPlan));

    // Update index
    this.updateIndex(updatedPlan);
  }

  async loadEvent(id: string): Promise<EventPlan | null> {
    const storage = this.getStorage();
    const raw = storage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const migrated = this.migrateRecord(parsed);
      const validation = EventPlanSchema.safeParse(migrated);
      if (!validation.success) {
        console.error(`Corrupt or invalid event record for ID ${id}:`, validation.error);
        return null;
      }
      return validation.data;
    } catch (err: unknown) {
      console.error(`Failed to parse stored event for ID ${id}:`, err);
      return null;
    }
  }

  async listEvents(): Promise<EventSummaryRecord[]> {
    const storage = this.getStorage();
    const indexRaw = storage.getItem(INDEX_KEY);
    if (!indexRaw) return [];

    try {
      const records = JSON.parse(indexRaw);
      if (Array.isArray(records)) {
        return records;
      }
      return [];
    } catch {
      return [];
    }
  }

  async deleteEvent(id: string): Promise<void> {
    const storage = this.getStorage();
    storage.removeItem(`${STORAGE_PREFIX}${id}`);

    const list = await this.listEvents();
    const filtered = list.filter((item) => item.id !== id);
    storage.setItem(INDEX_KEY, JSON.stringify(filtered));
  }

  async exportEventJson(id: string): Promise<string> {
    const event = await this.loadEvent(id);
    if (!event) {
      throw new Error(`Cannot export: Event with ID ${id} not found.`);
    }
    return JSON.stringify(event, null, 2);
  }

  async importEventJson(jsonString: string): Promise<EventPlan> {
    let raw: unknown;
    try {
      raw = JSON.parse(jsonString);
    } catch {
      throw new Error('Invalid JSON format for event import.');
    }

    const migrated = this.migrateRecord(raw);
    const result = EventPlanSchema.safeParse(migrated);
    if (!result.success) {
      throw new Error(
        `Schema validation failed on imported event: ${result.error.errors.map((e) => e.message).join(', ')}`
      );
    }

    await this.saveEvent(result.data);
    return result.data;
  }

  /**
   * Migrates a raw (potentially legacy) persisted record to the current schema version.
   * Converts v0 records (rupees-based fields) to v1 (paise-based fields).
   *
   * @param data - The raw parsed JSON value from storage.
   * @returns A record upgraded to the current schema (or the original value unchanged).
   */
  private migrateRecord(data: unknown): unknown {
    if (!data || typeof data !== 'object') return data;
    const record = data as Record<string, unknown>;
    const version = typeof record.schemaVersion === 'number' ? record.schemaVersion : 0;

    // Migration from v0 → v1: convert rupee-based fields to paise
    if (version < 1) {
      record.schemaVersion = 1;
      if (!record.currency) record.currency = 'INR';

      if (typeof record.budgetLimit === 'number' && !record.budgetLimitPaise) {
        record.budgetLimitPaise = Math.round((record.budgetLimit as number) * 100);
      }

      if (Array.isArray(record.expenses)) {
        record.expenses = (record.expenses as Record<string, unknown>[]).map((e) => ({
          ...e,
          estimatedCostPaise:
            e.estimatedCostPaise != null
              ? e.estimatedCostPaise
              : typeof e.estimatedCost === 'number'
                ? Math.round(e.estimatedCost * 100)
                : 0,
          actualCostPaise:
            e.actualCostPaise != null
              ? e.actualCostPaise
              : typeof e.actualCost === 'number'
                ? Math.round(e.actualCost * 100)
                : null,
        }));
      }
      if (!Array.isArray(record.vendors)) record.vendors = [];
      if (!Array.isArray(record.tasks)) record.tasks = [];
    }

    return record;
  }

  private updateIndex(event: EventPlan): void {
    const storage = this.getStorage();
    const raw = storage.getItem(INDEX_KEY);
    let list: EventSummaryRecord[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        list = [];
      }
    }

    const existingIndex = list.findIndex((item) => item.id === event.id);
    const summary: EventSummaryRecord = {
      id: event.id,
      title: event.title,
      eventType: event.eventType,
      eventDate: event.eventDate,
      updatedAt: event.updatedAt,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = summary;
    } else {
      list.unshift(summary);
    }

    storage.setItem(INDEX_KEY, JSON.stringify(list));
  }
}
