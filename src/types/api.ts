import { AxiosRequestConfig } from "axios";

interface ApiResponse<T = unknown> {
  status: string;
  data: T | null;
  message?: string;
}

export interface ApiService {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  post: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
  patch: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
  delete: <T>(
    url: string,
    config?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T>>;
}
