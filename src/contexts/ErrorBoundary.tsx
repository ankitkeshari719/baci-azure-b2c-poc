import { ErrorContext } from './ErrorContext';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.context.setError('Error:' + error?.message);
  }

  render() {
    if ((this.state as any).hasError) {
      return <></>;
    }

    return this.props.children;
  }
}

ErrorBoundary.contextType = ErrorContext;

export { ErrorBoundary };
