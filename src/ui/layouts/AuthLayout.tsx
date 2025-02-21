import { FC } from "react";
import { Navigate, Outlet } from "react-router";

// Hooks
import { useAuth } from "../../hooks/useAuth";

// UIs
import LoadingScreen from "../placeholders/LoadingScreen";

const AuthLayout: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen type="Auth" />;

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="grid min-h-dvh bg-grey-100 p-4 transition-colors dark:bg-grey-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
