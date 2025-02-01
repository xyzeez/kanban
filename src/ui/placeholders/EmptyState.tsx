import { FC } from "react";

// Types
import { EmptyStateProps } from "../../types/placeholders";

// Content
const content = {
  board: {
    message: "This board is empty. Create a new column to get started.",
    action: "+ Add New Column",
  },
  column: {
    message: "No tasks yet. Add a task to get started.",
    action: "+ Add New Task",
  },
};

const EmptyState: FC<EmptyStateProps> = ({ type }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <p className="text-gray-400 mb-4">{content[type].message}</p>
      <button className="bg-purple-500 enabled:hover:bg-purple-600 rounded-lg px-4 py-2">
        {content[type].action}
      </button>
    </div>
  );
};

export default EmptyState;
