import { FC } from "react";
import { Outlet } from "react-router";

// Contexts
import { AuthProvider } from "../contexts/authContext";
import { AppProvider } from "../contexts/AppContext";

const RootLayout: FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Outlet />
      </AppProvider>
    </AuthProvider>
  );
};

export default RootLayout;
