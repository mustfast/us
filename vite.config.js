import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/us/',
  plugins: [vue()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        gu: fileURLToPath(new URL('./gu/index.html', import.meta.url)),
        library: fileURLToPath(new URL('./library/index.html', import.meta.url)),
        liuliming: fileURLToPath(new URL('./us/liuliming/index.html', import.meta.url)),
        guyiming: fileURLToPath(new URL('./us/guyiming/index.html', import.meta.url)),
        daipeifei: fileURLToPath(new URL('./us/daipeifei/index.html', import.meta.url))
      }
    }
  }
})
