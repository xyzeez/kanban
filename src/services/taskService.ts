// Services
import { apiService } from "./apiService";

// Types
import { Task, TasksApiResponse, Subtask } from "../types/task";

// API Service
export const tasksAPI = apiService("tasks");

export const taskService = {
  getTasks: async (columnId: string) => {
    const response = await tasksAPI.get<TasksApiResponse>(
      `/?columnId=${columnId}`,
    );
    return response.data.tasks;
  },

  getTask: async (id: string) => {
    const response = await tasksAPI.get<TasksApiResponse>(`/${id}`);
    return response.data.task;
  },

  createTask: async (task: Task) => {
    const columnId = task.columnId;
    const boardId = task.boardId;
    const response = await tasksAPI.post<TasksApiResponse>(
      `/?columnId=${columnId}&boardId=${boardId}`,
      task,
    );
    return response.data.task;
  },

  updateTask: async (task: Task) => {
    const { id, ...rest } = task;
    const response = await tasksAPI.patch<TasksApiResponse>(`/${id}`, rest);
    return response.data.task;
  },

  deleteTask: async (id: string) => {
    await tasksAPI.delete(`/${id}`);
  },

  updateSubtasks: async (
    taskId: string,
    subtasks: Subtask[],
    signal?: AbortSignal,
  ) => {
    const response = await tasksAPI.patch<TasksApiResponse>(
      `/${taskId}/subtasks`,
      {
        subtasks,
      },
      { signal },
    );
    return response.data.task;
  },

  updateSubtasksWithAbort: (() => {
    let controller: AbortController | null = null;

    return async (taskId: string, subtasks: Subtask[]) => {
      // Abort previous request if it exists
      if (controller) {
        controller.abort();
      }

      // Create new controller for this request
      controller = new AbortController();

      try {
        return await taskService.updateSubtasks(
          taskId,
          subtasks,
          controller.signal,
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to update subtasks:", error);
        }
        throw error;
      }
    };
  })(),

  updateColumn: async (
    taskId: string,
    columnId: string,
    signal?: AbortSignal,
  ) => {
    const response = await tasksAPI.patch<TasksApiResponse>(
      `/${taskId}/column`,
      {
        columnId,
      },
      { signal },
    );
    return response.data.task;
  },

  updateColumnWithAbort: (() => {
    let controller: AbortController | null = null;

    return async (taskId: string, columnId: string) => {
      // Abort previous request if it exists
      if (controller) {
        controller.abort();
      }

      // Create new controller for this request
      controller = new AbortController();

      try {
        return await taskService.updateColumn(
          taskId,
          columnId,
          controller.signal,
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to update column:", error);
        }
        throw error;
      }
    };
  })(),
};
