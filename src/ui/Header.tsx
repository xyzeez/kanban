import { FC, useState } from "react";

// Contexts
import { useApp } from "../contexts/AppContext";

// Components
import Logo from "../components/Logo";
import { ChevronDownIcon, EllipsisIcon, PlusIcon } from "../components/Icons";

// UIs
import { MobileNav } from "./Navs";

const Header: FC = () => {
  const [openNav, setOpenNav] = useState(false);
  const { openSideBar } = useApp();

  const toggleNavState = (state?: boolean) => {
    setOpenNav((prev) => state ?? !prev);
  };

  return (
    <header className="relative grid grid-cols-[auto_1fr] bg-white transition-colors dark:bg-grey-800">
      <div
        className={`flex items-center border-b border-grey-100 py-4 pl-4 transition-all dark:border-grey-700 md:border-r md:pl-6 md:pr-4 xl:pr-8 ${openSideBar ? "border-b-white dark:border-b-grey-800 md:w-[260px] md:max-w-[260px] xl:w-[300px] xl:max-w-[300px]" : "w-auto md:w-[210px] md:max-w-[210px]"}`}
      >
        <Logo />
      </div>
      <div className="relative flex w-full flex-row items-center justify-between border-b border-grey-100 py-4 pl-4 pr-4 transition-colors dark:border-grey-700 md:pl-6 md:pr-6 xl:pb-7 xl:pt-5">
        <div className="font-sans text-lg font-bold text-black transition-colors dark:text-white md:text-xl xl:text-2xl">
          <h1 className="hidden md:block">Platform Launch</h1>
          <button
            onClick={() => toggleNavState()}
            className="flex flex-row items-center gap-2 md:hidden"
          >
            <span>Platform Launch</span>
            <ChevronDownIcon className="h-2 w-3 text-purple" />
          </button>
          {openNav && (
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
          <button>
            <EllipsisIcon className="h-5 w-[5px] text-grey-500 transition-colors dark:text-grey-200" />
          </button>
        </div>
      </div>
      {openNav && (
        <div
          onClick={() => toggleNavState(false)}
          className="absolute inset-0 top-full h-[calc(100vh-100%)] bg-black/50 md:hidden"
        />
      )}
    </header>
  );
};

export default Header;
