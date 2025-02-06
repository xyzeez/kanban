export interface EmptyStateProps {
  type: "board" | "column";
  actionHandler?: () => void;
}

export interface LoadingProps {
  type: "Auth" | "App";
}

export interface BoardSkeletonProps {
  columnCount?: number;
  taskCount?: number;
}

export interface ColumnSkeletonProps {
  taskCount?: number;
  columnIndex?: number;
}

export interface FormSkeletonProps {
  type: "board" | "column" | "task";
  columnCount?: number;
  subtaskCount?: number;
  showDescription?: boolean;
  showStatus?: boolean;
  showExistingColumns?: boolean;
}
