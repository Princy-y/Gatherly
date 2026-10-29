import React from 'react';
import { EventPlan } from '../../domain/types';
import { KawaiiBow, KawaiiSparkle, KawaiiBunnyMascot } from './KawaiiDecorations';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useInspirationStudio } from './InspirationStudioTab/useInspirationStudio';
import { InspirationMoodboard } from './InspirationStudioTab/InspirationMoodboard';

interface InspirationStudioTabProps {
  plan: EventPlan;
}

export const InspirationStudioTab: React.FC<InspirationStudioTabProps> = ({ plan }) => {
  const { inspiration, isLoading, errorMsg, copiedHex, fetchInspiration, copyToClipboard } =
    useInspirationStudio(plan);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border-3 border-plum rounded-kawaii-xl p-6 shadow-kawaii-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-plum/20">
          <div>
            <div className="flex items-center gap-2">
              <KawaiiBow size={20} />
              <h1 className="font-heading font-bold text-2xl text-plum">
                AI Inspiration Studio & Moodboard
              </h1>
              <KawaiiSparkle size={16} />
            </div>
            <p className="text-xs text-plum-light font-medium mt-0.5">
              Personalized themes, color stories, sensory decor concepts, and menu inspiration.
            </p>
          </div>

          <button
            onClick={fetchInspiration}
            disabled={isLoading}
            className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-xs px-4 py-2 rounded-xl border border-plum flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate Concepts</span>
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-xl bg-blush-200 border-2 border-plum text-xs text-plum font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {isLoading && !inspiration ? (
        <div className="scrapbook-card p-12 text-center bg-white">
          <KawaiiBunnyMascot size={48} className="mx-auto mb-3 animate-bounce" />
          <h3 className="font-heading font-bold text-lg text-plum">
            Summoning Aesthetic Moodboards...
          </h3>
          <p className="text-xs text-plum-light mt-1">
            Analyzing event context, guest dynamics, and color harmonies...
          </p>
        </div>
      ) : inspiration ? (
        <InspirationMoodboard
          inspiration={inspiration}
          copiedHex={copiedHex}
          onCopyHex={copyToClipboard}
        />
      ) : null}
    </div>
  );
};
