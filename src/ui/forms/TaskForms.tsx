import { FC } from "react";
import { useParams } from "react-router";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

// Components
import {
  CrossIcon,
  PlusIcon,
  SpinnerIcon,
  ChevronDownIcon,
} from "../../components/Icons";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useBoards } from "../../hooks/useBoards";
import { useTasks } from "../../hooks/useTasks";

// Types
import { TaskFormInputs } from "../../types/forms";

const CreateTaskForm: FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { board } = useBoards(boardId);
  const { createTask } = useTasks(board?.id ?? "");
  const { setModalElement } = useModal();

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

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    try {
      if (board?.id) {
        await createTask({ ...data, boardId: board.id });
      }
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      setModalElement(null);
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
                <CrossIcon className="size-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "" })}
            className="btn btn-sec btn-small text-sm font-bold"
          >
            <PlusIcon className="size-3" />
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
            {board?.columns.map((column) => (
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

export { CreateTaskForm };
