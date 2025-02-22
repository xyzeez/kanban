import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Hooks
import { useBoards } from "../hooks/useBoards";
import { useApp } from "../hooks/useApp";

// Services
import { taskService } from "../services/taskService";

// UIs
import { AddColumnForm } from "../ui/forms/BoardForms";
import EmptyState from "../ui/placeholders/EmptyState";
import BoardSkeleton from "../ui/placeholders/BoardSkeleton";
import ColumnItem from "../ui/board/ColumnItem";
import { TaskPreview } from "../ui/board/TaskItem";
import AddColumnButton from "../ui/board/AddColumnButton";

// Types
import { Column, DragData } from "../types/board";
import { Task } from "../types/task";

// Utils
import { stringToSlug } from "../utils/string";

const Board: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { boardId, boardName } = useParams<{
    boardId: string;
    boardName: string;
  }>();
  const { board, isLoading } = useBoards(boardId);
  const { openModal } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeTaskColumn, setActiveTaskColumn] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dragData = active.data.current as DragData;
    if (dragData?.task) {
      setActiveTask(dragData.task);
      setActiveTaskColumn(dragData.task.columnId);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as DragData;
    const activeColumnId = activeData.task.columnId;
    const overId = over.id;

    if (typeof overId === "string" && activeColumnId !== overId)
      setActiveTaskColumn(overId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !activeTaskColumn || !boardId) return;

    const taskId = active.id as string;
    const dragData = active.data.current as DragData;
    const activeColumnId = dragData.task.columnId;
    const targetColumnId =
      over.data.current?.type === "task"
        ? (over.data.current as DragData).task.columnId
        : (over.id as string);

    const tasks =
      queryClient.getQueryData<Task[]>(["tasks", boardId, activeColumnId]) ||
      [];

    if (activeColumnId === targetColumnId) {
      const oldIndex = tasks.findIndex((task) => task.id === taskId);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== newIndex) {
        const newTasks = arrayMove(tasks, oldIndex, newIndex);

        const newPosition =
          over.id === targetColumnId
            ? newTasks.length - 1
            : newTasks.findIndex((task) => task.id === taskId);

        queryClient.setQueryData(["tasks", boardId, activeColumnId], newTasks);

        try {
          await taskService.updatePositionWithAbort(taskId, newPosition);
        } catch {
          queryClient.setQueryData(["tasks", boardId, activeColumnId], tasks);
        }
      }
    } else {
      const sourceColumn = board?.columns.find(
        (col) => col.id === activeColumnId,
      );
      const targetColumn = board?.columns.find(
        (col) => col.id === targetColumnId,
      );

      if (sourceColumn && targetColumn) {
        const targetTasks =
          queryClient.getQueryData<Task[]>([
            "tasks",
            boardId,
            targetColumnId,
          ]) || [];

        let targetPosition: number;
        if (over.id === targetColumnId) {
          targetPosition = targetTasks.length;
        } else {
          const overTaskIndex = targetTasks.findIndex((t) => t.id === over.id);
          targetPosition = overTaskIndex;
        }

        const previousTasks = tasks;
        const updatedSourceTasks = tasks.filter((t) => t.id !== taskId);
        const updatedTask = { ...dragData.task, columnId: targetColumnId };
        const updatedTargetTasks = [
          ...targetTasks.slice(0, targetPosition),
          updatedTask,
          ...targetTasks.slice(targetPosition),
        ];

        queryClient.setQueryData(
          ["tasks", boardId, activeColumnId],
          updatedSourceTasks,
        );
        queryClient.setQueryData(
          ["tasks", boardId, targetColumnId],
          updatedTargetTasks,
        );

        try {
          await taskService.updatePositionWithAbort(
            taskId,
            targetPosition,
            targetColumnId,
          );

          toast.success(`Moved to ${targetColumn.title}`);
        } catch {
          queryClient.setQueryData(
            ["tasks", boardId, activeColumnId],
            previousTasks,
          );
          queryClient.setQueryData(
            ["tasks", boardId, targetColumnId],
            targetTasks,
          );
        }
      }
    }

    setActiveTaskColumn(null);
  };

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
