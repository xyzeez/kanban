// Services
import { apiService } from "./axios";

// Types
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/contexts";

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      "/auth/register",
      data,
    );
    if (!response.data) throw new Error("Registration failed");
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    if (!response.data) throw new Error("Login failed");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiService.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiService.get<{ user: User }>("/auth/me");
    if (!response.data?.user) throw new Error("Failed to get user");
    return response.data.user;
  },
};
