---
title: Dynamic Routes
layout: default
---

# 动态路由

## 路由生成

默认情况下，插件会自动从 `src/pages` 目录（及其子目录）中搜索 `*.vue` 文件，并生成路由数组。

```
src/pages/
├── index.vue        ⇢  /
├── about.vue        ⇢  /about
├── ThePageName.vue  ⇢  /thepagename
├── [...all].vue     ⇢  /:all(.*)*
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