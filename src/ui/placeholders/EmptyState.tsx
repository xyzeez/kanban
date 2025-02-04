import { FC } from "react";

// Components
import { PlusIcon } from "../../components/Icons";

// Types
import { EmptyStateProps } from "../../types/placeholders";

// Content
const content = {
  board: {
    message:
      "You don't have any boards yet. Click on 'Create New Board' on the navigation menu to get started.",
    action: "Create New Board",
  },
  column: {
    message: "This board is empty. Create a new column to get started.",
    action: "Add New Column",
  },
};

const EmptyState: FC<EmptyStateProps> = ({ type, actionHandler }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-4">
      <p className="text-center text-lg font-bold text-grey-500">
        {content[type].message}
      </p>
      {actionHandler && (
        <button
          onClick={actionHandler}
          className="btn btn-primary enabled:hover:bg-purple-600 btn-large"
        >
          <PlusIcon className="h-5 w-5" />
          {content[type].action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
