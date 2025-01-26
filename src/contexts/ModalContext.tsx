import { createContext, ReactNode, useState } from "react";

type ModalElement = ReactNode | null;

interface ModalContextType {
  setModalElement: (element: ReactNode) => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalElement, setModalElement] = useState<ModalElement>(null);

  return (
    <ModalContext.Provider value={{ setModalElement }}>
      {children}
      {modalElement && (
        <div
          onClick={() => setModalElement(null)}
          className="absolute inset-0 grid bg-black/50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-auto w-full max-w-[480px] rounded-md bg-white p-6"
          >
            {modalElement}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
