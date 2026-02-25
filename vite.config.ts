import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessary for Docker to map localhost
    port: 5173,
    watch: {
      usePolling: true, // Crucial for Docker file watching
    },
  },
})
