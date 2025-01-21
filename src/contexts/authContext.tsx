import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } =
          await axiosInstance.get<CheckAuthResponse>("/users/me");
        return setUser({
          id: data.user.id,
          email: data.user.email,
        });
      } catch (error) {
        console.log(error);
        setUser(null);
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
      if (axios.isAxiosError(error)) {
        const { response } = error as AxiosError<ErrorResponse>;

        if (response?.status === 401) {
          throw new Error("Invalid email or password");
        }

        const errorMessage =
          response?.data?.message || "An error occurred during registration";
        throw new Error(errorMessage);
      }

      throw new Error("An unexpected error occurred");
    }
  };

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
        remember,
      });

      return setUser({
        id: data.user.id,
        email: data.user.email,
      });
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
