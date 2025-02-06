import { FC, useState } from "react";

// Hooks
import { useBoards } from "../../hooks/useBoards";
import { useApp } from "../../hooks/useApp";
import { useTasks } from "../../hooks/useTasks";

// Components
import {
  CheckIcon,
  ChevronDownIcon,
  EllipsisIcon,
} from "../../components/Icons";

// UIs
import { EditTaskForm } from "../forms/TaskForms";
import DeleteTask from "./DeleteTask";
import ViewTaskSkeleton from "../placeholders/ViewTaskSkeleton";

const ViewTask: FC<{ taskId: string; columnId: string; boardId: string }> = ({
  taskId,
  columnId,
  boardId,
}) => {
  const [openTaskOptions, setOpenTaskOptions] = useState(false);
  const { board } = useBoards(boardId);
  const { task, isLoading } = useTasks(boardId, columnId, taskId);
  const { openModal } = useApp();

  const columns = board?.columns || [];

  if (!task || isLoading) {
    return <ViewTaskSkeleton />;
  }

  const {
    title,
    description,
    subtasks,
    doneSubtaskCount,
    columnId: taskColumnId,
  } = task;
  const selectedColumnTitle = columns.find(
    (column) => column.id === taskColumnId,
  )?.title;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="relative flex flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-black transition-colors dark:text-white">
          {title}
        </h2>
        <button onClick={() => setOpenTaskOptions(!openTaskOptions)}>
          <EllipsisIcon className="h-6 w-[6px] text-grey-500" />
        </button>
        {openTaskOptions && (
          <div className="absolute -right-4 top-[calc(100%+16px)] z-10 flex w-[calc(100%-32px)] justify-end md:-right-1/4 md:w-[calc(100%-48px)]">
            <div className="flex w-full max-w-48 flex-col gap-4 rounded-lg border-grey-500/25 bg-white p-4 shadow-lg transition-colors dark:border-grey-900 dark:bg-grey-900">
              <button
                onClick={() =>
                  openModal(
                    <EditTaskForm
                      taskId={taskId}
                      boardId={boardId}
                      columnId={columnId}
                    />,
                  )
                }
                className="text-btn text-grey-500"
              >
                Edit Task
              </button>
              <button
                onClick={() =>
                  openModal(<DeleteTask id={task.id} columnId={columnId} />)
                }
                className="text-btn text-red"
              >
                Delete Task
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-sm font-medium capitalize text-grey-500">
        {description}
      </p>
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Subtasks ({doneSubtaskCount} of {subtasks.length})
        </h3>
        <ul className="flex flex-col gap-2">
          {subtasks.map((subtask) => (
            <li key={subtask.id}>
              <label
                htmlFor={subtask.id}
                className="group flex cursor-pointer flex-row items-center gap-4 rounded bg-grey-100 pb-4 pl-3 pr-2 pt-3 text-xs font-bold capitalize text-[#000111] transition-colors hover:bg-purple/25 has-[:checked]:text-opacity-50 has-[:checked]:line-through has-[:checked]:hover:bg-grey-100 dark:bg-grey-900 dark:text-white dark:hover:bg-purple/25 dark:has-[:checked]:text-opacity-50 dark:has-[:checked]:hover:bg-grey-900"
              >
                <input
                  type="checkbox"
                  id={subtask.id}
                  className="sr-only"
                  // TODO: Add substask status toggle functionality
                  // checked={subtask.completed}
                  aria-label={subtask.title}
                />
                <span className="grid size-4 place-content-center rounded-sm border border-grey-500 bg-white transition-colors group-has-[:checked]:border-transparent group-has-[:checked]:bg-purple dark:border-white">
                  <CheckIcon className="size-3 text-transparent transition-colors group-has-[:checked]:text-white" />
                </span>
                <span>{subtask.title}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
            Current Status
          </h3>
          <details className="relative">
            <summary className="relative cursor-pointer list-none rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 ring-purple group-focus:border-transparent dark:bg-transparent">
              <span className="text-sm font-medium capitalize text-black dark:text-white">
                {selectedColumnTitle}
              </span>
              <div className="pointer-events-none absolute right-4 top-[calc(50%+3px)] size-3 -translate-y-1/2">
                <ChevronDownIcon className="text-purple" />
              </div>
            </summary>
            <fieldset className="absolute top-[calc(100%+8px)] flex w-full flex-col gap-2 rounded-lg border border-grey-500/25 bg-white p-4 shadow-sm dark:border-grey-900 dark:bg-grey-900">
              {columns.map((column) => (
                <label
                  key={columnId}
                  htmlFor={columnId}
                  className="w-fit cursor-pointer font-sans text-sm font-medium capitalize text-grey-500 has-[:checked]:text-purple"
                >
                  <input
                    type="radio"
                    id={columnId}
                    value={columnId}
                    name={columnId}
                    // TODO: Add column switch functionality
                    // onChange={() => setSelectedColumnId(column?.id)}
                    // checked={columnId === columnId}
                    className="sr-only"
                  />
                  {column.title}
                </label>
              ))}
            </fieldset>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;
