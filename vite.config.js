import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: enable React plugin with automatic JSX runtime.
// This avoids the need to import React in every file when using JSX.
export default defineConfig({
  plugins: [
    react({
      // automatic runtime uses `react/jsx-runtime` helpers
      jsxRuntime: 'automatic'
    })
  ]
})
