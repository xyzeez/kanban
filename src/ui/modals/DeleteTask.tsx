import { FC } from "react";
import { useNavigate } from "react-router";

// Hooks
import { useTasks } from "../../hooks/useTasks";
import { useApp } from "../../hooks/useApp";

// Components
import { SpinnerIcon } from "../../components/Icons";

// Types
import { Task } from "../../types/task";

const DeleteTask: FC<{ taskData: Task }> = ({ taskData }) => {
  const navigate = useNavigate();
  const { id, title, columnId, boardId } = taskData;
  const { deleteTask, isLoading } = useTasks(boardId, columnId);
  const { closeModal } = useApp();

  const handleDelete = async () => {
    await deleteTask(id);
    closeModal();
    void navigate("/");
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-red">Delete this board?</h2>
      <p className="text-sm font-medium text-grey-500">
        Are you sure you want to delete the ‘<span>{title}</span>’ task and its
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
