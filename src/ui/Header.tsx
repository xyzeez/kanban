import { FC } from "react";
import { useLocation } from "react-router";

// Hooks
import { useApp } from "../hooks/useApp";

// Components
import Logo from "../components/Logo";
import { ChevronDownIcon, EllipsisIcon, PlusIcon } from "../components/Icons";

// UIs
import { MobileNav } from "./Navs";
import DeleteBoard from "./modals/DeleteBoard";
import { useModal } from "../hooks/useModal";

const Header: FC = () => {
  const {
    openSideBar,
    openMobileNav,
    toggleMobileNav,
    openBoardOptions,
    toggleBoardOptions,
  } = useApp();
  const { setModalElement } = useModal();

  const location = useLocation();

  const currentPath =
    location.pathname === "/"
      ? ""
      : location.pathname.split("/").pop()?.replace(/-/g, " ") || "";

  return (
    <header className="relative grid grid-cols-[auto_1fr] bg-white transition-colors dark:bg-grey-800">
      <div
        className={`flex items-center border-b border-grey-100 py-4 pl-4 transition-all dark:border-grey-700 md:border-r md:pl-6 md:pr-4 xl:pr-8 ${openSideBar ? "border-b-white dark:border-b-grey-800 md:w-[260px] md:max-w-[260px] xl:w-[300px] xl:max-w-[300px]" : "w-auto md:w-[210px] md:max-w-[210px]"}`}
      >
        <Logo />
      </div>
      <div className="relative flex w-full flex-row items-center justify-between border-b border-grey-100 py-4 pl-4 pr-4 transition-colors dark:border-grey-700 md:pl-6 md:pr-6 xl:pb-7 xl:pt-5">
        <div className="font-sans text-lg font-bold text-black transition-colors dark:text-white md:text-xl xl:text-2xl">
          <h1 className="hidden capitalize md:block">{currentPath}</h1>
          <button
            onClick={() => toggleMobileNav()}
            className="flex flex-row items-center gap-2 md:hidden"
          >
            {currentPath && <span className="capitalize">{currentPath}</span>}
            <ChevronDownIcon className="h-2 w-3 text-purple" />
          </button>

          {openMobileNav && (
            <div className="absolute left-0 top-[calc(100%+16px)] z-10 w-full">
              <MobileNav />
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-4 md:gap-6">
          <button className="icon-btn btn-primary btn-large md:hidden">
            <PlusIcon className="size-3" />
          </button>
          <button className="btn btn-primary btn-large hidden md:flex">
            <PlusIcon className="size-3" />
            Add New Task
          </button>
          <button onClick={() => toggleBoardOptions()}>
            <EllipsisIcon className="h-5 w-[5px] text-grey-500 transition-colors dark:text-grey-200" />
          </button>
          {openBoardOptions && (
            <div className="absolute right-1 top-[calc(100%+16px)] z-10 flex w-[calc(100%-32px)] justify-end md:right-3 md:w-[calc(100%-48px)]">
              <div className="flex w-full max-w-48 flex-col gap-4 rounded-lg bg-white p-4 shadow-lg transition-colors dark:bg-grey-800">
                <button className="text-btn text-grey-500">Edit Board</button>
                <button
                  onClick={() => {
                    setModalElement(<DeleteBoard />);
                    toggleBoardOptions(false);
                  }}
                  className="text-btn text-red"
                >
                  Delete Board
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {openMobileNav && (
        <div
          onClick={() => toggleMobileNav(false)}
          className="absolute inset-0 top-full h-[calc(100vh-100%)] bg-black/50 md:hidden"
        />
      )}
    </header>
  );
};

export default Header;
