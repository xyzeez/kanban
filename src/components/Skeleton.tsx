import { FC } from "react";

// Types
import { SkeletonProps } from "../types/components";

// Utils
import { cn } from "../utils/styles";

const Skeleton: FC<SkeletonProps> = ({ className }) => {
  return <div className={cn("animate-pulse rounded bg-current", className)} />;
};

export default Skeleton;
