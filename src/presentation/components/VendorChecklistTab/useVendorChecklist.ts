import { useState } from 'react';
import {
  EventPlan,
  VendorChecklistItem,
  VendorBookingStatus,
  ExpenseCategory,
} from '../../../domain/types';
import { parseRupeesInput } from '../../../domain/currency';

export function useVendorChecklist(
  plan: EventPlan,
  onUpdateVendors: (updatedVendors: VendorChecklistItem[]) => void
) {
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

  return {
    categoryFilter,
    setCategoryFilter,
    isAddModalOpen,
    setIsAddModalOpen,
    newTitle,
    setNewTitle,
    newCategory,
    setNewCategory,
    newRequirements,
    setNewRequirements,
    newStatus,
    setNewStatus,
    newEstimatedRupees,
    setNewEstimatedRupees,
    newContactInfo,
    setNewContactInfo,
    newNotes,
    setNewNotes,
    filteredVendors,
    handleStatusChange,
    handleDeleteVendor,
    handleAddVendor,
  };
}
