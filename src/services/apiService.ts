import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Config
import { API } from "../config";

// Types
import { ApiResponse, ApiService, ErrorResponse } from "../types/api";

// Axios Instance
const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(
      new Error(error.response?.data?.message || error.message),
    );
  },
);

// API Service Factory
export const apiService = (baseEndpoint: string): ApiService => {
  const endpoint = baseEndpoint.startsWith("/")
    ? baseEndpoint.slice(1)
    : baseEndpoint;

  const constructUrl = (path?: string) => {
    if (!path) return `/${endpoint}`;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${endpoint}${cleanPath}`;
  };

  return {
    get: async <T>(path?: string, config?: AxiosRequestConfig) => {
      const response = await axiosInstance.get<ApiResponse<T>>(
        constructUrl(path),
        config,
      );
      return response.data;
    },
    post: async <T, D = unknown>(
      path?: string,
      data?: D,
      config?: AxiosRequestConfig,
    ) => {
      const response = await axiosInstance.post<ApiResponse<T>>(
        constructUrl(path),
        data,
        config,
      );
      return response.data;
    },
    patch: async <T, D = unknown>(
      path?: string,
      data?: D,
      config?: AxiosRequestConfig,
    ) => {
      const response = await axiosInstance.patch<ApiResponse<T>>(
        constructUrl(path),
        data,
        config,
      );
      return response.data;
    },
    delete: async <T>(path?: string, config?: AxiosRequestConfig) => {
      const response = await axiosInstance.delete<ApiResponse<T>>(
        constructUrl(path),
        config,
      );
      return response.data;
    },
  };
};
