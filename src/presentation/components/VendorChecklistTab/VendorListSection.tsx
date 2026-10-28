import React from 'react';
import { VendorChecklistItem, VendorBookingStatus } from '../../../domain/types';
import { formatINR } from '../../../domain/currency';
import { KawaiiFlower } from '../KawaiiDecorations';
import { Phone, Trash2 } from 'lucide-react';

interface VendorListSectionProps {
  vendors: VendorChecklistItem[];
  onStatusChange: (vendorId: string, status: VendorBookingStatus) => void;
  onDeleteVendor: (vendorId: string) => void;
}

export const VendorListSection: React.FC<VendorListSectionProps> = ({
  vendors,
  onStatusChange,
  onDeleteVendor,
}) => {
  if (vendors.length === 0) {
    return (
      <div className="col-span-full scrapbook-card p-8 text-center text-plum-light bg-white">
        <KawaiiFlower size={32} className="mx-auto mb-2" />
        <p className="font-bold text-sm">No vendor tracks found for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="scrapbook-card p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="kawaii-badge bg-lavender-100 text-plum text-[10px] uppercase font-bold mb-1">
                  {vendor.category}
                </span>
                <h3 className="font-heading font-bold text-base text-plum">{vendor.title}</h3>
              </div>

              <select
                value={vendor.bookingStatus}
                onChange={(e) => onStatusChange(vendor.id, e.target.value as VendorBookingStatus)}
                aria-label={`Booking status for ${vendor.title}`}
                className={`text-xs font-bold rounded-xl px-2.5 py-1 border border-plum transition-all ${
                  vendor.bookingStatus === 'booked'
                    ? 'bg-mint-200 text-plum'
                    : vendor.bookingStatus === 'shortlisted'
                      ? 'bg-butter-200 text-plum'
                      : vendor.bookingStatus === 'contacted'
                        ? 'bg-iceBlue-200 text-plum'
                        : vendor.bookingStatus === 'declined'
                          ? 'bg-blush-200 text-red-800'
                          : 'bg-cream-100 text-plum-light'
                }`}
              >
                <option value="not_started">⚪ Not Started</option>
                <option value="contacted">🔵 Contacted</option>
                <option value="shortlisted">🟡 Shortlisted</option>
                <option value="booked">🟢 Booked & Signed</option>
                <option value="declined">🔴 Declined</option>
              </select>
            </div>

            {vendor.requirements && (
              <div className="text-xs text-plum-light mt-2 p-2.5 rounded-lg bg-cream-50 border border-plum/15">
                <strong>Scope & Requirements:</strong> {vendor.requirements}
              </div>
            )}

            {vendor.contactInfo && (
              <div className="flex items-center gap-1.5 text-xs text-plum font-medium mt-2">
                <Phone className="w-3.5 h-3.5 text-plum-light" />
                <span>{vendor.contactInfo}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-plum/15 flex items-center justify-between text-xs font-bold">
            <span className="text-plum">
              {vendor.estimatedCostPaise
                ? `Est: ${formatINR(vendor.estimatedCostPaise)}`
                : 'Cost TBD'}
            </span>
            <button
              onClick={() => onDeleteVendor(vendor.id)}
              className="p-1 text-plum-light hover:text-red-700 hover:bg-blush-100 rounded"
              title="Remove Vendor"
              aria-label={`Remove vendor ${vendor.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
