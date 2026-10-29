import React from 'react';
import { Task } from '../../../domain/types';
import { KawaiiFlower } from '../KawaiiDecorations';
import { TimelineTaskCard } from './TimelineTaskCard';

interface TimelineTaskListProps {
  tasks: Task[];
  allTasks: Task[];
  todayStr: string;
  onToggleStatus: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TimelineTaskList: React.FC<TimelineTaskListProps> = ({
  tasks,
  allTasks,
  todayStr,
  onToggleStatus,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="scrapbook-card p-8 text-center text-plum-light bg-white">
        <KawaiiFlower size={32} className="mx-auto mb-2" />
        <p className="font-bold text-sm">No tasks found matching this filter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <TimelineTaskCard
          key={task.id}
          task={task}
          index={index}
          allTasks={allTasks}
          todayStr={todayStr}
          onToggleStatus={onToggleStatus}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};
