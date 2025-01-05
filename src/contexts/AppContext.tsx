import { createContext, useContext, useState, ReactNode } from "react";

// Types
type Theme = "light" | "dark";

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  openSideBar: boolean;
  toggleSidebarState: () => void;
}

interface AppProviderProps {
  children: ReactNode;
}

// Variables
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [openSideBar, setOpenSideBar] = useState(true);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebarState = () => {
    setOpenSideBar((prev) => !prev);
  };

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
