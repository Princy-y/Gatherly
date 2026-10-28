import { Task } from './types';

export interface CycleDetectionResult {
  hasCycle: boolean;
  cyclePath?: string[];
}

/**
 * Detects cycles in task dependency graphs using Depth-First Search with recursion stack coloring.
 * Returns true and the offending cycle path if a circular dependency is detected.
 */
export function detectCycle(tasks: Task[]): CycleDetectionResult {
  const taskMap = new Map<string, Task>(tasks.map((t) => [t.id, t]));
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const parentTrack = new Map<string, string>();

  function dfs(currentId: string): string[] | null {
    visited.add(currentId);
    recursionStack.add(currentId);

    const task = taskMap.get(currentId);
    if (task && task.dependencies) {
      for (const depId of task.dependencies) {
        // Self dependency check
        if (depId === currentId) {
          return [currentId, currentId];
        }

        if (!taskMap.has(depId)) {
          // Unknown dependency is an integrity error, but not necessarily a cycle
          continue;
        }

        if (!visited.has(depId)) {
          parentTrack.set(depId, currentId);
          const cycle = dfs(depId);
          if (cycle) return cycle;
        } else if (recursionStack.has(depId)) {
          // Found cycle
          const path = [depId, currentId];
          let curr = currentId;
          while (parentTrack.has(curr) && parentTrack.get(curr) !== depId) {
            curr = parentTrack.get(curr)!;
            path.push(curr);
          }
          path.push(depId);
          return path.reverse();
        }
      }
    }

    recursionStack.delete(currentId);
    return null;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      const cycle = dfs(task.id);
      if (cycle) {
        return { hasCycle: true, cyclePath: cycle };
      }
    }
  }

  return { hasCycle: false };
}

/**
 * Validates task dependencies: checks for non-existent dependencies, self-dependencies, and cycles.
 */
export function validateDependencies(tasks: Task[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const taskIds = new Set(tasks.map((t) => t.id));

  for (const task of tasks) {
    for (const depId of task.dependencies) {
      if (depId === task.id) {
        errors.push(`Task "${task.title}" (${task.id}) cannot depend on itself.`);
      } else if (!taskIds.has(depId)) {
        errors.push(`Task "${task.title}" depends on non-existent task ID "${depId}".`);
      }
    }
  }

  const cycleResult = detectCycle(tasks);
  if (cycleResult.hasCycle) {
    const pathStr = cycleResult.cyclePath?.join(' -> ') || 'Circular loop';
    errors.push(`Circular dependency detected: ${pathStr}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Computes topological ordering of tasks respecting dependencies.
 * If cycles are present, falls back to due date ordering and reports safe default.
 */
export function getTopologicalOrder(tasks: Task[]): Task[] {
  const cycle = detectCycle(tasks);
  if (cycle.hasCycle) {
    // If cycle detected, sort by due date safely
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  const taskMap = new Map<string, Task>(tasks.map((t) => [t.id, t]));
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const task of tasks) {
    inDegree.set(task.id, 0);
    adj.set(task.id, []);
  }

  for (const task of tasks) {
    for (const depId of task.dependencies) {
      if (adj.has(depId)) {
        adj.get(depId)!.push(task.id);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const ordered: Task[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const task = taskMap.get(currentId);
    if (task) ordered.push(task);

    const neighbors = adj.get(currentId) || [];
    for (const neighborId of neighbors) {
      const updatedDeg = (inDegree.get(neighborId) || 0) - 1;
      inDegree.set(neighborId, updatedDeg);
      if (updatedDeg === 0) {
        queue.push(neighborId);
      }
    }
  }

  // If any unvisited remaining (e.g. detached), append them
  if (ordered.length < tasks.length) {
    const orderedIds = new Set(ordered.map((t) => t.id));
    for (const t of tasks) {
      if (!orderedIds.has(t.id)) {
        ordered.push(t);
      }
    }
  }

  return ordered;
}

/**
 * Calculates days between two ISO date strings (YYYY-MM-DD).
 */
export function calculateDaysBetween(fromDateStr: string, toDateStr: string): number {
  const from = new Date(fromDateStr + 'T00:00:00Z').getTime();
  const to = new Date(toDateStr + 'T00:00:00Z').getTime();
  const diffMs = to - from;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Shifts all uncompleted task due dates by the date difference when an event date moves.
 * Completed tasks keep their historical completion dates.
 */
export function shiftTaskDates(
  tasks: Task[],
  oldEventDateStr: string,
  newEventDateStr: string
): Task[] {
  const deltaDays = calculateDaysBetween(oldEventDateStr, newEventDateStr);
  if (deltaDays === 0) return tasks;

  return tasks.map((task) => {
    // Preserve completed tasks
    if (task.status === 'completed') {
      return task;
    }

    const currentDueDate = new Date(task.dueDate + 'T00:00:00Z');
    currentDueDate.setDate(currentDueDate.getDate() + deltaDays);
    const newDueDateStr = currentDueDate.toISOString().split('T')[0];

    // Ensure due date does not exceed new event date
    const finalDueDate = newDueDateStr > newEventDateStr ? newEventDateStr : newDueDateStr;

    return {
      ...task,
      dueDate: finalDueDate,
    };
  });
}

/**
 * Identifies tasks whose due dates conflict with the event date or with dependency due dates.
 */
export function identifyConflictingTasks(tasks: Task[], eventDateStr: string): string[] {
  const conflictingIds: string[] = [];
  const taskMap = new Map<string, Task>(tasks.map((t) => [t.id, t]));

  for (const task of tasks) {
    // Due date after event date is impossible
    if (task.dueDate > eventDateStr) {
      conflictingIds.push(task.id);
      continue;
    }

    // Task due before its prerequisite task
    for (const depId of task.dependencies) {
      const depTask = taskMap.get(depId);
      if (depTask && task.dueDate < depTask.dueDate) {
        if (!conflictingIds.includes(task.id)) {
          conflictingIds.push(task.id);
        }
      }
    }
  }

  return conflictingIds;
}
