import { FC } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

// Hooks
import { useAuth } from "../../../hooks/useAuth";

// Components
import { LogoutIcon } from "../../../components/Icons";

// Utils
import { getErrorMessage } from "../../../utils/error";

const LogoutButton: FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out!");
      void navigate("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-fit flex-row items-center gap-[10px] font-sans text-base font-bold text-red"
      aria-label="Logout"
    >
      <LogoutIcon className="size-5" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
