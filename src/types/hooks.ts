// Types
import { Board } from "./board";
import { Task } from "./task";

export type DebouncedFunction<T extends unknown[], R> = (
  signal: AbortSignal,
  ...args: T
) => Promise<R>;

export interface ColumnTasks {
  [columnId: string]: {
    tasks: Task[] | undefined;
    isLoading: boolean;
  };
}

export interface UseBoardDndProps {
  boardId: string | undefined;
  board: Board | undefined;
}
