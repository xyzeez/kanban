import { FC, useState, useEffect } from "react";

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
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(columnId);
  const { board } = useBoards(boardId);
  const {
    task,
    isLoading,
    updateSubtasks,
    subtasksByTaskId,
    updateTask,
    updateTaskColumn,
  } = useTasks(boardId, columnId, taskId);
  const { openModal } = useApp();

  useEffect(() => {
    if (task) {
      setSelectedColumnId(task.columnId);
    }
  }, [task]);

  const columns = board?.columns || [];

  if (!task || isLoading) {
    return <ViewTaskSkeleton />;
  }

  const {
    title,
    description,
    subtasks: initialSubtasks,
    columnId: taskColumnId,
  } = task;

  const subtasks = subtasksByTaskId[taskId] || initialSubtasks;

  const handleSubtaskToggle = (index: number) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = {
      ...newSubtasks[index],
      completed: !newSubtasks[index].completed,
    };
    updateSubtasks(taskId, newSubtasks);
  };

  const handleColumnChange = (newColumnId: string) => {
    if (!task || !task.id || newColumnId === task.columnId) return;
    setSelectedColumnId(newColumnId);
    updateTaskColumn(task.id, newColumnId);
  };

  const doneSubtaskCount = subtasks.filter(
    (subtask) => subtask.completed,
  ).length;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="relative flex flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-bold capitalize text-black transition-colors dark:text-white">
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
                onClick={() => {
                  if (task.id) {
                    openModal(<DeleteTask id={task.id} columnId={columnId} />);
                  }
                }}
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
          {subtasks.map((subtask, index) => (
            <li key={index}>
              <label
                htmlFor={`subtask-${index}`}
                className="group flex cursor-pointer flex-row items-center gap-4 rounded bg-grey-100 pb-4 pl-3 pr-2 pt-3 text-xs font-bold capitalize text-[#000111] transition-colors hover:bg-purple/25 has-[:checked]:text-opacity-50 has-[:checked]:line-through has-[:checked]:hover:bg-grey-100 dark:bg-grey-900 dark:text-white dark:hover:bg-purple/25 dark:has-[:checked]:text-opacity-50 dark:has-[:checked]:hover:bg-grey-900"
              >
                <input
                  type="checkbox"
                  id={`subtask-${index}`}
                  className="sr-only"
                  onChange={() => handleSubtaskToggle(index)}
                  checked={subtask.completed}
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
          <div className="relative">
            <button
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="relative flex w-full cursor-pointer items-center justify-between rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-left ring-purple group-focus:border-transparent dark:bg-transparent"
            >
              <span className="text-sm font-medium capitalize text-black dark:text-white">
                {columns.find((col) => col.id === selectedColumnId)?.title}
              </span>
              <div className="pointer-events-none size-4">
                <ChevronDownIcon className="text-purple" />
              </div>
            </button>

            {isColumnDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] z-10 flex w-full flex-col gap-2 rounded-lg border border-grey-500/25 bg-white p-4 shadow-sm dark:border-grey-900 dark:bg-grey-900">
                {columns.map((column) => (
                  <button
                    key={column.id}
                    onClick={() => {
                      if (column.id) {
                        handleColumnChange(column.id);
                        setIsColumnDropdownOpen(false);
                      }
                    }}
                    className={`w-fit text-left text-sm font-medium capitalize transition-colors ${
                      column.id === selectedColumnId
                        ? "text-purple"
                        : "text-grey-500 hover:text-purple"
                    }`}
                  >
                    {column.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;
