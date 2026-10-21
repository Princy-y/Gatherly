import React, { useState, useEffect } from 'react';
import { EventPlan } from '../../domain/types';
import { getAIProvider } from '../../infrastructure/ai/aiFactory';
import { InspirationStudioOutput } from '../../infrastructure/ai/aiInterface';
import {
  KawaiiBow,
  KawaiiSparkle,
  KawaiiBunnyMascot,
} from './KawaiiDecorations';
import {
  Palette,
  Utensils,
  PartyPopper,
  PiggyBank,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

interface InspirationStudioTabProps {
  plan: EventPlan;
}

export const InspirationStudioTab: React.FC<InspirationStudioTabProps> = ({ plan }) => {
  const [inspiration, setInspiration] = useState<InspirationStudioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const fetchInspiration = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const provider = getAIProvider();
      const { data } = await provider.generateInspiration({
        eventType: plan.eventType,
        title: plan.title,
        preferences: plan.preferences || 'Dreamy pastel aesthetic',
        guestCount: plan.guestCount,
        budgetLimitPaise: plan.budgetLimitPaise,
      });
      setInspiration(data);
    } catch (err: any) {
      console.error('Failed to generate inspiration:', err);
      setErrorMsg(err.message || 'Could not fetch creative inspiration.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInspiration();
  }, [plan.id]);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

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
        <div className="space-y-6">
          {/* Theme & Decor Concept Card */}
          <div className="scrapbook-card p-6 bg-lavender-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="kawaii-badge bg-blush-200 text-plum text-xs">
                ✨ Signature Concept
              </span>
            </div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-plum mb-2">
              {inspiration.themeName}
            </h2>
            <p className="text-xs sm:text-sm text-plum font-medium leading-relaxed bg-white/70 p-4 rounded-xl border border-plum/20">
              {inspiration.decorConcept}
            </p>
          </div>

          {/* Color Palette Swatches */}
          <div className="scrapbook-card p-6 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-base text-plum flex items-center gap-2">
                <Palette className="w-4 h-4" /> Curated Color Palette
              </h3>
              <span className="text-xs text-plum-light font-medium">Click swatch to copy HEX</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {inspiration.colorPalette.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => copyToClipboard(color.hex)}
                  className="p-3 rounded-xl border-2 border-plum bg-cream-50 hover:bg-cream-100 transition-all text-left group"
                  title="Click to copy Hex code"
                >
                  <div
                    className="w-full h-14 rounded-lg border border-plum/30 mb-2 shadow-xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="font-bold text-xs text-plum truncate">{color.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-plum-light mt-0.5">
                    <span className="font-mono">{color.hex}</span>
                    {copiedHex === color.hex ? (
                      <Check className="w-3 h-3 text-green-700" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Columns: Activities, Menu, Budget Hacks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Activities */}
            <div className="scrapbook-card p-5 bg-iceBlue-50 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <PartyPopper className="w-4 h-4 text-plum" />
                <h3 className="font-heading font-bold text-base text-plum">
                  Activity Suggestions
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-plum font-medium">
                {inspiration.activities.map((act, i) => (
                  <li key={i} className="p-2.5 bg-white/80 rounded-xl border border-plum/20">
                    🌸 {act}
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu Ideas */}
            <div className="scrapbook-card p-5 bg-butter-50 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-4 h-4 text-plum" />
                <h3 className="font-heading font-bold text-base text-plum">
                  Menu & Beverage Ideas
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-plum font-medium">
                {inspiration.menuIdeas.map((menu, i) => (
                  <li key={i} className="p-2.5 bg-white/80 rounded-xl border border-plum/20">
                    🍰 {menu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Budget Alternatives */}
            <div className="scrapbook-card p-5 bg-mint-50 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <PiggyBank className="w-4 h-4 text-plum" />
                <h3 className="font-heading font-bold text-base text-plum">
                  Smart Budget Alternatives
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-plum font-medium">
                {inspiration.budgetSavingAlternatives.map((alt, i) => (
                  <li key={i} className="p-2.5 bg-white/80 rounded-xl border border-plum/20">
                    💡 {alt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
