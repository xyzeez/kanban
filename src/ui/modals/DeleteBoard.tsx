import { FC } from "react";
import { useNavigate, useParams } from "react-router";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useBoards } from "../../hooks/useBoards";

// Components
import { SpinnerIcon } from "../../components/Icons";

// Utils
import { fromSlug } from "../../utils";

const DeleteBoard: FC = () => {
  const { setModalElement } = useModal();
  const { board } = useParams<{ board: string }>();
  const { activeBoard, isLoadingBoard, deleteBoard } = useBoards(
    fromSlug(board ?? ""),
  );
  const navigate = useNavigate();

  if (isLoadingBoard) return <SpinnerIcon />;

  const handleDelete = async () => {
    if (activeBoard?.id) {
      await deleteBoard(activeBoard.id);
      setModalElement(null);
      void navigate("/");
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-red">Delete this board?</h2>
      <p className="text-sm font-medium text-grey-500">
        Are you sure you want to delete the ‘<span>{activeBoard?.name}</span>’
        board? This action will remove all columns and tasks and cannot be
        reversed.
      </p>
      <div className="flex flex-col items-center gap-3 md:flex-row">
        <button
          onClick={handleDelete}
          disabled={isLoadingBoard}
          className="btn btn-warn btn-small w-full"
        >
          {isLoadingBoard ? <SpinnerIcon /> : <span>Delete</span>}
        </button>
        <button
          className="btn btn-sec btn-small w-full text-sm"
          onClick={() => setModalElement(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteBoard;
