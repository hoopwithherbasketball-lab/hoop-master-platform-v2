import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  resolve: {
    alias: {
      'react-router-dom': resolve(__dirname, 'node_modules/react-router-dom'),
      'react-router': resolve(__dirname, 'node_modules/react-router'),
      '@remix-run/router': resolve(__dirname, 'node_modules/@remix-run/router'),
    },
  },
})