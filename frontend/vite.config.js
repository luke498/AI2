import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/submit': 'http://localhost:4000',
      '/history': 'http://localhost:4000',
      '/feedback': 'http://localhost:4000',
      '/save': 'http://localhost:4000',
      '/draft': 'http://localhost:4000',
      '/profile': 'http://localhost:4000',
      '/health': 'http://localhost:4000'
    }
  }
});
