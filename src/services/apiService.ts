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
    // Handle authentication errors
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      window.location.href = "/login";
    }

    // Handle network errors
    if (!error.response) {
      // Redirect to login if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

      if (error.code === "ERR_NETWORK") {
        return Promise.reject(
          new Error(
            "Unable to connect to server. Please check your internet connection and try again.",
          ),
        );
      }
      return Promise.reject(
        new Error("A network error occurred. Please try again later."),
      );
    }

    // Handle other API errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject(new Error(errorMessage));
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
