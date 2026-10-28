import React from 'react';
import { TaskStatus } from '../../../domain/types';
import { KawaiiBow, KawaiiSparkle } from '../KawaiiDecorations';
import { Plus, AlertTriangle, Filter } from 'lucide-react';

interface TimelineHeaderProps {
  eventDate: string;
  statusFilter: 'all' | TaskStatus;
  onFilterChange: (status: 'all' | TaskStatus) => void;
  onOpenAddModal: () => void;
  dependencyValidation: { valid: boolean; errors: string[] };
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  eventDate,
  statusFilter,
  onFilterChange,
  onOpenAddModal,
  dependencyValidation,
}) => {
  return (
    <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
        <div>
          <div className="flex items-center gap-2">
            <KawaiiBow size={20} />
            <h1 className="font-heading font-bold text-2xl text-plum">
              Timeline & Milestone Planner
            </h1>
            <KawaiiSparkle size={16} />
          </div>
          <p className="text-xs text-plum-light font-medium mt-0.5">
            Deterministic task scheduling with dependency graph validation and automated cycle
            detection.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-4 py-2 rounded-xl border border-plum flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-plum" />
          <span>Add Preparation Task</span>
        </button>
      </div>

      {/* Circular Dependency Warning Banner */}
      {!dependencyValidation.valid && (
        <div
          role="alert"
          className="mt-4 p-3.5 rounded-xl bg-blush-100 border-2 border-red-500 text-xs text-plum font-semibold flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <div>
            <div className="font-bold text-red-700">Timeline Dependency Conflict:</div>
            <ul className="list-disc pl-4 mt-0.5">
              {dependencyValidation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Status Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-plum">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Status:</span>
          {(['all', 'todo', 'in_progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => onFilterChange(st)}
              className={`px-2.5 py-1 rounded-full border text-xs capitalize font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-plum text-white border-plum shadow-xs'
                  : 'bg-white text-plum border-plum/30 hover:bg-lavender-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs text-plum-light font-medium">
          Event Date: {new Date(eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
        </div>
      </div>
    </div>
  );
};
