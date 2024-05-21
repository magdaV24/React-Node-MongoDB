import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from "../context/AppContextProvider";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundary as FallbackComponent } from "../components/error-handling/ErrorBoundary";

export function WithProviders(children: React.ReactNode): JSX.Element {
  const queryClient = new QueryClient();
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AppContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
