import { FC } from "react";
import { NavLink } from "react-router";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

// Hooks
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
import { CreateBoardForm } from "./forms/BoardForms.tsx";

// Types
import { BoardItemProps } from "../types/navs.ts";

// Utils
import { getErrorMessage } from "../utils/error";

const BoardItem: FC<BoardItemProps> = ({ title, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-btn w-full max-w-[276px] rounded-r-full px-6 py-4 font-bold capitalize transition-colors xl:px-8 ${isActive ? "bg-purple text-white" : "text-grey-500 enabled:hover:bg-purple-light/10 enabled:hover:text-purple"} `
    }
  >
    <BoardIcon />
    <span>{title}</span>
  </NavLink>
);

const CreateBoardButton: FC = () => {
  const { openModal } = useApp();
  const { toggleMobileNav } = useApp();

  return (
    <button
      onClick={() => {
        toggleMobileNav(false);
        openModal(<CreateBoardForm />);
      }}
      className="text-btn font-bold text-purple"
    >
      <PlusIcon />
      Create New Board
    </button>
  );
};

const BoardList: FC = () => {
  const { boards } = useBoards();

  return (
    <menu className="hover-scrollbar relative overflow-y-auto overflow-x-hidden pr-3 font-sans">
      <li className="nav-header-bg sticky top-0 py-4 pl-6">
        <h2 className="text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          All Boards ({boards?.length || 0})
        </h2>
      </li>
      {boards?.map((board) => (
        <li key={board.id}>
          <BoardItem title={board.name} to={`/boards/${board.slug}`} />
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
      <LightThemeIcon />
      <button
        onClick={toggleTheme}
        className={`relative h-5 w-10 rounded-full bg-purple after:absolute after:top-[3px] after:size-[14px] after:rounded-full after:bg-white after:transition-all after:duration-200 ${
          theme === "dark" ? "after:left-[23px]" : "after:left-[3px]"
        }`}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      />
      <DarkThemeIcon />
    </div>
  );
};

const LogoutButton: FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out!");
      void navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-fit flex-row items-center gap-[10px] font-sans text-base font-bold text-red"
      aria-label="Logout"
    >
      <LogoutIcon className="size-5" />
      <span>Logout</span>
    </button>
  );
};

const ToggleSidebarButton: FC = () => {
  const { openSideBar, toggleSidebar } = useApp();

  return (
    <button
      onClick={() => toggleSidebar(!openSideBar)}
      className={`fixed left-0 grid h-12 grid-cols-[24px_auto] items-center gap-3 rounded-r-full px-6 font-sans text-base font-bold capitalize transition-all enabled:hover:bg-purple enabled:hover:text-white xl:px-8 ${openSideBar ? "w-[248px] max-w-[248px] bg-transparent text-grey-500 xl:w-[275px] xl:max-w-[275px]" : "w-14 max-w-14 bg-purple pl-[18px] pr-[22px] text-white xl:w-14 xl:max-w-14 xl:pl-[18px] xl:pr-[22px]"}`}
      aria-label={openSideBar ? "Hide Sidebar" : "Show Sidebar"}
    >
      <HideIcon
        className={`col-start-1 col-end-2 row-start-1 row-end-2 size-5 transition-all ${openSideBar ? "opacity-100" : "opacity-0"}`}
      />
      <ShowIcon
        className={`col-start-1 col-end-2 row-start-1 row-end-2 size-5 transition-all ${openSideBar ? "opacity-0" : "opacity-100"}`}
      />
      <span
        className={`${openSideBar ? "w-[9ch]" : "w-[0]"} overflow-hidden whitespace-nowrap`}
      >
        Hide Sidebar
      </span>
    </button>
  );
};

export const MobileNav: FC = () => {
  return (
    <div className="flex max-h-[calc(100vh-102px)] w-full max-w-[264px] flex-col gap-4 rounded-lg bg-white pb-4 font-sans transition-colors dark:bg-grey-800">
      <BoardList />
      <div className="flex flex-col gap-4 pl-4 pr-3">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  );
};

export const SideBarNav: FC = () => {
  const { openSideBar } = useApp();

  return (
    <div className="relative grid">
      <div
        className={`grid max-h-[calc(100vh-81px)] grid-rows-[1fr_auto] gap-6 overflow-hidden whitespace-nowrap border-r border-grey-100 bg-white pb-4 transition-all dark:border-grey-700 dark:bg-grey-800 xl:max-h-[calc(100vh-97px)] ${openSideBar ? "w-[260px] max-w-[260px] xl:w-[300px] xl:max-w-[300px]" : "w-0 max-w-0 border-none"}`}
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
