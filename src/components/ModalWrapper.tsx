import { FC } from "react";

// Types
import { ModalWrapperProps } from "../types/components";

const ModalWrapper: FC<ModalWrapperProps> = ({
  modalElement,
  clickHandler,
}) => {
  return (
    <div
      onClick={clickHandler}
      className="absolute inset-0 grid overflow-y-auto overflow-x-hidden bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="m-auto w-full max-w-[480px] rounded-md bg-white p-6 transition-colors dark:bg-grey-800 md:p-8"
      >
        {modalElement}
      </div>
    </div>
  );
};

export default ModalWrapper;
