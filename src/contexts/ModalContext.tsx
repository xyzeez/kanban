import { createContext, useState } from "react";

// Components
import ModalWrapper from "../components/ModalWrapper";

// Types
import {
  ModalContextType,
  ModalElement,
  ModalProviderProps,
} from "../types/contexts";

// Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider
const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalElement, setModalElement] = useState<ModalElement>(null);

  return (
    <ModalContext.Provider value={{ setModalElement }}>
      {children}
      {modalElement && (
        <ModalWrapper
          modalElement={modalElement}
          clickHandler={() => setModalElement(null)}
        />
      )}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
