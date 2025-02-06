import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

// Hooks
import { useBoards } from "../hooks/useBoards";
import { useApp } from "../hooks/useApp";
import { useTasks } from "../hooks/useTasks";

// Components
import { PlusIcon } from "../components/Icons";

// UIs
import { AddColumnForm } from "../ui/forms/BoardForms";
import EmptyState from "../ui/placeholders/EmptyState";
import BoardSkeleton from "../ui/placeholders/BoardSkeleton";
import ViewTask from "../ui/modals/ViewTask";

// Types
import { Column, AddColumnsButtonProps } from "../types/board";

// Utils
import { cn } from "../utils/styles";
import { stringToSlug } from "../utils/string";

const AddColumnButton: FC<AddColumnsButtonProps> = ({
  clickHandler,
  disabled,
}) => (
  <button
    disabled={disabled}
    onClick={clickHandler}
    className="add-column-bg flex h-full items-center justify-center rounded-md disabled:cursor-not-allowed"
  >
    <span className="text-btn text-lg font-bold text-grey-500 md:text-xl xl:text-2xl">
      <PlusIcon />
      <span>New Column</span>
    </span>
  </button>
);

const ColumnItem: FC<{
  column: Column;
}> = ({ column }) => {
  const { boardId } = useParams<{
    boardId: string;
  }>();
  const { tasks, isLoading } = useTasks(boardId ?? "", column.id);
  const { openModal } = useApp();

  return (
    <li
      className={cn(
        "flex shrink-0 grow-0 basis-[280px] flex-col",
        !tasks?.length && "sticky top-0",
      )}
    >
      <h3 className="column-header-bg sticky top-0 flex flex-row items-center gap-3 py-6 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
        <span className="block size-4 rounded-full bg-red" />
        {!isLoading && (
          <span>
            {column.title} ({tasks?.length})
          </span>
        )}
      </h3>
      <ul
        className={cn(
          "flex h-full flex-col",
          !tasks?.length &&
            "gap-5 rounded-md border-2 border-dashed border-grey-500/25",
        )}
      >
        {tasks?.map((task) => (
          <li key={task.id} className={cn(tasks?.length && "pb-5")}>
            <button
              onClick={() => {
                if (boardId && column.id && task.id) {
                  openModal(
                    <ViewTask
                      taskId={task.id}
                      columnId={column.id}
                      boardId={boardId}
                    />,
                  );
                }
              }}
              className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-6 font-sans shadow-md shadow-[#364E7E1A] transition-colors dark:bg-grey-800"
            >
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
  const { openModal } = useApp();

  useEffect(() => {
    if (isLoading) return;

    if (!board) {
      void navigate("/", { replace: true });
      return;
    }

    if (stringToSlug(board.name) !== boardName) {
      void navigate(`/boards/${board.slug}`, { replace: true });
    }
  }, [board, boardName, isLoading, navigate]);

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (board?.columns.length === 0) {
    return (
      <EmptyState
        type="column"
        actionHandler={() => openModal(<AddColumnForm />)}
      />
    );
  }

  return (
    <ul className="scrollbar flex flex-row items-stretch justify-stretch gap-6 overflow-auto px-4 pb-6">
      {board?.columns.map((column: Column) => (
        <ColumnItem key={column.id} column={column} />
      ))}
      <li className="sticky top-0 flex h-full shrink-0 grow-0 basis-[280px] flex-col gap-6 pt-6">
        <h3 className="invisible flex flex-row items-center gap-3 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
          Add a new column
        </h3>
        <AddColumnButton
          disabled={isLoading}
          clickHandler={() => {
            if (board) {
              openModal(<AddColumnForm />);
            }
          }}
        />
      </li>
    </ul>
  );
};

export default Board;
