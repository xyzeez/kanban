import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// Hooks
import { useBoards } from "../hooks/useBoards";
import { useModal } from "../hooks/useModal";
import { useTasks } from "../hooks/useTasks";

// Components
import { PlusIcon } from "../components/Icons";

// UIs
import { AddColumnForm } from "../ui/forms/BoardForms";

// Types
import { Column } from "../types/board";

// Utils
import { stringToSlug } from "../utils";

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

const ColumnItem: FC<{ boardId: string; column: Column }> = ({
  boardId,
  column,
}) => {
  const { tasks, isLoading } = useTasks(boardId, column.id);

  return (
    <li className="no-scrollbar flex shrink-0 grow-0 basis-[280px] flex-col overflow-y-auto">
      <h3 className="column-header-bg sticky top-0 flex flex-row items-center gap-3 pb-6 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
        <span className="block size-4 rounded-full bg-red" />
        {!isLoading && (
          <span>
            {column.title} ({tasks.length})
          </span>
        )}
      </h3>
      <ul className="flex h-full flex-col gap-5">
        {tasks.map((task) => (
          <li key={task.id}>
            <button className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-6 font-sans shadow-md shadow-[#364E7E1A] dark:bg-grey-800">
              <h4 className="text-base font-bold text-[#000112] dark:text-white">
                {task.title}
              </h4>
              <p className="text-xs font-bold text-grey-500">
                {task.doneSubtaskCount} of {task.subtasks.length} subtasks
              </p>
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};

const Board: FC = () => {
  const navigate = useNavigate();
  const { boardId, boardName } = useParams<{
    boardId: string;
    boardName: string;
  }>();
  const { board, isLoading } = useBoards(boardId);
  const { setModalElement } = useModal();

  useEffect(() => {
    if (isLoading) return;

    if (!board) {
      void navigate("/", { replace: true });
      return;
    }

    if (stringToSlug(board.name) !== boardName) {
      void navigate(`/boards/${board.slug}`, { replace: true });
    }
  }, [board, boardName, boardId, isLoading, navigate]);

  return (
    <ul className="no-scrollbar flex flex-row items-stretch justify-stretch gap-6 overflow-x-auto overflow-y-hidden px-4 py-6">
      {board?.columns.map((column) => (
        <ColumnItem key={column.id} boardId={board.id} column={column} />
      ))}
      <li className="flex h-full shrink-0 grow-0 basis-[280px] flex-col gap-6">
        <h3 className="invisible flex flex-row items-center gap-3 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          Add a new column
        </h3>
        <AddColumnButton
          clickHandler={() => setModalElement(<AddColumnForm />)}
        />
      </li>
    </ul>
  );
};

export default Board;
