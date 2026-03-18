import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Import the plugin

export default defineConfig({
  plugins: [
    tailwindcss(), // 2. Add it BEFORE react()
    react(),
  ],
})