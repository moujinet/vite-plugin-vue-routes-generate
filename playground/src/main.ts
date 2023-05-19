import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-routes'
import App from './app.vue'

// eslint-disable-next-line no-console
console.log(routes)

const router = createRouter({
  routes,
  history: createWebHistory(),
})

createApp(App).use(router).mount('#app')
