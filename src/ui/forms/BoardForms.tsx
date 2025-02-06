import { FC } from "react";
import { useNavigate, useParams } from "react-router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Hooks
import { useApp } from "../../hooks/useApp";
import { useBoards } from "../../hooks/useBoards";

// Components
import { CrossIcon, PlusIcon, SpinnerIcon } from "../../components/Icons";
import FormSkeleton from "../placeholders/FormSkeleton";

// Types
import { BoardFormInputs } from "../../types/forms";

// Utils
import { cn } from "../../utils/styles";
import { getErrorMessage } from "../../utils/error";

const CreateBoardForm: FC = () => {
  const navigate = useNavigate();
  const { createBoard } = useBoards();
  const { closeModal } = useApp();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: "",
      columns: [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const validateColumnUniqueness = (value: string, index: number) => {
    const columns = getValues("columns");
    const duplicateCount = columns.filter(
      (col, idx) =>
        idx !== index && col.title.toLowerCase() === value.toLowerCase(),
    ).length;
    return duplicateCount === 0 || "Column names must be unique";
  };

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      const board = await createBoard(data);
      toast.success("Board created successfully!");
      reset();
      closeModal();
      void navigate(`boards/${board?.slug}`);
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
        Add New Board
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Board Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g Web Design"
          className={cn(
            "rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
            errors.name && "ring-1 ring-red",
          )}
          {...register("name", {
            required: "Board name is required",
            minLength: {
              value: 3,
              message: "Board name must be at least 3 characters long",
            },
            maxLength: {
              value: 50,
              message: "Board name cannot exceed 50 characters",
            },
          })}
        />
        {errors.name && (
          <span className="text-xs text-red">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="columns"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Board Columns
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="e.g Todo"
                  className={cn(
                    "w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
                    errors.columns?.[index]?.title && "ring-1 ring-red",
                  )}
                  {...register(`columns.${index}.title`, {
                    required: "Column title is required",
                    minLength: {
                      value: 3,
                      message:
                        "Column title must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Column title cannot exceed 50 characters",
                    },
                    validate: (value) => validateColumnUniqueness(value, index),
                  })}
                />
                {errors.columns?.[index]?.title && (
                  <span className="text-xs text-red">
                    {errors.columns[index]?.title?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Column"
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
            Add New Column
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!!errors.name || !!errors.columns || isSubmitting}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Create New Board</span>}
      </button>
    </form>
  );
};

const EditBoardForm: FC = () => {
  const { boardId } = useParams<{
    boardId: string;
  }>();
  const { board, isLoading, updateBoard } = useBoards(boardId);
  const { closeModal } = useApp();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: board?.name || "",
      columns: board?.columns || [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const validateColumnUniqueness = (value: string, index: number) => {
    const columns = getValues("columns");
    const duplicateCount = columns.filter(
      (col, idx) =>
        idx !== index && col.title.toLowerCase() === value.toLowerCase(),
    ).length;
    return duplicateCount === 0 || "Column names must be unique";
  };

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      await updateBoard({ id: boardId, ...data });
      toast.success("Board updated successfully!");
      reset();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!board || isLoading)
    return (
      <FormSkeleton type="board" columnCount={board?.columns.length || 3} />
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 font-sans"
    >
      <h2 className="text-lg font-bold text-black transition-colors dark:text-white">
        Edit Board
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Board Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g Web Design"
          className={cn(
            "rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
            errors.name && "ring-1 ring-red",
          )}
          {...register("name", {
            required: "Board name is required",
            minLength: {
              value: 3,
              message: "Board name must be at least 3 characters long",
            },
            maxLength: {
              value: 50,
              message: "Board name cannot exceed 50 characters",
            },
          })}
        />
        {errors.name && (
          <span className="text-xs text-red">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="columns"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Board Columns
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="e.g Todo"
                  className={cn(
                    "w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
                    errors.columns?.[index]?.title && "ring-1 ring-red",
                  )}
                  {...register(`columns.${index}.title`, {
                    required: "Column title is required",
                    minLength: {
                      value: 3,
                      message:
                        "Column title must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Column title cannot exceed 50 characters",
                    },
                    validate: (value) => validateColumnUniqueness(value, index),
                  })}
                />
                {errors.columns?.[index]?.title && (
                  <span className="text-xs text-red">
                    {errors.columns[index]?.title?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Column"
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
            Add New Column
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!!errors.name || !!errors.columns || isSubmitting}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Save Changes</span>}
      </button>
    </form>
  );
};

const AddColumnForm: FC = () => {
  const { boardId } = useParams<{
    boardId: string;
  }>();
  const { board, isLoading, addColumns } = useBoards(boardId);
  const { closeModal } = useApp();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
    getValues,
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: "",
      columns: [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const validateColumnUniqueness = (value: string, index: number) => {
    const columns = getValues("columns");
    const existingColumns = board?.columns || [];

    // Check for duplicates in new columns
    const newColumnDuplicates = columns.filter(
      (col, idx) =>
        idx !== index && col.title.toLowerCase() === value.toLowerCase(),
    ).length;

    // Check for duplicates in existing columns
    const existingColumnDuplicates = existingColumns.filter(
      (col) => col.title.toLowerCase() === value.toLowerCase(),
    ).length;

    return (
      (newColumnDuplicates === 0 && existingColumnDuplicates === 0) ||
      "Column names must be unique"
    );
  };

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      if (!boardId) return;
      await addColumns({ id: boardId, columns: data.columns });
      toast.success("Columns added successfully!");
      reset();
      closeModal();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) return <FormSkeleton type="column" />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 font-sans"
    >
      <h2 className="text-lg font-bold text-black transition-colors dark:text-white">
        Add New Column
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Board Name
        </label>
        <input
          type="text"
          id="name"
          value={board?.name}
          className={cn(
            "rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:placeholder:text-white/25 dark:disabled:text-opacity-25",
            errors.name && "ring-1 ring-red",
          )}
          disabled
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="columns"
          className="text-xs font-bold text-grey-500 transition-colors dark:text-white"
        >
          Board Columns
        </label>
        <div className="flex flex-col gap-3">
          {board?.columns.map((column, index) => (
            <div
              key={`existing-${index}`}
              className="flex flex-row items-center gap-4"
            >
              <input
                type="text"
                value={column.title}
                disabled
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:disabled:text-opacity-25"
              />
            </div>
          ))}

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="e.g Todo"
                  className={cn(
                    "w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25",
                    errors.columns?.[index]?.title && "ring-1 ring-red",
                  )}
                  {...register(`columns.${index}.title`, {
                    required: "Column title is required",
                    minLength: {
                      value: 3,
                      message:
                        "Column title must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Column title cannot exceed 50 characters",
                    },
                    validate: (value) => validateColumnUniqueness(value, index),
                  })}
                  autoFocus={index === 0}
                />
                {errors.columns?.[index]?.title && (
                  <span className="text-xs text-red">
                    {errors.columns[index]?.title?.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Column"
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
            Add New Column
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={
          !!errors.name ||
          Object.keys(errors.columns || {}).length > 0 ||
          isSubmitting
        }
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Add Columns</span>}
      </button>
    </form>
  );
};

export { CreateBoardForm, EditBoardForm, AddColumnForm };
