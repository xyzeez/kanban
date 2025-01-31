// Services
import { apiService } from "./axios";

// Types
import { CreateTaskDto, Task } from "../types/task";

export const taskService = {
  getTasks: async (columnId: string): Promise<Task[]> => {
    const response = await apiService.get<{ data: { tasks: Task[] } }>(
      `/tasks?columnId=${columnId}`,
    );

    if (!response.data || !response.data.data) {
      throw new Error("Failed to fetch tasks");
    }

    return response.data.data.tasks;
  },

  createTask: async (task: CreateTaskDto): Promise<Task | null> => {
    const columnId = task.columnId;
    const boardId = task.boardId;

    const response = await apiService.post<{ data: { task: Task } }>(
      `/tasks?columnId=${columnId}&boardId=${boardId}`,
      task,
    );

    if (!response.data || !response.data.data) {
      throw new Error("Failed to create task");
    }

    return response.data.data.task;
  },
};
