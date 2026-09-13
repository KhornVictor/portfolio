import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    // Forward API calls to the Express backend during development so the
    // frontend can use relative URLs and avoid CORS.
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
});
