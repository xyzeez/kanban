// Assets
import MobileLogo from "../assets/logo-mobile.svg";
import LogoLight from "../assets/logo-light.svg";
import LogoDark from "../assets/logo-dark.svg";

// Hooks
import { useApp } from "../hooks/useApp";

// Contexts

// Types
type LogoProps = {
  full?: boolean;
};

const Logo = ({ full = false }: LogoProps) => {
  const { theme } = useApp();
  const logoSrc = theme === "dark" ? LogoLight : LogoDark;

  return (
    <div className="flex max-w-[153px] flex-row items-center gap-4">
      {full ? (
        <img src={logoSrc} alt="Kanban Logo" className="block" />
      ) : (
        <>
          <img src={MobileLogo} alt="Kanban Logo" className="md:hidden" />
          <img src={logoSrc} alt="Kanban Logo" className="hidden md:block" />
        </>
      )}
    </div>
  );
};

export default Logo;
