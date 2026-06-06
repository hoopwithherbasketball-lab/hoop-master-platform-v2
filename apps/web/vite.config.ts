import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const readEnvTxt = (filePath: string): Record<string, string> => {
  if (!existsSync(filePath)) {
    return {}
  }

  return readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce<Record<string, string>>((acc, line) => {
      const separatorIndex = line.indexOf('=')
      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()

      if (key.startsWith('VITE_') && key.length > 5) {
        acc[key] = value
      }

      return acc
    }, {})
}

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), '')
  // Also try loading from repo root in case cwd is apps/web/
  const rootEnv = loadEnv(mode, resolve(__dirname, '../..'), '')
  const rootEnvTxt = readEnvTxt(resolve(__dirname, '../../.env.txt'))

  const supabaseUrl = loadedEnv.VITE_SUPABASE_URL || rootEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || rootEnvTxt.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = loadedEnv.VITE_SUPABASE_ANON_KEY || rootEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || rootEnvTxt.VITE_SUPABASE_ANON_KEY || ''

  return {
    plugins: [react()],
    appType: 'spa',
    server: {
      port: 5173,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  }
})