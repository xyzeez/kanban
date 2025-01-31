import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Hooks
import { useAuth } from "./useAuth";
import { taskService } from "../services/taskService";

// Types
import { CreateTaskDto } from "../types/task";

export const useTasks = (boardId: string, columnId?: string) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const tasksQueryKey = ["tasks", boardId, columnId];

  const getTasks = async () => {
    try {
      const tasks = await taskService.getTasks(columnId ?? "");
      return tasks;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createTask = async (task: CreateTaskDto) => {
    try {
      const newTask = await taskService.createTask(task);
      return newTask;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const tasksQuery = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => (columnId ? getTasks() : []),
    enabled: isAuthenticated && !!boardId && !!columnId,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task: CreateTaskDto) => createTask(task),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["tasks", boardId, variables.columnId],
      });
    },
  });

  return {
    //   Queries
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,

    // Mutations
    createTask: createTaskMutation.mutateAsync,
  };
};
