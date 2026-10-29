import React from 'react';
import { EventPlan } from './domain/types';
import { Navbar } from './presentation/components/Navbar';
import { DashboardTab } from './presentation/components/DashboardTab';
import { BudgetStudioTab } from './presentation/components/BudgetStudioTab';
import { TimelineTab } from './presentation/components/TimelineTab';
import { VendorChecklistTab } from './presentation/components/VendorChecklistTab';
import { InspirationStudioTab } from './presentation/components/InspirationStudioTab';
import { WhatIfSimulatorTab } from './presentation/components/WhatIfSimulatorTab';
import { EventWizardModal } from './presentation/components/EventWizardModal';
import { EventSwitchModal } from './presentation/components/EventSwitchModal';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import { AppFooter } from './presentation/components/AppFooter';
import { useAppEvents } from './presentation/hooks/useAppEvents';

const DEFAULT_INITIAL_PLAN: EventPlan = {
  id: 'starter-wedding-plan',
  schemaVersion: 1,
  title: 'Aarav & Maya’s Whimsical Pastel Wedding',
  eventType: 'wedding',
  location: 'Jaipur & Udaipur, Rajasthan',
  eventDate: '2026-12-18',
  currency: 'INR',
  budgetLimitPaise: 150000000, // ₹15,00,000
  guestCount: 150,
  priorities: ['Catering Quality', 'Photography & Film', 'Floral Decor', 'Guest Comfort'],
  preferences:
    'Soft lavender and blush palette, fairy-light canopies, fusion live counters, candid moments.',
  accessibilityRequirements:
    'Wheelchair ramps for lawn reception and priority seating for seniors.',
  expenses: [
    {
      id: 'e1',
      category: 'venue',
      name: 'Heritage Palace Courtyard & Lawns',
      estimatedCostPaise: 48000000, // ₹4,80,000
      actualCostPaise: 45000000, // ₹4,50,000 (confirmed)
      priority: 'essential',
      notes: 'Includes lawn lighting and generator backup',
    },
    {
      id: 'e2',
      category: 'catering',
      name: 'Artisan Gourmet Live Counters (150 Pax)',
      estimatedCostPaise: 45000000, // ₹4,50,000
      actualCostPaise: null,
      priority: 'essential',
      notes: 'Global chaat, woodfired pizza, and traditional Rajasthani thali',
    },
    {
      id: 'e3',
      category: 'photography',
      name: 'Cinematic Drone & Candid Photo Crew',
      estimatedCostPaise: 22000000, // ₹2,20,000
      actualCostPaise: 20000000, // ₹2,00,000 (advance paid)
      priority: 'preferred',
      notes: 'Deliverables: 3-min highlight reel + 500 edited images',
    },
    {
      id: 'e4',
      category: 'decoration',
      name: 'Fairytale Lavender Floral Arch & Stage',
      estimatedCostPaise: 18000000, // ₹1,80,000
      actualCostPaise: null,
      priority: 'preferred',
      notes: 'Sustainable fresh blooms and fairy light drapery',
    },
    {
      id: 'e5',
      category: 'entertainment',
      name: 'Acoustic Fusion Band & Sangeet Sound',
      estimatedCostPaise: 9000000, // ₹90,000
      actualCostPaise: null,
      priority: 'optional',
      notes: 'Evening cocktail live set',
    },
    {
      id: 'e6',
      category: 'invitations',
      name: 'Illustrated Digital & Foil-Stamped Invites',
      estimatedCostPaise: 4000000, // ₹40,000
      actualCostPaise: 3500000, // ₹35,000
      priority: 'optional',
      notes: 'Kawaii watercolor illustrations',
    },
  ],
  tasks: [
    {
      id: 't1',
      title: 'Pay Venue Security Deposit & Sign Agreement',
      description: 'Review curfew timings, parking facilities, and bridal green room.',
      dueDate: '2026-10-30',
      status: 'completed',
      priority: 'high',
      dependencies: [],
      vendorCategory: 'venue',
    },
    {
      id: 't2',
      title: 'Finalize Menu Tasting & Dessert Station',
      description: 'Sample appetizers and confirm live counter allergen labels.',
      dueDate: '2026-11-15',
      status: 'in_progress',
      priority: 'high',
      dependencies: ['t1'],
      vendorCategory: 'catering',
    },
    {
      id: 't3',
      title: 'Brief Photographer on Family Shot List',
      description: 'Share schedule of traditional rituals and key emotional moments.',
      dueDate: '2026-11-25',
      status: 'todo',
      priority: 'medium',
      dependencies: ['t1'],
      vendorCategory: 'photography',
    },
    {
      id: 't4',
      title: 'Dispatch Digital RSVP Cards',
      description: 'Track meal choices and out-of-town guest travel itineraries.',
      dueDate: '2026-11-20',
      status: 'todo',
      priority: 'medium',
      dependencies: ['t2'],
      vendorCategory: 'invitations',
    },
    {
      id: 't5',
      title: 'Soundcheck & Lighting Rehearsal',
      description: 'Coordinate mic testing with acoustic band and MC sequence.',
      dueDate: '2026-12-10',
      status: 'todo',
      priority: 'low',
      dependencies: ['t1'],
      vendorCategory: 'entertainment',
    },
  ],
  vendors: [
    {
      id: 'v1',
      category: 'venue',
      title: 'Heritage Palace Courtyard',
      requirements: 'Capacity for 200+ guests, valet parking, lawn access',
      bookingStatus: 'booked',
      estimatedCostPaise: 45000000,
      contactInfo: '+91 98290 12345 (Col. Rathore)',
      notes: 'Signed contract on file with 50% advance deposited.',
    },
    {
      id: 'v2',
      category: 'catering',
      title: 'Royal Saffron Gourmet Catering',
      requirements: 'Live chaat, artisan desserts, 150 pax minimum guarantee',
      bookingStatus: 'shortlisted',
      estimatedCostPaise: 45000000,
      contactInfo: '+91 98100 54321 (Chef Vikram)',
      notes: 'Tasting scheduled for Nov 15.',
    },
    {
      id: 'v3',
      category: 'photography',
      title: 'Lens & Whispers Candid Studio',
      requirements: '2 Candid shooters, 1 Traditional, 1 Drone operator',
      bookingStatus: 'booked',
      estimatedCostPaise: 20000000,
      contactInfo: 'team@lenswhispers.in',
      notes: 'Advance receipt logged.',
    },
    {
      id: 'v4',
      category: 'decoration',
      title: 'Petals & Light Sustainable Florals',
      requirements: 'Pastel mandap, fairy light canopy, natural fragrance blooms',
      bookingStatus: 'contacted',
      estimatedCostPaise: 18000000,
      contactInfo: '+91 99887 76655',
      notes: 'Awaiting revised quote based on eco-friendly materials.',
    },
  ],
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-10-20T12:00:00Z',
};

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentPlan,
    isWizardOpen,
    setIsWizardOpen,
    isSwitchModalOpen,
    setIsSwitchModalOpen,
    notification,
    handleSavePlan,
    handleSelectEvent,
    handleExportJson,
    handleImportJson,
  } = useAppEvents(DEFAULT_INITIAL_PLAN);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-plum">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        eventTitle={currentPlan.title}
        eventType={currentPlan.eventType}
        onNewEvent={() => setIsSwitchModalOpen(true)}
        onExport={handleExportJson}
        onImport={handleImportJson}
      />

      {/* Inline toast notification */}
      {notification && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border-2 border-plum shadow-kawaii-lg text-sm font-bold text-plum transition-all ${
            notification.isError ? 'bg-blush-200' : 'bg-mint-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ErrorBoundary>
          {activeTab === 'dashboard' && (
            <DashboardTab plan={currentPlan} onNavigateTab={setActiveTab} />
          )}
          {activeTab === 'budget' && (
            <BudgetStudioTab
              plan={currentPlan}
              onUpdateExpenses={(expenses) => handleSavePlan({ ...currentPlan, expenses })}
              onUpdateBudgetLimit={(limit) =>
                handleSavePlan({ ...currentPlan, budgetLimitPaise: limit })
              }
            />
          )}
          {activeTab === 'timeline' && (
            <TimelineTab
              plan={currentPlan}
              onUpdateTasks={(tasks) => handleSavePlan({ ...currentPlan, tasks })}
            />
          )}
          {activeTab === 'vendors' && (
            <VendorChecklistTab
              plan={currentPlan}
              onUpdateVendors={(vendors) => handleSavePlan({ ...currentPlan, vendors })}
            />
          )}
          {activeTab === 'inspiration' && <InspirationStudioTab plan={currentPlan} />}
          {activeTab === 'whatif' && (
            <WhatIfSimulatorTab plan={currentPlan} onApplyPlanRevision={handleSavePlan} />
          )}
        </ErrorBoundary>
      </main>

      {/* Modals */}
      <EventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSavePlan={(newPlan) => {
          handleSavePlan(newPlan);
          setActiveTab('dashboard');
        }}
      />

      <EventSwitchModal
        isOpen={isSwitchModalOpen}
        currentEventId={currentPlan.id}
        onClose={() => setIsSwitchModalOpen(false)}
        onSelectEvent={handleSelectEvent}
        onCreateNew={() => setIsWizardOpen(true)}
        onImportJson={handleImportJson}
      />

      <AppFooter />
    </div>
  );
};
