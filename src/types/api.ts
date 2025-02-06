import { AxiosRequestConfig } from "axios";

export interface ApiResponse<T = unknown> {
  status: string;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  message: string;
}

export interface ApiService {
  get: <T>(
    path?: string,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
  post: <T, D = unknown>(
    path?: string,
    data?: D,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
  patch: <T, D = unknown>(
    path?: string,
    data?: D,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
  delete: <T>(
    path?: string,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
}
