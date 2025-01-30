import axios from "axios";

// Config
import { API } from "../config";

// Types
import { ApiService } from "../types/api";

// Axios Instance
const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
});

// API Methods
export const apiService: ApiService = {
  get: (url, config) => {
    return axiosInstance.get(url, config);
  },
  post: (url, data, config) => {
    return axiosInstance.post(url, data, config);
  },
  patch: (url, data, config) => {
    return axiosInstance.patch(url, data, config);
  },
  delete: (url, config) => {
    return axiosInstance.delete(url, config);
  },
};
