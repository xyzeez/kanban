import { FC } from "react";
import { useNavigate, useParams } from "react-router";

// Hooks
import { useBoards } from "../../hooks/useBoards";

// Components
import { SpinnerIcon } from "../../components/Icons";
import { useApp } from "../../hooks/useApp";

const DeleteBoard: FC = () => {
  const { closeModal } = useApp();
  const { boardId } = useParams<{ boardId: string }>();
  const { board, isLoading, deleteBoard } = useBoards(boardId);
  const navigate = useNavigate();

  if (isLoading) return <SpinnerIcon />;

  const handleDelete = async () => {
    if (board?.id) {
      await deleteBoard(board.id);
      closeModal();
      void navigate("/");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-red">Delete this board?</h2>
      <p className="text-sm font-medium text-grey-500">
        Are you sure you want to delete the ‘<span>{board?.name}</span>’ board?
        This action will remove all columns and tasks and cannot be reversed.
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
