import { FC } from "react";
import { Toaster as HotToaster } from "react-hot-toast";

// Hooks
import { useApp } from "../hooks/useApp";

const Toaster: FC = () => {
  const { theme } = useApp();
  const isDark = theme === "dark";

  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        className: "font-sans",
        duration: 4000,
        style: {
          maxWidth: "500px",
          margin: "0 auto",
          background: isDark ? "#2B2C37" : "#fff",
          color: isDark ? "#fff" : "#000112",
          border: isDark ? "1px solid #3E3F4E" : "1px solid #828FA340",
        },
        success: {
          iconTheme: {
            primary: "#635FC7",
            secondary: isDark ? "#2B2C37" : "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#EA5555",
            secondary: isDark ? "#2B2C37" : "#fff",
          },
        },
      }}
    />
  );
};

export default Toaster;
