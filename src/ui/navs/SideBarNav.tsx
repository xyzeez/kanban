import { FC } from "react";

// Hooks
import { useApp } from "../../hooks/useApp";

// Components
import BoardList from "./components/BoardList";
import ThemeToggle from "./components/ThemeToggle";
import ToggleSidebarButton from "./components/ToggleSidebarButton";
import LogoutButton from "./components/LogoutButton";

const SideBarNav: FC = () => {
  const { openSideBar } = useApp();

  return (
    <div className="relative grid">
      <div
        className={`grid max-h-[calc(100vh-81px)] min-h-[359px] grid-rows-[1fr_auto] gap-6 overflow-hidden whitespace-nowrap border-r border-grey-100 bg-white pb-4 transition-all dark:border-grey-700 dark:bg-grey-800 xl:max-h-[calc(100vh-97px)] xl:min-h-[343px] ${
          openSideBar
            ? "w-[260px] max-w-[260px] xl:w-[300px] xl:max-w-[300px]"
            : "w-0 max-w-0 border-none"
        }`}
      >
        <BoardList />
        <div className="flex flex-col gap-4 px-3 xl:gap-2 xl:px-6">
          <ThemeToggle />
          <div className="flex h-[80px] pl-3 xl:pl-2">
            <ToggleSidebarButton />
            <div className="mt-auto">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBarNav;
