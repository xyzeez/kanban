import { FC } from "react";
import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Contexts
import { AuthProvider } from "../../contexts/AuthContext";
import { AppProvider } from "../../contexts/AppContext";

// Components
import Toaster from "../../components/Toaster";

// Query Client instance
const queryClient = new QueryClient();

const RootLayout: FC = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Toaster />
          <Outlet />
          <ReactQueryDevtools />
        </AppProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default RootLayout;
