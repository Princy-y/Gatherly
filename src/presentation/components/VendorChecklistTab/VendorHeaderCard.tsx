import React from 'react';
import { ExpenseCategory } from '../../../domain/types';
import { KawaiiBow, KawaiiSparkle } from '../KawaiiDecorations';
import { Info, Plus } from 'lucide-react';

interface VendorHeaderCardProps {
  categoryFilter: 'all' | ExpenseCategory;
  onFilterChange: (cat: 'all' | ExpenseCategory) => void;
  onOpenAddModal: () => void;
}

export const VendorHeaderCard: React.FC<VendorHeaderCardProps> = ({
  categoryFilter,
  onFilterChange,
  onOpenAddModal,
}) => {
  return (
    <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
        <div>
          <div className="flex items-center gap-2">
            <KawaiiBow size={20} />
            <h1 className="font-heading font-bold text-2xl text-plum">Vendor Booking Checklist</h1>
            <KawaiiSparkle size={16} />
          </div>
          <p className="text-xs text-plum-light font-medium mt-0.5">
            Track vendor qualifications, outreach, and contracts across all categories.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-4 py-2 rounded-xl border border-plum flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-plum" />
          <span>Add Vendor Checkpoint</span>
        </button>
      </div>

      {/* Ethical Engineering Notice */}
      <div className="mt-4 p-3 rounded-xl bg-butter-50 border border-plum/30 text-xs text-plum flex items-center gap-2">
        <Info className="w-4 h-4 text-plum shrink-0" />
        <span>
          <strong>Note on Vendor Data:</strong> Gatherly AI does not invent fictional vendor
          profiles or unverified ratings. All vendor contacts and status flags reflect user-verified
          planning records.
        </span>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 text-xs font-bold text-plum">
        <span>Category:</span>
        {(
          [
            'all',
            'venue',
            'catering',
            'photography',
            'decoration',
            'entertainment',
            'permits',
          ] as const
        ).map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`px-2.5 py-1 rounded-full border text-xs capitalize font-semibold transition-all ${
              categoryFilter === cat
                ? 'bg-plum text-white border-plum shadow-xs'
                : 'bg-white text-plum border-plum/30 hover:bg-lavender-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
