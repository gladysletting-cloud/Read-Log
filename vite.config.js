import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTest.js',
    coverage:{
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/setupTests.js',
        'src/services/firebase.js',
        'src/**/*.test.{js,jsx}',
      ],
    },
  },
})
