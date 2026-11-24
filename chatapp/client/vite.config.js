import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, the React app runs on :5173 and forwards socket.io traffic to the
// backend on :8080, so the backend needs no CORS changes.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/socket.io": { target: "http://localhost:8080", ws: true, changeOrigin: true },
    },
  },
});
