import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

// Components
import { CrossIcon, PlusIcon, SpinnerIcon } from "../../components/Icons";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useBoards } from "../../hooks/useBoards";

// Types
import { BoardFormInputs } from "../../types/forms";

const CreateBoardForm: FC = () => {
  const { createBoard } = useBoards("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: "",
      columns: [{ title: "" }],
    },
  });

  const { setModalElement } = useModal();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      await createBoard(data);
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
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
          {...register("name", { required: true })}
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
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <input
                type="text"
                placeholder="e.g Todo"
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
                {...register(`columns.${index}.title`, { required: true })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Column"
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
            Add New Column
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Create New Board</span>}
      </button>
    </form>
  );
};

const EditBoardForm: FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { board, updateBoard, isLoading } = useBoards(boardId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: board?.name || "",
      columns: board?.columns || [{ title: "" }],
    },
  });

  const { setModalElement } = useModal();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  useEffect(() => {
    if (board) {
      reset({
        name: board.name,
        columns: board.columns,
      });
    }
  }, [board, reset]);

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      if (board) {
        await updateBoard({
          id: board.id,
          data: data,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      setModalElement(null);
    }
  };

  if (isLoading) return <SpinnerIcon />;

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
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
          {...register("name", { required: true })}
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
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <input
                type="text"
                placeholder="e.g Todo"
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
                {...register(`columns.${index}.title`, { required: true })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Column"
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
            Add New Column
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Save Changes</span>}
      </button>
    </form>
  );
};

const AddColumnForm: FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { board, addColumns, isLoading } = useBoards(boardId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: board?.name || "",
      columns: [{ title: "" }],
    },
  });

  const { setModalElement } = useModal();
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      if (board?.id) {
        // TODO: Implement addColumns functionality
        await addColumns({ id: board.id, columns: data.columns });
        void navigate(`boards/${board.slug}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      setModalElement(null);
    }
  };

  if (isLoading) return <SpinnerIcon />;

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
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none disabled:text-opacity-25 dark:bg-transparent dark:text-white dark:placeholder:text-white/25 dark:disabled:text-opacity-25"
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
          {board?.columns?.map((column, index) => (
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
              <input
                type="text"
                placeholder="e.g Todo"
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
                {...register(`columns.${index}.title`, { required: true })}
                autoFocus={index === 0}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500"
                aria-label="Remove Column"
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
            Add New Column
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Add Columns</span>}
      </button>
    </form>
  );
};

export { CreateBoardForm, EditBoardForm, AddColumnForm };
