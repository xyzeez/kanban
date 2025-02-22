import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
import { ModalWrapperProps } from "../types/components";

const ModalWrapper: FC<ModalWrapperProps> = ({
  modalElement,
  clickHandler,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={clickHandler}
        className="absolute inset-0 grid overflow-y-auto overflow-x-hidden bg-black/50 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="m-auto w-full max-w-[480px] rounded-md bg-white p-6 transition-colors dark:bg-grey-800 md:p-8"
        >
          {modalElement}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWrapper;
