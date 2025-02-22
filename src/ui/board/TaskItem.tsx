import { forwardRef, FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

// Hooks
import { useApp } from "../../hooks/useApp";

// UIs
import ViewTask from "../modals/ViewTask";

// Types
import { TaskItemProps, TaskPreviewProps } from "../../types/board";

// Utils
import { cn } from "../../utils/styles";

export const TaskPreview: FC<TaskPreviewProps> = ({ task }) => (
  <motion.div
    initial={{ rotate: 0, scale: 1 }}
    animate={{ rotate: 3, scale: 1.05 }}
    transition={{ duration: 0.2 }}
    className="shadow-lg"
  >
    <div className="flex w-full cursor-grabbing flex-col gap-2 rounded-lg bg-white px-4 py-6 text-start font-sans shadow-md shadow-[#364E7E1A] transition-colors dark:bg-grey-800">
      <h4 className="text-base font-bold text-black dark:text-white">
        {task.title}
      </h4>
      <p className="text-xs font-bold text-grey-500">
        {task.doneSubtaskCount} of {task.subtasks.length} subtasks
      </p>
    </div>
  </motion.div>
);

const TaskItem = forwardRef<HTMLLIElement, TaskItemProps>(
  ({ task, columnId, boardId }, ref) => {
    const { openModal } = useApp();
    const { listeners, setNodeRef, transform, transition, isDragging } =
      useSortable({
        id: task.id!,
        data: {
          type: "task",
          task,
        },
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: !isDragging ? transition : undefined,
    };

    return (
      <motion.li
        ref={setNodeRef}
        style={style}
        {...listeners}
        layout={!isDragging}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          layout: {
            type: "spring",
            damping: 25,
            stiffness: 350,
          },
          opacity: { duration: 0.2 },
        }}
        className={cn(
          "cursor-default border-grey-500/25",
          isDragging
            ? "pointer-events-none z-10 last-of-type:pb-0"
            : "last-of-type:pb-5",
        )}
      >
        <motion.button
          onClick={() => {
            if (task.id) {
              openModal(
                <ViewTask
                  taskId={task.id}
                  columnId={columnId}
                  boardId={boardId}
                />,
              );
            }
          }}
          whileHover={isDragging ? {} : { scale: 1.02, y: -2 }}
          whileTap={isDragging ? {} : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-6 text-left font-sans shadow-md shadow-[#364E7E1A] transition-colors hover:shadow-lg dark:bg-grey-800"
          aria-label={`View task: ${task.title} with ${task.doneSubtaskCount} of ${task.subtasks.length} subtasks completed`}
        >
          <h4 className="text-base font-bold text-black dark:text-white">
            {task.title}
          </h4>
          <p className="text-xs font-bold text-grey-500">
            {task.doneSubtaskCount} of {task.subtasks.length} subtasks
          </p>
        </motion.button>
      </motion.li>
    );
  },
);

TaskItem.displayName = "TaskItem";

export default TaskItem;
