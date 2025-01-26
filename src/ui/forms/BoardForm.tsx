import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useBoards } from "../../hooks/useBoards";

// Components
import { CrossIcon, PlusIcon, SpinnerIcon } from "../../components/Icons";

// Utils
import { fromSlug } from "../../utils";

// Types
interface BoardFormProps {
  toEdit?: boolean;
}

interface Inputs {
  name: string;
  columns: { title: string }[];
}

const BoardForm: FC<BoardFormProps> = ({ toEdit }) => {
  const { board } = useParams<{ board: string }>();
  const { activeBoard, createBoard, updateBoard, isLoadingBoard } = useBoards(
    fromSlug(board ?? ""),
  );
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: activeBoard?.name || "",
      columns: activeBoard?.columns || [{ title: "" }],
    },
  });

  const { setModalElement } = useModal();
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  useEffect(() => {
    if (toEdit && activeBoard) {
      reset({
        name: activeBoard.name,
        columns: activeBoard.columns,
      });
    }
  }, [toEdit, activeBoard, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (!toEdit) {
        const board = await createBoard(data);
        void navigate(`/${board.slug}`);
      } else if (activeBoard) {
        const board = await updateBoard({
          boardId: activeBoard.id,
          updateData: data,
        });
        void navigate(`/${board.slug}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      reset();
      setModalElement(null);
    }
  };

  if (isLoadingBoard) return <SpinnerIcon />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 font-sans"
    >
      <h2 className="text-lg font-bold text-black transition-colors dark:text-white">
        {toEdit ? "Edit Board" : "Add New Board"}
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
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors placeholder:text-black/25 focus:ring-1 dark:bg-transparent dark:text-white dark:placeholder:text-white/25"
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
        disabled={isLoadingBoard}
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? (
          <SpinnerIcon />
        ) : (
          <span>{toEdit ? "Save Changes" : "Create New Board"}</span>
        )}
      </button>
    </form>
  );
};

export default BoardForm;
