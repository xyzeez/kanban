import { ReactNode } from "react";

export type Icon = { className: string };

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
