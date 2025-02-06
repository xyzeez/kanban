// Services
import { apiService } from "./apiService";

// Types
import { Task, TasksApiResponse } from "../types/task";

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
};
