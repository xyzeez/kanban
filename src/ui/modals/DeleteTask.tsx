import { FC } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

// Hooks
import { useTasks } from "../../hooks/useTasks";
import { useApp } from "../../hooks/useApp";

// UIs
import LoadingModal from "../placeholders/LoadingModal";

// Components
import { SpinnerIcon } from "../../components/Icons";

// Utils
import { getErrorMessage } from "../../utils/error";

const DeleteTask: FC<{ id: string; columnId: string }> = ({ id, columnId }) => {
  const navigate = useNavigate();
  const { boardId } = useParams<{
    boardId: string;
  }>();
  const { task, deleteTask, isLoading } = useTasks(boardId ?? "", columnId, id);
  const { closeModal } = useApp();

  const handleDelete = async () => {
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully!");
      closeModal();
      void navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!boardId || !task || isLoading) return <LoadingModal />;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-red">Delete this board?</h2>
      <p className="text-sm font-medium text-grey-500">
        Are you sure you want to delete the ‘
        <span className="capitalize">{task?.title}</span>’ task and its
        subtasks? This action cannot be reversed.
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

export default DeleteTask;
