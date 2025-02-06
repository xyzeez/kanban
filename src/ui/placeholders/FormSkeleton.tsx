import { FC } from "react";

// Components
import Skeleton from "../../components/Skeleton";

// Types
import { FormSkeletonProps } from "../../types/placeholders";

const FormSkeleton: FC<FormSkeletonProps> = ({
  type,
  columnCount = 3,
  subtaskCount = 3,
  showDescription = true,
  showStatus = true,
  showExistingColumns = false,
}) => {
  return (
    <div className="flex flex-col gap-6 font-sans text-grey-500/50">
      {/* Form Title */}
      <Skeleton className="h-7 w-32" />

      {/* Title/Name Input */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-[4px]" />
      </div>

      {/* Description - For tasks */}
      {type === "task" && showDescription && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-28 w-full rounded-[4px]" />
        </div>
      )}

      {/* Columns Section - For board forms */}
      {type === "board" && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-col gap-3">
            {/* Show existing columns if needed */}
            {showExistingColumns && (
              <div className="flex flex-col gap-3 border-b border-grey-500/25 pb-3">
                {Array.from({ length: columnCount }, (_, i) => (
                  <div
                    key={`existing-${i}`}
                    className="flex items-center gap-4"
                  >
                    <Skeleton className="h-10 w-full rounded-[4px]" />
                  </div>
                ))}
              </div>
            )}
            {/* New column inputs */}
            {Array.from(
              { length: showExistingColumns ? 1 : columnCount },
              (_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-full rounded-[4px]" />
                  <Skeleton className="h-6 w-6" />
                </div>
              ),
            )}
            <Skeleton className="h-10 w-full max-w-[174px] rounded-[4px]" />
          </div>
        </div>
      )}

      {/* Subtasks Section - For task forms */}
      {type === "task" && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: subtaskCount }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-full rounded-[4px]" />
                <Skeleton className="h-6 w-6" />
              </div>
            ))}
            <Skeleton className="h-10 w-full max-w-[174px] rounded-[4px]" />
          </div>
        </div>
      )}

      {/* Status Dropdown - For tasks */}
      {showStatus && (type === "task" || type === "column") && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-[4px]" />
        </div>
      )}

      {/* Submit Button */}
      <Skeleton className="h-10 w-full rounded-[4px]" />
    </div>
  );
};

export default FormSkeleton;
