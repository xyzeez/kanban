import { FC } from "react";

// Assets
import MobileLogo from "../assets/logo-mobile.svg";
// import LogoLight from "../assets/logo-light.svg";
import LogoDark from "../assets/logo-dark.svg";

const Logo: FC = () => {
  return (
    <div className="flex max-w-[153px] flex-row items-center gap-4">
      <img src={MobileLogo} alt="Kanban Logo" className="md:hidden" />
      <img src={LogoDark} alt="Kanban Logo" className="hidden md:block" />
    </div>
  );
};

export default Logo;
