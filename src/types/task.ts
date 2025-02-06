export type Subtask = {
  id?: string;
  title: string;
  completed?: boolean;
};

export type Task = {
  id?: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  doneSubtaskCount?: number;
  columnId: string;
  boardId: string;
};

export interface TasksApiResponse {
  task?: Task;
  tasks?: Task[];
}
