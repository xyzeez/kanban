import { FC } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useBoards } from "../../hooks/useBoards";

// Components
import { CrossIcon, PlusIcon, SpinnerIcon } from "../../components/Icons";

// Types
interface Inputs {
  name: string;
  columns: { title: string }[];
}

const CreateBoardForm: FC = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      columns: [{ title: "" }],
    },
  });
  const { createBoard } = useBoards();
  const { setModalElement } = useModal();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await createBoard(data);
      reset();
      setModalElement(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 font-sans"
    >
      <h2 className="text-lg font-bold text-black">Add New Board</h2>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs font-bold text-grey-500">
          Board Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="e.g Web Design"
          className="rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors focus:ring-1"
          {...register("name", { required: true })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="columns" className="text-xs font-bold text-grey-500">
          Board Columns
        </label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-row items-center gap-4">
              <input
                type="text"
                placeholder="e.g Todo"
                className="w-full rounded-[4px] border border-grey-500/25 bg-white px-4 py-2 text-sm font-medium text-black outline-none ring-purple transition-colors focus:ring-1"
                {...register(`columns.${index}.title`, { required: true })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-grey-500 hover:text-grey-700"
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
        className="btn btn-primary btn-small text-sm font-bold"
      >
        {isSubmitting ? <SpinnerIcon /> : <span>Create New Board</span>}
      </button>
    </form>
  );
};

export default CreateBoardForm;
