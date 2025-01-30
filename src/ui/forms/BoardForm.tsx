import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useBoards } from "../../hooks/useBoards";

// Components
import { CrossIcon, PlusIcon, SpinnerIcon } from "../../components/Icons";

// Types
import { BoardFormInputs, BoardFormProps } from "../../types/forms";
import { Board } from "../../types/board";

// Utils
import { slugToString } from "../../utils";

const BoardForm: FC<BoardFormProps> = ({ toEdit, toAddColumn }) => {
  const { boardId } = useParams<{ boardId: string }>();
  const { board, createBoard, updateBoard, addColumns, isLoading } = useBoards(
    slugToString(boardId ?? ""),
  );
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<BoardFormInputs>({
    defaultValues: {
      name: board?.name || "",
      columns: toAddColumn
        ? [{ title: "" }]
        : board?.columns || [{ title: "" }],
    },
  });

  const { setModalElement } = useModal();
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  useEffect(() => {
    if (toEdit && board) {
      reset({
        name: board.name,
        columns: toAddColumn ? [{ title: "" }] : board.columns,
      });
    }
  }, [toEdit, board, reset, toAddColumn]);

  const boardCreateHandler = async (data: BoardFormInputs) => {
    if (!data.name) return;

    const newBoard = await createBoard(data);
    if (newBoard) void navigate(`boards/${newBoard.slug}`);
  };

  const boardUpdateHandler = async (board: Board, data: BoardFormInputs) => {
    if (!board.id) return;

    const newBoard = await updateBoard({
      id: board.id,
      data: data,
    });
    if (newBoard) void navigate(`boards/${newBoard.slug}`);
  };

  const columnAddHandler = async (board: Board, data: BoardFormInputs) => {
    if (!board.id) return;

    const newBoard = await addColumns({
      id: board.id,
      columns: data.columns,
    });
    if (newBoard) void navigate(`boards/${newBoard.slug}`);
  };

  const onSubmit: SubmitHandler<BoardFormInputs> = async (data) => {
    try {
      if (toAddColumn && board) {
        await columnAddHandler(board, data);
      } else if (!toEdit) {
        await boardCreateHandler(data);
      } else if (board) {
        await boardUpdateHandler(board, data);
      }
    } catch (error) {
      console.log(error);
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
        {toAddColumn
          ? "Add New Column"
          : toEdit
            ? "Edit Board"
            : "Add New Board"}
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
          disabled={toAddColumn}
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
          {toAddColumn &&
            board?.columns?.map((column, index) => (
              <div
                key={`existing-${index}`}
                className="flex flex-row items-center gap-4"
              >
                <input
                  type="text"
                  value={column.title}
                  disabled
                  className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none disabled:text-opacity-25 dark:bg-transparent dark:text-white"
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
                autoFocus={toAddColumn && index === 0}
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
        {isSubmitting ? (
          <SpinnerIcon />
        ) : (
          <span>
            {toAddColumn
              ? "Add Columns"
              : toEdit
                ? "Save Changes"
                : "Create New Board"}
          </span>
        )}
      </button>
    </form>
  );
};

export default BoardForm;
