import { FC } from "react";

// Hooks
import { useApp } from "../../../hooks/useApp";

// Components
import { PlusIcon } from "../../../components/Icons";

// UIs
import { CreateBoardForm } from "../../forms/BoardForms";

const CreateBoardButton: FC = () => {
  const { openModal, toggleMobileNav } = useApp();

  return (
    <button
      onClick={() => {
        toggleMobileNav(false);
        openModal(<CreateBoardForm />);
      }}
      className="text-btn font-bold text-purple"
    >
      <PlusIcon />
      Create New Board
    </button>
  );
};

export default CreateBoardButton;
