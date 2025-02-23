import { FC } from "react";
import { motion } from "framer-motion";

// Hooks
import { useApp } from "../../../hooks/useApp";

// Components
import { DarkThemeIcon, LightThemeIcon } from "../../../components/Icons";

// Types
import { ThemeToggleProps } from "../../../types/navs";

const ThemeToggle: FC<ThemeToggleProps> = ({ onToggle }) => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "dark";

  const handleToggle = (targetTheme: "light" | "dark") => {
    if (targetTheme !== theme) {
      toggleTheme();
      onToggle?.();
    }
  };

  return (
    <div className="flex w-full flex-row items-center justify-center gap-6 rounded-md bg-grey-100 py-[14px] text-grey-500 transition-colors dark:bg-grey-900">
      <motion.button
        onClick={() => handleToggle("light")}
        className="appearance-none border-none bg-transparent p-0"
        aria-label="Switch to light theme"
        initial={false}
        animate={{
          scale: isDark ? 0.8 : 1,
          rotate: isDark ? -15 : 0,
          opacity: isDark ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <LightThemeIcon />
      </motion.button>
      <div className="relative h-5 w-10 rounded-full bg-purple">
        <motion.div
          initial={false}
          className="absolute top-[3px] size-[14px] rounded-full bg-white"
          animate={{
            left: isDark ? "23px" : "3px",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        />
        <button
          onClick={() => handleToggle(isDark ? "light" : "dark")}
          className="absolute inset-0"
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        />
      </div>
      <motion.button
        onClick={() => handleToggle("dark")}
        className="appearance-none border-none bg-transparent p-0"
        aria-label="Switch to dark theme"
        initial={false}
        animate={{
          scale: isDark ? 1 : 0.8,
          rotate: isDark ? 0 : 15,
          opacity: isDark ? 1 : 0.5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <DarkThemeIcon />
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
