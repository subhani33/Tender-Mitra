import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    console.error('ErrorBoundary caught an error:', error);
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    
    this.setState({
      errorInfo
    });

    // Try to update the error-details element if it exists
    setTimeout(() => {
      const errorDetailsElement = document.getElementById('error-details');
      if (errorDetailsElement) {
        errorDetailsElement.innerHTML = `
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Stack:</strong></p>
          <pre>${error.stack}</pre>
          <p><strong>Component Stack:</strong></p>
          <pre>${errorInfo.componentStack}</pre>
        `;
      }
    }, 0);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="bg-red-900/80 text-white p-4 rounded-md shadow-lg m-4">
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">There was an error rendering this component.</p>
          <details className="bg-red-950/50 p-2 rounded">
            <summary className="cursor-pointer">Show error details</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-32 p-2 bg-black/30 rounded">
              {this.state.error?.toString()}
            </pre>
            {this.state.errorInfo && (
              <div className="mt-2">
                <p className="text-xs mb-1">Component stack:</p>
                <pre className="text-xs overflow-auto max-h-32 p-2 bg-black/30 rounded">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </details>
          <button 
            className="mt-4 px-4 py-2 bg-white text-red-900 rounded hover:bg-red-100 transition-colors font-medium"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 