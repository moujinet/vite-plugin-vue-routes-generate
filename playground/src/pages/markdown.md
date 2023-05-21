---
title: Markdown
layout: default
---

# Markdown

插件自身是不支持 `Markdown` 解析的，尽管插件确实解析了 `Markdown` 文件，不过是为了从 `Frontmatter` 中获取 `RouteMeta`。

如果需要支持 `Markdown` 文件，请安装相关 Vite 插件:

- [vite-plugin-vue-markdown](https://github.com/mdit-vue/vite-plugin-vue-markdown)
- [vite-plugin-md](https://github.com/antfu/vite-plugin-md)

---

## Vue Component

<CodeBlock />

## Highlight

```typescript
export function parseRoutePath(routePath: string) {
  let path = routePath

  // /[...name] -> /:name(.*)*
  path = replaceWithRegex(/\[\.{3}(\w+)\]/, path, ':$1(.*)*')
  // /[[name]]+ -> /:name*
  path = replaceWithRegex(/\[{2,}(\w+)\]{2,}\+/, path, ':$1*')
  // /[[name]] -> /:name?
  path = replaceWithRegex(/\[{2,}(\w+)\]{2,}/, path, ':$1?')
  // /[name] -> /:name
  path = replaceWithRegex(/\[{1,}(\w+)\]{1,}/g, path, ':$1')
  // /index -> /
  path = path.replace(/\/index$/, '/')

  return trimSlash(path, 'right', true)
}
```