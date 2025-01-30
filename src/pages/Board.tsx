import { FC } from "react";
import { useParams } from "react-router";

// Hooks
import { useBoards } from "../hooks/useBoards";
import { useModal } from "../hooks/useModal";

// Components
import { PlusIcon } from "../components/Icons";

// UIs
import BoardForm from "../ui/forms/BoardForm";

const AddColumnButton: FC<{ clickHandler: () => void }> = ({
  clickHandler,
}) => (
  <button
    onClick={clickHandler}
    className="add-column-bg flex h-full items-center justify-center rounded-md"
  >
    <span className="text-btn text-lg font-bold text-grey-500 md:text-xl xl:text-2xl">
      <PlusIcon className="size-4" />
      <span>New Column</span>
    </span>
  </button>
);

const Board: FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { columns } = useBoards(boardId);
  const { setModalElement } = useModal();

  return (
    <ul className="flex flex-row gap-6 overflow-auto px-4 py-6">
      {columns.map((column) => (
        <li
          key={column.id}
          className="flex shrink-0 grow-0 basis-[280px] flex-col gap-6"
        >
          <h3 className="flex flex-row items-center gap-3 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
            <span className="block size-4 rounded-full bg-red" />
            <span>{column.title} (0)</span>
          </h3>
          <ul className="h-full border"></ul>
        </li>
      ))}
      <li className="flex shrink-0 grow-0 basis-[280px] flex-col gap-6">
        <h3 className="invisible flex flex-row items-center gap-3 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          Add a new column
        </h3>
        <AddColumnButton
          clickHandler={() => setModalElement(<BoardForm toAddColumn={true} />)}
        />
      </li>
    </ul>
  );
};

export default Board;
