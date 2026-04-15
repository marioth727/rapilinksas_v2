import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion'))              return 'vendor-framer'
            if (id.includes('jspdf'))                      return 'vendor-pdf'
            if (id.includes('@supabase'))                  return 'vendor-supabase'
            if (id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('/react/'))                    return 'vendor-react'
          }
        },
      },
    },
  },
})
