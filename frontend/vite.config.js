import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: 'ws',
    },
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2019',
    modulePreload: { polyfill: true },
    reportCompressedSize: false,
  },
  esbuild:
    mode === 'production'
      ? {
          drop: ['console', 'debugger'],
          legalComments: 'none',
        }
      : undefined,
}))
