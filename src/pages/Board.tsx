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
import { Task } from "../types/task";

// Utils
import { cn } from "../utils/styles";
import { stringToSlug } from "../utils/string";

const COLUMN_COLORS = [
  "bg-column-blue",
  "bg-column-purple",
  "bg-column-green",
  "bg-column-coral",
  "bg-column-teal",
  "bg-column-indigo",
  "bg-column-amber",
  "bg-column-rose",
];

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

const TaskItem: FC<{
  task: Task;
  columnId: string;
  boardId: string;
}> = ({ task, columnId, boardId }) => {
  const { openModal } = useApp();

  return (
    <button
      onClick={() => {
        if (task.id) {
          openModal(
            <ViewTask taskId={task.id} columnId={columnId} boardId={boardId} />,
          );
        }
      }}
      className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-6 text-start font-sans shadow-md shadow-[#364E7E1A] transition-colors dark:bg-grey-800"
    >
      <h4 className="text-base font-bold text-[#000112] dark:text-white">
        {task.title}
      </h4>
      <p className="text-xs font-bold text-grey-500">
        {task.doneSubtaskCount} of {task.subtasks.length} subtasks
      </p>
    </button>
  );
};

const ColumnItem: FC<{
  column: Column;
  index: number;
}> = ({ column, index }) => {
  const { boardId } = useParams() as {
    boardId: string;
  };
  const { tasks, isLoading } = useTasks(boardId, column.id);
  const columnColor = COLUMN_COLORS[index % COLUMN_COLORS.length];

  return (
    <li
      className={cn(
        "flex shrink-0 grow-0 basis-[280px] flex-col",
        !tasks?.length && "sticky top-0",
      )}
    >
      <h3 className="column-header-bg sticky top-0 flex flex-row items-center gap-3 py-5 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
        <span className={cn("block size-4 rounded-full", columnColor)} />
        {!isLoading && (
          <span>
            {column.title} ({tasks?.length})
          </span>
        )}
      </h3>
      <ul
        className={cn(
          "flex h-full flex-col gap-[22px]",
          !tasks?.length &&
            "rounded-md border-2 border-dashed border-grey-500/25",
        )}
      >
        {tasks?.map(
          (task) =>
            column.id && (
              <li key={task.id} className="last-of-type:pb-5">
                <TaskItem task={task} columnId={column.id} boardId={boardId} />
              </li>
            ),
        )}
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
    <ul className="scrollbar flex flex-row items-stretch gap-6 overflow-auto px-4 pb-5">
      {board?.columns.map((column: Column, index: number) => (
        <ColumnItem key={column.id} column={column} index={index} />
      ))}
      <li className="sticky top-0 flex h-full shrink-0 grow-0 basis-[280px] flex-col gap-6 pt-5">
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
