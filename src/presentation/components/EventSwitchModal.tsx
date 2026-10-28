import React, { useState, useEffect, useCallback } from 'react';
import { LocalStorageAdapter } from '../../infrastructure/storage/localStorageAdapter';
import { EventSummaryRecord } from '../../infrastructure/storage/storageInterface';
import {
  KawaiiBunnyMascot,
} from './KawaiiDecorations';
import { Plus, Trash2, X, Upload } from 'lucide-react';

const storage = new LocalStorageAdapter();

interface EventSwitchModalProps {
  isOpen: boolean;
  currentEventId: string;
  onClose: () => void;
  onSelectEvent: (id: string) => void;
  onCreateNew: () => void;
  onImportJson: () => void;
}

export const EventSwitchModal: React.FC<EventSwitchModalProps> = ({
  isOpen,
  currentEventId,
  onClose,
  onSelectEvent,
  onCreateNew,
  onImportJson,
}) => {
  const [events, setEvents] = useState<EventSummaryRecord[]>([]);

  const loadList = useCallback(async () => {
    const list = await storage.listEvents();
    setEvents(list);
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadList();
    }
  }, [isOpen, loadList]);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this event plan?')) {
      await storage.deleteEvent(id);
      loadList();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg text-plum">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-plum/20">
          <div className="flex items-center gap-2">
            <KawaiiBunnyMascot size={32} />
            <h2 className="font-heading font-bold text-xl text-plum">
              Your Saved Events
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto mb-4 pr-1">
          {events.length === 0 ? (
            <div className="p-6 text-center text-xs text-plum-light italic bg-white rounded-xl border border-plum/20">
              No saved events found. Click "Create New Event" below!
            </div>
          ) : (
            events.map(ev => {
              const isCurrent = ev.id === currentEventId;
              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    onSelectEvent(ev.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-lavender-100 border-plum shadow-kawaii-sm'
                      : 'bg-white border-plum/30 hover:bg-cream-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-plum">{ev.title}</span>
                      {isCurrent && (
                        <span className="kawaii-badge bg-mint-200 text-plum text-[10px]">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-plum-light mt-0.5">
                      <span className="capitalize">🌸 {ev.eventType}</span>
                      <span>•</span>
                      <span>📅 {new Date(ev.eventDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => handleDelete(e, ev.id)}
                      className="p-1.5 text-plum-light hover:text-red-700 hover:bg-blush-100 rounded"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-plum/20 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              onImportJson();
              onClose();
            }}
            className="btn-kawaii bg-butter-200 hover:bg-butter-300 text-plum font-bold text-xs px-3 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-4 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};
