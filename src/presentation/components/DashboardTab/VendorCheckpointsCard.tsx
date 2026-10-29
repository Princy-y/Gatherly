import React from 'react';
import { VendorChecklistItem } from '../../../domain/types';
import { KawaiiFlower } from '../KawaiiDecorations';
import { ArrowRight, Sparkles } from 'lucide-react';

interface VendorCheckpointsCardProps {
  vendors: VendorChecklistItem[];
  bookedVendors: number;
  totalVendors: number;
  onNavigateVendors: () => void;
  onNavigateWhatIf: () => void;
}

export const VendorCheckpointsCard: React.FC<VendorCheckpointsCardProps> = ({
  vendors,
  bookedVendors,
  totalVendors,
  onNavigateVendors,
  onNavigateWhatIf,
}) => {
  return (
    <div className="scrapbook-card p-6 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KawaiiFlower size={20} />
            <h2 className="font-heading font-bold text-lg text-plum">Vendor Checkpoints</h2>
          </div>
          <button
            onClick={onNavigateVendors}
            className="text-xs font-bold text-plum hover:underline flex items-center gap-1"
          >
            <span>Checklist ({totalVendors})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold text-plum mb-1.5">
            <span>
              {bookedVendors} of {totalVendors} Vendors Booked
            </span>
            <span>{totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Vendor booking progress"
            aria-valuenow={totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            className="w-full h-3.5 bg-cream-200 border-2 border-plum rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-lavender-300 transition-all duration-500 rounded-full"
              style={{
                width: `${totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Vendor List Items */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-plum-light uppercase tracking-wider mb-1">
            Active Vendor Tracks:
          </div>
          {vendors.slice(0, 4).map((v) => (
            <div
              key={v.id}
              className="p-2.5 rounded-xl border border-plum/30 bg-cream-50 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-plum">{v.title}</span>
                <span className="text-[11px] text-plum-light ml-2">({v.category})</span>
              </div>
              <span
                className={`shrink-0 kawaii-badge text-[10px] uppercase ${
                  v.bookingStatus === 'booked'
                    ? 'bg-mint-200 text-plum'
                    : v.bookingStatus === 'shortlisted'
                      ? 'bg-butter-200 text-plum'
                      : 'bg-cream-200 text-plum-light'
                }`}
              >
                {v.bookingStatus.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-plum/20">
        <button
          onClick={onNavigateWhatIf}
          className="w-full btn-kawaii bg-iceBlue-200 hover:bg-iceBlue-300 text-plum font-bold text-xs py-2 rounded-xl border border-plum flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Constraint Changes with What-If Engine</span>
        </button>
      </div>
    </div>
  );
};
