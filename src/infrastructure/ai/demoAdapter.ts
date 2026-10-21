import {
  IAIProvider,
  AIProviderStatus,
  PlanGenerationParams,
  PlanRevisionParams,
  InspirationParams,
  AIGeneratedPlanOutput,
  AIPlanRevisionProposal,
  InspirationStudioOutput,
} from './aiInterface';

export class DemoAdapter implements IAIProvider {
  async getStatus(): Promise<AIProviderStatus> {
    return {
      name: 'Demonstration Engine',
      type: 'demo',
      isAvailable: true,
      modelName: 'Gatherly Deterministic Knowledge Engine',
      latencyMs: 15,
      lastChecked: new Date().toISOString(),
      statusMessage: 'Ready (Offline / Cloud Production Safe)',
    };
  }

  async generatePlan(
    params: PlanGenerationParams,
    signal?: AbortSignal
  ): Promise<{ data: AIGeneratedPlanOutput; latencyMs: number }> {
    const start = performance.now();
    await this.delay(350, signal);

    const budget = params.budgetLimitPaise;
    const isWedding = params.eventType === 'wedding';
    const isBirthday = params.eventType === 'birthday';

    let data: AIGeneratedPlanOutput;

    if (isWedding) {
      data = {
        themeTitle: 'Pastel Dream Mandap & Fairytale Garden',
        conceptDescription:
          'A soft, romantic celebration blending traditional rituals with whimsical pastel florals, acoustic music, and curated gourmet dining.',
        colorPalette: ['#DCCEFF', '#FFD9E8', '#FFF0B8', '#D5F3DF', '#554564'],
        recommendedExpenses: [
          {
            category: 'venue',
            name: 'Open Lawn & Banquet Hall Booking',
            estimatedCostPaise: Math.round(budget * 0.32),
            priority: 'essential',
            notes: 'Requires 40% advance deposit',
          },
          {
            category: 'catering',
            name: 'Live Culinary Stations & Welcome Mocktails',
            estimatedCostPaise: Math.round(budget * 0.30),
            priority: 'essential',
            notes: `Calculated for ~${params.guestCount} guests`,
          },
          {
            category: 'photography',
            name: 'Cinematic Video & Candid Photography Team',
            estimatedCostPaise: Math.round(budget * 0.14),
            priority: 'preferred',
            notes: 'Includes drone footage and edited highlight reel',
          },
          {
            category: 'decoration',
            name: 'Fairytale Floral Arch & Fairy Light Canopy',
            estimatedCostPaise: Math.round(budget * 0.12),
            priority: 'preferred',
            notes: 'Eco-friendly biodegradable decor elements',
          },
          {
            category: 'entertainment',
            name: 'Acoustic Fusion Band & Sound System',
            estimatedCostPaise: Math.round(budget * 0.07),
            priority: 'optional',
            notes: 'Evening cocktail entertainment',
          },
          {
            category: 'invitations',
            name: 'Handcrafted Watercolor Digital & Print E-Invites',
            estimatedCostPaise: Math.round(budget * 0.05),
            priority: 'optional',
          },
        ],
        recommendedTasks: [
          {
            title: 'Confirm and Lock Venue Contract',
            description: 'Visit venue, inspect parking & accessibility, pay security deposit.',
            daysBeforeEvent: 60,
            priority: 'high',
            vendorCategory: 'venue',
          },
          {
            title: 'Schedule Menu Tasting & Finalize Catering Headcount',
            description: 'Taste signature appetizers, finalize live counters and dietary options.',
            daysBeforeEvent: 30,
            priority: 'high',
            vendorCategory: 'catering',
          },
          {
            title: 'Pre-wedding Shoot & Shot List Briefing',
            description: 'Brief photographer on family portraits and must-capture emotional moments.',
            daysBeforeEvent: 20,
            priority: 'medium',
            vendorCategory: 'photography',
          },
          {
            title: 'Send Digital Invites & RSVP Tracking Link',
            description: 'Dispatch kawaii illustrated wedding invites via WhatsApp and email.',
            daysBeforeEvent: 25,
            priority: 'medium',
            vendorCategory: 'invitations',
          },
          {
            title: 'Finalize Soundcheck and Sangeet Tracklist',
            description: 'Coordinate mic setup, battery backup, and playlist sequence.',
            daysBeforeEvent: 7,
            priority: 'low',
            vendorCategory: 'entertainment',
          },
        ],
        recommendedVendors: [
          {
            category: 'venue',
            title: 'Lawn & Heritage Courtyard',
            requirements: `Capacity: ${params.guestCount}+ pax, parking, bridal suite`,
            estimatedCostPaise: Math.round(budget * 0.32),
          },
          {
            category: 'catering',
            title: 'Artisan Gourmet Caterers',
            requirements: 'Vegetarian + Global Live Counters, 2 Welcome Drinks',
            estimatedCostPaise: Math.round(budget * 0.30),
          },
          {
            category: 'photography',
            title: 'Studio Lens & Moments',
            requirements: '2 Candid + 1 Traditional + Drone operator',
            estimatedCostPaise: Math.round(budget * 0.14),
          },
        ],
      };
    } else if (isBirthday) {
      data = {
        themeTitle: 'Whimsical Kawaii Sugar Wonderland',
        conceptDescription:
          'A cheerful, heartwarming birthday gathering with customized dessert tables, polaroid photo booths, and interactive party games.',
        colorPalette: ['#FFD9E8', '#FFF0B8', '#CDEBFF', '#D5F3DF', '#554564'],
        recommendedExpenses: [
          {
            category: 'venue',
            name: 'Boutique Party Cafe or Terrace Garden',
            estimatedCostPaise: Math.round(budget * 0.30),
            priority: 'essential',
          },
          {
            category: 'catering',
            name: 'Gourmet Sliders, Finger Foods & Custom Fondant Cake',
            estimatedCostPaise: Math.round(budget * 0.35),
            priority: 'essential',
            notes: '2-tier custom designed birthday cake',
          },
          {
            category: 'decoration',
            name: 'Pastel Balloon Garland & Custom Photo Backdrop',
            estimatedCostPaise: Math.round(budget * 0.18),
            priority: 'preferred',
          },
          {
            category: 'entertainment',
            name: 'Interactive Game Host / Magic & Polaroid Station',
            estimatedCostPaise: Math.round(budget * 0.12),
            priority: 'preferred',
          },
          {
            category: 'miscellaneous',
            name: 'Kawaii Goodie Bags & Personalized Favors',
            estimatedCostPaise: Math.round(budget * 0.05),
            priority: 'optional',
          },
        ],
        recommendedTasks: [
          {
            title: 'Reserve Cafe or Terrace Venue',
            description: 'Ensure adequate seating and sound permissions.',
            daysBeforeEvent: 21,
            priority: 'high',
            vendorCategory: 'venue',
          },
          {
            title: 'Order Themed Cake & Custom Flavor Selection',
            description: 'Specify dietary restrictions and delivery timing.',
            daysBeforeEvent: 14,
            priority: 'high',
            vendorCategory: 'catering',
          },
          {
            title: 'Finalize Balloon Color Scheme & Backdrop Banner',
            description: 'Provide birthday person’s favorite pastel color palette.',
            daysBeforeEvent: 10,
            priority: 'medium',
            vendorCategory: 'decoration',
          },
          {
            title: 'Send Interactive RSVP Cards',
            description: 'Gather dietary preferences and song requests.',
            daysBeforeEvent: 12,
            priority: 'medium',
          },
        ],
        recommendedVendors: [
          {
            category: 'catering',
            title: 'Sugar Blossom Bakery & Cafe',
            requirements: 'Eggless options, 2-tier design, delivery to venue',
            estimatedCostPaise: Math.round(budget * 0.35),
          },
          {
            category: 'decoration',
            title: 'Cloud Nine Pastel Balloons & Props',
            requirements: 'Organic balloon garland with marquee number sign',
            estimatedCostPaise: Math.round(budget * 0.18),
          },
        ],
      };
    } else {
      // Community event
      data = {
        themeTitle: 'Community Harmony & Eco Festival',
        conceptDescription:
          'An inclusive neighborhood carnival focusing on sustainability, local talent, community bonding, and family activities.',
        colorPalette: ['#D5F3DF', '#FFF0B8', '#CDEBFF', '#554564', '#FFF9F5'],
        recommendedExpenses: [
          {
            category: 'permits',
            name: 'Civic Authority / Park Board Permit & Sanitation',
            estimatedCostPaise: Math.round(budget * 0.15),
            priority: 'essential',
          },
          {
            category: 'venue',
            name: 'Community Center / Public Park Rental',
            estimatedCostPaise: Math.round(budget * 0.25),
            priority: 'essential',
          },
          {
            category: 'catering',
            name: 'Community Refreshment Kiosk & Chai Counters',
            estimatedCostPaise: Math.round(budget * 0.30),
            priority: 'essential',
          },
          {
            category: 'entertainment',
            name: 'PA Sound System, Microphones & Stage Risers',
            estimatedCostPaise: Math.round(budget * 0.18),
            priority: 'preferred',
          },
          {
            category: 'invitations',
            name: 'Banners, Flyers & Digital Community Posters',
            estimatedCostPaise: Math.round(budget * 0.12),
            priority: 'optional',
          },
        ],
        recommendedTasks: [
          {
            title: 'File Civic Permit & Health Safety Approvals',
            description: 'Submit crowd safety plan and facility permissions.',
            daysBeforeEvent: 30,
            priority: 'high',
            vendorCategory: 'permits',
          },
          {
            title: 'Confirm Park Pavilion Setup & Power Supply',
            description: 'Verify generator backup and accessible ramps.',
            daysBeforeEvent: 15,
            priority: 'high',
            vendorCategory: 'venue',
          },
          {
            title: 'Organize Volunteer Teams & Safety Briefing',
            description: 'Assign welcome desk, first aid, and refreshment shifts.',
            daysBeforeEvent: 7,
            priority: 'medium',
          },
        ],
        recommendedVendors: [
          {
            category: 'permits',
            title: 'Municipal Ward Administration',
            requirements: 'Public gathering permit, waste management clearance',
            estimatedCostPaise: Math.round(budget * 0.15),
          },
          {
            category: 'entertainment',
            title: 'Acoustic Sound & Stage Hire',
            requirements: 'Wireless mics, 1000W PA speakers, technician on site',
            estimatedCostPaise: Math.round(budget * 0.18),
          },
        ],
      };
    }

    const latencyMs = Math.round(performance.now() - start);
    return { data, latencyMs };
  }

