// Services
import { apiService } from "./apiService";

// Types
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/contexts";

// API Service
export const authAPI = apiService("auth");

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authAPI.post<AuthResponse>("/register", data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authAPI.post<AuthResponse>("/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await authAPI.post("/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await authAPI.get<{ user: User }>("/me");
    return response.data.user;
  },
};
