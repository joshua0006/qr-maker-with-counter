import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /\/redirect\/.*/, to: '/index.html' }
      ]
    }
  }
})
