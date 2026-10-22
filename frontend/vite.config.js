import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // For /listings and /bookings:
      // - Browser navigation (Accept: text/html) → serve React app (bypass)
      // - API fetch from React components (Accept: application/json) → proxy to Express
      '/listings': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
            return req.url;
          }
        }
      },
      '/bookings': {
        target: 'http://localhost:3000',
        bypass: (req) => {
          if (req.method === 'GET' && req.headers.accept?.includes('text/html')) {
            return req.url;
          }
        }
      },
      // Only proxy POST to backend; GET requests serve the React app (fixes refresh black screen)
      '/login': {
        target: 'http://localhost:3000',
        bypass: (req) => { if (req.method === 'GET') return req.url; }
      },
      '/signup': {
        target: 'http://localhost:3000',
        bypass: (req) => { if (req.method === 'GET') return req.url; }
      },
      '/logout': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
    }
  }
})

