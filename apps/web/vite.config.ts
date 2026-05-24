import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  resolve: {
    alias: {
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      'react-router': path.resolve(__dirname, 'node_modules/react-router'),
      '@remix-run/router': path.resolve(__dirname, 'node_modules/@remix-run/router'),
    },
  },
})