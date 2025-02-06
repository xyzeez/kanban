import { FC } from "react";

// Components
import Skeleton from "../../components/Skeleton";

const ViewTaskSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-6 font-sans text-grey-500/50">
      {/* Title */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Description */}
      <Skeleton className="h-16 w-full" />

      {/* Subtasks */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-[4px]" />
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-[4px]" />
      </div>
    </div>
  );
};

export default ViewTaskSkeleton;
