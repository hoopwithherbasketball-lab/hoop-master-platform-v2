import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  resolve: {
    alias: {
      '@hoop-master/features': path.resolve(__dirname, '../../packages/features/src'),
    },
  },
})