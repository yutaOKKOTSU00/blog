import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    // Alias "@" → "src/" pour éviter les "../../../" en cascade
    alias: { '@': path.resolve(__dirname, './src') },
  },

  server: {
    port: 5173,
    // Proxy vers l'API Express en dev pour éviter les problèmes CORS
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },

  build: {
    // Découper le bundle : vendor React séparé du reste (meilleur cache)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query:  ['@tanstack/react-query'],
        },
      },
    },
  },
})
