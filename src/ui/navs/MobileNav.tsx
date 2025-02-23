import { FC } from "react";
import { motion } from "framer-motion";

// Hooks
import { useApp } from "../../hooks/useApp";

// Components
import BoardList from "./components/BoardList";
import ThemeToggle from "./components/ThemeToggle";
import LogoutButton from "./components/LogoutButton";

const MobileNav: FC = () => {
  const { toggleMobileNav } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex max-h-[calc(100dvh-102px)] w-full max-w-[264px] flex-col gap-4 rounded-lg bg-white pb-4 font-sans transition-all dark:bg-grey-800"
    >
      <BoardList onNavigate={() => toggleMobileNav(false)} />
      <div className="flex flex-col gap-4 pl-4 pr-3">
        <ThemeToggle onToggle={() => toggleMobileNav(false)} />
        <LogoutButton />
      </div>
    </motion.div>
  );
};

export default MobileNav;
