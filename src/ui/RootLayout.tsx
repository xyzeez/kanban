import { FC } from "react";
import { Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Contexts
import { AuthProvider } from "../contexts/AuthContext";
import { AppProvider } from "../contexts/AppContext";
import { ModalProvider } from "../contexts/ModalContext";

// Query Client instance
const queryClient = new QueryClient();

const RootLayout: FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <Outlet />
          </ModalProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export default RootLayout;
