import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Plugin from '[name]'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), Plugin()]
})
