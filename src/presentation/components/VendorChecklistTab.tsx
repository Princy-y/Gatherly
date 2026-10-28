import React, { useState } from 'react';
import {
  EventPlan,
  VendorChecklistItem,
  VendorBookingStatus,
  ExpenseCategory,
} from '../../domain/types';
import { formatINR, parseRupeesInput } from '../../domain/currency';
import { KawaiiBow, KawaiiSparkle, KawaiiFlower } from './KawaiiDecorations';
import { Plus, Trash2, Phone, Info, X } from 'lucide-react';

interface VendorChecklistTabProps {
  plan: EventPlan;
  onUpdateVendors: (updatedVendors: VendorChecklistItem[]) => void;
}

export const VendorChecklistTab: React.FC<VendorChecklistTabProps> = ({
  plan,
  onUpdateVendors,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExpenseCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('venue');
  const [newRequirements, setNewRequirements] = useState('');
  const [newStatus, setNewStatus] = useState<VendorBookingStatus>('not_started');
  const [newEstimatedRupees, setNewEstimatedRupees] = useState('');
  const [newContactInfo, setNewContactInfo] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredVendors =
    categoryFilter === 'all'
      ? plan.vendors
      : plan.vendors.filter((v) => v.category === categoryFilter);

  const handleStatusChange = (vendorId: string, status: VendorBookingStatus) => {
    const updated = plan.vendors.map((v) =>
      v.id === vendorId ? { ...v, bookingStatus: status } : v
    );
    onUpdateVendors(updated);
  };

  const handleDeleteVendor = (vendorId: string) => {
    onUpdateVendors(plan.vendors.filter((v) => v.id !== vendorId));
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const estPaise = newEstimatedRupees ? parseRupeesInput(newEstimatedRupees) : undefined;
    const item: VendorChecklistItem = {
      id: `vendor-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      requirements: newRequirements.trim(),
      bookingStatus: newStatus,
      estimatedCostPaise: estPaise,
      contactInfo: newContactInfo.trim() || undefined,
      notes: newNotes.trim() || undefined,
    };

    onUpdateVendors([...plan.vendors, item]);
    setNewTitle('');
    setNewRequirements('');
    setNewEstimatedRupees('');
    setNewContactInfo('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
          <div>
            <div className="flex items-center gap-2">
              <KawaiiBow size={20} />
              <h1 className="font-heading font-bold text-2xl text-plum">
                Vendor Booking Checklist
              </h1>
              <KawaiiSparkle size={16} />
            </div>
            <p className="text-xs text-plum-light font-medium mt-0.5">
              Track vendor qualifications, outreach, and contracts across all categories.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
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
            profiles or unverified ratings. All vendor contacts and status flags reflect
            user-verified planning records.
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
              onClick={() => setCategoryFilter(cat)}
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

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full scrapbook-card p-8 text-center text-plum-light bg-white">
            <KawaiiFlower size={32} className="mx-auto mb-2" />
            <p className="font-bold text-sm">No vendor tracks found for this category.</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="scrapbook-card p-5 bg-white flex flex-col justify-between"
            >
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
                    onChange={(e) =>
                      handleStatusChange(vendor.id, e.target.value as VendorBookingStatus)
                    }
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
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1 text-plum-light hover:text-red-700 hover:bg-blush-100 rounded"
                  title="Remove Vendor"
                  aria-label={`Remove vendor ${vendor.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg text-plum">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Vendor Track
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">
                  Vendor / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Banquet & Lawns"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
                  >
                    <option value="venue">Venue</option>
                    <option value="catering">Catering</option>
                    <option value="photography">Photography</option>
                    <option value="decoration">Decoration</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="invitations">Invitations</option>
                    <option value="permits">Permits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as VendorBookingStatus)}
                    className="w-full px-2.5 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="contacted">Contacted</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">
                  Requirements & Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Seating capacity, dietary choices, hours of operation"
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border-2 border-plum rounded-xl text-xs text-plum"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Estimated Cost (₹ INR)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50000"
                    value={newEstimatedRupees}
                    onChange={(e) => setNewEstimatedRupees(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Contact Details</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210"
                    value={newContactInfo}
                    onChange={(e) => setNewContactInfo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-kawaii bg-white px-3 py-2 rounded-xl border border-plum text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 px-4 py-2 rounded-xl border border-plum text-xs font-bold"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
