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
    <header className="relative grid grid-cols-[auto_1fr] bg-white px-4 md:px-6">
      <div
        className={`flex items-center border-b border-grey-100 py-4 md:border-r md:pr-4 xl:pr-8 ${openSideBar ? "md:w-[236px] md:border-b-0 xl:w-[276px]" : "w-auto"}`}
      >
        <Logo />
      </div>
      <div className="relative flex w-full flex-row items-center justify-between border-b border-grey-100 py-4 pl-4 md:pl-6 xl:pb-7 xl:pt-5">
        <div className="font-sans text-lg font-bold text-black md:text-xl xl:text-2xl">
          <h1 className="hidden md:block">Platform Launch</h1>
          <button
            onClick={() => toggleNavState()}
            className="flex flex-row items-center gap-2 md:hidden"
          >
            <span>Platform Launch</span>
            <ChevronDownIcon className="h-2 w-3 text-purple" />
          </button>
          {openNav && (
            <div className="absolute top-[calc(100%+16px)] z-10 w-full">
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
            <EllipsisIcon className="h-5 w-[5px] text-grey-500" />
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