  async revisePlan(
    params: PlanRevisionParams,
    signal?: AbortSignal
  ): Promise<{ data: AIPlanRevisionProposal; latencyMs: number }> {
    const start = performance.now();
    await this.delay(350, signal);

    const isBudgetCut =
      params.changes.newBudgetLimitPaise !== undefined &&
      params.changes.newBudgetLimitPaise < params.currentPlanSummary.budgetLimitPaise;

    const isGuestIncrease =
      params.changes.newGuestCount !== undefined &&
      params.changes.newGuestCount > params.currentPlanSummary.guestCount;

    const isDateMoved = !!params.changes.newEventDate;

    const tradeOffs: string[] = [];
    const proposedExpenseAdjustments: AIPlanRevisionProposal['proposedExpenseAdjustments'] = [];
    const proposedTimelineAdjustments: AIPlanRevisionProposal['proposedTimelineAdjustments'] = [];

    if (isBudgetCut) {
      tradeOffs.push(
        'Downscaled decorative floral density by 30% and transitioned optional entertainment to curated acoustic playlists.'
      );
      tradeOffs.push(
        'Preserved premium catering and core photography while renegotiating package inclusions.'
      );

      const targetBudget = params.changes.newBudgetLimitPaise!;
      proposedExpenseAdjustments.push({
        category: 'decoration',
        name: 'Curated Minimalist Pastel Floral Arrangement',
        newEstimatedCostPaise: Math.round(targetBudget * 0.09),
        priority: 'preferred',
        reason: 'Swapped fresh exotic blooms for seasonal sustainable flora to meet budget reduction.',
      });
      proposedExpenseAdjustments.push({
        category: 'entertainment',
        name: 'Acoustic Soloist / Custom Curated Sound System',
        newEstimatedCostPaise: Math.round(targetBudget * 0.05),
        priority: 'optional',
        reason: 'Adjusted from 5-piece live band to acoustic soloist to protect core budget limit.',
      });
    }

    if (isGuestIncrease) {
      tradeOffs.push(
        `Rebalanced budget per head: Catering scaled upwards to accommodate +${params.changes.newGuestCount! - params.currentPlanSummary.guestCount} guests without compromising food quality.`
      );
      tradeOffs.push(
        'Adjusted venue seating layout from banquet roundtables to cocktail lounge style to maximize room capacity.'
      );

      const newGuestBudget = params.changes.newBudgetLimitPaise || params.currentPlanSummary.budgetLimitPaise;
      proposedExpenseAdjustments.push({
        category: 'catering',
        name: 'Buffet Stations & Finger Food Scaled for Guest Count',
        newEstimatedCostPaise: Math.round(newGuestBudget * 0.38),
        priority: 'essential',
        reason: `Re-calculated minimum head-cost for expanded attendee count (${params.changes.newGuestCount} guests).`,
      });
    }

    if (isDateMoved) {
      tradeOffs.push(
        `Fast-tracked vendor commitments and shifted critical tasting and confirmation milestones to match the new date (${params.changes.newEventDate}).`
      );
      proposedTimelineAdjustments.push({
        title: 'Accelerated Vendor Deposit & Booking Confirmation',
        newDueDate: params.changes.newEventDate!,
        reason: 'Moved forward to prevent calendar forfeiture with key venue and catering vendors.',
      });
    }

    if (tradeOffs.length === 0) {
      tradeOffs.push('Optimized task pacing and clarified expense allocations for balanced cash flow.');
    }

    const data: AIPlanRevisionProposal = {
      rationale:
        'Analyzed proposed constraint deltas. Prepared realistic trade-offs that preserve event sentiment and core experience while guaranteeing strict adherence to limits.',
      tradeOffs,
      proposedExpenseAdjustments,
      proposedTimelineAdjustments,
    };

    const latencyMs = Math.round(performance.now() - start);
    return { data, latencyMs };
  }

