import { FC, useState } from "react";
import { useParams } from "react-router";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

// Hooks
import { useApp } from "../../hooks/useApp";
import { useTasks } from "../../hooks/useTasks";
import { useBoards } from "../../hooks/useBoards";

// Components
import {
  CrossIcon,
  PlusIcon,
  SpinnerIcon,
  ChevronDownIcon,
} from "../../components/Icons";

// UIs
import FormSkeleton from "../placeholders/FormSkeleton";

// Types
import { TaskFormInputs } from "../../types/forms";
import { cn } from "../../utils/styles";
import { getErrorMessage } from "../../utils/error";

const CreateTaskForm: FC = () => {
  const { boardId } = useParams<{
    boardId: string;
  }>();
  const { board, isLoading } = useBoards(boardId);
  const { closeModal } = useApp();
  const { createTask } = useTasks(boardId ?? "");
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      subtasks: [{ title: "" }],
      columnId: board?.columns[0]?.id || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const selectedColumnTitle =
    board?.columns.find((column) => column.id === watch("columnId"))?.title ||
    "";

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  if (!board || isLoading) {
    return (
      <FormSkeleton
        type="task"
        subtaskCount={1}
        showDescription={true}
        showStatus={true}
      />
    );
  }

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      if (!boardId) return;
      await createTask({ ...data, boardId });
      toast.success("Task created successfully!");
      reset();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 font-sans"
    >
      <h2 className="text-lg font-bold text-black transition-colors dark:text-white">
        Add New Task
      </h2>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="e.g Take coffee break"
          className={cn(
            "rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
            errors.title && "ring-1 ring-red",
          )}
          {...register("title", {
            required: "Task title is required",
            minLength: {
              value: 2,
              message: "Task title must be at least 2 characters long",
            },
            maxLength: {
              value: 150,
              message: "Task title cannot exceed 150 characters",
            },
          })}
        />
        {errors.title && (
          <span className="text-xs text-red">{errors.title.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Description
        </label>
        <textarea
          id="description"
          placeholder="e.g It's always good to take a break. This 15 minute break will recharge the batteries a little."
          className={cn(
            "min-h-[112px] rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
            errors.description && "ring-1 ring-red",
          )}
          {...register("description", {
            maxLength: {
              value: 500,
              message: "Task description cannot exceed 500 characters",
            },
          })}
        />
        {errors.description && (
          <span className="text-xs text-red">{errors.description.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Subtasks
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="e.g Make coffee"
                  className={cn(
                    "w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
                    errors.subtasks?.[index]?.title && "ring-1 ring-red",
                  )}
                  {...register(`subtasks.${index}.title`, {
                    required: "Subtask title is required",
                    minLength: {
                      value: 2,
                      message:
                        "Subtask title must be at least 2 characters long",
                    },
                    maxLength: {
                      value: 100,
                      message: "Subtask title cannot exceed 100 characters",
                    },
                  })}
                />
                {errors.subtasks?.[index]?.title && (
                  <span className="text-xs text-red">
                    {errors.subtasks[index]?.title?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Subtask"
              >
                <CrossIcon />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "" })}
            className="btn btn-sec btn-small text-sm font-bold"
          >
            <PlusIcon />
            Add New Subtask
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Status
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={cn(
              "relative flex w-full cursor-pointer items-center justify-between rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-left ring-purple group-focus:border-transparent dark:bg-transparent",
              errors.columnId && "ring-1 ring-red",
            )}
          >
            <span className="text-sm font-medium capitalize text-black dark:text-white">
              {selectedColumnTitle}
            </span>
            <div className="pointer-events-none size-4">
              <ChevronDownIcon className="text-purple" />
            </div>
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] z-10 flex w-full flex-col gap-2 rounded-lg border border-grey-500/25 bg-white p-4 shadow-sm dark:border-grey-900 dark:bg-grey-900">
              {board.columns.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  onClick={() => {
                    if (column.id) {
                      setValue("columnId", column.id, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setIsStatusDropdownOpen(false);
                    }
                  }}
                  className={`w-fit text-left text-sm font-medium capitalize transition-colors ${
                    watch("columnId") === column.id
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
        {errors.columnId && (
          <span className="text-xs text-red">{errors.columnId.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={
          !!errors.title ||
          !!errors.description ||
          !!errors.subtasks ||
          !!errors.columnId ||
          isSubmitting
        }
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Create Task</span>}
      </button>
    </form>
  );
};

const EditTaskForm: FC<{
  taskId: string;
  boardId: string;
  columnId: string;
}> = ({ taskId, boardId, columnId }) => {
  const {
    task,
    updateTask,
    isLoading: isTaskLoading,
  } = useTasks(boardId, columnId, taskId);
  const { board, isLoading: isBoardLoading } = useBoards(boardId);
  const { closeModal } = useApp();
  const columns = board?.columns || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
    setValue,
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      subtasks: task?.subtasks || [{ title: "" }],
      columnId: task?.columnId || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const selectedColumnTitle =
    columns.find((column) => column.id === watch("columnId"))?.title || "";

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      await updateTask({ id: taskId, ...data, boardId });
      toast.success("Task updated successfully!");
      reset();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!board || !task || isTaskLoading || isBoardLoading) {
    return (
      <FormSkeleton
        type="task"
        subtaskCount={task?.subtasks?.length || 1}
        showDescription={true}
        showStatus={true}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 font-sans"
    >
      <h2 className="text-lg font-bold text-black transition-colors dark:text-white">
        Edit Task
      </h2>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="e.g Take coffee break"
          className={cn(
            "rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
            errors.title && "ring-1 ring-red",
          )}
          {...register("title", {
            required: "Task title is required",
            minLength: {
              value: 2,
              message: "Task title must be at least 2 characters long",
            },
            maxLength: {
              value: 150,
              message: "Task title cannot exceed 150 characters",
            },
          })}
        />
        {errors.title && (
          <span className="text-xs text-red">{errors.title.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Description
        </label>
        <textarea
          id="description"
          placeholder="e.g It's always good to take a break. This 15 minute break will recharge the batteries a little."
          className={cn(
            "min-h-[112px] rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
            errors.description && "ring-1 ring-red",
          )}
          {...register("description", {
            maxLength: {
              value: 500,
              message: "Task description cannot exceed 500 characters",
            },
          })}
        />
        {errors.description && (
          <span className="text-xs text-red">{errors.description.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Subtasks
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="e.g Make coffee"
                  className={cn(
                    "w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
                    errors.subtasks?.[index]?.title && "ring-1 ring-red",
                  )}
                  {...register(`subtasks.${index}.title`, {
                    required: "Subtask title is required",
                    minLength: {
                      value: 2,
                      message:
                        "Subtask title must be at least 2 characters long",
                    },
                    maxLength: {
                      value: 100,
                      message: "Subtask title cannot exceed 100 characters",
                    },
                  })}
                />
                {errors.subtasks?.[index]?.title && (
                  <span className="text-xs text-red">
                    {errors.subtasks[index]?.title?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Subtask"
              >
                <CrossIcon />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "" })}
            className="btn btn-sec btn-small text-sm font-bold"
          >
            <PlusIcon />
            Add New Subtask
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Status
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={cn(
              "relative flex w-full cursor-pointer items-center justify-between rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-left ring-purple group-focus:border-transparent dark:bg-transparent",
              errors.columnId && "ring-1 ring-red",
            )}
          >
            <span className="text-sm font-medium capitalize text-black dark:text-white">
              {selectedColumnTitle}
            </span>
            <div className="pointer-events-none size-4">
              <ChevronDownIcon className="text-purple" />
            </div>
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] z-10 flex w-full flex-col gap-2 rounded-lg border border-grey-500/25 bg-white p-4 shadow-sm dark:border-grey-900 dark:bg-grey-900">
              {columns.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  onClick={() => {
                    if (column.id) {
                      setValue("columnId", column.id, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setIsStatusDropdownOpen(false);
                    }
                  }}
                  className={`w-fit text-left text-sm font-medium capitalize transition-colors ${
                    watch("columnId") === column.id
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
        {errors.columnId && (
          <span className="text-xs text-red">{errors.columnId.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={
          !!errors.title ||
          !!errors.description ||
          !!errors.subtasks ||
          !!errors.columnId ||
          isSubmitting
        }
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Save Changes</span>}
      </button>
    </form>
  );
};

export { CreateTaskForm, EditTaskForm };
