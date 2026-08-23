import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  Props,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ) {
    console.error(
      "BOOKD application error:",
      error
    );

    console.error(
      "Component stack:",
      errorInfo.componentStack
    );
  }

  handleHome = () => {
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (
      !this.state.hasError
    ) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <h1 className="font-heading text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 max-w-md text-sm opacity-70">
          BOOKD ran into an unexpected
          error. Try returning home or
          refreshing the page.
        </p>

        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={
              this.handleHome
            }
            className="border border-primary px-5 py-2 text-sm transition-opacity hover:opacity-60"
          >
            Go Home
          </button>

          <button
            type="button"
            onClick={
              this.handleReload
            }
            className="border border-primary px-5 py-2 text-sm transition-opacity hover:opacity-60"
          >
            Refresh
          </button>

        </div>

      </main>
    );
  }
}

export default ErrorBoundary;