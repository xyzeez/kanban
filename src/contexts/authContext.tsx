import { createContext, ReactNode, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

// Configs
import { API } from "../config";

// Types
type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  signup: (
    email: string,
    password: string,
    passwordConfirm: string,
  ) => Promise<void>;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

interface AuthProviderProps {
  children: ReactNode;
}

type CheckAuthResponse = {
  user: {
    id: string;
    email: string;
  };
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

type ErrorResponse = {
  message: string;
  status?: number;
};

// Axios
const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } =
          await axiosInstance.get<CheckAuthResponse>("/users/me");
        setUser({
          id: data.user.id,
          email: data.user.email,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    void checkAuth();
  }, []);

  const signup = async (
    email: string,
    password: string,
    passwordConfirm: string,
  ) => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>(
        "/auth/register",
        {
          email,
          password,
          passwordConfirm,
        },
      );

      return setUser({
        id: data.user.id,
        email: data.user.email,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { response } = error as AxiosError<ErrorResponse>;
        const errorMessage =
          response?.data?.message || "An error occurred during registration";
        throw new Error(errorMessage);
      }
    }
  };

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
        remember,
      });

      setUser({
        id: data.user.id,
        email: data.user.email,
      });
      setIsAuthenticated(true);
      return;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { response } = error as AxiosError<ErrorResponse>;

        if (response?.status === 401) {
          throw new Error("Invalid email or password");
        }

        const errorMessage =
          response?.data?.message || "An error occurred during login";
        throw new Error(errorMessage);
      }

      throw new Error("An unexpected error occurred");
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, axiosInstance };
