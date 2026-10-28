import React from 'react';
import { EventPlan } from '../../domain/types';
import { useEventWizard } from './EventWizardModal/useEventWizard';
import { WizardHeader } from './EventWizardModal/WizardHeader';
import { TemplateStarters } from './EventWizardModal/TemplateStarters';
import { EventFormFields } from './EventWizardModal/EventFormFields';
import { AlertCircle } from 'lucide-react';

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: EventPlan) => void;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  onSavePlan,
}) => {
  const {
    eventType,
    setEventType,
    title,
    setTitle,
    location,
    setLocation,
    eventDate,
    setEventDate,
    guestCount,
    setGuestCount,
    budgetRupees,
    setBudgetRupees,
    selectedPriorities,
    preferences,
    setPreferences,
    accessibilityRequirements,
    setAccessibilityRequirements,
    isLoadingAi,
    errorMsg,
    togglePriority,
    loadSampleTemplate,
    handleSubmit,
  } = useEventWizard(onSavePlan, onClose);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-plum/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-2xl bg-cream-50 border-3 border-plum rounded-kawaii-xl p-6 sm:p-8 shadow-kawaii-lg text-plum my-8">
        <WizardHeader onClose={onClose} />

        <TemplateStarters onSelectTemplate={loadSampleTemplate} />

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-xl bg-blush-200 border-2 border-plum text-xs sm:text-sm font-semibold flex items-center gap-2 text-plum"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <EventFormFields
          eventType={eventType}
          setEventType={setEventType}
          title={title}
          setTitle={setTitle}
          location={location}
          setLocation={setLocation}
          eventDate={eventDate}
          setEventDate={setEventDate}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          budgetRupees={budgetRupees}
          setBudgetRupees={setBudgetRupees}
          selectedPriorities={selectedPriorities}
          togglePriority={togglePriority}
          preferences={preferences}
          setPreferences={setPreferences}
          accessibilityRequirements={accessibilityRequirements}
          setAccessibilityRequirements={setAccessibilityRequirements}
          isLoadingAi={isLoadingAi}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
