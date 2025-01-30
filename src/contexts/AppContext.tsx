import { createContext, useState, useEffect } from "react";

// Utils
import { getTheme } from "../utils";

// Types
import { AppContextType, AppProviderProps, Theme } from "../types/contexts";

// Initialize theme
document.documentElement.classList.add(getTheme());

// Contexts
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getTheme);
  const [openSideBar, setOpenSideBar] = useState(true);
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const [openBoardOptions, setOpenBoardOptions] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebar = (state: boolean) => {
    setOpenSideBar(state);
  };

  const toggleMobileNav = (state?: boolean) => {
    setOpenMobileNav((prev) => state ?? !prev);
  };

  const toggleBoardOptions = (state?: boolean) => {
    setOpenBoardOptions((prev) => state ?? !prev);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        openSideBar,
        toggleSidebar,
        openMobileNav,
        toggleMobileNav,
        openBoardOptions,
        toggleBoardOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
