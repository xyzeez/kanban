import { ReactNode } from "react";

export type Theme = "light" | "dark";

export interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  openSideBar: boolean;
  toggleSidebar: (state: boolean) => void;
  openMobileNav: boolean;
  toggleMobileNav: (state?: boolean) => void;
  openBoardOptions: boolean;
  toggleBoardOptions: (state?: boolean) => void;
}

export interface AppProviderProps {
  children: ReactNode;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  passwordConfirm: string;
}

export type ModalElement = ReactNode | null;

export interface ModalContextType {
  setModalElement: (element: ReactNode) => void;
}

export interface ModalProviderProps {
  children: ReactNode;
}
