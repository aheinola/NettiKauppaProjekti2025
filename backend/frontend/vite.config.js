import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Fallback all 404s to index.html:
    fs: {
      strict: false,
    },
  },
});

