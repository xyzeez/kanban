import { FC } from "react";

// Hooks
import { useApp } from "../../../hooks/useApp";

// Components
import { HideIcon, ShowIcon } from "../../../components/Icons";

const ToggleSidebarButton: FC = () => {
  const { openSideBar, toggleSidebar } = useApp();

  return (
    <button
      onClick={() => toggleSidebar(!openSideBar)}
      className={`fixed left-0 grid h-12 grid-cols-[24px_auto] items-center gap-3 rounded-r-full px-6 font-sans text-base font-bold capitalize transition-all enabled:hover:bg-purple enabled:hover:text-white xl:px-8 ${
        openSideBar
          ? "w-[248px] max-w-[248px] bg-transparent text-grey-500 xl:w-[275px] xl:max-w-[275px]"
          : "w-14 max-w-14 bg-purple pl-[18px] pr-[22px] text-white xl:w-14 xl:max-w-14 xl:pl-[18px] xl:pr-[22px]"
      }`}
      aria-label={openSideBar ? "Hide Sidebar" : "Show Sidebar"}
    >
      <HideIcon
        className={`col-start-1 col-end-2 row-start-1 row-end-2 size-5 transition-all ${
          openSideBar ? "opacity-100" : "opacity-0"
        }`}
      />
      <ShowIcon
        className={`col-start-1 col-end-2 row-start-1 row-end-2 size-5 transition-all ${
          openSideBar ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`${
          openSideBar ? "w-[9ch]" : "w-[0]"
        } overflow-hidden whitespace-nowrap`}
      >
        Hide Sidebar
      </span>
    </button>
  );
};

export default ToggleSidebarButton;
