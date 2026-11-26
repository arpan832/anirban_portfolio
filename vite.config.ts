import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['.e2b.app', 'localhost'],
  },
  preview: {
    host: true,
    allowedHosts: ['.e2b.app', 'localhost'],
  },
})
