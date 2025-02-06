import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hooks
import { useAuth } from "./useAuth";
import { taskService } from "../services/taskService";

// Types
import { Task } from "../types/task";

export const useTasks = (
  boardId: string,
  columnId?: string,
  taskId?: string,
) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const tasksQueryKey = ["tasks", boardId, columnId];
  const taskQueryKey = ["task", taskId];

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
    isLoading: tasksQuery.isLoading || (!!taskId && taskQuery.isLoading),
    isError: tasksQuery.isError || (!!taskId && taskQuery.isError),

    // Mutations
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
