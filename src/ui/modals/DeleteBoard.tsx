import { FC } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

// Hooks
import { useBoards } from "../../hooks/useBoards";
import { useApp } from "../../hooks/useApp";

// UIs
import LoadingModal from "../placeholders/LoadingModal";

// Components
import { SpinnerIcon } from "../../components/Icons";

// Utils
import { getErrorMessage } from "../../utils/error";

const DeleteBoard: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { board, deleteBoard, isLoading } = useBoards(id);
  const { closeModal } = useApp();

  const handleDelete = async () => {
    try {
      await deleteBoard(id);
      toast.success("Board deleted successfully!");
      closeModal();
      void navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!board || isLoading) return <LoadingModal />;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-red">Delete this board?</h2>
      <p className="text-sm font-medium text-grey-500">
        Are you sure you want to delete the &apos;
        <span className="capitalize">{board.name}</span>
        &apos; board? This action will remove all columns and tasks and cannot
        be reversed.
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
