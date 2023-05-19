import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRoutesGenerate from 'vite-plugin-vue-routes-generate'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    VueRoutesGenerate({
      dirs: [
        'src/pages',
        'src/layouts',
      ],
      extensions: ['vue', 'md', 'page.vue'],
    }),
  ],
})
