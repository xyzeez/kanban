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
