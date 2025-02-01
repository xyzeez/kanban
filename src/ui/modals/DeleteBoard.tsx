import { FC } from "react";
import { useNavigate } from "react-router";

// Hooks
import { useBoards } from "../../hooks/useBoards";

// Components
import { SpinnerIcon } from "../../components/Icons";
import { useApp } from "../../hooks/useApp";
import { Board } from "../../types/board";

const DeleteBoard: FC<{ boardData: Board }> = ({ boardData }) => {
  const navigate = useNavigate();
  const { id, name } = boardData;
  const { closeModal } = useApp();
  const { deleteBoard, isLoading } = useBoards(id);

  const handleDelete = async () => {
    await deleteBoard(id);
    closeModal();
    void navigate("/");
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-red">Delete this board?</h2>
      <p className="text-sm font-medium text-grey-500">
        Are you sure you want to delete the ‘<span>{name}</span>’ board? This
        action will remove all columns and tasks and cannot be reversed.
      </p>
      <div className="flex flex-col items-center gap-3 md:flex-row">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="btn btn-warn btn-small w-full"
        >
          {isLoading ? <SpinnerIcon /> : <span>Delete</span>}
        </button>
        <button
          className="btn btn-sec btn-small w-full text-sm"
          onClick={() => closeModal()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteBoard;
