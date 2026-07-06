import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/us/',
  plugins: [vue()],
  build: {
    outDir: 'docs'
  }
})
