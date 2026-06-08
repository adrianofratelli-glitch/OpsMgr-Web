import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Em dev, /api é redirecionado para o backend FastAPI (porta 8077).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5191,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8077',
    },
  },
})
