export const API = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_API
  : import.meta.env.VITE_PROD_API;
