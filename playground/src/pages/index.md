---
title: About
layout: default
---

# 介绍

这是一个 [Vite](https://vitejs.dev) 插件，它可以从指定目录自动生成 [Vue-Router](https://github.com/vuejs/vue-router) 路由，并支持基于 `RouteMeta` 的布局系统。该插件集成了 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) 和 [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) 的功能，并且省去了 [setupLayouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts#getting-started) 步骤，从而简化了创建和配置 [Vue-Router](https://github.com/vuejs/vue-router) 路由的流程。

---

## 开始安装

```bash
# pnpm
pnpm add -D vite-plugin-vue-routes-generate

# yarn
yarn add -D vite-plugin-vue-routes-generate

# npm
npm i -D vite-plugin-vue-routes-generate
```

## 如何使用

仅需要简单的配置 `vite-plugin-vue-routes-generate` 就可以开始工作了。

### vite.config.ts

```ts
import { defineConfig } from 'vite'
import VueRoutesGenerate from 'vite-plugin-vue-routes-generate'

export default defineConfig({
  plugins: [
    VueRoutesGenerate({
      extensions: ['vue', 'md'],
      dirs: [
        'src/pages',
        'src/layouts',
      ],
    })
  ]
})
```

### main.ts

```ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import routes from '~routes'

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.VITE_ROOT_PATH),
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

createApp(App).use(router).mount('#app')
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-vue-routes-generate/client"]
  }
}
```

---

## ⛺️ 声明布局

在任意插件能够找到的文件中作出以下声明，插件就会将它视为布局。

```vue
<template>
  <h1>
    [Default Layout]
  </h1>
  <RouterView />
</template>

<route lang="yaml">
layout: true
</route>
```