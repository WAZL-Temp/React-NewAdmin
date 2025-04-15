import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    }
  },

})
