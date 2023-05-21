# vite-plugin-vue-routes-generate

[![NPM version](https://img.shields.io/npm/v/vite-plugin-vue-routes-generate?color=black&label=)](https://www.npmjs.com/package/vite-plugin-vue-routes-generate)

# 介绍

这是一个 [Vite](https://vitejs.dev) 插件，它可以从指定目录自动生成 [Vue-Router](https://github.com/vuejs/vue-router) 路由，并支持基于 `RouteMeta` 的布局系统。该插件集成了 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) 和 [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) 的功能，并且省去了 [setupLayouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts#getting-started) 步骤，从而简化了创建和配置 [Vue-Router](https://github.com/vuejs/vue-router) 路由的流程。

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

## 路由生成

默认情况下，插件会自动从 `src/pages` 目录（及其子目录）中搜索 `*.vue` 文件，并生成路由数组。

```
src/pages/
├── index.vue        ⇢  /
├── about.vue        ⇢  /about
├── ThePageName.vue  ⇢  /the-page-name
├── [...all].vue     ⇢  /:pathMatch(.*)*
└── users/
    ├── index.vue    ⇢  /users
    └── [id].vue     ⇢  /users/:id
```

### 索引路由

所有命名为 `index.vue` 的文件，都会被视为索引路由。

- `src/pages/index.vue` ⇢ `/`
- `src/pages/users/index.vue` ⇢ `/users`

### 嵌套路由

当你所定义的 `.vue` 文件与一个文件夹同名时，插件将把它们看作为一个嵌套路由。假设你创建的是 `src/pages/users/index.vue` 和 `src/pages/users.vue` 组件，`src/pages/users/index.vue` 将会在 `src/pages/users.vue` 的 `<RouterView />` 中呈现。

**示例**

```text
src/pages/
├── users/
│   └── index.vue
└── users.vue
```

插件将生成如下数组：

```ts
const routes = [
  {
    path: '/users',
    component: () => import('src/pages/users.vue'),
    children: [
      { path: '', component: () => import('src/pages/users/index.vue') },
    ],
  },
]
```

文件夹名称与文件名称，可以是任意合法的路由名称，像是 `[id]/` 与 `[id].vue`，同样会被看作为嵌套路由。

### 动态路由

你基本上可以像使用 [Vue-Router](https://router.vuejs.org/guide/essentials/dynamic-matching.html) 一样使用动态路由，仅需要用 `[]` 把它包上。

- `src/pages/[id].vue` ⇢ `/:id`
- `src/pages/blog/post-[id].vue` ⇢ `/blog/post-:id`
- `src/pages/blog/post-[categoryId]-[id].vue` ⇢ `/blog/post-:categoryId-:id`
- `src/pages/users/[[id]].vue` ⇢ `/users/:id?`
- `src/pages/blog/[slugs]+.vue` ⇢ `/blog/:slugs+`
- `src/pages/blog/[[slugs]]+.vue` ⇢ `/blog/:slugs*`

### 404 NotFound

在参数名前加 3 个点，就能够捕获 `NotFound` 路由，像是 `src/pages/[...all].vue` 你将得到 `/:all(.*)` 路由。

## `<route>` 标签

默认情况下，`<route>` 标签以 `JSON` 作为语言，但你也可以使用 `JSON5` 及 `YAML`。

```vue
<route>
{
  "meta": {
    "layout": "default"
  }
}
</route>

<route lang="yaml">
meta:
  layout: default
</route>
```

# Route 元数据

插件支持将生成的路由元数据作为数组导出，可用于调试及基于路由的组件开发。

## 如何使用

```ts
import routesMeta from '~routes/meta'

/**
 * RouteMeta
 *
 * [
 *   {
 *     name: 'foo.name',
 *     path: '/foo/:name',
 *     file: '/src/pages/foo/[name].vue',
 *
 * ⇣ -- CustomBlock/Frontmatter -- ⇣
 *
 *     layout: 'default',
 *     title: 'Title',
 *     tags: ['foo', 'bar'],
 *   }
 * ]
 */
console.log(routesMeta)
```


# 插件配置

默认配置下，插件也可以完整的支持 `路由生成` 和 `布局系统`，同时也可以根据需要自定义配置。

```ts
// vite.config.ts
import VueRoutesGenerate from 'vite-plugin-vue-routes-generate'

export default {
  plugins: [
    VueRoutesGenerate(),
  ],
}
```

---

### dirs

- **类型:** `string` | `string[]` | `UserScanDirOption[]`
- **默认:** `src/pages`

routes 导入目录，支持 `globs`。

```ts
// vite.config.ts
import VueRoutesGenerate from 'vite-plugin-vue-routes-generate'

export default {
  plugins: [
    VueRoutesGenerate({
      dirs: [
        // src/pages/about.vue ⇢ /about
        'src/pages',
        // src/docs/intro.vue ⇢ /docs/intro
        { src: 'src/docs', prefix: 'docs/' },
        // src/components/layout/docs/index.md ⇢ /component/layout
        // src/components/layout/docs/summary.md ⇢ /component/layout/summary
        {
          src: 'src/components',
          prefix: 'component/',
          filePattern: '**/docs/**/*.md', // 全局 extensions 将会失效
        },
      ]
    }),
  ],
}
```

<details>
<summary><b>UserScanDirOption 类型定义</b></summary><br>

```ts
export interface UserScanDirOption {
  /**
   * 路由导入文件夹搜索路径
   */
  src: string
  /**
   * 路由路径前缀
   *
   * @default ''
   */
  prefix?: string
  /**
   * 文件过滤条件
   */
  filePattern?: string
}
```
</details>

### defaultLayout

- **类型:** `false` | `string`
- **默认:** `false`

默认布局，缺省值为 `false` 即不使用布局。

### extensions

- **类型:** `string[]`
- **默认:** `['vue']`

文件扩展名，与 `dirs` 配合使用。

### exclude

- **类型:** `string[]`
- **默认:** `['node_modules', '.git', '**/__*__/**']`

全局排除条件

```text
src/pages/
  ├── users/
  │  ├── components
  │  │  └── form.vue // Excluded
  │  ├── [id].vue
  │  └── index.vue
  └── home.vue
```

```ts
// vite.config.ts
import VueRoutesGenerate from 'vite-plugin-vue-routes-generate'

export default {
  plugins: [
    VueRoutesGenerate({
      exclude: ['**/components/*.vue'],
    }),
  ],
}
```

### importMode

- **类型:** `'async'` | `'sync'`
- **默认:** `async`

默认情况下，所有路由都是懒加载的方式导入。

### caseSensitive

- **类型:** `boolean`
- **默认:** `false`

默认情况下，所有路由是不区分大小写的，并且将统一转换为小写字符的路径。

- **caseSensitive: true** 
  - `src/pages/The-Route-Name.vue` ⇢ `/The-Route-Name`
- **caseSensitive: false** 
  - `src/pages/The-Route-Name.vue` ⇢ `/the-route-name`

### routeBlockLang

- **类型:** `'json5'` | `'json'` | `'yaml'` | `'yml'`
- **默认:** `json`
s
---

[LICENSE (MIT)](/LICENSE)
