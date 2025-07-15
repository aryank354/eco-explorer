import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src"),

    },
  },
  server: {
  proxy: {
    '/api': 'http://localhost:3001',
  },
  allowedHosts: ['32be97f7bbbf.ngrok-free.app'], // Replace with your actual ngrok domain

}

})