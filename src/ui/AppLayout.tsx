import { FC } from "react";

// UIs
import Header from "./Header";
import { SideBarNav } from "./Navs";
import { AppProvider } from "../contexts/AppContext";

const AppLayout: FC = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] md:grid-cols-[auto_1fr]">
      <AppProvider>
        <div className="col-start-1 col-end-2 row-start-1 row-end-2 md:col-end-3">
          <Header />
        </div>
        <div className="hidden md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3 md:grid">
          <SideBarNav />
        </div>
      </AppProvider>
      <main className="col-start-1 col-end-2 row-start-2 row-end-3 bg-grey-100 md:col-start-2 md:col-end-3"></main>
    </div>
  );
};

export default AppLayout;
