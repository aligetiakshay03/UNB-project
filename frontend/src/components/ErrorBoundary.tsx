import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-xs shadow-lg p-8 text-center space-y-5">
            <div className="w-12 h-12 bg-red-100 text-red-600 mx-auto rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-unb-navy tracking-tight">Something went wrong</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                An unexpected rendering error occurred while displaying this section.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Button onClick={() => (window.location.href = '/')} variant="outline" size="sm">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>HOME</span>
              </Button>
              <Button onClick={this.handleReset} variant="navy" size="sm">
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>RETRY</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
