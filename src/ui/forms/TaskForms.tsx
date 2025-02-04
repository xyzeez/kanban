import { FC } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

// Components
import {
  CrossIcon,
  PlusIcon,
  SpinnerIcon,
  ChevronDownIcon,
} from "../../components/Icons";

// Hooks
import { useApp } from "../../hooks/useApp";
import { useTasks } from "../../hooks/useTasks";
import { useBoards } from "../../hooks/useBoards";

// Types
import { TaskFormInputs } from "../../types/forms";
import { Board } from "../../types/board";
import { Task } from "../../types/task";

const CreateTaskForm: FC<{ boardData: Board }> = ({ boardData }) => {
  const { id, columns } = boardData;
  const { closeModal } = useApp();
  const { createTask } = useTasks(id);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      subtasks: [{ title: "" }],
      columnId: columns[0]?.id || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const selectedColumnTitle =
    columns.find((column) => column.id === watch("columnId"))?.title || "";

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      await createTask({ ...data, boardId: id });
      reset();
      closeModal();
    } catch (error) {
      console.error("Creating task failed");
      console.error(error);
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
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
          {...register("title", { required: true })}
        />
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
          className="min-h-[112px] rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
          {...register("description")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Subtasks
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <input
                type="text"
                placeholder="e.g Make coffee"
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
                {...register(`subtasks.${index}.title`, { required: true })}
              />
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
                key={column.id}
                htmlFor={column.id}
                className="w-fit cursor-pointer font-sans text-sm font-medium capitalize text-grey-500 has-[:checked]:text-purple"
              >
                <input
                  type="radio"
                  id={column.id}
                  value={column.id}
                  checked={watch("columnId") === column.id}
                  className="sr-only"
                  {...register("columnId", { required: true })}
                />
                {column.title}
              </label>
            ))}
          </fieldset>
        </details>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Create Task</span>}
      </button>
    </form>
  );
};

const EditTaskForm: FC<{ taskData: Task }> = ({ taskData }) => {
  const { id, title, description, subtasks, columnId, boardId } = taskData;
  const { updateTask } = useTasks(boardId, columnId);
  const { board } = useBoards(boardId);
  const { closeModal } = useApp();
  const columns = board?.columns || [];
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<TaskFormInputs>({
    defaultValues: {
      title: title || "",
      description: description || "",
      subtasks: subtasks || [{ title: "" }],
      columnId: columnId || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const selectedColumnTitle =
    columns.find((column) => column.id === watch("columnId"))?.title || "";

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      const { title, description, subtasks, columnId } = data;
      await updateTask({ id, title, description, boardId, subtasks, columnId });
      reset();
      closeModal();
    } catch (error) {
      console.error("Editing task failed");
      console.error(error);
    }
  };

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
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
          {...register("title", { required: true })}
        />
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
          className="min-h-[112px] rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
          {...register("description")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-grey-500 transition-colors dark:text-white">
          Subtasks
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <input
                type="text"
                placeholder="e.g Make coffee"
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
                {...register(`subtasks.${index}.title`, { required: true })}
              />
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
                key={column.id}
                htmlFor={column.id}
                className="w-fit cursor-pointer font-sans text-sm font-medium capitalize text-grey-500 has-[:checked]:text-purple"
              >
                <input
                  type="radio"
                  id={column.id}
                  value={column.id}
                  checked={watch("columnId") === column.id}
                  className="sr-only"
                  {...register("columnId", { required: true })}
                />
                {column.title}
              </label>
            ))}
          </fieldset>
        </details>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Save Changes</span>}
      </button>
    </form>
  );
};

export { CreateTaskForm, EditTaskForm };
