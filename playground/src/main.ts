import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import routes from '~routes'
import routesMeta from '~routes/meta'

import '@unocss/reset/tailwind.css'
import 'uno.css'

// eslint-disable-next-line no-console
console.log(routes)

// eslint-disable-next-line no-console
console.log(routesMeta)

const head = createHead()

const router = createRouter({
  routes,
  history: createWebHistory(),
})

createApp(App).use(router).use(head).mount('#app')
