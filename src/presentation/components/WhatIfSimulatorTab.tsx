import React from 'react';
import { EventPlan } from '../../domain/types';
import { useWhatIfSimulator } from './WhatIfSimulatorTab/useWhatIfSimulator';
import { SimulatorTopBanner } from './WhatIfSimulatorTab/SimulatorTopBanner';
import { SimulatorInputs } from './WhatIfSimulatorTab/SimulatorInputs';
import { DeterministicConsequenceSection } from './WhatIfSimulatorTab/DeterministicConsequenceSection';
import { ProposalReviewSection } from './WhatIfSimulatorTab/ProposalReviewSection';

interface WhatIfSimulatorTabProps {
  plan: EventPlan;
  onApplyPlanRevision: (updatedPlan: EventPlan) => void;
}

export const WhatIfSimulatorTab: React.FC<WhatIfSimulatorTabProps> = ({
  plan,
  onApplyPlanRevision,
}) => {
  const {
    simBudgetRupees,
    setSimBudgetRupees,
    simGuestCount,
    setSimGuestCount,
    simEventDate,
    setSimEventDate,
    aiProposal,
    isConsultingAi,
    aiError,
    isSuccessApplied,
    simBudgetPaise,
    deterministicResult,
    hasChanges,
    applyBudgetPercent,
    applyGuestDelta,
    resetToCurrent,
    handleConsultAi,
    handleApplyChanges,
  } = useWhatIfSimulator(plan, onApplyPlanRevision);

  return (
    <div className="space-y-6">
      <SimulatorTopBanner
        onReset={resetToCurrent}
        isSuccessApplied={isSuccessApplied}
        aiError={aiError}
      />

      <SimulatorInputs
        plan={plan}
        simBudgetRupees={simBudgetRupees}
        setSimBudgetRupees={setSimBudgetRupees}
        simGuestCount={simGuestCount}
        setSimGuestCount={setSimGuestCount}
        simEventDate={simEventDate}
        setSimEventDate={setSimEventDate}
        deterministicResult={deterministicResult}
        applyBudgetPercent={applyBudgetPercent}
        applyGuestDelta={applyGuestDelta}
      />

      <DeterministicConsequenceSection
        deterministicResult={deterministicResult}
        hasChanges={hasChanges}
        isConsultingAi={isConsultingAi}
        onConsultAi={handleConsultAi}
      />

      {aiProposal && (
        <ProposalReviewSection
          plan={plan}
          simBudgetPaise={simBudgetPaise}
          simGuestCount={simGuestCount}
          simEventDate={simEventDate}
          aiProposal={aiProposal}
          onApplyChanges={handleApplyChanges}
        />
      )}
    </div>
  );
};
