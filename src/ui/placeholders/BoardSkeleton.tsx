import { FC } from "react";

// Components
import Skeleton from "../../components/Skeleton";

// Types
import {
  BoardSkeletonProps,
  ColumnSkeletonProps,
} from "../../types/placeholders";

// Utils
import { cn } from "../../utils";

const TaskSkeleton: FC = () => (
  <div className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-6 text-grey-500/25 shadow-md shadow-[#364E7E1A] transition-colors dark:bg-grey-800 dark:text-grey-700">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

const ColumnSkeleton: FC<ColumnSkeletonProps> = ({
  taskCount = 5,
  columnIndex,
}) => (
  <li
    key={columnIndex}
    className={cn(
      "no-scrollbar flex shrink-0 grow-0 basis-[280px] flex-col",
      columnIndex && columnIndex >= 2 && "hidden sm:block",
    )}
  >
    <div className="column-header-bg sticky top-0 flex flex-row items-center gap-3 pb-6 font-sans text-xs font-bold uppercase tracking-[2.4px] text-grey-500/30 dark:text-grey-700">
      <Skeleton className="block size-4 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
    <ul className="flex h-full flex-col gap-5 pt-6">
      {Array.from({ length: taskCount }, (_, index) => (
        <li key={index}>
          <TaskSkeleton />
        </li>
      ))}
    </ul>
  </li>
);

const BoardSkeleton: FC<BoardSkeletonProps> = ({ columnCount = 5 }) => {
  return (
    <ul className="no-scrollbar flex flex-row items-stretch justify-stretch gap-6 overflow-hidden px-4 py-6">
      {Array.from({ length: columnCount }, (_, index) => (
        <ColumnSkeleton key={index} columnIndex={index} />
      ))}
    </ul>
  );
};

export default BoardSkeleton;
