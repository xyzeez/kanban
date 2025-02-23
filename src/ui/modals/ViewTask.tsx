import { FC, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Hooks
import { useBoards } from "../../hooks/useBoards";
import { useApp } from "../../hooks/useApp";
import { useTasks } from "../../hooks/useTasks";

// Components
import { CheckIcon, EllipsisIcon } from "../../components/Icons";
import StatusDropdown from "../../components/StatusDropdown";

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
  const [selectedColumnId, setSelectedColumnId] = useState(columnId);
  const { board } = useBoards(boardId);
  const {
    task,
    isLoading,
    updateSubtasks,
    subtasksByTaskId,
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

  const { title, description, subtasks: initialSubtasks } = task;

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

    const updateAllowed = updateTaskColumn(task.id, newColumnId);
    if (!updateAllowed) {
      toast.error(
        `A task with name "${task.title}" already exists in this column`,
      );
      return;
    }

    setSelectedColumnId(newColumnId);
  };

  const doneSubtaskCount = subtasks.filter(
    (subtask) => subtask.completed,
  ).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6 font-sans"
    >
      <motion.div
        layout
        className="relative flex flex-row items-center justify-between gap-4"
      >
        <motion.h2
          layout
          className="text-lg font-bold capitalize text-black transition-colors dark:text-white"
        >
          {title}
        </motion.h2>
        <motion.button
          layout
          onClick={() => setOpenTaskOptions(!openTaskOptions)}
        >
          <EllipsisIcon className="h-6 w-[6px] text-grey-500" />
        </motion.button>
        <AnimatePresence>
          {openTaskOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -right-4 top-[calc(100%+16px)] z-10 flex w-[calc(100%-32px)] justify-end md:-right-1/4 md:w-[calc(100%-48px)]"
            >
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
                      openModal(
                        <DeleteTask id={task.id} columnId={columnId} />,
                      );
                    }
                  }}
                  className="text-btn text-red"
                >
                  Delete Task
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.p layout className="text-sm font-medium capitalize text-grey-500">
        {description}
      </motion.p>
      <motion.div layout className="flex flex-col gap-4">
        <motion.h3
          layout
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Subtasks ({doneSubtaskCount} of {subtasks.length})
        </motion.h3>
        <motion.ul layout className="flex flex-col gap-2">
          {subtasks.map((subtask, index) => (
            <motion.li
              layout
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
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
            </motion.li>
          ))}
        </motion.ul>
        <motion.div layout className="flex flex-col gap-2">
          <motion.h3
            layout
            className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
          >
            Current Status
          </motion.h3>
          <StatusDropdown
            columns={columns}
            selectedColumnId={selectedColumnId}
            onColumnChange={handleColumnChange}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ViewTask;
