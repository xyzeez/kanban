import { FC } from "react";
import { motion } from "framer-motion";

// Components
import { PlusIcon } from "../../components/Icons";

// Types
import { EmptyStateProps } from "../../types/placeholders";

// Content
const content = {
  board: {
    message:
      "You don't have any boards yet. Click on 'Create New Board' on the navigation menu to get started.",
    action: "Create New Board",
  },
  column: {
    message: "This board is empty. Create a new column to get started.",
    action: "Add New Column",
  },
};

const EmptyState: FC<EmptyStateProps> = ({ type, actionHandler }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
      className="flex h-full flex-col items-center justify-center gap-6 p-4"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center text-lg font-bold text-grey-500"
      >
        {content[type].message}
      </motion.p>
      {actionHandler && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          onClick={actionHandler}
          className="btn btn-primary enabled:hover:bg-purple-600 btn-large"
        >
          <PlusIcon />
          {content[type].action}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
