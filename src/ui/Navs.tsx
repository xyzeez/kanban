import { FC } from "react";
import { NavLink } from "react-router";

// Contexts
import { useApp } from "../contexts/AppContext";

// Components
import {
  BoardIcon,
  DarkThemeIcon,
  HideIcon,
  LightThemeIcon,
  PlusIcon,
  ShowIcon,
} from "../components/Icons";

// Types
interface BoardItemProps {
  title: string;
  to: string;
}

const BoardItem: FC<BoardItemProps> = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-btn w-full max-w-[276px] rounded-r-full px-6 py-4 xl:px-8 ${isActive ? "bg-purple text-white" : "text-grey-500"} `
    }
  >
    <BoardIcon className="size-4" />
    <span>{title}</span>
  </NavLink>
);

const CreateBoardButton: FC = () => {
  return (
    <button className="text-btn text-purple">
      <PlusIcon className="size-4" />
      Create New Board
    </button>
  );
};
const BoardList: FC = () => (
  <menu className="pr-3 font-sans">
    <li className="mb-5 pl-6">
      <h2 className="text-xs font-bold tracking-[2.4px] text-grey-500">
        ALL BOARDICONS (3)
      </h2>
    </li>
    <li>
      <BoardItem title="Platform Launch" to="/platform-launch" />
    </li>
    <li className="w-full max-w-[276px] px-6 py-4 xl:px-8">
      <CreateBoardButton />
    </li>
  </menu>
);

const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-6 rounded-md bg-grey-100 py-[14px] text-grey-500">
      <LightThemeIcon className="size-4" />
      <button
        onClick={toggleTheme}
        className={`relative h-5 w-10 rounded-full bg-purple after:absolute after:top-[3px] after:size-[14px] after:rounded-full after:bg-white after:transition-all after:duration-200 ${
          theme === "dark" ? "after:left-[23px]" : "after:left-[3px]"
        }`}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      />
      <DarkThemeIcon className="size-4" />
    </div>
  );
};

export const MobileNav: FC = () => (
  <div className="modal-shadow flex w-full max-w-[264px] flex-col gap-4 rounded-lg bg-white py-4 font-sans">
    <BoardList />
    <div className="pl-4 pr-3">
      <ThemeToggle />
    </div>
  </div>
);

export const SideBarNav: FC = () => {
  const { openSideBar, toggleSidebarState } = useApp();

  return (
    <div className="relative">
      <div
        className={`flex h-full flex-col gap-6 overflow-hidden whitespace-nowrap border-r border-grey-100 bg-white pb-8 pt-4 font-sans transition-all xl:pb-12 ${openSideBar ? "w-[260px] max-w-[260px] opacity-100 xl:w-[300px] xl:max-w-[300px]" : "max-w-0 opacity-0"}`}
      >
        <BoardList />
        <div className="mt-auto flex flex-col gap-[30px] px-3 xl:gap-6 xl:px-6">
          <ThemeToggle />
          <div className="pl-3 xl:pl-2">
            <button
              onClick={() => toggleSidebarState(false)}
              className="flex flex-row items-center gap-[10px] text-base font-bold text-grey-500"
              aria-label="HideIcon sidebar"
            >
              <HideIcon className="h-4 w-[18px]" />
              <span>HideIcon Sidebar</span>
            </button>
          </div>
        </div>
      </div>
      {!openSideBar && (
        <button
          onClick={() => toggleSidebarState(true)}
          className="absolute bottom-8 left-full w-14 rounded-r-full bg-purple p-5 text-white"
        >
          <ShowIcon className="h-[10px] w-4" />
        </button>
      )}
    </div>
  );
};
