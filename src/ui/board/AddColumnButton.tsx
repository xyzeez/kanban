import { FC } from "react";

// Components
import { PlusIcon } from "../../components/Icons";

// Types
import { AddColumnsButtonProps } from "../../types/board";
import { AddColumnForm } from "../forms/BoardForms";

// Hooks
import { useApp } from "../../hooks/useApp";

const AddColumnButton: FC<AddColumnsButtonProps> = ({ boardId }) => {
  const { openModal } = useApp();

  if (!boardId) return null;

  return (
    <button
      disabled={!boardId}
      onClick={() => openModal(<AddColumnForm boardId={boardId} />)}
      className="add-column-bg flex h-full items-center justify-center rounded-md disabled:cursor-not-allowed"
    >
      <span className="text-btn text-lg font-bold text-grey-500 md:text-xl xl:text-2xl">
        <PlusIcon />
        <span>New Column</span>
      </span>
    </button>
  );
};

export default AddColumnButton;
