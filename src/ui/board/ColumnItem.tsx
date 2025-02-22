import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Hooks
import { useTasks } from "../../hooks/useTasks";

// UIs
import TaskItem from "./TaskItem";

// Types
import { ColumnItemProps, DragData } from "../../types/board";

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

const ColumnItem: FC<ColumnItemProps> = ({ column, index, boardId }) => {
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
    <li
      className={cn(
        "flex shrink-0 grow-0 basis-[280px] flex-col",
        !tasks?.length && "sticky top-0",
      )}
    >
      <h3 className="column-header-bg sticky top-0 flex flex-row items-center gap-3 py-5 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
        <span className={cn("block size-4 rounded-full", columnColor)} />
        {!isLoading && (
          <span>
            {column.title} ({tasks?.length})
          </span>
        )}
      </h3>
      <ul
        ref={setNodeRef}
        className={cn(
          "flex h-full min-h-[100px] flex-col gap-[22px] border-grey-500/25 p-1 transition-colors",
          !tasks?.length && "rounded-md border-2 border-dashed",
          isOverColumn && "rounded-md bg-purple/10",
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      </ul>
    </li>
  );
};

export default ColumnItem;
