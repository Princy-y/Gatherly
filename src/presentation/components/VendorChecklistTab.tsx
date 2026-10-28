import React from 'react';
import { EventPlan, VendorChecklistItem } from '../../domain/types';
import { useVendorChecklist } from './VendorChecklistTab/useVendorChecklist';
import { VendorHeaderCard } from './VendorChecklistTab/VendorHeaderCard';
import { VendorListSection } from './VendorChecklistTab/VendorListSection';
import { AddVendorModal } from './VendorChecklistTab/AddVendorModal';

interface VendorChecklistTabProps {
  plan: EventPlan;
  onUpdateVendors: (updatedVendors: VendorChecklistItem[]) => void;
}

export const VendorChecklistTab: React.FC<VendorChecklistTabProps> = ({
  plan,
  onUpdateVendors,
}) => {
  const {
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
    filteredVendors,
    handleStatusChange,
    handleDeleteVendor,
    handleAddVendor,
  } = useVendorChecklist(plan, onUpdateVendors);

  return (
    <div className="space-y-6">
      <VendorHeaderCard
        categoryFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <VendorListSection
        vendors={filteredVendors}
        onStatusChange={handleStatusChange}
        onDeleteVendor={handleDeleteVendor}
      />

      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddVendor}
        title={newTitle}
        onTitleChange={setNewTitle}
        category={newCategory}
        onCategoryChange={setNewCategory}
        status={newStatus}
        onStatusChange={setNewStatus}
        requirements={newRequirements}
        onRequirementsChange={setNewRequirements}
        estimatedRupees={newEstimatedRupees}
        onEstimatedRupeesChange={setNewEstimatedRupees}
        contactInfo={newContactInfo}
        onContactInfoChange={setNewContactInfo}
      />
    </div>
  );
};
