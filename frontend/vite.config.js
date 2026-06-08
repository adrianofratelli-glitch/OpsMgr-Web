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
  // Pré-otimiza TODAS as deps LeafyGreen no startup, evitando o reload/tela-branca
  // que acontece quando o Vite descobre novas deps ao navegar entre páginas.
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'axios',
      '@leafygreen-ui/badge',
      '@leafygreen-ui/banner',
      '@leafygreen-ui/button',
      '@leafygreen-ui/card',
      '@leafygreen-ui/confirmation-modal',
      '@leafygreen-ui/emotion',
      '@leafygreen-ui/icon',
      '@leafygreen-ui/icon-button',
      '@leafygreen-ui/leafygreen-provider',
      '@leafygreen-ui/lib',
      '@leafygreen-ui/loading-indicator',
      '@leafygreen-ui/menu',
      '@leafygreen-ui/modal',
      '@leafygreen-ui/palette',
      '@leafygreen-ui/select',
      '@leafygreen-ui/side-nav',
      '@leafygreen-ui/table',
      '@leafygreen-ui/tabs',
      '@leafygreen-ui/text-input',
      '@leafygreen-ui/toast',
      '@leafygreen-ui/toggle',
      '@leafygreen-ui/tokens',
      '@leafygreen-ui/typography',
      '@lg-charts/core',
    ],
  },
})
