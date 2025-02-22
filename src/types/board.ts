import { HTMLMotionProps } from "framer-motion";

// Types
import { Task } from "./task";

export interface Column {
  id?: string;
  title: string;
  boardId?: string;
}

export interface Board {
  id?: string;
  name: string;
  columns: Column[];
  ownerId?: string;
  slug?: string;
}

export interface AddColumnsButtonProps {
  boardId: string;
}

export interface BoardsApiResponse {
  board?: Board;
  boards?: Board[];
  columns?: Column[];
}

export interface DragData {
  type: "task";
  task: Task;
}

export type SortableTaskListProps = HTMLMotionProps<"ul">;

export interface ColumnItemProps {
  column: Column;
  index: number;
  boardId: string;
}

export interface TaskPreviewProps {
  task: Task;
}

export interface TaskItemProps {
  task: Task;
  columnId: string;
  boardId: string;
}
