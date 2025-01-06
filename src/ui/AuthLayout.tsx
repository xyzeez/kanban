import { FC } from "react";
import { Navigate, Outlet } from "react-router";

// Contexts
import { useAuth } from "../contexts/authContext";

const AuthLayout: FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="grid min-h-screen bg-grey-100 p-4 dark:bg-grey-900">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
