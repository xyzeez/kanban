import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Services
import { taskService } from "../services/taskService";

// Hooks
import { useAuth } from "./useAuth";
import { useDebounce } from "./useDebounce";

// Types
import { Task, Subtask } from "../types/task";

export const useTasks = (
  boardId: string,
  columnId?: string,
  taskId?: string,
) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const tasksQueryKey = ["tasks", boardId, columnId];
  const taskQueryKey = ["task", taskId];

  const [subtasksByTaskId, setSubtasksByTaskId] = useState<
    Record<string, Subtask[]>
  >({});
  const [taskColumnIds, setTaskColumnIds] = useState<Record<string, string>>(
    {},
  );

  const debouncedUpdateSubtasks = useDebounce(
    async (signal: AbortSignal, taskId: string, subtasks: Subtask[]) => {
      const result = await taskService.updateSubtasks(taskId, subtasks, signal);
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, columnId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      return result;
    },
  );

  const debouncedUpdateColumn = useDebounce(
    async (signal: AbortSignal, taskId: string, newColumnId: string) => {
      const task = queryClient.getQueryData<Task>(["task", taskId]);
      if (!task) return;

      const result = await taskService.updateColumn(
        taskId,
        newColumnId,
        signal,
      );
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, task.columnId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, newColumnId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      return result;
    },
  );

  const updateSubtasks = useCallback(
    (taskId: string, subtasks: Subtask[]) => {
      setSubtasksByTaskId((prev) => ({
        ...prev,
        [taskId]: subtasks,
      }));

      void debouncedUpdateSubtasks(taskId, subtasks);
    },
    [debouncedUpdateSubtasks],
  );

  const updateTaskColumn = useCallback(
    (taskId: string, newColumnId: string) => {
      const task = queryClient.getQueryData<Task>(["task", taskId]);
      if (!task) return false;

      const oldColumnId = task.columnId;
      if (oldColumnId === newColumnId) return false;

      const targetColumnTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        boardId,
        newColumnId,
      ]);

      if (
        targetColumnTasks?.some(
          (t) => t.title.toLowerCase() === task.title.toLowerCase(),
        )
      ) {
        return false;
      }

      setTaskColumnIds((prev) => ({
        ...prev,
        [taskId]: newColumnId,
      }));

      const previousSourceTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        boardId,
        oldColumnId,
      ]);
      const previousDestTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        boardId,
        newColumnId,
      ]);

      if (previousSourceTasks) {
        queryClient.setQueryData(
          ["tasks", boardId, oldColumnId],
          previousSourceTasks.filter((t) => t.id !== taskId),
        );
      }

      if (previousDestTasks) {
        queryClient.setQueryData(
          ["tasks", boardId, newColumnId],
          [{ ...task, columnId: newColumnId }, ...previousDestTasks],
        );
      }

      void debouncedUpdateColumn(taskId, newColumnId);

      return true;
    },
    [boardId, queryClient, debouncedUpdateColumn],
  );

  const tasksQuery = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => (columnId ? taskService.getTasks(columnId) : []),
    enabled: isAuthenticated && !!boardId && !!columnId,
  });

  const taskQuery = useQuery({
    queryKey: taskQueryKey,
    queryFn: () => taskService.getTask(taskId!),
    enabled: isAuthenticated && !!taskId,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task: Task) => taskService.createTask(task),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, variables.columnId],
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: Task) => taskService.updateTask(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", variables.boardId, variables.columnId],
      });

      if (variables.columnId !== columnId) {
        void queryClient.invalidateQueries({
          queryKey: ["tasks", variables.boardId, columnId],
        });
      }

      if (taskId) {
        void queryClient.invalidateQueries({
          queryKey: ["task", taskId],
        });
      }
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, columnId],
      });
    },
  });

  return {
    // Queries
    tasks: tasksQuery.data,
    task: taskQuery.data,
    subtasksByTaskId,
    taskColumnIds,
    isLoading: tasksQuery.isLoading || taskQuery.isLoading,
    isError: tasksQuery.isError || taskQuery.isError,

    // Mutations
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    updateSubtasks,
    updateTaskColumn,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
