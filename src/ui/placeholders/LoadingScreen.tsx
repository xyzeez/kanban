import { FC } from "react";

// Components
import { LoaderIcon } from "../../components/Icons";

// Types
import { LoadingProps } from "../../types/placeholders";

const LoadingScreen: FC<LoadingProps> = ({ type }) => {
  return (
    <div className="grid min-h-screen place-content-center bg-grey-100 p-4 transition-colors dark:bg-grey-900">
      <div className="flex flex-col items-center gap-4 text-center text-purple">
        <LoaderIcon />
        {type === "App" && (
          <p className="font-sans text-2xl font-semibold text-grey-500">
            Just a moment, we&apos;re getting things ready
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
