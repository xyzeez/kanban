import { ReactNode } from "react";

// Types
import { Column } from "./board";

export interface Icon {
  className?: string;
  viewBox?: string;
  children?: ReactNode;
}

export type LogoProps = {
  full?: boolean;
};

export interface ModalWrapperProps {
  modalElement: ReactNode;
  clickHandler: () => void;
}

export interface SkeletonProps {
  className?: string;
}

export interface StatusDropdownProps {
  columns: Column[];
  selectedColumnId: string;
  onColumnChange: (columnId: string) => void;
}
