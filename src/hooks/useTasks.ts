import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Services
import { taskService } from "../services/taskService";

// Hooks
import { useAuth } from "./useAuth";

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const [subtasksByTaskId, setSubtasksByTaskId] = useState<
    Record<string, Subtask[]>
  >({});

  const updateSubtasks = useCallback(
    (taskId: string, subtasks: Subtask[]) => {
      setSubtasksByTaskId((prev) => ({
        ...prev,
        [taskId]: subtasks,
      }));

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout to debounce the API call
      timeoutRef.current = setTimeout(() => {
        void taskService.updateSubtasksWithAbort(taskId, subtasks).then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["tasks", boardId, columnId],
          });
          void queryClient.invalidateQueries({
            queryKey: ["task", taskId],
          });
        });
      }, 500); // 500ms debounce delay
    },
    [boardId, columnId, queryClient],
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

      // Invalidate single task query if it exists
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
    isLoading: tasksQuery.isLoading || taskQuery.isLoading,
    isError: tasksQuery.isError || taskQuery.isError,

    // Mutations
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    updateSubtasks,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
