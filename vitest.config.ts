/// <reference types="vitest" />
import path from 'path';
import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
  }),
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  } as any)
)
