// Types
import { Column } from "./board";
import { Subtask } from "./task";

export interface RegisterFormInputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

export interface BoardFormInputs {
  name: string;
  columns: Column[];
}

export interface TaskFormInputs {
  title: string;
  description: string;
  subtasks: Subtask[];
  columnId: string;
  boardId: string;
}
