import { FC } from "react";
import { motion } from "framer-motion";

// Components
import Skeleton from "../../components/Skeleton";

const ViewTaskSkeleton: FC = () => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6 font-sans text-grey-500/50"
    >
      {/* Title */}
      <motion.div layout className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-6" />
      </motion.div>

      {/* Description */}
      <motion.div layout>
        <Skeleton className="h-16 w-full" />
      </motion.div>

      {/* Subtasks */}
      <motion.div layout className="flex flex-col gap-4">
        <motion.div layout>
          <Skeleton className="h-4 w-32" />
        </motion.div>
        <motion.div layout className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-10 w-full rounded-[4px]" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Status */}
      <motion.div layout className="flex flex-col gap-2">
        <motion.div layout>
          <Skeleton className="h-4 w-24" />
        </motion.div>
        <motion.div layout>
          <Skeleton className="h-10 w-full rounded-[4px]" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ViewTaskSkeleton;
