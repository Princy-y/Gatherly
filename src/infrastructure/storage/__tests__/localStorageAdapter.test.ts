import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from '../localStorageAdapter';
import { EventPlan } from '../../../domain/types';

describe('LocalStorage Adapter with Migrations and Corruption Recovery', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter();
  });

  const validPlan: EventPlan = {
    id: 'plan-101',
    schemaVersion: 1,
    title: 'Ananya Birthday Party',
    eventType: 'birthday',
    location: 'Mumbai',
    eventDate: '2026-11-20',
    currency: 'INR',
    budgetLimitPaise: 5000000,
    guestCount: 30,
    priorities: ['Theme Cake', 'Magician'],
    preferences: 'Kawaii pastel pink decor',
    expenses: [
      {
        id: 'exp-1',
        category: 'catering',
        name: 'Custom 2-tier Cake',
        estimatedCostPaise: 600000,
        actualCostPaise: null,
        priority: 'essential',
      },
    ],
    tasks: [],
    vendors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('saves and reloads a valid event plan successfully', async () => {
    await adapter.saveEvent(validPlan);
    const loaded = await adapter.loadEvent('plan-101');

    expect(loaded).not.toBeNull();
    expect(loaded?.title).toBe('Ananya Birthday Party');
    expect(loaded?.budgetLimitPaise).toBe(5000000);
  });

  it('lists saved events correctly in the summary index', async () => {
    await adapter.saveEvent(validPlan);
    const list = await adapter.listEvents();

    expect(list.length).toBe(1);
    expect(list[0].id).toBe('plan-101');
    expect(list[0].title).toBe('Ananya Birthday Party');
  });

  it('migrates legacy unversioned / v0 records with rupee values to paise in v1', async () => {
    const legacyRecord = {
      id: 'legacy-event',
      title: 'Legacy Community Picnic',
      eventType: 'community',
      location: 'Delhi',
      eventDate: '2026-12-01',
      budgetLimit: 40000, // Legacy rupee field
      guestCount: 80,
      priorities: [],
      preferences: '',
      expenses: [
        {
          id: 'lexp-1',
          category: 'venue',
          name: 'Park Pavilion',
          estimatedCost: 15000, // Legacy rupee field
          priority: 'essential',
        },
      ],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    localStorage.setItem('gatherly_plan_legacy-event', JSON.stringify(legacyRecord));

    const loaded = await adapter.loadEvent('legacy-event');
    expect(loaded).not.toBeNull();
    expect(loaded?.schemaVersion).toBe(1);
    expect(loaded?.budgetLimitPaise).toBe(4000000); // 40,000 * 100
    expect(loaded?.expenses[0].estimatedCostPaise).toBe(1500000); // 15,000 * 100
  });

  it('gracefully recovers and returns null when stored data is corrupt or invalid JSON', async () => {
    localStorage.setItem('gatherly_plan_corrupted', '{ invalid-json-syntax }');
    const loaded = await adapter.loadEvent('corrupted');
    expect(loaded).toBeNull();
  });

  it('deletes an event and updates the index', async () => {
    await adapter.saveEvent(validPlan);
    expect((await adapter.listEvents()).length).toBe(1);

    await adapter.deleteEvent('plan-101');
    expect((await adapter.listEvents()).length).toBe(0);
    expect(await adapter.loadEvent('plan-101')).toBeNull();
  });
});
