import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../App';

describe('Gatherly AI App Component & Full Navigation Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the initial starter event dashboard with metrics and countdown', async () => {
    render(<App />);

    // Brand title
    expect(screen.getAllByText(/Gatherly/i).length).toBeGreaterThan(0);

    // Default starter event title
    const titles = await screen.findAllByText(/Aarav & Maya/i);
    expect(titles.length).toBeGreaterThan(0);

    // Financial metric headings
    expect(screen.getByText(/Total Budget/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Spend/i)).toBeInTheDocument();
    expect(screen.getByText(/Actual Spend/i)).toBeInTheDocument();

    // Countdown and tabs
    expect(screen.getByText(/Countdown/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Budget Studio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /What-If Replanner/i })).toBeInTheDocument();
  });

  it('navigates seamlessly across tabs: Budget Studio, Timeline, Vendors, and What-If', async () => {
    render(<App />);

    // Switch to Budget Studio
    const budgetTabBtn = screen.getByRole('button', { name: /Budget Studio/i });
    fireEvent.click(budgetTabBtn);
    expect(await screen.findByText(/Pastel Budget Studio/i)).toBeInTheDocument();

    // Switch to Timeline
    const timelineTabBtn = screen.getByRole('button', { name: /Timeline/i });
    fireEvent.click(timelineTabBtn);
    expect(await screen.findByText(/Timeline & Milestone Planner/i)).toBeInTheDocument();

    // Switch to Vendors
    const vendorTabBtn = screen.getByRole('button', { name: /Vendors/i });
    fireEvent.click(vendorTabBtn);
    expect(await screen.findByText(/Vendor Booking Checklist/i)).toBeInTheDocument();

    // Switch to What-If Replanner
    const whatIfTabBtn = screen.getByRole('button', { name: /What-If Replanner/i });
    fireEvent.click(whatIfTabBtn);
    expect(await screen.findByText(/Constraint-Aware What-If Replanner/i)).toBeInTheDocument();
  });

  it('opens and closes the event switcher modal', async () => {
    render(<App />);

    const newEventBtn = screen.getByRole('button', { name: /New Event/i });
    fireEvent.click(newEventBtn);

    expect(await screen.findByText(/Your Saved Events/i)).toBeInTheDocument();

    const closeBtn = screen.getByLabelText(/Close/i);
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Your Saved Events/i)).not.toBeInTheDocument();
    });
  });
});
