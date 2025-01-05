import { FC } from "react";
import { NavLink } from "react-router";

// Contexts
import { useApp } from "../contexts/AppContext";

// Components
import {
  Board,
  DarkTheme,
  Hide,
  LightTheme,
  Plus,
  Show,
} from "../components/Icons";

// Types
interface BoardItemProps {
  title: string;
  to: string;
}

interface SidebarToggleProps {
  type: "hide" | "show";
}

const BoardItem: FC<BoardItemProps> = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex w-full max-w-[276px] flex-row items-center gap-3 rounded-r-full px-6 py-4 text-base font-bold xl:gap-4 xl:px-8 ${isActive ? "bg-purple text-white" : "text-grey-500"} `
    }
  >
    <Board className="size-4" />
    <span>{title}</span>
  </NavLink>
);

const CreateBoardButton: FC = () => (
  <button className="flex flex-row items-center gap-3 text-base font-bold text-purple xl:gap-4">
    <Plus className="size-4" />
    <span>Create New Board</span>
  </button>
);

const BoardList: FC = () => (
  <menu className="pr-3 font-sans">
    <li className="mb-5 pl-6">
      <h2 className="text-grey-500 text-xs font-bold tracking-[2.4px]">
        ALL BOARDS (3)
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
    <div className="bg-grey-100 text-grey-500 flex w-full flex-row items-center justify-center gap-6 rounded-md py-[14px]">
      <LightTheme className="size-4" />
      <button
        onClick={toggleTheme}
        className={`relative h-5 w-10 rounded-full bg-purple after:absolute after:top-[3px] after:size-[14px] after:rounded-full after:bg-white after:transition-all after:duration-200 ${
          theme === "dark" ? "after:left-[23px]" : "after:left-[3px]"
        }`}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      />
      <DarkTheme className="size-4" />
    </div>
  );
};

const SidebarToggle: FC<SidebarToggleProps> = ({ type }) => {
  const { toggleSidebarState } = useApp();

  return type === "hide" ? (
    <button
      onClick={toggleSidebarState}
      className="text-grey-500 flex flex-row items-center gap-[10px] text-base font-bold"
      aria-label="Hide sidebar"
    >
      <Hide className="h-4 w-[18px]" />
      <span>Hide Sidebar</span>
    </button>
  ) : (
    <button
      onClick={toggleSidebarState}
      className="absolute bottom-8 left-full w-14 rounded-r-full bg-purple p-5 text-white"
    >
      <Show className="h-[10px] w-4" />
    </button>
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
  const { openSideBar } = useApp();

  return (
    <div className="relative h-full w-max">
      <div
        className={`border-grey-100 flex h-full flex-col gap-6 overflow-hidden border-r bg-white pb-8 pt-4 font-sans ${
          openSideBar
            ? "w-[260px] xl:w-[300px]"
            : "-ml-1 w-0 overflow-hidden xl:w-0"
        } xl:pb-12`}
      >
        <BoardList />
        <div className="mt-auto flex flex-col gap-[30px] px-3 xl:gap-6 xl:px-6">
          <ThemeToggle />
          <div className="pl-3 xl:pl-2">
            <SidebarToggle type="hide" />
          </div>
        </div>
      </div>
      {!openSideBar && <SidebarToggle type="show" />}
    </div>
  );
};
