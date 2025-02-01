import { Column } from "./board";

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
  boardId: string;
  title: string;
  description: string;
  subtasks: { title: string }[];
  columnId: string;
}
