---
title: RouteMeta
layout: default
---

# Route 元数据

插件支持将生成的路由元数据作为数组导出，可用于调试及基于路由的组件开发。

## 如何使用

```ts
import routesMeta from '~routes/meta'
```

## RouteMeta

默认情况下，`RouteMeta` 仅包含 `name`, `path`, `file` 三项内容。

当定义了 `<route></route>` 或使用 `Markdown` 文件定义 `Frontmatter`，则会将 `meta` 中的内容解构后合并到 `RouteMeta` 中。

```json
[
  {
    "name": "foo.name",
    "path": "/foo/:name",
    "file": "/src/pages/foo/[name].vue",
    // ⇣ -- CustomBlock/Frontmatter -- ⇣
    "layout": "default",
    "title": "Title",
    "tags": ["foo", "bar"]
  }
]
```
