import { forwardRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import { useTasks } from "../../hooks/useTasks";

// UIs
import TaskItem from "./TaskItem";

// Types
import {
  ColumnItemProps,
  DragData,
  SortableTaskListProps,
} from "../../types/board";

// Utils
import { cn } from "../../utils/styles";

const COLUMN_COLORS = [
  "bg-column-blue",
  "bg-column-purple",
  "bg-column-green",
  "bg-column-coral",
  "bg-column-teal",
  "bg-column-indigo",
  "bg-column-amber",
  "bg-column-rose",
];

const SortableTaskList = forwardRef<HTMLUListElement, SortableTaskListProps>(
  (props, ref) => <motion.ul ref={ref} layout {...props} />,
);

SortableTaskList.displayName = "SortableTaskList";

const ColumnItem = forwardRef<HTMLLIElement, ColumnItemProps>(
  ({ column, index, boardId }, ref) => {
    const { tasks, isLoading } = useTasks(boardId, column.id);
    const { setNodeRef, isOver, over } = useDroppable({
      id: column.id!,
      data: {
        type: "column",
        column,
      },
    });

    const columnColor = COLUMN_COLORS[index % COLUMN_COLORS.length];
    const taskIds = tasks?.map((task) => task.id!) || [];

    const isOverColumn =
      isOver || (over?.data.current as DragData)?.task?.columnId === column.id;

    return (
      <motion.li
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, delay: index * 0.1 }}
        className={cn(
          "flex shrink-0 grow-0 basis-[280px] flex-col",
          !tasks?.length && "sticky top-0",
        )}
      >
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 + 0.1 }}
          className="column-header-bg sticky top-0 flex flex-row items-center gap-3 py-5 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500"
        >
          <motion.span
            className={cn("block size-4 rounded-full", columnColor)}
            whileHover={{ scale: 1.2 }}
          />
          {!isLoading && (
            <span>
              {column.title} ({tasks?.length})
            </span>
          )}
        </motion.h3>
        <SortableTaskList
          ref={setNodeRef}
          className={cn(
            "flex h-full min-h-[100px] flex-col gap-[22px] p-1",
            !tasks?.length &&
              "rounded-md border-2 border-dashed border-grey-500/25",
            isOverColumn &&
              "rounded-md bg-purple/10 transition-colors duration-200",
          )}
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence mode="popLayout">
              {tasks?.map((task) =>
                column.id ? (
                  <TaskItem
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    boardId={boardId}
                  />
                ) : null,
              )}
            </AnimatePresence>
          </SortableContext>
        </SortableTaskList>
      </motion.li>
    );
  },
);

ColumnItem.displayName = "ColumnItem";

export default ColumnItem;
