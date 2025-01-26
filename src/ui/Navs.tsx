import { FC } from "react";
import { NavLink } from "react-router";

// Hooks
import { useModal } from "../hooks/useModal.ts";
import { useApp } from "../hooks/useApp.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { useBoards } from "../hooks/useBoards.ts";

// Components
import {
  BoardIcon,
  DarkThemeIcon,
  HideIcon,
  LightThemeIcon,
  LogoutIcon,
  PlusIcon,
  ShowIcon,
} from "../components/Icons";

// UIs
import CreateBoardForm from "./forms/BoardForm.tsx";

// Utils
import { toSlug } from "../utils.ts";

// Types
interface BoardItemProps {
  title: string;
  to: string;
}

const BoardItem: FC<BoardItemProps> = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-btn w-full max-w-[276px] rounded-r-full px-6 py-4 capitalize xl:px-8 ${isActive ? "bg-purple text-white" : "text-grey-500"} `
    }
  >
    <BoardIcon className="size-4" />
    <span>{title}</span>
  </NavLink>
);

const CreateBoardButton: FC = () => {
  const { setModalElement } = useModal();
  const { toggleMobileNav } = useApp();

  return (
    <button
      onClick={() => {
        toggleMobileNav(false);
        setModalElement(<CreateBoardForm />);
      }}
      className="text-btn text-purple"
    >
      <PlusIcon className="size-4" />
      Create New Board
    </button>
  );
};
const BoardList: FC = () => {
  const { data: boards } = useBoards();

  return (
    <menu className="pr-3 font-sans">
      <li className="mb-5 pl-6">
        <h2 className="text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          All Boards ({boards?.length || 0})
        </h2>
      </li>
      {boards?.map((board) => (
        <li key={board.id}>
          <BoardItem title={board.name} to={toSlug(board.name)} />
        </li>
      ))}
      <li className="w-full max-w-[276px] px-6 py-4 xl:px-8">
        <CreateBoardButton />
      </li>
    </menu>
  );
};

const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-6 rounded-md bg-grey-100 py-[14px] text-grey-500 transition-colors dark:bg-grey-900">
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

export const MobileNav: FC = () => {
  const { logout } = useAuth();

  return (
    <div className="modal-shadow flex w-full max-w-[264px] flex-col gap-4 rounded-lg bg-white py-4 font-sans transition-colors dark:bg-grey-800">
      <BoardList />
      <div className="pl-4 pr-3">
        <ThemeToggle />
        <button
          onClick={logout}
          className="mt-4 flex flex-row items-center gap-[10px] text-base font-bold text-grey-500"
          aria-label="HideIcon sidebar"
        >
          <LogoutIcon className="size-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export const SideBarNav: FC = () => {
  const { openSideBar, toggleSidebar } = useApp();
  const { logout } = useAuth();

  return (
    <div className="relative">
      <div
        className={`flex h-full flex-col gap-6 overflow-hidden whitespace-nowrap border-r border-grey-100 bg-white pb-8 pt-4 font-sans transition-all dark:border-grey-700 dark:bg-grey-800 ${openSideBar ? "w-[260px] max-w-[260px] opacity-100 xl:w-[300px] xl:max-w-[300px]" : "max-w-0 border-none opacity-0"}`}
      >
        <BoardList />
        <div className="mt-auto flex flex-col gap-[30px] px-3 xl:gap-6 xl:px-6">
          <ThemeToggle />
          <div className="flex flex-col gap-4 pl-3 xl:pl-2">
            <button
              onClick={() => toggleSidebar(false)}
              className="flex flex-row items-center gap-[10px] text-base font-bold text-grey-500"
              aria-label="HideIcon sidebar"
            >
              <HideIcon className="h-4 w-[18px]" />
              <span>Hide Sidebar</span>
            </button>
            <button
              onClick={logout}
              className="flex flex-row items-center gap-[10px] text-base font-bold text-grey-500"
              aria-label="HideIcon sidebar"
            >
              <LogoutIcon className="size-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      {!openSideBar && (
        <button
          onClick={() => toggleSidebar(true)}
          className="absolute bottom-8 left-full w-14 rounded-r-full bg-purple p-5 text-white"
        >
          <ShowIcon className="h-[10px] w-4" />
        </button>
      )}
    </div>
  );
};
