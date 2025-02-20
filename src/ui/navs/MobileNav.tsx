import { FC } from "react";

// Components
import BoardList from "./components/BoardList";
import ThemeToggle from "./components/ThemeToggle";
import LogoutButton from "./components/LogoutButton";

const MobileNav: FC = () => {
  return (
    <div className="flex max-h-[calc(100vh-102px)] min-h-[338px] w-full max-w-[264px] flex-col gap-4 rounded-lg bg-white pb-4 font-sans transition-colors dark:bg-grey-800">
      <BoardList />
      <div className="flex flex-col gap-4 pl-4 pr-3">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  );
};

export default MobileNav;
