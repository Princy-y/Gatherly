import { EventPlan } from '../../domain/types';

export interface EventSummaryRecord {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  updatedAt: string;
}

export interface IEventStorage {
  saveEvent(event: EventPlan): Promise<void>;
  loadEvent(id: string): Promise<EventPlan | null>;
  listEvents(): Promise<EventSummaryRecord[]>;
  deleteEvent(id: string): Promise<void>;
  exportEventJson(id: string): Promise<string>;
  importEventJson(jsonString: string): Promise<EventPlan>;
}
