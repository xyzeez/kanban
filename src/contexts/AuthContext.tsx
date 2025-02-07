import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Services
import { authService } from "../services/authService";

// Types
import {
  AuthContextType,
  AuthProviderProps,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/contexts";

// Utils
import { getErrorMessage } from "../utils/error";

// Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      setUser(null);
      if (error instanceof Error) {
        if (!error.message.includes("401")) {
          toast.error(getErrorMessage(error));
          console.error("Auth check failed:", error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const register = async (data: RegisterData) => {
    const { user } = await authService.register(data);
    setUser(user);
  };

  const login = async (credentials: LoginCredentials) => {
    const { user } = await authService.login(credentials);
    setUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
