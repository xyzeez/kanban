import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { DndContext, DragOverlay } from "@dnd-kit/core";

// Hooks
import { useBoards } from "../hooks/useBoards";
import { useApp } from "../hooks/useApp";
import useBoardDnd from "../hooks/useBoardDnd";

// UIs
import { AddColumnForm } from "../ui/forms/BoardForms";
import EmptyState from "../ui/placeholders/EmptyState";
import BoardSkeleton from "../ui/placeholders/BoardSkeleton";
import ColumnItem from "../ui/board/ColumnItem";
import { TaskPreview } from "../ui/board/TaskItem";
import AddColumnButton from "../ui/board/AddColumnButton";

// Types
import { Column } from "../types/board";

// Utils
import { stringToSlug } from "../utils/string";

const Board: FC = () => {
  const navigate = useNavigate();
  const { boardId, boardName } = useParams<{
    boardId: string;
    boardName: string;
  }>();
  const { board, isLoading } = useBoards(boardId);
  const { openModal } = useApp();
  const {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDnd({ boardId, board: board ?? undefined });

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

  if (isLoading) return <BoardSkeleton />;

  if (board?.columns.length === 0)
    return (
      <EmptyState
        type="column"
        actionHandler={() =>
          openModal(<AddColumnForm boardId={boardId ?? ""} />)
        }
      />
    );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ul className="scrollbar flex flex-row items-stretch gap-6 overflow-auto px-4 pb-5">
        {board?.columns.map((column: Column, index: number) => (
          <ColumnItem
            key={column.id}
            column={column}
            index={index}
            boardId={boardId!}
          />
        ))}
        <li className="sticky top-0 flex h-full shrink-0 grow-0 basis-[280px] flex-col gap-6 pt-5">
          <h3 className="invisible flex flex-row items-center gap-3 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500">
            Add a new column
          </h3>
          <AddColumnButton boardId={boardId ?? ""} />
        </li>
      </ul>
      <DragOverlay>
        {activeTask && <TaskPreview task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;
