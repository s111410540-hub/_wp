import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'server') {
    return {
      build: {
        outDir: 'dist',
        lib: {
          entry: 'server/index.ts',
          formats: ['es'],
          fileName: () => '_worker.js',
        },
        emptyOutDir: false, // Keep the frontend files
      },
    }
  }
  return {
    plugins: [
      react(),
      devServer({
        entry: 'server/index.ts',
        exclude: [
          /^\/@.+$/,
          /.*\.(ts|tsx|vue)($|\?)/,
          /.*\.(s?css|less)($|\?)/,
          /^\/favicon\.ico$/,
          /.*\.(svg|png)($|\?)/,
          /^\/(src|node_modules)\/.*/,
        ],
        injectClientScript: false,
      })
    ],
  }
})
