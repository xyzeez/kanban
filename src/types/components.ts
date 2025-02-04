import { ReactNode } from "react";

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
