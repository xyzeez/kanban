import { FC, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

// Hook
import { useBoards } from "../../hooks/useBoards";
// UIs
import Header from "../Header";
import { SideBarNav } from "../Navs";
import LoadingScreen from "../placeholders/LoadingScreen";

const AppLayout: FC = () => {
  const { boards } = useBoards();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (boards?.length && location.pathname === "/") {
      void navigate(`/boards/${boards[0].slug}`);
    }
  }, [boards, location.pathname, navigate]);

  if (!boards) return <LoadingScreen type="App" />;

  return (
    <div className="grid h-screen min-h-[440px] grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-[auto_1fr]">
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 md:col-end-3">
        <Header />
      </div>
      <div className="hidden bg-white transition-all dark:bg-grey-800 md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 md:grid">
        <SideBarNav />
      </div>
      <main className="col-start-1 col-end-2 row-start-2 row-end-3 grid overflow-hidden bg-grey-100 transition-colors dark:bg-grey-900 md:col-start-2 md:col-end-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
