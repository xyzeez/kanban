import { FC } from "react";
import { motion } from "framer-motion";

// Components
import BoardList from "./components/BoardList";
import ThemeToggle from "./components/ThemeToggle";
import LogoutButton from "./components/LogoutButton";

const MobileNav: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex max-h-[calc(100dvh-102px)] w-full max-w-[264px] flex-col gap-4 rounded-lg bg-white pb-4 font-sans transition-all dark:bg-grey-800"
    >
      <BoardList />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 pl-4 pr-3"
      >
        <ThemeToggle />
        <LogoutButton />
      </motion.div>
    </motion.div>
  );
};

export default MobileNav;
