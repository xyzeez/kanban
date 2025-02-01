// Services
import { apiService } from "./apiService";

// Types
import { CreateTaskDto, UpdateTaskDto, TasksApiResponse } from "../types/task";

// API Service
export const tasksAPI = apiService("tasks");

export const taskService = {
  getTasks: async (columnId: string) => {
    const response = await tasksAPI.get<TasksApiResponse>(
      `/?columnId=${columnId}`,
    );
    if (response.status !== "success") {
      throw new Error(response.message);
    }
    return response.data.tasks;
  },

  createTask: async (task: CreateTaskDto) => {
    const columnId = task.columnId;
    const boardId = task.boardId;
    const response = await tasksAPI.post<TasksApiResponse>(
      `/?columnId=${columnId}&boardId=${boardId}`,
      task,
    );

    if (response.status !== "success") {
      throw new Error(response.message);
    }

    return response.data.task;
  },

  updateTask: async (task: UpdateTaskDto) => {
    const { id, ...rest } = task;
    const response = await tasksAPI.patch<TasksApiResponse>(`/${id}`, rest);

    if (response.status !== "success") {
      throw new Error(response.message);
    }

    return response.data.task;
  },

  deleteTask: async (id: string) => {
    await tasksAPI.delete(`/${id}`);
  },
};
