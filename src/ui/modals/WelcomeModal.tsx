import { FC } from "react";
import { useApp } from "../../hooks/useApp";

const WelcomeModal: FC = () => {
  const { closeModal } = useApp();

  return (
    <div className="flex flex-col gap-6 font-sans">
      <h2 className="text-lg font-bold text-purple">Welcome to Kanban!</h2>
      <p className="text-sm font-medium text-grey-500">
        Welcome to our Kanban board application! You can use a dummy email
        address to register as this is a demo application. Your data will be
        stored on our servers but may be periodically cleared.
      </p>
      <button onClick={closeModal} className="btn btn-primary btn-small">
        Got it!
      </button>
    </div>
  );
};

export default WelcomeModal;
