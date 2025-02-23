import { FC, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "react-haiku";

// Components
import { ChevronDownIcon } from "./Icons";

// Types
import { StatusDropdownProps } from "../types/components";

const StatusDropdown: FC<StatusDropdownProps> = ({
  columns,
  selectedColumnId,
  onColumnChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropDownRef, () => setIsDropdownOpen(false));

  return (
    <motion.div layout className="relative" ref={dropDownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative flex w-full cursor-pointer items-center justify-between rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-left ring-purple group-focus:border-transparent dark:bg-transparent"
      >
        <span className="text-sm font-medium capitalize text-black dark:text-white">
          {columns.find((col) => col.id === selectedColumnId)?.title}
        </span>
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          className="pointer-events-none size-4"
        >
          <ChevronDownIcon className="text-purple" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[calc(100%+8px)] z-10 flex w-full flex-col gap-2 rounded-lg border border-grey-500/25 bg-white p-4 shadow-sm dark:border-grey-900 dark:bg-grey-900"
          >
            {columns.map((column) => (
              <motion.button
                type="button"
                key={column.id}
                onClick={() => {
                  if (column.id) {
                    onColumnChange(column.id);
                    setIsDropdownOpen(false);
                  }
                }}
                whileHover={{ x: 2 }}
                className={`w-fit text-left text-sm font-medium capitalize transition-colors ${
                  column.id === selectedColumnId
                    ? "text-purple"
                    : "text-grey-500 hover:text-purple"
                }`}
              >
                {column.title}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatusDropdown;
