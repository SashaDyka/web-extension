import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'index.html',
        // background: 'src/background/background.ts',
        // content: 'src/content/content.ts',
      },
    },
  },
})
