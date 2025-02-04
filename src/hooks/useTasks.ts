import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hooks
import { useAuth } from "./useAuth";
import { taskService } from "../services/taskService";

// Types
import { CreateTaskDto, UpdateTaskDto } from "../types/task";

export const useTasks = (boardId: string, columnId?: string) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const tasksQueryKey = ["tasks", boardId, columnId];

  const tasksQuery = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => (columnId ? taskService.getTasks(columnId) : []),
    enabled: isAuthenticated && !!boardId && !!columnId,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task: CreateTaskDto) => taskService.createTask(task),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, variables.columnId],
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: UpdateTaskDto) => taskService.updateTask(data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", variables.boardId, variables.columnId],
      });

      if (variables.columnId !== columnId) {
        void queryClient.invalidateQueries({
          queryKey: ["tasks", variables.boardId, columnId],
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
    //   Queries
    tasks: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,

    // Mutations
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};
