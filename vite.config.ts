import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path aliases - import kısayolları
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },

  // Development server settings
  server: {
    port: 3000,
    open: true, // Otomatik browser açma
    
    // Backend proxy - CORS sorunlarını önlemek için
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend port'unuz (muhtemelen 3001)
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build settings
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // Chunk optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['axios'],
        },
      },
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});