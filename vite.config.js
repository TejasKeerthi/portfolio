import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@react-three/drei') || id.includes('@react-three/postprocessing')) {
            return 'three-drei'
          }

          if (id.includes('@react-three/fiber')) {
            return 'three-fiber'
          }

          if (id.includes('node_modules/three') || id.includes('three-stdlib')) {
            return 'three-core'
          }

          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor'
          }

          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
})
