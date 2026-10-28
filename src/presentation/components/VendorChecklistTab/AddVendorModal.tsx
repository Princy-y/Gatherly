import React from 'react';
import { ExpenseCategory, VendorBookingStatus } from '../../../domain/types';
import { Plus, X } from 'lucide-react';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onTitleChange: (val: string) => void;
  category: ExpenseCategory;
  onCategoryChange: (val: ExpenseCategory) => void;
  status: VendorBookingStatus;
  onStatusChange: (val: VendorBookingStatus) => void;
  requirements: string;
  onRequirementsChange: (val: string) => void;
  estimatedRupees: string;
  onEstimatedRupeesChange: (val: string) => void;
  contactInfo: string;
  onContactInfoChange: (val: string) => void;
}

export const AddVendorModal: React.FC<AddVendorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  onTitleChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  requirements,
  onRequirementsChange,
  estimatedRupees,
  onEstimatedRupeesChange,
  contactInfo,
  onContactInfoChange,
}) => {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="btn-kawaii bg-blush-200 p-1.5 rounded-lg border border-plum"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Vendor / Service Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Banquet & Lawns"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value as ExpenseCategory)}
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
                value={status}
                onChange={(e) => onStatusChange(e.target.value as VendorBookingStatus)}
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
            <label className="block text-xs font-bold uppercase mb-1">Requirements & Scope</label>
            <textarea
              rows={2}
              placeholder="Seating capacity, dietary choices, hours of operation"
              value={requirements}
              onChange={(e) => onRequirementsChange(e.target.value)}
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
                value={estimatedRupees}
                onChange={(e) => onEstimatedRupeesChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Contact Details</label>
              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={contactInfo}
                onChange={(e) => onContactInfoChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-plum rounded-xl text-xs text-plum"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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
  );
};
