import { createApp } from 'vue'
import routes from 'virtual:generated-routes'
import App from './app.vue'

const app = createApp(App)

// eslint-disable-next-line no-console
console.log(routes)

app.mount('#app')
