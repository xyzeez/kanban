import { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Types
import { Task } from "../../types/task";
import { TaskItemProps } from "../../types/board";
import ViewTask from "../modals/ViewTask";

// Hooks
import { useApp } from "../../hooks/useApp";
import { cn } from "../../utils/styles";

export const TaskPreview: FC<{ task: Task }> = ({ task }) => (
  <div className="rotate-3 scale-105">
    <div className="flex w-full cursor-grabbing flex-col gap-2 rounded-lg bg-white px-4 py-6 text-start font-sans shadow-md shadow-[#364E7E1A] transition-colors dark:bg-grey-800">
      <h4 className="text-base font-bold text-black dark:text-white">
        {task.title}
      </h4>
      <p className="text-xs font-bold text-grey-500">
        {task.doneSubtaskCount} of {task.subtasks.length} subtasks
      </p>
    </div>
  </div>
);

const TaskItem: FC<TaskItemProps> = ({ task, columnId, boardId }) => {
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
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...listeners}
      className={cn(
        "cursor-default border-grey-500/25",
        isDragging ? "last-of-type:pb-0" : "last-of-type:pb-5",
      )}
    >
      <button
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
        className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-6 text-left font-sans shadow-md shadow-[#364E7E1A] transition-colors dark:bg-grey-800"
        aria-label={`View task: ${task.title} with ${task.doneSubtaskCount} of ${task.subtasks.length} subtasks completed`}
      >
        <h4 className="text-base font-bold text-black dark:text-white">
          {task.title}
        </h4>
        <p className="text-xs font-bold text-grey-500">
          {task.doneSubtaskCount} of {task.subtasks.length} subtasks
        </p>
      </button>
    </li>
  );
};

export default TaskItem;
