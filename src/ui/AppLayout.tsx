import { FC } from "react";
import { Navigate, useLocation } from "react-router";

// Contexts
import { useAuth } from "../contexts/authContext";

// UIs
import Header from "./Header";
import { SideBarNav } from "./Navs";

const AppLayout: FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-[auto_1fr]">
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 md:col-end-3">
        <Header />
      </div>
      <div className="hidden bg-white transition-all dark:bg-grey-800 md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 md:grid">
        <SideBarNav />
      </div>
      <main className="col-start-1 col-end-2 row-start-2 row-end-3 bg-grey-100 transition-colors dark:bg-grey-900 md:col-start-2 md:col-end-3"></main>
    </div>
  );
};

export default AppLayout;
