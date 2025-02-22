import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Services
import { taskService } from "../services/taskService";

// Types
import { DragData } from "../types/board";
import { Task } from "../types/task";
import { UseBoardDndProps } from "../types/hooks";

const useBoardDnd = ({ boardId, board }: UseBoardDndProps) => {
  const queryClient = useQueryClient();
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

    const targetTasks =
      queryClient.getQueryData<Task[]>(["tasks", boardId, targetColumnId]) ||
      [];

    if (
      activeColumnId !== targetColumnId &&
      targetTasks.some((task) => task.title === dragData.task.title)
    ) {
      toast.error("A task with same title already exists in target column");
      return;
    }

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

  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useBoardDnd;
