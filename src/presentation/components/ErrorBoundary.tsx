import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Content to render when no error is present. */
  children: ReactNode;
  /** Optional custom fallback UI. Defaults to a styled error card. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

/**
 * React class-based Error Boundary.
 *
 * Catches JavaScript errors anywhere in the component tree below it,
 * logs the error, and renders a friendly fallback UI instead of a blank screen.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught unhandled error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          className="min-h-[200px] flex flex-col items-center justify-center gap-4 p-8 bg-blush-100 border-2 border-plum rounded-2xl text-center text-plum"
        >
          <div className="text-4xl" aria-hidden="true">🎀</div>
          <h2 className="font-heading font-bold text-xl">Something went a little sideways…</h2>
          <p className="text-sm text-plum-light max-w-md">
            An unexpected error occurred in this section. Your event data is safe in local storage.
          </p>
          {this.state.errorMessage && (
            <code className="text-xs bg-white/60 px-3 py-1 rounded-lg border border-plum/20 max-w-md truncate block">
              {this.state.errorMessage}
            </code>
          )}
          <button
            onClick={this.handleReset}
            className="btn-kawaii bg-lavender-200 hover:bg-lavender-300 text-plum font-bold text-sm px-5 py-2 rounded-xl border border-plum"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
