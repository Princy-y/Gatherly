import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Explosion in render!');
  }
  return <div>Safe Child Content</div>;
};

describe('ErrorBoundary Component', () => {
  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Child Content')).toBeInTheDocument();
  });

  it('catches render error and displays friendly fallback alert with recover button', () => {
    // Suppress console.error in test output for intentional throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something went a little sideways/i)).toBeInTheDocument();
    expect(screen.getByText(/Explosion in render!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom Fallback UI</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback UI')).toBeInTheDocument();
    expect(screen.queryByText(/Something went a little sideways/i)).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('resets error state when Try Again is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let throwError = true;
    const DynamicChild = () => {
      if (throwError) {
        throw new Error('Temporary failure');
      }
      return <div>Recovered Child</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <DynamicChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Temporary failure/i)).toBeInTheDocument();

    // Now fix the condition and click Try Again
    throwError = false;
    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));

    rerender(
      <ErrorBoundary>
        <DynamicChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered Child')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