  async generateInspiration(
    params: InspirationParams,
    signal?: AbortSignal
  ): Promise<{ data: InspirationStudioOutput; latencyMs: number }> {
    const start = performance.now();
    await this.delay(300, signal);

    const data: InspirationStudioOutput = {
      themeName: `${params.title} — Pastel Serenade & Kawaii Botanicals`,
      decorConcept:
        'A soft scrapbook aesthetic featuring gentle fairy-lights, handwritten calligraphy name cards, pastel cloud balloons, and eco-friendly wildflower accents.',
      colorPalette: [
        { name: 'Dreamy Lavender', hex: '#DCCEFF' },
        { name: 'Blush Pink', hex: '#FFD9E8' },
        { name: 'Butter Yellow', hex: '#FFF0B8' },
        { name: 'Soft Mint', hex: '#D5F3DF' },
        { name: 'Muted Plum', hex: '#554564' },
      ],
      activities: [
        'Mini Polaroid Guestbook Station with cute washi tape and metallic gel pens',
        'Interactive DIY Dessert & Mocktail mixing bar',
        'Heartfelt Memory Trivia & Kawaii bingo cards for guests',
      ],
      menuIdeas: [
        'Artisan sourdough bruschetta & mini paneer/chicken skewers',
        'Refreshing iced elderflower peach coolers & lavender lemonade',
        'Signature celebration cake with edible wafer flowers & berry compote',
      ],
      budgetSavingAlternatives: [
        'Opt for a Sunday brunch or sunset high-tea timing rather than peak Saturday night banquet pricing.',
        'Use potted lavender or rosemary herbs as centerpieces that double as charming take-home guest favors.',
        'Replace elaborate print collateral with personalized interactive digital invitations.',
      ],
    };

    const latencyMs = Math.round(performance.now() - start);
    return { data, latencyMs };
  }

  private delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('AI request was cancelled by user', 'AbortError'));
        });
      }
    });
  }
}
