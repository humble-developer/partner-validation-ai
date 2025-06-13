import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    vue(),
    mode === 'development' &&
    // Copy index.html to 200.html for SPA routing support
    copy({
      targets: [
        {
          src: 'dist/index.html',
          dest: 'dist/',
          rename: '200.html'
        }
      ],
      hook: 'writeBundle'
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
