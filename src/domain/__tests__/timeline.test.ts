import { describe, it, expect } from 'vitest';
import {
  detectCycle,
  validateDependencies,
  getTopologicalOrder,
  calculateDaysBetween,
  shiftTaskDates,
  identifyConflictingTasks,
} from '../timeline';
import { Task } from '../types';

describe('Deterministic Timeline & Dependency Engine', () => {
  it('detects self-dependency as invalid', () => {
    const tasks: Task[] = [
      {
        id: 't1',
        title: 'Book Venue',
        description: 'Check venue rules',
        dueDate: '2026-11-01',
        status: 'todo',
        priority: 'high',
        dependencies: ['t1'], // Self-dependency
      },
    ];

    const validation = validateDependencies(tasks);
    expect(validation.valid).toBe(false);
    expect(validation.errors[0]).toContain('cannot depend on itself');
  });

  it('detects circular dependencies in task graphs (A -> B -> C -> A)', () => {
    const tasks: Task[] = [
      {
        id: 'task-a',
        title: 'Task A',
        description: '',
        dueDate: '2026-11-01',
        status: 'todo',
        priority: 'high',
        dependencies: ['task-c'],
      },
      {
        id: 'task-b',
        title: 'Task B',
        description: '',
        dueDate: '2026-11-05',
        status: 'todo',
        priority: 'medium',
        dependencies: ['task-a'],
      },
      {
        id: 'task-c',
        title: 'Task C',
        description: '',
        dueDate: '2026-11-10',
        status: 'todo',
        priority: 'low',
        dependencies: ['task-b'],
      },
    ];

    const cycle = detectCycle(tasks);
    expect(cycle.hasCycle).toBe(true);

    const validation = validateDependencies(tasks);
    expect(validation.valid).toBe(false);
    expect(validation.errors.some(e => e.includes('Circular dependency'))).toBe(true);
  });

  it('computes topological order when dependency graph is acyclic (DAG)', () => {
    const tasks: Task[] = [
      {
        id: 'send-invites',
        title: 'Send Invitations',
        description: '',
        dueDate: '2026-11-15',
        status: 'todo',
        priority: 'medium',
        dependencies: ['finalize-guestlist'],
      },
      {
        id: 'finalize-guestlist',
        title: 'Finalize Guest List',
        description: '',
        dueDate: '2026-11-05',
        status: 'todo',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 'collect-rsvps',
        title: 'Collect RSVPs',
        description: '',
        dueDate: '2026-11-25',
        status: 'todo',
        priority: 'medium',
        dependencies: ['send-invites'],
      },
    ];

    const ordered = getTopologicalOrder(tasks);
    const orderIds = ordered.map(t => t.id);

    expect(orderIds.indexOf('finalize-guestlist')).toBeLessThan(orderIds.indexOf('send-invites'));
    expect(orderIds.indexOf('send-invites')).toBeLessThan(orderIds.indexOf('collect-rsvps'));
  });

  it('calculates days between dates correctly', () => {
    expect(calculateDaysBetween('2026-11-01', '2026-11-10')).toBe(9);
    expect(calculateDaysBetween('2026-11-10', '2026-11-01')).toBe(-9);
    expect(calculateDaysBetween('2026-11-01', '2026-11-01')).toBe(0);
  });

  it('shifts uncompleted tasks when event date moves and preserves completed tasks', () => {
    const tasks: Task[] = [
      {
        id: 't-done',
        title: 'Deposit Paid',
        description: '',
        dueDate: '2026-11-01',
        status: 'completed',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 't-pending',
        title: 'Tasting Session',
        description: '',
        dueDate: '2026-11-10',
        status: 'todo',
        priority: 'medium',
        dependencies: [],
      },
    ];

    // Shift event date by +10 days (from 2026-12-01 to 2026-12-11)
    const shifted = shiftTaskDates(tasks, '2026-12-01', '2026-12-11');

    // Completed task retained original date
    const completed = shifted.find(t => t.id === 't-done');
    expect(completed?.dueDate).toBe('2026-11-01');

    // Pending task shifted by +10 days
    const pending = shifted.find(t => t.id === 't-pending');
    expect(pending?.dueDate).toBe('2026-11-20');
  });

  it('identifies tasks due after the event date as conflicting', () => {
    const tasks: Task[] = [
      {
        id: 'valid-task',
        title: 'Book Photographer',
        description: '',
        dueDate: '2026-11-10',
        status: 'todo',
        priority: 'high',
        dependencies: [],
      },
      {
        id: 'late-task',
        title: 'Final Rehearsal',
        description: '',
        dueDate: '2026-12-05',
        status: 'todo',
        priority: 'high',
        dependencies: [],
      },
    ];

    const conflicts = identifyConflictingTasks(tasks, '2026-12-01');
    expect(conflicts).toContain('late-task');
    expect(conflicts).not.toContain('valid-task');
  });
});
