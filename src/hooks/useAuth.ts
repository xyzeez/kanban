import { useContext } from "react";

// Contexts
import { AuthContext } from "../contexts/AuthContext";

// Types
import { AuthContextType } from "../types/contexts";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
