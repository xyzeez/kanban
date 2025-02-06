import { FC } from "react";

// Components
import { SpinnerIcon } from "../../components/Icons";

const LoadingModal: FC = () => {
  return (
    <div className="flex aspect-video h-full w-full items-center justify-center text-purple">
      <SpinnerIcon size={48} />
    </div>
  );
};

export default LoadingModal;
