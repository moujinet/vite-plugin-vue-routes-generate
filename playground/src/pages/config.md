---
title: Config
layout: default
---

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
