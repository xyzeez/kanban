import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Utils
import { getTheme } from "../utils";

// Types
type Theme = "light" | "dark";

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  openSideBar: boolean;
  toggleSidebarState: (state: boolean) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

// Contexts
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getTheme);
  const [openSideBar, setOpenSideBar] = useState(true);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebarState = (state: boolean) => {
    setOpenSideBar(state);
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
        toggleSidebarState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
