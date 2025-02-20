/// <reference types="node" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT),
      strictPort: true,
      open: true,
      host: true,
    },
    preview: {
      port: parseInt(env.VITE_PORT),
      strictPort: true,
      open: true,
    },
  };
});
