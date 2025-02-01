import { createContext, useState, useEffect } from "react";

// Components
import ModalWrapper from "../components/ModalWrapper";

// Types
import {
  AppContextType,
  AppProviderProps,
  ModalType,
  Theme,
} from "../types/contexts";

// Utils
import { getTheme } from "../utils";

// Initialize theme
document.documentElement.classList.add(getTheme());

// Contexts definition
const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: AppProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getTheme);
  const [openSideBar, setOpenSideBar] = useState(true);
  const [openMobileNav, setOpenMobileNav] = useState(false);
  const [openBoardOptions, setOpenBoardOptions] = useState(false);
  const [modalElement, setModalElement] = useState<ModalType | null>(null);

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

  const openModal = (element: ModalType) => {
    setModalElement(element);
  };

  const closeModal = () => {
    setModalElement(null);
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
        openModal,
        closeModal,
        modalElement,
      }}
    >
      {children}
      {modalElement && (
        <ModalWrapper modalElement={modalElement} clickHandler={closeModal} />
      )}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
